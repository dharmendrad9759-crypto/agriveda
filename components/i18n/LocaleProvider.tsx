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
import {
  t as translate,
  tf as translateFill,
  type AppLocale,
  type FarmerUiKey,
} from "@/lib/i18n/farmer-ui";
import { readStorage, writeStorage } from "@/lib/storage";

const LOCALE_KEY = "agriveda-app-locale";
const LOCALE_PICKED_KEY = "agriveda-locale-picked";
const LEGACY_TRANSLATE_KEY = "agriveda-translate-lang";

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  hydrated: boolean;
  localePicked: boolean;
  t: (key: FarmerUiKey) => string;
  tf: (key: FarmerUiKey, vars: Record<string, string | number>) => string;
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

export function hasLocaleBeenPicked(): boolean {
  return readStorage<boolean>(LOCALE_PICKED_KEY, false) === true;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const [localePicked, setLocalePicked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(readInitialLocale());
    setLocalePicked(hasLocaleBeenPicked());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale === "en" ? "en" : "hi";
  }, [locale, hydrated]);

  // One-time: if UI locale is Hindi but page isn't translating, apply cookie + reload
  useEffect(() => {
    if (!hydrated || locale !== "hi" || !localePicked) return;
    try {
      if (document.cookie.includes("googtrans=/en/hi")) return;
      if (sessionStorage.getItem("agriveda-hi-translate-boot") === "1") return;
      sessionStorage.setItem("agriveda-hi-translate-boot", "1");
      document.cookie = "googtrans=/en/hi; path=/; max-age=31536000";
      window.location.reload();
    } catch {
      /* ignore */
    }
  }, [locale, hydrated, localePicked]);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    writeStorage(LOCALE_KEY, next);
    writeStorage(LOCALE_PICKED_KEY, true);
    setLocalePicked(true);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      hydrated,
      localePicked,
      t: (key: FarmerUiKey) => translate(locale, key),
      tf: (key: FarmerUiKey, vars: Record<string, string | number>) =>
        translateFill(locale, key, vars),
    }),
    [locale, setLocale, hydrated, localePicked]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
