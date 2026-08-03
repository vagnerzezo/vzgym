import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
