export function formatCurrency(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  const formatted = safe.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return `${formatted} грн`;
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(d);
}

export function monthOptions(count = 12) {
  const options: { label: string; value: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("uk-UA", {
      month: "long",
      year: "numeric"
    });
    options.push({ label, value });
  }
  return options;
}

export function monthBounds(month: string | null) {
  const target = month || buildMonthValue(new Date());
  const [yearStr, monthStr] = target.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 1);
  return { start, end };
}

export function buildMonthValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
