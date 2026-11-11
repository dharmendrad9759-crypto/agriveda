"use client";

import { useCallback, useEffect, useState } from "react";
import { lastFieldId, rememberField } from "@/lib/farm/fieldName";
import type { FarmField } from "@/lib/farm/types";

/** Chosen field = lastFieldId if it still exists, else fields[0]. */
export function pickActiveField(
  fields: FarmField[],
  preferredId?: string | null
): FarmField | null {
  if (fields.length === 0) return null;
  if (preferredId) {
    const preferred = fields.find((f) => f.id === preferredId);
    if (preferred) return preferred;
  }
  const last = lastFieldId();
  if (last) {
    const remembered = fields.find((f) => f.id === last);
    if (remembered) return remembered;
  }
  return fields[0] ?? null;
}

export function useActiveField(fields: FarmField[], hydrated = true) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (selectedId && !fields.some((f) => f.id === selectedId)) {
      const picked = pickActiveField(fields);
      setSelectedId(picked?.id ?? null);
    }
  }, [hydrated, fields, selectedId]);

  const setActiveField = useCallback((id: string) => {
    rememberField(id);
    setSelectedId(id);
  }, []);

  const activeField = hydrated ? pickActiveField(fields, selectedId) : null;

  return { activeField, setActiveField, selectedId };
}
