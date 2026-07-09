"use client";

import { useCallback, useEffect, useState } from "react";
import type { MandiApiResponse } from "@/lib/mandi/types";
import { MANDI_PRICES } from "@/data/mock/mandi";
import { enrichMockWithChange } from "@/lib/mandi/mapDataGov";

interface UseMandiPricesOptions {
  state?: string;
  district?: string;
}

export function useMandiPrices({ state = "Madhya Pradesh", district }: UseMandiPricesOptions = {}) {
  const [data, setData] = useState<MandiApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ state });
      if (district?.trim()) params.set("district", district.trim());
      const res = await fetch(`/api/mandi?${params}`);
      if (res.ok) {
        setData((await res.json()) as MandiApiResponse);
      } else {
        setData({
          source: "mock",
          state,
          district,
          lastUpdated: new Date().toLocaleString("en-IN"),
          rows: enrichMockWithChange(MANDI_PRICES),
          error: "Failed to load mandi data",
        });
      }
    } catch {
      setData({
        source: "mock",
        state,
        district,
        lastUpdated: new Date().toLocaleString("en-IN"),
        rows: enrichMockWithChange(MANDI_PRICES),
        error: "Network error",
      });
    } finally {
      setLoading(false);
    }
  }, [state, district]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, refresh: load };
}
