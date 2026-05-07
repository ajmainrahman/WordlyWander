import { build } from "esbuild";
import { execSync } from "child_process";
import { mkdirSync } from "fs";

// Step 1: Build frontend
console.log("⚙️  Building frontend...");
execSync("pnpm --filter @workspace/worldly-wander run build", { stdio: "inherit" });

// Step 2: Bundle API
console.log("⚙️  Bundling API...");
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

console.log("✅ Build complete");
