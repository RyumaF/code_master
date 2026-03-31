/**
 * scaleData.ts — scale definitions for ear training
 *
 * Families:
 *  - church          : 7 church modes (Ionian → Locrian)
 *  - harmonic_minor  : 7 harmonic-minor modes
 *  - melodic_minor   : 7 melodic-minor modes
 *  - special         : diminished, combo-diminished, whole-tone, bebop (×3)
 */

export type ScaleFamily =
  | "church"
  | "harmonic_minor"
  | "melodic_minor"
  | "special";

export interface ScaleDefinition {
  id: string;
  /** Primary display label */
  label: string;
  /** Secondary info (mode number, alternative name) */
  labelSub: string;
  /** Semitone offsets from root — root (0) included, octave NOT included */
  intervals: number[];
  family: ScaleFamily;
  character: string;
  color: string;
}

export const SCALE_DEFINITIONS: ScaleDefinition[] = [
  // ── Church Modes ──────────────────────────────────────────────────────────
  {
    id: "ionian",
    label: "Ionian",
    labelSub: "メジャースケール",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    family: "church",
    character: "明るい・安定",
    color: "amber",
  },
  {
    id: "dorian",
    label: "Dorian",
    labelSub: "第2モード",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    family: "church",
    character: "クール・マイナー",
    color: "sky",
  },
  {
    id: "phrygian",
    label: "Phrygian",
    labelSub: "第3モード",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    family: "church",
    character: "スペイン風・暗い",
    color: "rose",
  },
  {
    id: "lydian",
    label: "Lydian",
    labelSub: "第4モード",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    family: "church",
    character: "浮遊感・幻想的",
    color: "yellow",
  },
  {
    id: "mixolydian",
    label: "Mixolydian",
    labelSub: "第5モード",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    family: "church",
    character: "ブルース・ロック",
    color: "orange",
  },
  {
    id: "aeolian",
    label: "Aeolian",
    labelSub: "ナチュラルマイナー",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    family: "church",
    character: "悲しい・暗い",
    color: "indigo",
  },
  {
    id: "locrian",
    label: "Locrian",
    labelSub: "第7モード",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    family: "church",
    character: "不安定・緊張",
    color: "slate",
  },

  // ── Harmonic Minor Modes ──────────────────────────────────────────────────
  {
    id: "harmonic_minor",
    label: "Harmonic Minor",
    labelSub: "HMモード1",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    family: "harmonic_minor",
    character: "エキゾチック・クラシック",
    color: "violet",
  },
  {
    id: "hm_locrian_sharp6",
    label: "Locrian ♯6",
    labelSub: "HMモード2",
    intervals: [0, 1, 3, 5, 6, 9, 10],
    family: "harmonic_minor",
    character: "不安定・半音の不協和",
    color: "slate",
  },
  {
    id: "hm_ionian_sharp5",
    label: "Ionian ♯5",
    labelSub: "HMモード3",
    intervals: [0, 2, 4, 5, 8, 9, 11],
    family: "harmonic_minor",
    character: "明るい・拡張5度",
    color: "amber",
  },
  {
    id: "hm_dorian_sharp4",
    label: "Dorian ♯4",
    labelSub: "ウクライナン",
    intervals: [0, 2, 3, 6, 7, 9, 10],
    family: "harmonic_minor",
    character: "民族的・増4度",
    color: "cyan",
  },
  {
    id: "phrygian_dominant",
    label: "Phrygian Dom.",
    labelSub: "HMモード5",
    intervals: [0, 1, 4, 5, 7, 8, 10],
    family: "harmonic_minor",
    character: "フラメンコ・中東風",
    color: "red",
  },
  {
    id: "hm_lydian_sharp2",
    label: "Lydian ♯2",
    labelSub: "HMモード6",
    intervals: [0, 3, 4, 6, 7, 9, 11],
    family: "harmonic_minor",
    character: "幻想的・増2度",
    color: "yellow",
  },
  {
    id: "hm_superlocrian",
    label: "Super Locrian ♭♭7",
    labelSub: "HMモード7",
    intervals: [0, 1, 3, 4, 6, 8, 9],
    family: "harmonic_minor",
    character: "超不安定・強緊張",
    color: "pink",
  },

  // ── Melodic Minor Modes ───────────────────────────────────────────────────
  {
    id: "melodic_minor",
    label: "Melodic Minor",
    labelSub: "MMモード1",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    family: "melodic_minor",
    character: "ジャジー・流れるような",
    color: "teal",
  },
  {
    id: "mm_dorian_flat2",
    label: "Dorian ♭2",
    labelSub: "フリジアン♮6",
    intervals: [0, 1, 3, 5, 7, 9, 10],
    family: "melodic_minor",
    character: "半音始まり・独特",
    color: "cyan",
  },
  {
    id: "lydian_augmented",
    label: "Lydian Aug.",
    labelSub: "リディアン♯5",
    intervals: [0, 2, 4, 6, 8, 9, 11],
    family: "melodic_minor",
    character: "浮遊・拡張された明るさ",
    color: "yellow",
  },
  {
    id: "lydian_dominant",
    label: "Lydian Dom.",
    labelSub: "オーバートーン",
    intervals: [0, 2, 4, 6, 7, 9, 10],
    family: "melodic_minor",
    character: "ファンキー・少し不思議",
    color: "orange",
  },
  {
    id: "mixolydian_flat6",
    label: "Mixolydian ♭6",
    labelSub: "ヒンドゥー",
    intervals: [0, 2, 4, 5, 7, 8, 10],
    family: "melodic_minor",
    character: "インド風・下降感",
    color: "red",
  },
  {
    id: "locrian_sharp2",
    label: "Locrian ♯2",
    labelSub: "ハーフディミニッシュ",
    intervals: [0, 2, 3, 5, 6, 8, 10],
    family: "melodic_minor",
    character: "ジャジー・不安定",
    color: "violet",
  },
  {
    id: "altered",
    label: "Altered Scale",
    labelSub: "スーパーロクリアン",
    intervals: [0, 1, 3, 4, 6, 8, 10],
    family: "melodic_minor",
    character: "最高の緊張・解決渇望",
    color: "rose",
  },

  // ── Special Scales ────────────────────────────────────────────────────────
  {
    id: "diminished_wh",
    label: "ディミニッシュ",
    labelSub: "Whole-Half",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    family: "special",
    character: "対称的・強い緊張感",
    color: "rose",
  },
  {
    id: "diminished_hw",
    label: "コンビネーション",
    labelSub: "Half-Whole Dim.",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    family: "special",
    character: "ドミナント上の緊張",
    color: "pink",
  },
  {
    id: "whole_tone",
    label: "ホールトーン",
    labelSub: "Whole Tone",
    intervals: [0, 2, 4, 6, 8, 10],
    family: "special",
    character: "浮遊・夢幻・無方向",
    color: "sky",
  },
  {
    id: "bebop_dominant",
    label: "Dom. Bebop",
    labelSub: "ドミナントビバップ",
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    family: "special",
    character: "スウィング・ジャズ",
    color: "amber",
  },
  {
    id: "bebop_major",
    label: "Major Bebop",
    labelSub: "メジャービバップ",
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    family: "special",
    character: "明るい・ジャズ",
    color: "yellow",
  },
  {
    id: "bebop_dorian",
    label: "Dorian Bebop",
    labelSub: "ドリアンビバップ",
    intervals: [0, 2, 3, 5, 7, 9, 10, 11],
    family: "special",
    character: "クール・マイナージャズ",
    color: "teal",
  },
];

export const SCALE_FAMILY_LABELS: Record<ScaleFamily, string> = {
  church: "チャーチモード",
  harmonic_minor: "ハーモニックマイナー系",
  melodic_minor: "メロディックマイナー系",
  special: "特殊スケール",
};

export const SCALE_ROOT_NOTES = [
  "C", "D", "E", "F", "G", "A", "B",
] as const;

/** Return all scales in the same family as the given scale ID */
export function getScaleFamilyOptions(scaleId: string): ScaleDefinition[] {
  const scale = SCALE_DEFINITIONS.find((s) => s.id === scaleId);
  if (!scale) return [];
  return SCALE_DEFINITIONS.filter((s) => s.family === scale.family);
}

export function getRandomScale(): {
  rootNote: string;
  scale: ScaleDefinition;
} {
  const rootNote =
    SCALE_ROOT_NOTES[Math.floor(Math.random() * SCALE_ROOT_NOTES.length)];
  const scale =
    SCALE_DEFINITIONS[Math.floor(Math.random() * SCALE_DEFINITIONS.length)];
  return { rootNote, scale };
}
