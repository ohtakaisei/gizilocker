"use client";

import { useCallback, useState } from "react";
import type { DocumentResponse } from "@/types";

interface Props {
  documents: DocumentResponse[];
  uploading: boolean;
  onUpload: (file: File) => Promise<DocumentResponse | undefined>;
  disabled: boolean;
}

export default function DocumentUpload({
  documents,
  uploading,
  onUpload,
  disabled,
}: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((f) => onUpload(f));
    },
    [onUpload]
  );

  return (
    <div className="glass-card-static p-6 space-y-4">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" x2="12" y1="18" y2="12" />
          <polyline points="9 15 12 12 15 15" />
        </svg>
        <h2 className="text-sm font-medium text-zinc-300">参考資料</h2>
        {documents.length > 0 && (
          <span className="text-xs text-zinc-600 ml-auto">{documents.length}件</span>
        )}
      </div>

      <div
        className={`drop-zone p-6 text-center cursor-pointer ${
          dragOver ? "active" : ""
        } ${disabled ? "opacity-30 pointer-events-none" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (disabled) return;
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".pdf,.txt,.md";
          input.multiple = true;
          input.onchange = () => handleFiles(input.files);
          input.click();
        }}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="spinner" />
            <span className="text-sm text-zinc-400">アップロード中...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">
              ドラッグ&ドロップ or クリックで選択
            </p>
            <p className="text-xs text-zinc-600">PDF, TXT, MD</p>
          </div>
        )}
      </div>

      {documents.length > 0 && (
        <ul className="space-y-1.5">
          {documents.map((doc, i) => (
            <li
              key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="text-sm text-zinc-300 truncate">{doc.filename}</span>
              </div>
              <span className="text-xs text-zinc-600 ml-3 shrink-0">
                {doc.chunk_count} chunks
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
