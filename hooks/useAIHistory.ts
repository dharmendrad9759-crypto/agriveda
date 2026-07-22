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
    setHistory(readStorage<AIHistoryEntry[]>(KEY, []));
    setHydrated(true);
  }, []);

  const addEntry = useCallback((entry: Omit<AIHistoryEntry, "id" | "timestamp">) => {
    const full: AIHistoryEntry = {
      ...entry,
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
