"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import RankBadge from "./RankBadge";
import {
  type Rank,
  type RankTier,
  RANKS,
  getNextRank,
  getRankProgress,
} from "@/src/lib/rankSystem";

interface PlayRecord {
  id: string;
  correct: boolean;
  chordType: string;
  guessed: string;
  playedAt: string;
}

interface StatsData {
  total: number;
  correct: number;
  accuracy: number;
  rank: Rank;
  recent: PlayRecord[];
}

interface StatsModalProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  onClose: () => void;
}

const CHORD_LABELS: Record<string, string> = {
  major: "Major",
  minor: "Minor",
  major7: "Major 7",
  minor7: "Minor 7",
  dom7: "Dom 7",
  minorb5: "Minor ♭5",
  minor7b5: "Minor 7♭5",
};

export default function StatsModal({
  userName,
  userEmail,
  userImage,
  onClose,
}: StatsModalProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const nextRank = stats ? getNextRank(stats.rank.tier as RankTier) : null;
  const progress =
    stats && nextRank
      ? getRankProgress(stats.total, stats.accuracy, stats.rank.tier as RankTier)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel p-6 rounded-2xl border border-studio-border bg-studio-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={userName ?? ""}
                  className="w-10 h-10 rounded-full border border-studio-border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-audiowide text-amber-400 text-sm">
                  {(userName || userEmail || "?")[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-mono text-sm font-bold">
                  {userName || "プレイヤー"}
                </p>
                <p className="text-studio-muted font-mono text-xs">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-studio-muted hover:text-white transition-colors font-mono"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <p className="font-mono text-sm text-studio-muted animate-pulse">
                読み込み中...
              </p>
            </div>
          ) : stats ? (
            <>
              {/* Current Rank */}
              <div
                className="rounded-xl p-5 mb-5 border text-center"
                style={{
                  backgroundColor: stats.rank.bgColor,
                  borderColor: stats.rank.borderColor,
                }}
              >
                <p className="font-mono text-xs text-studio-muted mb-2 tracking-widest uppercase">
                  現在のランク
                </p>
                <RankBadge rank={stats.rank} size="lg" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {
                    label: "総プレイ数",
                    value: stats.total,
                    unit: "回",
                  },
                  {
                    label: "正解数",
                    value: stats.correct,
                    unit: "回",
                    color: "text-amber-400",
                  },
                  {
                    label: "正答率",
                    value: `${Math.round(stats.accuracy)}`,
                    unit: "%",
                    color:
                      stats.accuracy >= 75
                        ? "text-emerald-400"
                        : stats.accuracy >= 50
                        ? "text-amber-400"
                        : "text-red-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 bg-studio-bg/40 border border-studio-border/50 text-center"
                  >
                    <p
                      className={`font-mono text-xl font-bold ${stat.color || "text-white"}`}
                    >
                      {stat.value}
                      <span className="text-xs text-studio-muted ml-0.5">
                        {stat.unit}
                      </span>
                    </p>
                    <p className="font-mono text-xs text-studio-muted mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Next Rank Progress */}
              {nextRank && progress ? (
                <div className="rounded-xl p-4 mb-5 bg-studio-bg/40 border border-studio-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-xs text-studio-muted tracking-widest uppercase">
                      次のランクまで
                    </p>
                    <RankBadge rank={nextRank} size="sm" />
                  </div>
                  <div className="space-y-2">
                    <ProgressBar
                      label={`プレイ数 ${stats.total}/${nextRank.minPlays}回`}
                      value={progress.playsProgress}
                      color={nextRank.color}
                    />
                    <ProgressBar
                      label={`正答率 ${Math.round(stats.accuracy)}/${nextRank.minAccuracy}%`}
                      value={progress.accuracyProgress}
                      color={nextRank.color}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 mb-5 text-center border border-studio-border/50 bg-studio-bg/40">
                  <p className="font-mono text-xs text-studio-muted">
                    最高ランクに到達しました
                  </p>
                  <p className="font-mono text-sm text-amber-400 mt-1">
                    DIAMOND MASTER
                  </p>
                </div>
              )}

              {/* Rank Table */}
              <div className="rounded-xl mb-5 overflow-hidden border border-studio-border/50">
                <div className="px-4 py-2.5 bg-studio-bg/60 border-b border-studio-border/50">
                  <p className="font-mono text-xs text-studio-muted tracking-widest uppercase">
                    ランク一覧
                  </p>
                </div>
                <div className="divide-y divide-studio-border/30">
                  {RANKS.map((rank) => {
                    const isCurrent = rank.tier === stats.rank.tier;
                    return (
                      <div
                        key={rank.tier}
                        className={`flex items-center justify-between px-4 py-2.5 ${
                          isCurrent ? "bg-studio-panel/60" : ""
                        }`}
                      >
                        <RankBadge rank={rank} size="sm" />
                        <span className="font-mono text-xs text-studio-muted">
                          {rank.minPlays}回以上 &amp; {rank.minAccuracy}%以上
                        </span>
                        {isCurrent && (
                          <span className="font-mono text-xs text-amber-400">
                            ← NOW
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent History */}
              {stats.recent.length > 0 && (
                <div className="rounded-xl mb-5 overflow-hidden border border-studio-border/50">
                  <div className="px-4 py-2.5 bg-studio-bg/60 border-b border-studio-border/50">
                    <p className="font-mono text-xs text-studio-muted tracking-widest uppercase">
                      最近のプレイ履歴
                    </p>
                  </div>
                  <div className="divide-y divide-studio-border/20 max-h-52 overflow-y-auto">
                    {stats.recent.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between px-4 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs ${
                              record.correct
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {record.correct ? "✓" : "✗"}
                          </span>
                          <span className="font-mono text-xs text-white">
                            {CHORD_LABELS[record.chordType] || record.chordType}
                          </span>
                        </div>
                        {!record.correct && (
                          <span className="font-mono text-xs text-studio-muted">
                            → {CHORD_LABELS[record.guessed] || record.guessed}と回答
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.total === 0 && (
                <div className="text-center py-4 mb-4">
                  <p className="font-mono text-sm text-studio-muted">
                    まだプレイ記録がありません
                  </p>
                  <p className="font-mono text-xs text-studio-muted/60 mt-1">
                    ゲームをプレイしてランクを上げよう！
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="font-mono text-sm text-red-400">
                データの取得に失敗しました
              </p>
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-2.5 rounded-xl border border-studio-border/50 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 font-mono text-sm text-studio-muted transition-all"
          >
            ログアウト
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-xs text-studio-muted">{label}</span>
        <span className="font-mono text-xs" style={{ color }}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-1.5 bg-studio-bg rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
