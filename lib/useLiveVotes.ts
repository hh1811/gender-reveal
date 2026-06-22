"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabaseBrowser";
import type { VotesPayload } from "./types";

export function useLiveVotes(initial: VotesPayload): VotesPayload {
  const [data, setData] = useState(initial);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/votes", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {
      // ignore transient network errors; next poll/event will retry
    }
  }, []);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      const id = setInterval(refresh, 2000);
      return () => clearInterval(id);
    }
    const channel = sb
      .channel("votes-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "event_settings" }, refresh)
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [refresh]);

  return data;
}
