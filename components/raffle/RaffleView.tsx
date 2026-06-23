"use client";

import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { useRafflePhase } from "@/lib/useRafflePhase";
import { RaffleScreen } from "./RaffleScreen";

export function RaffleView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const phase = useRafflePhase(settings.raffleDrawnAt);
  const eligible = settings.reveal === "none" ? [] : votes.filter((v) => v.vote === settings.reveal);

  return <RaffleScreen phase={phase} eligible={eligible} winner={settings.raffleWinner} />;
}
