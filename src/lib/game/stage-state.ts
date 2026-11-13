import { StageProgress } from "@/types/game";
import { TOTAL_STAGES } from "@/lib/constants";

export type StageState =
  | "locked"
  | "answer_pending"
  | "answer_correct_qr_pending"
  | "completed";

export function getStageState(
  stageNumber: number,
  currentStage: number,
  progress: StageProgress | null
): StageState {
  if (stageNumber > currentStage) {
    return "locked";
  }

  if (!progress) {
    return stageNumber === currentStage ? "answer_pending" : "locked";
  }

  if (progress.qr_scanned) {
    return "completed";
  }

  if (progress.answer_solved) {
    return "answer_correct_qr_pending";
  }

  return "answer_pending";
}

export function canAnswerStage(
  stageNumber: number,
  currentStage: number,
  progress: StageProgress | null
): boolean {
  return (
    stageNumber === currentStage &&
    (!progress || (!progress.answer_solved && !progress.qr_scanned))
  );
}

export function canScanQrForStage(
  stageNumber: number,
  currentStage: number,
  progress: StageProgress | null
): boolean {
  return (
    stageNumber === currentStage &&
    !!progress &&
    progress.answer_solved &&
    !progress.qr_scanned
  );
}

export function isValidStageNumber(stageNumber: number): boolean {
  return Number.isInteger(stageNumber) && stageNumber >= 1 && stageNumber <= TOTAL_STAGES;
}
