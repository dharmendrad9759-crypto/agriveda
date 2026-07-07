import type { CropProtectionProfile } from "@/types/crop-protection";
import { CEREAL_PROFILES } from "@/data/crop-protection/cereals";
import { SOLANACEOUS_PROFILES } from "@/data/crop-protection/solanaceous";
import { OTHER_PROFILES } from "@/data/crop-protection/other-profiles";

export const CROP_PROTECTION_PROFILES: CropProtectionProfile[] = [
  ...CEREAL_PROFILES,
  ...SOLANACEOUS_PROFILES,
  ...OTHER_PROFILES,
];

export const CROP_PROTECTION_BY_SLUG: Record<string, CropProtectionProfile> = Object.fromEntries(
  CROP_PROTECTION_PROFILES.map((p) => [p.slug, p])
);
