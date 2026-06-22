"use client";

import { useMemo } from "react";

const COLORS = ["#ffffff", "#f7e7b4", "#e7d9fb"];

export function Sparkles({ seed }: { seed: string }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        key: `${seed}-${i}`,
        left: 8 + Math.random() * 84,
        top: 16 + Math.random() * 60,
        size: 4 + Math.random() * 5,
        color: COLORS[i % COLORS.length],
        duration: 1.8 + Math.random() * 1.4,
        delay: Math.random() * 1.6,
      })),
    [seed],
  );

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.key}
          className="absolute rounded-full animate-gr-sparkle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 10px 3px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
