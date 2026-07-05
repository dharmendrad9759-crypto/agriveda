"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { filterByQuery, matchOption } from "@/lib/india-locations";

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  emptyHint?: string;
}

export default function SearchableSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  emptyHint = "कोई नतीजा नहीं — दूसरा नाम लिखकर देखें",
}: SearchableSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => filterByQuery(options, query), [options, query]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const pick = (option: string) => {
    onChange(option);
    setQuery(option);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-1 flex items-center gap-1.5 text-xs font-bold theme-text-muted">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value.trim()) onChange("");
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            const match = matchOption(options, query);
            if (match) {
              onChange(match);
              setQuery(match);
            } else {
              setQuery(value);
            }
          }}
          className={cn(
            "theme-input w-full rounded-xl border py-2.5 pl-3 pr-9 text-sm outline-none focus:border-emerald-500",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-muted transition",
            open && "rotate-180"
          )}
        />
      </div>

      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-emerald-500/20 bg-[var(--background)] py-1 shadow-xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-xs theme-text-muted">{emptyHint}</li>
          ) : (
            filtered.map((option) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(option)}
                  className={cn(
                    "theme-text-primary flex w-full px-3 py-2.5 text-left text-sm transition hover:bg-emerald-500/10",
                    option === value && "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  {option}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
