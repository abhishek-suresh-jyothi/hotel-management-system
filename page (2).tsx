import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, OrderStatus } from "@/lib/constants";
import { ClipboardList, IndianRupee, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const allOrders = await db.select().from(orders);
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
  const pendingCount = allOrders.filter((o) =>
    ["pending", "confirmed", "preparing", "out-for-delivery"].includes(o.status)
  ).length;
  const completedCount = allOrders.filter((o) => o.status === "completed").length;
  const recent = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8);

  return { totalOrders, totalRevenue, pendingCount, completedCount, recent };
}

export default async function AdminDashboardPage() {
  const { totalOrders, totalRevenue, pendingCount, completedCount, recent } = await getStats();

  const cards = [
    { label: "Total Orders", value: totalOrders, icon: ClipboardList, color: "bg-amber-100 text-amber-700" },
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: IndianRupee, color: "bg-emerald-100 text-emerald-700" },
    { label: "Active Orders", value: pendingCount, icon: Clock, color: "bg-sky-100 text-sky-700" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${c.color}`}>
              <c.icon size={22} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="font-serif text-lg font-bold text-slate-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-amber-700 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => {
                const status = o.status as OrderStatus;
                return (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-amber-50/40">
                    <td className="px-5 py-3 font-semibold text-amber-700">{o.orderNumber}</td>
                    <td className="px-5 py-3">{o.customerName}</td>
                    <td className="px-5 py-3 capitalize">{o.orderType.replace("-", " ")}</td>
                    <td className="px-5 py-3">{formatCurrency(o.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status]}`}>
                        {STATUS_LABELS[status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
