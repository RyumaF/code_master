import type { Metadata } from "next";
import { Audiowide, Space_Mono } from "next/font/google";
import "./globals.css";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "codeMaster | 耳コピトレーニング",
  description:
    "Major / Minor / 7th — コードタイプを聴き分けてスコアを競うトレーニングゲーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${audiowide.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
