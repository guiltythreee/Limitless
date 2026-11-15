import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BOOKKEYS_BASE_PATH || "/tools/typing-next-preview",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
