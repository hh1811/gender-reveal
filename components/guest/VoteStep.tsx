"use client";

import type { VoteChoice } from "@/lib/types";

export function VoteStep({
  name,
  selectedVote,
  onSelect,
  onContinue,
}: {
  name: string;
  selectedVote: VoteChoice | null;
  onSelect: (v: VoteChoice) => void;
  onContinue: () => void;
}) {
  const canContinue = !!selectedVote;
  return (
    <div className="my-auto relative">
      <VoteDecorations />
      <div className="relative z-10">
        <div className="text-[12px] font-extrabold tracking-[2px] text-[#B9A7F7] text-center">
          HOLA, {name.toUpperCase()}
        </div>
        <h1 className="font-serif font-bold text-[38px] leading-[1.05] mt-2 mb-1 text-center text-[#3a3349]">
          ¿Tú qué crees?
        </h1>
        <p className="text-center text-[15px] text-[#8a8398] mb-6">Toca tu predicción.</p>
        <div className="flex gap-[14px]">
          <VoteCard
            label="NIÑO"
            sub="It's a boy"
            dotColor="#8ECDF7"
            labelColor="#2C6E8F"
            selected={selectedVote === "nino"}
            glow="rgba(142,205,247,.95)"
            onClick={() => onSelect("nino")}
          />
          <VoteCard
            label="NIÑA"
            sub="It's a girl"
            dotColor="#F7A8C8"
            labelColor="#B14B7E"
            selected={selectedVote === "nina"}
            glow="rgba(247,168,200,.95)"
            onClick={() => onSelect("nina")}
          />
        </div>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full mt-[18px] border-none rounded-2xl py-4 text-[16px] font-extrabold text-white"
          style={{ background: canContinue ? "#6A4FC9" : "#d8cfe8", cursor: canContinue ? "pointer" : "not-allowed" }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

const DECORATIONS = [
  { emoji: "🍼", top: "-6%", left: "4%", size: 30, rotate: -18 },
  { emoji: "🧸", top: "2%", left: "82%", size: 34, rotate: 14 },
  { emoji: "🎈", top: "38%", left: "-4%", size: 28, rotate: 10 },
  { emoji: "⭐", top: "46%", left: "90%", size: 22, rotate: -8 },
  { emoji: "👣", top: "82%", left: "8%", size: 26, rotate: 22 },
  { emoji: "🎀", top: "88%", left: "78%", size: 26, rotate: -14 },
];

function VoteDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {DECORATIONS.map((d, i) => (
        <span
          key={i}
          className="absolute opacity-[0.16]"
          style={{ top: d.top, left: d.left, fontSize: d.size, transform: `rotate(${d.rotate}deg)` }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

function VoteCard({
  label,
  sub,
  dotColor,
  labelColor,
  selected,
  glow,
  onClick,
}: {
  label: string;
  sub: string;
  dotColor: string;
  labelColor: string;
  selected: boolean;
  glow: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex-1 rounded-[22px] py-[22px] px-3 text-center cursor-pointer bg-white border-[3px] transition-all duration-[180ms]"
      style={{
        borderColor: selected ? dotColor : "#f0e7dd",
        boxShadow: selected ? `0 14px 30px -16px ${glow}` : "0 4px 16px -10px rgba(106,79,201,.35)",
        transform: selected ? "translateY(-3px)" : "none",
      }}
    >
      <div className="w-[54px] h-[54px] rounded-full mx-auto mb-3" style={{ background: dotColor }} />
      <div className="text-[13px] font-extrabold tracking-[1.5px]" style={{ color: labelColor }}>
        {label}
      </div>
      <div className="font-serif text-[23px] font-semibold text-[#3a3349] mt-0.5">{sub}</div>
    </div>
  );
}
