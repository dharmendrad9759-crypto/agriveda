"use client";

import { cn } from "@/lib/cn";

export default function CategoryChips({
  chips,
  active,
  onSelect,
}: {
  chips: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  const items = ["All", ...chips];
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
      {items.map((c) => {
        const isActive = active.toLowerCase() === c.toLowerCase() || (c === "All" && !active);
        return (
          <button
            key={c}
            type="button"
            onClick={() => onSelect(c === "All" ? "" : c)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition active:scale-95",
              isActive
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                : "border border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700"
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
