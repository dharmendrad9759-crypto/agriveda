"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { readStorage, writeStorage } from "@/lib/storage";
import { randomId } from "@/lib/randomId";

export interface AIHistoryEntry {
  id: string;
  timestamp: string;
  fileName: string;
  /** Empty when diagnosis was symptoms-only (no photo). */
  thumbnailUrl: string;
  result: DiagnosisResult;
}

const KEY = "agriveda-ai-history";
const MAX = 20;

export function useAIHistory() {
  const [history, setHistory] = useState<AIHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = readStorage<AIHistoryEntry[]>(KEY, []);
    // Drop dead blob: URLs from older builds — they break after reload
    const cleaned = raw.map((e) =>
      e.thumbnailUrl?.startsWith("blob:") ? { ...e, thumbnailUrl: "" } : e
    );
    setHistory(cleaned);
    if (cleaned.some((e, i) => e.thumbnailUrl !== raw[i]?.thumbnailUrl)) {
      writeStorage(KEY, cleaned);
    }
    setHydrated(true);
  }, []);

  const addEntry = useCallback((entry: Omit<AIHistoryEntry, "id" | "timestamp">) => {
    const thumb =
      entry.thumbnailUrl?.startsWith("blob:") ? "" : entry.thumbnailUrl || "";
    const full: AIHistoryEntry = {
      ...entry,
      thumbnailUrl: thumb,
      id: randomId(),
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => {
      const next = [full, ...prev].slice(0, MAX);
      writeStorage(KEY, next);
      return next;
    });
    return full;
  }, []);

  const clearHistory = useCallback(() => {
    writeStorage(KEY, []);
    setHistory([]);
  }, []);

  return { history, hydrated, addEntry, clearHistory };
}
