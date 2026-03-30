import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack alias (Next.js 15 / Turbopack)
  // Must use a package-relative string, NOT an absolute path (absolute paths break Turbopack)
  turbopack: {
    resolveAlias: {
      tone: "tone/build/esm/index.js",
    },
  },
  webpack: (config) => {
    // Tone.js uses browser-only APIs; prevent server-side bundling
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    // Force webpack to use the ESM build instead of the UMD browser bundle
    // (14.9.x changed the browser field to point to a UMD bundle without named exports)
    config.resolve.alias = {
      ...config.resolve.alias,
      tone: path.resolve(__dirname, "node_modules/tone/build/esm/index.js"),
    };
    return config;
  },
};

export default nextConfig;
