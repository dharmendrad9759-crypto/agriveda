import type { ThreatType } from "@/types/pest-disease-ui";

export function threatDetailPath(cropSlug: string, type: ThreatType, id: string): string {
  return `/pest-diseases/${cropSlug}/${type}/${encodeURIComponent(id)}`;
}

/** Stable id for dossier / management pests not yet in the thin pest-disease catalog. */
export function managementThreatId(
  kind: "pest" | "disease" | "weed",
  name: string,
  scientific?: string | null,
  index = 0
): string {
  const raw = (scientific || name || `item-${index}`)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0900-\u097f]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
  return `m${kind[0]}-${raw || index}`;
}
