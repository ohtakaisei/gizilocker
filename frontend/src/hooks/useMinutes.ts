"use client";

import { useState, useCallback } from "react";
import { generateMinutes } from "@/lib/api";
import type { MinutesResponse } from "@/types";

export function useMinutes(sessionId: string | null) {
  const [result, setResult] = useState<MinutesResponse | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (meetingName?: string) => {
      if (!sessionId) return;
      setGenerating(true);
      setError(null);
      try {
        const res = await generateMinutes(sessionId, meetingName);
        setResult(res);
        return res;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
      } finally {
        setGenerating(false);
      }
    },
    [sessionId]
  );

  return { result, generating, error, generate };
}
