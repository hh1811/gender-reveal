import { NextResponse } from "next/server";
import { getVotesPayload, setRaffleWinner } from "@/lib/store";

export async function POST() {
  try {
    const { votes, settings } = await getVotesPayload();
    if (settings.reveal === "none") {
      return NextResponse.json({ error: "Primero revela el resultado" }, { status: 400 });
    }
    const eligible = votes.filter((v) => v.vote === settings.reveal);
    if (eligible.length === 0) {
      return NextResponse.json({ error: "No hay invitados que hayan acertado" }, { status: 400 });
    }
    const winner = eligible[Math.floor(Math.random() * eligible.length)];
    await setRaffleWinner({ id: winner.id, name: winner.name });
    return NextResponse.json({ winner: { id: winner.id, name: winner.name } });
  } catch (err) {
    console.error("raffle draw failed:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `No se pudo sortear: ${message}` }, { status: 500 });
  }
}
