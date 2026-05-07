import { build } from "esbuild";
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  banner: {
    js: `import { createRequire } from "module"; const require = createRequire(import.meta.url);`,
  },
  plugins: [
    {
      name: "workspace-resolver",
      setup(build) {
        const workspaceMap = {
          "@workspace/db": path.join(__dirname, "lib/db/src/index.ts"),
        };
        build.onResolve({ filter: /^@workspace\// }, (args) => {
          const resolved = workspaceMap[args.path];
          if (resolved) return { path: resolved };
        });
      },
    },
  ],
});

console.log("✅ Build complete");
