"use client";

import { motion } from "framer-motion";

interface PlayButtonProps {
  onPlay: () => Promise<void>;
  isPlaying: boolean;
  hasPlayedOnce: boolean;
  disabled?: boolean;
}

export default function PlayButton({
  onPlay,
  isPlaying,
  hasPlayedOnce,
  disabled = false,
}: PlayButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Outer ripple rings when playing */}
      <div className="relative flex items-center justify-center">
        {isPlaying && (
          <>
            <motion.div
              className="absolute rounded-full border border-amber-500/30"
              style={{ width: 128, height: 128 }}
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full border border-amber-500/20"
              style={{ width: 128, height: 128 }}
              animate={{ scale: [1, 2.1], opacity: [0.3, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.25,
              }}
            />
          </>
        )}

        {/* Main button */}
        <motion.button
          onClick={onPlay}
          disabled={isPlaying || disabled}
          className="relative w-32 h-32 rounded-full flex items-center justify-center
                     bg-studio-panel border-2 cursor-pointer select-none
                     disabled:cursor-not-allowed disabled:opacity-50
                     transition-colors duration-300"
          style={{
            borderColor: isPlaying
              ? "rgba(245,158,11,0.8)"
              : "rgba(245,158,11,0.3)",
            boxShadow: isPlaying
              ? "0 0 32px rgba(245,158,11,0.45), 0 0 80px rgba(245,158,11,0.15)"
              : "0 0 12px rgba(245,158,11,0.15)",
          }}
          animate={isPlaying ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={
            isPlaying
              ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
          whileHover={!isPlaying && !disabled ? { scale: 1.06 } : {}}
          whileTap={!isPlaying && !disabled ? { scale: 0.94 } : {}}
          aria-label={hasPlayedOnce ? "コードを再生" : "コードを再生"}
        >
          {/* Icon: play triangle */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 ml-1 transition-colors duration-300"
            style={{
              color: isPlaying
                ? "rgba(245,158,11,1)"
                : "rgba(245,158,11,0.6)",
            }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.button>
      </div>

      {/* Label */}
      <span className="text-xs tracking-[0.2em] uppercase font-mono text-studio-muted">
        {isPlaying ? "♪ playing..." : hasPlayedOnce ? "Re-Play" : "Play Chord"}
      </span>
    </div>
  );
}
