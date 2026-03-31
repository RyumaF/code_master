/**
 * gameStore.ts — Zustand game state
 *
 * State machine: idle ──► answering ──► result ──► answering (loop)
 *
 * Supports 4 game modes:
 *  chord       — identify single chord type (7 choices)
 *  progression — identify chord progression (5 choices)
 *  scale       — identify scale within its family
 *  shuffle     — random mix of all three modes
 */

import { create } from "zustand";
import {
  type ChordType,
  type RootNote,
  getRandomChord,
} from "@/lib/audio/chordData";
import {
  type ProgressionDefinition,
  getRandomProgression,
} from "@/lib/audio/progressionData";
import {
  type ScaleDefinition,
  getRandomScale,
} from "@/lib/audio/scaleData";

// ── Types ─────────────────────────────────────────────────────────────────────

export type GameMode = "chord" | "progression" | "scale" | "shuffle";
export type GamePhase = "idle" | "answering" | "result";

export interface Score {
  correct: number;
  total: number;
  streak: number;
  bestStreak: number;
}

// Discriminated union — one variant per question kind
export type Question =
  | {
      kind: "chord";
      answerId: string; // same as chordType
      rootNote: RootNote;
      octave: number;
      chordType: ChordType;
    }
  | {
      kind: "progression";
      answerId: string; // progressionId
      keyRoot: string;
      progression: ProgressionDefinition;
    }
  | {
      kind: "scale";
      answerId: string; // scaleId
      rootNote: string;
      scale: ScaleDefinition;
    };

// ── Store interface ───────────────────────────────────────────────────────────

interface GameState {
  phase: GamePhase;
  gameMode: GameMode;
  question: Question | null;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: Score;
  hasPlayedOnce: boolean;

  setGameMode: (mode: GameMode) => void;
  startGame: (mode: GameMode) => void;
  markPlayed: () => void;
  submitAnswer: (answer: string) => void;
  nextRound: () => void;
  resetGame: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INITIAL_SCORE: Score = {
  correct: 0,
  total: 0,
  streak: 0,
  bestStreak: 0,
};

function generateQuestion(mode: GameMode): Question {
  const kind: "chord" | "progression" | "scale" =
    mode === "shuffle"
      ? (
          ["chord", "progression", "scale"] as const
        )[Math.floor(Math.random() * 3)]
      : mode;

  switch (kind) {
    case "chord": {
      const { rootNote, octave, chordType } = getRandomChord();
      return { kind: "chord", answerId: chordType, rootNote, octave, chordType };
    }
    case "progression": {
      const { keyRoot, progression } = getRandomProgression();
      return {
        kind: "progression",
        answerId: progression.id,
        keyRoot,
        progression,
      };
    }
    case "scale": {
      const { rootNote, scale } = getRandomScale();
      return { kind: "scale", answerId: scale.id, rootNote, scale };
    }
  }
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
  phase: "idle",
  gameMode: "chord",
  question: null,
  selectedAnswer: null,
  isCorrect: null,
  score: INITIAL_SCORE,
  hasPlayedOnce: false,

  setGameMode: (mode) => set({ gameMode: mode }),

  startGame: (mode) =>
    set({
      phase: "answering",
      gameMode: mode,
      question: generateQuestion(mode),
      selectedAnswer: null,
      isCorrect: null,
      hasPlayedOnce: false,
    }),

  markPlayed: () => set({ hasPlayedOnce: true }),

  submitAnswer: (answer) => {
    const { question, score } = get();
    if (!question || get().phase !== "answering") return;

    const isCorrect = answer === question.answerId;
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

  nextRound: () => {
    const { gameMode } = get();
    set({
      phase: "answering",
      question: generateQuestion(gameMode),
      selectedAnswer: null,
      isCorrect: null,
      hasPlayedOnce: false,
    });
  },

  resetGame: () =>
    set({
      phase: "idle",
      question: null,
      selectedAnswer: null,
      isCorrect: null,
      score: INITIAL_SCORE,
      hasPlayedOnce: false,
    }),
}));
