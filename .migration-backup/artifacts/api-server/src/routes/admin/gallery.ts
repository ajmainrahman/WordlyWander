import { Router } from "express";
import { db, galleryPhotosTable, destinationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";

const router = Router();
router.use(requireAdmin);

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
      .leftJoin(destinationsTable, eq(galleryPhotosTable.destinationId, destinationsTable.id))
      .orderBy(desc(galleryPhotosTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { imageUrl, caption, destinationId } = req.body;
    if (!imageUrl) { res.status(400).json({ error: "imageUrl is required" }); return; }
    const [photo] = await db.insert(galleryPhotosTable).values({
      imageUrl,
      caption: caption ?? "",
      destinationId: destinationId ?? null,
    }).returning();
    res.status(201).json(photo);
  } catch {
    res.status(500).json({ error: "Failed to add photo" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

export default router;
