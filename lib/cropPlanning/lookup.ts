import cropCalendarRaw from "@/data/crop-planning/crop-calendar-india.json";
import vegetableCalendarRaw from "@/data/crop-planning/vegetable-calendar-india.json";

export type SeasonKey = "kharif" | "rabi" | "zaid";

export interface CropPlanItem {
  label: string;
  english: string;
  hindi?: string;
  slug?: string;
  kind: "crop" | "vegetable" | "note";
}

export interface RegionalCropPlan {
  state: string;
  district?: string;
  zone?: string;
  zoneNote?: string;
  seasons: Record<SeasonKey, CropPlanItem[]>;
  currentSeason: SeasonKey;
  meta?: string;
}

interface ZoneEntry {
  zone: string;
  districts: string[];
  kharif?: string[];
  rabi?: string[];
  zaid?: string[];
  kharif_summer?: string[];
  note?: string;
}

interface StateEntry {
  state: string;
  kharif?: string[];
  rabi?: string[];
  zaid?: string[];
  kharif_summer?: string[];
  note?: string;
}

const cropCalendar = cropCalendarRaw as {
  uttar_pradesh_zones?: ZoneEntry[];
  india_states?: StateEntry[];
  _meta?: { seasons?: Record<string, string> };
};

const vegetableCalendar = vegetableCalendarRaw as {
  uttar_pradesh_zones?: ZoneEntry[];
  india_states?: StateEntry[];
};

/** Map JSON crop labels → app crop slugs */
const LABEL_TO_SLUG: [RegExp, string][] = [
  [/paddy|धान/i, "paddy"],
  [/wheat|गेहूं|gehun/i, "wheat"],
  [/maize|मक्का|makka/i, "maize"],
  [/soybean|सोयाबीन/i, "soybean"],
  [/bajra|बाजरा/i, "bajra"],
  [/cotton|कपास/i, "cotton"],
  [/sugarcane|गन्ना|ganna/i, "sugarcane"],
  [/mustard|सरसों|sarson/i, "mustard"],
  [/gram|चना|chana/i, "pulses"],
  [/lentil|मसूर/i, "pulses"],
  [/moong|मूंग/i, "moong"],
  [/urad|उड़द/i, "moong"],
  [/arhar|अरहर/i, "pulses"],
  [/potato|आलू|aloo/i, "potato"],
  [/tomato|टमाटर|tamatar/i, "tomato"],
  [/onion|प्याज/i, "onion"],
  [/chilli|मिर्च/i, "chilli"],
  [/cauliflower|फूलगोभी/i, "cauliflower"],
  [/cucumber|खीरा/i, "cucumber"],
  [/brinjal|बैंगन|baingan/i, "brinjal"],
  [/okra|भिंडी|bhindi/i, "bhindi"],
  [/groundnut|मूंगफली|moongfali/i, "moongfali"],
  [/jowar|ज्वार/i, "bajra"],
  [/barley|जौ/i, "wheat"],
  [/peas|मटर/i, "pulses"],
];

export function normalizeLocationName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
}

function parseCropLabel(label: string): CropPlanItem {
  const trimmed = label.trim();
  if (/very limited|none|minimal|not broken/i.test(trimmed)) {
    return { label: trimmed, english: trimmed, kind: "note" };
  }

  const parts = trimmed.split(" / ");
  const english = parts[0]?.split("(")[0]?.trim() ?? trimmed;
  const hindi = parts[1]?.trim();

  return {
    label: trimmed,
    english,
    hindi,
    slug: cropLabelToSlug(trimmed),
    kind: isVegetableLabel(trimmed) ? "vegetable" : "crop",
  };
}

function isVegetableLabel(label: string): boolean {
  return /vegetable|सब्ज़|टमाटर|आलू|प्याज|भिंडी|बैंगन|गोभी|खीरा|तरबूज|खरबूज|करेला|लौकी|मूली|पालक|गाजर|मिर्च|capsicum|शिमला/i.test(
    label
  );
}

export function cropLabelToSlug(label: string): string | undefined {
  for (const [pattern, slug] of LABEL_TO_SLUG) {
    if (pattern.test(label)) return slug;
  }
  return undefined;
}

export function currentSeason(month = new Date().getMonth() + 1): SeasonKey {
  if (month >= 6 && month <= 9) return "kharif";
  if (month >= 10 || month <= 2) return "rabi";
  return "zaid";
}

const SEASON_LABELS: Record<SeasonKey, string> = {
  kharif: "Kharif (Jun–Oct)",
  rabi: "Rabi (Oct–Apr)",
  zaid: "Zaid (Mar–Jun)",
};

