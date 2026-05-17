import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";

const router = Router();
router.use(requireAdmin);

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

router.put("/", async (req, res) => {
  try {
    const updates: Record<string, string> = req.body;
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        db.insert(siteSettingsTable)
          .values({ key, value, updatedAt: new Date() })
          .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } })
      )
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
