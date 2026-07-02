"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultMyCrops, type MyCropItem } from "@/data/crop-catalog";
import { cropCatalog } from "@/data/crop-catalog";

const STORAGE_KEY = "agriveda-my-crops";

export function useMyCrops() {
  const [crops, setCrops] = useState<MyCropItem[]>(defaultMyCrops);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCrops(JSON.parse(stored) as MyCropItem[]);
      }
    } catch {
      /* use defaults */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
    }
  }, [crops, hydrated]);

  const isSelected = useCallback(
    (slug: string) => crops.some((c) => c.slug === slug),
    [crops]
  );

  const toggleCrop = useCallback((slug: string) => {
    setCrops((prev) => {
      const exists = prev.find((c) => c.slug === slug);
      if (exists) {
        return prev.filter((c) => c.slug !== slug);
      }
      const catalog = cropCatalog.find((c) => c.slug === slug);
      if (!catalog) return prev;
      return [...prev, { slug: catalog.slug, name: catalog.name, emoji: catalog.emoji }];
    });
  }, []);

  const removeCrop = useCallback((slug: string) => {
    setCrops((prev) => prev.filter((c) => c.slug !== slug));
  }, []);

  return { crops, hydrated, isSelected, toggleCrop, removeCrop, setCrops };
}
