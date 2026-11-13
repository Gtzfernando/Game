"use client";

import { useState, useRef, useCallback } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface QrImageUploaderProps {
  onScan: (payload: string) => void;
}

export function QrImageUploader({ onScan }: QrImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const decodeImage = useCallback(
    async (dataUrl: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const reader = new BrowserQRCodeReader();
        const result = await reader.decodeFromImageUrl(dataUrl);

        if (result) {
          onScan(result.getText());
        } else {
          setError("No se detectó ningún código QR en la imagen.");
        }
      } catch {
        setError(
          "No se pudo leer el QR de la imagen. Asegúrate de que sea nítido y esté completo."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onScan]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          setPreviewUrl(dataUrl);
          await decodeImage(dataUrl);
        } else {
          setError("No se pudo cargar la imagen.");
        }
      };
      reader.onerror = () => {
        setError("Error al leer el archivo.");
      };
      reader.readAsDataURL(file);

      // Limpiar inputs para permitir volver a seleccionar el mismo archivo
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [decodeImage]
  );

  return (
    <div className="space-y-4 rounded-organic bg-ivory/80 p-4 shadow-warm">
      <p className="text-center text-sm font-medium text-foreground-alt">
        ¿La cámara no funciona? Usa una imagen del QR.
      </p>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Tomar foto del código QR"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Seleccionar imagen del código QR desde el dispositivo"
      />

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="secondary"
          onClick={() => cameraInputRef.current?.click()}
          isLoading={isLoading}
          type="button"
        >
          📷 Tomar foto
        </Button>
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          isLoading={isLoading}
          type="button"
        >
          🖼️ Elegir imagen
        </Button>
      </div>

      {previewUrl && (
        <div className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Vista previa del QR"
            className="max-h-48 rounded-organic border border-moss/20"
          />
          <Button
            variant="secondary"
            onClick={() => decodeImage(previewUrl)}
            isLoading={isLoading}
            type="button"
          >
            Reintentar lectura
          </Button>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
