import { build } from "esbuild";
import { execSync } from "child_process";
import { mkdirSync } from "fs";

// Build frontend
console.log("⚙️  Building frontend...");
execSync("pnpm --filter @workspace/worldly-wander run build", { stdio: "inherit" });

// Bundle app.ts (NOT index.ts) into api/index.mjs for Vercel
console.log("⚙️  Bundling Express app for Vercel...");
mkdirSync("api", { recursive: true });
await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.mjs",
  external: ["pg-native"],
  sourcemap: false,
});

console.log("✅ Build complete — api/index.mjs ready");
