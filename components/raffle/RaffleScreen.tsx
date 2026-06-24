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
  winnerVote,
  revealed,
}: {
  phase: RafflePhase;
  eligible: Vote[];
  winner: RaffleWinner | null;
  winnerVote: Vote | null;
  revealed: boolean;
}) {
  const [spinIndex, setSpinIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "drawing" || eligible.length === 0) return;
    const id = setInterval(() => setSpinIndex((i) => i + 1), 130);
    return () => clearInterval(id);
  }, [phase, eligible.length]);

  const draw = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/raffle", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "No se pudo sortear");
      }
    } catch {
      setError("No se pudo sortear");
    } finally {
      setBusy(false);
    }
  };

  if (phase === "idle") {
    if (!revealed) {
      return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#1b1726]">
          <span className="w-3 h-3 rounded-full bg-[#B9A7F7] animate-gr-pulse mb-4" />
          <div className="font-extrabold tracking-[3px] text-white/60" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
            ESPERANDO LA REVELACIÓN
          </div>
        </div>
      );
    }

    return (
      <div
        className="relative min-h-screen w-screen overflow-hidden flex flex-col items-center justify-center text-center px-6"
        style={{ background: "linear-gradient(160deg,#241c38,#3a2a55 55%,#1b1726)" }}
      >
        <AmbientParticles count={16} />
        <div className="font-extrabold tracking-[3px] text-[#B9A7F7]" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
          🎟️ RIFA ENTRE LOS QUE ACERTARON
        </div>
        <p className="text-white/70 font-bold mt-2" style={{ fontSize: "clamp(13px,1.5vw,18px)" }}>
          {eligible.length} invitado{eligible.length === 1 ? "" : "s"} entran al sorteo
        </p>

        {eligible.length > 0 ? (
          <div
            className="flex flex-wrap items-start justify-center mt-8"
            style={{ gap: "clamp(14px,1.8vw,22px)", maxWidth: "min(92vw,1100px)", maxHeight: "44vh", overflowY: "auto" }}
          >
            {eligible.map((v) => (
              <div key={v.id} className="flex flex-col items-center animate-gr-fade-in" style={{ gap: 6, width: 76 }}>
                <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={56} glow />
                <div className="font-bold text-white truncate w-full text-center" style={{ fontSize: "clamp(10px,1vw,13px)" }}>
                  {v.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 font-bold mt-6" style={{ fontSize: "clamp(13px,1.4vw,16px)" }}>
            Nadie acertó todavía 🙈
          </p>
        )}

        <button
          onClick={draw}
          disabled={busy || eligible.length === 0}
          className="mt-10 border-none rounded-2xl py-4 px-10 font-extrabold cursor-pointer bg-[#B9A7F7] text-white disabled:opacity-40"
          style={{ fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: 1, boxShadow: "0 14px 30px -10px rgba(185,167,247,.6)" }}
        >
          {busy ? "Sorteando…" : "🎲 Rifar"}
        </button>
        {error && (
          <p className="text-[#F7A8C8] font-bold mt-4" style={{ fontSize: "clamp(12px,1.2vw,15px)" }}>
            {error}
          </p>
        )}
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
          {winnerVote && (
            <Avatar
              name={winnerVote.name}
              vote={winnerVote.vote}
              photoUrl={winnerVote.photoUrl}
              size={160}
              glow
              className="mt-5"
            />
          )}
          <div
            className="font-serif font-bold text-white mt-3"
            style={{ fontSize: "clamp(48px,7vw,96px)", textShadow: "0 16px 50px rgba(0,0,0,.4)" }}
          >
            {winner.name}
          </div>
          <p className="text-white/80 font-bold mt-4" style={{ fontSize: "clamp(22px,2.6vw,32px)" }}>
            ¡Felicidades!
          </p>
          <button
            onClick={draw}
            disabled={busy || eligible.length === 0}
            className="mt-8 border-none rounded-2xl py-3 px-8 font-extrabold cursor-pointer bg-[#B9A7F7] text-white disabled:opacity-40"
            style={{ fontSize: "clamp(14px,1.5vw,18px)", letterSpacing: 1, boxShadow: "0 14px 30px -10px rgba(185,167,247,.6)" }}
          >
            {busy ? "Sorteando…" : "🎲 Sortear de nuevo"}
          </button>
          {error && (
            <p className="text-[#F7A8C8] font-bold mt-4" style={{ fontSize: "clamp(12px,1.2vw,15px)" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
