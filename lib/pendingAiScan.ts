const STORAGE_KEY = "agriveda-pending-ai-scan";

export interface PendingAiScan {
  dataUrl: string;
  fileName: string;
  cropSlug: string;
  autoScan?: boolean;
}

export function savePendingAiScan(payload: PendingAiScan): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function peekPendingAiScan(): PendingAiScan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingAiScan;
  } catch {
    return null;
  }
}

export function clearPendingAiScan(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

const SCAN_LOCK_KEY = "agriveda-pending-scan-lock";

/** Claim pending scan once (safe under React Strict Mode double-mount). */
export function claimPendingAiScan(): PendingAiScan | null {
  const pending = peekPendingAiScan();
  if (!pending) return null;
  if (typeof window !== "undefined" && sessionStorage.getItem(SCAN_LOCK_KEY)) {
    return null;
  }
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SCAN_LOCK_KEY, "1");
  }
  clearPendingAiScan();
  return pending;
}

export function releasePendingScanLock(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SCAN_LOCK_KEY);
}

/** @deprecated Use claimPendingAiScan — kept for compatibility */
export function consumePendingAiScan(): PendingAiScan | null {
  return claimPendingAiScan();
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || "image/jpeg" });
}
