"use client";

import type { VoteChoice } from "@/lib/types";

export function DoneStep({ name, vote, photo, onVoteAgain }: { name: string; vote: VoteChoice; photo: string | null; onVoteAgain: () => void }) {
  const voteColor = vote === "nino" ? "#8ECDF7" : "#F7A8C8";
  const voteSoft = vote === "nino" ? "#e3f3fd" : "#fce6f0";
  const voteLabel = vote === "nino" ? "Niño" : "Niña";

  return (
    <div className="my-auto text-center">
      <div
        className="w-[104px] h-[104px] rounded-full flex items-center justify-center mx-auto mb-[22px] animate-gr-pop"
        style={{
          backgroundColor: voteSoft,
          backgroundImage: photo ? `url("${photo}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!photo && <div className="w-[50px] h-[50px] rounded-full" style={{ background: voteColor }} />}
      </div>
      <h1 className="font-serif font-bold text-[40px] leading-[1.05] mb-[6px] text-[#3a3349]">¡Gracias, {name}!</h1>
      <p className="text-[16px] text-[#8a8398] mb-1">Tu voto quedó registrado:</p>
      <div className="font-serif text-[30px] font-bold mb-[26px]" style={{ color: voteColor }}>
        {voteLabel}
      </div>
      <div
        className="bg-white rounded-[18px] px-5 py-[18px] text-[14px] leading-[1.5] text-[#8a8398]"
        style={{ boxShadow: "0 8px 24px -16px rgba(106,79,201,.4)" }}
      >
        Mira la <b className="text-[#6A4FC9]">pantalla principal</b> para ver los resultados en vivo.
      </div>
      <button onClick={onVoteAgain} className="mt-6 bg-transparent border-none text-[#a99fb6] text-[14px] font-bold cursor-pointer">
        Votar otra vez
      </button>
    </div>
  );
}
