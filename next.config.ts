import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Evita confusão com package-lock na pasta do usuário
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
