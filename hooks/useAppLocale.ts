"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import type { AppLocale } from "@/lib/i18n/farmer-ui";

const KEY = "agriveda-app-locale";

export function useAppLocale() {
  const [locale, setLocaleState] = useState<AppLocale>("hi");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage<AppLocale | null>(KEY, null);
    if (stored === "en" || stored === "hi") setLocaleState(stored);
    setHydrated(true);
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    writeStorage(KEY, next);
  }, []);

  return { locale, setLocale, hydrated };
}
