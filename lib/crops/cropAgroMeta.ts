import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { getCropManagementProfile } from "@/data/crop-management";
import type { CropStageAlert } from "@/data/mock/crop-overview";

export type RiskLevel = "high" | "medium" | "low";

export interface CropThreatRisk {
  top: string;
  level: RiskLevel;
  pct: number;
}

/** ICAR / SAU style climate + water + sowing windows (India rainfed/irrigated PoP) */
const AGRO_BY_SLUG: Record<
  string,
  {
    tempMinC: number;
    tempMaxC: number;
    climateNote: string;
    waterMm: string;
    waterDetail: string;
    sowingIcar: string;
    sowingSource: string;
  }
> = {
  paddy: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Warm humid; standing water / AWD. Avoid cool nights at flowering.",
    waterMm: "1200–1500 mm season",
    waterDetail: "Transplanted rice: ~1200–1500 mm (incl. rainfall + irrigation)",
    sowingIcar: "Kharif nursery: May–Jun; transplant Jun–Jul (onset of SW monsoon)",
    sowingSource: "ICAR / NFSM Rice PoP",
  },
  wheat: {
    tempMinC: 10,
    tempMaxC: 25,
    climateNote: "Cool dry Rabi crop. Ideal grain fill ~15–20°C; avoid late heat stress.",
    waterMm: "400–600 mm season",
    waterDetail: "Irrigated wheat typically 4–6 irrigations ≈ 400–600 mm total",
    sowingIcar: "Timely: mid-Nov (upto 25 Nov NWP); late till early Dec (lower yield)",
    sowingSource: "ICAR-IIWBR / NFSM Wheat PoP",
  },
  maize: {
    tempMinC: 18,
    tempMaxC: 32,
    climateNote: "Warm season cereal; sensitive to drought at silking / tasseling.",
    waterMm: "500–800 mm season",
    waterDetail: "Kharif rainfed / irrigated: ~500–800 mm depending on hybrid & region",
    sowingIcar: "Kharif: onset monsoon Jun–Jul; Rabi: Oct–Nov (irrigated)",
    sowingSource: "ICAR-IIMR Maize PoP",
  },
  bajra: {
    tempMinC: 25,
    tempMaxC: 35,
    climateNote: "Hot arid / semi-arid millet; drought escape with early hybrids.",
    waterMm: "350–550 mm season",
    waterDetail: "Low water crop — ~350–550 mm; avoid waterlogging",
    sowingIcar: "Kharif: first fortnight of Jul (or with monsoon showers)",
    sowingSource: "ICAR Pearl Millet PoP",
  },
  soybean: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Warm Kharif oilseed; flowers poorly under extreme heat / waterlogging.",
    waterMm: "450–700 mm season",
    waterDetail: "Typically 450–700 mm; critical moisture at flowering & pod fill",
    sowingIcar: "Kharif: onset monsoon (Jun–Jul) when soil moisture adequate",
    sowingSource: "ICAR-IISR / Soybean PoP",
  },
  moongfali: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Warm season legume; gypsum at flowering boosts pods in many soils.",
    waterMm: "500–700 mm season",
    waterDetail: "Kharif / Rabi groundnut ~500–700 mm equivalent with timely rains / irrigation",
    sowingIcar: "Kharif: Jun–Jul with monsoon; Rabi/summer: per state PoP (e.g. Oct–Nov / Jan–Feb)",
    sowingSource: "ICAR Groundnut PoP / SAU",
  },
  potato: {
    tempMinC: 15,
    tempMaxC: 25,
    climateNote: "Cool nights for tuberization; frost & heat both cut yield.",
    waterMm: "500–700 mm season",
    waterDetail: "About 500–700 mm; critical irrigation at tuber initiation & bulking",
    sowingIcar: "North plains: Oct–Nov planting (variety & zone specific)",
    sowingSource: "ICAR-CPRI Potato PoP",
  },
  tomato: {
    tempMinC: 18,
    tempMaxC: 28,
    climateNote: "Fruit set drops if night temp high; frost sensitive.",
    waterMm: "400–600 mm + fertigation",
    waterDetail: "Open field ~400–600 mm; drip fertigation preferred under precision farming",
    sowingIcar: "Nursery then transplant: season by zone (Rabi / late Kharif / Zaid)",
    sowingSource: "ICAR / precision vegetable PoP",
  },
  chilli: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Warm dry spells help colour; excess rain invites fungal disease.",
    waterMm: "600–900 mm season",
    waterDetail: "600–900 mm depending on duration & irrigation method",
    sowingIcar: "Nursery + transplant as per state (often Jun–Aug / Sep–Oct)",
    sowingSource: "ICAR / chilli crop PoP",
  },
  cotton: {
    tempMinC: 21,
    tempMaxC: 35,
    climateNote: "Warm long-season crop; bollworm risk high if N excess after flowering.",
    waterMm: "700–1200 mm season",
    waterDetail: "Bt hybrid irrigated needs ~700–1200 mm equivalent across season",
    sowingIcar: "Central/South: Jun–Jul with monsoon; North irrigated: Apr–May",
    sowingSource: "ICAR cotton PoP",
  },
  sugarcane: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Tropical / subtropical; grand growth needs heat + moisture.",
    waterMm: "1500–2500 mm season",
    waterDetail: "Very high water need — typically 1500–2500 mm (rain + irrigation)",
    sowingIcar: "Spring: Feb–Mar; Autumn: Sep–Oct (zone dependent)",
    sowingSource: "ICAR-IISR Sugarcane PoP",
  },
  onion: {
    tempMinC: 13,
    tempMaxC: 25,
    climateNote: "Cool seasons for bulb quality; bolting if temps too low early.",
    waterMm: "350–550 mm season",
    waterDetail: "About 350–550 mm; stop irrigation before harvest for curing",
    sowingIcar: "Rabi: Oct–Nov transplant; Kharif as per NHRDF zone calendar",
    sowingSource: "NHRDF / ICAR onion PoP",
  },
  mustard: {
    tempMinC: 10,
    tempMaxC: 25,
    climateNote: "Cool Rabi oilseed; frost at flowering risky; S nutrition for oil quality.",
    waterMm: "250–400 mm season",
    waterDetail: "Relatively low — ~250–400 mm with 1–2 critical irrigations",
    sowingIcar: "North: mid-Oct to early Nov (timely sowing)",
    sowingSource: "ICAR mustard / rapeseed PoP",
  },
  cauliflower: {
    tempMinC: 15,
    tempMaxC: 22,
    climateNote: "Cool temperatures for compact curd; heat causes buttoning / riceyness.",
    waterMm: "400–600 mm season",
    waterDetail: "Light frequent irrigation; total ~400–600 mm equivalent",
    sowingIcar: "Nursery then transplant for winter / early winter slots (Sep–Nov zone-wise)",
    sowingSource: "ICAR vegetable PoP",
  },
  cucumber: {
    tempMinC: 18,
    tempMaxC: 30,
    climateNote: "Warm season cucurbit; frost sensitive; prefers well-drained soils.",
    waterMm: "400–600 mm season",
    waterDetail: "Keep moisture even at flowering/fruiting — ~400–600 mm",
    sowingIcar: "Summer / Zaid sowing after frost risk; protected culture year-round",
    sowingSource: "ICAR / protected cultivation PoP",
  },
  brinjal: {
    tempMinC: 18,
    tempMaxC: 30,
    climateNote: "Warm season; bacterial wilt risk in humid tropics.",
    waterMm: "500–700 mm season",
    waterDetail: "About 500–700 mm with drip preferred under hybrids",
    sowingIcar: "Nursery + transplant nearly year-round in mild zones",
    sowingSource: "ICAR vegetable PoP",
  },
  bhindi: {
    tempMinC: 25,
    tempMaxC: 35,
    climateNote: "Hot season crop; YVMV major virus risk in many belts.",
    waterMm: "400–600 mm season",
    waterDetail: "Moderate — ~400–600 mm; avoid prolonged water stress",
    sowingIcar: "Kharif / summer sowing when soil warm (Feb–Jul window by zone)",
    sowingSource: "ICAR vegetable PoP",
  },
  moong: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Short-duration pulse; heat + moisture stress cuts podding.",
    waterMm: "300–450 mm season",
    waterDetail: "Low–moderate ~300–450 mm; drain excess water",
    sowingIcar: "Zaid / Kharif as per state (e.g. Mar–Apr summer; Jun–Jul Kharif)",
    sowingSource: "ICAR pulse PoP",
  },
  pulses: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Pigeonpea likes warm Kharif; sensitive to waterlogging.",
    waterMm: "500–700 mm season",
    waterDetail: "Around 500–700 mm; ensure drainage in heavy rains",
    sowingIcar: "Kharif: Jun–Jul with monsoon onset (line sowing preferred)",
    sowingSource: "ICAR pigeonpea PoP",
  },
};

