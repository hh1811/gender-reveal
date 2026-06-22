"use client";

import { useMemo, useState } from "react";
import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { colorFor, initialFor, relativeTime, softFor } from "@/lib/voteDisplay";

async function postJson(url: string, body?: unknown) {
  await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function AdminView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const [busy, setBusy] = useState(false);

  const { ninoCount, ninaCount, total, messageCount, voters } = useMemo(() => {
    const ninoCount = votes.filter((v) => v.vote === "nino").length;
    const ninaCount = votes.filter((v) => v.vote === "nina").length;
    const total = votes.length;
    const messageCount = votes.filter((v) => v.message).length;
    const voters = votes
      .slice()
      .reverse()
      .map((v) => ({
        id: v.id,
        name: v.name,
        voteLabel: v.vote === "nino" ? "NIÑO" : "NIÑA",
        color: colorFor(v.vote),
        soft: softFor(v.vote),
        initial: v.photoUrl ? "" : initialFor(v.name),
        photoUrl: v.photoUrl,
        message: v.message || "—",
        timeLabel: relativeTime(v.createdAt),
      }));
    return { ninoCount, ninaCount, total, messageCount, voters };
  }, [votes]);

  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const revealNino = () => run(() => postJson("/api/admin/reveal", { reveal: "nino" }));
  const revealNina = () => run(() => postJson("/api/admin/reveal", { reveal: "nina" }));
  const hideReveal = () => run(() => postJson("/api/admin/reveal", { reveal: "none" }));
  const simulateVote = () => run(() => postJson("/api/admin/simulate"));
  const resetAll = () => {
    if (!window.confirm("¿Reiniciar toda la votación? Esto borra todos los votos.")) return;
    run(() => postJson("/api/admin/reset"));
  };

  return (
    <div className="max-w-[980px] mx-auto px-[22px] pt-[34px] pb-[60px]">
      <div className="text-[12px] font-extrabold tracking-[2.5px] text-[#B9A7F7]">PANEL DE CONTROL</div>
      <h1 className="font-serif font-bold text-[38px] mt-1 mb-6 text-[#3a3349]">Administración del evento</h1>

      <div className="grid grid-cols-4 gap-[14px] mb-6">
        <StatCard label="TOTAL" labelColor="#a99fb6" value={total} color="#6A4FC9" />
        <StatCard label="NIÑO" labelColor="#2C6E8F" value={ninoCount} color="#2C6E8F" border="#8ECDF7" />
        <StatCard label="NIÑA" labelColor="#B14B7E" value={ninaCount} color="#B14B7E" border="#F7A8C8" />
        <StatCard label="MENSAJES" labelColor="#a99fb6" value={messageCount} color="#4A4458" />
      </div>

      <div className="bg-white rounded-[20px] px-6 py-[22px] mb-[22px]" style={{ boxShadow: "0 10px 30px -22px rgba(106,79,201,.5)" }}>
        <div className="font-serif font-bold text-[24px] text-[#3a3349] mb-1">Revelar el resultado</div>
        <p className="text-[14px] text-[#8a8398] mb-4">Muestra la revelación a pantalla completa en el Dashboard.</p>
        <div className="flex flex-wrap gap-[10px]">
          <button
            onClick={revealNino}
            disabled={busy}
            className="flex-1 min-w-[140px] border-none rounded-2xl py-[15px] text-[15px] font-extrabold cursor-pointer bg-[#8ECDF7] text-[#1f5273]"
          >
            Revelar NIÑO
          </button>
          <button
            onClick={revealNina}
            disabled={busy}
            className="flex-1 min-w-[140px] border-none rounded-2xl py-[15px] text-[15px] font-extrabold cursor-pointer bg-[#F7A8C8] text-[#8d2f5d]"
          >
            Revelar NIÑA
          </button>
          <button
            onClick={hideReveal}
            disabled={busy}
            className="flex-1 min-w-[140px] border-2 border-[#ecdfd2] rounded-2xl py-[15px] text-[15px] font-extrabold cursor-pointer bg-white text-[#8a8398]"
          >
            Ocultar
          </button>
        </div>
        <div className="flex gap-[10px] mt-[14px] border-t border-[#f0e8df] pt-[14px]">
          <button
            onClick={simulateVote}
            disabled={busy}
            className="border-none rounded-xl px-4 py-[11px] text-[13px] font-extrabold cursor-pointer bg-[#B9A7F7] text-white"
          >
            + Simular votante
          </button>
          <button
            onClick={resetAll}
            disabled={busy}
            className="border-none rounded-xl px-4 py-[11px] text-[13px] font-extrabold cursor-pointer bg-[#f3e9df] text-[#a4677f]"
          >
            Reiniciar votación
          </button>
        </div>
        {settings.reveal !== "none" && (
          <div className="mt-3 text-[12px] font-bold text-[#a99fb6]">
            Revelación activa: {settings.reveal === "nino" ? "NIÑO" : "NIÑA"}
          </div>
        )}
      </div>

      <div className="bg-white rounded-[20px] px-2 pb-3 pt-2" style={{ boxShadow: "0 10px 30px -22px rgba(106,79,201,.5)" }}>
        <div className="flex justify-between px-4 pt-[14px] pb-[10px]">
          <div className="font-serif font-bold text-[22px] text-[#3a3349]">Votos registrados</div>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {voters.map((v) => (
            <div key={v.id} className="flex items-center gap-[14px] px-4 py-3 border-t border-[#f5ede4]">
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-extrabold flex-none"
                style={{
                  backgroundColor: v.soft,
                  backgroundImage: v.photoUrl ? `url("${v.photoUrl}")` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: v.color,
                }}
              >
                {v.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-[#3a3349] text-[15px]">{v.name}</div>
                <div className="text-[13px] text-[#9a93a6] overflow-hidden text-ellipsis whitespace-nowrap">{v.message}</div>
              </div>
              <div
                className="text-[11px] font-extrabold tracking-[.5px] px-[11px] py-[5px] rounded-full flex-none"
                style={{ color: v.color, background: v.soft }}
              >
                {v.voteLabel}
              </div>
              <div className="text-[12px] text-[#bdb4c6] flex-none w-16 text-right">{v.timeLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  labelColor,
  value,
  color,
  border,
}: {
  label: string;
  labelColor: string;
  value: number;
  color: string;
  border?: string;
}) {
  return (
    <div
      className="bg-white rounded-[18px] px-5 py-[18px]"
      style={{ boxShadow: "0 10px 30px -22px rgba(106,79,201,.5)", borderTop: border ? `4px solid ${border}` : undefined }}
    >
      <div className="text-[12px] font-extrabold tracking-[1px]" style={{ color: labelColor }}>
        {label}
      </div>
      <div className="font-serif font-bold text-[42px] leading-[1.1]" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
