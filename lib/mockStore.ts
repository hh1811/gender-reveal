import "server-only";
import type { EventSettings, RaffleWinner, Vote } from "./types";

interface MockState {
  votes: Vote[];
  settings: EventSettings;
}

const seed: Array<[string, "nino" | "nina", string, number]> = [
  ["Mariana", "nina", "Tiene cara de princesa, estoy segura.", 42],
  ["Carlos", "nino", "¡Va a ser todo un campeón!", 39],
  ["Ana", "nina", "El instinto de tía nunca falla.", 35],
  ["Luis", "nino", "Apuesto por el niño, sin dudarlo.", 31],
  ["Sofía", "nina", "Pura calma… definitivamente niña.", 27],
  ["Diego", "nino", "Niño. Ya le compré el balón.", 24],
  ["Regina", "nina", "Rosa todo el camino, felicidades.", 20],
  ["Pablo", "nino", "", 17],
  ["Fernanda", "nina", "No puedo esperar a conocerla.", 14],
  ["Andrés", "nino", "Será igualito a su papá.", 11],
  ["Valeria", "nina", "Las niñas mandan en esta familia.", 8],
  ["Roberto", "nino", "Mi corazón dice niño.", 5],
  ["Camila", "nina", "Llegará llena de amor.", 3],
  ["Jorge", "nino", "", 1],
];

const NAME_SUGGESTIONS: Array<[string | null, string | null]> = [
  [null, "Valentina"],
  ["Mateo", null],
  [null, "Valentina"],
  ["Mateo", null],
  [null, "Emilia"],
  ["Santiago", null],
  [null, null],
  ["Mateo", null],
  [null, "Emilia"],
  ["Leonardo", null],
  [null, "Valentina"],
  ["Mateo", null],
  [null, "Emilia"],
  [null, null],
];

function buildSeed(): Vote[] {
  const now = Date.now();
  return seed.map(([name, vote, message, minsAgo], i) => ({
    id: "seed" + i,
    name,
    vote,
    message: message || null,
    nameNino: NAME_SUGGESTIONS[i]?.[0] ?? null,
    nameNina: NAME_SUGGESTIONS[i]?.[1] ?? null,
    photoUrl: null,
    createdAt: new Date(now - minsAgo * 60_000).toISOString(),
  }));
}

const globalForMock = globalThis as unknown as { __genderRevealMock?: MockState };

function getState(): MockState {
  if (!globalForMock.__genderRevealMock) {
    globalForMock.__genderRevealMock = {
      votes: buildSeed(),
      settings: {
        reveal: "none",
        parentNames: process.env.NEXT_PUBLIC_PARENT_NAMES || "Héctor y Liz",
        raffleWinner: null,
        raffleDrawnAt: null,
      },
    };
  }
  return globalForMock.__genderRevealMock;
}

export const mockStore = {
  getVotes(): Vote[] {
    return getState().votes;
  },
  getSettings(): EventSettings {
    return getState().settings;
  },
  insertVote(v: Omit<Vote, "id" | "createdAt">): Vote {
    const vote: Vote = { ...v, id: "v" + Date.now() + Math.random(), createdAt: new Date().toISOString() };
    getState().votes.push(vote);
    return vote;
  },
  resetVotes(): void {
    const s = getState();
    s.votes = [];
    s.settings.reveal = "none";
    s.settings.raffleWinner = null;
    s.settings.raffleDrawnAt = null;
  },
  setReveal(reveal: EventSettings["reveal"]): void {
    getState().settings.reveal = reveal;
  },
  setRaffleWinner(winner: RaffleWinner | null): void {
    const s = getState().settings;
    s.raffleWinner = winner;
    s.raffleDrawnAt = winner ? new Date().toISOString() : null;
  },
};
