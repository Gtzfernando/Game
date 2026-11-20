"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { revealHintAction } from "@/app/(protected)/game/actions";

interface RiddleCardProps {
  stageNumber: number;
  riddleText: string;
  hint?: string;
  initialHintsUsed?: number;
}

const MAX_HINTS = 2;

export function RiddleCard({
  stageNumber,
  riddleText,
  hint,
  initialHintsUsed = 0,
}: RiddleCardProps) {
  const router = useRouter();
  const [showHint, setShowHint] = useState(initialHintsUsed > 0);
  const [hintsUsed, setHintsUsed] = useState(initialHintsUsed);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingHints = Math.max(0, MAX_HINTS - hintsUsed);
  const isLimitReached = hintsUsed >= MAX_HINTS;

  async function handleShowHint() {
    if (isLimitReached || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newHintsUsed = await revealHintAction(stageNumber);
      setHintsUsed(newHintsUsed);
      setShowHint(true);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo usar la pista";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="font-serif text-2xl font-semibold mb-4">Acertijo</h2>
      <p className="text-lg leading-relaxed whitespace-pre-line text-foreground-alt">
        {riddleText}
      </p>
      {hint && (
        <div className="mt-5 space-y-3">
          {!showHint ? (
            <div className="space-y-2">
              <Button
                variant="secondary"
                onClick={handleShowHint}
                isLoading={isLoading}
                disabled={isLimitReached}
                type="button"
              >
                Mostrar pista
              </Button>
              <p className="text-sm text-foreground-alt/70">
                Pistas disponibles: {remainingHints} de {MAX_HINTS}
                {remainingHints === 1 && (
                  <span className="ml-1 text-terracotta font-medium">
                    (última pista)
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-sun/15 border border-sun/30 rounded-organic">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Pista:</span> {hint}
                </p>
              </div>
              {!isLimitReached && (
                <Button
                  variant="secondary"
                  onClick={handleShowHint}
                  isLoading={isLoading}
                  type="button"
                >
                  Mostrar otra pista ({remainingHints} restante
                  {remainingHints === 1 ? "" : "s"})
                </Button>
              )}
              {isLimitReached && (
                <p className="text-sm text-terracotta font-medium">
                  Has usado todas las pistas disponibles para este acertijo.
                </p>
              )}
            </div>
          )}
          {error && <Alert variant="error">{error}</Alert>}
        </div>
      )}
    </Card>
  );
}

