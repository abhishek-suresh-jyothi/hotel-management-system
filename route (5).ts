import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return NextResponse.json({ categories: rows });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, slug, description, imageUrl, sortOrder } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [created] = await db
      .insert(categories)
      .values({
        name,
        slug,
        description: description || "",
        imageUrl: imageUrl || "",
        sortOrder: sortOrder ?? 0,
      })
      .returning();
    return NextResponse.json({ category: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Category name or slug already exists" },
      { status: 409 }
    );
  }
}
