"use client";

import { motion } from "framer-motion";

interface WaveformDisplayProps {
  isPlaying: boolean;
}

// Pre-computed deterministic bar heights — avoids SSR/hydration mismatch
const BARS = Array.from({ length: 24 }, (_, i) => {
  const seed = ((i * 17 + 3) * 31) % 100;
  return { minH: 8 + (seed % 20), maxH: 40 + (seed % 50) };
});

export default function WaveformDisplay({ isPlaying }: WaveformDisplayProps) {
  return (
    <div
      className="flex items-end justify-center gap-[3px] h-20 w-64"
      aria-hidden="true"
    >
      {BARS.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background: isPlaying
              ? `rgba(245,158,11,${0.5 + (i % 3) * 0.15})`
              : "rgba(58,58,69,0.6)",
          }}
          animate={
            isPlaying
              ? {
                  height: [`${bar.minH}%`, `${bar.maxH}%`, `${bar.minH + 10}%`],
                  opacity: [0.7, 1, 0.8],
                }
              : { height: "12%", opacity: 0.25 }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.25 + (i % 5) * 0.09,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.018,
                }
              : { duration: 0.4 }
          }
        />
      ))}
    </div>
  );
}
