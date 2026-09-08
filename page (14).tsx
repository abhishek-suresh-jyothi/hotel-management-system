import { db } from "@/db";
import { menuItems, categories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import MenuBrowser from "@/components/MenuBrowser";
import { HOTEL_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getData() {
  const [categoryList, items] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db
      .select({
        id: menuItems.id,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        imageUrl: menuItems.imageUrl,
        isVeg: menuItems.isVeg,
        isAvailable: menuItems.isAvailable,
        isPopular: menuItems.isPopular,
        spiceLevel: menuItems.spiceLevel,
        categorySlug: categories.slug,
      })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.categoryId, categories.id))
      .orderBy(asc(menuItems.id)),
  ]);
  return { categoryList, items };
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { categoryList, items } = await getData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">{HOTEL_NAME}&apos;s Kitchen</span>
        <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900 sm:text-5xl">Our Full Menu</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          Handpicked ingredients, time-tested recipes. Add your favourites to the cart and check out in seconds.
        </p>
      </div>
      <MenuBrowser categories={categoryList} items={items} initialCategory={category} />
    </main>
  );
}
