"use client";

import { motion } from "framer-motion";
import type { Question } from "@/src/store/gameStore";
import { CHORD_DEFINITIONS } from "@/lib/audio/chordData";
import { PROGRESSION_DEFINITIONS } from "@/lib/audio/progressionData";
import { SCALE_DEFINITIONS } from "@/lib/audio/scaleData";

interface ResultFeedbackProps {
  isCorrect: boolean;
  question: Question;
  onNext: () => void;
}

export default function ResultFeedback({
  isCorrect,
  question,
  onNext,
}: ResultFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 w-full max-w-lg"
    >
      {/* ── Result status badge ── */}
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

      {/* ── Answer reveal panel ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="panel px-8 py-5 flex flex-col items-center gap-2 w-full"
      >
        {question.kind === "chord" && <ChordReveal question={question} />}
        {question.kind === "progression" && (
          <ProgressionReveal question={question} />
        )}
        {question.kind === "scale" && <ScaleReveal question={question} />}
      </motion.div>

      {/* ── Next button ── */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="btn-primary"
      >
        Next →
      </motion.button>
    </motion.div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ChordReveal({
  question,
}: {
  question: Extract<Question, { kind: "chord" }>;
}) {
  const chordDef = CHORD_DEFINITIONS.find((d) => d.type === question.chordType);
  if (!chordDef) return null;

  return (
    <>
      <span className="text-studio-muted text-xs tracking-[0.25em] uppercase font-mono">
        The chord was
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-audiowide text-4xl text-white">
          {question.rootNote}
        </span>
        <span className="font-audiowide text-2xl text-amber-400">
          {chordDef.symbol || ""}
        </span>
      </div>
      <span className="font-mono text-sm text-studio-muted">{chordDef.label}</span>
      <span className="text-xs text-studio-muted/70 mt-1 font-mono">
        {chordDef.character}
      </span>
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
    </>
  );
}

function ProgressionReveal({
  question,
}: {
  question: Extract<Question, { kind: "progression" }>;
}) {
  const prog = PROGRESSION_DEFINITIONS.find(
    (p) => p.id === question.progression.id
  );
  if (!prog) return null;

  return (
    <>
      <span className="text-studio-muted text-xs tracking-[0.25em] uppercase font-mono">
        The progression was
      </span>
      <div className="flex flex-col items-center gap-1">
        <span className="font-audiowide text-2xl text-amber-400">
          {prog.label}
        </span>
        <span className="font-mono text-xs text-studio-muted">
          Key of {question.keyRoot}
        </span>
      </div>
      <div className="mt-2 px-4 py-2 rounded-lg bg-studio-surface border border-studio-border text-center">
        <p className="font-mono text-xs text-amber-500/80 tracking-wide">
          {prog.description}
        </p>
        <p className="font-mono text-[11px] text-studio-muted/60 mt-1">
          ({prog.example})
        </p>
      </div>
    </>
  );
}

function ScaleReveal({
  question,
}: {
  question: Extract<Question, { kind: "scale" }>;
}) {
  const scale = SCALE_DEFINITIONS.find((s) => s.id === question.scale.id);
  if (!scale) return null;

  return (
    <>
      <span className="text-studio-muted text-xs tracking-[0.25em] uppercase font-mono">
        The scale was
      </span>
      <div className="flex flex-col items-center gap-1">
        <span className="font-audiowide text-2xl text-amber-400">
          {question.rootNote} {scale.label}
        </span>
        <span className="font-mono text-xs text-studio-muted">
          {scale.labelSub}
        </span>
      </div>
      <span className="text-xs text-studio-muted/70 mt-1 font-mono text-center">
        {scale.character}
      </span>
      <div className="flex flex-wrap justify-center gap-1.5 mt-2">
        {scale.intervals.map((interval, i) => (
          <span
            key={i}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-studio-surface border border-studio-border text-amber-500/70"
          >
            +{interval}
          </span>
        ))}
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-studio-surface border border-studio-border text-amber-500/30">
          +12
        </span>
      </div>
    </>
  );
}
