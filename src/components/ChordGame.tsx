"use client";

/**
 * ChordGame — main client component and game controller.
 *
 * Supports 4 modes: chord | progression | scale | shuffle
 * Each mode generates different question types and answer grids.
 */

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/src/store/gameStore";
import { playChord } from "@/lib/audio/chordPlayer";
import { playProgression, stopProgression } from "@/lib/audio/progressionPlayer";
import { playScale, stopScale } from "@/lib/audio/scalePlayer";
import { CHORD_DEFINITIONS } from "@/lib/audio/chordData";
import { PROGRESSION_DEFINITIONS } from "@/lib/audio/progressionData";
import { getScaleFamilyOptions } from "@/lib/audio/scaleData";
import { useUserStats } from "@/src/hooks/useUserStats";
import WaveformDisplay from "./WaveformDisplay";
import PlayButton from "./PlayButton";
import AnswerGrid from "./AnswerGrid";
import GenericAnswerGrid from "./GenericAnswerGrid";
import type { AnswerOption } from "./GenericAnswerGrid";
import ScoreBar from "./ScoreBar";
import ResultFeedback from "./ResultFeedback";
import StartScreen from "./StartScreen";
import AuthButton from "./AuthButton";
import type { GameMode } from "@/src/store/gameStore";

// Mode display info
const MODE_LABELS: Record<GameMode, string> = {
  chord: "CHORD",
  progression: "PROGRESSION",
  scale: "SCALE",
  shuffle: "SHUFFLE",
};

const MODE_COLORS: Record<GameMode, string> = {
  chord: "text-amber-400",
  progression: "text-cyan-400",
  scale: "text-violet-400",
  shuffle: "text-white/60",
};

