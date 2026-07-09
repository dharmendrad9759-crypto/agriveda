"use client";

import { useCallback, useEffect, useState } from "react";
import { DASHBOARD_ACTIVITIES } from "@/data/mock/dashboard";
import {
  FARM_FIELDS,
  FARM_NOTES,
} from "@/data/mock/farm";
import { readStorage, writeStorage } from "@/lib/storage";
import type { FarmActivity, FarmData, FarmField, FarmNote } from "@/lib/farm/types";

const KEY = "agriveda-farm-data";

function defaultFarmData(): FarmData {
  return {
    fields: FARM_FIELDS.map((f) => ({
      ...f,
      health: f.status === "Active" ? 78 : 65,
      stage: f.crop.includes("Paddy") ? "Tillering" : "Active growth",
    })),
    activities: DASHBOARD_ACTIVITIES.map((a) => ({
      id: a.id,
      task: a.task,
      field: a.field,
      date: a.date,
    })),
    notes: FARM_NOTES.map((n, i) => ({
      id: String(i + 1),
      title: n.title,
      body: n.body,
      date: n.date,
      pinned: n.pinned,
    })),
  };
}

function loadFarmData(): FarmData {
  if (typeof window === "undefined") return defaultFarmData();
  const stored = readStorage<Partial<FarmData> | null>(KEY, null);
  if (!stored?.fields?.length) return defaultFarmData();
  return {
    fields: stored.fields,
    activities: stored.activities ?? defaultFarmData().activities,
    notes: stored.notes ?? defaultFarmData().notes,
  };
}

export function useFarmData() {
  const [data, setData] = useState<FarmData>(defaultFarmData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadFarmData());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: FarmData) => {
    setData(next);
    writeStorage(KEY, next);
  }, []);

  const addField = useCallback((field: Omit<FarmField, "id">) => {
    const id = `f-${Date.now()}`;
    setData((prev) => {
      const next = { ...prev, fields: [...prev.fields, { ...field, id }] };
      writeStorage(KEY, next);
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
    cropsGrowing: new Set(data.fields.filter((f) => f.status === "Active").map((f) => f.crop.split("(")[0].trim())).size,
    upcomingTasks: data.activities.length,
    healthScore: Math.round(
      data.fields.reduce((sum, f) => sum + (f.health ?? 75), 0) / Math.max(data.fields.length, 1)
    ),
  };

  return { data, hydrated, stats, addField, addActivity, addNote, persist };
}
