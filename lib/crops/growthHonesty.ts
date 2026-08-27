/**
 * Stage-gated growth honesty (miracle tonics / tillering facts).
 * Only show when the selected growth stage matches — never as a global footer.
 */

import {
  getPaddyGrowthHonesty,
  type HonestyBlock,
} from "@/data/crops/paddyGrowthHonesty";

export type GrowthHonestyPayload = {
  headlineHi: string;
  headlineEn: string;
  subHi: string;
  subEn: string;
  blocks: HonestyBlock[];
};

/** Tillering window where “कल्ले / tonic” advice belongs — not every vegetative stage. */
export function isTilleringGrowthStage(title?: string, period?: string): boolean {
  const t = `${title ?? ""} ${period ?? ""}`.toLowerCase();
  return /tiller|tillering|कल्ल|active.?till|max.?till|अधिकतम कल्ल/i.test(t);
}

/**
 * Honesty card for this crop + selected stage.
 * Returns null when the stage (or crop) has no matching note.
 */
export function getGrowthHonestyForStage(
  cropSlug: string,
  stageTitle?: string,
  stagePeriod?: string
): GrowthHonestyPayload | null {
  if (!isTilleringGrowthStage(stageTitle, stagePeriod)) return null;

  // Paddy-specific tillering / tonic honesty
  if (cropSlug === "paddy" || cropSlug === "rice") {
    return getPaddyGrowthHonesty();
  }

  // Other crops: no card unless we add crop-specific data later
  return null;
}
