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
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            recording ? "bg-green-500" : "bg-gray-300"
          }`}
        />
        <span className="text-gray-600">
          {recording ? "録音中" : "待機中"}
        </span>
      </div>
      <div className="text-gray-500">チャンク: {chunks}</div>
      <div className="text-gray-500">資料: {documents}</div>
    </div>
  );
}
