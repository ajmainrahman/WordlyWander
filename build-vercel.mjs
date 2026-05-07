import { build } from "esbuild";
import { mkdirSync } from "fs";

mkdirSync("api", { recursive: true });

await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.mjs",
  packages: "external",
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  plugins: [
    {
      name: "workspace-resolver",
      setup(build) {
        build.onResolve({ filter: /^@workspace\// }, (args) => {
          const pkg = args.path.replace("@workspace/", "");
          return { path: new URL(`./lib/${pkg}/src/index.ts`, import.meta.url).pathname };
        });
      },
    },
  ],
});

console.log("Built api/index.mjs successfully");
