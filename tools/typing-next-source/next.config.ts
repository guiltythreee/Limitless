import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parallel static-export workspace only; never replace tools/typing/ yet.
  output: "export",
  basePath: "/tools/typing-next-preview",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
