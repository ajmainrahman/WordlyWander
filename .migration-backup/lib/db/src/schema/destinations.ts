import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const destinationsTable = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  region: text("region").default(""),
  description: text("description").default(""),
  coverImageUrl: text("cover_image_url").default(""),
  bestTimeToVisit: text("best_time_to_visit").default(""),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDestinationSchema = insertDestinationSchema.partial();

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type UpdateDestination = z.infer<typeof updateDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;
