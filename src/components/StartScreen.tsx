"use client";

import { motion } from "framer-motion";
import type { GameMode } from "@/src/store/gameStore";

interface StartScreenProps {
  onStart: (mode: GameMode) => void;
}

const MODES: {
  id: GameMode;
  label: string;
  sublabel: string;
  description: string;
  color: string;
  icon: string;
  tags: string[];
}[] = [
  {
    id: "chord",
    label: "コード聴音",
    sublabel: "Chord ID",
    description: "7種類のコードタイプを当てる",
    color: "amber",
    icon: "♪",
    tags: ["Major", "Minor", "M7", "m7", "Dom7", "m♭5", "m7♭5"],
  },
  {
    id: "progression",
    label: "コード進行聴音",
    sublabel: "Progression ID",
    description: "5種類の有名な進行を当てる",
    color: "cyan",
    icon: "♬",
    tags: ["カノン", "王道", "小室", "JTToU", "循環"],
  },
  {
    id: "scale",
    label: "スケール聴音",
    sublabel: "Scale ID",
    description: "27種類のスケールをファミリー別に聴き分ける",
    color: "violet",
    icon: "𝄞",
    tags: ["チャーチ", "HM系", "MM系", "特殊"],
  },
  {
    id: "shuffle",
    label: "全シャッフル",
    sublabel: "All Shuffle",
    description: "コード・進行・スケールをランダムで出題",
    color: "gradient",
    icon: "⇌",
    tags: ["Chord", "Progression", "Scale"],
  },
];

const BORDER_COLOR: Record<string, string> = {
  amber:
    "border-amber-500/40 hover:border-amber-500/80 hover:bg-amber-500/5",
  cyan: "border-cyan-500/40 hover:border-cyan-500/80 hover:bg-cyan-500/5",
  violet:
    "border-violet-500/40 hover:border-violet-500/80 hover:bg-violet-500/5",
  gradient:
    "border-studio-border/60 hover:border-studio-border hover:bg-white/5",
};

const ICON_COLOR: Record<string, string> = {
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  gradient: "text-white/80 bg-white/5 border-white/20",
};

const TAG_COLOR: Record<string, string> = {
  amber: "border-amber-500/30 text-amber-500/70",
  cyan: "border-cyan-500/30 text-cyan-500/70",
  violet: "border-violet-500/30 text-violet-500/70",
  gradient: "border-studio-border text-studio-muted",
};

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center gap-8 text-center max-w-2xl w-full"
    >
      {/* ── Hero ── */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2"
          style={{
            boxShadow:
              "0 0 32px rgba(245,158,11,0.25), inset 0 0 24px rgba(245,158,11,0.05)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-8 h-8 text-amber-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
            />
          </svg>
        </motion.div>

        <h1 className="font-audiowide text-5xl tracking-wider">
          code<span className="text-amber-400">Master</span>
        </h1>
        <p className="font-mono text-studio-muted text-sm tracking-widest">
          耳コピトレーニング — モードを選んでスタート
        </p>
      </div>

      {/* ── Mode Cards ── */}
      <motion.div
        className="grid grid-cols-2 gap-3 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {MODES.map((mode, i) => (
          <motion.button
            key={mode.id}
            onClick={() => onStart(mode.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            className={`
              relative flex flex-col items-start gap-2 p-4 rounded-2xl
              border bg-studio-panel text-left
              transition-colors duration-200 cursor-pointer
              ${BORDER_COLOR[mode.color]}
            `}
          >
            {/* Icon + Label */}
            <div className="flex items-center gap-3 w-full">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg shrink-0 ${ICON_COLOR[mode.color]}`}
              >
                {mode.icon}
              </div>
              <div className="min-w-0">
                <p className="font-audiowide text-sm text-white leading-tight">
                  {mode.label}
                </p>
                <p className="font-mono text-[10px] text-studio-muted tracking-widest">
                  {mode.sublabel}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="font-mono text-[11px] text-studio-muted/80 leading-relaxed">
              {mode.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-auto">
              {mode.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${TAG_COLOR[mode.color]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* ── How to play ── */}
      <motion.div
        className="panel px-5 py-4 flex flex-col gap-3 text-left w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-studio-muted">
          How to play
        </span>
        <ol className="flex flex-col gap-2">
          {[
            { step: "01", text: "▶ ボタンを押してコード・進行・スケールを再生する" },
            { step: "02", text: "選択肢から正しい答えを選ぶ" },
            { step: "03", text: "正解を重ねてランクを上げよう" },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="font-audiowide text-[10px] text-amber-500/60 mt-0.5 shrink-0">
                {step}
              </span>
              <span className="font-mono text-xs text-studio-muted leading-relaxed">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  );
}
