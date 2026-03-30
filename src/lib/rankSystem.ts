export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Rank {
  tier: RankTier;
  label: string;
  labelJa: string;
  color: string;
  bgColor: string;
  borderColor: string;
  minPlays: number;
  minAccuracy: number;
}

export const RANKS: Rank[] = [
  {
    tier: "bronze",
    label: "Bronze",
    labelJa: "ブロンズ",
    color: "#cd7f32",
    bgColor: "rgba(205, 127, 50, 0.15)",
    borderColor: "rgba(205, 127, 50, 0.4)",
    minPlays: 0,
    minAccuracy: 0,
  },
  {
    tier: "silver",
    label: "Silver",
    labelJa: "シルバー",
    color: "#a8a9ad",
    bgColor: "rgba(168, 169, 173, 0.15)",
    borderColor: "rgba(168, 169, 173, 0.4)",
    minPlays: 20,
    minAccuracy: 40,
  },
  {
    tier: "gold",
    label: "Gold",
    labelJa: "ゴールド",
    color: "#ffd700",
    bgColor: "rgba(255, 215, 0, 0.15)",
    borderColor: "rgba(255, 215, 0, 0.4)",
    minPlays: 50,
    minAccuracy: 60,
  },
  {
    tier: "platinum",
    label: "Platinum",
    labelJa: "プラチナ",
    color: "#e5e4e2",
    bgColor: "rgba(229, 228, 226, 0.15)",
    borderColor: "rgba(229, 228, 226, 0.4)",
    minPlays: 100,
    minAccuracy: 75,
  },
  {
    tier: "diamond",
    label: "Diamond",
    labelJa: "ダイヤモンド",
    color: "#b9f2ff",
    bgColor: "rgba(185, 242, 255, 0.15)",
    borderColor: "rgba(185, 242, 255, 0.4)",
    minPlays: 200,
    minAccuracy: 85,
  },
];

export function calculateRank(totalPlays: number, accuracy: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    const rank = RANKS[i];
    if (totalPlays >= rank.minPlays && accuracy >= rank.minAccuracy) {
      return rank;
    }
  }
  return RANKS[0];
}

export function getNextRank(currentTier: RankTier): Rank | null {
  const idx = RANKS.findIndex((r) => r.tier === currentTier);
  if (idx === -1 || idx >= RANKS.length - 1) return null;
  return RANKS[idx + 1];
}

export function getRankProgress(
  totalPlays: number,
  accuracy: number,
  currentTier: RankTier
): { playsProgress: number; accuracyProgress: number } {
  const nextRank = getNextRank(currentTier);
  if (!nextRank) return { playsProgress: 100, accuracyProgress: 100 };

  const currentRank = RANKS.find((r) => r.tier === currentTier)!;

  const playsRange = nextRank.minPlays - currentRank.minPlays;
  const playsProgress =
    playsRange === 0
      ? 100
      : Math.min(
          ((totalPlays - currentRank.minPlays) / playsRange) * 100,
          100
        );

  const accRange = nextRank.minAccuracy - currentRank.minAccuracy;
  const accProgress =
    accRange === 0
      ? 100
      : Math.min(
          ((accuracy - currentRank.minAccuracy) / accRange) * 100,
          100
        );

  return {
    playsProgress: Math.max(0, playsProgress),
    accuracyProgress: Math.max(0, accProgress),
  };
}
