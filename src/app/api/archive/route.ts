import { NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  initializeProgress,
} from "@/lib/game/progress-service";
import { getArchive } from "@/lib/game/archive-service";
import { GameError, ErrorCodes } from "@/lib/errors";

export async function GET(): Promise<NextResponse> {
  try {
    const userId = await getAuthenticatedUserId();
    await initializeProgress(userId);
    const archive = await getArchive(userId);

    return NextResponse.json({
      fragments: archive.fragments.map((f) => ({
        stage_number: f.stage_number,
        fragment_text: f.fragment_snapshot,
      })),
      qr_codes: archive.qr_codes.map((q) => ({
        stage_number: q.stage_number,
        qr_payload: q.qr_payload,
      })),
    });
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
