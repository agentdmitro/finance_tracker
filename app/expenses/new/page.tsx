"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { loadCategoriesWithDefaults, type Category, type Expense } from "@/lib/storage";

export default function NewExpensePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(loadCategoriesWithDefaults());
  }, []);

  const handleSaved = (_expense: Expense) => {
    // noop hook for future side effects; router navigation handled inside form
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Додати витрату</h2>
          <p className="text-sm text-slate-600">Збережіть витрату з датою та категорією.</p>
        </div>
        <Link href="/expenses" className="text-sm text-blue-600 hover:text-blue-700">
          Назад до витрат
        </Link>
      </div>
      <ExpenseForm categories={categories} onSaved={handleSaved} />
    </div>
  );
}
