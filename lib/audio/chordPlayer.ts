/**
 * chordPlayer.ts — Tone.js chord synthesis engine
 *
 * Architecture:
 *  - Lazy initialization (first user gesture, browser autoplay policy)
 *  - Chain: PolySynth → Chorus → Reverb → Master
 *  - Note stagger ≈25 ms simulates finger-plucked realism
 *  - playChordAt() allows progression scheduling at precise Tone.js times
 */

import * as Tone from "tone";
import { type ChordType, CHORD_DEFINITIONS } from "@/lib/audio/chordData";
import { buildNote } from "@/lib/audio/audioUtils";

// Singleton synth — created once, reused across all rounds
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

  const chorus = new Tone.Chorus(4, 2.5, 0.45).start();
  const reverb = new Tone.Reverb({ decay: 2.0, wet: 0.28 });
  polySynth.chain(chorus, reverb, Tone.Destination);
  polySynth.volume.value = -10;

  initialized = true;
}

/**
 * Play a chord immediately. Handles audio init on first call.
 * Notes staggered ≈25 ms apart to emulate natural playing.
 */
export async function playChord(
  rootNote: string,
  octave: number,
  chordType: ChordType,
  durationSeconds = 2.5
): Promise<void> {
  await initAudio();
  if (!polySynth) return;

  const def = CHORD_DEFINITIONS.find((d) => d.type === chordType);
  if (!def) return;

  polySynth.releaseAll();

  const notes = def.intervals.map((interval) =>
    buildNote(rootNote, interval, octave)
  );
  const now = Tone.now();

  notes.forEach((note, i) => {
    polySynth!.triggerAttackRelease(note, `${durationSeconds}s`, now + i * 0.025);
  });
}

/**
 * Play a chord at a specific Tone.js scheduled time.
 * Used by progressionPlayer to schedule multiple chords in sequence.
 */
export async function playChordAt(
  rootNote: string,
  octave: number,
  chordType: ChordType,
  time: number,
  durationSeconds: number
): Promise<void> {
  if (!polySynth) return;

  const def = CHORD_DEFINITIONS.find((d) => d.type === chordType);
  if (!def) return;

  const notes = def.intervals.map((interval) =>
    buildNote(rootNote, interval, octave)
  );

  notes.forEach((note, i) => {
    polySynth!.triggerAttackRelease(note, `${durationSeconds}s`, time + i * 0.025);
  });
}

export function stopAll(): void {
  polySynth?.releaseAll();
}
