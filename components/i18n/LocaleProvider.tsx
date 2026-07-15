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
import { t as translate, type AppLocale, type FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { readStorage, writeStorage } from "@/lib/storage";

const LOCALE_KEY = "agriveda-app-locale";
const LEGACY_TRANSLATE_KEY = "agriveda-translate-lang";

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  hydrated: boolean;
  t: (key: FarmerUiKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readInitialLocale(): AppLocale {
  const stored = readStorage<AppLocale | null>(LOCALE_KEY, null);
  if (stored === "en" || stored === "hi" || stored === "hinglish") return stored;

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

  // One-time: if UI locale is Hindi but page isn't translating, apply cookie + reload
  useEffect(() => {
    if (!hydrated || locale !== "hi") return;
    try {
      if (document.cookie.includes("googtrans=/en/hi")) return;
      if (sessionStorage.getItem("agriveda-hi-translate-boot") === "1") return;
      sessionStorage.setItem("agriveda-hi-translate-boot", "1");
      document.cookie = "googtrans=/en/hi; path=/; max-age=31536000";
      window.location.reload();
    } catch {
      /* ignore */
    }
  }, [locale, hydrated]);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    writeStorage(LOCALE_KEY, next);
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