export function seasonLabel(season: SeasonKey): string {
  return SEASON_LABELS[season];
}

function findUpZone(district: string): ZoneEntry | undefined {
  const norm = normalizeLocationName(district);
  return cropCalendar.uttar_pradesh_zones?.find((z) =>
    z.districts.some((d) => normalizeLocationName(d) === norm)
  );
}

function findStateEntry(state: string): StateEntry | undefined {
  const norm = normalizeLocationName(state);
  return cropCalendar.india_states?.find((s) => {
    const sNorm = normalizeLocationName(s.state);
    return sNorm === norm || sNorm.includes(norm) || norm.includes(sNorm.split(" ")[0] ?? "");
  });
}

function findVegZone(district: string): ZoneEntry | undefined {
  const norm = normalizeLocationName(district);
  return vegetableCalendar.uttar_pradesh_zones?.find((z) =>
    z.districts.some((d) => normalizeLocationName(d) === norm)
  );
}

function findVegState(state: string): StateEntry | undefined {
  const norm = normalizeLocationName(state);
  return vegetableCalendar.india_states?.find((s) => {
    const sNorm = normalizeLocationName(s.state);
    return sNorm === norm || sNorm.includes(norm) || norm.includes(sNorm.split(" ")[0] ?? "");
  });
}

function seasonList(entry: ZoneEntry | StateEntry | undefined, season: SeasonKey): string[] {
  if (!entry) return [];
  const key = season === "kharif" && "kharif_summer" in entry && entry.kharif_summer?.length
    ? "kharif_summer"
    : season;
  const list = entry[key as keyof typeof entry];
  return Array.isArray(list) ? list : [];
}

function mergeSeasonLists(crops: string[], vegetables: string[]): CropPlanItem[] {
  const seen = new Set<string>();
  const items: CropPlanItem[] = [];

  for (const raw of [...crops, ...vegetables]) {
    const key = normalizeLocationName(raw);
    if (seen.has(key)) continue;
    seen.add(key);

    const item = parseCropLabel(raw);
    if (item.kind === "note" && items.some((i) => i.kind === "note")) continue;
    items.push(item);
  }

  return items;
}

export function getRegionalCropPlan(state: string, district?: string): RegionalCropPlan | null {
  if (!state?.trim()) return null;

  const season = currentSeason();
  const isUp = /uttar\s*pradesh|^up$/i.test(state.trim());

  let cropZone: ZoneEntry | StateEntry | undefined;
  let vegZone: ZoneEntry | StateEntry | undefined;
  let zoneName: string | undefined;
  let zoneNote: string | undefined;

  if (isUp && district) {
    cropZone = findUpZone(district);
    vegZone = findVegZone(district);
    if (cropZone && "zone" in cropZone) {
      zoneName = cropZone.zone;
      zoneNote = cropZone.note;
    }
  }

  if (!cropZone) cropZone = findStateEntry(state);
  if (!vegZone) vegZone = findVegState(state);

  if (!cropZone && !vegZone) return null;

  const seasons: Record<SeasonKey, CropPlanItem[]> = {
    kharif: mergeSeasonLists(seasonList(cropZone, "kharif"), seasonList(vegZone, "kharif")),
    rabi: mergeSeasonLists(seasonList(cropZone, "rabi"), seasonList(vegZone, "rabi")),
    zaid: mergeSeasonLists(seasonList(cropZone, "zaid"), seasonList(vegZone, "zaid")),
  };

  return {
    state: state.trim(),
    district: district?.trim(),
    zone: zoneName,
    zoneNote,
    seasons,
    currentSeason: season,
    meta: cropZone && "note" in cropZone ? cropZone.note : undefined,
  };
}

export function getViableCropSlugs(state: string, district?: string, season?: SeasonKey): string[] {
  const plan = getRegionalCropPlan(state, district);
  if (!plan) return [];

  const key = season ?? plan.currentSeason;
  const slugs = new Set<string>();

  for (const item of plan.seasons[key]) {
    if (item.slug) slugs.add(item.slug);
  }

  return [...slugs];
}

export function getAllViableSlugsForSeason(state: string, district: string | undefined, season: SeasonKey): string[] {
  return getViableCropSlugs(state, district, season);
}

export const SEASON_INFO = cropCalendar._meta?.seasons ?? {
  kharif: "Sown Jun-Jul with monsoon onset, harvested Sep-Oct",
  rabi: "Sown Oct-Dec after monsoon retreat, harvested Feb-Apr",
  zaid: "Short summer crop, sown Mar, harvested Jun",
};
