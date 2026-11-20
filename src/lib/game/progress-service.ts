"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { GameError, ErrorCodes } from "@/lib/errors";
import {
  isValidStageNumber,
  getStageState,
} from "@/lib/game/stage-state";
import {
  ProgressSummary,
  StageWithState,
  FoundFragment,
  FoundQrCode,
} from "@/types/game";

export async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new GameError(
      ErrorCodes.UNAUTHORIZED,
      "Usuario no autenticado",
      401
    );
  }

  return data.user.id;
}

export async function initializeProgress(userId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("player_progress")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return;
  }

  const { error } = await supabase.rpc("initialize_player_progress", {
    p_user_id: userId,
  });

  if (error) {
    // Puede fallar por carrera; si ya existe, ignorar
    const { data: checkAgain } = await supabase
      .from("player_progress")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!checkAgain) {
      throw new GameError(
        ErrorCodes.INTERNAL_ERROR,
        `No se pudo inicializar el progreso: ${error.message}`,
        500
      );
    }
  }
}

export async function markTutorialCompleted(userId: string): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("player_progress")
    .update({ tutorial_completed_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `No se pudo marcar el tutorial: ${error.message}`,
      500
    );
  }
}

export async function getProgressSummary(
  userId: string
): Promise<ProgressSummary> {
  const supabase = createServiceClient();

  const { data: playerProgress, error: playerError } = await supabase
    .from("player_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (playerError || !playerProgress) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se encontró progreso del jugador",
      500
    );
  }

  const { data: stages, error: stagesError } = await supabase
    .from("game_stages")
    .select("*")
    .order("stage_number", { ascending: true });

  if (stagesError || !stages) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se pudieron cargar las etapas",
      500
    );
  }

  const { data: stageProgressList, error: progressError } = await supabase
    .from("stage_progress")
    .select("*")
    .eq("user_id", userId);

  if (progressError || !stageProgressList) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se pudo cargar el progreso de etapas",
      500
    );
  }

  const { data: fragments, error: fragmentsError } = await supabase
    .from("found_fragments")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: true });

  if (fragmentsError || !fragments) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se pudieron cargar los fragmentos",
      500
    );
  }

  const { data: qrCodes, error: qrError } = await supabase
    .from("found_qr_codes")
    .select("*")
    .eq("user_id", userId)
    .order("scanned_at", { ascending: true });

  if (qrError || !qrCodes) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se pudieron cargar los códigos QR",
      500
    );
  }

  const progressByStageId = new Map(stageProgressList.map((p) => [p.stage_id, p]));
  const stageNumberById = new Map(stages.map((s) => [s.id, s.stage_number]));

  const stagesWithState: StageWithState[] = stages.map((stage) => {
    const progress = progressByStageId.get(stage.id) ?? null;
    return {
      ...stage,
      state: getStageState(
        stage.stage_number,
        playerProgress.current_stage,
        progress
      ),
      answer_solved: progress?.answer_solved ?? false,
      qr_scanned: progress?.qr_scanned ?? false,
      hints_used: progress?.hints_used ?? 0,
    };
  });

  return {
    current_stage: playerProgress.current_stage,
    game_completed: playerProgress.game_completed,
    tutorial_completed_at: playerProgress.tutorial_completed_at,
    hints_used: playerProgress.hints_used ?? 0,
    stages: stagesWithState,
    fragments: (fragments ?? []).map((f) => ({
      ...f,
      stage_number: stageNumberById.get(f.stage_id) ?? 0,
    })) as FoundFragment[],
    qr_codes: (qrCodes ?? []).map((q) => ({
      ...q,
      stage_number: stageNumberById.get(q.stage_id) ?? 0,
    })) as FoundQrCode[],
  };
}

export async function getCurrentStageNumber(userId: string): Promise<number> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("player_progress")
    .select("current_stage")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se pudo obtener la etapa actual",
      500
    );
  }

  return data.current_stage;
}

export async function requireStageAccess(
  userId: string,
  stageNumber: number
): Promise<void> {
  if (!isValidStageNumber(stageNumber)) {
    throw new GameError(
      ErrorCodes.STAGE_NOT_FOUND,
      "Etapa no encontrada",
      404
    );
  }

  const currentStage = await getCurrentStageNumber(userId);

  if (stageNumber > currentStage) {
    throw new GameError(
      ErrorCodes.STAGE_LOCKED,
      "Esta etapa aún no está disponible",
      403
    );
  }
}

export async function resetPlayerProgress(userId: string): Promise<void> {
  const supabase = createServiceClient();

  const results = await Promise.all([
    supabase.from("player_progress").delete().eq("user_id", userId),
    supabase.from("stage_progress").delete().eq("user_id", userId),
    supabase.from("found_fragments").delete().eq("user_id", userId),
    supabase.from("found_qr_codes").delete().eq("user_id", userId),
  ]);

  const errors = results
    .map((result) => result.error?.message)
    .filter(Boolean) as string[];

  if (errors.length > 0) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `No se pudo reiniciar el progreso: ${errors.join(", ")}`,
      500
    );
  }
}

const MAX_HINTS_TOTAL = 2;

export async function incrementHintUsage(userId: string): Promise<number> {
  const supabase = createServiceClient();

  const { data: playerProgress, error: progressError } = await supabase
    .from("player_progress")
    .select("hints_used")
    .eq("user_id", userId)
    .single();

  if (progressError || !playerProgress) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "Progreso del jugador no encontrado",
      500
    );
  }

  const currentHints = playerProgress.hints_used ?? 0;

  if (currentHints >= MAX_HINTS_TOTAL) {
    throw new GameError(
      ErrorCodes.HINT_LIMIT_REACHED,
      `Límite total de ${MAX_HINTS_TOTAL} pistas alcanzado`,
      403
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("player_progress")
    .update({ hints_used: currentHints + 1 })
    .eq("user_id", userId)
    .select("hints_used")
    .single();

  if (updateError || !updated) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "No se pudo registrar el uso de la pista",
      500
    );
  }

  return updated.hints_used;
}
