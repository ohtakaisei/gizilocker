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
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">録音</h2>
      <div className="flex items-center gap-4">
        {recording ? (
          <button
            onClick={onStop}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            停止
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={disabled}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            録音開始
          </button>
        )}

        <div className="flex items-center gap-2">
          {recording && (
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          <span className="text-2xl font-mono tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>
      </div>
    </div>
  );
}
