/**
 * audioUtils.ts — shared note-building utilities for all audio modules
 */

export const ROOT_OFFSETS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export const CHROMATIC = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
] as const;

/** Build a Tone.js note string from root note name + semitone offset + base octave */
export function buildNote(
  root: string,
  semitoneOffset: number,
  octave: number
): string {
  const rootIdx = ROOT_OFFSETS[root] ?? 0;
  const total = rootIdx + semitoneOffset;
  const noteIdx = ((total % 12) + 12) % 12;
  const noteOctave = octave + Math.floor(total / 12);
  return `${CHROMATIC[noteIdx]}${noteOctave}`;
}

/** Compute the root note name (e.g. "E") from a key root + semitone offset */
export function computeRootName(keyRoot: string, rootOffset: number): string {
  const idx = ((ROOT_OFFSETS[keyRoot] ?? 0) + rootOffset) % 12;
  return CHROMATIC[idx];
}
