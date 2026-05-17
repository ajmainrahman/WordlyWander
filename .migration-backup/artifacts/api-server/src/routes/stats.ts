import { Router } from "express";
import { db, blogPostsTable, destinationsTable, galleryPhotosTable, bucketListTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [[posts], [destinations], [photos], [bucketTotal], [bucketDone]] = await Promise.all([
      db.select({ count: count() }).from(blogPostsTable).where(eq(blogPostsTable.published, true)),
      db.select({ count: count() }).from(destinationsTable).where(eq(destinationsTable.published, true)),
      db.select({ count: count() }).from(galleryPhotosTable),
      db.select({ count: count() }).from(bucketListTable),
      db.select({ count: count() }).from(bucketListTable).where(eq(bucketListTable.completed, true)),
    ]);
    res.json({
      posts: posts.count,
      destinations: destinations.count,
      photos: photos.count,
      bucketTotal: bucketTotal.count,
      bucketDone: bucketDone.count,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
