import "server-only";
import { isSupabaseConfigured } from "./env";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { mockStore } from "./mockStore";
import type { EventSettings, Reveal, Vote, VotesPayload } from "./types";

type VoteRow = {
  id: string;
  name: string;
  vote: "nino" | "nina";
  message: string | null;
  photo_url: string | null;
  created_at: string;
};

function rowToVote(r: VoteRow): Vote {
  return { id: r.id, name: r.name, vote: r.vote, message: r.message, photoUrl: r.photo_url, createdAt: r.created_at };
}

export async function getVotesPayload(): Promise<VotesPayload> {
  if (!isSupabaseConfigured) {
    return { votes: mockStore.getVotes(), settings: mockStore.getSettings() };
  }
  const sb = getSupabaseAdmin()!;
  const [votesRes, settingsRes] = await Promise.all([
    sb.from("votes").select("*").order("created_at", { ascending: true }),
    sb.from("event_settings").select("*").eq("id", 1).single(),
  ]);
  if (votesRes.error) throw votesRes.error;
  if (settingsRes.error) throw settingsRes.error;
  const votes = (votesRes.data as VoteRow[]).map(rowToVote);
  const settings: EventSettings = {
    reveal: settingsRes.data.reveal,
    parentNames: settingsRes.data.parent_names,
  };
  return { votes, settings };
}

export async function insertVote(input: {
  name: string;
  vote: "nino" | "nina";
  message: string | null;
  photoUrl: string | null;
}): Promise<Vote> {
  if (!isSupabaseConfigured) {
    return mockStore.insertVote(input);
  }
  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("votes")
    .insert({ name: input.name, vote: input.vote, message: input.message, photo_url: input.photoUrl })
    .select("*")
    .single();
  if (error) throw error;
  return rowToVote(data as VoteRow);
}

export async function setReveal(reveal: Reveal): Promise<void> {
  if (!isSupabaseConfigured) {
    mockStore.setReveal(reveal);
    return;
  }
  const sb = getSupabaseAdmin()!;
  const { error } = await sb.from("event_settings").update({ reveal, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) throw error;
}

export async function resetVotes(): Promise<void> {
  if (!isSupabaseConfigured) {
    mockStore.resetVotes();
    return;
  }
  const sb = getSupabaseAdmin()!;
  const { error: delErr } = await sb.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;
  const { error: revErr } = await sb
    .from("event_settings")
    .update({ reveal: "none", updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (revErr) throw revErr;
}

const PHOTO_BUCKET = "vote-photos";

export async function uploadPhoto(dataUrl: string): Promise<string | null> {
  if (!isSupabaseConfigured) {
    return dataUrl;
  }
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const [, mime, base64] = match;
  const ext = mime.split("/")[1] || "jpg";
  const buffer = Buffer.from(base64, "base64");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const sb = getSupabaseAdmin()!;
  const { error } = await sb.storage.from(PHOTO_BUCKET).upload(path, buffer, { contentType: mime, upsert: false });
  if (error) throw error;
  const { data } = sb.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
