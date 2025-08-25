import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["formidable", "fluent-ffmpeg"],

  // api: {
  //   bodyParser: {
  //     sizeLimit: "100mb",
  //   },
  // },
};

export default nextConfig;
