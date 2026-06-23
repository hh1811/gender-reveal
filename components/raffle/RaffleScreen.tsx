"use client";

import { useEffect, useState } from "react";
import type { RaffleWinner, Vote } from "@/lib/types";
import type { RafflePhase } from "@/lib/useRafflePhase";
import { Avatar } from "@/components/shared/Avatar";
import { AmbientParticles } from "@/components/dashboard/AmbientParticles";
import { Sparkles } from "@/components/reveal/Sparkles";

export function RaffleScreen({
  phase,
  eligible,
  winner,
}: {
  phase: RafflePhase;
  eligible: Vote[];
  winner: RaffleWinner | null;
}) {
  const [spinIndex, setSpinIndex] = useState(0);
  useEffect(() => {
    if (phase !== "drawing" || eligible.length === 0) return;
    const id = setInterval(() => setSpinIndex((i) => i + 1), 130);
    return () => clearInterval(id);
  }, [phase, eligible.length]);

  if (phase === "idle") {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#1b1726]">
        <span className="w-3 h-3 rounded-full bg-[#B9A7F7] animate-gr-pulse mb-4" />
        <div className="font-extrabold tracking-[3px] text-white/60" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
          ESPERANDO EL SORTEO
        </div>
      </div>
    );
  }

  const spinning = eligible.length > 0 ? eligible[spinIndex % eligible.length] : null;

  return (
    <div
      className="relative min-h-screen w-screen overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ background: "linear-gradient(160deg,#241c38,#3a2a55 55%,#1b1726)" }}
    >
      <AmbientParticles count={20} />
      {phase === "drawing" && spinning && (
        <div className="relative flex flex-col items-center animate-gr-rise">
          <div className="relative flex items-center justify-center" style={{ width: "clamp(200px,28vw,260px)", height: "clamp(200px,28vw,260px)" }}>
            <span className="absolute rounded-full border border-white/20 animate-gr-ring-expand" style={{ width: "100%", height: "100%" }} />
            <span
              className="absolute rounded-full border border-white/20 animate-gr-ring-expand"
              style={{ width: "100%", height: "100%", animationDelay: "0.9s" }}
            />
            <Avatar name={spinning.name} vote={spinning.vote} photoUrl={spinning.photoUrl} size={160} glow />
          </div>
          <div className="mt-6 font-serif font-bold text-white" style={{ fontSize: "clamp(28px,3.4vw,44px)" }}>
            {spinning.name}
          </div>
          <div
            className="mt-[clamp(20px,3vh,36px)] font-extrabold tracking-[3px] text-white/70 animate-gr-pulse"
            style={{ fontSize: "clamp(13px,1.4vw,18px)" }}
          >
            SORTEANDO…
          </div>
        </div>
      )}
      {phase === "winner" && winner && (
        <div className="relative flex flex-col items-center animate-gr-pop">
          <Sparkles seed={winner.id} />
          <div className="font-extrabold tracking-[3px] text-[#B9A7F7]" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
            🎉 TENEMOS GANADOR 🎉
          </div>
          <div
            className="font-serif font-bold text-white mt-3"
            style={{ fontSize: "clamp(48px,7vw,96px)", textShadow: "0 16px 50px rgba(0,0,0,.4)" }}
          >
            {winner.name}
          </div>
          <p className="text-white/80 font-bold mt-4" style={{ fontSize: "clamp(15px,1.8vw,22px)" }}>
            ¡Felicidades! Acertaste el sexo del bebé.
          </p>
        </div>
      )}
    </div>
  );
}
