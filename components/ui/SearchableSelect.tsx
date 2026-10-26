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
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // When query matches current selected value or is empty, show full options list!
  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.toLowerCase() === (value || "").trim().toLowerCase()) {
      return options;
    }
    return filterByQuery(options, trimmed);
  }, [options, query, value]);

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

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (next) inputRef.current?.focus();
      return next;
    });
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-1 flex items-center gap-1.5 text-xs font-bold theme-text-muted">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled}
          value={query}
          placeholder={placeholder}
          onClick={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value.trim()) onChange("");
          }}
          onFocus={(e) => {
            if (!disabled) {
              setOpen(true);
              e.target.select();
            }
          }}
          onBlur={() => {
            // Short delay so onMouseDown on dropdown option registers before blur
            setTimeout(() => {
              if (document.activeElement !== inputRef.current) {
                setOpen(false);
                const match = matchOption(options, query);
                if (match) {
                  onChange(match);
                  setQuery(match);
                } else if (!query.trim()) {
                  onChange("");
                  setQuery("");
                } else {
                  setQuery(value);
                }
              }
            }, 180);
          }}
          className={cn(
            "theme-input w-full rounded-xl border py-2.5 pl-3 pr-10 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={handleToggle}
          disabled={disabled}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
          aria-label={open ? "सूची बंद करें" : "सूची खोलें"}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180 text-emerald-600"
            )}
          />
        </button>
      </div>

      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-emerald-500/20 bg-[var(--background)] py-1 shadow-2xl backdrop-blur-md"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-xs theme-text-muted">{emptyHint}</li>
          ) : (
            filtered.map((option) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(option);
                  }}
                  className={cn(
                    "theme-text-primary flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition hover:bg-emerald-500/10",
                    option === value && "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  <span>{option}</span>
                  {option === value && <span className="text-xs text-emerald-600 font-extrabold">✓</span>}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
