import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.price !== undefined) updates.price = String(body.price);
  if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;
  if (body.isVeg !== undefined) updates.isVeg = body.isVeg;
  if (body.isAvailable !== undefined) updates.isAvailable = body.isAvailable;
  if (body.isPopular !== undefined) updates.isPopular = body.isPopular;
  if (body.spiceLevel !== undefined) updates.spiceLevel = body.spiceLevel;
  if (body.categoryId !== undefined) updates.categoryId = Number(body.categoryId);

  const [updated] = await db
    .update(menuItems)
    .set(updates)
    .where(eq(menuItems.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.delete(menuItems).where(eq(menuItems.id, Number(id)));
  return NextResponse.json({ success: true });
}
