import { NextRequest, NextResponse } from "next/server";
import { MANDI_PRICES } from "@/data/mock/mandi";
import { DATA_GOV_RESOURCE_ID } from "@/lib/mandi/constants";
import { enrichMockWithChange, mapDataGovRecords } from "@/lib/mandi/mapDataGov";
import type { MandiApiResponse } from "@/lib/mandi/types";

const API_KEY = process.env.DATA_GOV_API_KEY || process.env.NEXT_PUBLIC_DATA_GOV_API_KEY;

async function fetchLiveMandi(state: string, district?: string, limit = 80) {
  if (!API_KEY) return null;

  const params = new URLSearchParams({
    "api-key": API_KEY,
    format: "json",
    limit: String(limit),
    "filters[state]": state,
  });
  if (district?.trim()) {
    params.set("filters[district]", district.trim());
  }

  const url = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const json = (await res.json()) as { records?: unknown[] };
  const records = (json.records ?? []) as Parameters<typeof mapDataGovRecords>[0];
  if (!records.length) return null;

  return mapDataGovRecords(records);
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim() || "Madhya Pradesh";
  const district = request.nextUrl.searchParams.get("district")?.trim() || undefined;
  const now = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const liveRows = await fetchLiveMandi(state, district);
    if (liveRows?.length) {
      const body: MandiApiResponse = {
        source: "live",
        state,
        district,
        lastUpdated: now,
        rows: liveRows,
      };
      return NextResponse.json(body);
    }

    const body: MandiApiResponse = {
      source: "mock",
      state,
      district,
      lastUpdated: now,
      rows: enrichMockWithChange(MANDI_PRICES),
      error: API_KEY
        ? "Live mandi data unavailable — showing sample rates"
        : "Add DATA_GOV_API_KEY in .env.local for live mandi (data.gov.in)",
    };
    return NextResponse.json(body);
  } catch {
    const body: MandiApiResponse = {
      source: "mock",
      state,
      district,
      lastUpdated: now,
      rows: enrichMockWithChange(MANDI_PRICES),
      error: "Could not load live mandi — showing sample rates",
    };
    return NextResponse.json(body);
  }
}
