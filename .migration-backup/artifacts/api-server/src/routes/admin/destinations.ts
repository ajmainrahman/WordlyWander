import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, destinationsTable } from "@workspace/db";
import { requireAdmin } from "../../middlewares/auth";

const router = Router();
router.use(requireAdmin);

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(destinationsTable)
      .orderBy(desc(destinationsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, region, description, coverImageUrl, bestTimeToVisit, published } =
      req.body as {
        name?: string;
        region?: string;
        description?: string;
        coverImageUrl?: string;
        bestTimeToVisit?: string;
        published?: boolean;
      };
    if (!name) { res.status(400).json({ error: "name is required" }); return; }
    const slug = toSlug(name);
    const [dest] = await db
      .insert(destinationsTable)
      .values({
        name,
        slug,
        region: region ?? "",
        description: description ?? "",
        coverImageUrl: coverImageUrl ?? "",
        bestTimeToVisit: bestTimeToVisit ?? "",
        published: published ?? false,
      })
      .returning();
    res.status(201).json(dest);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create destination";
    res.status(500).json({ error: msg });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, region, description, coverImageUrl, bestTimeToVisit, published } =
      req.body as {
        name?: string;
        region?: string;
        description?: string;
        coverImageUrl?: string;
        bestTimeToVisit?: string;
        published?: boolean;
      };
    const updates: Partial<typeof destinationsTable.$inferInsert> & { updatedAt?: Date } = {
      updatedAt: new Date(),
    };
    if (name !== undefined) { updates.name = name; updates.slug = toSlug(name); }
    if (region !== undefined) updates.region = region;
    if (description !== undefined) updates.description = description;
    if (coverImageUrl !== undefined) updates.coverImageUrl = coverImageUrl;
    if (bestTimeToVisit !== undefined) updates.bestTimeToVisit = bestTimeToVisit;
    if (published !== undefined) updates.published = published;

    const [dest] = await db
      .update(destinationsTable)
      .set(updates)
      .where(eq(destinationsTable.id, id))
      .returning();
    if (!dest) { res.status(404).json({ error: "Not found" }); return; }
    res.json(dest);
  } catch {
    res.status(500).json({ error: "Failed to update destination" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(destinationsTable).where(eq(destinationsTable.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete destination" });
  }
});

export default router;