export default function ChordGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { recordAnswer } = useUserStats();

  const {
    phase,
    gameMode,
    question,
    selectedAnswer,
    isCorrect,
    score,
    hasPlayedOnce,
    startGame,
    markPlayed,
    submitAnswer,
    nextRound,
    resetGame,
  } = useGameStore();

  // ── Audio playback ──────────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (!question || isPlaying) return;
    setIsPlaying(true);
    markPlayed();

    let timeoutMs = 2900;

    if (question.kind === "chord") {
      await playChord(question.rootNote, question.octave, question.chordType);
      timeoutMs = 2900;
    } else if (question.kind === "progression") {
      const durationMs = await playProgression(
        question.keyRoot,
        question.progression
      );
      timeoutMs = durationMs + 500;
    } else if (question.kind === "scale") {
      const durationMs = await playScale(question.rootNote, question.scale);
      timeoutMs = durationMs + 500;
    }

    setTimeout(() => setIsPlaying(false), timeoutMs);
  }, [question, isPlaying, markPlayed]);

  // ── Stop all audio when moving to next round ────────────────────────────────
  const handleNext = useCallback(() => {
    stopProgression();
    stopScale();
    setIsPlaying(false);
    nextRound();
  }, [nextRound]);

  // ── Answer submission ───────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (answerId: string) => {
      if (!question) return;
      submitAnswer(answerId);

      const correct = answerId === question.answerId;
      // Reuse the record endpoint: kind-specific IDs stored in chordType field
      recordAnswer(correct, question.answerId, answerId);
    },
    [question, submitAnswer, recordAnswer]
  );

  // ── Build answer options ────────────────────────────────────────────────────
  const buildOptions = (): AnswerOption[] | null => {
    if (!question) return null;

    if (question.kind === "progression") {
      return PROGRESSION_DEFINITIONS.map((p) => ({
        id: p.id,
        label: p.label,
        sublabel: p.description,
        color: p.color,
      }));
    }

    if (question.kind === "scale") {
      return getScaleFamilyOptions(question.scale.id).map((s) => ({
        id: s.id,
        label: s.label,
        sublabel: s.labelSub,
        color: s.color,
      }));
    }

    return null; // chord mode uses the original AnswerGrid
  };

  const genericOptions = buildOptions();

  // ── Hint text ───────────────────────────────────────────────────────────────
  const hintText =
    question?.kind === "progression"
      ? "▲ PLAY THE PROGRESSION, THEN CHOOSE BELOW"
      : question?.kind === "scale"
      ? "▲ PLAY THE SCALE, THEN CHOOSE BELOW"
      : "▲ PLAY THE CHORD, THEN CHOOSE BELOW";

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-studio-border/50 bg-studio-surface/60 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={resetGame}
          className="font-audiowide text-xl tracking-wider hover:opacity-80 transition-opacity"
        >
          code<span className="text-amber-400">Master</span>
        </button>

        <div className="flex items-center gap-4">
          {phase !== "idle" && (
            <>
              {/* Mode badge */}
              <span
                className={`font-mono text-[10px] tracking-[0.2em] px-2 py-1 rounded border border-studio-border/50 ${MODE_COLORS[gameMode]}`}
              >
                {MODE_LABELS[gameMode]}
              </span>
              <ScoreBar score={score} />
            </>
          )}
          <AuthButton />
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {/* ── Start screen / mode selector ── */}
          {phase === "idle" && (
            <StartScreen key="start" onStart={(mode: GameMode) => startGame(mode)} />
          )}

          {/* ── Game screen ── */}
          {(phase === "answering" || phase === "result") && question && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-8 w-full max-w-lg"
            >
              {/* Round counter + question type */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-studio-muted tracking-[0.25em] uppercase">
                  Round {score.total + (phase === "result" ? 0 : 1)}
                </span>
                {question.kind === "progression" && (
                  <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">
                    KEY: {(question as Extract<typeof question, { kind: "progression" }>).keyRoot}
                  </span>
                )}
                {question.kind === "scale" && (
                  <span className="font-mono text-[10px] text-violet-500/60 tracking-widest">
                    {(question as Extract<typeof question, { kind: "scale" }>).rootNote} •{" "}
                    {(question as Extract<typeof question, { kind: "scale" }>).scale.family.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Waveform visualiser */}
              <WaveformDisplay isPlaying={isPlaying} />

              {/* Play button */}
              <PlayButton
                onPlay={handlePlay}
                isPlaying={isPlaying}
                hasPlayedOnce={hasPlayedOnce}
                disabled={phase === "result"}
              />

              {/* Hint text */}
              <AnimatePresence>
                {!hasPlayedOnce && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-xs text-studio-muted tracking-widest -mt-4"
                  >
                    {hintText}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Answer grid — chord uses original styled grid, others use generic */}
              {question.kind === "chord" ? (
                <AnswerGrid
                  onAnswer={(type) => handleAnswer(type)}
                  selectedAnswer={
                    selectedAnswer as Parameters<
                      typeof AnswerGrid
                    >[0]["selectedAnswer"]
                  }
                  correctAnswer={
                    phase === "result"
                      ? (question.chordType as Parameters<
                          typeof AnswerGrid
                        >[0]["correctAnswer"])
                      : null
                  }
                  phase={phase}
                  disabled={!hasPlayedOnce || phase === "result"}
                />
              ) : (
                genericOptions && (
                  <GenericAnswerGrid
                    options={genericOptions}
                    onAnswer={handleAnswer}
                    selectedAnswer={selectedAnswer}
                    correctAnswer={phase === "result" ? question.answerId : null}
                    phase={phase}
                    disabled={!hasPlayedOnce || phase === "result"}
                  />
                )
              )}

              {/* Result feedback */}
              <AnimatePresence>
                {phase === "result" && isCorrect !== null && (
                  <ResultFeedback
                    isCorrect={isCorrect}
                    question={question}
                    onNext={handleNext}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="py-4 border-t border-studio-border/30 text-center">
        <p className="font-mono text-xs text-studio-muted/50 tracking-widest">
          Next.js 15 · Tone.js · Zustand · Framer Motion
        </p>
      </footer>
    </div>
  );
}
