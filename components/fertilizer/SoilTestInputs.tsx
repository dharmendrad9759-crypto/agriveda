"use client";

import { cn } from "@/lib/cn";
import {
  SOIL_ADJUST_NOTE_HI,
  soilStatusLabel,
  type SoilNutrientStatus,
  type SoilTestLevels,
} from "@/lib/agriveda2/fertilizerEngine";

const STATUSES: SoilNutrientStatus[] = ["low", "medium", "high"];

const NUTRIENTS: { key: keyof SoilTestLevels; label: string; hint: string }[] = [
  { key: "n", label: "N", hint: "नाइट्रोजन" },
  { key: "p", label: "P", hint: "फॉस्फोरस" },
  { key: "k", label: "K", hint: "पोटाश" },
];

interface SoilTestInputsProps {
  value: SoilTestLevels;
  onChange: (next: SoilTestLevels) => void;
  className?: string;
}

/** Compact Low / Medium / High toggles for optional soil-test adjust. */
export default function SoilTestInputs({ value, onChange, className }: SoilTestInputsProps) {
  const setStatus = (key: keyof SoilTestLevels, status: SoilNutrientStatus | undefined) => {
    const next = { ...value };
    if (status === undefined || value[key] === status) {
      delete next[key];
    } else {
      next[key] = status;
    }
    onChange(next);
  };

  const clearAll = () => onChange({});

  return (
    <div
      className={cn(
        "rounded-xl border border-amber-500/25 bg-amber-500/5 p-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold text-[var(--av-text-primary)]">
            मिट्टी जाँच (वैकल्पिक)
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
            {SOIL_ADJUST_NOTE_HI}
          </p>
        </div>
        {(value.n || value.p || value.k) && (
          <button
            type="button"
            onClick={clearAll}
            className="shrink-0 text-[10px] font-bold text-amber-800 underline dark:text-amber-200"
          >
            हटाएँ
          </button>
        )}
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {NUTRIENTS.map((n) => (
          <div key={n.key}>
            <p className="text-[10px] font-bold text-[var(--av-text-secondary)]">
              {n.label}{" "}
              <span className="font-medium text-[var(--av-text-muted)]">({n.hint})</span>
            </p>
            <div className="mt-1 flex gap-1">
              {STATUSES.map((s) => {
                const active = value[n.key] === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(n.key, s)}
                    className={cn(
                      "flex-1 rounded-lg border px-1.5 py-1.5 text-[10px] font-bold transition active:scale-[0.97]",
                      active
                        ? s === "low"
                          ? "border-rose-500/45 bg-rose-500/15 text-rose-800 dark:text-rose-200"
                          : s === "high"
                            ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                            : "border-amber-500/45 bg-amber-500/15 text-amber-900 dark:text-amber-200"
                        : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                    )}
                  >
                    {soilStatusLabel(s, true)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[9px] leading-snug text-[var(--av-text-muted)]">
        ज्यादा → उस पोषक ~25% कम · कम → ~20% बढ़ · मध्यम → बिना बदलाव · लेबल नियम मानें
      </p>
    </div>
  );
}
