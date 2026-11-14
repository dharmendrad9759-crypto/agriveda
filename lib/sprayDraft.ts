const KEY = "agriveda-spray-draft";

export type SprayDraft = {
  crop: string;
  stage: string;
  problem: string;
  med: string;
  dose: string;
};

export function writeSprayDraft(draft: SprayDraft): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* private mode */
  }
}

export function readSprayDraft(): SprayDraft | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SprayDraft>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      crop: String(parsed.crop || ""),
      stage: String(parsed.stage || ""),
      problem: String(parsed.problem || ""),
      med: String(parsed.med || ""),
      dose: String(parsed.dose || ""),
    };
  } catch {
    return null;
  }
}

export function clearSprayDraft(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
