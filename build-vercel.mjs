import { execSync } from "child_process";
import { existsSync } from "fs";

// Build api-server first so dist/index.mjs exists
console.log("Building api-server...");
execSync("pnpm --filter @workspace/api-server run build", { stdio: "inherit" });

// Build frontend
console.log("Building frontend...");
execSync("pnpm --filter @workspace/worldly-wander run build", { stdio: "inherit" });

console.log("✅ All builds complete");
