"use client";

import { Languages, X, Check } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";

const OPTIONS: {
  locale: AppLocale;
  label: string;
  hintKey: "langEnglishHint" | "langHindiHint";
}[] = [
  { locale: "en", label: "English", hintKey: "langEnglishHint" },
  { locale: "hi", label: "सरल हिंदी", hintKey: "langHindiHint" },
];

export default function LanguageSwitcher() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  // Keep AI Doctor uncluttered — language remains available via Profile/Settings.
  if (pathname?.startsWith("/ai-doctor")) return null;

  const pick = (next: AppLocale) => {
    setLocale(next);
    setOpen(false);
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

      {open && mounted && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-label={t("chooseLanguage")}
                className="relative z-10 w-full max-w-sm rounded-t-[32px] sm:rounded-[28px] border border-emerald-500/25 bg-[var(--background)] px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5 shadow-2xl max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 text-left"
              >
                {/* Mobile drag handle */}
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--av-border-strong,rgba(150,150,150,0.3))] sm:hidden" />
            <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
              <div>
                <h2 className="text-base font-extrabold theme-text-primary">{t("chooseLanguage")}</h2>
                <p className="text-[11px] theme-text-muted">{t("langSwitchNote")}</p>
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
                      {opt.locale === "en" ? t("english") : t("hindi")}
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
            </div>,
            document.body
          )
        : null}
    </>
  );
}
