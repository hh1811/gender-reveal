import { NextResponse } from "next/server";
import { insertVote } from "@/lib/store";

const simNames = [
  "Lucía", "Mateo", "Daniela", "Emiliano", "Renata", "Santiago",
  "Isabella", "Gael", "Ximena", "Leonardo", "Victoria", "Sebastián", "Romina", "Adrián", "Paola",
];
const simMsgs = [
  "¡Felicidades a los futuros papás!",
  "Mi corazón dice que sí.",
  "Que llegue con mucha salud.",
  "No puedo esperar a conocer al bebé.",
  "Será amado por toda la familia.",
  "",
];

export async function POST() {
  const name = simNames[Math.floor(Math.random() * simNames.length)];
  const vote = Math.random() < 0.5 ? "nino" : "nina";
  const message = simMsgs[Math.floor(Math.random() * simMsgs.length)] || null;
  const created = await insertVote({ name, vote, message, nameNino: null, nameNina: null, photoUrl: null });
  return NextResponse.json({ vote: created });
}
