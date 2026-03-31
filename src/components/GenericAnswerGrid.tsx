"use client";

import { motion } from "framer-motion";

export interface AnswerOption {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
}

// Full Tailwind class strings required for JIT purge
const COLOR_STYLES: Record<
  string,
  { idle: string; glow: string; label: string }
> = {
  amber: {
    idle: "border-amber-500/25 hover:border-amber-500/70 hover:bg-amber-500/5",
    glow: "0 0 18px rgba(245,158,11,0.55)",
    label: "text-amber-400",
  },
  sky: {
    idle: "border-sky-500/25 hover:border-sky-500/70 hover:bg-sky-500/5",
    glow: "0 0 18px rgba(14,165,233,0.55)",
    label: "text-sky-400",
  },
  rose: {
    idle: "border-rose-500/25 hover:border-rose-500/70 hover:bg-rose-500/5",
    glow: "0 0 18px rgba(244,63,94,0.55)",
    label: "text-rose-400",
  },
  yellow: {
    idle: "border-yellow-400/25 hover:border-yellow-400/70 hover:bg-yellow-400/5",
    glow: "0 0 18px rgba(250,204,21,0.55)",
    label: "text-yellow-300",
  },
  orange: {
    idle: "border-orange-500/25 hover:border-orange-500/70 hover:bg-orange-500/5",
    glow: "0 0 18px rgba(249,115,22,0.55)",
    label: "text-orange-400",
  },
  indigo: {
    idle: "border-indigo-500/25 hover:border-indigo-500/70 hover:bg-indigo-500/5",
    glow: "0 0 18px rgba(99,102,241,0.55)",
    label: "text-indigo-400",
  },
  slate: {
    idle: "border-slate-500/25 hover:border-slate-500/70 hover:bg-slate-500/5",
    glow: "0 0 18px rgba(100,116,139,0.55)",
    label: "text-slate-400",
  },
  violet: {
    idle: "border-violet-500/25 hover:border-violet-500/70 hover:bg-violet-500/5",
    glow: "0 0 18px rgba(139,92,246,0.55)",
    label: "text-violet-400",
  },
  cyan: {
    idle: "border-cyan-500/25 hover:border-cyan-500/70 hover:bg-cyan-500/5",
    glow: "0 0 18px rgba(6,182,212,0.55)",
    label: "text-cyan-400",
  },
  teal: {
    idle: "border-teal-500/25 hover:border-teal-500/70 hover:bg-teal-500/5",
    glow: "0 0 18px rgba(20,184,166,0.55)",
    label: "text-teal-400",
  },
  red: {
    idle: "border-red-500/25 hover:border-red-500/70 hover:bg-red-500/5",
    glow: "0 0 18px rgba(239,68,68,0.55)",
    label: "text-red-400",
  },
  pink: {
    idle: "border-pink-500/25 hover:border-pink-500/70 hover:bg-pink-500/5",
    glow: "0 0 18px rgba(236,72,153,0.55)",
    label: "text-pink-400",
  },
};

const FALLBACK_STYLE = COLOR_STYLES["slate"];

interface GenericAnswerGridProps {
  options: AnswerOption[];
  onAnswer: (id: string) => void;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  phase: "answering" | "result";
  disabled: boolean;
}

export default function GenericAnswerGrid({
  options,
  onAnswer,
  selectedAnswer,
  correctAnswer,
  phase,
  disabled,
}: GenericAnswerGridProps) {
  const n = options.length;
  // Pick grid column count based on option count
  const gridCls =
    n <= 3
      ? "grid-cols-3"
      : n === 4
      ? "grid-cols-4"
      : n === 5
      ? "grid-cols-3"
      : n === 6
      ? "grid-cols-3"
      : "grid-cols-4"; // 7+

  return (
    <motion.div
      className={`grid ${gridCls} gap-2 w-full max-w-lg`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      {options.map((opt) => {
        const style = COLOR_STYLES[opt.color] ?? FALLBACK_STYLE;
        const isSelected = selectedAnswer === opt.id;
        const isCorrect = correctAnswer === opt.id;
        const isInResult = phase === "result";

        let stateClasses = "";
        let boxShadow = "none";

        if (isInResult) {
          if (isCorrect) {
            stateClasses = "border-green-400/80 bg-green-500/10 cursor-default";
            boxShadow = "0 0 18px rgba(34,197,94,0.5)";
          } else if (isSelected && !isCorrect) {
            stateClasses = "border-red-500/80 bg-red-500/10 cursor-default";
            boxShadow = "0 0 14px rgba(239,68,68,0.45)";
          } else {
            stateClasses = "border-studio-border/40 opacity-40 cursor-default";
          }
        } else if (disabled) {
          stateClasses =
            "border-studio-border/30 opacity-30 cursor-not-allowed";
        } else {
          stateClasses = `${style.idle} cursor-pointer`;
        }

        return (
          <motion.button
            key={opt.id}
            onClick={() => {
              if (!disabled && !isInResult) onAnswer(opt.id);
            }}
            disabled={disabled && !isInResult}
            className={`
              relative flex flex-col items-center justify-center
              rounded-xl border p-2.5 gap-0.5 min-h-[72px]
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
            {/* Main label */}
            <span
              className={`font-audiowide text-xs leading-tight text-center ${
                isInResult
                  ? isCorrect
                    ? "text-green-400"
                    : isSelected
                    ? "text-red-400"
                    : "text-studio-muted"
                  : style.label
              }`}
            >
              {opt.label}
            </span>

            {/* Sub label */}
            {opt.sublabel && (
              <span className="text-[9px] font-mono text-studio-muted/70 tracking-tight text-center leading-tight">
                {opt.sublabel}
              </span>
            )}

            {/* Result indicator badges */}
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
