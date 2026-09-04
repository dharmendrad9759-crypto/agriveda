import { NextRequest, NextResponse } from "next/server";
import { expandMockMandi } from "@/lib/mandi/expandMockMandi";
import { isDataGovConfigured } from "@/lib/mandi/fetchDataGov";
import { enrichMockWithChange } from "@/lib/mandi/mapDataGov";
import { buildMandiFilterOptions } from "@/lib/mandi/marketAnalytics";
import { getMandiRowsForLocation } from "@/lib/mandi/mandiSnapshotStore";
import type { MandiApiResponse } from "@/lib/mandi/types";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  const limited = await rateLimit(`mandi:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `बहुत अनुरोध — ${limited.retryAfterSec} सेकंड बाद` },
      { status: 429 }
    );
  }

  const state = request.nextUrl.searchParams.get("state")?.trim() || "Madhya Pradesh";
  const district = request.nextUrl.searchParams.get("district")?.trim() || undefined;
  const apiKeyConfigured = isDataGovConfigured();
  const normalizedState = normalizeState(state);
  const now = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const live = await getMandiRowsForLocation(normalizedState, district);
    if (live.rows.length) {
      const body: MandiApiResponse = {
        source: "live",
        state: normalizedState,
        district,
        lastUpdated: now,
        rows: live.rows,
      };
      return NextResponse.json(body);
    }

    const mockRows = enrichMockWithChange(expandMockMandi(normalizedState, district));
    const body: MandiApiResponse = {
      source: "mock",
      state: normalizedState,
      district,
      lastUpdated: now,
      rows: mockRows,
      filters: buildMandiFilterOptions(mockRows),
      error: !apiKeyConfigured
        ? "लाइव मंडी API key नहीं — ये नमूना भाव हैं, बेचने का फैसला इन पर न लें"
        : "लाइव मंडी डेटा नहीं मिला — नमूना भाव दिख रहे हैं",
    };
    return NextResponse.json(body);
  } catch {
    const mockRows = enrichMockWithChange(expandMockMandi(normalizedState, district));
    const body: MandiApiResponse = {
      source: "mock",
      state: normalizedState,
      district,
      lastUpdated: now,
      rows: mockRows,
      filters: buildMandiFilterOptions(mockRows),
      error: "लाइव मंडी लोड नहीं हुई — नमूना भाव (फैसला इन पर न लें)",
    };
    return NextResponse.json(body);
  }
}
