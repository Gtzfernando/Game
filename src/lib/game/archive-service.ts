"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { GameError, ErrorCodes } from "@/lib/errors";
import { FoundFragment, FoundQrCode } from "@/types/game";

export interface ArchiveData {
  fragments: FoundFragment[];
  qr_codes: FoundQrCode[];
}

export async function getArchive(userId: string): Promise<ArchiveData> {
  const supabase = createServiceClient();

  const { data: stages, error: stagesError } = await supabase
    .from("game_stages")
    .select("id, stage_number");

  if (stagesError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al cargar etapas: ${stagesError.message}`,
      500
    );
  }

  const stageNumberById = new Map(
    (stages ?? []).map((s) => [s.id, s.stage_number])
  );

  const { data: fragments, error: fragmentsError } = await supabase
    .from("found_fragments")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: true });

  if (fragmentsError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al cargar fragmentos: ${fragmentsError.message}`,
      500
    );
  }

  const { data: qrCodes, error: qrError } = await supabase
    .from("found_qr_codes")
    .select("*")
    .eq("user_id", userId)
    .order("scanned_at", { ascending: true });

  if (qrError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al cargar QR: ${qrError.message}`,
      500
    );
  }

  return {
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
