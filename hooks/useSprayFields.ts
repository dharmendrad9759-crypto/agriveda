"use client";

import { useCallback, useEffect, useState } from "react";
import type { FarmerField } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "agriveda-spray-fields";

const DEFAULT_FIELDS: FarmerField[] = [];

export function useSprayFields() {
  const [fields, setFields] = useState<FarmerField[]>(DEFAULT_FIELDS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFields(readStorage(KEY, DEFAULT_FIELDS));
    setHydrated(true);
  }, []);

  const addField = useCallback((name: string, cropSlug: string, areaAcres?: string) => {
    const field: FarmerField = {
      id: `field-${Date.now()}`,
      name,
      cropSlug,
      areaAcres,
    };
    setFields((prev) => {
      const next = [...prev, field];
      writeStorage(KEY, next);
      return next;
    });
    return field;
  }, []);

  const updateField = useCallback((id: string, patch: Partial<FarmerField>) => {
    setFields((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...patch } : f));
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  return { fields, hydrated, addField, updateField };
}
