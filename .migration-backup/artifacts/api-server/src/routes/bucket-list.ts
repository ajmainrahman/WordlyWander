import { Router } from "express";
import { db, bucketListTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const items = await db.select().from(bucketListTable).orderBy(asc(bucketListTable.displayOrder));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch bucket list" });
  }
});

export default router;
