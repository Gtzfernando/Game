"use client";

import { useMemo } from "react";

const FLOWERS = ["🍁", "🍂", "🌼", "🌻", "🥀", "🌺"];

interface FallingAutumnFlowersProps {
  count?: number;
}

export function FallingAutumnFlowers({ count = 24 }: FallingAutumnFlowersProps) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      flower: FLOWERS[i % FLOWERS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: ["6s", "8s", "11s"][i % 3],
      size: ["text-lg", "text-xl", "text-2xl", "text-base"][i % 4],
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item) => (
        <span
          key={item.id}
          className={`absolute top-0 ${item.size} opacity-0 animate-fall-flower${
            item.duration === "6s"
              ? "-fast"
              : item.duration === "11s"
              ? "-slow"
              : ""
          }`}
          style={{
            left: item.left,
            animationDelay: item.delay,
          }}
        >
          {item.flower}
        </span>
      ))}
    </div>
  );
}
