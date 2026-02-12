"use client";

interface Props {
  recording: boolean;
  elapsed: number;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function RecordingControls({
  recording,
  elapsed,
  onStart,
  onStop,
  disabled,
}: Props) {
  return (
    <div className="glass-card-static p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Recording button */}
          {recording ? (
            <button
              onClick={onStop}
              className="group relative w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center transition-all hover:bg-red-500/20 hover:border-red-500/30 hover:scale-105 active:scale-95"
            >
              {/* Pulse rings */}
              <span className="recording-ring absolute inset-0" />
              <span className="recording-ring absolute inset-0" />
              <span className="recording-ring absolute inset-0" />
              {/* Stop icon */}
              <span className="w-4 h-4 rounded-sm bg-red-500" />
            </button>
          ) : (
            <button
              onClick={onStart}
              disabled={disabled}
              className="group relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-violet-500/10 hover:border-violet-500/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-violet-400 transition-colors">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </button>
          )}

          {/* Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {recording && (
                <div className="flex items-center gap-1.5">
                  <span className="recording-dot" />
                  <span className="text-red-400 text-sm font-medium">REC</span>
                </div>
              )}
              <span className="text-3xl font-mono tabular-nums font-light tracking-wider text-zinc-200">
                {formatTime(elapsed)}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {recording
                ? "録音中 ─ クリックで停止"
                : elapsed > 0
                  ? "録音停止済み"
                  : "録音待機中"}
            </p>
          </div>
        </div>

        {/* Waveform visualization */}
        {recording && (
          <div className="flex items-center gap-1 h-8">
            <span className="waveform-bar" />
            <span className="waveform-bar" />
            <span className="waveform-bar" />
            <span className="waveform-bar" />
            <span className="waveform-bar" />
          </div>
        )}
      </div>
    </div>
  );
}
