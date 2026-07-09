import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/YPSI-Sample-History-Website" : "",
  assetPrefix: isProd ? "/YPSI-Sample-History-Website/" : "",

  // Required for next/image on GitHub Pages.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;