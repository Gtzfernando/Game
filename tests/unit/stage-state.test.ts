import { describe, it, expect } from "vitest";
import {
  getStageState,
  canAnswerStage,
  canScanQrForStage,
  isValidStageNumber,
} from "@/lib/game/stage-state";
import { StageProgress } from "@/types/game";

function makeProgress(overrides: Partial<StageProgress> = {}): StageProgress {
  return {
    id: "stage-1",
    user_id: "user-1",
    stage_id: "stage-id-1",
    answer_solved: false,
    qr_scanned: false,
    completed_at: null,
    ...overrides,
  };
}

describe("getStageState", () => {
  it("etapa futura está bloqueada", () => {
    expect(getStageState(2, 1, null)).toBe("locked");
  });

  it("etapa actual sin progreso espera respuesta", () => {
    expect(getStageState(1, 1, null)).toBe("answer_pending");
  });

  it("etapa actual con respuesta correcta espera QR", () => {
    expect(getStageState(1, 1, makeProgress({ answer_solved: true }))).toBe(
      "answer_correct_qr_pending"
    );
  });

  it("etapa completada", () => {
    expect(getStageState(1, 1, makeProgress({ qr_scanned: true }))).toBe(
      "completed"
    );
  });
});

describe("canAnswerStage", () => {
  it("permite responder en etapa actual pendiente", () => {
    expect(canAnswerStage(1, 1, makeProgress())).toBe(true);
  });

  it("no permite responder si ya se resolvió", () => {
    expect(canAnswerStage(1, 1, makeProgress({ answer_solved: true }))).toBe(
      false
    );
  });

  it("no permite responder en etapa futura", () => {
    expect(canAnswerStage(2, 1, makeProgress())).toBe(false);
  });
});

describe("canScanQrForStage", () => {
  it("permite escanear si la respuesta fue correcta", () => {
    expect(
      canScanQrForStage(1, 1, makeProgress({ answer_solved: true }))
    ).toBe(true);
  });

  it("no permite escanear si la respuesta no fue correcta", () => {
    expect(canScanQrForStage(1, 1, makeProgress())).toBe(false);
  });

  it("no permite escanear si ya fue completada", () => {
    expect(
      canScanQrForStage(
        1,
        1,
        makeProgress({ answer_solved: true, qr_scanned: true })
      )
    ).toBe(false);
  });
});

describe("isValidStageNumber", () => {
  it("acepta números del 1 al 4", () => {
    expect(isValidStageNumber(1)).toBe(true);
    expect(isValidStageNumber(4)).toBe(true);
  });

  it("rechaza números fuera de rango", () => {
    expect(isValidStageNumber(0)).toBe(false);
    expect(isValidStageNumber(5)).toBe(false);
  });

  it("rechaza decimales", () => {
    expect(isValidStageNumber(1.5)).toBe(false);
  });
});
