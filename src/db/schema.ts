import { boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 220 }).notNull(),
  subtitle: varchar("subtitle", { length: 260 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  collection: varchar("collection", { length: 120 }).notNull(),
  format: varchar("format", { length: 120 }).notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  inventory: integer("inventory").notNull().default(25),
  rating: integer("rating").notNull().default(50),
  reviewCount: integer("review_count").notNull().default(0),
  images: jsonb("images").$type<string[]>().notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
  variants: jsonb("variants").$type<string[]>().notNull(),
  featured: boolean("featured").notNull().default(false),
  bestseller: boolean("bestseller").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  authorName: varchar("author_name", { length: 140 }).notNull(),
  location: varchar("location", { length: 140 }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 180 }).notNull(),
  email: varchar("email", { length: 220 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 140 }).notNull(),
  state: varchar("state", { length: 80 }).notNull(),
  postalCode: varchar("postal_code", { length: 40 }).notNull(),
  totalCents: integer("total_cents").notNull(),
  items: jsonb("items").$type<Array<{ productId: number; name: string; quantity: number; priceCents: number; variant?: string }>>().notNull(),
  status: varchar("status", { length: 60 }).notNull().default("received"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
