"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { addExpense, type Category, type Expense } from "@/lib/storage";

type ExpenseFormProps = {
  categories: Category[];
  onSaved?: (expense: Expense) => void;
};

export function ExpenseForm({ categories, onSaved }: ExpenseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId && categories[0]?.id) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount.trim() || !date || !categoryId) {
      setError("Будь ласка, заповніть усі поля.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const expense = addExpense({
        title,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        categoryId
      });
      onSaved?.(expense);
      router.push("/expenses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">Назва витрати</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
          placeholder="Кава"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">Сума</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
          placeholder="12.50"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">Дата</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">Категорія</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || categories.length === 0}
        className="w-full rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-900 disabled:opacity-60"
      >
        {loading ? "Зберігаємо..." : "Додати витрату"}
      </button>
      {categories.length === 0 && <p className="text-xs text-slate-500">Спочатку додайте категорію.</p>}
    </form>
  );
}
