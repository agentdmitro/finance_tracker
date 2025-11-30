"use client";

import { monthOptions } from "@/lib/utils";
import { CustomSelect } from "./CustomSelect";

type MonthFilterProps = {
  current?: string | null;
  onChange: (value: string) => void;
};

export function MonthFilter({ current, onChange }: MonthFilterProps) {
  const options = monthOptions();

  return (
    <div className="flex items-center gap-2">
      <CustomSelect
        label="Місяць"
        value={current ?? ""}
        options={options}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
}
