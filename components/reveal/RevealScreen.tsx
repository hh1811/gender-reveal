"use client";

import type { Vote, VoteChoice } from "@/lib/types";
import type { RevealPhase } from "@/lib/useRevealPhase";
import { Orb } from "@/components/shared/Orb";
import { Avatar } from "@/components/shared/Avatar";
import { AmbientParticles } from "@/components/dashboard/AmbientParticles";
import { Sparkles } from "./Sparkles";

export function RevealScreen({ reveal, phase, votes }: { reveal: VoteChoice; phase: RevealPhase; votes: Vote[] }) {
  const isNino = reveal === "nino";
  const dominantBg = isNino
    ? "linear-gradient(160deg,#bfe4fb,#5fb6ee 60%,#2f86cb)"
    : "linear-gradient(160deg,#fbd3e4,#ef84b1 60%,#d4568f)";
  const title = isNino ? "¡ES NIÑO!" : "¡ES NIÑA!";

  return (
    <div
      className="relative min-h-screen w-screen overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ background: phase === "dark" ? "#1b1726" : dominantBg, transition: "background 1s ease" }}
    >
      {phase === "dark" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AmbientParticles count={16} />
          <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
            <span className="absolute rounded-full border border-white/25 animate-gr-ring-expand" style={{ width: 220, height: 220 }} />
            <span
              className="absolute rounded-full border border-white/25 animate-gr-ring-expand"
              style={{ width: 220, height: 220, animationDelay: "0.9s" }}
            />
            <span
              className="absolute rounded-full border border-white/25 animate-gr-ring-expand"
              style={{ width: 220, height: 220, animationDelay: "1.8s" }}
            />
            <span className="w-3 h-3 rounded-full bg-white animate-gr-pulse" />
          </div>
          <div
            className="mt-[clamp(24px,4vh,48px)] font-extrabold tracking-[3px] text-white/70 animate-gr-pulse"
            style={{ fontSize: "clamp(13px,1.4vw,18px)" }}
          >
            ABRIENDO EL SOBRE…
          </div>
        </div>
      )}
      {phase !== "dark" && (
        <>
          <Orb
            variant={isNino ? "nino" : "nina"}
            size={280}
            glow={phase === "orb" ? 0.8 : 1.6}
            className="animate-gr-pop"
            style={{ width: "clamp(220px,30vw,360px)", height: "clamp(220px,30vw,360px)" }}
          />
          {(phase === "text" || phase === "celebrate" || phase === "settled") && (
            <div className="mt-[clamp(20px,3vh,40px)] animate-gr-rise">
              <h1
                className="font-serif font-bold text-white"
                style={{ fontSize: "clamp(64px,12vw,200px)", lineHeight: 1, textShadow: "0 16px 50px rgba(0,0,0,.2)" }}
              >
                {title}
              </h1>
              <p
                className="text-white font-bold"
                style={{ fontSize: "clamp(16px,2.2vw,28px)", marginTop: "clamp(8px,1.4vh,18px)", opacity: 0.92 }}
              >
                Gracias por acompañarnos en este momento.
              </p>
            </div>
          )}
          {(phase === "celebrate" || phase === "settled") && <Sparkles seed={reveal} />}
          {phase === "settled" && votes.length > 0 && (
            <div className="animate-gr-rise" style={{ marginTop: "clamp(32px,5vh,56px)", maxWidth: "min(90vw,1200px)" }}>
              <div
                className="font-extrabold tracking-[2px] text-white text-center"
                style={{ fontSize: "clamp(12px,1.3vw,16px)", opacity: 0.85, marginBottom: "clamp(16px,2.2vh,24px)" }}
              >
                GRACIAS POR ACOMPAÑARNOS
              </div>
              <div className="flex flex-wrap items-start justify-center" style={{ gap: "clamp(14px,1.8vw,22px)", maxHeight: "20vh", overflow: "hidden" }}>
                {votes.map((v) => (
                  <div key={v.id} className="flex flex-col items-center" style={{ gap: 4, width: 64 }}>
                    <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={40} />
                    <div className="font-bold text-white truncate w-full text-center" style={{ fontSize: "clamp(8px,.85vw,11px)", opacity: 0.85 }}>
                      {v.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {phase === "settled" && (
            <p
              className="absolute font-bold text-white animate-gr-rise"
              style={{ bottom: "clamp(20px,4vh,48px)", fontSize: "clamp(13px,1.4vw,20px)", opacity: 0.85 }}
            >
              Gracias por formar parte de este momento. — Héctor &amp; Liz
            </p>
          )}
        </>
      )}
    </div>
  );
}
