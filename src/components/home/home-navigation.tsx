"use client";

import Link from "next/link";

interface HomeNavigationProps {
  isAuthenticated?: boolean;
}

export function HomeNavigation({ isAuthenticated = false }: HomeNavigationProps) {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between rounded-organic bg-ivory px-4 py-3 shadow-warm">
          <Link
            href="/"
            className="font-serif text-lg font-semibold text-foreground hover:text-moss transition-colors"
          >
            El Juego de los Fragmentos
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            {isAuthenticated ? (
              <>
                <Link
                  href="/game"
                  className="flex items-center gap-1.5 text-foreground-alt hover:text-moss transition-colors"
                >
                  <span>🌿</span>
                  <span className="hidden sm:inline">Mi progreso</span>
                </Link>
                <Link
                  href="/archive"
                  className="flex items-center gap-1.5 text-foreground-alt hover:text-moss transition-colors"
                >
                  <span>📖</span>
                  <span className="hidden sm:inline">Fragmentos</span>
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center gap-1.5 text-foreground-alt hover:text-terracotta transition-colors"
                >
                  <span>→</span>
                  <span className="hidden sm:inline">Salir</span>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-foreground-alt hover:text-moss transition-colors"
              >
                <span>→</span>
                <span>Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
