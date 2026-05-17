import { Router } from "express";
import { db, bucketListTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";

const router = Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const items = await db.select().from(bucketListTable).orderBy(asc(bucketListTable.displayOrder));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch bucket list" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl, completed } = req.body;
    if (!title) { res.status(400).json({ error: "title is required" }); return; }
    const [item] = await db.insert(bucketListTable).values({
      title,
      description: description ?? null,
      imageUrl: imageUrl ?? null,
      completed: completed ?? false,
    }).returning();
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, imageUrl, completed } = req.body;
    const [item] = await db.update(bucketListTable).set({
      title, description, imageUrl, completed,
    }).where(eq(bucketListTable.id, Number(req.params.id))).returning();
    res.json(item);
  } catch {
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(bucketListTable).where(eq(bucketListTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
