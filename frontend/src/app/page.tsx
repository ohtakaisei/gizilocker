"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useMinutes } from "@/hooks/useMinutes";
import DocumentUpload from "@/components/DocumentUpload";
import RecordingControls from "@/components/RecordingControls";
import RecordingHealth from "@/components/RecordingHealth";
import GenerateButton from "@/components/GenerateButton";
import MinutesDisplay from "@/components/MinutesDisplay";
import DownloadCopy from "@/components/DownloadCopy";

export default function Home() {
  const [meetingName, setMeetingName] = useState("");
  const { session, loading: sessionLoading, start: startSession } = useSession();
  const sessionId = session?.session_id ?? null;

  const { recording, elapsed, chunks, startRecording, stopRecording } =
    useAudioRecorder(sessionId);
  const { documents, uploading, upload } = useDocumentUpload(sessionId);
  const { result, generating, error, generate } = useMinutes(sessionId);

  const handleStart = async () => {
    const name = meetingName.trim() || "無題の会議";
    const s = await startSession(name);
    if (s) {
      await startRecording();
    }
  };

  const handleGenerate = () => {
    generate(meetingName.trim() || undefined);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Gizilocker</h1>
        <p className="text-gray-500 mt-1">
          会議音声から構造化された議事録を自動生成
        </p>
      </header>

      {/* Meeting name + start */}
      <section className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="会議名を入力（任意）"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            disabled={!!session}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {!session && (
            <button
              onClick={handleStart}
              disabled={sessionLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {sessionLoading ? "準備中..." : "会議を開始"}
            </button>
          )}
        </div>
      </section>

      {session && (
        <>
          {/* Health indicator */}
          <RecordingHealth
            chunks={chunks}
            documents={documents.length}
            recording={recording}
          />

          {/* Recording controls */}
          <RecordingControls
            recording={recording}
            elapsed={elapsed}
            onStart={startRecording}
            onStop={stopRecording}
            disabled={!session}
          />

          {/* Document upload */}
          <DocumentUpload
            documents={documents}
            uploading={uploading}
            onUpload={upload}
            disabled={!session}
          />

          {/* Generate minutes */}
          <GenerateButton
            onClick={handleGenerate}
            generating={generating}
            disabled={!session || recording || chunks === 0}
          />

          {error && (
            <p className="text-red-600 text-sm">エラー: {error}</p>
          )}

          {/* Minutes display */}
          {result && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">議事録</h2>
                <DownloadCopy
                  markdown={result.minutes}
                  meetingName={session.meeting_name}
                />
              </div>
              <MinutesDisplay markdown={result.minutes} />
            </section>
          )}
        </>
      )}
    </main>
  );
}
