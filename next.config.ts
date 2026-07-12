import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Fully static site: every route is SSG. `export` emits a plain `out/` dir
  // that serves on any static host with no compute.
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
};
export default nextConfig;
