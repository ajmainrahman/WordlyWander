import { build } from "esbuild";
import { execSync } from "child_process";
import { mkdirSync } from "fs";

// Build frontend
console.log("⚙️  Building frontend...");
execSync("pnpm --filter @workspace/worldly-wander run build", { stdio: "inherit" });

// Bundle app.ts for Vercel
console.log("⚙️  Bundling Express app for Vercel...");
mkdirSync("api", { recursive: true });
await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.mjs",
  external: [
    "pg-native",
    "pg",
    "pino",
    "pino-http",
    "pino-pretty",
    "express",
    "cors",
    "cookie-parser",
    "drizzle-orm",
    "dotenv",
    "jsonwebtoken",
  ],
  sourcemap: false,
});

console.log("✅ Bundle complete");
