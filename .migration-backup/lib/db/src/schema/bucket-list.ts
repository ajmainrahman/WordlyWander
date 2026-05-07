import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bucketListTable = pgTable("bucket_list", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  imageUrl: text("image_url").default(""),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBucketListSchema = createInsertSchema(bucketListTable).omit({
  id: true,
  createdAt: true,
});

export const updateBucketListSchema = insertBucketListSchema.partial();

export type InsertBucketList = z.infer<typeof insertBucketListSchema>;
export type UpdateBucketList = z.infer<typeof updateBucketListSchema>;
export type BucketListItem = typeof bucketListTable.$inferSelect;
