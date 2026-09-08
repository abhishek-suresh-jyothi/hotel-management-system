import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";
import AdminOrdersTable from "@/components/AdminOrdersTable";

export const dynamic = "force-dynamic";

async function getOrders() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  if (rows.length === 0) return [];
  const orderIds = rows.map((o) => o.id);
  const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));
  return rows.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    items: items.filter((i) => i.orderId === order.id),
  }));
}

export default async function AdminOrdersPage() {
  const allOrders = await getOrders();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-slate-900">Orders</h1>
      <AdminOrdersTable initialOrders={allOrders} />
    </div>
  );
}
