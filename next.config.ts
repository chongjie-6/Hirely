import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;
