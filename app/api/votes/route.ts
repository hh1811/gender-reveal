import { NextRequest, NextResponse } from "next/server";
import { getVotesPayload, insertVote, uploadPhoto } from "@/lib/store";

export async function GET() {
  const payload = await getVotesPayload();
  return NextResponse.json(payload);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name || "").trim() || "Invitado";
  const vote = body.vote === "nino" || body.vote === "nina" ? body.vote : null;
  if (!vote) {
    return NextResponse.json({ error: "vote is required" }, { status: 400 });
  }
  const message = typeof body.message === "string" && body.message.trim() ? body.message.trim() : null;
  const nameNino = typeof body.nameNino === "string" && body.nameNino.trim() ? body.nameNino.trim() : null;
  const nameNina = typeof body.nameNina === "string" && body.nameNina.trim() ? body.nameNina.trim() : null;
  const photoDataUrl = typeof body.photo === "string" && body.photo ? body.photo : null;

  let photoUrl: string | null = null;
  if (photoDataUrl) {
    try {
      photoUrl = await uploadPhoto(photoDataUrl);
    } catch (err) {
      console.error("uploadPhoto failed, registering vote without photo:", err);
    }
  }

  const created = await insertVote({ name, vote, message, nameNino, nameNina, photoUrl });
  return NextResponse.json({ vote: created });
}
