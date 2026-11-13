"use client";

import { useCallback } from "react";
import { useQrScanner } from "@/hooks/use-qr-scanner";
import { Button } from "@/components/ui/button";
import { QrScanStatus } from "./qr-scan-status";

interface QrScannerProps {
  onScan: (payload: string) => void;
}

export function QrScanner({ onScan }: QrScannerProps) {
  const handleScan = useCallback(
    (payload: string) => {
      onScan(payload);
    },
    [onScan]
  );

  const { videoRef, status, errorMessage, start } = useQrScanner({
    onScan: handleScan,
  });

  const showOverlay = status === "idle" || status === "error";

  return (
    <div className="space-y-4">
      <QrScanStatus status={status} errorMessage={errorMessage} />
      <div className="relative aspect-video overflow-hidden rounded-organic border-2 border-moss/20 bg-black shadow-warm">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
          autoPlay
        />
        {showOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center text-white text-sm">
            <p className="mb-3">Cámara inactiva</p>
            <Button onClick={start}>Activar cámara</Button>
          </div>
        )}
        {status === "requesting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm">
            Iniciando cámara...
          </div>
        )}
      </div>
      {!showOverlay && status !== "requesting" && (
        <Button onClick={start} variant="secondary">
          Reiniciar cámara
        </Button>
      )}
    </div>
  );
}
