"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  markdown: string;
}

export default function MinutesDisplay({ markdown }: Props) {
  return (
    <div className="bg-white rounded-lg border p-6 prose prose-sm max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
