export class GameError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "GameError";
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  STAGE_LOCKED: "STAGE_LOCKED",
  STAGE_COMPLETED: "STAGE_COMPLETED",
  STAGE_NOT_FOUND: "STAGE_NOT_FOUND",
  INCORRECT_ANSWER: "INCORRECT_ANSWER",
  INVALID_QR: "INVALID_QR",
  QR_FUTURE_STAGE: "QR_FUTURE_STAGE",
  QR_ALREADY_SCANNED: "QR_ALREADY_SCANNED",
  CONTENT_INCOMPLETE: "CONTENT_INCOMPLETE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;
