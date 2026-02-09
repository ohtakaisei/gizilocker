import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gizilocker - AI議事録生成",
  description: "会議音声から構造化された議事録を自動生成",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
