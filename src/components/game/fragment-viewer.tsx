"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FragmentViewerProps {
  fragmentText: string;
  nextRoute: string;
  nextLabel: string;
}

export function FragmentViewer({
  fragmentText,
  nextRoute,
  nextLabel,
}: FragmentViewerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 300);
    const timer2 = setTimeout(() => setShowContinue(true), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card
        className={`transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-[0.98]"
        }`}
      >
        <h2 className="font-serif text-2xl font-semibold mb-4">
          Parte del poema desbloqueada
        </h2>
        <div className="overflow-hidden">
          <p
            className={`leading-relaxed whitespace-pre-line text-foreground-alt transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {fragmentText}
          </p>
        </div>
        <p
          className={`mt-4 text-sm font-semibold text-moss transition-opacity duration-700 ${
            showContinue ? "opacity-100" : "opacity-0"
          }`}
        >
          ¡Continúa!
        </p>
        <p
          className={`mt-2 text-sm text-foreground-alt/70 transition-opacity duration-700 ${
            showContinue ? "opacity-100" : "opacity-0"
          }`}
        >
          Este fragmento se ha guardado en tu archivo para que lo consultes cuando quieras.
        </p>
      </Card>
      <div
        className={`transition-opacity duration-500 ${
          showContinue ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link href={nextRoute}>
          <Button>{nextLabel}</Button>
        </Link>
      </div>
    </div>
  );
}
