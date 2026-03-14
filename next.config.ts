import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: { browser: './empty-module.js' },
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;
