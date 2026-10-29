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
import type {
  FarmActivity,
  FarmAlert,
  FarmData,
  FarmField,
  FarmNote,
  FarmTask,
  FieldObservation,
  CropSeason,
  SatelliteObservation,
  TaskStatus,
} from "@/lib/farm/types";

const KEY = "agriveda-farm-data";

function loadFarmData(): FarmData {
  if (typeof window === "undefined") return EMPTY_FARM_DATA;
  const stored = readStorage<Partial<FarmData> | null>(KEY, null);
  if (!stored) return EMPTY_FARM_DATA;
  const clean = sanitizeLegacyFarmData(stored);
  const raw: FarmData = {
    fields: stored.fields ?? [],
    seasons: stored.seasons ?? [],
    observations: stored.observations ?? [],
    satelliteObservations: stored.satelliteObservations ?? [],
    tasks: stored.tasks ?? [],
    alerts: stored.alerts ?? [],
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
        seasons: prev.seasons.filter((s) => s.fieldId !== id),
        observations: prev.observations.filter((o) => o.fieldId !== id),
        satelliteObservations: prev.satelliteObservations.filter((sat) => sat.fieldId !== id),
        tasks: prev.tasks.filter((t) => t.fieldId !== id),
        alerts: prev.alerts.filter((a) => a.fieldId !== id),
      };
      writeStorage(KEY, next);
      syncSprayFieldsFromFarm(next.fields);
      syncMyCropsFromFarm(next.fields);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  // --- Crop Season Operations ---
  const addSeason = useCallback(
    (season: Omit<CropSeason, "id" | "createdAt" | "updatedAt">) => {
      const id = `cs-${season.fieldId}-${Date.now()}`;
      const now = new Date().toISOString();
      const newSeason: CropSeason = {
        ...season,
        id,
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => {
        const next = { ...prev, seasons: [newSeason, ...prev.seasons] };
        writeStorage(KEY, next);
        queueFarmCloudSync();
        return next;
      });
      return id;
    },
    []
  );

  const updateSeason = useCallback((id: string, updates: Partial<CropSeason>) => {
    setData((prev) => {
      const next = {
        ...prev,
        seasons: prev.seasons.map((s) =>
          s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        ),
      };
      writeStorage(KEY, next);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  // --- Field Observations & Problem Markers ---
  const addObservation = useCallback(
    (obs: Omit<FieldObservation, "id" | "createdAt">) => {
      const id = `obs-${Date.now()}`;
      const now = new Date().toISOString();
      const newObs: FieldObservation = { ...obs, id, createdAt: now };
      setData((prev) => {
        const next = { ...prev, observations: [newObs, ...prev.observations] };
        writeStorage(KEY, next);
        queueFarmCloudSync();
        return next;
      });
      return id;
    },
    []
  );

  const deleteObservation = useCallback((id: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        observations: prev.observations.filter((o) => o.id !== id),
      };
      writeStorage(KEY, next);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  // --- Satellite Observations ---
  const addSatelliteObservation = useCallback((sat: SatelliteObservation) => {
    setData((prev) => {
      // Avoid duplicate scene for same field
      const exists = prev.satelliteObservations.some(
        (s) => s.fieldId === sat.fieldId && s.sceneId === sat.sceneId
      );
      if (exists) return prev;
      const next = {
        ...prev,
        satelliteObservations: [sat, ...prev.satelliteObservations],
      };
      writeStorage(KEY, next);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  // --- Farm Tasks ---
  const addTask = useCallback((task: Omit<FarmTask, "id">) => {
    const id = `tsk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTask: FarmTask = { ...task, id };
    setData((prev) => {
      const next = { ...prev, tasks: [...prev.tasks, newTask] };
      writeStorage(KEY, next);
      queueFarmCloudSync();
      return next;
    });
    return id;
  }, []);

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus, farmerNotes?: string) => {
      setData((prev) => {
        const next = {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  completedAt: status === "completed" ? new Date().toISOString() : undefined,
                  farmerNotes: farmerNotes ?? t.farmerNotes,
                }
              : t
          ),
        };
        writeStorage(KEY, next);
        queueFarmCloudSync();
        return next;
      });
    },
    []
  );

  // --- Farm Alerts ---
  const addAlert = useCallback((alert: Omit<FarmAlert, "id" | "createdAt">) => {
    const id = `alt-${Date.now()}`;
    const newAlert: FarmAlert = {
      ...alert,
      id,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => {
      const next = { ...prev, alerts: [newAlert, ...prev.alerts] };
      writeStorage(KEY, next);
      queueFarmCloudSync();
      return next;
    });
    return id;
  }, []);

  const markAlertRead = useCallback((alertId: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        alerts: prev.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
      };
      writeStorage(KEY, next);
      queueFarmCloudSync();
      return next;
    });
  }, []);

  // --- Farm Activity & Notes ---
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
    upcomingTasks: (data?.tasks ?? []).filter((t) => t.status !== "completed").length,
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
    addSeason,
    updateSeason,
    addObservation,
    deleteObservation,
    addSatelliteObservation,
    addTask,
    updateTaskStatus,
    addAlert,
    markAlertRead,
    addActivity,
    addNote,
    persist,
    setFields,
    initializeFarm: initializeFarmData,
    parseAreaAcres,
  };
}
