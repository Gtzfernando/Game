"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Instrucciones del juego"
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-organic bg-ivory p-6 shadow-warm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-foreground-alt hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="font-serif text-2xl font-semibold mb-4 pr-8">
          Cómo jugar
        </h2>

        <div className="space-y-4 text-foreground-alt leading-relaxed">
          <p>
            Resuelve cada acertijo para avanzar en la aventura. Cada respuesta
            correcta te llevará a escanear un código QR.
          </p>

          <ol className="list-decimal list-inside space-y-2 ml-1">
            <li>Lee el acertijo y escribe tu respuesta.</li>
            <li>Si es correcta, se activará el escáner de QR.</li>
            <li>Busca y escanea el QR correspondiente a esa etapa.</li>
            <li>Descubre el fragmento con su ilustración.</li>
            <li>Guarda la imagen o continúa al siguiente acertijo.</li>
          </ol>

          <div className="rounded-organic bg-cream p-4 border border-moss/10">
            <p className="font-semibold text-foreground mb-1">
              Formato de las respuestas
            </p>
            <p>
              Escribe una sola palabra. Puedes usar la primera letra en
              mayúscula, por ejemplo: <strong>Limón</strong>.
            </p>
          </div>

          <p className="text-sm">
            Todos los fragmentos e imágenes que desbloquees quedarán guardados
            en tu <strong>Archivo</strong> para que los consultes cuando
            quieras.
          </p>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} type="button">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
