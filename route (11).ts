import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim();

  if (!query) {
    return NextResponse.json({ error: "Please provide an order number or phone number" }, { status: 400 });
  }

  const isOrderNumber = /^ABH\d+$/i.test(query);

  const rows = isOrderNumber
    ? await db.select().from(orders).where(eq(orders.orderNumber, query.toUpperCase()))
    : await db
        .select()
        .from(orders)
        .where(eq(orders.customerPhone, query))
        .orderBy(desc(orders.createdAt))
        .limit(10);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No orders found. Please check your order number or phone." }, { status: 404 });
  }

  const orderIds = rows.map((o) => o.id);
  const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));

  const withItems = rows.map((order) => ({
    ...order,
    items: items.filter((i) => i.orderId === order.id),
  }));

  return NextResponse.json({ orders: withItems });
}
