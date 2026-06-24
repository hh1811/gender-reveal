"use client";

import type { VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { useRafflePhase } from "@/lib/useRafflePhase";
import { RaffleScreen } from "./RaffleScreen";

export function RaffleView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const phase = useRafflePhase(settings.raffleDrawnAt);
  const revealed = settings.reveal !== "none";
  const eligible = revealed ? votes.filter((v) => v.vote === settings.reveal) : [];
  const winnerVote = settings.raffleWinner ? votes.find((v) => v.id === settings.raffleWinner!.id) || null : null;

  return <RaffleScreen phase={phase} eligible={eligible} winner={settings.raffleWinner} winnerVote={winnerVote} revealed={revealed} />;
}
