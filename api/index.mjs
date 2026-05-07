import { createRequire } from 'module'; const require = createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// artifacts/api-server/src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

// artifacts/api-server/src/routes/index.ts
import { Router as Router10 } from "express";

// artifacts/api-server/src/routes/health.ts
import { Router } from "express";

// lib/api-zod/src/generated/api.ts
import * as zod from "zod";
var HealthCheckResponse = zod.object({
  status: zod.string()
});

// artifacts/api-server/src/routes/health.ts
var router = Router();
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
var health_default = router;

// artifacts/api-server/src/routes/posts.ts
import { Router as Router2 } from "express";

// lib/db/src/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// lib/db/src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  blogPostsTable: () => blogPostsTable,
  destinationsTable: () => destinationsTable,
  galleryPhotosTable: () => galleryPhotosTable,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertDestinationSchema: () => insertDestinationSchema,
  insertGalleryPhotoSchema: () => insertGalleryPhotoSchema,
  insertNewsletterSubscriberSchema: () => insertNewsletterSubscriberSchema,
  newsletterSubscribersTable: () => newsletterSubscribersTable,
  updateBlogPostSchema: () => updateBlogPostSchema,
  updateDestinationSchema: () => updateDestinationSchema
});

// lib/db/src/schema/blog-posts.ts
import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull().default(""),
  excerpt: text("excerpt").default(""),
  coverImageUrl: text("cover_image_url").default(""),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateBlogPostSchema = insertBlogPostSchema.partial();

// lib/db/src/schema/destinations.ts
import { pgTable as pgTable2, serial as serial2, text as text2, boolean as boolean2, timestamp as timestamp2 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema2 } from "drizzle-zod";
var destinationsTable = pgTable2("destinations", {
  id: serial2("id").primaryKey(),
  name: text2("name").notNull(),
  slug: text2("slug").notNull().unique(),
  region: text2("region").default(""),
  description: text2("description").default(""),
  coverImageUrl: text2("cover_image_url").default(""),
  bestTimeToVisit: text2("best_time_to_visit").default(""),
  published: boolean2("published").notNull().default(false),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().notNull()
});
var insertDestinationSchema = createInsertSchema2(destinationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateDestinationSchema = insertDestinationSchema.partial();

// lib/db/src/schema/gallery-photos.ts
import { pgTable as pgTable3, serial as serial3, text as text3, integer, timestamp as timestamp3 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema3 } from "drizzle-zod";
var galleryPhotosTable = pgTable3("gallery_photos", {
  id: serial3("id").primaryKey(),
  destinationId: integer("destination_id").references(() => destinationsTable.id, {
    onDelete: "set null"
  }),
  imageUrl: text3("image_url").notNull(),
  caption: text3("caption").default(""),
  createdAt: timestamp3("created_at").defaultNow().notNull()
});
var insertGalleryPhotoSchema = createInsertSchema3(galleryPhotosTable).omit({
  id: true,
  createdAt: true
});

// lib/db/src/schema/newsletter.ts
import { pgTable as pgTable4, serial as serial4, text as text4, timestamp as timestamp4 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema4 } from "drizzle-zod";
var newsletterSubscribersTable = pgTable4("newsletter_subscribers", {
  id: serial4("id").primaryKey(),
  email: text4("email").notNull().unique(),
  createdAt: timestamp4("created_at").defaultNow().notNull()
});
var insertNewsletterSubscriberSchema = createInsertSchema4(newsletterSubscribersTable).omit({
  id: true,
  createdAt: true
});

// lib/db/src/index.ts
var { Pool } = pg;
var _pool = null;
var _db = null;
function getConnection() {
  if (_db) return _db;
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }
  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle(_pool, { schema: schema_exports });
  return _db;
}
var db = new Proxy({}, {
  get(_target, prop) {
    return getConnection()[prop];
  }
});
var pool = new Proxy({}, {
  get(_target, prop) {
    if (!_pool) getConnection();
    return _pool[prop];
  }
});

