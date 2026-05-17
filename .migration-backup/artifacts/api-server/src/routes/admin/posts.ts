import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";

const router = Router();
router.use(requireAdmin);

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

router.get("/", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, excerpt, coverImageUrl, published } = req.body;
    if (!title) { res.status(400).json({ error: "title is required" }); return; }
    const slug = toSlug(title);
    const [post] = await db.insert(blogPostsTable).values({
      title, slug,
      content: content ?? "",
      excerpt: excerpt ?? "",
      coverImageUrl: coverImageUrl ?? "",
      published: published ?? false,
    }).returning();
    res.status(201).json(post);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create post";
    res.status(500).json({ error: msg });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content, excerpt, coverImageUrl, published } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) { updates.title = title; updates.slug = toSlug(title); }
    if (content !== undefined) updates.content = content;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (coverImageUrl !== undefined) updates.coverImageUrl = coverImageUrl;
    if (published !== undefined) updates.published = published;
    const [post] = await db.update(blogPostsTable).set(updates).where(eq(blogPostsTable.id, id)).returning();
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(post);
  } catch {
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
