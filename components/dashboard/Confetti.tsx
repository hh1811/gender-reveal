"use client";

import { useMemo } from "react";

const COLORS = ["#ffffff", "#FFF7EF", "#B9A7F7"];

export function Confetti({ seed }: { seed: string }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      key: `${seed}-${i}`,
      left: Math.random() * 100,
      size: 8 + Math.random() * 10,
      round: Math.random() > 0.5,
      color: COLORS[i % 3],
      duration: 2.4 + Math.random() * 1.8,
      delay: Math.random() * 1.2,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.key}
          className="absolute top-0 animate-gr-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.round ? "50%" : "3px",
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.9,
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
}