function slugKey(slug: string): string {
  if (slug === "groundnut" || slug === "mungfali") return "moongfali";
  if (slug === "rice" || slug === "dhaan") return "paddy";
  if (slug === "arhar" || slug === "tur") return "pulses";
  return slug;
}

export function getCropAgroMeta(slug: string) {
  const key = slugKey(slug);
  return (
    AGRO_BY_SLUG[key] ?? {
      tempMinC: 18,
      tempMaxC: 32,
      climateNote: "Follow local ICAR-KVK / SAU advisories for your district.",
      waterMm: "As per soil & season",
      waterDetail: "Use soil moisture / local PoP for exact irrigation schedule",
      sowingIcar: "Follow state agriculture university / KVK sowing window",
      sowingSource: "Local SAU / KVK PoP",
    }
  );
}

export function formatClimateCard(slug: string, fallbackClimate: string): string {
  const m = getCropAgroMeta(slug);
  return `${m.tempMinC}–${m.tempMaxC}°C · ${m.climateNote || fallbackClimate}`;
}

export function formatSowingCard(slug: string, fallback: string): string {
  const m = getCropAgroMeta(slug);
  return `${m.sowingIcar} (${m.sowingSource})` || fallback;
}

function hashPct(seed: string, base: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Math.min(85, Math.max(28, base + (h % 25)));
}

