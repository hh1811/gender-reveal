"use client";

import type { VoteChoice } from "@/lib/types";
import { BackButton } from "./BackButton";

export function VoteStep({
  selectedVote,
  ninoCount,
  ninaCount,
  onSelect,
  onContinue,
  onBack,
}: {
  selectedVote: VoteChoice | null;
  ninoCount: number;
  ninaCount: number;
  onSelect: (v: VoteChoice) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const ctaLabel =
    selectedVote === "nino" ? "Unirme a Team Niño" : selectedVote === "nina" ? "Unirme a Team Niña" : "Continuar";

  return (
    <div className="my-auto">
      <BackButton onClick={onBack} />
      <h1 className="font-serif font-bold text-[38px] leading-[1.05] mt-2 mb-1 text-center text-[#3a3349]">
        ¿Qué crees que será?
      </h1>
      <p className="text-center text-[15px] text-[#766d89] mb-6">
        Haz tu predicción y participa en el marcador en vivo.
      </p>
      <div className="flex gap-[14px]">
        <VoteCard
          label="TEAM NIÑO"
          labelColor="#2C6E8F"
          orbGradient="linear-gradient(145deg,#bfe4fb,#8ECDF7 70%)"
          selected={selectedVote === "nino"}
          tint="#f1faff"
          borderColor="#8ECDF7"
          glow="rgba(142,205,247,.7)"
          voterCount={ninoCount}
          onClick={() => onSelect("nino")}
        />
        <VoteCard
          label="TEAM NIÑA"
          labelColor="#B14B7E"
          orbGradient="linear-gradient(145deg,#fbd3e4,#F7A8C8 70%)"
          selected={selectedVote === "nina"}
          tint="#fff1f7"
          borderColor="#F7A8C8"
          glow="rgba(247,168,200,.7)"
          voterCount={ninaCount}
          onClick={() => onSelect("nina")}
        />
      </div>
      <button
        onClick={onContinue}
        disabled={!selectedVote}
        className="w-full mt-[20px] border-none rounded-full h-[58px] text-[16px] font-extrabold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        style={{
          background: selectedVote ? "linear-gradient(135deg,#6FB6E8,#9B8FE0,#EE93BE)" : "#d8cfe8",
          boxShadow: selectedVote
            ? "0 16px 32px -16px rgba(142,205,247,.5), 0 16px 32px -16px rgba(247,168,200,.4)"
            : "none",
          cursor: selectedVote ? "pointer" : "not-allowed",
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function VoteCard({
  label,
  labelColor,
  orbGradient,
  selected,
  tint,
  borderColor,
  glow,
  voterCount,
  onClick,
}: {
  label: string;
  labelColor: string;
  orbGradient: string;
  selected: boolean;
  tint: string;
  borderColor: string;
  glow: string;
  voterCount: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex-1 rounded-[22px] py-[24px] px-3 text-center cursor-pointer border-[2px] transition-all duration-[250ms] ease-out"
      style={{
        backgroundColor: selected ? tint : "#fff",
        borderColor: selected ? borderColor : "#f0e7dd",
        boxShadow: selected
          ? `0 0 0 1px ${borderColor}, 0 18px 36px -14px ${glow}`
          : "0 4px 16px -10px rgba(106,79,201,.18)",
        transform: selected ? "scale(1.02)" : "none",
      }}
    >
      <div
        className="w-[54px] h-[54px] rounded-full mx-auto mb-3"
        style={{
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 40%), ${orbGradient}`,
          boxShadow: "inset 0 6px 10px rgba(255,255,255,.6), inset 0 -8px 12px rgba(0,0,0,.08)",
        }}
      />
      <div className="text-[12.5px] font-extrabold tracking-[1.5px]" style={{ color: labelColor }}>
        {label}
      </div>
      <div className="text-[12.5px] text-[#9a93ab] mt-[3px]">Únete a la predicción</div>
      {voterCount > 0 && (
        <div className="text-[11px] text-[#b3a9c4] mt-[6px]">
          {voterCount} {voterCount === 1 ? "persona eligió" : "personas eligieron"} este equipo
        </div>
      )}
    </div>
  );
}
