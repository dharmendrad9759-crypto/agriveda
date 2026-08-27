import type { CropTabId } from "@/lib/crops/crop-tabs";
import { isCropTabId } from "@/lib/crops/crop-tabs";

/** Dedicated care page path — opens as next page, not in-page tab slide */
export function cropCareHref(slug: string, tab: CropTabId): string {
  if (tab === "overview") return `/crops/${slug}`;
  return `/crops/${slug}/care/${tab}`;
}

export function cropTabHref(slug: string, tab: CropTabId): string {
  return cropCareHref(slug, tab);
}

export function parseCropCareTab(
  value: string | null | undefined
): Exclude<CropTabId, "overview"> | null {
  if (!value || value === "overview") return null;
  if (!isCropTabId(value) || value === "overview") return null;
  return value;
}
