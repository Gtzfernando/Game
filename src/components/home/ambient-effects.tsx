"use client";

export function AmbientEffects() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Hojas flotantes */}
      <span
        className="absolute top-[15%] left-[12%] text-moss-light/70 text-2xl animate-float-leaf"
        style={{ animationDelay: "0s" }}
      >
        🍃
      </span>
      <span
        className="absolute top-[25%] right-[18%] text-moss-light/60 text-xl animate-float-leaf-slow"
        style={{ animationDelay: "1s" }}
      >
        🍃
      </span>
      <span
        className="absolute top-[55%] left-[8%] text-moss-light/50 text-lg animate-float-leaf"
        style={{ animationDelay: "2.5s" }}
      >
        🍃
      </span>
      <span
        className="absolute top-[70%] right-[12%] text-moss-light/60 text-2xl animate-float-leaf-slow"
        style={{ animationDelay: "3.5s" }}
      >
        🍃
      </span>
      <span
        className="absolute top-[40%] right-[5%] text-moss-light/50 text-base animate-float-leaf"
        style={{ animationDelay: "4.5s" }}
      >
        🍃
      </span>

      {/* Partículas de luz */}
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-sun/60 animate-sparkle"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + i * 13}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}

      {/* Nubes sutiles */}
      <div
        className="absolute top-[12%] left-0 w-32 h-10 bg-white/20 rounded-full blur-xl animate-drift-cloud"
        style={{ animationDuration: "40s" }}
      />
      <div
        className="absolute top-[20%] left-0 w-24 h-8 bg-white/15 rounded-full blur-lg animate-drift-cloud"
        style={{ animationDuration: "55s", animationDelay: "5s" }}
      />
    </div>
  );
}
