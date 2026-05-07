import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load the pre-built api-server dist
const { default: app } = await import("../artifacts/api-server/dist/index.mjs");
export default app;
