"use client";

import { useState } from "react";
import { formatCurrency, ORDER_STATUSES, STATUS_LABELS, STATUS_COLORS, OrderStatus } from "@/lib/constants";
import { ChevronDown, ChevronUp } from "lucide-react";

type OrderItem = {
  id: number;
  itemName: string;
  quantity: number;
  subtotal: string;
  price: string;
};

export type AdminOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderType: string;
  tableNumber: string;
  status: string;
  paymentMethod: string;
  totalAmount: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrdersTable({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  async function updateStatus(orderNumber: string, id: number, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      }
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            filter === "all" ? "bg-[#1a0f0a] text-amber-50" : "bg-white text-slate-600 hover:bg-amber-50"
          }`}
        >
          All ({orders.length})
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              filter === s ? "bg-[#1a0f0a] text-amber-50" : "bg-white text-slate-600 hover:bg-amber-50"
            }`}
          >
            {STATUS_LABELS[s as OrderStatus]} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const status = order.status as OrderStatus;
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="rounded-2xl border border-amber-900/10 bg-white shadow-sm">
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="font-serif font-bold text-amber-700">{order.orderNumber}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <p className="text-sm text-slate-700">{order.customerName}</p>
                  <p className="text-sm text-slate-500">{order.customerPhone}</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-slate-900">{formatCurrency(order.totalAmount)}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-4">
                  <div className="mb-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p className="capitalize">
                      <span className="font-semibold text-slate-800">Type:</span> {order.orderType.replace("-", " ")}
                      {order.tableNumber ? ` (Table ${order.tableNumber})` : ""}
                    </p>
                    <p className="capitalize">
                      <span className="font-semibold text-slate-800">Payment:</span> {order.paymentMethod}
                    </p>
                    {order.customerAddress && (
                      <p className="sm:col-span-2">
                        <span className="font-semibold text-slate-800">Address:</span> {order.customerAddress}
                      </p>
                    )}
                    {order.notes && (
                      <p className="sm:col-span-2">
                        <span className="font-semibold text-slate-800">Notes:</span> {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 space-y-1.5 border-t border-dashed border-slate-200 pt-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-slate-600">
                        <span>{item.itemName} × {item.quantity}</span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Update Status:</label>
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => updateStatus(order.orderNumber, order.id, e.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 py-16 text-center text-slate-400">
            No orders in this category.
          </div>
        )}
      </div>
    </div>
  );
}
