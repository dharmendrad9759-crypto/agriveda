import { parseAreaAcres } from "@/lib/farm/farmInit";
import type { FarmField } from "@/lib/farm/types";

export function fieldAcresValue(
  field: Pick<FarmField, "areaAcres" | "area">
): number | undefined {
  if (typeof field.areaAcres === "number" && Number.isFinite(field.areaAcres) && field.areaAcres > 0) {
    return field.areaAcres;
  }
  const n = parseAreaAcres(field.area);
  return n > 0 ? n : undefined;
}

function formatAcresQuery(acres: number): string {
  if (Number.isInteger(acres)) return String(acres);
  return String(Number(acres.toFixed(2)));
}

export function fieldAdvisorHref(
  field: Pick<FarmField, "id" | "cropSlug" | "sowingDateIso" | "sowingDate">
): string {
  const params = new URLSearchParams();
  params.set("fieldId", field.id);
  if (field.cropSlug) params.set("crop", field.cropSlug);
  const sowing = field.sowingDateIso || field.sowingDate;
  if (sowing) params.set("sowing", sowing);
  return `/field-advisor?${params.toString()}`;
}

export function fieldFertilizerHref(
  field: Pick<FarmField, "cropSlug" | "areaAcres" | "area">,
  das: number | null
): string {
  const slug = field.cropSlug;
  if (!slug) return "/services/fertilizer-calculator";
  const params = new URLSearchParams();
  if (das != null && das >= 0) params.set("das", String(das));
  const acres = fieldAcresValue(field);
  if (acres) params.set("acres", formatAcresQuery(acres));
  const q = params.toString();
  return `/crops/${slug}/care/fertilizer${q ? `?${q}` : ""}`;
}
