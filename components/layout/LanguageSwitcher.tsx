"use client";

import { Languages, X, Check } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";
import { applyPageTranslation, TRANSLATE_LANGUAGES } from "@/lib/translator";

const OPTIONS: {
  locale: AppLocale;
  labelKey: "english" | "hindi" | "langHinglish";
  hintKey: "langEnglishHint" | "langHindiHint" | "langHinglishHint";
}[] = [
  { locale: "en", labelKey: "english", hintKey: "langEnglishHint" },
  { locale: "hi", labelKey: "hindi", hintKey: "langHindiHint" },
  { locale: "hinglish", labelKey: "langHinglish", hintKey: "langHinglishHint" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  // Keep AI Doctor uncluttered — language remains available via Profile/Settings.
  if (pathname?.startsWith("/ai-doctor")) return null;

  const pick = (next: AppLocale) => {
    setLocale(next);
    setOpen(false);

    // Full-page Google Translate so pest/mandi English content becomes Hindi
    if (next === "hi") {
      const hi = TRANSLATE_LANGUAGES.find((l) => l.code === "hi");
      if (hi) applyPageTranslation(hi);
      return;
    }
    if (next === "en") {
      const en = TRANSLATE_LANGUAGES.find((l) => l.code === "en");
      if (en) applyPageTranslation(en);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-36 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-600 text-white shadow-lg transition hover:scale-105 md:bottom-8 md:right-8"
        aria-label={t("translateFabHint")}
      >
        <Languages className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div
            role="dialog"
            aria-label={t("chooseLanguage")}
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-500/25 bg-[var(--background)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
              <div>
                <h2 className="text-base font-extrabold theme-text-primary">{t("chooseLanguage")}</h2>
                <p className="text-[11px] theme-text-muted">{t("langSwitcherHint")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 theme-text-muted"
                aria-label={t("closeLabel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="space-y-2 p-3">
              {OPTIONS.map((opt) => (
                <li key={opt.locale}>
                  <button
                    type="button"
                    onClick={() => pick(opt.locale)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-bold transition",
                      locale === opt.locale
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "border-transparent theme-text-primary hover:bg-emerald-500/10"
                    )}
                  >
                    <span>
                      {t(opt.labelKey)}
                      <span className="mt-0.5 block text-[10px] font-medium theme-text-muted">
                        {t(opt.hintKey)}
                      </span>
                    </span>
                    {locale === opt.locale && <Check className="h-4 w-4 text-emerald-500" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
