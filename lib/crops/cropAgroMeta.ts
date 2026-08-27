import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { getCropManagementProfile } from "@/data/crop-management";
import type { CropStageAlert } from "@/data/mock/crop-overview";
import { getCropHindiName } from "@/lib/crops/crop-display";

/** English / mixed pest-disease names → simple Hindi for farmer tips */
export function farmerThreatHi(raw: string | undefined): string {
  if (!raw?.trim()) return "कीट";
  const s = raw.trim();
  const map: [RegExp, string][] = [
    [/whitefly|सफेद\s*मक्खी|safed/i, "सफेद मक्खी"],
    [/thrips|थ्रिप्स|रस\s*चूसक/i, "थ्रिप्स"],
    [/aphid|माहू|माहू/i, "माहू"],
    [/jassid|hopper|फुदका|तेला/i, "फुदका"],
    [/fruit\s*borer|फल\s*छेदक|tomato\s*fruit/i, "फल छेदक"],
    [/shoot\s*(and|&)?\s*fruit\s*borer|तना.*फल/i, "तना–फल छेदक"],
    [/pink\s*bollworm|गुलाबी\s*सुंडी/i, "गुलाबी सुंडी"],
    [/bollworm|सुंडी/i, "सुंडी"],
    [/stem\s*borer|तना\s*छेदक/i, "तना छेदक"],
    [/fall\s*army|फौजी\s*कीड़ा|FAW/i, "फौजी कीड़ा"],
    [/caterpillar|इल्ली|leaf\s*eating/i, "इल्ली"],
    [/stem\s*fly|तना\s*मक्खी/i, "तना मक्खी"],
    [/fruit\s*fly|फल\s*मक्खी/i, "फल मक्खी"],
    [/blast|ब्लास्ट/i, "ब्लास्ट"],
    [/blight|झुलसा/i, "झुलसा"],
    [/wilt|उकठा/i, "उकठा"],
    [/rust|रतुआ/i, "रतुआ"],
    [/mildew|मिल्ड्यू|पाउडरी/i, "मिल्ड्यू"],
    [/leaf\s*curl|पत्ती\s*मरोड़/i, "पत्ती मरोड़"],
    [/mosaic|मोज़ेक/i, "मोज़ेक"],
    [/rot|सड़न/i, "सड़न"],
  ];
  for (const [re, hi] of map) {
    if (re.test(s)) return hi;
  }
  // Already Devanagari-heavy → keep short first phrase
  if (/[\u0900-\u097F]/.test(s)) {
    return s.split(/[—(,/|]/)[0]?.trim() || s;
  }
  return s.split(/[—(,/|]/)[0]?.trim() || s;
}

function farmerStageHi(raw: string | undefined, fallback = "बीच की अवस्था"): string {
  if (!raw?.trim()) return fallback;
  const s = raw.trim();
  if (/[\u0900-\u097F]/.test(s)) return s.split(/[—(]/)[0]?.trim() || s;
  const map: [RegExp, string][] = [
    [/transplant|रोपाई|planting/i, "रोपाई"],
    [/sowing|बुवाई|establishment/i, "बुवाई"],
    [/flower|फूल|bloom|silking|tassel/i, "फूल आना"],
    [/fruit|fruiting|pod|boll|tuber/i, "फल लगना"],
    [/vegetative|वृद्धि|mid\s*growth|peak/i, "बढ़वार"],
    [/maturity|harvest|पकना|कटाई/i, "कटाई"],
    [/nursery|नर्सरी/i, "नर्सरी"],
  ];
  for (const [re, hi] of map) {
    if (re.test(s)) return hi;
  }
  return s.split(/[—(]/)[0]?.trim() || fallback;
}

export type RiskLevel = "high" | "medium" | "low";

export interface CropThreatRisk {
  top: string;
  level: RiskLevel;
  pct: number;
}

/** Climate + water + sowing windows for crop overview cards (farmer-facing copy) */
const AGRO_BY_SLUG: Record<
  string,
  {
    tempMinC: number;
    tempMaxC: number;
    climateNote: string;
    waterMm: string;
    waterDetail: string;
    /** Best sowing window — shown on Overview (no institution names) */
    sowingWindow: string;
  }
> = {
  paddy: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Warm humid; standing water / AWD. Avoid cool nights at flowering.",
    waterMm: "1200–1500 mm season",
    waterDetail: "Transplanted rice: ~1200–1500 mm (incl. rainfall + irrigation)",
    sowingWindow: "Kharif nursery: May–Jun; transplant Jun–Jul with southwest monsoon onset",
  },
  wheat: {
    tempMinC: 10,
    tempMaxC: 25,
    climateNote: "Cool dry Rabi crop. Ideal grain fill ~15–20°C; avoid late heat stress.",
    waterMm: "400–600 mm season",
    waterDetail: "Irrigated wheat typically 4–6 irrigations ≈ 400–600 mm total",
    sowingWindow: "Timely: mid-Nov (upto 25 Nov in northwest plains); late till early Dec lowers yield",
  },
  maize: {
    tempMinC: 18,
    tempMaxC: 32,
    climateNote: "Warm season cereal; sensitive to drought at silking / tasseling.",
    waterMm: "500–800 mm season",
    waterDetail: "Kharif rainfed / irrigated: ~500–800 mm depending on hybrid & region",
    sowingWindow: "Kharif: monsoon onset Jun–Jul; Rabi irrigated: Oct–Nov",
  },
  bajra: {
    tempMinC: 25,
    tempMaxC: 35,
    climateNote: "Hot arid / semi-arid millet; drought escape with early hybrids.",
    waterMm: "350–550 mm season",
    waterDetail: "Low water crop — ~350–550 mm; avoid waterlogging",
    sowingWindow: "Kharif: first fortnight of Jul, or with reliable monsoon showers",
  },
  soybean: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Warm Kharif oilseed; flowers poorly under extreme heat / waterlogging.",
    waterMm: "450–700 mm season",
    waterDetail: "Typically 450–700 mm; critical moisture at flowering & pod fill",
    sowingWindow: "Kharif: monsoon onset (Jun–Jul) when soil moisture is adequate",
  },
  moongfali: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Warm season legume; gypsum at flowering boosts pods in many soils.",
    waterMm: "500–700 mm season",
    waterDetail: "Kharif / Rabi groundnut ~500–700 mm equivalent with timely rains / irrigation",
    sowingWindow: "Kharif: Jun–Jul with monsoon; Rabi/summer: Oct–Nov or Jan–Feb by region",
  },
  potato: {
    tempMinC: 15,
    tempMaxC: 25,
    climateNote: "Cool nights for tuberization; frost & heat both cut yield.",
    waterMm: "500–700 mm season",
    waterDetail: "About 500–700 mm; critical irrigation at tuber initiation & bulking",
    sowingWindow: "North plains: Oct–Nov planting (adjust by variety and zone)",
  },
  tomato: {
    tempMinC: 18,
    tempMaxC: 28,
    climateNote: "Fruit set drops if night temp high; frost sensitive.",
    waterMm: "400–600 mm + fertigation",
    waterDetail: "Open field ~400–600 mm; drip fertigation preferred under precision farming",
    sowingWindow: "Nursery then transplant: Rabi / late Kharif / Zaid by your zone",
  },
  chilli: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Warm dry spells help colour; excess rain invites fungal disease.",
    waterMm: "600–900 mm season",
    waterDetail: "600–900 mm depending on duration & irrigation method",
    sowingWindow: "Nursery + transplant by region (often Jun–Aug or Sep–Oct)",
  },
  cotton: {
    tempMinC: 21,
    tempMaxC: 35,
    climateNote: "Warm long-season crop; bollworm risk high if N excess after flowering.",
    waterMm: "700–1200 mm season",
    waterDetail: "Bt hybrid irrigated needs ~700–1200 mm equivalent across season",
    sowingWindow: "Central/South: Jun–Jul with monsoon; North irrigated: Apr–May",
  },
  sugarcane: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Tropical / subtropical; grand growth needs heat + moisture.",
    waterMm: "1500–2500 mm season",
    waterDetail: "Very high water need — typically 1500–2500 mm (rain + irrigation)",
    sowingWindow: "Spring: Feb–Mar; Autumn: Sep–Oct (depends on your zone)",
  },
  onion: {
    tempMinC: 13,
    tempMaxC: 25,
    climateNote: "Cool seasons for bulb quality; bolting if temps too low early.",
    waterMm: "350–550 mm season",
    waterDetail: "About 350–550 mm; stop irrigation before harvest for curing",
    sowingWindow: "Rabi: Oct–Nov transplant; Kharif as per your regional calendar",
  },
  mustard: {
    tempMinC: 10,
    tempMaxC: 25,
    climateNote: "Cool Rabi oilseed; frost at flowering risky; S nutrition for oil quality.",
    waterMm: "250–400 mm season",
    waterDetail: "Relatively low — ~250–400 mm with 1–2 critical irrigations",
    sowingWindow: "North: mid-Oct to early Nov for timely sowing",
  },
  cauliflower: {
    tempMinC: 15,
    tempMaxC: 22,
    climateNote: "Cool temperatures for compact curd; heat causes buttoning / riceyness.",
    waterMm: "400–600 mm season",
    waterDetail: "Light frequent irrigation; total ~400–600 mm equivalent",
    sowingWindow: "Nursery then transplant for winter slots (Sep–Nov, zone-wise)",
  },
  cucumber: {
    tempMinC: 18,
    tempMaxC: 30,
    climateNote: "Warm season cucurbit; frost sensitive; prefers well-drained soils.",
    waterMm: "400–600 mm season",
    waterDetail: "Keep moisture even at flowering/fruiting — ~400–600 mm",
    sowingWindow: "Summer / Zaid after frost risk; greenhouse / polyhouse year-round",
  },
  brinjal: {
    tempMinC: 18,
    tempMaxC: 30,
    climateNote: "Warm season; bacterial wilt risk in humid tropics.",
    waterMm: "500–700 mm season",
    waterDetail: "About 500–700 mm with drip preferred under hybrids",
    sowingWindow: "Nursery + transplant nearly year-round in mild zones",
  },
  bhindi: {
    tempMinC: 25,
    tempMaxC: 35,
    climateNote: "Hot season crop; yellow vein mosaic is a major risk in many belts.",
    waterMm: "400–600 mm season",
    waterDetail: "Moderate — ~400–600 mm; avoid prolonged water stress",
    sowingWindow: "Kharif / summer when soil is warm (Feb–Jul window by zone)",
  },
  moong: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Short-duration pulse; heat + moisture stress cuts podding.",
    waterMm: "300–450 mm season",
    waterDetail: "Low–moderate ~300–450 mm; drain excess water",
    sowingWindow: "Summer: Mar–Apr; Kharif: Jun–Jul (confirm local window)",
  },
  pulses: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Pigeonpea likes warm Kharif; sensitive to waterlogging.",
    waterMm: "500–700 mm season",
    waterDetail: "Around 500–700 mm; ensure drainage in heavy rains",
    sowingWindow: "Kharif: Jun–Jul with monsoon onset (line sowing preferred)",
  },
  chana: {
    tempMinC: 15,
    tempMaxC: 25,
    climateNote: "Cool Rabi pulse; frost and excess irrigation raise wilt risk.",
    waterMm: "150–250 mm season",
    waterDetail: "2–3 irrigations often enough; avoid waterlogging",
    sowingWindow: "Rabi: Oct–Nov when temperatures cool",
  },
  masoor: {
    tempMinC: 15,
    tempMaxC: 25,
    climateNote: "Cool-season lentil; excess moisture increases lodging/disease.",
    waterMm: "150–200 mm season",
    waterDetail: "1–2 irrigations typically; light soils preferred",
    sowingWindow: "Rabi: mid-Oct to Nov",
  },
  urad: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Warm pulse; YMV pressure high in many belts.",
    waterMm: "300–450 mm season",
    waterDetail: "Low–moderate; drain standing water within 24h",
    sowingWindow: "Kharif Jun–Jul; Zaid Feb–Mar irrigated",
  },
  ginger: {
    tempMinC: 20,
    tempMaxC: 30,
    climateNote: "Humid warm spice; rhizome rot if drainage fails.",
    waterMm: "1500–2500 mm equivalent with irrigation",
    waterDetail: "Frequent light moisture + mulch; never waterlog beds",
    sowingWindow: "Apr–Jun before monsoon (zone-specific)",
  },
  garlic: {
    tempMinC: 15,
    tempMaxC: 25,
    climateNote: "Cool Rabi bulb spice; frost and uneven water crack bulbs.",
    waterMm: "400–600 mm season",
    waterDetail: "Light frequent; stop water 10–15 days before harvest",
    sowingWindow: "Rabi: Oct–Nov clove planting",
  },
  mango: {
    tempMinC: 24,
    tempMaxC: 38,
    climateNote: "Tropical orchard; frost pockets need site care.",
    waterMm: "Age-based drip schedule",
    waterDetail: "Drip preferred; critical at flowering and fruit growth",
    sowingWindow: "Plant monsoon/spring; flowering Dec–Feb by belt",
  },
  banana: {
    tempMinC: 20,
    tempMaxC: 35,
    climateNote: "Humid tropical; wind lodging risk.",
    waterMm: "1200–2200 mm equivalent",
    waterDetail: "High water need — drip keeps moisture steady",
    sowingWindow: "Jun–Aug or Feb–Mar with irrigation",
  },
  grapes: {
    tempMinC: 15,
    tempMaxC: 35,
    climateNote: "Dry fruiting weather preferred; humidity raises mildew.",
    waterMm: "Drip fertigation schedule",
    waterDetail: "Drip essential; control water near harvest for quality",
    sowingWindow: "Plant monsoon/spring; prune on regional calendar",
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
      climateNote: "Follow your local agri office or block advisor for district weather.",
      waterMm: "As per soil & season",
      waterDetail: "Use soil moisture and local crop calendar for exact irrigation",
      sowingWindow: "Follow your district sowing calendar for best timing",
    }
  );
}

