import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { destinationsTable } from "./destinations";

export const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id").references(() => destinationsTable.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotosTable).omit({
  id: true,
  createdAt: true,
});

export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
export type GalleryPhoto = typeof galleryPhotosTable.$inferSelect;
