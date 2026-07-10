import { readStorage, writeStorage } from "@/lib/storage";
import type { MandiRow } from "@/lib/mandi/types";

const KEY = "agriveda-mandi-history";
const MAX_SNAPSHOTS = 45;

export interface MandiSnapshot {
  date: string;
  state: string;
  district?: string;
  rows: { crop: string; mandi: string; modal: number }[];
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function locationKey(state: string, district?: string): string {
  return `${state}|${district ?? ""}`;
}

export function recordMandiSnapshot(
  state: string,
  district: string | undefined,
  rows: MandiRow[]
): void {
  if (typeof window === "undefined" || !rows.length) return;

  const date = todayKey();
  const loc = locationKey(state, district);
  const slim = rows.map((r) => ({ crop: r.crop, mandi: r.mandi, modal: r.modal }));
  const snapshots = readStorage<MandiSnapshot[]>(KEY, []);

  const withoutToday = snapshots.filter(
    (s) => !(s.date === date && locationKey(s.state, s.district) === loc)
  );
  const next = [...withoutToday, { date, state, district, rows: slim }]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-MAX_SNAPSHOTS);

  writeStorage(KEY, next);
}

export function enrichRowsWithHistory(
  state: string,
  district: string | undefined,
  rows: MandiRow[]
): MandiRow[] {
  if (typeof window === "undefined") return rows;

  const snapshots = readStorage<MandiSnapshot[]>(KEY, []);
  const loc = locationKey(state, district);
  const today = todayKey();

  const forLocation = snapshots
    .filter((s) => locationKey(s.state, s.district) === loc)
    .sort((a, b) => a.date.localeCompare(b.date));

  const previous = [...forLocation].filter((s) => s.date < today).pop();
  if (!previous) return rows;

  return rows.map((r) => {
    const prevRow = previous.rows.find((p) => p.crop === r.crop && p.mandi === r.mandi);
    if (!prevRow?.modal) return r;

    const changeAmt = r.modal - prevRow.modal;
    const change = Math.round((changeAmt / prevRow.modal) * 1000) / 10;

    const cropHistory = forLocation
      .map((s) => {
        const matches = s.rows.filter((p) => p.crop === r.crop);
        if (!matches.length) return 0;
        return Math.round(matches.reduce((sum, p) => sum + p.modal, 0) / matches.length);
      })
      .filter((v) => v > 0);

    const trend = cropHistory.length >= 2 ? cropHistory.slice(-7) : r.trend;

    return { ...r, change, changeAmt, trend };
  });
}

export function historicalSeriesForCrop(
  state: string,
  district: string | undefined,
  crop: string,
  range: string
): number[] {
  if (typeof window === "undefined") return [];

  const snapshots = readStorage<MandiSnapshot[]>(KEY, []);
  const loc = locationKey(state, district);
  const limit = range === "1y" ? 30 : range === "30d" ? 14 : 7;

  const forLocation = snapshots
    .filter((s) => locationKey(s.state, s.district) === loc)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit);

  const series = forLocation
    .map((s) => {
      const matches = s.rows.filter((p) => p.crop.toLowerCase() === crop.toLowerCase());
      if (!matches.length) return 0;
      return Math.round(matches.reduce((sum, p) => sum + p.modal, 0) / matches.length);
    })
    .filter((v) => v > 0);

  return series;
}
