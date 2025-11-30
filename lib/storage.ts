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
