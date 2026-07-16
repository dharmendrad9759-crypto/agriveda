import { cropCatalog } from "@/data/crop-catalog";
import { SMART_CROP_DATA, SLUG_TO_PROFIT_KEY } from "@/data/agriveda2/smart-crop-data";
import {
  defaultSoilForState,
  getLocationCropScore,
} from "@/data/agriveda2/region-crop-suitability";
import { currentSeason as planCurrentSeason, getViableCropSlugs } from "@/lib/cropPlanning/lookup";
import { evaluateSowingWindow, type SowingWindowStatus } from "@/lib/agriveda2/sowingWindowEngine";

export type SuitabilityVerdict = "good" | "ok" | "poor";

export interface CropSuitabilityResult {
  cropSlug: string;
  cropName: string;
  emoji: string;
  verdict: SuitabilityVerdict;
  verdictHi: string;
  timeStatus: SowingWindowStatus;
  timeTitle: string;
  timeMessageHi: string;
  locationScore: number;
  locationReason: string;
  soilType: string;
  soilMatch: "best" | "good" | "fair" | "avoid" | "unknown";
  soilNote: string;
  inSeasonCalendar: boolean;
  reasons: string[];
}

function cropNameMatchesSoil(cropName: string, soilKey: string): "best" | "good" | "avoid" | null {
  const soil = SMART_CROP_DATA.soilSuitability[soilKey as keyof typeof SMART_CROP_DATA.soilSuitability];
  if (!soil) return null;
  const short = cropName.split(" ")[0];
  if (soil.best.some((c) => c.includes(short) || cropName.includes(c))) return "best";
  if (soil.good.some((c) => c.includes(short) || cropName.includes(c))) return "good";
  if (soil.avoid.some((c) => c.includes(short))) return "avoid";
  return null;
}

/** Check if a crop fits this location, local soil type, and current sowing time. */
export function evaluateCropSuitability(
  cropSlug: string,
  options: {
    state?: string;
    district?: string;
    soilType?: string;
    tempC?: number;
    rainChance3d?: number;
  }
): CropSuitabilityResult {
  const crop = cropCatalog.find((c) => c.slug === cropSlug);
  const cropName = crop?.name ?? cropSlug;
  const emoji = crop?.emoji ?? "🌿";
  const state = options.state ?? "";
  const district = options.district ?? "";
  const month = new Date().getMonth() + 1;
  const season = planCurrentSeason(month);
  const soilType = options.soilType || (state ? defaultSoilForState(state) : "Loamy (Domat)");
  const profitKey = SLUG_TO_PROFIT_KEY[cropSlug] ?? cropName;

  const window = evaluateSowingWindow(cropSlug, {
    state,
    tempC: options.tempC,
    rainChance3d: options.rainChance3d,
  });

  const loc =
    state && district
      ? getLocationCropScore(state, district, cropSlug)
      : state
        ? getLocationCropScore(state, district || state, cropSlug)
        : { score: 50, reason: "Pehle location ON karein — zila/rajya se sahi jawab milega" };

  const soilHit = cropNameMatchesSoil(profitKey, soilType);
  const soilMatch: CropSuitabilityResult["soilMatch"] = soilHit ?? "unknown";
  const soilNote =
    soilMatch === "best"
      ? `${soilType} is fasal ke liye bahut acchi hai`
      : soilMatch === "good"
        ? `${soilType} par ye fasal chal sakti hai`
        : soilMatch === "avoid"
          ? `${soilType} par is fasal se bachen — doosri fasal sochien`
          : `Mitti: ${soilType} (local default)`;

  const viable = state ? getViableCropSlugs(state, district, season) : [];
  const inSeasonCalendar = viable.length ? viable.includes(cropSlug) : window.status !== "red";

  const reasons: string[] = [];
  reasons.push(loc.reason);
  reasons.push(soilNote);
  if (inSeasonCalendar) reasons.push(`Abhi ${season} season — calendar me mauka hai`);
  else reasons.push(`Is mausam (${season}) me ye fasal local calendar me kam fit hai`);
  reasons.push(window.messageHi);

  let points = loc.score;
  if (window.status === "green") points += 15;
  else if (window.status === "yellow") points += 5;
  else points -= 12;
  if (soilMatch === "best") points += 12;
  else if (soilMatch === "good") points += 6;
  else if (soilMatch === "avoid") points -= 18;
  if (inSeasonCalendar) points += 8;
  else points -= 6;

  const verdict: SuitabilityVerdict = points >= 70 ? "good" : points >= 45 ? "ok" : "poor";
  const verdictHi =
    verdict === "good"
      ? "Haan — is time aapki jagah aur mitti ke hisaab se theek hai"
      : verdict === "ok"
        ? "Chal sakti hai — thoda risk / timing dekh ke boein"
        : "Abhi is location/mitti/time pe kam suitable — pehle recommended faslein dekhein";

  return {
    cropSlug,
    cropName,
    emoji,
    verdict,
    verdictHi,
    timeStatus: window.status,
    timeTitle: window.title,
    timeMessageHi: window.messageHi,
    locationScore: Math.round(loc.score),
    locationReason: loc.reason,
    soilType,
    soilMatch,
    soilNote,
    inSeasonCalendar,
    reasons: reasons.slice(0, 5),
  };
}
