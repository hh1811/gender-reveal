"use client";

import { useMemo, useState } from "react";
import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { colorFor, relativeTime, softFor } from "@/lib/voteDisplay";
import { topNameSuggestions } from "@/lib/nameSuggestions";
import { Avatar } from "@/components/shared/Avatar";

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

  const [activeVoterId, setActiveVoterId] = useState<string | null>(null);

  const { ninoCount, ninaCount, total, messageCount, voters, topNino, topNina } = useMemo(() => {
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
        vote: v.vote,
        voteLabel: v.vote === "nino" ? "NIÑO" : "NIÑA",
        color: colorFor(v.vote),
        soft: softFor(v.vote),
        photoUrl: v.photoUrl,
        message: v.message,
        messagePreview: v.message || "—",
        nameNino: v.nameNino,
        nameNina: v.nameNina,
        timeLabel: relativeTime(v.createdAt),
      }));
    const topNino = topNameSuggestions(votes, "nino", 5);
    const topNina = topNameSuggestions(votes, "nina", 5);
    return { ninoCount, ninaCount, total, messageCount, voters, topNino, topNina };
  }, [votes]);

  const activeVoter = voters.find((v) => v.id === activeVoterId) || null;

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

      {(topNino.length > 0 || topNina.length > 0) && (
        <div className="grid grid-cols-2 gap-[14px] mb-6">
          <NameSuggestionCard label="NOMBRES SUGERIDOS · NIÑO" color="#2C6E8F" items={topNino} />
          <NameSuggestionCard label="NOMBRES SUGERIDOS · NIÑA" color="#B14B7E" items={topNina} />
        </div>
      )}

      <div className="bg-white rounded-[20px] px-6 py-[22px] mb-[22px]" style={{ boxShadow: "0 10px 30px -22px rgba(106,79,201,.5)" }}>
        <div className="font-serif font-bold text-[24px] text-[#3a3349] mb-1">Revelar el resultado</div>
        <p className="text-[14px] text-[#8a8398] mb-4">Muestra la revelación a pantalla completa en el Dashboard y en /reveal.</p>
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
            <div
              key={v.id}
              onClick={() => setActiveVoterId(v.id)}
              className="flex items-center gap-[14px] px-4 py-3 border-t border-[#f5ede4] cursor-pointer hover:bg-[#fbf7f1]"
            >
              <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={38} />
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-[#3a3349] text-[15px]">{v.name}</div>
                <div className="text-[13px] text-[#9a93a6] overflow-hidden text-ellipsis whitespace-nowrap">{v.messagePreview}</div>
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

      {activeVoter && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50"
          onClick={() => setActiveVoterId(null)}
        >
          <div
            className="bg-white rounded-[20px] px-6 py-6 max-w-[420px] w-full"
            style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={activeVoter.name} vote={activeVoter.vote} photoUrl={activeVoter.photoUrl} size={52} glow />
              <div className="min-w-0">
                <div className="font-serif font-bold text-[20px] text-[#3a3349]">{activeVoter.name}</div>
                <div
                  className="inline-block text-[11px] font-extrabold tracking-[.5px] px-[10px] py-[3px] rounded-full mt-1"
                  style={{ color: activeVoter.color, background: activeVoter.soft }}
                >
                  {activeVoter.voteLabel}
                </div>
              </div>
            </div>
            <div className="text-[12px] font-extrabold tracking-[1px] text-[#a99fb6] mb-1">MENSAJE</div>
            <p className="text-[15px] text-[#3a3349] leading-[1.5] mb-4">{activeVoter.message || "Sin mensaje."}</p>
            {(activeVoter.nameNino || activeVoter.nameNina) && (
              <>
                <div className="text-[12px] font-extrabold tracking-[1px] text-[#a99fb6] mb-1">NOMBRES SUGERIDOS</div>
                <div className="flex gap-4 mb-2">
                  {activeVoter.nameNino && (
                    <div>
                      <span className="text-[11px] font-bold text-[#2C6E8F]">NIÑO: </span>
                      <span className="text-[14px] text-[#3a3349]">{activeVoter.nameNino}</span>
                    </div>
                  )}
                  {activeVoter.nameNina && (
                    <div>
                      <span className="text-[11px] font-bold text-[#B14B7E]">NIÑA: </span>
                      <span className="text-[14px] text-[#3a3349]">{activeVoter.nameNina}</span>
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              onClick={() => setActiveVoterId(null)}
              className="w-full mt-3 border-none rounded-xl py-[11px] text-[13px] font-extrabold cursor-pointer bg-[#f3e9df] text-[#8a8398]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NameSuggestionCard({
  label,
  color,
  items,
}: {
  label: string;
  color: string;
  items: { name: string; count: number }[];
}) {
  return (
    <div className="bg-white rounded-[18px] px-5 py-[16px]" style={{ boxShadow: "0 10px 30px -22px rgba(106,79,201,.5)" }}>
      <div className="text-[12px] font-extrabold tracking-[1px] mb-2" style={{ color }}>
        {label}
      </div>
      {items.length === 0 ? (
        <div className="text-[13px] text-[#c4bcd0]">Sin sugerencias todavía</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <div
              key={it.name}
              className="text-[13px] font-bold px-3 py-1 rounded-full"
              style={{ color, background: `${color}15` }}
            >
              {it.name} <span style={{ opacity: 0.6 }}>×{it.count}</span>
            </div>
          ))}
        </div>
      )}
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
