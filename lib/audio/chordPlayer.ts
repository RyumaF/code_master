/**
 * chordPlayer.ts — Tone.js chord synthesis engine
 *
 * Architecture notes (interview talking points):
 *  - Lazy initialization: Tone.js context starts only after user gesture (browser policy)
 *  - Chain: PolySynth → Chorus → Reverb → Master
 *  - Slight note-stagger (≈25 ms) simulates finger-plucked instrument realism
 *  - Swappable oscillator type allows piano/guitar presets in a future version
 */

import * as Tone from "tone";
import {
  type ChordType,
  type RootNote,
  CHORD_DEFINITIONS,
} from "@/lib/audio/chordData";

// Semitone offset from C for each natural root note
const ROOT_OFFSETS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

// Full chromatic scale names
const CHROMATIC = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/**
 * Convert a root note + interval offset to a Tone.js note string (e.g. "F#4")
 */
function buildNote(
  root: RootNote,
  semitoneOffset: number,
  octave: number
): string {
  const total = ROOT_OFFSETS[root] + semitoneOffset;
  const noteIdx = ((total % 12) + 12) % 12;
  const noteOctave = octave + Math.floor(total / 12);
  return `${CHROMATIC[noteIdx]}${noteOctave}`;
}

// Singleton synth — created once, reused across rounds
let polySynth: Tone.PolySynth | null = null;
let initialized = false;

/**
 * Must be called from a user-gesture handler (click/keydown).
 * Idempotent — safe to call multiple times.
 */
export async function initAudio(): Promise<void> {
  if (initialized) return;
  await Tone.start();

  polySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle8" },
    envelope: {
      attack: 0.02,
      decay: 0.5,
      sustain: 0.3,
      release: 2.8,
    },
  });

  // Signal chain
  const chorus = new Tone.Chorus(4, 2.5, 0.45).start();
  const reverb = new Tone.Reverb({ decay: 2.0, wet: 0.28 });
  polySynth.chain(chorus, reverb, Tone.Destination);
  polySynth.volume.value = -10;

  initialized = true;
}

/**
 * Play a chord. Handles audio init if first call.
 * Notes are staggered ≈25 ms apart to emulate natural playing.
 */
export async function playChord(
  rootNote: RootNote,
  octave: number,
  chordType: ChordType,
  durationSeconds = 2.5
): Promise<void> {
  await initAudio();
  if (!polySynth) return;

  const def = CHORD_DEFINITIONS.find((d) => d.type === chordType);
  if (!def) return;

  // Cancel any still-ringing notes
  polySynth.releaseAll();

  const notes = def.intervals.map((interval) =>
    buildNote(rootNote, interval, octave)
  );
  const now = Tone.now();

  notes.forEach((note, i) => {
    polySynth!.triggerAttackRelease(
      note,
      `${durationSeconds}s`,
      now + i * 0.025
    );
  });
}

export function stopAll(): void {
  polySynth?.releaseAll();
}
