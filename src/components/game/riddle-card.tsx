"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RiddleCardProps {
  riddleText: string;
  hint?: string;
}

export function RiddleCard({ riddleText, hint }: RiddleCardProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <Card className="mb-6">
      <h2 className="font-serif text-2xl font-semibold mb-4">Acertijo</h2>
      <p className="text-lg leading-relaxed whitespace-pre-line text-foreground-alt">
        {riddleText}
      </p>
      {hint && (
        <div className="mt-5">
          {!showHint ? (
            <Button
              variant="secondary"
              onClick={() => setShowHint(true)}
              type="button"
            >
              Mostrar pista
            </Button>
          ) : (
            <div className="p-3 bg-sun/15 border border-sun/30 rounded-organic">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Pista:</span> {hint}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
