"use client";

import { useEffect, useState } from "react";
import type { VoteChoice, VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { Avatar } from "@/components/shared/Avatar";
import { relativeTime } from "@/lib/voteDisplay";
import { BABY_LABEL, EVENT_DATE_LABEL } from "@/lib/eventConfig";

const TEAM_LABEL: Record<VoteChoice, string> = { nino: "TEAM NIÑO", nina: "TEAM NIÑA" };
const TEAM_COLOR: Record<VoteChoice, string> = { nino: "#2C6E8F", nina: "#B14B7E" };

function displayParentNames(raw: string) {
  return raw.replace(/\s+y\s+/i, " & ").toUpperCase();
}

export function GalleryView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const photoVotes = votes.filter((v) => v.photoUrl).reverse();

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen w-screen"
      style={{
        background:
          "radial-gradient(circle at 8% -10%, rgba(142,205,247,.3), transparent 46%), radial-gradient(circle at 94% -8%, rgba(247,168,200,.28), transparent 48%), #faf6f0",
        padding: "clamp(18px,3vw,48px)",
      }}
    >
      <header className="flex flex-col items-center text-center" style={{ marginBottom: "clamp(24px,4vh,48px)" }}>
        <div className="font-extrabold tracking-[3px] text-[#6A4FC9]" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
          {displayParentNames(settings.parentNames)}
        </div>
        <div className="font-extrabold tracking-[4px] text-[#B9A7F7] mt-1" style={{ fontSize: "clamp(11px,1.2vw,16px)" }}>
          {BABY_LABEL} &middot; {EVENT_DATE_LABEL}
        </div>
        <h1 className="font-serif font-bold text-[#3a3349] mt-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
          Gracias por acompañarnos
        </h1>
        <p className="font-bold text-[#a99fb6] mt-2" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
          Galería del evento
        </p>
      </header>

      {photoVotes.length === 0 ? (
        <p className="text-center font-bold text-[#a99fb6]" style={{ fontSize: "clamp(14px,1.6vw,18px)" }}>
          Aún no hay fotos para mostrar.
        </p>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4" style={{ gap: "clamp(12px,1.6vw,22px)", maxWidth: 1280, margin: "0 auto" }}>
          {photoVotes.map((v) => (
            <div
              key={v.id}
              className="break-inside-avoid rounded-2xl bg-white/80 flex flex-col items-center text-center animate-gr-rise"
              style={{
                padding: "clamp(16px,1.8vw,24px)",
                marginBottom: "clamp(12px,1.6vw,22px)",
                boxShadow: "0 10px 30px -18px rgba(74,68,88,.35)",
              }}
            >
              <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={88} glow />
              <div className="font-serif font-bold text-[#3a3349] mt-3" style={{ fontSize: "clamp(15px,1.6vw,19px)" }}>
                {v.name}
              </div>
              <div className="font-extrabold tracking-[1px] mt-1" style={{ color: TEAM_COLOR[v.vote], fontSize: "clamp(11px,1.1vw,13px)" }}>
                {TEAM_LABEL[v.vote]}
              </div>
              <div className="font-bold text-[#c4bcd0] mt-1" style={{ fontSize: "clamp(10px,1vw,12px)" }}>
                Participó {relativeTime(v.createdAt)}
              </div>
              {v.message && (
                <div className="font-bold text-[#7a7286] mt-3" style={{ fontSize: "clamp(12px,1.3vw,14px)" }}>
                  &ldquo;{v.message}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
