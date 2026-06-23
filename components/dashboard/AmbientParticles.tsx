"use client";

import { useMemo } from "react";

export function AmbientParticles({ count = 14 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        left: 4 + Math.random() * 92,
        top: 4 + Math.random() * 88,
        size: 2 + Math.random() * 3,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 4,
        opacity: 0.25 + Math.random() * 0.3,
      })),
    [count],
  );

  if (count === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.key}
          className="absolute rounded-full bg-white animate-gr-particle-drift"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
