import { Router } from "express";
import { db, destinationsTable, galleryPhotosTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(destinationsTable)
      .where(eq(destinationsTable.published, true))
      .orderBy(desc(destinationsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const [dest] = await db
      .select()
      .from(destinationsTable)
      .where(eq(destinationsTable.slug, req.params.slug))
      .limit(1);
    if (!dest) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const photos = await db
      .select()
      .from(galleryPhotosTable)
      .where(eq(galleryPhotosTable.destinationId, dest.id))
      .orderBy(desc(galleryPhotosTable.createdAt));
    res.json({ ...dest, photos });
  } catch {
    res.status(500).json({ error: "Failed to fetch destination" });
  }
});

export default router;
