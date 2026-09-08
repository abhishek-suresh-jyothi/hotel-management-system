import { db } from "@/db";
import { menuItems, categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import AdminMenuManager from "@/components/AdminMenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [categoryList, items] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(menuItems).orderBy(asc(menuItems.id)),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-slate-900">Menu Management</h1>
      <AdminMenuManager categories={categoryList} initialItems={items} />
    </div>
  );
}
