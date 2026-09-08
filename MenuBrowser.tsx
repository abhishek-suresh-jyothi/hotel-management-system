"use client";

import { useMemo, useState } from "react";
import { Search, Leaf, Drumstick } from "lucide-react";
import MenuItemCard, { MenuItemCardData } from "@/components/MenuItemCard";

export type CategoryData = {
  id: number;
  name: string;
  slug: string;
};

type Props = {
  categories: CategoryData[];
  items: (MenuItemCardData & { categorySlug: string | null })[];
  initialCategory?: string;
};

type DietFilter = "all" | "veg" | "non-veg";

export default function MenuBrowser({ categories, items, initialCategory }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState<DietFilter>("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== "all" && item.categorySlug !== activeCategory) return false;
      if (diet === "veg" && !item.isVeg) return false;
      if (diet === "non-veg" && item.isVeg) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [items, activeCategory, diet, search]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for dishes, e.g. biryani, paneer, naan..."
            className="w-full rounded-full border border-amber-900/15 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none ring-amber-500 focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                activeCategory === "all"
                  ? "bg-[#1a0f0a] text-amber-50"
                  : "bg-white text-slate-600 hover:bg-amber-100"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  activeCategory === c.slug
                    ? "bg-[#1a0f0a] text-amber-50"
                    : "bg-white text-slate-600 hover:bg-amber-100"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDiet(diet === "veg" ? "all" : "veg")}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                diet === "veg"
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-emerald-600/40 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <Leaf size={14} /> Veg
            </button>
            <button
              onClick={() => setDiet(diet === "non-veg" ? "all" : "non-veg")}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                diet === "non-veg"
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-rose-600/40 text-rose-700 hover:bg-rose-50"
              }`}
            >
              <Drumstick size={14} /> Non-Veg
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-900/20 bg-white/50 py-20 text-center text-slate-500">
          No dishes found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
