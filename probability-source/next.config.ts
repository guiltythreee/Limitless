import path from "node:path";
import type { NextConfig } from "next";

// "npm run dev" keeps working at http://localhost:3000 as before.
// "npm run build" makes a plain static site in the "out" folder, meant to live at <your-site>/probability/.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/probability" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // LSR-1 lives at the repository root so Probability and the root Meta page share one policy.
  // Set Turbopack's workspace root to the repository rather than duplicating the policy in this app.
  turbopack: { root: path.resolve(process.cwd(), "..") },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
