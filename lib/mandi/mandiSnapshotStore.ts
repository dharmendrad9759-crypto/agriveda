import { kvGet, kvSet } from "@/lib/durableKv";
import {
  dedupeMandiRows,
  fetchAllNationalMandi,
  fetchDistrictMandi,
  fetchStateMandiBulk,
} from "@/lib/mandi/fetchDataGov";
import type { MandiRow } from "@/lib/mandi/types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const ROLLING_DAYS = 7;

type SnapshotDay = { date: string; rows: MandiRow[] };
type MandiSnapshotStore = { days: SnapshotDay[]; updatedAt: string };
type StateCache = { rows: MandiRow[]; syncedAt: string };

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function slimStore(rows: MandiRow[]): MandiRow[] {
  return rows.map((r) => ({
    id: r.id,
    crop: r.crop,
    cropHi: r.cropHi,
    variety: r.variety,
    mandi: r.mandi,
    state: r.state,
    district: r.district,
    min: r.min,
    max: r.max,
    modal: r.modal,
    change: r.change,
    changeAmt: r.changeAmt,
    trend: r.trend?.length ? [r.trend[r.trend.length - 1]] : [r.modal],
    category: r.category,
    arrivalDate: r.arrivalDate,
  }));
}

function strictStateRows(rows: MandiRow[], state: string): MandiRow[] {
  const s = state.trim().toLowerCase();
  return rows.filter((r) => r.state.trim().toLowerCase() === s);
}

async function loadStore(): Promise<MandiSnapshotStore> {
  const hit = await kvGet<MandiSnapshotStore>("mandi:rolling:v1");
  return hit?.days?.length ? hit : { days: [], updatedAt: "" };
}

async function saveStore(store: MandiSnapshotStore): Promise<void> {
  await kvSet("mandi:rolling:v1", store, CACHE_TTL_MS * (ROLLING_DAYS + 1));
}

export async function syncNationalMandiSnapshot(): Promise<number> {
  const rows = await fetchAllNationalMandi();
  if (!rows.length) return 0;
  const store = await loadStore();
  const date = todayKey();
  const nextDays = [...store.days.filter((d) => d.date !== date), { date, rows: slimStore(rows) }]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-ROLLING_DAYS);
  await saveStore({ days: nextDays, updatedAt: new Date().toISOString() });
  return rows.length;
}

function rowsForStateFromStore(store: MandiSnapshotStore, state: string): MandiRow[] {
  return dedupeMandiRows(
    store.days.flatMap((d) => strictStateRows(d.rows, state))
  );
}

async function loadStateRows(state: string, bust = false): Promise<MandiRow[]> {
  const stateKey = `mandi:state:v3:${state.trim().toLowerCase()}`;
  if (!bust) {
    const cached = await kvGet<StateCache>(stateKey);
    if (cached?.rows?.length) {
      const age = Date.now() - Date.parse(cached.syncedAt);
      if (age < CACHE_TTL_MS) return cached.rows;
    }
  }

  const stateRows = await fetchStateMandiBulk(state);
  if (stateRows.length) {
    await kvSet(stateKey, { rows: stateRows, syncedAt: new Date().toISOString() }, CACHE_TTL_MS);
  }
  return stateRows;
}

export async function getMandiRowsForLocation(
  state: string,
  district?: string
): Promise<{ rows: MandiRow[] }> {
  const stateRows = await loadStateRows(state);
  const store = await loadStore();

  if (
    !store.days.some((d) => d.date === todayKey()) ||
    Date.now() - Date.parse(store.updatedAt || "0") > CACHE_TTL_MS
  ) {
    void syncNationalMandiSnapshot().catch(() => undefined);
  }

  const rolling = rowsForStateFromStore(store, state);
  let merged = dedupeMandiRows([...stateRows, ...rolling]);
  merged = strictStateRows(merged, state);

  if (district?.trim()) {
    const districtRows = await fetchDistrictMandi(state, district);
    merged = dedupeMandiRows([...merged, ...strictStateRows(districtRows, state)]);
  }

  return { rows: merged };
}
