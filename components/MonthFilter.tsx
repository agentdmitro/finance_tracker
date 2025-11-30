"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { monthOptions } from "@/lib/utils";

type MonthFilterProps = {
  current?: string | null;
};

export function MonthFilter({ current }: MonthFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const options = monthOptions();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set("month", value);
    } else {
      params.delete("month");
    }
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-600">Month</label>
      <select
        value={current ?? ""}
        onChange={(e) => handleChange(e.target.value)}
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
