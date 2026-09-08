import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber.toUpperCase()));

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return NextResponse.json({ order: { ...order, items } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderNumber } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(orders)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(orders.orderNumber, orderNumber.toUpperCase()))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: updated });
}
