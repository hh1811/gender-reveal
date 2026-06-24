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
  const railRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let raf = 0;
    const step = () => {
      const half = el.scrollWidth / 2;
      if (half > 0) {
        offsetRef.current += 0.5;
        if (offsetRef.current >= half) offsetRef.current -= half;
        el.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div className="overflow-x-hidden" style={{ paddingTop: 18 }}>
      <div ref={railRef} className="flex items-center" style={{ gap: "clamp(27px,3.6vw,60px)", width: "max-content" }}>
        {loop.map((v, i) => {
          const isNew = now - new Date(v.createdAt).getTime() < NEW_BADGE_MS;
          return (
            <div key={`${v.id}-${i}`} className="flex flex-col items-center relative" style={{ gap: 6 }}>
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
