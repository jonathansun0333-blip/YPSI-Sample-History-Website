import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  // Required if you later use next/image on GitHub Pages.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;