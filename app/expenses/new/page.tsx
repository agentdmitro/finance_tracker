import Link from "next/link";
import { ExpenseForm } from "@/components/ExpenseForm";

type Category = {
  id: number;
  name: string;
  color: string;
};

async function getCategories(): Promise<{ categories: Category[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/categories`, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return res.json();
}

export default async function NewExpensePage() {
  const { categories } = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Add Expense</h2>
          <p className="text-sm text-slate-600">Capture spending with a category and date.</p>
        </div>
        <Link href="/expenses" className="text-sm text-blue-600 hover:text-blue-700">
          Back to expenses
        </Link>
      </div>
      <ExpenseForm categories={categories} />
    </div>
  );
}