export function formatClimateCard(slug: string, fallbackClimate: string): string {
  const m = getCropAgroMeta(slug);
  return `${m.tempMinC}–${m.tempMaxC}°C · ${m.climateNote || fallbackClimate}`;
}

export function formatSowingCard(slug: string, fallback: string): string {
  const m = getCropAgroMeta(slug);
  return m.sowingWindow || fallback;
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
  const more = crop.irrigationManagement.criticalStages
    .slice(1, 3)
    .map((s) => farmerStageHi(s))
    .filter(Boolean);
  return {
    totalWater: agro.waterMm,
    detail: agro.waterDetail,
    frequency: crop.irrigationManagement.schedule[0] ?? "मिट्टी देखकर पानी दें",
    criticalNote: critical
      ? `ज़रूरी पानी: ${farmerStageHi(critical)}${more.length ? ` · ${more.join(" · ")}` : ""}`
      : agro.waterDetail,
  };
}

export function getCropExpertTip(crop: Crop) {
  const pestHi = farmerThreatHi(crop.cropProtection.majorPests[0]);
  const stageHi = farmerStageHi(
    crop.irrigationManagement.criticalStages[0],
    "बढ़वार"
  );
  const waterStages = crop.irrigationManagement.criticalStages
    .slice(0, 2)
    .map((s) => farmerStageHi(s))
    .filter(Boolean);
  const cropHi = getCropHindiName(crop.slug) || crop.name;

  return {
    title: `${cropHi} — खेत की सलाह`,
    tip: crop.cropProtection.majorPests[0]
      ? `${stageHi} पर हर 5–7 दिन खेत घूमकर ${pestHi} देखें। कीड़े ज़्यादा हों तभी दवा छिड़कें। ${
          waterStages.length
            ? `${waterStages.join(" और ")} पर पानी न छोड़ें।`
            : "ज़रूरी अवस्था पर पानी न छोड़ें।"
        }`
      : `${cropHi} में अच्छी बीज लगाएँ और ज़रूरी अवस्था पर मिट्टी गीली रखें।`,
    action: { label: "AI डॉक्टर से पूछें", href: "/ai-doctor" as const },
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
        stage: farmerStageHi(stages[1]?.title, "बढ़वार"),
        alert: pests[0]
          ? `${farmerThreatHi(pests[0])} देखें — हर हफ्ते खेत घूमें; कीड़े ज़्यादा हों तभी दवा डालें`
          : "हर हफ्ते खेत घूमकर कीड़े देखें",
        level: "high",
      },
      {
        id: "2",
        stage: farmerStageHi(
          stages[Math.floor(stages.length / 2)]?.title,
          "फूल–फल"
        ),
        alert: diseases[0]
          ? `${farmerThreatHi(diseases[0])} का खतरा — नमी और मौसम देखकर बचाव करें`
          : irrig[0]
            ? `${farmerStageHi(irrig[0])} पर पानी ज़रूर दें`
            : "खाद संतुलित रखें; पानी की कमी न होने दें",
        level: "medium",
      },
      {
        id: "3",
        stage: farmerStageHi(stages[stages.length - 1]?.title, "कटाई"),
        alert: `कटाई: ${crop.harvestAndYield.harvestingTime}। ${
          crop.harvestAndYield.maturitySigns[0] ?? "पके लक्षण देखकर काटें"
        }`,
        level: "low",
      },
    ];
  }

  return [
    {
      id: "1",
      stage: "शुरुआत",
      alert: pests[0]
        ? `${farmerThreatHi(pests[0])} पर नज़र रखें`
        : "अच्छी बीज और बीज उपचार से फसल शुरू करें",
      level: "high",
    },
    {
      id: "2",
      stage: "बीच का समय",
      alert: diseases[0]
        ? `${farmerThreatHi(diseases[0])} देखें`
        : irrig[0]
          ? `पानी ज़रूरी: ${farmerStageHi(irrig[0])}`
          : "खाद की किस्त समय पर डालें",
      level: "medium",
    },
    {
      id: "3",
      stage: "कटाई",
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
        ? `${fert.stage}: ${fert.details[0] ?? "खाद डालें"}`
        : `बुवाई खाद: ${crop.fertilizerSchedule.basalDose[0] ?? "शुरू की खाद डालें"}`,
      due: "इस हफ्ते",
      priority: "high" as const,
    },
    {
      id: "2",
      task: pest
        ? `${farmerThreatHi(pest)} के लिए खेत देखें`
        : "खेत में कीड़े देखें",
      due: "3–5 दिन में",
      priority: "medium" as const,
    },
    {
      id: "3",
      task: crop.cropProtection.weedManagement[0] ?? "समय पर निराई / खरपतवार दवा",
      due: "अगले हफ्ते",
      priority: "low" as const,
    },
  ];
}
