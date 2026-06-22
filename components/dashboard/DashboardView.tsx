"use client";

import { useMemo } from "react";
import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { barColorFor, colorFor, initialFor, softFor } from "@/lib/voteDisplay";
import { Confetti } from "./Confetti";

export function DashboardView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);

  const { ninoCount, ninaCount, total, ninoPct, ninaPct, ninoBarPct, recentVoters } = useMemo(() => {
    const ninoCount = votes.filter((v) => v.vote === "nino").length;
    const ninaCount = votes.filter((v) => v.vote === "nina").length;
    const total = votes.length;
    const ninoPct = total ? Math.round((ninoCount / total) * 100) : 50;
    const ninaPct = total ? 100 - ninoPct : 50;
    const ninoBarPct = total ? Math.round(((ninoCount + 0.7) / (total + 1.4)) * 100) : 50;

    const recentVoters = votes
      .slice(-5)
      .reverse()
      .map((v) => ({
        id: v.id,
        name: v.name,
        voteLabel: v.vote === "nino" ? "Niño" : "Niña",
        color: colorFor(v.vote),
        soft: softFor(v.vote),
        barColor: barColorFor(v.vote),
        initial: v.photoUrl ? "" : initialFor(v.name),
        photoUrl: v.photoUrl,
      }));

    return { ninoCount, ninaCount, total, ninoPct, ninaPct, ninoBarPct, recentVoters };
  }, [votes]);

  const reveal = settings.reveal;
  const isRevealed = reveal !== "none";
  const revealLabel = reveal === "nino" ? "¡Es niño!" : "¡Es niña!";
  const revealBg =
    reveal === "nino" ? "linear-gradient(160deg,#8ECDF7,#5fb6ee)" : "linear-gradient(160deg,#F7A8C8,#ef84b1)";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        background: "radial-gradient(120% 120% at 50% -10%, #fff 0%, #FFF7EF 55%)",
        padding: "clamp(22px,3.4vw,52px)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-extrabold tracking-[3px] text-[#B9A7F7]" style={{ fontSize: "clamp(11px,1.1vw,16px)" }}>
            {settings.parentNames}
          </div>
          <h1
            className="font-serif font-bold text-[#3a3349] whitespace-nowrap"
            style={{ fontSize: "clamp(30px,5.2vw,82px)", lineHeight: 0.98, margin: "4px 0 0" }}
          >
            ¿Niño o Niña?
          </h1>
        </div>
        <div className="text-right">
          <div
            className="inline-flex items-center gap-2 font-extrabold text-[#B14B7E]"
            style={{ fontSize: "clamp(11px,1vw,15px)" }}
          >
            <span className="w-[10px] h-[10px] rounded-full bg-[#F7A8C8] animate-gr-pulse" />
            EN VIVO
          </div>
          <div className="font-serif font-bold text-[#6A4FC9]" style={{ fontSize: "clamp(30px,3.6vw,58px)", lineHeight: 1 }}>
            {total}
          </div>
          <div className="font-bold text-[#a99fb6] tracking-[1px]" style={{ fontSize: "clamp(10px,.9vw,14px)" }}>
            VOTOS
          </div>
        </div>
      </div>

      <div
        className="relative flex items-stretch"
        style={{ flex: 1, gap: "clamp(12px,1.4vw,22px)", margin: "clamp(16px,2.2vw,32px) 0" }}
      >
        <div
          className="flex flex-none flex-col justify-between min-w-0 rounded-[22px]"
          style={{
            width: `${ninoBarPct}%`,
            background: "linear-gradient(160deg,#aedcfb,#8ECDF7)",
            padding: "clamp(16px,2vw,30px)",
            transition: "width .8s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <div className="font-black tracking-[2px] text-[#1f5273]" style={{ fontSize: "clamp(13px,1.4vw,22px)" }}>
            NIÑO
          </div>
          <div>
            <div className="font-serif font-bold text-white" style={{ fontSize: "clamp(44px,8vw,128px)", lineHeight: 0.9 }}>
              {ninoPct}%
            </div>
            <div className="font-extrabold text-[#2C6E8F]" style={{ fontSize: "clamp(12px,1.2vw,20px)" }}>
              {ninoCount} votos
            </div>
          </div>
        </div>

        <div
          className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full bg-white font-serif font-bold text-[#B9A7F7]"
          style={{
            transform: "translate(-50%,-50%)",
            width: "clamp(46px,5vw,80px)",
            height: "clamp(46px,5vw,80px)",
            fontSize: "clamp(16px,2vw,30px)",
            boxShadow: "0 10px 28px -10px rgba(106,79,201,.45)",
            zIndex: 3,
          }}
        >
          vs
        </div>

        <div
          className="flex flex-none flex-col justify-between items-end text-right min-w-0 rounded-[22px]"
          style={{
            width: `${100 - ninoBarPct}%`,
            background: "linear-gradient(160deg,#fbc1da,#F7A8C8)",
            padding: "clamp(16px,2vw,30px)",
            transition: "width .8s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <div className="font-black tracking-[2px] text-[#8d2f5d]" style={{ fontSize: "clamp(13px,1.4vw,22px)" }}>
            NIÑA
          </div>
          <div>
            <div className="font-serif font-bold text-white" style={{ fontSize: "clamp(44px,8vw,128px)", lineHeight: 0.9 }}>
              {ninaPct}%
            </div>
            <div className="font-extrabold text-[#B14B7E]" style={{ fontSize: "clamp(12px,1.2vw,20px)" }}>
              {ninaCount} votos
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          className="font-extrabold tracking-[2px] text-[#a99fb6] mb-2"
          style={{ fontSize: "clamp(10px,.9vw,14px)" }}
        >
          ÚLTIMOS VOTOS
        </div>
        <div className="flex" style={{ gap: "clamp(8px,1vw,16px)" }}>
          {recentVoters.map((v) => (
            <div
              key={v.id}
              className="flex-1 bg-white rounded-2xl flex items-center min-w-0 animate-gr-rise"
              style={{
                padding: "clamp(9px,1vw,14px)",
                borderTop: `4px solid ${v.barColor}`,
                gap: "clamp(8px,.8vw,12px)",
              }}
            >
              <div
                className="flex-none rounded-full flex items-center justify-center font-extrabold"
                style={{
                  width: "clamp(30px,3vw,44px)",
                  height: "clamp(30px,3vw,44px)",
                  backgroundColor: v.soft,
                  backgroundImage: v.photoUrl ? `url("${v.photoUrl}")` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: v.color,
                  fontSize: "clamp(13px,1.3vw,19px)",
                }}
              >
                {v.initial}
              </div>
              <div className="min-w-0">
                <div
                  className="font-extrabold text-[#3a3349] whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ fontSize: "clamp(12px,1.1vw,17px)" }}
                >
                  {v.name}
                </div>
                <div className="font-extrabold" style={{ fontSize: "clamp(11px,1vw,15px)", color: v.color }}>
                  {v.voteLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isRevealed && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden z-20"
          style={{ background: revealBg }}
        >
          <Confetti seed={reveal} />
          <div
            className="font-extrabold tracking-[4px] text-white opacity-90 animate-gr-pop"
            style={{ fontSize: "clamp(13px,1.4vw,22px)" }}
          >
            EL RESULTADO ES…
          </div>
          <div
            className="font-serif font-bold text-white animate-gr-pop"
            style={{
              fontSize: "clamp(60px,12vw,200px)",
              lineHeight: 0.95,
              textShadow: "0 12px 40px rgba(0,0,0,.18)",
              animationDelay: ".1s",
            }}
          >
            {revealLabel}
          </div>
        </div>
      )}
    </div>
  );
}
