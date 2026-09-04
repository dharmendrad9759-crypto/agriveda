"use client";

import { useCallback, useEffect, useState } from "react";
import type { MandiApiResponse, MandiRow } from "@/lib/mandi/types";
import { expandMockMandi } from "@/lib/mandi/expandMockMandi";
import { dedupeMandiRows } from "@/lib/mandi/fetchDataGov";
import { enrichMockWithChange } from "@/lib/mandi/mapDataGov";
import { buildMandiFilterOptions } from "@/lib/mandi/marketAnalytics";
import { recordMandiSnapshot, enrichRowsWithHistory } from "@/lib/mandi/historyCache";
import { syncMandiHistoryToServiceWorker } from "@/lib/offline/offlinePack";

interface UseMandiPricesOptions {
  state?: string;
}

export function useMandiPrices({ state = "Madhya Pradesh" }: UseMandiPricesOptions = {}) {
  const [data, setData] = useState<MandiApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ state });
      const res = await fetch(`/api/mandi?${params}`);
      if (res.ok) {
        const json = (await res.json()) as MandiApiResponse;
        recordMandiSnapshot(state, undefined, json.rows);
        setData({
          ...json,
          rows: enrichRowsWithHistory(state, undefined, json.rows),
        });
        void syncMandiHistoryToServiceWorker();
      } else {
        const mockRows = enrichMockWithChange(expandMockMandi(state));
        recordMandiSnapshot(state, undefined, mockRows);
        setData({
          source: "mock",
          state,
          lastUpdated: new Date().toLocaleString("en-IN"),
          rows: enrichRowsWithHistory(state, undefined, mockRows),
          filters: buildMandiFilterOptions(mockRows),
          error: "Failed to load mandi data",
        });
      }
    } catch {
      const mockRows = enrichMockWithChange(expandMockMandi(state));
      recordMandiSnapshot(state, undefined, mockRows);
      setData({
        source: "mock",
        state,
        lastUpdated: new Date().toLocaleString("en-IN"),
        rows: enrichRowsWithHistory(state, undefined, mockRows),
        filters: buildMandiFilterOptions(mockRows),
        error: "Network error",
      });
    } finally {
      setLoading(false);
    }
  }, [state]);

  const enrichDistrict = useCallback(
    async (state: string, district: string) => {
      if (!district.trim()) return;
      setDistrictLoading(true);
      try {
        const params = new URLSearchParams({ state, district: district.trim() });
        const res = await fetch(`/api/mandi?${params}`);
        if (!res.ok) return;
        const json = (await res.json()) as MandiApiResponse;
        setData((prev) => {
          if (!prev) return prev;
          const merged = dedupeMandiRows([...prev.rows, ...json.rows]);
          recordMandiSnapshot(state, district, merged);
          return {
            ...prev,
            rows: enrichRowsWithHistory(state, district, merged),
          };
        });
        void syncMandiHistoryToServiceWorker();
      } finally {
        setDistrictLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, districtLoading, refresh: load, enrichDistrict };
}
