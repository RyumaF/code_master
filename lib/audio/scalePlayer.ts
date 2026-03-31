/**
 * scalePlayer.ts — plays scales as a melodic line using a separate MonoSynth
 *
 * Architecture:
 *  - Dedicated monophonic synth (separate from the chord PolySynth)
 *  - Plays ascending scale + octave root at the top
 *  - Note duration and step tuned for clear ear-training identification
 */

import * as Tone from "tone";
import { buildNote } from "./audioUtils";
import type { ScaleDefinition } from "./scaleData";

let monoSynth: Tone.MonoSynth | null = null;
let scaleInitialized = false;

async function initScaleAudio(): Promise<void> {
  if (scaleInitialized) return;
  // initAudio() from chordPlayer already called Tone.start(); safe to skip here
  // but we still need to ensure context is running
  if (Tone.getContext().state !== "running") {
    await Tone.start();
  }

  monoSynth = new Tone.MonoSynth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.015,
      decay: 0.3,
      sustain: 0.25,
      release: 1.2,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8,
      baseFrequency: 1200,
      octaves: 2,
    },
  });

  const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.2 });
  monoSynth.chain(reverb, Tone.Destination);
  monoSynth.volume.value = -8;

  scaleInitialized = true;
}

const NOTE_DURATION = 0.4;  // seconds each note sounds
const NOTE_STEP = 0.38;     // seconds between note onsets (slight legato overlap)

/**
 * Play a scale ascending, ending on the octave root.
 * @returns Total playback duration in milliseconds (use for isPlaying timeout)
 */
export async function playScale(
  rootNote: string,
  scale: ScaleDefinition,
  octave = 4
): Promise<number> {
  await initScaleAudio();
  if (!monoSynth) return 0;

  // Build ascending note list: intervals + octave root
  const ascendingIntervals = [...scale.intervals, 12];
  const now = Tone.now();

  ascendingIntervals.forEach((interval, i) => {
    const note = buildNote(rootNote, interval, octave);
    monoSynth!.triggerAttackRelease(note, `${NOTE_DURATION}s`, now + i * NOTE_STEP);
  });

  const totalMs = ascendingIntervals.length * NOTE_STEP * 1000 + NOTE_DURATION * 1000;
  return totalMs;
}

export function stopScale(): void {
  monoSynth?.triggerRelease();
}
