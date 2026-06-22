import { NextResponse } from "next/server";
import { resetVotes } from "@/lib/store";

export async function POST() {
  await resetVotes();
  return NextResponse.json({ ok: true });
}
