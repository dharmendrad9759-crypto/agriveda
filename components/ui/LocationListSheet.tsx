"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import FarmSheet from "@/components/farm/FarmSheet";
import { cn } from "@/lib/cn";

export type LocationListOption = {
  value: string;
  label: string;
  hint?: string;
  pinned?: boolean;
};

interface LocationListSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  options: LocationListOption[];
  value: string;
  onSelect: (value: string) => void;
}

export function LocationListSheet({
  open,
  onClose,
  title,
  subtitle,
  searchPlaceholder = "नाम लिखकर खोजें",
  options,
  value,
  onSelect,
}: LocationListSheetProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.value.toLowerCase().includes(q) ||
        opt.label.toLowerCase().includes(q) ||
        (opt.hint || "").toLowerCase().includes(q)
    );
  }, [options, query]);

  return (
    <FarmSheet
      open={open}
      onClose={() => {
        setQuery("");
        onClose();
      }}
      title={title}
      subtitle={subtitle}
      icon={<MapPin className="h-4 w-4" />}
      size="lg"
      level={11050}
    >
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-3 pl-10 pr-3 text-[15px] font-semibold text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
        />
      </div>
      <div className="space-y-1">
        {filtered.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm font-medium text-[var(--av-text-muted)]">
            कोई नाम नहीं मिला — दूसरा लिखकर देखें
          </p>
        ) : (
          filtered.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value || "all"}
                type="button"
                onClick={() => {
                  onSelect(opt.value);
                  setQuery("");
                  onClose();
                }}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition",
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : opt.pinned
                      ? "border border-emerald-500/30 bg-emerald-500/10"
                      : "hover:bg-[var(--av-surface-inset)]"
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-[15px] font-extrabold", !active && "text-[var(--av-text-primary)]")}>
                    {opt.label}
                  </span>
                  {opt.hint && opt.hint !== opt.label ? (
                    <span className={cn("mt-0.5 block truncate text-[11px] font-semibold", active ? "text-white/80" : "text-[var(--av-text-muted)]")}>
                      {opt.hint}
                    </span>
                  ) : null}
                </span>
                {opt.pinned && !active ? (
                  <span className="shrink-0 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-black text-white">
                    आपका
                  </span>
                ) : null}
                {active ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })
        )}
      </div>
    </FarmSheet>
  );
}

interface LocationPickButtonProps {
  label: string;
  valueLabel: string;
  hint?: string;
  onClick: () => void;
}

export function LocationPickButton({ label, valueLabel, hint, onClick }: LocationPickButtonProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-amber-800/80 dark:text-amber-300">
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-[44px] w-full items-center gap-2 rounded-xl border border-amber-200/80 bg-[var(--av-surface)] px-3 py-2.5 text-left dark:border-emerald-800"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-extrabold text-[var(--av-text-primary)]">{valueLabel}</span>
          {hint ? <span className="block truncate text-[10px] font-semibold text-[var(--av-text-muted)]">{hint}</span> : null}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-amber-800/70" />
      </button>
    </label>
  );
}
