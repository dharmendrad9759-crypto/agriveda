"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Tractor, Plus, Check } from "lucide-react";
import { FarmField } from "@/lib/farm/types";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

interface FieldSwitcherProps {
  fields: FarmField[];
  selectedFieldId: string;
  onSelectField: (fieldId: string) => void;
  className?: string;
}

export default function FieldSwitcher({
  fields,
  selectedFieldId,
  onSelectField,
  className = "",
}: FieldSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const currentField =
    fields.find((field) => field.id === selectedFieldId) || fields[0];

  const formatFieldName = (name?: string) =>
    name?.match(/^\d+$/) ? `खेत ${name}` : (name || "");

  if (!currentField) return null;

  return (
    <div className={cn("relative min-w-0 text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex w-full items-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-2.5 py-1.5 text-left shadow-[var(--av-shadow-sm)] transition hover:bg-[var(--av-surface-inset)] active:scale-[0.99]"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <Tractor className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold leading-tight text-[var(--av-text-primary)]">
            {formatFieldName(currentField.name)}
          </span>
          <span className="mt-0.5 block truncate text-[9.5px] leading-tight text-[var(--av-text-muted)]">
            {currentField.crop}
            {" · "}
            {currentField.areaAcres
              ? `${currentField.areaAcres} एकड़`
              : currentField.area}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[var(--av-text-muted)] transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.button
            key="field-switcher-backdrop"
            type="button"
            aria-label="खेत सूची बंद करें"
            className="fixed inset-0 z-[100] cursor-default"
            onClick={() => setIsOpen(false)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.fast }}
          />
        ) : null}
        {isOpen ? (
          <motion.div
            key="field-switcher-menu"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: MOTION.fast, ease: EASE_OUT }}
            className="absolute left-0 z-[101] mt-1.5 w-[min(20rem,calc(100vw-4.5rem))] overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]"
            role="listbox"
            aria-label="सहेजे गए खेत"
          >
              <div className="border-b border-[var(--av-border-subtle)] px-3 py-2">
                <p className="text-[9.5px] font-semibold uppercase tracking-wider text-[var(--av-text-muted)]">
                  मेरे खेत · {fields.length}
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto p-1">
                {fields.map((field) => {
                  const selected = field.id === selectedFieldId;
                  return (
                    <button
                      key={field.id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onSelectField(field.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition",
                        selected
                          ? "bg-emerald-500/10 text-[var(--av-text-primary)]"
                          : "text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)]"
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11.5px] font-medium">
                          {formatFieldName(field.name)}
                          {field.village ? (
                            <span className="ml-1 text-[9.5px] font-normal text-[var(--av-text-muted)]">
                              {field.village}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-[9.5px] text-[var(--av-text-muted)]">
                          {field.crop}
                          {" · "}
                          {field.areaAcres
                            ? `${field.areaAcres} एकड़`
                            : field.area}
                        </span>
                      </span>
                      {selected ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[var(--av-border-subtle)] p-1.5">
                <Link
                  href="/my-farm/measure"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  नया खेत नापें
                </Link>
              </div>
            </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
