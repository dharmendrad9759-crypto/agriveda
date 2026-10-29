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
import { queueFarmCloudSync } from "@/lib/farm/cloudSync";
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
    const onCloud = () => setData(loadFarmData());
    window.addEventListener("agriveda-farm-cloud-hydrated", onCloud);
    return () => window.removeEventListener("agriveda-farm-cloud-hydrated", onCloud);
  }, []);

  const persist = useCallback((next: FarmData) => {
    setData(next);
    writeStorage(KEY, next);
    syncSprayFieldsFromFarm(next.fields);
    syncMyCropsFromFarm(next.fields);
    queueFarmCloudSync();
  }, []);

  const setFields = useCallback(
    (fields: FarmField[]) => {
      persist({ ...data, fields });
    },
    [data, persist]
  );

  const addField = useCallback((field: Omit<FarmField, "id">) => {
    const id = `f-${Date.now()}`;
    const newField = { ...field, id };
    setData((prev) => {
      const next = { ...prev, fields: [...prev.fields, newField] };
      writeStorage(KEY, next);
      syncSprayFieldsFromFarm(next.fields);
      syncMyCropsFromFarm(next.fields);
      queueFarmCloudSync();
      return next;
    });
    return id;
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FarmField>) => {
    setData((prev) => {
      const next = {
        ...prev,
        fields: prev.fields.map((f) =>
          f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
        ),
      };
      writeStorage(KEY, next);
      syncSprayFieldsFromFarm(next.fields);
      syncMyCropsFromFarm(next.fields);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  const deleteField = useCallback((id: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        fields: prev.fields.filter((f) => f.id !== id),
      };
      writeStorage(KEY, next);
      syncSprayFieldsFromFarm(next.fields);
      syncMyCropsFromFarm(next.fields);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  const addActivity = useCallback((activity: Omit<FarmActivity, "id">) => {
    const id = `a-${Date.now()}`;
    setData((prev) => {
      const next = { ...prev, activities: [{ ...activity, id }, ...prev.activities] };
      writeStorage(KEY, next);
      queueFarmCloudSync();
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
      queueFarmCloudSync();
      return next;
    });
  }, []);

  const stats = {
    totalFields: data?.fields?.length ?? 0,
    activeFields: (data?.fields ?? []).filter((f) => f?.status === "Active").length,
    totalAreaAcres: totalAreaAcres(data?.fields ?? []),
    cropsGrowing: new Set(
      (data?.fields ?? [])
        .filter((f) => f?.status === "Active" && f?.crop)
        .map((f) => (f.crop || "").split("(")[0].trim())
        .filter(Boolean)
    ).size,
    upcomingTasks: data?.activities?.length ?? 0,
    /** Only average fields that have a real health value — never invent 75% */
    healthScore: (() => {
      const scored = (data?.fields ?? []).filter(
        (f) => typeof f?.health === "number" && Number.isFinite(f.health)
      );
      if (scored.length === 0) return null;
      return Math.round(
        scored.reduce((sum, f) => sum + (f.health as number), 0) / scored.length
      );
    })(),
    hasRealHealth: (data?.fields ?? []).some(
      (f) => typeof f?.health === "number" && Number.isFinite(f.health)
    ),
  };

  return {
    data,
    hydrated,
    stats,
    addField,
    updateField,
    deleteField,
    addActivity,
    addNote,
    persist,
    setFields,
    initializeFarm: initializeFarmData,
    parseAreaAcres,
  };
}
