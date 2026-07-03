"use client";

import { useCallback, useEffect, useState } from "react";
import type { SprayLocale } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "agriveda-spray-locale";

export function useSprayLocale() {
  const [locale, setLocaleState] = useState<SprayLocale>("hi");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage<SprayLocale>(KEY, "hi");
    setLocaleState(stored);
    setHydrated(true);
  }, []);

  const setLocale = useCallback((l: SprayLocale) => {
    setLocaleState(l);
    writeStorage(KEY, l);
  }, []);

  return { locale, setLocale, hydrated };
}
