"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, ORDER_TYPES, OrderType } from "@/lib/constants";

const DELIVERY_FEE_THRESHOLD = 500;
const DELIVERY_FEE = 40;

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = orderType === "delivery" && totalAmount < DELIVERY_FEE_THRESHOLD && totalAmount > 0 ? DELIVERY_FEE : 0;
  const grandTotal = totalAmount + deliveryFee;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }
    if (orderType === "dine-in" && !tableNumber.trim()) {
      setError("Please enter your table number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          orderType,
          tableNumber,
          paymentMethod,
          notes,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/order/${data.order.orderNumber}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={56} className="mb-4 text-amber-300" />
        <h1 className="font-serif text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Looks like you haven&apos;t added anything yet. Explore our menu!</p>
        <Link
          href="/menu"
          className="mt-6 flex items-center gap-2 rounded-full bg-[#1a0f0a] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-amber-700"
        >
          Browse Menu <ArrowRight size={16} />
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-4xl font-bold text-slate-900">Your Cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-serif font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-amber-700">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-1 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600"
                >
                  <Minus size={14} />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-20 shrink-0 text-right font-serif font-bold text-slate-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-1 text-slate-400 hover:text-rose-600"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-serif text-xl font-bold text-slate-900">Checkout Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {ORDER_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setOrderType(t.value)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                    orderType === t.value
                      ? "border-amber-600 bg-amber-500 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-amber-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="10-digit mobile number"
              />
            </div>

            {orderType === "delivery" && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="House no, street, area, city"
                />
              </div>
            )}

            {orderType === "dine-in" && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Table Number</label>
                <input
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. T-12"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="cash">Cash on {orderType === "dine-in" ? "Service" : "Delivery"}</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Notes (optional)</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Less spicy, extra chutney, etc."
              />
            </div>

            <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-serif text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1a0f0a] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Place Order"} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
