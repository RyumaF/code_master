// ============================================================
// Chord type definitions — scalable foundation for future modes
// (chord progressions, key-detection, difficulty filtering, etc.)
// ============================================================

export type ChordType =
  | "major"
  | "minor"
  | "major7"
  | "minor7"
  | "7"
  | "minorb5"
  | "minor7b5";

export interface ChordDefinition {
  type: ChordType;
  /** Short label shown on answer buttons */
  label: string;
  /** Music notation symbol */
  symbol: string;
  /** Semitone intervals from root (root = 0) */
  intervals: number[];
  /** Japanese character description */
  character: string;
  /** Tailwind accent color for this chord family */
  color: string;
}

export const CHORD_DEFINITIONS: ChordDefinition[] = [
  {
    type: "major",
    label: "Major",
    symbol: "",
    intervals: [0, 4, 7],
    character: "明るい・安定",
    color: "amber",
  },
  {
    type: "minor",
    label: "Minor",
    symbol: "m",
    intervals: [0, 3, 7],
    character: "暗い・哀愁",
    color: "indigo",
  },
  {
    type: "major7",
    label: "Major 7",
    symbol: "M7",
    intervals: [0, 4, 7, 11],
    character: "洗練・夢幻",
    color: "amber",
  },
  {
    type: "minor7",
    label: "Minor 7",
    symbol: "m7",
    intervals: [0, 3, 7, 10],
    character: "クール・ジャジー",
    color: "violet",
  },
  {
    type: "7",
    label: "Dominant 7",
    symbol: "7",
    intervals: [0, 4, 7, 10],
    character: "ブルージー・緊張",
    color: "orange",
  },
  {
    type: "minorb5",
    label: "Minor ♭5",
    symbol: "m♭5",
    intervals: [0, 3, 6],
    character: "不安・ディミニッシュ",
    color: "rose",
  },
  {
    type: "minor7b5",
    label: "Minor 7♭5",
    symbol: "m7♭5",
    intervals: [0, 3, 6, 10],
    character: "ハーフディミニッシュ",
    color: "pink",
  },
];

// Natural root notes only in prototype; sharps/flats can be added via difficulty setting
export const ROOT_NOTES = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type RootNote = (typeof ROOT_NOTES)[number];

export function getRandomChord(): {
  rootNote: RootNote;
  octave: number;
  chordType: ChordType;
} {
  const rootNote =
    ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
  const chordDef =
    CHORD_DEFINITIONS[Math.floor(Math.random() * CHORD_DEFINITIONS.length)];
  return { rootNote, octave: 4, chordType: chordDef.type };
}

// Future: chord progression presets
export type ProgressionPreset =
  | "royal_road" // 王道進行: I - V - VIm - IV
  | "marusa" // 丸さ進行: IIIm - VIm - IIm - V
  | "custom";
