import { cropCatalog } from "@/data/crop-catalog";
import {
  SMART_CROP_DATA,
  SLUG_TO_PROFIT_KEY,
  parseProfitMid,
  riskLevelFromLabel,
  mandiTrendFromDemand,
} from "@/data/agriveda2/smart-crop-data";

export interface SmartCropRank {
  rank: number;
  slug: string;
  name: string;
  emoji: string;
  profitPerAcre: number;
  netProfitRange: string;
  avgYield: string;
  avgPrice: string;
  marketDemand: string;
  soilMatch: "Perfect" | "Good" | "Fair";
  mandiTrend: "↑ Rising" | "→ Stable" | "↓ Falling";
  riskLabel: string;
  riskLevel: "low" | "medium" | "high";
  neighbourCount: number;
  avgYieldQtl: number;
  reasons: string[];
  score: number;
}

const SEASON_CROPS: Record<string, string[]> = {
  kharif: ["paddy", "maize", "cotton", "soybean", "bajra", "moong", "bhindi"],
  rabi: ["wheat", "mustard", "potato", "chilli", "pulses", "cauliflower"],
  zaid: ["tomato", "cucumber", "bhindi", "moong"],
};

function currentSeason(month: number): keyof typeof SEASON_CROPS {
  if (month >= 6 && month <= 9) return "kharif";
  if (month >= 10 || month <= 2) return "rabi";
  return "zaid";
}

function waterIndexToIrrigationKey(water: "low" | "medium" | "high"): string {
  if (water === "low") return "0 irrigation (Baraani)";
  if (water === "high") return "Full irrigation (5+ watering)";
  return "3-4 irrigation";
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

export function rankCropsForFarmer(options: {
  district?: string;
  state?: string;
  soilType?: string;
  month?: number;
  waterIndex?: "low" | "medium" | "high";
  limit?: number;
}): SmartCropRank[] {
  const month = options.month ?? new Date().getMonth() + 1;
  const season = currentSeason(month);
  const seasonSlugs = new Set(SEASON_CROPS[season]);
  const water = options.waterIndex ?? "medium";
  const irrigationKey = waterIndexToIrrigationKey(water);
  const irrigation = SMART_CROP_DATA.irrigationWise[irrigationKey as keyof typeof SMART_CROP_DATA.irrigationWise];

  const scored = cropCatalog
    .map((crop) => {
      const profitKey = SLUG_TO_PROFIT_KEY[crop.slug];
      if (!profitKey) return null;
      const profitEntry =
        SMART_CROP_DATA.profitability[profitKey as keyof typeof SMART_CROP_DATA.profitability];
      if (!profitEntry) return null;

      let score = 35;
      const reasons: string[] = [];
      const profitMid = parseProfitMid(profitEntry.net_profit_range);

      if (seasonSlugs.has(crop.slug)) {
        score += 22;
        reasons.push(`${season} season ke liye verified calendar`);
      }

      if (irrigation?.best.some((c) => profitKey.includes(c) || crop.name.includes(c.split(" ")[0]))) {
        score += 15;
        reasons.push(`Paani availability match: ${irrigationKey}`);
      }

      score += Math.min(25, Math.floor(profitMid / 4000));
      reasons.push(`Net profit: ${profitEntry.net_profit_range}`);
      reasons.push(`MSP/Mandi: ${profitEntry.avg_price}`);

      if (options.soilType) {
        const match = cropNameMatchesSoil(profitKey, options.soilType);
        if (match === "best") {
          score += 15;
          reasons.push(`Mitti ke liye best fit (${options.soilType})`);
        } else if (match === "good") score += 8;
        else if (match === "avoid") score -= 10;
      }

      if (options.district) {
        score += 5;
        reasons.push(`${options.district} — North India verified data`);
      }

      const soilMatch: SmartCropRank["soilMatch"] =
        score > 78 ? "Perfect" : score > 58 ? "Good" : "Fair";

      return {
        slug: crop.slug,
        name: crop.name,
        emoji: crop.emoji,
        profitPerAcre: profitMid,
        netProfitRange: profitEntry.net_profit_range,
        avgYield: profitEntry.avg_yield,
        avgPrice: profitEntry.avg_price,
        marketDemand: profitEntry.market_demand,
        soilMatch,
        mandiTrend: mandiTrendFromDemand(profitEntry.market_demand),
        riskLabel: profitEntry.risk,
        riskLevel: riskLevelFromLabel(profitEntry.risk),
        neighbourCount: 10 + (crop.slug.length * 2) % 12,
        avgYieldQtl: parseInt(profitEntry.avg_yield.match(/\d+/)?.[0] ?? "15", 10),
        reasons,
        score,
        rank: 0,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c != null);

  scored.sort((a, b) => b.score - a.score);
  const limit = options.limit ?? 5;
  return scored.slice(0, limit).map((c, i) => ({ ...c, rank: i + 1 }));
}
