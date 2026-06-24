import type { Vote, VoteChoice } from "./types";

export interface NameTally {
  name: string;
  count: number;
}

const FIELD: Record<VoteChoice, "nameNino" | "nameNina"> = { nino: "nameNino", nina: "nameNina" };

export function topNameSuggestions(votes: Vote[], choice: VoteChoice, limit = 3): NameTally[] {
  const field = FIELD[choice];
  const counts = new Map<string, number>();
  for (const v of votes) {
    const raw = v[field];
    if (!raw) continue;
    const key = raw.trim();
    if (!key) continue;
    const normalized = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
