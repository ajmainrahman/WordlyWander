import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, galleryPhotosTable, destinationsTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: galleryPhotosTable.id,
        imageUrl: galleryPhotosTable.imageUrl,
        caption: galleryPhotosTable.caption,
        createdAt: galleryPhotosTable.createdAt,
        destinationId: galleryPhotosTable.destinationId,
        destinationName: destinationsTable.name,
      })
      .from(galleryPhotosTable)
      .leftJoin(
        destinationsTable,
        eq(galleryPhotosTable.destinationId, destinationsTable.id)
      )
      .orderBy(desc(galleryPhotosTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

export default router;
