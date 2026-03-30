"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { type Rank, type RankTier, calculateRank } from "@/src/lib/rankSystem";

interface UserStats {
  total: number;
  correct: number;
  accuracy: number;
  rank: Rank;
}

export function useUserStats() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [rank, setRank] = useState<Rank | null>(null);

  const refresh = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
      setRank(calculateRank(data.total, data.accuracy) as Rank);
    } catch {
      // Silently fail — stats are non-critical
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated") {
      refresh();
    } else {
      setStats(null);
      setRank(null);
    }
  }, [status, refresh]);

  const recordAnswer = useCallback(
    async (correct: boolean, chordType: string, guessed: string) => {
      if (!session?.user?.id) return;
      try {
        await fetch("/api/game/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correct, chordType, guessed }),
        });
        // Update local rank optimistically
        if (stats) {
          const newTotal = stats.total + 1;
          const newCorrect = stats.correct + (correct ? 1 : 0);
          const newAccuracy = (newCorrect / newTotal) * 100;
          const newRank = calculateRank(newTotal, newAccuracy);
          setStats({
            total: newTotal,
            correct: newCorrect,
            accuracy: newAccuracy,
            rank: newRank,
          });
          setRank(newRank);
        }
      } catch {
        // Silently fail — don't interrupt gameplay
      }
    },
    [session?.user?.id, stats]
  );

  return { stats, rank, recordAnswer, refresh };
}

export type { RankTier };
