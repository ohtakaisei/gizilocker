"use client";

interface Props {
  onClick: () => void;
  generating: boolean;
  disabled: boolean;
}

export default function GenerateButton({
  onClick,
  generating,
  disabled,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || generating}
      className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {generating ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          議事録を生成中...
        </span>
      ) : (
        "議事録を生成"
      )}
    </button>
  );
}
