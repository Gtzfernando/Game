"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";

export type QrScannerStatus =
  | "idle"
  | "requesting"
  | "active"
  | "detected"
  | "error";

interface UseQrScannerOptions {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export function useQrScanner({ onScan, onError }: UseQrScannerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<QrScannerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannedRef = useRef(false);

  const stop = useCallback(() => {
    scannedRef.current = true;
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch {
        // Ignorar errores al detener
      }
      controlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    readerRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!videoRef.current) return;

    stop();
    scannedRef.current = false;
    setStatus("requesting");
    setErrorMessage(null);

    const video = videoRef.current;

    try {
      // 1. Solicitar permisos de cámara de forma explícita
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;

      // 2. Asignar stream al elemento video manualmente
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "true");
      await video.play();

      // 3. Iniciar decodificación desde el elemento video
      readerRef.current = new BrowserQRCodeReader();
      controlsRef.current = await readerRef.current.decodeFromVideoElement(
        video,
        (result, error) => {
          if (scannedRef.current) return;

          if (result) {
            scannedRef.current = true;
            setStatus("detected");
            onScan(result.getText());
            stop();
            return;
          }

          if (
            error &&
            !(error instanceof Error && error.name === "NotFoundException")
          ) {
            // Ignorar errores de decodificación continua
          }
        }
      );

      setStatus("active");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setStatus("error");
      setErrorMessage(
        `${message}. Puedes usar la opción de subir una foto del QR.`
      );
      onError?.(err instanceof Error ? err : new Error(message));
      stop();
    }
  }, [onScan, onError, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    videoRef,
    status,
    errorMessage,
    start,
    stop,
  };
}
