import { build } from "esbuild";
import { execSync } from "child_process";

// Build frontend
console.log("Building frontend...");
execSync("pnpm --filter @workspace/worldly-wander run build", { stdio: "inherit" });

// Bundle ONLY app.ts (not index.ts which calls listen()) into api/index.mjs
console.log("Bundling API for Vercel...");
await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.mjs",
  external: [
    "pg-native",
    "dotenv",
    "dotenv/config",
    "pino",
    "pino-http",
  ],
  sourcemap: false,
  banner: {
    js: "// Vercel serverless entry — exports Express app"
  }
});

console.log("✅ Vercel bundle complete");
