"use client";

import { useMemo } from "react";
import type { VoteChoice } from "@/lib/types";

const CONFETTI_COLORS = ["#8ECDF7", "#F7A8C8", "#B9A7F7", "#ffffff", "#c3aef5"];

export function DoneStep({ vote, photo, onVoteAgain }: { vote: VoteChoice; photo: string | null; onVoteAgain: () => void }) {
  const isNino = vote === "nino";
  const orbGradient = isNino ? "linear-gradient(145deg,#bfe4fb,#8ECDF7 70%)" : "linear-gradient(145deg,#fbd3e4,#F7A8C8 70%)";
  const voteGlow = isNino ? "rgba(142,205,247,.6)" : "rgba(247,168,200,.6)";
  const heading = isNino ? "Bienvenido a Team Niño" : "Bienvenida a Team Niña";

  const confetti = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        key: i,
        left: 8 + Math.random() * 84,
        top: -10 - Math.random() * 20,
        size: 5 + Math.random() * 6,
        round: Math.random() > 0.5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        duration: 1.5 + Math.random() * 0.5,
        delay: Math.random() * 0.3,
      })),
    [],
  );

  return (
    <div className="my-auto text-center">
      <div className="relative w-[104px] h-[104px] mx-auto mb-[22px]">
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {confetti.map((p) => (
            <div
              key={p.key}
              className="absolute top-0 animate-gr-confetti"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                borderRadius: p.round ? "50%" : "2px",
                background: p.color,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
        <div
          className="w-full h-full rounded-full animate-gr-pop"
          style={{
            background: photo
              ? `url("${photo}")`
              : `radial-gradient(circle at 32% 28%, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 40%), ${orbGradient}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: photo
              ? `0 14px 30px -14px rgba(106,79,201,.4), 0 0 40px 10px ${voteGlow}`
              : `inset 0 10px 16px rgba(255,255,255,.6), inset 0 -12px 18px rgba(0,0,0,.08), 0 0 44px 12px ${voteGlow}`,
          }}
        />
      </div>
      <h1 className="font-serif font-bold text-[36px] leading-[1.1] mb-[8px] text-[#3a3349] animate-gr-rise">
        {heading}
      </h1>
      <p className="text-[16px] text-[#766d89] mb-[26px]">Tu predicción ya está en el marcador.</p>
      <div
        className="bg-white rounded-[18px] px-5 py-[18px] text-left"
        style={{ boxShadow: "0 8px 24px -16px rgba(106,79,201,.4)" }}
      >
        <div className="text-[14.5px] font-extrabold text-[#3a3349] leading-[1.4]">
          Tu predicción ya forma parte del marcador en vivo.
        </div>
        <div className="text-[13px] text-[#9a93ab] leading-[1.5] mt-[4px]">
          Mira la pantalla principal para descubrir cómo va la votación.
        </div>
      </div>
      <button onClick={onVoteAgain} className="mt-6 bg-transparent border-none text-[#a99fb6] text-[14px] font-bold cursor-pointer">
        Votar otra vez
      </button>
    </div>
  );
}
