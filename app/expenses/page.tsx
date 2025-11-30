"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExpenseCard } from "@/components/ExpenseCard";
import { MonthFilter } from "@/components/MonthFilter";
import { buildMonthValue, formatCurrency } from "@/lib/utils";
import { loadCategoriesWithDefaults, loadExpensesWithDefaults, type Category, type Expense } from "@/lib/storage";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    setCategories(loadCategoriesWithDefaults());
  }, []);

  useEffect(() => {
    setExpenses(loadExpensesWithDefaults());
  }, []);

  useEffect(() => {
    setSelectedMonth(buildMonthValue(new Date()));
  }, []);

  const monthValue = selectedMonth ?? "";

  const filtered = useMemo(
    () =>
      expenses.filter((expense) => {
        if (!monthValue) return false;
        const expenseMonth = buildMonthValue(new Date(expense.date));
        return expenseMonth === monthValue;
      }),
    [expenses, monthValue]
  );

  const total = useMemo(() => filtered.reduce((sum, exp) => sum + exp.amount, 0), [filtered]);

  const findCategory = (id: string) => categories.find((cat) => cat.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Витрати</h2>
          <p className="text-sm text-slate-600">Відстежуйте витрати за категоріями та місяцями.</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthFilter current={monthValue} onChange={(value) => setSelectedMonth(value)} />
          <Link
            href="/expenses/new"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-900"
          >
            Додати витрату
          </Link>
        </div>
      </div>

      <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-ink">Сума за місяць</p>
        <p className="text-2xl font-bold text-ink">{formatCurrency(total || 0)}</p>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-slate-600">Немає витрат за цей місяць.</p>}
        {filtered.map((expense) => {
          const category = findCategory(expense.categoryId);
          return (
            <ExpenseCard
              key={expense.id}
              title={expense.title}
              amount={expense.amount}
              date={expense.date}
              category={{ name: category?.name ?? "Без категорії", color: category?.color ?? "#cbd5e1" }}
            />
          );
        })}
      </div>
    </div>
  );
}