// artifacts/api-server/src/routes/posts.ts
import { eq, desc } from "drizzle-orm";
var router2 = Router2();
router2.get("/", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true)).orderBy(desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
router2.get("/:slug", async (req, res) => {
  try {
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
    if (!post || !post.published) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});
var posts_default = router2;

// artifacts/api-server/src/routes/destinations.ts
import { Router as Router3 } from "express";
import { eq as eq2, desc as desc2 } from "drizzle-orm";
var router3 = Router3();
router3.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(destinationsTable).where(eq2(destinationsTable.published, true)).orderBy(desc2(destinationsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});
router3.get("/:slug", async (req, res) => {
  try {
    const [dest] = await db.select().from(destinationsTable).where(eq2(destinationsTable.slug, req.params.slug)).limit(1);
    if (!dest || !dest.published) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const photos = await db.select().from(galleryPhotosTable).where(eq2(galleryPhotosTable.destinationId, dest.id)).orderBy(desc2(galleryPhotosTable.createdAt));
    res.json({ ...dest, photos });
  } catch {
    res.status(500).json({ error: "Failed to fetch destination" });
  }
});
var destinations_default = router3;

// artifacts/api-server/src/routes/gallery.ts
import { Router as Router4 } from "express";
import { eq as eq3, desc as desc3 } from "drizzle-orm";
var router4 = Router4();
router4.get("/", async (_req, res) => {
  try {
    const rows = await db.select({
      id: galleryPhotosTable.id,
      imageUrl: galleryPhotosTable.imageUrl,
      caption: galleryPhotosTable.caption,
      createdAt: galleryPhotosTable.createdAt,
      destinationId: galleryPhotosTable.destinationId,
      destinationName: destinationsTable.name
    }).from(galleryPhotosTable).leftJoin(destinationsTable, eq3(galleryPhotosTable.destinationId, destinationsTable.id)).orderBy(desc3(galleryPhotosTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});
var gallery_default = router4;

// artifacts/api-server/src/routes/newsletter.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.post("/subscribe", async (req, res) => {
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
var newsletter_default = router5;

// artifacts/api-server/src/routes/admin/auth.ts
import { Router as Router6 } from "express";

// artifacts/api-server/src/lib/jwt.ts
import jwt from "jsonwebtoken";
function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}
function signAdminToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}
function verifyAdminToken(token) {
  return jwt.verify(token, getSecret());
}

// artifacts/api-server/src/middlewares/auth.ts
function requireAdmin(req, res, next) {
  const token = req.cookies?.["admin_token"];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// artifacts/api-server/src/routes/admin/auth.ts
var router6 = Router6();
var COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1e3
};
router6.post("/login", (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin credentials not configured" });
    return;
  }
  if (!email || !password || email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = signAdminToken({ sub: "admin", email });
  res.cookie("admin_token", token, COOKIE_OPTS);
  res.json({ ok: true, email });
});
router6.post("/logout", (_req, res) => {
  res.clearCookie("admin_token");
  res.json({ ok: true });
});
router6.get("/me", requireAdmin, (req, res) => {
  res.json({ email: req.admin?.email });
});
var auth_default = router6;

// artifacts/api-server/src/routes/admin/posts.ts
import { Router as Router7 } from "express";
import { eq as eq4, desc as desc4 } from "drizzle-orm";
var router7 = Router7();
router7.use(requireAdmin);
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
router7.get("/", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).orderBy(desc4(blogPostsTable.createdAt));
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
router7.post("/", async (req, res) => {
  try {
    const { title, content, excerpt, coverImageUrl, published } = req.body;
    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }
    const slug = toSlug(title);
    const [post] = await db.insert(blogPostsTable).values({
      title,
      slug,
      content: content ?? "",
      excerpt: excerpt ?? "",
      coverImageUrl: coverImageUrl ?? "",
      published: published ?? false
    }).returning();
    res.status(201).json(post);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create post";
    res.status(500).json({ error: msg });
  }
});
router7.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content, excerpt, coverImageUrl, published } = req.body;
    const updates = { updatedAt: /* @__PURE__ */ new Date() };
    if (title !== void 0) {
      updates.title = title;
      updates.slug = toSlug(title);
    }
    if (content !== void 0) updates.content = content;
    if (excerpt !== void 0) updates.excerpt = excerpt;
    if (coverImageUrl !== void 0) updates.coverImageUrl = coverImageUrl;
    if (published !== void 0) updates.published = published;
    const [post] = await db.update(blogPostsTable).set(updates).where(eq4(blogPostsTable.id, id)).returning();
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: "Failed to update post" });
  }
});
router7.delete("/:id", async (req, res) => {
  try {
    await db.delete(blogPostsTable).where(eq4(blogPostsTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete post" });
  }
});
var posts_default2 = router7;

// artifacts/api-server/src/routes/admin/destinations.ts
import { Router as Router8 } from "express";
import { eq as eq5, desc as desc5 } from "drizzle-orm";
var router8 = Router8();
router8.use(requireAdmin);
function toSlug2(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
router8.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(destinationsTable).orderBy(desc5(destinationsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});
router8.post("/", async (req, res) => {
  try {
    const { name, region, description, coverImageUrl, bestTimeToVisit, published } = req.body;
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const slug = toSlug2(name);
    const [dest] = await db.insert(destinationsTable).values({
      name,
      slug,
      region: region ?? "",
      description: description ?? "",
      coverImageUrl: coverImageUrl ?? "",
      bestTimeToVisit: bestTimeToVisit ?? "",
      published: published ?? false
    }).returning();
    res.status(201).json(dest);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create destination";
    res.status(500).json({ error: msg });
  }
});
router8.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, region, description, coverImageUrl, bestTimeToVisit, published } = req.body;
    const updates = { updatedAt: /* @__PURE__ */ new Date() };
    if (name !== void 0) {
      updates.name = name;
      updates.slug = toSlug2(name);
    }
    if (region !== void 0) updates.region = region;
    if (description !== void 0) updates.description = description;
    if (coverImageUrl !== void 0) updates.coverImageUrl = coverImageUrl;
    if (bestTimeToVisit !== void 0) updates.bestTimeToVisit = bestTimeToVisit;
    if (published !== void 0) updates.published = published;
    const [dest] = await db.update(destinationsTable).set(updates).where(eq5(destinationsTable.id, id)).returning();
    if (!dest) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(dest);
  } catch {
    res.status(500).json({ error: "Failed to update destination" });
  }
});
router8.delete("/:id", async (req, res) => {
  try {
    await db.delete(destinationsTable).where(eq5(destinationsTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete destination" });
  }
});
var destinations_default2 = router8;

// artifacts/api-server/src/routes/admin/gallery.ts
import { Router as Router9 } from "express";
import { eq as eq6, desc as desc6 } from "drizzle-orm";
var router9 = Router9();
router9.use(requireAdmin);
router9.get("/", async (_req, res) => {
  try {
    const rows = await db.select({
      id: galleryPhotosTable.id,
      imageUrl: galleryPhotosTable.imageUrl,
      caption: galleryPhotosTable.caption,
      createdAt: galleryPhotosTable.createdAt,
      destinationId: galleryPhotosTable.destinationId,
      destinationName: destinationsTable.name
    }).from(galleryPhotosTable).leftJoin(destinationsTable, eq6(galleryPhotosTable.destinationId, destinationsTable.id)).orderBy(desc6(galleryPhotosTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});
router9.post("/", async (req, res) => {
  try {
    const { imageUrl, caption, destinationId } = req.body;
    if (!imageUrl) {
      res.status(400).json({ error: "imageUrl is required" });
      return;
    }
    const [photo] = await db.insert(galleryPhotosTable).values({
      imageUrl,
      caption: caption ?? "",
      destinationId: destinationId ?? null
    }).returning();
    res.status(201).json(photo);
  } catch {
    res.status(500).json({ error: "Failed to add photo" });
  }
});
router9.delete("/:id", async (req, res) => {
  try {
    await db.delete(galleryPhotosTable).where(eq6(galleryPhotosTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete photo" });
  }
});
var gallery_default2 = router9;

// artifacts/api-server/src/routes/index.ts
var router10 = Router10();
router10.use(health_default);
router10.use("/posts", posts_default);
router10.use("/destinations", destinations_default);
router10.use("/gallery", gallery_default);
router10.use(newsletter_default);
router10.use("/admin/auth", auth_default);
router10.use("/admin/posts", posts_default2);
router10.use("/admin/destinations", destinations_default2);
router10.use("/admin/gallery", gallery_default2);
var routes_default = router10;

// artifacts/api-server/src/lib/logger.ts
import pino from "pino";
var isProduction = process.env.NODE_ENV === "production";
var logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']"
  ],
  ...isProduction ? {} : {
    transport: {
      target: "pino-pretty",
      options: { colorize: true }
    }
  }
});

// artifacts/api-server/src/app.ts
var app = express();
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0]
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode
        };
      }
    }
  })
);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes_default);
var app_default = app;
export {
  app_default as default
};
