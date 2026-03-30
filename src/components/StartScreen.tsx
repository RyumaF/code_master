"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

const CHORD_LABELS = [
  "Major", "Minor", "Major 7", "Minor 7", "Dom 7", "m♭5", "m7♭5",
];

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center gap-10 text-center max-w-md w-full"
    >
      {/* Hero text */}
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
          耳コピトレーニング
        </p>
      </div>

      {/* Chord tags */}
      <motion.div
        className="flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {CHORD_LABELS.map((label, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="px-3 py-1.5 rounded-lg border border-studio-border bg-studio-panel font-mono text-xs text-studio-muted"
          >
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Description */}
      <motion.div
        className="flex flex-col gap-4 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="font-mono text-sm text-studio-muted leading-relaxed text-center">
          コードを聴いてタイプを当てよう。
          <br />
          <span className="text-amber-500/80">
            Major / Minor / 7th系 — 7 種類
          </span>
        </p>

        {/* How to play */}
        <div className="panel px-5 py-4 flex flex-col gap-3 text-left">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-studio-muted">
            How to play
          </span>
          <ol className="flex flex-col gap-2">
            {[
              { step: "01", text: "▶ ボタンを押してコードを再生する" },
              { step: "02", text: "7 つの選択肢からコードタイプを選ぶ" },
              { step: "03", text: "正解を重ねて耳を鍛えよう" },
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
          <p className="font-mono text-[11px] text-studio-muted/70 border-t border-studio-border pt-3 mt-1 leading-relaxed">
            コードは毎回ランダムなルート音で鳴ります。同じコードを何度でも再生できます。
          </p>
        </div>
      </motion.div>

      {/* Start button */}
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="btn-primary"
        style={{
          boxShadow:
            "0 0 24px rgba(245,158,11,0.35), 0 0 60px rgba(245,158,11,0.1)",
        }}
      >
        Start Training
      </motion.button>
    </motion.div>
  );
}
