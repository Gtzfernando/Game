"use client";

import Link from "next/link";

interface HomeHeroPanelProps {
  isAuthenticated?: boolean;
}

export function HomeHeroPanel({ isAuthenticated = false }: HomeHeroPanelProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-xl px-4 sm:px-6">
      <div className="rounded-organic bg-cream/95 p-8 shadow-warm backdrop-blur-sm sm:p-10">
        {/* Decoración de rama */}
        <div className="mb-6 flex justify-center">
          <svg
            width="80"
            height="24"
            viewBox="0 0 80 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-moss"
            aria-hidden="true"
          >
            <path
              d="M4 12C15 8 25 16 40 12C55 8 65 16 76 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 12C14 8 14 16 12 12Z"
              fill="currentColor"
            />
            <path
              d="M68 12C66 8 66 16 68 12Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <h1 className="text-center font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          El Juego
          <br />
          de los Fragmentos
        </h1>

        <p className="mt-6 text-center text-lg leading-relaxed text-foreground-alt">
          Una serie de acertijos, pistas y códigos te llevarán a descubrir un mensaje oculto.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href={isAuthenticated ? "/game" : "/login"}
            className="inline-flex items-center gap-2 rounded-organic bg-moss px-8 py-4 text-lg font-semibold text-white shadow-warm transition-all duration-300 hover:bg-moss-light hover:shadow-lg active:scale-[0.98]"
          >
            Comenzar aventura
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
