"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/game", label: "Juego" },
    { href: "/archive", label: "Archivo" },
  ];

  return (
    <nav className="flex items-center gap-4 sm:gap-6">
      <Link
        href="/game"
        className="font-serif text-lg font-semibold text-foreground hover:text-moss transition-colors"
      >
        El Juego de los Fragmentos
      </Link>
      <ul className="flex gap-3 sm:gap-4 text-sm">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-2.5 py-1 rounded-organic transition-colors ${
                  isActive
                    ? "bg-moss/10 text-moss font-medium"
                    : "text-foreground-alt hover:text-moss hover:bg-moss/5"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
