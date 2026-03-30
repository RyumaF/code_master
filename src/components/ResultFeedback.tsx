"use client";

import { motion } from "framer-motion";
import type { ChordDefinition } from "@/lib/audio/chordData";
import type { RootNote } from "@/lib/audio/chordData";

interface ResultFeedbackProps {
  isCorrect: boolean;
  chordDef: ChordDefinition;
  rootNote: RootNote;
  onNext: () => void;
}

export default function ResultFeedback({
  isCorrect,
  chordDef,
  rootNote,
  onNext,
}: ResultFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 w-full max-w-md"
    >
      {/* Result status */}
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-full border ${
          isCorrect
            ? "border-green-500/50 bg-green-500/10 text-green-400"
            : "border-red-500/50 bg-red-500/10 text-red-400"
        }`}
      >
        <span className="text-xl">{isCorrect ? "✓" : "✗"}</span>
        <span className="font-audiowide text-sm tracking-wider">
          {isCorrect ? "Correct!" : "Incorrect"}
        </span>
      </motion.div>

      {/* Chord reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="panel px-8 py-5 flex flex-col items-center gap-2 w-full"
      >
        <span className="text-studio-muted text-xs tracking-[0.25em] uppercase font-mono">
          The chord was
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-audiowide text-4xl text-white">
            {rootNote}
          </span>
          <span className="font-audiowide text-2xl text-amber-400">
            {chordDef.symbol || ""}
          </span>
        </div>
        <span className="font-mono text-sm text-studio-muted">
          {chordDef.label}
        </span>
        <span className="text-xs text-studio-muted/70 mt-1 font-mono">
          {chordDef.character}
        </span>

        {/* Interval display */}
        <div className="flex gap-2 mt-2">
          {chordDef.intervals.map((interval, i) => (
            <span
              key={i}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-studio-surface border border-studio-border text-amber-500/70"
            >
              +{interval}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="btn-primary"
      >
        Next Chord →
      </motion.button>
    </motion.div>
  );
}
