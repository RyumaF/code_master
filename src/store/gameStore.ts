/**
 * gameStore.ts — Zustand game state
 *
 * State machine phases:
 *   idle ──► answering ──► result ──► answering (loop)
 *
 * Using Zustand (vs Redux) because:
 *  - No boilerplate; minimal bundle (~1 kB)
 *  - Selector-based subscriptions prevent unnecessary re-renders
 *  - Easy to extend with middleware (immer, devtools, persist)
 */

import { create } from "zustand";
import {
  type ChordType,
  type RootNote,
  getRandomChord,
} from "@/lib/audio/chordData";

export type GamePhase = "idle" | "answering" | "result";

export interface Score {
  correct: number;
  total: number;
  streak: number;
  bestStreak: number;
}

export interface CurrentChord {
  rootNote: RootNote;
  octave: number;
  chordType: ChordType;
}

interface GameState {
  phase: GamePhase;
  currentChord: CurrentChord | null;
  selectedAnswer: ChordType | null;
  isCorrect: boolean | null;
  score: Score;
  /** Whether the chord has been played at least once this round */
  hasPlayedOnce: boolean;

  // ── Actions ──────────────────────────────────────────────────────────
  startGame: () => void;
  markPlayed: () => void;
  submitAnswer: (answer: ChordType) => void;
  nextRound: () => void;
  resetGame: () => void;
}

const INITIAL_SCORE: Score = {
  correct: 0,
  total: 0,
  streak: 0,
  bestStreak: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: "idle",
  currentChord: null,
  selectedAnswer: null,
  isCorrect: null,
  score: INITIAL_SCORE,
  hasPlayedOnce: false,

  startGame: () =>
    set({
      phase: "answering",
      currentChord: getRandomChord(),
      selectedAnswer: null,
      isCorrect: null,
      hasPlayedOnce: false,
    }),

  markPlayed: () => set({ hasPlayedOnce: true }),

  submitAnswer: (answer) => {
    const { currentChord, score } = get();
    if (!currentChord || get().phase !== "answering") return;

    const isCorrect = answer === currentChord.chordType;
    const newStreak = isCorrect ? score.streak + 1 : 0;

    set({
      phase: "result",
      selectedAnswer: answer,
      isCorrect,
      score: {
        correct: score.correct + (isCorrect ? 1 : 0),
        total: score.total + 1,
        streak: newStreak,
        bestStreak: Math.max(score.bestStreak, newStreak),
      },
    });
  },

  nextRound: () =>
    set({
      phase: "answering",
      currentChord: getRandomChord(),
      selectedAnswer: null,
      isCorrect: null,
      hasPlayedOnce: false,
    }),

  resetGame: () =>
    set({
      phase: "idle",
      currentChord: null,
      selectedAnswer: null,
      isCorrect: null,
      score: INITIAL_SCORE,
      hasPlayedOnce: false,
    }),
}));
