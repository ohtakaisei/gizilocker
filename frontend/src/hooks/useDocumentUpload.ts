"use client";

import { useState, useCallback } from "react";
import { uploadDocument } from "@/lib/api";
import type { DocumentResponse } from "@/types";

export function useDocumentUpload(sessionId: string | null) {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      if (!sessionId) return;
      setUploading(true);
      try {
        const doc = await uploadDocument(sessionId, file);
        setDocuments((prev) => [...prev, doc]);
        return doc;
      } finally {
        setUploading(false);
      }
    },
    [sessionId]
  );

  return { documents, uploading, upload };
}
