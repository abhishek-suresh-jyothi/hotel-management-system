"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, PackageSearch, Phone, MapPin, Utensils } from "lucide-react";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, OrderStatus } from "@/lib/constants";

type OrderItem = {
  id: number;
  itemName: string;
  quantity: number;
  subtotal: string;
};

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderType: string;
  tableNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("order") || "");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setOrders(null);
    try {
      const res = await fetch(`/api/track?query=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No orders found.");
        setLoading(false);
        return;
      }
      setOrders(data.orders);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = searchParams.get("order");
    if (initial) search(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <PackageSearch className="mx-auto mb-3 text-amber-600" size={48} />
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Track Your Order</h1>
        <p className="mt-2 text-slate-500">Enter your order number (e.g. ABH123456) or the phone number used while ordering.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
        className="mb-10 flex gap-3"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order number or phone number"
            className="w-full rounded-full border border-amber-900/15 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none ring-amber-500 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#1a0f0a] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-amber-700 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && (
        <p className="mb-6 rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">{error}</p>
      )}

      <div className="space-y-6">
        {orders?.map((order) => {
          const status = order.status as OrderStatus;
          return (
            <div key={order.id} className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Order Number</p>
                  <p className="font-serif text-xl font-bold text-amber-700">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[status]}`}>
                  {STATUS_LABELS[status]}
                </span>
              </div>

              <div className="mb-6">
                <OrderStatusTimeline status={order.status} />
              </div>

              <div className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
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

              <div className="space-y-2 border-t border-dashed border-slate-200 pt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">
                      {item.itemName} <span className="text-slate-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-900">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-slate-200 pt-3 font-serif text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
