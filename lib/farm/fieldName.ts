import type { FarmField } from "@/lib/farm/types";

const LAST_FIELD_KEY = "agriveda-last-field-id";

export function rememberField(id: string) {
  try {
    localStorage.setItem(LAST_FIELD_KEY, id);
  } catch {
    /* ignore */
  }
}

export function lastFieldId(): string | null {
  try {
    return localStorage.getItem(LAST_FIELD_KEY);
  } catch {
    return null;
  }
}

/** Farmer-facing name like "गेहूँ वाला खेत 2" — never a hardcoded "मेरा खेत 1". */
export function suggestFieldName(opts: {
  existing: Pick<FarmField, "name">[];
  cropHi?: string;
  village?: string;
}): string {
  const used = new Set(
    opts.existing.map((f) => (f.name || "").trim().toLowerCase()).filter(Boolean)
  );
  const crop = (opts.cropHi || "").trim();
  const village = (opts.village || "").trim();
  const n = opts.existing.length + 1;

  const candidates = [
    crop && village ? `${village} · ${crop}` : "",
    crop ? `${crop} वाला खेत` : "",
    village ? `${village} खेत ${n}` : "",
    `खेत ${n}`,
  ].filter(Boolean);

  for (const base of candidates) {
    if (!used.has(base.toLowerCase())) return base;
    for (let i = 2; i <= 40; i += 1) {
      const next = `${base} ${i}`;
      if (!used.has(next.toLowerCase())) return next;
    }
  }
  return `खेत ${n}`;
}

export function displayFieldName(name?: string) {
  const raw = (name || "").trim();
  if (!raw) return "खेत";
  if (/^\d+$/.test(raw)) return `खेत ${raw}`;
  return raw;
}
