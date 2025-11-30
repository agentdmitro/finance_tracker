import Link from "next/link";
import { ExpenseCard } from "@/components/ExpenseCard";
import { MonthFilter } from "@/components/MonthFilter";
import { formatCurrency, buildMonthValue } from "@/lib/utils";

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: { name: string; color: string };
};

type ExpensesResponse = {
  expenses: Expense[];
};

type SummaryResponse = {
  total: number;
};

const apiBase = process.env.NEXT_PUBLIC_APP_URL ?? "";

async function getExpenses(month?: string | null): Promise<ExpensesResponse> {
  const qs = month ? `?month=${month}` : "";
  const res = await fetch(`${apiBase}/api/expenses${qs}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load expenses");
  }
  return res.json();
}

async function getSummary(month?: string | null): Promise<SummaryResponse> {
  const qs = month ? `?month=${month}` : "";
  const res = await fetch(`${apiBase}/api/expenses/summary${qs}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load summary");
  }
  return res.json();
}

type PageProps = {
  searchParams?: { month?: string };
};

export default async function ExpensesPage({ searchParams }: PageProps) {
  const selectedMonth = searchParams?.month || buildMonthValue(new Date());
  let expensesRes: ExpensesResponse = { expenses: [] };
  let summaryRes: SummaryResponse = { total: 0 };
  let errorMessage: string | null = null;

  try {
    [expensesRes, summaryRes] = await Promise.all([getExpenses(selectedMonth), getSummary(selectedMonth)]);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Failed to load data";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Expenses</h2>
          <p className="text-sm text-slate-600">Track spending by category and month.</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthFilter current={selectedMonth} />
          <Link
            href="/expenses/new"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-900"
          >
            Add expense
          </Link>
        </div>
      </div>

      <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-ink">Total this month</p>
        <p className="text-2xl font-bold text-ink">{formatCurrency(summaryRes.total || 0)}</p>
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="space-y-3">
        {expensesRes.expenses.length === 0 && (
          <p className="text-sm text-slate-600">No expenses for this month yet.</p>
        )}
        {expensesRes.expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            title={expense.title}
            amount={expense.amount}
            date={expense.date}
            category={expense.category}
          />
        ))}
      </div>
    </div>
  );
}
