import { getCropManagementProfile } from "@/data/crop-management";
import {
  getBuwaiForSlug,
  pickBuwaiRegion,
  type BuwaiDateWindow,
} from "@/data/agriveda2/buwai-data";
import { resolveNorthIndiaRegion } from "@/data/agriveda2/crop-slug-map";
import { formatSowingCard, getCropAgroMeta } from "@/lib/crops/cropAgroMeta";

export type SowingWindowStatus = "green" | "yellow" | "red";

export interface SowingWindowDisplay {
  label: string;
  range: string;
  active: boolean;
}

export interface SowingWindowResult {
  status: SowingWindowStatus;
  title: string;
  messageHi: string;
  messageEn: string;
  windowStart?: string;
  windowEnd?: string;
  regionKey: string;
  season?: string;
  stateData: Record<string, string>;
  seasons?: Record<string, Record<string, string>>;
  windows: SowingWindowDisplay[];
  criticalNote: string;
  lateVariety?: string;
  soilMoisturePercent?: number;
  gddEstimate?: number;
  alternateVariety?: string;
  alternateNote?: string;
  factors: string[];
}

function toDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function ruleToDayOfYear(year: number, r: { month: number; day: number }): number {
  return toDayOfYear(new Date(year, r.month - 1, r.day));
}

