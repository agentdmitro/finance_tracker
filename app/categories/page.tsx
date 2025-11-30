import { headers } from "next/headers";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryForm } from "@/components/CategoryForm";

type Category = {
  id: number;
  name: string;
  color: string;
};

const baseUrl = () => {
  const host = headers().get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
};

async function getCategories(): Promise<{ categories: Category[] }> {
  const res = await fetch(`${baseUrl()}/api/categories`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return res.json();
}

export default async function CategoriesPage() {
  const { categories } = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Categories</h2>
          <p className="text-sm text-slate-600">Organize expenses with colors.</p>
        </div>
      </div>

      <CategoryForm />

      <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-ink">Existing</p>
        <div className="flex flex-wrap gap-3">
          {categories.length === 0 && <p className="text-sm text-slate-600">No categories yet.</p>}
          {categories.map((category) => (
            <CategoryBadge key={category.id} name={category.name} color={category.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
