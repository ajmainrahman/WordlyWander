import { build } from "esbuild";
import { copyFileSync, mkdirSync } from "fs";

// Bundle the API into a single CJS file for Vercel
await build({
  entryPoints: ["api/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "api/index.js",
  external: ["pg-native"],
  sourcemap: false,
});

console.log("✅ Vercel API bundle complete");
