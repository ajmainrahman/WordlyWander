import { Router } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";

const router = Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    await db.insert(newsletterSubscribersTable).values({ email }).onConflictDoNothing();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
