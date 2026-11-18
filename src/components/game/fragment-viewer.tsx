"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FallingAutumnFlowers } from "./falling-autumn-flowers";

interface FragmentViewerProps {
  stageNumber: number;
  fragmentText: string;
  imageUrl: string;
  nextRoute: string;
  nextLabel: string;
}

export function FragmentViewer({
  stageNumber,
  fragmentText,
  imageUrl,
  nextRoute,
  nextLabel,
}: FragmentViewerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsVisible(true);
      setShowFlowers(true);
    }, 300);
    const timer2 = setTimeout(() => setShowActions(true), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `fragmento-etapa-${stageNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative space-y-6">
      {showFlowers && <FallingAutumnFlowers />}

      <Card
        className={`relative z-10 overflow-hidden transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-[0.98]"
        }`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-organic">
          <Image
            src={imageUrl}
            alt={`Ilustración del fragmento ${stageNumber}`}
            fill
            className={`object-cover transition-transform duration-1000 ${
              isVisible ? "scale-100" : "scale-110"
            }`}
            style={{ transitionDelay: "400ms" }}
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="p-6">
          <h2 className="font-serif text-2xl font-semibold mb-4">
            Fragmento {stageNumber} desbloqueado
          </h2>

          <div className="overflow-hidden">
            <p
              className={`leading-relaxed whitespace-pre-line text-foreground-alt transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              {fragmentText}
            </p>
          </div>

          <p
            className={`mt-4 text-sm font-semibold text-moss transition-opacity duration-700 ${
              showActions ? "opacity-100" : "opacity-0"
            }`}
          >
            ¡Has recolectado una parte del mensaje!
          </p>
          <p
            className={`mt-2 text-sm text-foreground-alt/70 transition-opacity duration-700 ${
              showActions ? "opacity-100" : "opacity-0"
            }`}
          >
            Este fragmento se ha guardado en tu archivo para que lo consultes cuando quieras.
          </p>
        </div>
      </Card>

      <div
        className={`relative z-10 flex flex-col gap-3 transition-opacity duration-500 ${
          showActions ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button onClick={handleSaveImage} variant="secondary" type="button">
          🖼️ Guardar imagen
        </Button>
        <Link href={nextRoute}>
          <Button>{nextLabel}</Button>
        </Link>
      </div>
    </div>
  );
}
