import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ categories });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, color } = await request.json();
    if (!name || !color) {
      return NextResponse.json({ error: "Name and color are required." }, { status: 400 });
    }
    const category = await prisma.category.create({ data: { name, color } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
