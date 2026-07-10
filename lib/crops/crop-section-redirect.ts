import type { CropTabId } from "@/lib/crops/crop-tabs";

/** Legacy /crop-details/[section] → unified /crops tab */
export const CROP_SECTION_TO_TAB: Record<string, CropTabId> = {
  sowing: "overview",
  fertilizer: "fertilizer",
  irrigation: "irrigation",
  protection: "pests",
  weeds: "weeds",
  stress: "diseases",
  nutrition: "nutrients",
  harvest: "harvest",
  market: "overview",
};

export function cropSectionRedirectUrl(slug: string, section: string): string {
  const tab = CROP_SECTION_TO_TAB[section] ?? "overview";
  return tab === "overview" ? `/crops/${slug}` : `/crops/${slug}?tab=${tab}`;
}

export const CROP_CATEGORY_TO_TAB: Record<string, CropTabId> = {
  sowing: "overview",
  fertilizer: "fertilizer",
  irrigation: "irrigation",
  protection: "pests",
  weeds: "weeds",
  stress: "diseases",
  nutrition: "nutrients",
  harvest: "harvest",
  market: "overview",
};

export function cropCategoryHref(slug: string, categoryId: string): string {
  const tab = CROP_CATEGORY_TO_TAB[categoryId] ?? "overview";
  return tab === "overview" ? `/crops/${slug}` : `/crops/${slug}?tab=${tab}`;
}
