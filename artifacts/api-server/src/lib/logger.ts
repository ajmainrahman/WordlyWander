const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  info: (...args: unknown[]) => console.log("[INFO]", ...args),
  error: (...args: unknown[]) => console.error("[ERROR]", ...args),
  warn: (...args: unknown[]) => console.warn("[WARN]", ...args),
  debug: (...args: unknown[]) => console.log("[DEBUG]", ...args),
  fatal: (...args: unknown[]) => console.error("[FATAL]", ...args),
  child: () => logger,
  level: "info",
};

export default logger;
