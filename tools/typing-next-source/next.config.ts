import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tools/typing-next-preview",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
