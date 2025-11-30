"use client";

import { useEffect, useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryForm } from "@/components/CategoryForm";
import { loadCategoriesWithDefaults, type Category } from "@/lib/storage";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(loadCategoriesWithDefaults());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Категорії</h2>
          <p className="text-sm text-slate-600">Організовуйте витрати за допомогою категорій і кольорів.</p>
        </div>
      </div>

      <CategoryForm onCreated={(cat) => setCategories((prev) => [...prev, cat])} />

      <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-ink">Наявні категорії</p>
        <div className="flex flex-wrap gap-3">
          {categories.length === 0 && <p className="text-sm text-slate-600">Категорій ще немає.</p>}
          {categories.map((category) => (
            <CategoryBadge key={category.id} name={category.name} color={category.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
