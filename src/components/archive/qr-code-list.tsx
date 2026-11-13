"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface QrCode {
  stage_number: number;
  qr_payload: string;
}

interface QrCodeListProps {
  qrCodes: QrCode[];
}

export function QrCodeList({ qrCodes }: QrCodeListProps) {
  const [copied, setCopied] = useState<number | null>(null);

  async function copyToClipboard(payload: string, stageNumber: number) {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(stageNumber);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback: no hacer nada si no se puede copiar
    }
  }

  if (qrCodes.length === 0) {
    return <EmptyState message="Aún no has registrado ningún código QR." />;
  }

  return (
    <div className="space-y-4">
      {qrCodes.map((qr) => (
        <Card key={qr.stage_number}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-semibold mb-1 text-moss">
                Etapa {qr.stage_number}
              </h3>
              <code className="bg-cream px-2.5 py-1 rounded-organic text-sm border border-moss/10 text-foreground">
                {qr.qr_payload}
              </code>
            </div>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(qr.qr_payload, qr.stage_number)}
            >
              {copied === qr.stage_number ? "Copiado" : "Copiar"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
