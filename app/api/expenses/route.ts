import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { monthBounds, buildMonthValue } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || buildMonthValue(new Date());
    const { start, end } = monthBounds(month);

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: start,
          lt: end
        }
      },
      include: { category: true },
      orderBy: { date: "desc" }
    });

    return NextResponse.json({ expenses });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, amount, date, categoryId } = await request.json();
    if (!title || !amount || !date || !categoryId) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return NextResponse.json({ error: "Amount must be a number." }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parsedAmount,
        date: new Date(date),
        categoryId: Number(categoryId)
      }
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
