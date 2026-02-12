"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  markdown: string;
}

export default function MinutesDisplay({ markdown }: Props) {
  return (
    <div className="glass-card-static p-8 prose prose-dark max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-3 prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-200 prose-blockquote:border-l-violet-500 prose-blockquote:bg-white/[0.03] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-table:border-collapse prose-th:bg-white/[0.04] prose-th:border prose-th:border-white/10 prose-th:px-4 prose-th:py-2.5 prose-td:border prose-td:border-white/[0.06] prose-td:px-4 prose-td:py-2.5 prose-li:marker:text-zinc-600 prose-hr:border-white/10">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
