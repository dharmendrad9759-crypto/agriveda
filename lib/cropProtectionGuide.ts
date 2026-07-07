import { CROP_PROTECTION_BY_SLUG } from "@/data/crop-protection";
import type { CropProtectionThreat } from "@/types/crop-protection";

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Map pest-disease catalog ids to crop-protection threat ids */
const CATALOG_THREAT_IDS: Record<string, string> = {
  "paddy-disease-d1": "blast",
  "paddy-disease-d2": "sheath-blight",
  "paddy-disease-d3": "blb",
  "paddy-pest-p2": "ysb",
  "paddy-pest-p1": "bph",
  "tomato-disease-d2": "late-blight",
  "tomato-pest-p1": "fruit-borer",
  "potato-disease-d1": "late-blight",
  "maize-pest-p1": "faw",
  "cotton-pest-p1": "pink-bollworm",
};

/** Match pest-disease catalog entry to stage-wise guide data */
export function findStageGuideForThreat(
  cropSlug: string,
  threatType: "pest" | "disease" | "weed",
  threatName: string,
  threatId?: string
): CropProtectionThreat | undefined {
  const profile = CROP_PROTECTION_BY_SLUG[cropSlug];
  if (!profile) return undefined;

  const list =
    threatType === "pest"
      ? profile.pests
      : threatType === "disease"
        ? profile.diseases
        : profile.weeds;

  if (threatId) {
    const catalogKey = `${cropSlug}-${threatType}-${threatId}`;
    const mappedId = CATALOG_THREAT_IDS[catalogKey];
    if (mappedId) {
      const byId = list.find((t) => t.id === mappedId);
      if (byId) return byId;
    }
  }

  const n = norm(threatName);
  return (
    list.find((t) => norm(t.name).includes(n) || n.includes(norm(t.name))) ??
    list.find((t) => t.id && n.includes(norm(t.id)))
  );
}
