"use client";

/**
 * ChordGame — main client component and game controller.
 *
 * Client boundary is kept high so all child components can be lean
 * (no need for each to re-declare 'use client').
 *
 * Next.js 15 pattern: server page.tsx imports this once;
 * everything interactive lives here and below.
 */

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/src/store/gameStore";
import { playChord } from "@/lib/audio/chordPlayer";
import { CHORD_DEFINITIONS } from "@/lib/audio/chordData";
import { useUserStats } from "@/src/hooks/useUserStats";
import WaveformDisplay from "./WaveformDisplay";
import PlayButton from "./PlayButton";
import AnswerGrid from "./AnswerGrid";
import ScoreBar from "./ScoreBar";
import ResultFeedback from "./ResultFeedback";
import StartScreen from "./StartScreen";
import AuthButton from "./AuthButton";
import type { ChordType } from "@/lib/audio/chordData";

export default function ChordGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { recordAnswer } = useUserStats();

  const {
    phase,
    currentChord,
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

  const handlePlay = useCallback(async () => {
    if (!currentChord || isPlaying) return;
    setIsPlaying(true);
    markPlayed();
    await playChord(
      currentChord.rootNote,
      currentChord.octave,
      currentChord.chordType
    );
    // Keep isPlaying true slightly longer than audio duration for UX smoothness
    setTimeout(() => setIsPlaying(false), 2900);
  }, [currentChord, isPlaying, markPlayed]);

  const handleAnswer = useCallback(
    (answer: ChordType) => {
      if (!currentChord) return;
      const correct = answer === currentChord.chordType;
      const chordType = currentChord.chordType;

      submitAnswer(answer);

      // Save record for logged-in users (non-blocking)
      recordAnswer(correct, chordType, answer);
    },
    [currentChord, submitAnswer, recordAnswer]
  );

  const correctChordDef =
    currentChord !== null
      ? CHORD_DEFINITIONS.find((d) => d.type === currentChord.chordType)
      : null;

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
          {phase !== "idle" && <ScoreBar score={score} />}
          <AuthButton />
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {/* ── Start screen ─── */}
          {phase === "idle" && (
            <StartScreen key="start" onStart={startGame} />
          )}

          {/* ── Game screen ─── */}
          {(phase === "answering" || phase === "result") && currentChord && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-10 w-full max-w-lg"
            >
              {/* Round counter */}
              <span className="font-mono text-xs text-studio-muted tracking-[0.25em] uppercase">
                Round {score.total + (phase === "result" ? 0 : 1)}
              </span>

              {/* Waveform visualiser */}
              <WaveformDisplay isPlaying={isPlaying} />

              {/* Play button */}
              <PlayButton
                onPlay={handlePlay}
                isPlaying={isPlaying}
                hasPlayedOnce={hasPlayedOnce}
                disabled={phase === "result"}
              />

              {/* Hint when not yet played */}
              <AnimatePresence>
                {!hasPlayedOnce && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-xs text-studio-muted tracking-widest -mt-4"
                  >
                    ▲ PLAY THE CHORD, THEN CHOOSE BELOW
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Answer grid */}
              <AnswerGrid
                onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={
                  phase === "result" ? currentChord.chordType : null
                }
                phase={phase}
                disabled={!hasPlayedOnce || phase === "result"}
              />

              {/* Result feedback */}
              <AnimatePresence>
                {phase === "result" &&
                  isCorrect !== null &&
                  correctChordDef && (
                    <ResultFeedback
                      isCorrect={isCorrect}
                      chordDef={correctChordDef}
                      rootNote={currentChord.rootNote}
                      onNext={nextRound}
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
