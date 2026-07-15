"use client";

import { useCallback, useEffect, useState } from "react";
import { type MyCropItem, cropCatalog } from "@/data/crop-catalog";

const STORAGE_KEY = "agriveda-my-crops";
export const MAX_MY_CROPS = 4;

function slugifyName(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return `custom-${base || "crop"}-${Date.now().toString(36)}`;
}

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

  const addCustomCrop = useCallback(
    (input: { name: string; emoji?: string }): { ok: true; crop: MyCropItem } | { ok: false; reason: string } => {
      const name = input.name.trim();
      if (name.length < 2) {
        return { ok: false, reason: "फसल का नाम कम से कम 2 अक्षर लिखें" };
      }
      if (crops.length >= MAX_MY_CROPS) {
        return { ok: false, reason: `Home पर ज्यादा से ज्यादा ${MAX_MY_CROPS} फसलें` };
      }
      const duplicate = crops.some((c) => c.name.toLowerCase() === name.toLowerCase());
      if (duplicate) {
        return { ok: false, reason: "यह फसल पहले से चुनी हुई है" };
      }
      const crop: MyCropItem = {
        slug: slugifyName(name),
        name,
        emoji: input.emoji?.trim() || "🌱",
        custom: true,
      };
      setCrops((prev) => [...prev, crop].slice(0, MAX_MY_CROPS));
      return { ok: true, crop };
    },
    [crops]
  );

  const canAddMore = crops.length < MAX_MY_CROPS;

  const removeCrop = useCallback((slug: string) => {
    setCrops((prev) => prev.filter((c) => c.slug !== slug));
  }, []);

  return {
    crops,
    hydrated,
    isSelected,
    toggleCrop,
    addCustomCrop,
    removeCrop,
    setCrops,
    canAddMore,
    maxCrops: MAX_MY_CROPS,
  };
}
