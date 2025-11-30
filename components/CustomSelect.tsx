"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type Option = { label: string; value: string };

type CustomSelectProps = {
  label?: string;
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export function CustomSelect({ label, value, options, placeholder = "Обрати", onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full space-y-1" ref={ref}>
      {label && <p className="text-sm font-medium text-ink">{label}</p>}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:border-slate-300 focus:border-blue-500 focus:outline-none"
      >
        <span className={selected ? "text-ink" : "text-slate-500"}>{selected?.label ?? placeholder}</span>
        <ChevronDownIcon className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 ${
                opt.value === value ? "bg-slate-100 font-semibold text-ink" : "text-slate-700"
              }`}
            >
              {opt.label}
              {opt.value === value && <span className="text-xs text-blue-600">✓</span>}
            </button>
          ))}
          {options.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">Немає опцій</p>}
        </div>
      )}
    </div>
  );
}
