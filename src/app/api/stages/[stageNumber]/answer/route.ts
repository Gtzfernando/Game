import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  initializeProgress,
} from "@/lib/game/progress-service";
import { validateAnswer } from "@/lib/game/answer-service";
import { answerSchema } from "@/lib/validations/answer.schema";
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
    const parsedBody = answerSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Respuesta no válida" },
        { status: 400 }
      );
    }

    const userId = await getAuthenticatedUserId();
    await initializeProgress(userId);

    const result = await validateAnswer(
      userId,
      parsedStage.data,
      parsedBody.data.answer
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