export function getCropPestRisk(crop: Crop, detail?: EnrichedCropDetail): CropThreatRisk {
  const fromDetail = detail?.pests?.[0]?.name;
  const fromMgmt = getCropManagementProfile(crop.slug)?.pestManagement?.[0]?.pestName;
  const fromCrop = crop.cropProtection.majorPests[0];
  const top = fromDetail || fromMgmt || fromCrop || "Field pests";
  const level: RiskLevel =
    /borer|hopper|whitefly|thrips|caterpillar|fall army/i.test(top) ? "high" : "medium";
  return { top, level, pct: hashPct(crop.slug + top, level === "high" ? 55 : 40) };
}

export function getCropDiseaseRisk(crop: Crop, detail?: EnrichedCropDetail): CropThreatRisk {
  const fromDetail = detail?.diseases?.[0]?.name;
  const fromMgmt = getCropManagementProfile(crop.slug)?.diseaseManagement?.[0]?.diseaseName;
  const fromCrop = crop.cropProtection.majorDiseases[0];
  const top = fromDetail || fromMgmt || fromCrop || "Field diseases";
  const level: RiskLevel = /blast|blight|wilt|rust|mildew|rot|mosaic|leaf curl|powdery/i.test(top)
    ? "high"
    : /spot|smut|anthracnose/i.test(top)
      ? "medium"
      : "low";
  return {
    top,
    level,
    pct: hashPct(crop.slug + top, level === "high" ? 45 : level === "medium" ? 32 : 22),
  };
}

