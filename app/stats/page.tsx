"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { CustomSelect } from "@/components/CustomSelect";
import { MonthFilter } from "@/components/MonthFilter";
import { buildMonthValue, formatCurrency, monthOptions } from "@/lib/utils";
import { loadCategoriesWithDefaults, loadExpensesWithDefaults, type Category, type Expense } from "@/lib/storage";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type MonthTotals = { label: string; value: number; month: string };

export default function StatsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    setCategories(loadCategoriesWithDefaults());
    setExpenses(loadExpensesWithDefaults());
    setSelectedMonth(buildMonthValue(new Date()));
  }, []);

  const monthValue = selectedMonth ?? "";

  const monthOptionsList = monthOptions();

  const monthTotals: MonthTotals[] = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((exp) => {
      const mv = buildMonthValue(new Date(exp.date));
      map.set(mv, (map.get(mv) ?? 0) + exp.amount);
    });
    return monthOptionsList.map((opt) => ({
      label: opt.label,
      month: opt.value,
      value: map.get(opt.value) ?? 0
    }));
  }, [expenses, monthOptionsList]);

  const selectedExpenses = useMemo(
    () =>
      expenses.filter((exp) => {
        if (!monthValue) return false;
        return buildMonthValue(new Date(exp.date)) === monthValue;
      }),
    [expenses, monthValue]
  );

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    selectedExpenses.forEach((exp) => {
      map.set(exp.categoryId, (map.get(exp.categoryId) ?? 0) + exp.amount);
    });
    return categories.map((cat) => ({ ...cat, total: map.get(cat.id) ?? 0 })).filter((c) => c.total > 0);
  }, [categories, selectedExpenses]);

  const totalSelected = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  const barData = {
    labels: monthTotals.map((m) => m.label),
    datasets: [
      {
        label: "Сума за місяць",
        data: monthTotals.map((m) => m.value),
        backgroundColor: "#0ea5e9"
      }
    ]
  };

  const donutData = {
    labels: categoryTotals.map((c) => c.name),
    datasets: [
      {
        data: categoryTotals.map((c) => c.total),
        backgroundColor: categoryTotals.map((c) => c.color)
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Статистика</h2>
          <p className="text-sm text-slate-600">Візуалізація витрат за місяцями та категоріями.</p>
        </div>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <MonthFilter current={monthValue} onChange={(v) => setSelectedMonth(v)} />
          <CustomSelect
            label="Швидкий вибір"
            value={monthValue}
            onChange={(v) => setSelectedMonth(v)}
            options={monthOptionsList}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-2 text-sm font-semibold text-ink">Суми за місяцями</h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => formatCurrency(ctx.parsed.y ?? 0)
                  }
                }
              },
              scales: {
                y: { ticks: { callback: (v) => `${v} грн` } }
              }
            }}
          />
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Категорії за місяць</h3>
            <p className="text-xs text-slate-500">Вибраний місяць: {monthOptionsList.find((m) => m.value === monthValue)?.label}</p>
          </div>
          {categoryTotals.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Немає даних для цього місяця.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-64">
                <Doughnut
                  data={donutData}
                  options={{
                    plugins: {
                      legend: { position: "bottom" },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            const label = ctx.label ?? "";
                            const val = ctx.parsed ?? 0;
                            return `${label}: ${formatCurrency(val)}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                {categoryTotals.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <p className="text-sm font-medium text-ink">{cat.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink">{formatCurrency(cat.total)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-semibold text-ink">
                  <span>Разом</span>
                  <span>{formatCurrency(totalSelected)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
