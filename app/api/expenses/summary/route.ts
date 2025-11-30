import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { monthBounds, buildMonthValue } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || buildMonthValue(new Date());
    const { start, end } = monthBounds(month);

    const result = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: start,
          lt: end
        }
      }
    });

    return NextResponse.json({ total: result._sum.amount ?? 0 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
