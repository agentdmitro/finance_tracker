export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
};

const CATEGORY_KEY = "finance_tracker_categories";
const EXPENSE_KEY = "finance_tracker_expenses";

const fallbackId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadCategories(): Category[] {
  if (typeof window === "undefined") return [];
  return safeParse<Category[]>(localStorage.getItem(CATEGORY_KEY), []);
}

const DEFAULT_CATEGORIES: Array<Omit<Category, "id">> = [
  { name: "Продукти", color: "#22c55e" },
  { name: "Транспорт", color: "#3b82f6" },
  { name: "Розваги", color: "#a855f7" },
  { name: "Житло", color: "#f97316" }
];

export function loadCategoriesWithDefaults(): Category[] {
  const existing = loadCategories();
  if (existing.length > 0) return existing;
  const seeded = DEFAULT_CATEGORIES.map((cat) => ({ ...cat, id: fallbackId() }));
  saveCategories(seeded);
  return seeded;
}

export function saveCategories(categories: Category[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

export function addCategory(data: Omit<Category, "id">): Category {
  const next: Category = { ...data, id: fallbackId() };
  const categories = loadCategories();
  saveCategories([...categories, next]);
  return next;
}

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  return safeParse<Expense[]>(localStorage.getItem(EXPENSE_KEY), []);
}

const DEFAULT_EXPENSES: Array<Omit<Expense, "id" | "categoryId"> & { categoryName?: string }> = [
  { title: "example 1", amount: 100, date: "2025-12-05", categoryName: "Продукти" },
  { title: "example 2", amount: 250, date: "2025-12-12", categoryName: "Транспорт" },
  { title: "example 3", amount: 430, date: "2025-12-20", categoryName: "Розваги" },
  { title: "example 1", amount: 180, date: "2025-11-04", categoryName: "Продукти" },
  { title: "example 2", amount: 320, date: "2025-11-15", categoryName: "Житло" },
  { title: "example 3", amount: 90, date: "2025-11-25", categoryName: "Транспорт" }
];

export function loadExpensesWithDefaults(): Expense[] {
  const existing = loadExpenses();
  if (existing.length > 0) return existing;
  const categories = loadCategoriesWithDefaults();
  if (categories.length === 0) return existing;

  const findCategoryId = (name?: string) => {
    const found = categories.find((c) => (name ? c.name === name : false));
    return found?.id ?? categories[0].id;
  };

  const seeded = DEFAULT_EXPENSES.map((exp) => ({
    id: fallbackId(),
    title: exp.title,
    amount: exp.amount,
    date: new Date(exp.date).toISOString(),
    categoryId: findCategoryId(exp.categoryName)
  }));

  saveExpenses(seeded);
  return seeded;
}

export function saveExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
}

export function addExpense(data: Omit<Expense, "id">): Expense {
  const next: Expense = { ...data, id: fallbackId() };
  const expenses = loadExpenses();
  saveExpenses([next, ...expenses]);
  return next;
}
