import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compiler: {
    removeConsole: true, // removes all console.* in production build
    // or fine-tune:
    // removeConsole: { exclude: ["error", "warn"] },
  },
};

export default nextConfig;
