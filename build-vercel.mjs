import { build } from "esbuild";
import { execSync } from "child_process";
import { mkdirSync } from "fs";

console.log("⚙️  Building frontend...");
execSync("pnpm --filter @workspace/worldly-wander run build", { stdio: "inherit" });

console.log("⚙️  Bundling API for Vercel...");
mkdirSync("api", { recursive: true });
await build({
  entryPoints: ["artifacts/api-server/src/app-vercel.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "api/index.js",
  external: ["pg-native", "@google-cloud/storage"],
  sourcemap: false,
});

// Verify export exists
const { readFileSync } = await import("fs");
const bundle = readFileSync("api/index.mjs", "utf8");
const hasExport = bundle.includes("export default");
console.log(hasExport ? "✅ export default found" : "❌ WARNING: no export default!");
