type CategoryBadgeProps = {
  name: string;
  color: string;
};

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-slate-200">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-slate-800">{name}</span>
    </span>
  );
}
