"use client";

import { motion } from "framer-motion";
import { type ChordType, CHORD_DEFINITIONS } from "@/lib/audio/chordData";

// Chord-specific visual style (hardcoded to satisfy Tailwind's JIT scanner)
const CHORD_STYLES: Record<
  ChordType,
  {
    idle: string;
    glow: string;
    label: string;
    character: string;
  }
> = {
  major: {
    idle: "border-amber-500/25 hover:border-amber-500/70 hover:bg-amber-500/5",
    glow: "0 0 18px rgba(245,158,11,0.55)",
    label: "text-amber-400",
    character: "明るい・安定",
  },
  minor: {
    idle: "border-indigo-500/25 hover:border-indigo-500/70 hover:bg-indigo-500/5",
    glow: "0 0 18px rgba(99,102,241,0.55)",
    label: "text-indigo-400",
    character: "暗い・哀愁",
  },
  major7: {
    idle: "border-yellow-400/25 hover:border-yellow-400/70 hover:bg-yellow-400/5",
    glow: "0 0 18px rgba(250,204,21,0.55)",
    label: "text-yellow-300",
    character: "洗練・夢幻",
  },
  minor7: {
    idle: "border-violet-500/25 hover:border-violet-500/70 hover:bg-violet-500/5",
    glow: "0 0 18px rgba(139,92,246,0.55)",
    label: "text-violet-400",
    character: "クール・ジャジー",
  },
  "7": {
    idle: "border-orange-500/25 hover:border-orange-500/70 hover:bg-orange-500/5",
    glow: "0 0 18px rgba(249,115,22,0.55)",
    label: "text-orange-400",
    character: "ブルージー・緊張",
  },
  minorb5: {
    idle: "border-rose-500/25 hover:border-rose-500/70 hover:bg-rose-500/5",
    glow: "0 0 18px rgba(244,63,94,0.55)",
    label: "text-rose-400",
    character: "不安・ディミニッシュ",
  },
  minor7b5: {
    idle: "border-pink-500/25 hover:border-pink-500/70 hover:bg-pink-500/5",
    glow: "0 0 18px rgba(236,72,153,0.55)",
    label: "text-pink-400",
    character: "ハーフディミニッシュ",
  },
};

interface AnswerGridProps {
  onAnswer: (type: ChordType) => void;
  selectedAnswer: ChordType | null;
  correctAnswer: ChordType | null; // non-null in 'result' phase
  phase: "answering" | "result";
  disabled: boolean; // true before first play
}

export default function AnswerGrid({
  onAnswer,
  selectedAnswer,
  correctAnswer,
  phase,
  disabled,
}: AnswerGridProps) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-2 w-full max-w-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      {CHORD_DEFINITIONS.map((def, idx) => {
        const style = CHORD_STYLES[def.type];
        const isSelected = selectedAnswer === def.type;
        const isCorrect = correctAnswer === def.type;
        const isInResult = phase === "result";

        // Determine visual state
        let stateClasses = "";
        let boxShadow = "none";

        if (isInResult) {
          if (isCorrect) {
            stateClasses =
              "border-green-400/80 bg-green-500/10 cursor-default";
            boxShadow = "0 0 18px rgba(34,197,94,0.5)";
          } else if (isSelected && !isCorrect) {
            stateClasses = "border-red-500/80 bg-red-500/10 cursor-default";
            boxShadow = "0 0 14px rgba(239,68,68,0.45)";
          } else {
            stateClasses =
              "border-studio-border/40 opacity-40 cursor-default";
          }
        } else if (disabled) {
          stateClasses = "border-studio-border/30 opacity-30 cursor-not-allowed";
        } else {
          stateClasses = `${style.idle} cursor-pointer`;
        }

        return (
          <motion.button
            key={def.type}
            onClick={() => {
              if (!disabled && !isInResult) onAnswer(def.type);
            }}
            disabled={disabled && !isInResult}
            className={`
              relative flex flex-col items-center justify-center
              rounded-xl border p-3 gap-1 min-h-[80px]
              bg-studio-panel transition-colors duration-200
              disabled:cursor-not-allowed
              ${stateClasses}
            `}
            style={{ boxShadow }}
            whileHover={
              !disabled && !isInResult
                ? { scale: 1.04, boxShadow: style.glow }
                : {}
            }
            whileTap={!disabled && !isInResult ? { scale: 0.96 } : {}}
            animate={
              isInResult && isSelected && !isCorrect
                ? { x: [0, -4, 4, -3, 3, 0] }
                : {}
            }
            transition={
              isInResult && isSelected && !isCorrect
                ? { duration: 0.35, ease: "easeInOut" }
                : {}
            }
          >
            {/* Symbol */}
            <span
              className={`font-audiowide text-base leading-tight ${
                isInResult
                  ? isCorrect
                    ? "text-green-400"
                    : isSelected
                    ? "text-red-400"
                    : "text-studio-muted"
                  : style.label
              }`}
            >
              {def.label}
            </span>

            {/* Symbol notation */}
            <span className="text-[10px] font-mono text-studio-muted tracking-widest">
              {def.symbol || "—"}
            </span>

            {/* Result indicators */}
            {isInResult && isCorrect && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px]"
              >
                ✓
              </motion.span>
            )}
            {isInResult && isSelected && !isCorrect && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px]"
              >
                ✗
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
