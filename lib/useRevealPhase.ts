"use client";

import { useEffect, useRef, useState } from "react";
import type { Reveal } from "./types";

export type RevealPhase = "idle" | "dark" | "orb" | "text" | "celebrate" | "settled";

export function useRevealPhase(reveal: Reveal): RevealPhase {
  const [phase, setPhase] = useState<RevealPhase>(reveal === "none" ? "idle" : "settled");
  const prevReveal = useRef(reveal);

  useEffect(() => {
    const prev = prevReveal.current;
    prevReveal.current = reveal;

    if (reveal === "none") {
      setPhase("idle");
      return;
    }
    if (prev !== "none") return;

    setPhase("dark");
    const timers = [
      setTimeout(() => setPhase("orb"), 2800),
      setTimeout(() => setPhase("text"), 3700),
      setTimeout(() => setPhase("celebrate"), 4300),
      setTimeout(() => setPhase("settled"), 6600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reveal]);

  return phase;
}