function formatDate(year: number, r: { month: number; day: number }): string {
  return new Date(year, r.month - 1, r.day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function isInWindow(doy: number, year: number, w: BuwaiDateWindow): boolean {
  const start = ruleToDayOfYear(year, { month: w.startMonth, day: w.startDay });
  const end = ruleToDayOfYear(year, { month: w.endMonth, day: w.endDay });
  return doy >= start && doy <= end;
}

function windowRangeText(year: number, w: BuwaiDateWindow): string {
  return `${formatDate(year, { month: w.startMonth, day: w.startDay })} – ${formatDate(year, { month: w.endMonth, day: w.endDay })}`;
}

function stateDataToLines(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join(" · ");
}

export function evaluateSowingWindow(
  cropSlug: string,
  options?: {
    state?: string;
    soilMoisturePercent?: number;
    tempC?: number;
    rainChance3d?: number;
    today?: Date;
  }
): SowingWindowResult {
  const today = options?.today ?? new Date();
  const year = today.getFullYear();
  const doy = toDayOfYear(today);
  const profile = getCropManagementProfile(cropSlug);
  const factors: string[] = [];

  const soilMoisture = options?.soilMoisturePercent ?? estimateSoilMoisture(options?.rainChance3d);
  const gdd = options?.tempC != null ? Math.round(options.tempC * 1.8) : undefined;

  const buwai = getBuwaiForSlug(cropSlug);
  const region = resolveNorthIndiaRegion(options?.state);
  const cropName = profile?.name ?? cropSlug;

  if (!buwai) {
    const agro = getCropAgroMeta(cropSlug);
    const sowing = formatSowingCard(cropSlug, agro.sowingWindow);
    return {
      status: "yellow",
      title: `${cropName} — sowing window`,
      messageHi: `${cropName}: ${sowing}. Apne zila ke mausam / mitti dekh kar final din decide karein.`,
      messageEn: `${cropName}: ${sowing}. Confirm final date with local weather and soil moisture.`,
      regionKey: region,
      stateData: {},
      windows: [
        {
          label: "Recommended window",
          range: agro.sowingWindow,
          active: true,
        },
      ],
      criticalNote: agro.climateNote,
      soilMoisturePercent: soilMoisture,
      gddEstimate: gdd,
      factors: ["agro_meta_fallback"],
    };
  }

  const { regionKey, windows, stateData } = pickBuwaiRegion(buwai, region);

  if (soilMoisture >= 55 && soilMoisture <= 75) factors.push("soil_moisture_ideal");
  else if (soilMoisture < 45) factors.push("soil_dry");
  else if (soilMoisture > 80) factors.push("soil_wet");

  if (options?.tempC != null) {
    if (options.tempC >= 15 && options.tempC <= 32) factors.push("temp_ok");
    else factors.push("temp_borderline");
  }

  const displayWindows: SowingWindowDisplay[] = windows.map((w) => ({
    label: w.label,
    range: windowRangeText(year, w),
    active: isInWindow(doy, year, w),
  }));

  const activeIdx = windows.findIndex((w) => isInWindow(doy, year, w));
  const inAnyWindow = activeIdx >= 0;

  const earliestStart = windows.length
    ? Math.min(...windows.map((w) => ruleToDayOfYear(year, { month: w.startMonth, day: w.startDay })))
    : doy;
  const latestEnd = windows.length
    ? Math.max(...windows.map((w) => ruleToDayOfYear(year, { month: w.endMonth, day: w.endDay })))
    : doy;

  const primary = windows[0];
  const windowLabel = primary ? windowRangeText(year, primary) : stateDataToLines(stateData);

  const base = {
    regionKey,
    season: buwai.season,
    stateData,
    seasons: buwai.seasons,
    windows: displayWindows,
    criticalNote: buwai.critical_note,
    lateVariety: buwai.late_variety,
    soilMoisturePercent: soilMoisture,
    gddEstimate: gdd,
    factors,
    windowStart: primary
      ? formatDate(year, { month: primary.startMonth, day: primary.startDay })
      : undefined,
    windowEnd: primary
      ? formatDate(year, { month: primary.endMonth, day: primary.endDay })
      : undefined,
  };

  if (inAnyWindow && factors.includes("soil_moisture_ideal")) {
    const active = displayWindows[activeIdx];
    return {
      ...base,
      status: "green",
      title: "Green Window — Abhi buwai karein",
      messageHi: `${regionKey} mein ${active.label} (${active.range}) chal raha hai. Mitti ki nami ${soilMoisture}% — uttam. ${buwai.critical_note}`,
      messageEn: `Active window: ${active.label} (${active.range}). Soil moisture ${soilMoisture}% — ideal.`,
      alternateVariety: buwai.late_variety,
    };
  }

  if (inAnyWindow) {
    const active = displayWindows[activeIdx];
    return {
      ...base,
      status: "yellow",
      title: "Window khuli hai — savdhani se buwai",
      messageHi: `${active.label} (${active.range}) — lekin mitti/mausam borderline hai. Nami check karein. ${buwai.critical_note}`,
      messageEn: `Window open (${active.range}) but conditions borderline.`,
      alternateVariety: buwai.late_variety,
    };
  }

  if (doy < earliestStart) {
    const daysUntil = earliestStart - doy;
    return {
      ...base,
      status: "yellow",
      title: `${daysUntil} din baaki — taiyari karein`,
      messageHi: `Abhi jaldi hai. ${regionKey}: pehli window ${windowLabel} se. Taiyari: jutai, khad, beej treatment. ${stateDataToLines(stateData)}`,
      messageEn: `Too early. First window opens ${windowLabel}.`,
      alternateVariety: buwai.late_variety,
    };
  }

  if (doy > latestEnd) {
    return {
      ...base,
      status: "red",
      title: "Is season ki window band — agla season plan karein",
      messageHi: `${regionKey} mein is season ki mukhya buwai window nikal chuki. ${buwai.late_variety ? `Picheti ke liye: ${buwai.late_variety}. ` : ""}${buwai.critical_note}`,
      messageEn: `Main sowing window closed for this season in ${regionKey}.`,
      alternateVariety: buwai.late_variety,
      alternateNote: buwai.late_variety,
    };
  }

  return {
    ...base,
    status: "yellow",
    title: "Late window — variety badlein",
    messageHi: `Mukhya window guzar chuki. ${buwai.late_variety ? `${buwai.late_variety} try karein. ` : ""}${buwai.critical_note}`,
    messageEn: `Between windows — consider late variety if still sowing.`,
    alternateVariety: buwai.late_variety,
  };
}

function estimateSoilMoisture(rainChance?: number): number {
  const base = 58;
  if (rainChance == null) return base;
  return Math.min(85, Math.max(35, base + Math.round(rainChance * 0.4)));
}
