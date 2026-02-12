"use client";

interface Props {
  chunks: number;
  documents: number;
  recording: boolean;
}

export default function RecordingHealth({
  chunks,
  documents,
  recording,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="status-badge">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            recording ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-zinc-600"
          }`}
        />
        <span className="text-zinc-400">
          {recording ? "録音中" : "待機中"}
        </span>
      </span>

      <span className="status-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        </svg>
        <span className="text-zinc-400">{chunks}</span>
      </span>

      <span className="status-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="text-zinc-400">{documents}</span>
      </span>
    </div>
  );
}
