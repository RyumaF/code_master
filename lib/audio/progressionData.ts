/**
 * progressionData.ts — chord progression definitions for ear training
 *
 * 5 progressions: カノン進行, 王道進行, 小室進行,
 *                 Just the Two of Us進行, 循環コード進行
 */

import type { ChordType } from "./chordData";

export type ProgressionId =
  | "canon"
  | "odo"
  | "komuro"
  | "justthetwo"
  | "junkan";

export interface ChordInProgression {
  /** Semitones above key root (0 = tonic) */
  rootOffset: number;
  chordType: ChordType;
}

export interface ProgressionDefinition {
  id: ProgressionId;
  label: string;
  labelEn: string;
  /** Roman numeral description */
  description: string;
  /** Example in C */
  example: string;
  chords: ChordInProgression[];
  color: string;
}

export const PROGRESSION_DEFINITIONS: ProgressionDefinition[] = [
  {
    id: "canon",
    label: "カノン進行",
    labelEn: "Canon",
    description: "I - V - VIm - IIIm - IV - I - IV - V",
    example: "C - G - Am - Em - F - C - F - G",
    chords: [
      { rootOffset: 0, chordType: "major" },
      { rootOffset: 7, chordType: "major" },
      { rootOffset: 9, chordType: "minor" },
      { rootOffset: 4, chordType: "minor" },
      { rootOffset: 5, chordType: "major" },
      { rootOffset: 0, chordType: "major" },
      { rootOffset: 5, chordType: "major" },
      { rootOffset: 7, chordType: "major" },
    ],
    color: "amber",
  },
  {
    id: "odo",
    label: "王道進行",
    labelEn: "Oudo",
    description: "IV - V - VIm - I",
    example: "F - G - Am - C",
    chords: [
      { rootOffset: 5, chordType: "major" },
      { rootOffset: 7, chordType: "major" },
      { rootOffset: 9, chordType: "minor" },
      { rootOffset: 0, chordType: "major" },
    ],
    color: "cyan",
  },
  {
    id: "komuro",
    label: "小室進行",
    labelEn: "Komuro",
    description: "VIm - IV - V - I",
    example: "Am - F - G - C",
    chords: [
      { rootOffset: 9, chordType: "minor" },
      { rootOffset: 5, chordType: "major" },
      { rootOffset: 7, chordType: "major" },
      { rootOffset: 0, chordType: "major" },
    ],
    color: "violet",
  },
  {
    id: "justthetwo",
    label: "Just the Two of Us進行",
    labelEn: "Just the Two of Us",
    description: "Imaj7 - ♭VII7 - IVmaj7",
    example: "Fmaj7 - Eb7 - Bbmaj7",
    chords: [
      { rootOffset: 0, chordType: "major7" },
      { rootOffset: 10, chordType: "7" },
      { rootOffset: 5, chordType: "major7" },
      { rootOffset: 0, chordType: "major7" },
    ],
    color: "teal",
  },
  {
    id: "junkan",
    label: "循環コード進行",
    labelEn: "Turnaround",
    description: "I - VIm - IIm7 - V7",
    example: "C - Am - Dm7 - G7",
    chords: [
      { rootOffset: 0, chordType: "major" },
      { rootOffset: 9, chordType: "minor" },
      { rootOffset: 2, chordType: "minor7" },
      { rootOffset: 7, chordType: "7" },
    ],
    color: "orange",
  },
];

export const PROGRESSION_ROOT_NOTES = [
  "C", "D", "E", "F", "G", "A", "B",
] as const;

export function getRandomProgression(): {
  keyRoot: string;
  progression: ProgressionDefinition;
} {
  const keyRoot =
    PROGRESSION_ROOT_NOTES[
      Math.floor(Math.random() * PROGRESSION_ROOT_NOTES.length)
    ];
  const progression =
    PROGRESSION_DEFINITIONS[
      Math.floor(Math.random() * PROGRESSION_DEFINITIONS.length)
    ];
  return { keyRoot, progression };
}
