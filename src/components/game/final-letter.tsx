"use client";

import { useEffect, useState } from "react";
import { FallingAutumnFlowers } from "./falling-autumn-flowers";

interface Fragment {
  stage_number: number;
  fragment_text: string;
  image_url?: string | null;
}

interface FinalLetterProps {
  fragments: Fragment[];
}

export function FinalLetter({ fragments }: FinalLetterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const fullText = fragments
    .sort((a, b) => a.stage_number - b.stage_number)
    .map((f) => f.fragment_text)
    .join("\n\n");

  return (
    <div className="relative">
      <FallingAutumnFlowers count={32} />

      <div
        className={`relative z-10 mx-auto max-w-2xl transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Sobre decorativo */}
        <div className="relative bg-ivory rounded-organic shadow-warm overflow-hidden">
          {/* Header con sello */}
          <div className="bg-moss/10 p-6 text-center border-b border-moss/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-moss/20 mb-3">
              <span className="text-3xl">✉️</span>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-moss">
              Carta final
            </h2>
            <p className="text-sm text-foreground-alt/80 mt-1">
              Mensaje reunido de todos los fragmentos
            </p>
          </div>

          {/* Cuerpo de la carta */}
          <div className="p-8 md:p-10">
            <p className="font-serif text-lg text-foreground-alt leading-loose whitespace-pre-line">
              {fullText}
            </p>

            <div className="mt-10 flex items-center justify-end gap-3">
              <span className="text-2xl">🍃</span>
              <span className="font-serif text-moss font-semibold">
                Con cariño, para ti
              </span>
            </div>
          </div>

          {/* Decoración inferior */}
          <div className="h-3 bg-gradient-to-r from-moss/30 via-sun/30 to-terracotta/30" />
        </div>
      </div>
    </div>
  );
}
