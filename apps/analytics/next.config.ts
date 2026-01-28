import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // This makes process.env.NEXT_PUBLIC_PORT available in the browser
    NEXT_PUBLIC_PORT: process.env.PORT || "3001",
  },
};

export default nextConfig;
