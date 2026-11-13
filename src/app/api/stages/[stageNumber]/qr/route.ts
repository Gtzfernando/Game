import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  initializeProgress,
} from "@/lib/game/progress-service";
import { validateQr } from "@/lib/game/qr-service";
import { qrSchema } from "@/lib/validations/qr.schema";
import { stageNumberSchema } from "@/lib/validations/stage.schema";
import { GameError, ErrorCodes } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stageNumber: string }> }
): Promise<NextResponse> {
  try {
    const { stageNumber } = await params;
    const parsedStage = stageNumberSchema.safeParse(stageNumber);
    if (!parsedStage.success) {
      return NextResponse.json(
        { error: ErrorCodes.STAGE_NOT_FOUND, message: "Etapa no válida" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsedBody = qrSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Código QR no válido" },
        { status: 400 }
      );
    }

    const userId = await getAuthenticatedUserId();
    await initializeProgress(userId);

    const result = await validateQr(
      userId,
      parsedStage.data,
      parsedBody.data.payload
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: ErrorCodes.INTERNAL_ERROR, message: "Error interno" },
      { status: 500 }
    );
  }
}
