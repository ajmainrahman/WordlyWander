import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = {};
    rows.forEach((r) => { settings[r.key] = r.value; });
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

export default router;
