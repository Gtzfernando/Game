import { NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { GameError, ErrorCodes } from "@/lib/errors";
import { ProgressResponse } from "@/types/api";

export async function GET(): Promise<NextResponse> {
  try {
    const userId = await getAuthenticatedUserId();
    await initializeProgress(userId);
    const summary = await getProgressSummary(userId);

    const response: ProgressResponse = {
      current_stage: summary.current_stage,
      game_completed: summary.game_completed,
      tutorial_completed_at: summary.tutorial_completed_at,
      stages: summary.stages.map((s) => ({
        stage_number: s.stage_number,
        state: s.state,
        riddle_text: s.riddle_text,
      })),
      fragments: summary.fragments.map((f) => ({
        stage_number: f.stage_number,
        fragment_text: f.fragment_snapshot,
      })),
      qr_codes: summary.qr_codes.map((q) => ({
        stage_number: q.stage_number,
        qr_payload: q.qr_payload,
      })),
    };

    return NextResponse.json(response);
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
