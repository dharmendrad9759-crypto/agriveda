"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";
import { applyPageTranslation, TRANSLATE_LANGUAGES } from "@/lib/translator";

const OPTIONS: {
  locale: AppLocale;
  label: string;
  hint: string;
}[] = [
  { locale: "hi", label: "सरल हिंदी", hint: "पूरा ऐप हिंदी में" },
  { locale: "en", label: "English", hint: "Full app in English" },
  { locale: "hinglish", label: "Hinglish", hint: "Short mix — English-friendly" },
];

export default function SettingsLanguagePicker() {
  const { locale, setLocale, t } = useLocale();

  const pick = (next: AppLocale) => {
    if (next === locale) return;
    setLocale(next);
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
    <div className="mt-3 space-y-2">
      <p className="text-xs font-bold text-[var(--av-text-primary)]">{t("chooseLanguage")}</p>
      <p className="text-[10px] text-[var(--av-text-muted)]">
        एक बार चुनें — बदलने के लिए सिर्फ Settings में आएँ
      </p>
      <ul className="space-y-1.5">
        {OPTIONS.map((opt) => (
          <li key={opt.locale}>
            <button
              type="button"
              onClick={() => pick(opt.locale)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition",
                locale === opt.locale
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "border-[var(--av-border)] text-[var(--av-text-primary)] hover:bg-emerald-500/10"
              )}
            >
              <span>
                {opt.label}
                <span className="mt-0.5 block text-[10px] font-medium text-[var(--av-text-muted)]">
                  {opt.hint}
                </span>
              </span>
              {locale === opt.locale && <Check className="h-4 w-4 text-emerald-500" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
