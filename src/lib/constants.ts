export const TOTAL_STAGES = 4;

export const STAGE_STATES = {
  LOCKED: "locked",
  ANSWER_PENDING: "answer_pending",
  ANSWER_CORRECT_QR_PENDING: "answer_correct_qr_pending",
  COMPLETED: "completed",
} as const;

export const MAX_ANSWER_LENGTH = 100;
export const MAX_QR_PAYLOAD_LENGTH = 100;
