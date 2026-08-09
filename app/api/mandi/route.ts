import { NextRequest, NextResponse } from "next/server";
import { MANDI_PRICES } from "@/data/mock/mandi";
import { DATA_GOV_RESOURCE_ID } from "@/lib/mandi/constants";
import { enrichMockWithChange, mapDataGovRecords } from "@/lib/mandi/mapDataGov";
import type { MandiApiResponse } from "@/lib/mandi/types";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function readApiKey(): string | undefined {
  const raw = process.env.DATA_GOV_API_KEY;
  if (!raw) return undefined;
  return raw.trim().replace(/^["']|["']$/g, "");
}

const STATE_ALIASES: Record<string, string> = {
  "m.p.": "Madhya Pradesh",
  "madhya pradesh": "Madhya Pradesh",
  "u.p.": "Uttar Pradesh",
  "uttar pradesh": "Uttar Pradesh",
  "m.h.": "Maharashtra",
  maharashtra: "Maharashtra",
  rajasthan: "Rajasthan",
  gujarat: "Gujarat",
  punjab: "Punjab",
  haryana: "Haryana",
  bihar: "Bihar",
};

function normalizeState(state: string): string {
  const trimmed = state.trim();
  if (!trimmed) return "Madhya Pradesh";
  const alias = STATE_ALIASES[trimmed.toLowerCase()];
  return alias ?? trimmed;
}

async function fetchFromDataGov(state: string, district?: string, limit = 100) {
  const API_KEY = readApiKey();
  if (!API_KEY) return { rows: null as ReturnType<typeof mapDataGovRecords> | null, reason: "no-key" as const };

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
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return { rows: null, reason: `http-${res.status}` as const };
  }

  const json = (await res.json()) as { records?: unknown[]; message?: string };
  const records = (json.records ?? []) as Parameters<typeof mapDataGovRecords>[0];
  if (!records.length) {
    return { rows: null, reason: "empty" as const };
  }

  const rows = mapDataGovRecords(records);
  return { rows: rows.length ? rows : null, reason: rows.length ? "ok" : "empty" as const };
}

async function fetchLiveMandi(state: string, district?: string) {
  const normalizedState = normalizeState(state);

  const withDistrict = await fetchFromDataGov(normalizedState, district);
  if (withDistrict.rows?.length) {
    return { rows: withDistrict.rows, scope: district ? "district" : "state" as const };
  }

  if (district?.trim()) {
    const stateOnly = await fetchFromDataGov(normalizedState);
    if (stateOnly.rows?.length) {
      return { rows: stateOnly.rows, scope: "state" as const };
    }
  }

  return { rows: null, scope: "none" as const };
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  const limited = await rateLimit(`mandi:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `बहुत अनुरोध — ${limited.retryAfterSec} सेकंड बाद` },
      { status: 429 }
    );
  }

  const state = request.nextUrl.searchParams.get("state")?.trim() || "Madhya Pradesh";
  const district = request.nextUrl.searchParams.get("district")?.trim() || undefined;
  const apiKeyConfigured = Boolean(readApiKey());
  const now = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const live = await fetchLiveMandi(state, district);
    if (live.rows?.length) {
      const body: MandiApiResponse = {
        source: "live",
        state: normalizeState(state),
        district,
        lastUpdated: now,
        rows: live.rows,
      };
      return NextResponse.json(body);
    }

    const body: MandiApiResponse = {
      source: "mock",
      state: normalizeState(state),
      district,
      lastUpdated: now,
      rows: enrichMockWithChange(MANDI_PRICES),
      error: !apiKeyConfigured
        ? "लाइव मंडी API key नहीं — ये नमूना भाव हैं, बेचने का फैसला इन पर न लें"
        : "लाइव मंडी डेटा नहीं मिला — नमूना भाव दिख रहे हैं",
    };
    return NextResponse.json(body);
  } catch {
    const body: MandiApiResponse = {
      source: "mock",
      state: normalizeState(state),
      district,
      lastUpdated: now,
      rows: enrichMockWithChange(MANDI_PRICES),
      error: "लाइव मंडी लोड नहीं हुई — नमूना भाव (फैसला इन पर न लें)",
    };
    return NextResponse.json(body);
  }
}
