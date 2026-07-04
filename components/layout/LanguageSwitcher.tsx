"use client";

import { Languages, X } from "lucide-react";
import { useState } from "react";
import { useAppLocale } from "@/hooks/useAppLocale";
import { t } from "@/lib/i18n/farmer-ui";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  /** Floating button (home) vs header chip */
  variant?: "fab" | "chip";
}

export default function LanguageSwitcher({ variant = "chip" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useAppLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "fab" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-48 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-600 text-white shadow-lg transition hover:scale-105 md:bottom-32"
          aria-label={t(locale, "language")}
        >
          <Languages className="h-5 w-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-black text-emerald-400"
        >
          <Languages className="h-3.5 w-3.5" />
          {locale === "hi" ? "हिंदी" : "EN"}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-label={t(locale, "chooseLanguage")}
            className="w-full max-w-sm rounded-3xl border border-emerald-500/20 bg-[var(--background)] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold theme-text-primary">
                {t(locale, "chooseLanguage")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 theme-text-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setLocale("hi");
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-bold",
                  locale === "hi"
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "border-gray-200 theme-text-primary dark:border-white/10"
                )}
              >
                <span>सरल हिंदी</span>
                <span className="text-xs theme-text-muted">किसान भाषा</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocale("en");
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-bold",
                  locale === "en"
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "border-gray-200 theme-text-primary dark:border-white/10"
                )}
              >
                <span>English</span>
                <span className="text-xs theme-text-muted">Simple English</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
