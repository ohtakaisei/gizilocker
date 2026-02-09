"use client";

import { useState, useCallback } from "react";
import { createSession, deleteSession } from "@/lib/api";
import type { SessionResponse } from "@/types";

export function useSession() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const start = useCallback(async (meetingName: string) => {
    setLoading(true);
    try {
      const s = await createSession(meetingName);
      setSession(s);
      return s;
    } finally {
      setLoading(false);
    }
  }, []);

  const end = useCallback(async () => {
    if (session) {
      await deleteSession(session.session_id);
      setSession(null);
    }
  }, [session]);

  return { session, loading, start, end };
}
