import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems, categories } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      imageUrl: menuItems.imageUrl,
      isVeg: menuItems.isVeg,
      isAvailable: menuItems.isAvailable,
      isPopular: menuItems.isPopular,
      spiceLevel: menuItems.spiceLevel,
    })
    .from(menuItems)
    .leftJoin(categories, eq(menuItems.categoryId, categories.id))
    .orderBy(menuItems.id);

  return NextResponse.json({ items: rows });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { categoryId, name, description, price, imageUrl, isVeg, isAvailable, isPopular, spiceLevel } = body;

  if (!categoryId || !name || price === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [created] = await db
    .insert(menuItems)
    .values({
      categoryId: Number(categoryId),
      name,
      description: description || "",
      price: String(price),
      imageUrl: imageUrl || "",
      isVeg: isVeg ?? true,
      isAvailable: isAvailable ?? true,
      isPopular: isPopular ?? false,
      spiceLevel: spiceLevel ?? 1,
    })
    .returning();

  return NextResponse.json({ item: created }, { status: 201 });
}
