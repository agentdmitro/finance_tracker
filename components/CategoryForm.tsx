"use client";

import { useState, type FormEvent } from "react";
import { addCategory, type Category } from "@/lib/storage";

type CategoryFormProps = {
  onCreated?: (category: Category) => void;
};

export function CategoryForm({ onCreated }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color.trim()) {
      setError("Будь ласка, заповніть усі поля.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const category = addCategory({ name, color });
      setName("");
      setColor("#22c55e");
      onCreated?.(category);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">Назва</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
          placeholder="Продукти"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">Колір</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded border border-slate-200 bg-white"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
            placeholder="#22c55e"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-900 disabled:opacity-60"
      >
        {loading ? "Зберігаємо..." : "Додати категорію"}
      </button>
    </form>
  );
}
