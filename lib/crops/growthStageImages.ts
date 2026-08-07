/**
 * Farmer-facing growth-stage photos — prefer per-crop scenes, then shared stage art.
 */

import { resolveCropImage } from "@/lib/crops/cropImages";

export type GrowthStageKind = "prep" | "sow" | "veg" | "flower" | "bulk" | "harvest";

const SHARED_STAGE: Record<GrowthStageKind, string> = {
  prep: "/images/growth/growth-stage-prep.jpg",
  sow: "/images/growth/growth-stage-sow.jpg",
  veg: "/images/growth/growth-stage-veg.jpg",
  flower: "/images/growth/growth-stage-flower.jpg",
  bulk: "/images/growth/growth-stage-veg.jpg",
  harvest: "/images/growth/growth-stage-harvest.jpg",
};

function kindFile(kind: GrowthStageKind): string {
  return kind === "bulk" ? "veg" : kind;
}

export function cropGrowthStagePath(cropSlug: string, kind: GrowthStageKind): string {
  return `/images/growth/${cropSlug}-${kindFile(kind)}.jpg`;
}

function stageKind(title: string, period: string): GrowthStageKind {
  const t = `${title} ${period}`.toLowerCase();
  if (/land|prepar|जुताई|खेत तैय|मिट्टी तैय|plough|bed|क्यारी/.test(t)) return "prep";
  if (/sow|transplant|अंकुर|बीज|रोपाई|nursery|प्रसारण|planting|germination|उगना|नर्म/.test(t))
    return "sow";
  if (
    /flower|reproductive|फूल|बाली|सिल्क|टैसल|पिंचिंग|फल लग|fruit.?set|बोहो|panicle|\bpi\b|bloom/.test(
      t
    )
  )
    return "flower";
  if (/tuber|कंद|बल्ब|गाँठ|bulking|tuberization|फल भर|fruit.?fill/.test(t)) return "bulk";
  if (/matur|harvest|कटाई|पकना|ripe|\br\d\b|dough|grain.?fill|दाना|भंडारण|wine.?kill|गिराई/.test(t))
    return "harvest";
  if (/tillering|vegetat|वानस्पतिक|कल्ले|वृद्धि|झाड़|शाखा|स्थापना|\bv\d\b|गोभ/.test(t))
    return "veg";
  return "veg";
}

/** Crop-specific stage URL (UI falls back to shared scene if file missing). */
export function getGrowthStageImage(opts: {
  cropSlug: string;
  cropName?: string;
  title: string;
  period?: string;
  index?: number;
}): string {
  const kind = stageKind(opts.title, opts.period ?? "");
  // Prep is usually shared land work — use crop sow art if no crop-prep yet
  if (kind === "prep") {
    return cropGrowthStagePath(opts.cropSlug, "sow");
  }
  return cropGrowthStagePath(opts.cropSlug, kind);
}

export function getGrowthStageFallback(kind: GrowthStageKind): string {
  return SHARED_STAGE[kind] || SHARED_STAGE.veg;
}

export function getGrowthStageCropBadge(cropSlug: string, cropName?: string): string {
  return resolveCropImage({ slug: cropSlug, name: cropName });
}

export function getGrowthStageKind(title: string, period?: string): GrowthStageKind {
  return stageKind(title, period ?? "");
}
