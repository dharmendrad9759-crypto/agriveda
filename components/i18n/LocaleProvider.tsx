"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { t as translate, type AppLocale, type FarmerUiKey, normalizeAppLocale } from "@/lib/i18n/farmer-ui";
import { readStorage, writeStorage } from "@/lib/storage";

const LOCALE_KEY = "agriveda-app-locale";
const LEGACY_TRANSLATE_KEY = "agriveda-translate-lang";

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale | string) => void;
  hydrated: boolean;
  t: (key: FarmerUiKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readInitialLocale(): AppLocale {
  const stored = readStorage<string | null>(LOCALE_KEY, null);
  if (stored) {
    const normalized = normalizeAppLocale(stored);
    if (stored === "hinglish") writeStorage(LOCALE_KEY, normalized);
    return normalized;
  }

  try {
    const legacy = localStorage.getItem(LEGACY_TRANSLATE_KEY);
    if (legacy === "en") return "en";
    if (legacy && legacy !== "en") return "hi";
  } catch {
    /* ignore */
  }

  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(readInitialLocale());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale === "en" ? "en" : "hi";
  }, [locale, hydrated]);

  const setLocale = useCallback((next: AppLocale | string) => {
    const normalized = normalizeAppLocale(next);
    setLocaleState(normalized);
    writeStorage(LOCALE_KEY, normalized);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      hydrated,
      t: (key: FarmerUiKey) => translate(locale, key),
    }),
    [locale, setLocale, hydrated]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
