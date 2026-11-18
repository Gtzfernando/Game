"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QrScanner } from "@/components/game/qr-scanner";
import { QrImageUploader } from "@/components/game/qr-image-uploader";
import { LocationClue } from "@/components/game/location-clue";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface QrScannerClientProps {
  stageNumber: number;
  locationClue: string;
}

export function QrScannerClient({
  stageNumber,
  locationClue,
}: QrScannerClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState<string | null>(null);

  const handleScan = useCallback(
    async (payload: string) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);
      setLastPayload(payload);

      try {
        const response = await fetch(`/api/stages/${stageNumber}/qr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Error al validar QR");
          setIsLoading(false);
          return;
        }

        router.push(data.next_route || `/game/stage/${stageNumber}/fragment`);
        router.refresh();
      } catch {
        setError("Error de conexión. Inténtalo de nuevo.");
        setIsLoading(false);
      }
    },
    [stageNumber, router, isLoading]
  );

  return (
    <div className="space-y-6">
      <LocationClue clue={locationClue} stageNumber={stageNumber} />

      <div className="relative">
        <QrScanner onScan={handleScan} />
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-organic bg-ivory">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-moss border-t-transparent" />
            <p className="mt-4 font-semibold text-foreground">Validando QR...</p>
            {lastPayload && (
              <p className="mt-2 text-sm text-foreground-alt">
                Código leído: {lastPayload}
              </p>
            )}
          </div>
        )}
      </div>

      <QrImageUploader onScan={handleScan} />

      {error && (
        <div className="space-y-4">
          <Alert variant="error">
            <p>{error}</p>
            {lastPayload && (
              <p className="mt-2 text-sm opacity-80">
                Último código leído: {lastPayload}
              </p>
            )}
          </Alert>
          <Button onClick={() => setError(null)} type="button">
            Intentar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
