import { CategoryBadge } from "./CategoryBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

type ExpenseCardProps = {
  title: string;
  amount: number;
  date: string | Date;
  category: {
    name: string;
    color: string;
  };
};

export function ExpenseCard({ title, amount, date, category }: ExpenseCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-slate-500">{formatDate(date)}</p>
      </div>
      <div className="flex items-center gap-3">
        <CategoryBadge name={category.name} color={category.color} />
        <span className="text-sm font-semibold text-ink">{formatCurrency(amount)}</span>
      </div>
    </div>
  );
}
