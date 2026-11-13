"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { GameError, ErrorCodes } from "@/lib/errors";
import { normalizeAnswer } from "@/lib/game/normalize-answer";
import { verifyAnswer } from "@/lib/game/answer-hash";
import { canAnswerStage } from "@/lib/game/stage-state";
import { AnswerResponse } from "@/types/api";

export async function validateAnswer(
  userId: string,
  stageNumber: number,
  rawAnswer: string
): Promise<AnswerResponse> {
  const supabase = createServiceClient();

  const { data: stage, error: stageError } = await supabase
    .from("game_stages")
    .select("*")
    .eq("stage_number", stageNumber)
    .single();

  if (stageError || !stage) {
    throw new GameError(
      ErrorCodes.STAGE_NOT_FOUND,
      "Etapa no encontrada",
      404
    );
  }

  const { data: playerProgress, error: playerError } = await supabase
    .from("player_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (playerError || !playerProgress) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "Progreso no encontrado",
      500
    );
  }

  if (stageNumber > playerProgress.current_stage) {
    throw new GameError(
      ErrorCodes.STAGE_LOCKED,
      "Esta etapa aún no está disponible",
      403
    );
  }

  const { data: stageProgress, error: progressError } = await supabase
    .from("stage_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("stage_id", stage.id)
    .single();

  if (progressError || !stageProgress) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "Progreso de etapa no encontrado",
      500
    );
  }

  if (!canAnswerStage(stageNumber, playerProgress.current_stage, stageProgress)) {
    if (stageProgress.qr_scanned) {
      throw new GameError(
        ErrorCodes.STAGE_COMPLETED,
        "Esta etapa ya fue completada",
        409
      );
    }
    throw new GameError(
      ErrorCodes.STAGE_LOCKED,
      "Esta etapa no puede recibir respuestas",
      403
    );
  }

  const normalizedAnswer = normalizeAnswer(rawAnswer);

  if (!verifyAnswer(normalizedAnswer, stage.answer_hash)) {
    return {
      success: false,
      state: "answer_pending",
      location_clue: "",
    };
  }

  // Respuesta correcta: marcar etapa como QR pendiente
  const { error: updateError } = await supabase
    .from("stage_progress")
    .update({ answer_solved: true, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("stage_id", stage.id);

  if (updateError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al guardar respuesta: ${updateError.message}`,
      500
    );
  }

  return {
    success: true,
    state: "answer_correct_qr_pending",
    location_clue: stage.location_clue,
  };
}
