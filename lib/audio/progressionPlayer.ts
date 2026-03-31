/**
 * progressionPlayer.ts — plays chord progressions using the shared polySynth
 *
 * Each chord in the progression is scheduled at a fixed step interval
 * using Tone.js transport time for sample-accurate playback.
 */

import * as Tone from "tone";
import { initAudio, playChordAt, stopAll } from "./chordPlayer";
import { computeRootName } from "./audioUtils";
import type { ProgressionDefinition } from "./progressionData";

const CHORD_DURATION = 0.85; // seconds each chord sustains
const CHORD_STEP = 1.05;     // seconds between chord onsets (step > duration = slight gap)
const PROGRESSION_OCTAVE = 3; // lower octave for chord progressions

/**
 * Play a chord progression in the given key.
 * @returns Total playback duration in milliseconds (use for isPlaying timeout)
 */
export async function playProgression(
  keyRoot: string,
  progression: ProgressionDefinition
): Promise<number> {
  await initAudio();

  const now = Tone.now();

  progression.chords.forEach(({ rootOffset, chordType }, i) => {
    const chordRoot = computeRootName(keyRoot, rootOffset);
    const time = now + i * CHORD_STEP;
    playChordAt(chordRoot, PROGRESSION_OCTAVE, chordType, time, CHORD_DURATION);
  });

  const totalMs =
    progression.chords.length * CHORD_STEP * 1000 +
    CHORD_DURATION * 1000;

  return totalMs;
}

export function stopProgression(): void {
  stopAll();
}
