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

  // Realizar las operaciones directamente desde el backend
  const now = new Date().toISOString();
  const nextStageNumber = Math.min(stageNumber + 1, 4);
  const isFinal = stageNumber >= 4;

  console.log("[validateQr] starting save", { userId, stageNumber, stageId: stage.id, payload });

  // 1. Guardar QR encontrado
  const { data: insertedQr, error: qrError } = await supabase
    .from("found_qr_codes")
    .upsert(
      {
        user_id: userId,
        stage_id: stage.id,
        qr_payload: payload,
      },
      { onConflict: "user_id,qr_payload" }
    )
    .select();

  console.log("[validateQr] qr insert result", { insertedQr, qrError });

  if (qrError && !qrError.message.includes("duplicate key")) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al guardar QR: ${qrError.message}`,
      500
    );
  }

  // 2. Guardar fragmento revelado
  const fragmentInsertData = {
    user_id: userId,
    stage_id: stage.id,
    fragment_snapshot: stage.fragment_text,
    image_url: stage.image_url,
  };

  console.log("[validateQr] fragment insert data", fragmentInsertData);

  const { data: insertedFragment, error: fragmentError } = await supabase
    .from("found_fragments")
    .upsert(fragmentInsertData, { onConflict: "user_id,stage_id" })
    .select();

  console.log("[validateQr] fragment insert result", { insertedFragment, fragmentError });

  if (fragmentError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al guardar fragmento: ${fragmentError.message}`,
      500
    );
  }

  if (!insertedFragment || insertedFragment.length === 0) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      "El fragmento no se pudo guardar (no devolvió datos)",
      500
    );
  }

  // 3. Actualizar progreso de etapa
  const { error: updateStageError } = await supabase
    .from("stage_progress")
    .update({
      qr_scanned: true,
      completed_at: stageProgress.completed_at ?? now,
    })
    .eq("user_id", userId)
    .eq("stage_id", stage.id);

  if (updateStageError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al actualizar etapa: ${updateStageError.message}`,
      500
    );
  }

  // 4. Actualizar progreso general
  const { error: updatePlayerError } = await supabase
    .from("player_progress")
    .update({
      current_stage: nextStageNumber,
      game_completed: isFinal,
    })
    .eq("user_id", userId);

  if (updatePlayerError) {
    throw new GameError(
      ErrorCodes.INTERNAL_ERROR,
      `Error al actualizar progreso: ${updatePlayerError.message}`,
      500
    );
  }

  return {
    success: true,
    next_route: `/game/stage/${stageNumber}/fragment`,
  };
}
