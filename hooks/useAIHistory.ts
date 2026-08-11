"use client";

import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { randomId } from "@/lib/randomId";
import { readStorage, writeStorage } from "@/lib/storage";
import { useCallback, useEffect, useState } from "react";

export interface AIHistoryEntry {
  id: string;
  timestamp: string;
  fileName: string;
  /** Empty when diagnosis was symptoms-only (no photo). Prefer data: JPEG thumbs. */
  thumbnailUrl: string;
  result: DiagnosisResult;
}

const KEY = "agriveda-ai-history";
const MAX = 20;

/** blob: URLs die after reload — never keep them in history. */
function sanitizeThumb(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("blob:")) return "";
  if (url.startsWith("data:image/") || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return "";
}

function sanitizeEntry(entry: AIHistoryEntry): AIHistoryEntry {
  return { ...entry, thumbnailUrl: sanitizeThumb(entry.thumbnailUrl) };
}

export function useAIHistory() {
  const [history, setHistory] = useState<AIHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = readStorage<AIHistoryEntry[]>(KEY, []);
    const cleaned = raw.map(sanitizeEntry);
    const changed = cleaned.some((e, i) => e.thumbnailUrl !== raw[i]?.thumbnailUrl);
    if (changed) writeStorage(KEY, cleaned);
    setHistory(cleaned);
    setHydrated(true);
  }, []);

  const addEntry = useCallback((entry: Omit<AIHistoryEntry, "id" | "timestamp">) => {
    const full: AIHistoryEntry = sanitizeEntry({
      ...entry,
      id: randomId(),
      timestamp: new Date().toISOString(),
    });
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
