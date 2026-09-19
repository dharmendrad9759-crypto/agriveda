import {
  getBuwaiForSlug,
  pickBuwaiRegion,
  type BuwaiDateWindow,
} from "@/data/agriveda2/buwai-data";
import { resolveNorthIndiaRegion } from "@/data/agriveda2/crop-slug-map";
import type { PlannerSeasonId } from "@/lib/crops/crop-display";

const MONTH_HI = [
  "",
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्तूबर",
  "नवंबर",
  "दिसंबर",
];

const DEFAULT_WINDOW: Record<PlannerSeasonId, { startMonth: number; startDay: number; endMonth: number; endDay: number }> =
  {
    kharif: { startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
    rabi: { startMonth: 10, startDay: 15, endMonth: 11, endDay: 15 },
    zaid: { startMonth: 2, startDay: 15, endMonth: 3, endDay: 15 },
  };

export type SeasonSowingWindow = {
  season: PlannerSeasonId;
  startIso: string;
  endIso: string;
  startLabel: string;
  endLabel: string;
  rangeHi: string;
  official: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function labelHi(month: number, day: number) {
  return `${day} ${MONTH_HI[month] ?? ""}`.trim();
}

function windowToYear(w: BuwaiDateWindow, year: number) {
  let start = new Date(year, w.startMonth - 1, w.startDay);
  let end = new Date(year, w.endMonth - 1, w.endDay);
  if (end < start) end.setFullYear(year + 1);
  return {
    startIso: toIso(start.getFullYear(), start.getMonth() + 1, start.getDate()),
    endIso: toIso(end.getFullYear(), end.getMonth() + 1, end.getDate()),
    startLabel: labelHi(w.startMonth, w.startDay),
    endLabel: labelHi(w.endMonth, w.endDay),
  };
}

export function seasonOfWindow(w: BuwaiDateWindow): PlannerSeasonId {
  const label = w.label.toLowerCase();
  if (/kharif|monsoon|nursery|direct seed/.test(label) && w.startMonth >= 5 && w.startMonth <= 8) {
    return "kharif";
  }
  if (/zaid|spring|summer/.test(label) || (w.startMonth >= 2 && w.startMonth <= 4 && !/rabi/.test(label))) {
    return "zaid";
  }
  if (/rabi|autumn|winter|desi|kabuli/.test(label) || w.startMonth >= 9 || w.startMonth === 1) {
    return "rabi";
  }
  if (w.startMonth >= 5 && w.startMonth <= 8) return "kharif";
  if (w.startMonth >= 2 && w.startMonth <= 4) return "zaid";
  return "rabi";
}

function windowsForCrop(slug: string, state?: string): BuwaiDateWindow[] {
  const entry = getBuwaiForSlug(slug);
  if (!entry) return [];
  return pickBuwaiRegion(entry, resolveNorthIndiaRegion(state)).windows;
}

/** Official sowing window for this crop + season (one range, not a chip list). */
export function seasonSowingWindow(
  slug: string,
  season: PlannerSeasonId,
  state?: string,
  year = new Date().getFullYear()
): SeasonSowingWindow {
  const match = windowsForCrop(slug, state).find((w) => seasonOfWindow(w) === season);
  const src = match ?? { label: season, ...DEFAULT_WINDOW[season] };
  const y = windowToYear(src, year);
  return {
    season,
    ...y,
    rangeHi: `${y.startLabel} से ${y.endLabel}`,
    official: Boolean(match),
  };
}

export function sowingBoundsForSeason(slug: string, season: PlannerSeasonId, state?: string) {
  const w = seasonSowingWindow(slug, season, state);
  return { min: w.startIso, max: w.endIso, window: w };
}

export type DayMonthPick = { iso: string; day: number; month: number; label: string };

/** Every valid sowing day in the official window — no year shown to farmer. */
export function datesInOfficialWindow(
  slug: string,
  season: PlannerSeasonId,
  state?: string
): DayMonthPick[] {
  const w = seasonSowingWindow(slug, season, state);
  const start = new Date(`${w.startIso}T00:00:00`);
  const end = new Date(`${w.endIso}T00:00:00`);
  const out: DayMonthPick[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getDate();
    const month = cursor.getMonth() + 1;
    out.push({
      iso: toIso(cursor.getFullYear(), month, day),
      day,
      month,
      label: labelHi(month, day),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export function clampSowingDate(iso: string, min: string, max: string) {
  if (!iso) return min;
  if (iso < min) return min;
  if (iso > max) return max;
  return iso;
}

export function defaultSowingDate(min: string, max: string) {
  return min || max;
}
