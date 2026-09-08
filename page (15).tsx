import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, OrderStatus } from "@/lib/constants";
import { CheckCircle, Phone, MapPin, Utensils, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getOrder(orderNumber: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber.toUpperCase()));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  if (!order) notFound();

  const status = order.status as OrderStatus;

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <CheckCircle className="mx-auto mb-3 text-emerald-500" size={56} />
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Order Placed Successfully!</h1>
        <p className="mt-2 text-slate-500">
          Thank you, {order.customerName}. Your order has been received by Abhiruchi&apos;s kitchen.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Order Number</p>
            <p className="font-serif text-2xl font-bold text-amber-700">{order.orderNumber}</p>
          </div>
          <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        <div className="mb-8">
          <OrderStatusTimeline status={order.status} />
        </div>

        <div className="mb-6 grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone size={16} className="text-amber-600" /> {order.customerPhone}
          </div>
          <div className="flex items-center gap-2 text-slate-600 capitalize">
            <Utensils size={16} className="text-amber-600" /> {order.orderType.replace("-", " ")}
            {order.tableNumber ? ` · Table ${order.tableNumber}` : ""}
          </div>
          {order.customerAddress && (
            <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-600" /> {order.customerAddress}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-dashed border-slate-200 pt-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">
                {item.itemName} <span className="text-slate-400">× {item.quantity}</span>
              </span>
              <span className="font-medium text-slate-900">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-slate-200 pt-4 font-serif text-lg font-bold text-slate-900">
          <span>Total Paid</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={`/track?order=${order.orderNumber}`}
          className="flex items-center gap-2 rounded-full border border-amber-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-amber-700 transition hover:bg-amber-50"
        >
          Track This Order
        </Link>
        <Link
          href="/menu"
          className="flex items-center gap-2 rounded-full bg-[#1a0f0a] px-6 py-3 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-amber-700"
        >
          Order More <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
