import { NextRequest, NextResponse } from "next/server";
import { setReveal, setRaffleWinner } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reveal = body.reveal;
  if (reveal !== "none" && reveal !== "nino" && reveal !== "nina") {
    return NextResponse.json({ error: "invalid reveal" }, { status: 400 });
  }
  await setReveal(reveal);
  await setRaffleWinner(null);
  return NextResponse.json({ ok: true });
}
