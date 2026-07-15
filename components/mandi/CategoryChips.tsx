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
              "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition active:scale-95",
              isActive
                ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/25"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {c === "All" ? "सभी" : c}
          </button>
        );
      })}
    </div>
  );
}
