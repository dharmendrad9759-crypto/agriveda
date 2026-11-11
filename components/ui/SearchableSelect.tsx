"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { matchOption } from "@/lib/india-locations";

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  emptyHint?: string;
  getLabel?: (value: string) => string;
  pinFirst?: string;
  /** Keep typed value even if it is not in options (गाँव not in PIN list). */
  allowCustom?: boolean;
  /** Open the list as soon as options are ready (PIN गाँव list). */
  autoOpen?: boolean;
}

export default function SearchableSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  emptyHint = "कोई नतीजा नहीं — दूसरा नाम लिखकर देखें",
  getLabel,
  pinFirst,
  allowCustom = false,
  autoOpen = false,
}: SearchableSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const autoOpenedFor = useRef("");

  useEffect(() => {
    setQuery(getLabel?.(value) || value);
  }, [value, getLabel]);

  useEffect(() => {
    if (!autoOpen || disabled || options.length === 0) return;
    const lock = options.join("\u0001");
    if (autoOpenedFor.current === lock) return;
    autoOpenedFor.current = lock;
    setOpen(true);
  }, [autoOpen, disabled, options]);

  const ranked = useMemo(() => {
    if (!pinFirst) return options;
    return [...options].sort((a, b) => {
      if (a === pinFirst) return -1;
      if (b === pinFirst) return 1;
      return 0;
    });
  }, [options, pinFirst]);

  // When query matches current selected value or is empty, show full options list!
  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const displayValue = (getLabel?.(value) || value || "").trim().toLowerCase();
    if (!trimmed || trimmed === (value || "").trim().toLowerCase() || trimmed === displayValue) {
      return ranked;
    }
    return ranked.filter((item) => {
      const label = (getLabel?.(item) || item).toLowerCase();
      return item.toLowerCase().includes(trimmed) || label.includes(trimmed);
    });
  }, [ranked, query, value, getLabel]);

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
    setQuery(getLabel?.(option) || option);
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
            if (!disabled && options.length) setOpen(true);
          }}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            if (options.length) setOpen(true);
            if (allowCustom) onChange(next);
            else if (!next.trim()) onChange("");
          }}
          onFocus={(e) => {
            if (!disabled && options.length) {
              setOpen(true);
              e.target.select();
            }
          }}
          onBlur={() => {
            // Short delay so onMouseDown on dropdown option registers before blur
            setTimeout(() => {
              if (document.activeElement !== inputRef.current) {
                setOpen(false);
                const byValue = matchOption(options, query);
                const byLabel = getLabel
                  ? options.find((item) => (getLabel(item) || "").toLowerCase() === query.trim().toLowerCase())
                  : undefined;
                const match = byValue || byLabel;
                if (match) {
                  onChange(match);
                  setQuery(getLabel?.(match) || match);
                } else if (allowCustom && query.trim()) {
                  onChange(query.trim());
                  setQuery(query.trim());
                } else if (!query.trim()) {
                  onChange("");
                  setQuery("");
                } else {
                  setQuery(getLabel?.(value) || value);
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
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-2xl border border-emerald-500/20 bg-[var(--background)] py-1 shadow-2xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-xs theme-text-muted">{emptyHint}</li>
          ) : (
            filtered.map((option, index) => (
              <li key={`${option}-${index}`} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(option);
                  }}
                  className={cn(
                    "theme-text-primary flex min-h-12 w-full items-center justify-between px-3.5 py-3 text-left text-[15px] transition hover:bg-emerald-500/10",
                    option === value && "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-extrabold">{getLabel ? getLabel(option) : option}</span>
                    {getLabel && getLabel(option) !== option ? (
                      <span className="block truncate text-[11px] font-semibold theme-text-muted">{option}</span>
                    ) : null}
                  </span>
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
