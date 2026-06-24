"use client";

import { useEffect, useRef, useState } from "react";
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

  const items = votes.slice(-24).reverse();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let dir = 1;
    let raf = 0;
    function step(target: HTMLDivElement) {
      const max = target.scrollWidth - target.clientWidth;
      if (max <= 1) {
        raf = requestAnimationFrame(() => step(target));
        return;
      }
      target.scrollLeft += 0.5 * dir;
      if (target.scrollLeft >= max) dir = -1;
      else if (target.scrollLeft <= 0) dir = 1;
      raf = requestAnimationFrame(() => step(target));
    }
    raf = requestAnimationFrame(() => step(el));
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div ref={trackRef} className="overflow-x-hidden" style={{ paddingTop: 18 }}>
      <div className="flex items-center justify-center" style={{ gap: "clamp(27px,3.6vw,60px)", width: "max-content" }}>
        {items.map((v) => {
          const isNew = now - new Date(v.createdAt).getTime() < NEW_BADGE_MS;
          return (
            <div key={v.id} className="flex flex-col items-center relative" style={{ gap: 6 }}>
              {isNew && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 font-extrabold text-white rounded-full px-3 whitespace-nowrap"
                  style={{ fontSize: 12, letterSpacing: ".5px", background: "#6A4FC9", zIndex: 1 }}
                >
                  NUEVO
                </div>
              )}
              <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={60} glow />
              <div className="font-extrabold text-[#3a3349] truncate" style={{ fontSize: "clamp(13px,1.35vw,18px)", maxWidth: 114 }}>
                {v.name}
              </div>
              <div className="font-bold text-[#a99fb6]" style={{ fontSize: "clamp(12px,1.2vw,15px)" }}>
                {VOTE_LABEL[v.vote]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
