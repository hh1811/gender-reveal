"use client";

import { useEffect, useState } from "react";
import type { Vote } from "@/lib/types";
import { Avatar } from "@/components/shared/Avatar";

const VOTE_LABEL = { nino: "TEAM NIÑO", nina: "TEAM NIÑA" } as const;
const NEW_BADGE_MS = 5 * 60 * 1000;

export function SocialCarousel({ votes }: { votes: Vote[] }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  if (votes.length === 0) return null;
  const items = votes.slice(-24).reverse();
  const shouldLoop = items.length >= 6;
  const duration = Math.max(24, items.length * 3.2);
  const displayItems = shouldLoop ? [...items, ...items] : items;

  return (
    <div className="overflow-hidden">
      <div
        className={shouldLoop ? "flex items-center" : "flex items-center justify-center"}
        style={
          shouldLoop
            ? { gap: "clamp(18px,2.4vw,40px)", width: "max-content", animation: `gr-marquee ${duration}s linear infinite` }
            : { gap: "clamp(18px,2.4vw,40px)" }
        }
      >
        {displayItems.map((v, i) => {
          const isNew = now - new Date(v.createdAt).getTime() < NEW_BADGE_MS;
          return (
            <div key={`${v.id}-${i}`} className="flex flex-col items-center relative" style={{ gap: 4 }}>
              {isNew && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 font-extrabold text-white rounded-full px-2"
                  style={{ fontSize: 8, letterSpacing: ".5px", background: "#6A4FC9", zIndex: 1 }}
                >
                  NUEVO
                </div>
              )}
              <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={40} glow />
              <div className="font-extrabold text-[#3a3349] truncate" style={{ fontSize: "clamp(9px,.9vw,12px)", maxWidth: 76 }}>
                {v.name}
              </div>
              <div className="font-bold text-[#a99fb6]" style={{ fontSize: "clamp(8px,.8vw,10px)" }}>
                {VOTE_LABEL[v.vote]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
