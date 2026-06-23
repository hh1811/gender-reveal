"use client";

import { useEffect, useRef, useState } from "react";
import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { Orb } from "@/components/shared/Orb";
import { Avatar } from "@/components/shared/Avatar";
import { Sparkles } from "./Sparkles";

type Phase = "idle" | "dark" | "orb" | "text" | "celebrate" | "settled";

export function RevealView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const reveal = settings.reveal;
  const [phase, setPhase] = useState<Phase>(reveal === "none" ? "idle" : "settled");
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
      setTimeout(() => setPhase("orb"), 1000),
      setTimeout(() => setPhase("text"), 1900),
      setTimeout(() => setPhase("celebrate"), 2500),
      setTimeout(() => setPhase("settled"), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reveal]);

  if (reveal === "none") {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#faf6f0]">
        <span className="w-3 h-3 rounded-full bg-[#B9A7F7] animate-gr-pulse mb-4" />
        <div className="font-extrabold tracking-[3px] text-[#a99fb6]" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
          PREPARANDO LA REVELACIÓN
        </div>
      </div>
    );
  }

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
            <div className="animate-gr-rise" style={{ marginTop: "clamp(20px,3.4vh,40px)", maxWidth: "min(90vw,1200px)" }}>
              <div
                className="font-extrabold tracking-[2px] text-white text-center"
                style={{ fontSize: "clamp(12px,1.3vw,16px)", opacity: 0.85, marginBottom: "clamp(12px,1.6vh,18px)" }}
              >
                GRACIAS POR ACOMPAÑARNOS
              </div>
              <div className="flex flex-wrap items-start justify-center" style={{ gap: "clamp(10px,1.4vw,18px)", maxHeight: "22vh", overflow: "hidden" }}>
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
