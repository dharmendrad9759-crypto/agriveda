"use client";

import { useCallback, useEffect, useState } from "react";
import { type MyCropItem, cropCatalog } from "@/data/crop-catalog";

const STORAGE_KEY = "agriveda-my-crops";
export const MAX_MY_CROPS = 4;

export function useMyCrops() {
  const [crops, setCrops] = useState<MyCropItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MyCropItem[];
        setCrops(parsed.slice(0, MAX_MY_CROPS));
      } else {
        setCrops([]);
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
      if (prev.length >= MAX_MY_CROPS) {
        return prev;
      }
      const catalog = cropCatalog.find((c) => c.slug === slug);
      if (!catalog) return prev;
      return [...prev, { slug: catalog.slug, name: catalog.name, emoji: catalog.emoji }];
    });
  }, []);

  const canAddMore = crops.length < MAX_MY_CROPS;

  const removeCrop = useCallback((slug: string) => {
    setCrops((prev) => prev.filter((c) => c.slug !== slug));
  }, []);

  return { crops, hydrated, isSelected, toggleCrop, removeCrop, setCrops, canAddMore, maxCrops: MAX_MY_CROPS };
}
