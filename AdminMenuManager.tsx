"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { formatCurrency } from "@/lib/constants";

type Category = { id: number; name: string; slug: string };

type MenuItem = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  spiceLevel: number;
};

const emptyForm = {
  id: 0,
  categoryId: 0,
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  isVeg: true,
  isAvailable: true,
  isPopular: false,
  spiceLevel: 1,
};

export default function AdminMenuManager({
  categories,
  initialItems,
}: {
  categories: Category[];
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openNew() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id || 0 });
    setShowForm(true);
    setError("");
  }

  function openEdit(item: MenuItem) {
    setForm({ ...item });
    setShowForm(true);
    setError("");
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.categoryId) {
      setError("Name, price and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (form.id) {
        const res = await fetch(`/api/menu/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setItems((prev) => prev.map((i) => (i.id === form.id ? data.item : i)));
      } else {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setItems((prev) => [...prev, data.item]);
      }
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(item: MenuItem) {
    const res = await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this menu item?")) return;
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} items across {categories.length} categories</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-[#1a0f0a] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-amber-50 hover:bg-amber-700"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-slate-900">{form.id ? "Edit Item" : "Add Item"}</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Spice Level (0-3)</label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={form.spiceLevel}
                    onChange={(e) => setForm({ ...form, spiceLevel: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /> Veg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  /> Available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  /> Bestseller
                </label>
              </div>

              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[#1a0f0a] hover:bg-amber-400 disabled:opacity-60"
              >
                <Check size={16} /> {saving ? "Saving..." : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
            <div className="relative h-32 w-full bg-amber-50">
              {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
              {!item.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-bold text-white">
                  UNAVAILABLE
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="font-serif font-semibold text-slate-900">{item.name}</p>
                <p className="shrink-0 font-serif font-bold text-amber-700">{formatCurrency(item.price)}</p>
              </div>
              <p className="mb-3 line-clamp-2 text-xs text-slate-500">{item.description}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    item.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="rounded-full bg-amber-100 p-2 text-amber-700 hover:bg-amber-200">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-full bg-rose-100 p-2 text-rose-700 hover:bg-rose-200">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
