import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const bucketListTable = pgTable("bucket_list", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  completed: boolean("completed").default(false).notNull(),
  displayOrder: serial("display_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
