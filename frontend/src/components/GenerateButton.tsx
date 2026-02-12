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
      className="btn-generate w-full px-6 py-4 text-base"
    >
      {generating ? (
        <span className="relative z-10 flex items-center justify-center gap-2.5">
          <span className="spinner" />
          AIが議事録を生成中...
        </span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
          議事録を生成する
        </span>
      )}
    </button>
  );
}
