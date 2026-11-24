import type { NextConfig } from "next";

// GitHub Pages serves the repo at /manifest. Local dev stays at the root.
const basePath = process.env.GITHUB_ACTIONS === "true" ? "/manifest" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
