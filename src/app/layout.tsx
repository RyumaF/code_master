import type { Metadata } from "next";
import { Audiowide, Space_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/src/lib/auth";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="ja"
      className={`${audiowide.variable} ${spaceMono.variable}`}
    >
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
