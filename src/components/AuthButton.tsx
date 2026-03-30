"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import LoginModal from "./LoginModal";
import StatsModal from "./StatsModal";
import RankBadge from "./RankBadge";
import { useUserStats } from "@/src/hooks/useUserStats";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { rank } = useUserStats();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 rounded-xl bg-studio-panel animate-pulse" />
    );
  }

  return (
    <>
      {session?.user ? (
        // Logged in: show avatar + rank
        <button
          onClick={() => setShowStats(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-studio-border/50 hover:border-studio-muted/50 bg-studio-panel/60 hover:bg-studio-panel transition-all"
        >
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-audiowide text-amber-400 text-xs">
              {(session.user.name || session.user.email || "?")[0].toUpperCase()}
            </div>
          )}
          {rank ? (
            <RankBadge rank={rank} size="sm" />
          ) : (
            <span className="font-mono text-xs text-studio-muted">
              {session.user.name || "プレイヤー"}
            </span>
          )}
        </button>
      ) : (
        // Not logged in: login button
        <button
          onClick={() => setShowLogin(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-studio-border/60 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400 font-mono text-sm text-studio-muted transition-all"
        >
          ログイン
        </button>
      )}

      <AnimatePresence>
        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )}
        {showStats && session?.user && (
          <StatsModal
            userName={session.user.name}
            userEmail={session.user.email}
            userImage={session.user.image}
            onClose={() => setShowStats(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
