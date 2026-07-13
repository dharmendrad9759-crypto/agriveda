"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_FARM_DATA,
  initializeFarmData,
  parseAreaAcres,
  syncMyCropsFromFarm,
  syncSprayFieldsFromFarm,
  totalAreaAcres,
} from "@/lib/farm/farmInit";
import { sanitizeLegacyFarmData } from "@/lib/farm/legacyMock";
import { readStorage, writeStorage } from "@/lib/storage";
import type { FarmActivity, FarmData, FarmField, FarmNote } from "@/lib/farm/types";

const KEY = "agriveda-farm-data";

function loadFarmData(): FarmData {
  if (typeof window === "undefined") return EMPTY_FARM_DATA;
  const stored = readStorage<Partial<FarmData> | null>(KEY, null);
  if (!stored) return EMPTY_FARM_DATA;
  const clean = sanitizeLegacyFarmData(stored);
  const raw: FarmData = {
    fields: stored.fields ?? [],
    activities: stored.activities ?? [],
    notes: stored.notes ?? [],
  };
  if (JSON.stringify(clean) !== JSON.stringify(raw)) {
    writeStorage(KEY, clean);
  }
  return clean;
}

export function useFarmData() {
  const [data, setData] = useState<FarmData>(EMPTY_FARM_DATA);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadFarmData());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: FarmData) => {
    setData(next);
    writeStorage(KEY, next);
    syncSprayFieldsFromFarm(next.fields);
    syncMyCropsFromFarm(next.fields);
  }, []);

  const setFields = useCallback(
    (fields: FarmField[]) => {
      persist({ ...data, fields });
    },
    [data, persist]
  );

  const addField = useCallback((field: Omit<FarmField, "id">) => {
    const id = `f-${Date.now()}`;
    setData((prev) => {
      const next = { ...prev, fields: [...prev.fields, { ...field, id }] };
      writeStorage(KEY, next);
      syncSprayFieldsFromFarm(next.fields);
      syncMyCropsFromFarm(next.fields);
      return next;
    });
  }, []);

  const addActivity = useCallback((activity: Omit<FarmActivity, "id">) => {
    const id = `a-${Date.now()}`;
    setData((prev) => {
      const next = { ...prev, activities: [{ ...activity, id }, ...prev.activities] };
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  const addNote = useCallback((note: Omit<FarmNote, "id" | "date"> & { date?: string }) => {
    const id = `n-${Date.now()}`;
    setData((prev) => {
      const next = {
        ...prev,
        notes: [
          {
            id,
            title: note.title,
            body: note.body,
            pinned: note.pinned ?? false,
            date: note.date ?? new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          },
          ...prev.notes,
        ],
      };
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  const stats = {
    totalFields: data.fields.length,
    activeFields: data.fields.filter((f) => f.status === "Active").length,
    totalAreaAcres: totalAreaAcres(data.fields),
    cropsGrowing: new Set(
      data.fields.filter((f) => f.status === "Active").map((f) => f.crop.split("(")[0].trim())
    ).size,
    upcomingTasks: data.activities.length,
    healthScore:
      data.fields.length === 0
        ? 0
        : Math.round(
            data.fields.reduce((sum, f) => sum + (f.health ?? 75), 0) / data.fields.length
          ),
  };

  return {
    data,
    hydrated,
    stats,
    addField,
    addActivity,
    addNote,
    persist,
    setFields,
    initializeFarm: initializeFarmData,
    parseAreaAcres,
  };
}
