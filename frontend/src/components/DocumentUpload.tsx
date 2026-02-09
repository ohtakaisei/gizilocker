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
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">参考資料アップロード</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
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
          <p className="text-gray-500">アップロード中...</p>
        ) : (
          <p className="text-gray-500">
            PDF / テキストファイルをドラッグ&ドロップ
            <br />
            またはクリックして選択
          </p>
        )}
      </div>

      {documents.length > 0 && (
        <ul className="space-y-1 text-sm">
          {documents.map((doc, i) => (
            <li key={i} className="flex justify-between bg-white p-2 rounded border">
              <span className="truncate">{doc.filename}</span>
              <span className="text-gray-400 ml-2 shrink-0">
                {doc.chunk_count} チャンク
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
