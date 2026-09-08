import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").default("").notNull(),
  imageUrl: text("image_url").default("").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").default("").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").default("").notNull(),
  isVeg: boolean("is_veg").default(true).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  spiceLevel: integer("spice_level").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").default("").notNull(),
  orderType: text("order_type").default("delivery").notNull(),
  tableNumber: text("table_number").default("").notNull(),
  status: text("status").default("pending").notNull(),
  paymentMethod: text("payment_method").default("cash").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  notes: text("notes").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: integer("menu_item_id"),
  itemName: text("item_name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
});
