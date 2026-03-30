"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Score } from "@/src/store/gameStore";

interface ScoreBarProps {
  score: Score;
}

export default function ScoreBar({ score }: ScoreBarProps) {
  const accuracy =
    score.total === 0
      ? "--"
      : `${Math.round((score.correct / score.total) * 100)}%`;

  return (
    <div className="flex items-center gap-6 font-mono text-sm">
      {/* Correct / Total */}
      <div className="flex items-center gap-2">
        <span className="text-studio-muted text-xs tracking-widest uppercase">Score</span>
        <span className="text-white font-bold">
          <span className="text-amber-400">{score.correct}</span>
          <span className="text-studio-muted">/{score.total}</span>
        </span>
      </div>

      {/* Accuracy */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-studio-muted text-xs tracking-widest uppercase">Acc</span>
        <span className="text-white">{accuracy}</span>
      </div>

      {/* Streak */}
      <AnimatePresence mode="wait">
        {score.streak > 0 && (
          <motion.div
            key={score.streak}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30"
          >
            <span className="text-amber-400">🔥</span>
            <span className="text-amber-300 font-bold">{score.streak}</span>
            <span className="text-amber-500/70 text-xs">streak</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
