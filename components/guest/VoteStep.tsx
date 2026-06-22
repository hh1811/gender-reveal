"use client";

import type { ReactNode } from "react";
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
    <div className="my-auto">
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
          icon={<BowtieIcon />}
        />
        <VoteCard
          label="NIÑA"
          sub="It's a girl"
          dotColor="#F7A8C8"
          labelColor="#B14B7E"
          selected={selectedVote === "nina"}
          glow="rgba(247,168,200,.95)"
          onClick={() => onSelect("nina")}
          icon={<BowIcon />}
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
  icon,
}: {
  label: string;
  sub: string;
  dotColor: string;
  labelColor: string;
  selected: boolean;
  glow: string;
  onClick: () => void;
  icon: ReactNode;
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
      <div className="w-[54px] h-[54px] rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: dotColor }}>
        {icon}
      </div>
      <div className="text-[13px] font-extrabold tracking-[1.5px]" style={{ color: labelColor }}>
        {label}
      </div>
      <div className="font-serif text-[23px] font-semibold text-[#3a3349] mt-0.5">{sub}</div>
    </div>
  );
}

function BowtieIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7.5c0-.83 1.2-1.4 2.2-.9L11 9.3a1 1 0 0 1 0 1.8l-5.8 2.7c-1 .5-2.2-.07-2.2-.9V7.5Z"
        fill="white"
      />
      <path
        d="M21 7.5c0-.83-1.2-1.4-2.2-.9L13 9.3a1 1 0 0 0 0 1.8l5.8 2.7c1 .5 2.2-.07 2.2-.9V7.5Z"
        fill="white"
      />
      <circle cx="12" cy="10.2" r="1.7" fill="white" />
    </svg>
  );
}

function BowIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 11.2 4.8 7.7C3.6 7 2 7.8 2 9.2v2.6c0 1.4 1.6 2.2 2.8 1.5L11 9.8"
        fill="white"
      />
      <path
        d="M13 11.2 19.2 7.7C20.4 7 22 7.8 22 9.2v2.6c0 1.4-1.6 2.2-2.8 1.5L13 9.8"
        fill="white"
      />
      <rect x="10.3" y="8.8" width="3.4" height="3.4" rx="1" fill="white" />
    </svg>
  );
}
