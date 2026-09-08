import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, menuItems } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { desc, eq, inArray } from "drizzle-orm";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789", 6);

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const rows = status
    ? await db
        .select()
        .from(orders)
        .where(eq(orders.status, status))
        .orderBy(desc(orders.createdAt))
    : await db.select().from(orders).orderBy(desc(orders.createdAt));

  if (rows.length === 0) {
    return NextResponse.json({ orders: [] });
  }

  const orderIds = rows.map((o) => o.id);
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const withItems = rows.map((order) => ({
    ...order,
    items: items.filter((i) => i.orderId === order.id),
  }));

  return NextResponse.json({ orders: withItems });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    customerName,
    customerPhone,
    customerAddress,
    orderType,
    tableNumber,
    paymentMethod,
    notes,
    items,
  } = body;

  if (!customerName || !customerPhone) {
    return NextResponse.json(
      { error: "Name and phone number are required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const menuItemIds = items.map((i: { id: number }) => Number(i.id));
  const dbItems = await db
    .select()
    .from(menuItems)
    .where(inArray(menuItems.id, menuItemIds));

  if (dbItems.length === 0) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  let totalAmount = 0;
  const preparedItems = items
    .map((cartItem: { id: number; quantity: number }) => {
      const dbItem = dbItems.find((d) => d.id === Number(cartItem.id));
      if (!dbItem) return null;
      const qty = Math.max(1, Number(cartItem.quantity) || 1);
      const price = parseFloat(dbItem.price);
      const subtotal = price * qty;
      totalAmount += subtotal;
      return {
        menuItemId: dbItem.id,
        itemName: dbItem.name,
        price: dbItem.price,
        quantity: qty,
        subtotal: subtotal.toFixed(2),
      };
    })
    .filter(Boolean) as {
    menuItemId: number;
    itemName: string;
    price: string;
    quantity: number;
    subtotal: string;
  }[];

  if (preparedItems.length === 0) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  const orderNumber = `ABH${nanoid()}`;

  const [createdOrder] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName,
      customerPhone,
      customerAddress: customerAddress || "",
      orderType: orderType || "delivery",
      tableNumber: tableNumber || "",
      paymentMethod: paymentMethod || "cash",
      status: "pending",
      totalAmount: totalAmount.toFixed(2),
      notes: notes || "",
    })
    .returning();

  await db.insert(orderItems).values(
    preparedItems.map((item) => ({
      orderId: createdOrder.id,
      ...item,
    }))
  );

  return NextResponse.json({ order: createdOrder }, { status: 201 });
}
