"use client";

import type { Rank } from "@/src/lib/rankSystem";

interface RankBadgeProps {
  rank: Rank;
  size?: "sm" | "md" | "lg";
}

const RANK_ICONS: Record<string, string> = {
  bronze: "◆",
  silver: "◆",
  gold: "◆",
  platinum: "◆",
  diamond: "◆",
};

export default function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  const iconSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-bold rounded-full border ${sizeClasses[size]}`}
      style={{
        color: rank.color,
        backgroundColor: rank.bgColor,
        borderColor: rank.borderColor,
      }}
    >
      <span className={iconSize[size]} style={{ color: rank.color }}>
        {RANK_ICONS[rank.tier]}
      </span>
      {rank.labelJa}
    </span>
  );
}
