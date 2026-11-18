"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { GameError, ErrorCodes } from "@/lib/errors";
import { canScanQrForStage } from "@/lib/game/stage-state";
import { QrResponse } from "@/types/api";

export async function validateQr(
  userId: string,
  stageNumber: number,
  rawPayload: string
): Promise<QrResponse> {
  const supabase = createServiceClient();
  const payload = rawPayload.trim().normalize("NFC");

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

  // QR de etapa futura
  if (stageNumber > playerProgress.current_stage) {
    throw new GameError(
      ErrorCodes.QR_FUTURE_STAGE,
      "Este código todavía no corresponde a tu etapa actual",
      403
    );
  }

  // QR repetido en etapa ya completada
  if (stageProgress.qr_scanned) {
    throw new GameError(
      ErrorCodes.QR_ALREADY_SCANNED,
      "Este QR ya fue registrado",
      409
    );
  }

  // QR incorrecto para etapa actual
  if (!canScanQrForStage(stageNumber, playerProgress.current_stage, stageProgress)) {
    throw new GameError(
      ErrorCodes.INVALID_QR,
      "El código QR no corresponde a esta etapa",
      400
    );
  }

  // Validar payload exacto
  const expectedPayload = (stage.qr_payload || "").trim().normalize("NFC");
  if (payload !== expectedPayload) {
    throw new GameError(
      ErrorCodes.INVALID_QR,
      `El código QR no es válido para esta etapa. Recibido: "${payload}" (longitud ${payload.length}), esperado: "${expectedPayload}" (longitud ${expectedPayload.length})`,
      400
    );
  }

  // Ejecutar transacción atómica vía RPC
  const { data: result, error: rpcError } = await supabase.rpc(
    "complete_stage_qr",
    {
      p_user_id: userId,
      p_stage_number: stageNumber,
      p_qr_payload: payload,
    }
  );

  if (rpcError) {
    // Si ya existe el registro, tratar como QR repetido
    if (rpcError.message.includes("duplicate key")) {
      throw new GameError(
        ErrorCodes.QR_ALREADY_SCANNED,
        "Este QR ya fue registrado",
        409
      );
    }
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al procesar QR: ${rpcError.message}`,
      500
    );
  }

  const isFinal = result?.is_final ?? stageNumber === 4;
  const nextStage = result?.next_stage ?? Math.min(stageNumber + 1, 4);

  return {
    success: true,
    next_route: isFinal ? "/final" : `/game/stage/${nextStage}`,
  };
}
