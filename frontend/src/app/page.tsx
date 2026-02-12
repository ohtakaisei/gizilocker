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

  /* ── Welcome Screen (no session) ── */
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center space-y-10 fade-in">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold tracking-tight gradient-text">
              Gizilocker
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              会議を録音するだけで、AIが<br />
              構造化された議事録を自動生成
            </p>
          </div>

          {/* Input & Start */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="会議名を入力..."
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              className="input-dark w-full px-5 py-4 text-base"
            />
            <button
              onClick={handleStart}
              disabled={sessionLoading}
              className="btn-gradient w-full py-4 text-base"
            >
              <span className="flex items-center justify-center gap-2.5">
                {sessionLoading ? (
                  <>
                    <span className="spinner" />
                    準備中...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                    会議を開始する
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 fade-in-delay">
            {[
              { icon: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", label: "音声録音" },
              { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z", label: "資料参照" },
              { icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2", label: "議事録生成" },
            ].map((f, i) => (
              <div key={i} className="glass-card p-4 space-y-2">
                <div className="mx-auto w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                    <path d={f.icon} />
                  </svg>
                </div>
                <p className="text-xs text-zinc-500 font-medium">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ── Active Session ── */
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-20 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between fade-in">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/15">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">Gizilocker</h1>
            <p className="text-xs text-zinc-500">{session.meeting_name}</p>
          </div>
        </div>
        <RecordingHealth
          chunks={chunks}
          documents={documents.length}
          recording={recording}
        />
      </header>

      {/* Recording */}
      <div className="fade-in-delay">
        <RecordingControls
          recording={recording}
          elapsed={elapsed}
          onStart={startRecording}
          onStop={stopRecording}
          disabled={!session}
        />
      </div>

      {/* Document Upload */}
      <div className="fade-in-delay-2">
        <DocumentUpload
          documents={documents}
          uploading={uploading}
          onUpload={upload}
          disabled={!session}
        />
      </div>

      {/* Generate */}
      <div className="fade-in-delay-3">
        <GenerateButton
          onClick={handleGenerate}
          generating={generating}
          disabled={!session || recording || chunks === 0}
        />
      </div>

      {error && (
        <div className="glass-card-static p-4 border-red-500/20 fade-in">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Minutes Result */}
      {result && (
        <section className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              議事録
            </h2>
            <DownloadCopy
              markdown={result.minutes}
              meetingName={session.meeting_name}
            />
          </div>
          <MinutesDisplay markdown={result.minutes} />
        </section>
      )}
    </main>
  );
}
