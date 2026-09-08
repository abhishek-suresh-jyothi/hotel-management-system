"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Minus, Flame, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/constants";

export type MenuItemCardData = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  spiceLevel: number;
};

export default function MenuItemCard({ item }: { item: MenuItemCardData }) {
  const { items, addItem, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const cartLine = items.find((i) => i.id === item.id);
  const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;

  function handleAdd() {
    addItem({
      id: item.id,
      name: item.name,
      price,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-amber-50">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 ${
              item.isVeg ? "border-emerald-600" : "border-rose-600"
            } bg-white`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${item.isVeg ? "bg-emerald-600" : "bg-rose-600"}`} />
          </span>
          {item.isPopular && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Bestseller
            </span>
          )}
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold leading-snug text-slate-900">{item.name}</h3>
          {item.spiceLevel > 0 && (
            <span className="flex shrink-0 items-center gap-0.5 text-rose-500">
              {Array.from({ length: item.spiceLevel }).map((_, i) => (
                <Flame key={i} size={13} fill="currentColor" />
              ))}
            </span>
          )}
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-slate-500">{item.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-amber-700">{formatCurrency(price)}</span>

          {!item.isAvailable ? (
            <span className="text-xs font-medium text-slate-400">Unavailable</span>
          ) : cartLine ? (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-1 py-1">
              <button
                onClick={() => updateQuantity(item.id, cartLine.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm font-semibold">{cartLine.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, cartLine.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 rounded-full bg-[#1a0f0a] px-4 py-2 text-xs font-semibold text-amber-50 transition hover:bg-amber-700"
            >
              {justAdded ? <Check size={14} /> : <ShoppingCart size={14} />}
              {justAdded ? "Added" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
