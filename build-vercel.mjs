/**
 * Vercel build script.
 * Builds the frontend. The API function (api/index.ts) is compiled
 * automatically by Vercel's @vercel/node runtime.
 */

import { execSync } from "node:child_process";

const run = (cmd, env = {}) => {
  console.log(`\n▶ ${cmd}\n`);
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
};

// Build the React frontend.
// PORT and BASE_PATH must be set; vite.config.ts reads them.
run("pnpm --filter @workspace/worldly-wander run build", {
  NODE_ENV: "production",
  BASE_PATH: "/",
  PORT: "3000",
});

console.log("\n✓ Vercel build complete.\n");
