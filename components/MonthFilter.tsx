"use client";

import { monthOptions } from "@/lib/utils";

type MonthFilterProps = {
  current?: string | null;
  onChange: (value: string) => void;
};

export function MonthFilter({ current, onChange }: MonthFilterProps) {
  const options = monthOptions();

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-600">Місяць</label>
      <select
        value={current ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
