import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

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
    <html lang="ja" className={geist.variable}>
      <body className="min-h-screen font-[family-name:var(--font-geist)] antialiased">
        <div className="bg-mesh" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
