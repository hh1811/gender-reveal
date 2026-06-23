"use client";

import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { useRevealPhase } from "@/lib/useRevealPhase";
import { RevealScreen } from "./RevealScreen";

export function RevealView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const phase = useRevealPhase(settings.reveal);

  if (settings.reveal === "none") {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#faf6f0]">
        <span className="w-3 h-3 rounded-full bg-[#B9A7F7] animate-gr-pulse mb-4" />
        <div className="font-extrabold tracking-[3px] text-[#a99fb6]" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
          PREPARANDO LA REVELACIÓN
        </div>
      </div>
    );
  }

  return <RevealScreen reveal={settings.reveal} phase={phase} votes={votes} />;
}
