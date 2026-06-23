"use client";

import { useEffect, useRef, useState } from "react";

export type RafflePhase = "idle" | "drawing" | "winner";

export function useRafflePhase(raffleDrawnAt: string | null): RafflePhase {
  const [phase, setPhase] = useState<RafflePhase>(raffleDrawnAt ? "winner" : "idle");
  const prevDrawnAt = useRef(raffleDrawnAt);

  useEffect(() => {
    const prev = prevDrawnAt.current;
    prevDrawnAt.current = raffleDrawnAt;

    if (!raffleDrawnAt) {
      setPhase("idle");
      return;
    }
    if (prev === raffleDrawnAt) return;

    setPhase("drawing");
    const id = setTimeout(() => setPhase("winner"), 4200);
    return () => clearTimeout(id);
  }, [raffleDrawnAt]);

  return phase;
}
