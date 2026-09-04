import { mapDataGovRecords } from "@/lib/mandi/mapDataGov";
import type { MandiRow } from "@/lib/mandi/types";
import { DATA_GOV_RESOURCE_ID } from "@/lib/mandi/constants";

const PAGE_SIZE = 1000;
const MAX_PER_QUERY = 25_000;

function readApiKey(): string | undefined {
  const raw = process.env.DATA_GOV_API_KEY;
  if (!raw) return undefined;
  return raw.trim().replace(/^["']|["']$/g, "");
}

type PageFilters = {
  state?: string;
  district?: string;
  commodity?: string;
};

async function fetchRawPage(
  filters: PageFilters,
  limit: number,
  offset: number
): Promise<{ rows: MandiRow[]; total: number }> {
  const API_KEY = readApiKey();
  if (!API_KEY) return { rows: [], total: 0 };

  const params = new URLSearchParams({
    "api-key": API_KEY,
    format: "json",
    limit: String(limit),
    offset: String(offset),
  });
  if (filters.state?.trim()) params.set("filters[state]", filters.state.trim());
  if (filters.district?.trim()) params.set("filters[district]", filters.district.trim());
  if (filters.commodity?.trim()) params.set("filters[commodity]", filters.commodity.trim());

  const url = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}?${params}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { rows: [], total: 0 };

  const json = (await res.json()) as { records?: unknown[]; total?: number };
  const records = (json.records ?? []) as Parameters<typeof mapDataGovRecords>[0];
  return {
    rows: mapDataGovRecords(records),
    total: typeof json.total === "number" ? json.total : records.length,
  };
}

/** Parallel page fetch — one round-trip for all pages */
async function fetchPaginated(filters: PageFilters): Promise<MandiRow[]> {
  const first = await fetchRawPage(filters, PAGE_SIZE, 0);
  if (!first.rows.length) return [];

  const total = Math.min(first.total, MAX_PER_QUERY);
  const all = [...first.rows];
  if (total <= PAGE_SIZE) return all;

  const offsets: number[] = [];
  for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
    offsets.push(offset);
  }

  const pages = await Promise.all(
    offsets.map((offset) => fetchRawPage(filters, PAGE_SIZE, offset))
  );
  for (const page of pages) all.push(...page.rows);

  return all.slice(0, MAX_PER_QUERY);
}

export function mandiRowKey(row: MandiRow): string {
  return [
    row.state,
    row.district ?? "",
    row.mandi,
    row.crop,
    row.variety,
    row.arrivalDate ?? "",
  ]
    .join("|")
    .toLowerCase();
}

export function dedupeMandiRows(rows: MandiRow[]): MandiRow[] {
  const map = new Map<string, MandiRow>();
  for (const row of rows) {
    map.set(mandiRowKey(row), row);
  }
  return [...map.values()];
}

export async function fetchAllNationalMandi(): Promise<MandiRow[]> {
  return fetchPaginated({});
}

export async function fetchStateMandiBulk(state: string): Promise<MandiRow[]> {
  return fetchPaginated({ state });
}

export async function fetchDistrictMandi(state: string, district: string): Promise<MandiRow[]> {
  return fetchPaginated({ state, district: district.trim() });
}

export function isDataGovConfigured(): boolean {
  return Boolean(readApiKey());
}

/** @deprecated */
export async function fetchPaginatedFromDataGov(
  state: string,
  district?: string
): Promise<MandiRow[]> {
  if (district?.trim()) return fetchDistrictMandi(state, district);
  return fetchStateMandiBulk(state);
}
