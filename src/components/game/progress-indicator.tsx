"use client";

import { StageState } from "@/types/game";

interface ProgressIndicatorProps {
  stages: Array<{ stage_number: number; state: StageState }>;
}

export function ProgressIndicator({ stages }: ProgressIndicatorProps) {
  const stateLabels: Record<StageState, string> = {
    locked: "Bloqueada",
    answer_pending: "Pendiente",
    answer_correct_qr_pending: "QR pendiente",
    completed: "Completada",
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground-alt mb-3">
        Progreso
      </h3>
      <div className="flex gap-2">
        {stages.map((stage) => (
          <div
            key={stage.stage_number}
            className={`flex-1 rounded-organic border p-2 text-center text-xs transition-colors ${
              stage.state === "completed"
                ? "bg-moss/15 border-moss/40 text-moss"
                : stage.state === "answer_correct_qr_pending"
                ? "bg-sun/20 border-sun/40 text-foreground"
                : stage.state === "answer_pending"
                ? "bg-sky-soft/30 border-sky/30 text-foreground"
                : "bg-ivory/70 border-moss/10 text-foreground-alt/60"
            }`}
          >
            <div className="font-bold">{stage.stage_number}</div>
            <div>{stateLabels[stage.state]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