export function getCropIrrigationSummary(crop: Crop) {
  const agro = getCropAgroMeta(crop.slug);
  const critical = crop.irrigationManagement.criticalStages[0];
  return {
    totalWater: agro.waterMm,
    detail: agro.waterDetail,
    frequency: crop.irrigationManagement.schedule[0] ?? "As per soil moisture",
    criticalNote: critical
      ? `Critical: ${critical}. ${crop.irrigationManagement.criticalStages.slice(1, 3).join(" · ")}`
      : agro.waterDetail,
  };
}

export function getCropExpertTip(crop: Crop) {
  const pest = crop.cropProtection.majorPests[0];
  const stage = crop.irrigationManagement.criticalStages[0] ?? "mid growth";
  return {
    title: `${crop.name} — field tip`,
    tip: pest
      ? `At ${stage}, scout every 5–7 days for ${pest}. Follow ETL before spraying; keep irrigation on critical stages (${crop.irrigationManagement.criticalStages.slice(0, 2).join(", ") || "as per PoP"}).`
      : `Follow local KVK/SAU PoP for ${crop.name}. Maintain moisture at critical stages and use certified seed of recommended varieties.`,
    action: { label: "Ask AI Doctor", href: "/ai-doctor" as const },
  };
}

export function getCropStageAlerts(crop: Crop): CropStageAlert[] {
  const stages = getCropManagementProfile(crop.slug)?.growthStages;
  const pests = crop.cropProtection.majorPests.slice(0, 2);
  const diseases = crop.cropProtection.majorDiseases.slice(0, 2);
  const irrig = crop.irrigationManagement.criticalStages;

  if (stages && stages.length >= 3) {
    return [
      {
        id: "1",
        stage: stages[1]?.title.split(/[—(]/)[0]?.trim() || stages[1]?.title || "Mid growth",
        alert: pests[0]
          ? `Watch ${pests[0]} — scout regularly; spray only at ETL`
          : "Scout weekly for early pest buildup",
        level: "high",
      },
      {
        id: "2",
        stage: stages[Math.floor(stages.length / 2)]?.title.split(/[—(]/)[0]?.trim() || "Peak growth",
        alert: diseases[0]
          ? `${diseases[0]} risk if weather favourable — follow IDM`
          : irrig[0]
            ? `Maintain moisture at ${irrig[0]}`
            : "Keep nutrients balanced; avoid stress",
        level: "medium",
      },
      {
        id: "3",
        stage: stages[stages.length - 1]?.title.split(/[—(]/)[0]?.trim() || "Maturity",
        alert: `Harvest window: ${crop.harvestAndYield.harvestingTime}. ${crop.harvestAndYield.maturitySigns[0] ?? "Check maturity signs"}`,
        level: "low",
      },
    ];
  }

  return [
    {
      id: "1",
      stage: "Early growth",
      alert: pests[0] ? `Monitor ${pests[0]}` : "Establish crop with recommended seed treatment",
      level: "high",
    },
    {
      id: "2",
      stage: "Mid season",
      alert: diseases[0] ? `Watch for ${diseases[0]}` : irrig[0] ? `Critical water: ${irrig[0]}` : "Follow fertilizer splits",
      level: "medium",
    },
    {
      id: "3",
      stage: "Harvest",
      alert: crop.harvestAndYield.harvestingTime,
      level: "low",
    },
  ];
}

export function getCropTasksDue(crop: Crop) {
  const fert = crop.fertilizerSchedule.stageWise[0];
  const pest = crop.cropProtection.majorPests[0];
  return [
    {
      id: "1",
      task: fert
        ? `${fert.stage}: ${fert.details[0] ?? "Apply scheduled fertilizer"}`
        : `Basal: ${crop.fertilizerSchedule.basalDose[0] ?? "Apply basal fertilizer"}`,
      due: "This week",
      priority: "high" as const,
    },
    {
      id: "2",
      task: pest ? `Scout for ${pest}` : "Scout field for pests",
      due: "In 3–5 days",
      priority: "medium" as const,
    },
    {
      id: "3",
      task: crop.cropProtection.weedManagement[0] ?? "Timely weeding / herbicide",
      due: "Next week",
      priority: "low" as const,
    },
  ];
}
