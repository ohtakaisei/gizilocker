import type {
  SessionResponse,
  DocumentResponse,
  MinutesResponse,
  SessionHealthResponse,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API = `${BASE}/api/v1`;

export async function createSession(
  meetingName: string
): Promise<SessionResponse> {
  const res = await fetch(`${API}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meeting_name: meetingName }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function deleteSession(sessionId: string): Promise<void> {
  await fetch(`${API}/sessions/${sessionId}`, { method: "DELETE" });
}

export async function uploadDocument(
  sessionId: string,
  file: File
): Promise<DocumentResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/sessions/${sessionId}/documents`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function generateMinutes(
  sessionId: string,
  meetingName?: string
): Promise<MinutesResponse> {
  const res = await fetch(`${API}/sessions/${sessionId}/generate-minutes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meeting_name: meetingName }),
  });
  if (!res.ok) throw new Error("Failed to generate minutes");
  return res.json();
}

export async function getSessionHealth(
  sessionId: string
): Promise<SessionHealthResponse> {
  const res = await fetch(`${API}/sessions/${sessionId}/health`);
  if (!res.ok) throw new Error("Failed to get session health");
  return res.json();
}

export function audioWsUrl(sessionId: string): string {
  const wsBase = BASE.replace(/^http/, "ws");
  return `${wsBase}/api/v1/sessions/${sessionId}/audio`;
}
