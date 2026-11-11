import { NextRequest, NextResponse } from "next/server";
import {
  getOfflinePincodeFallback,
  normalizePincodeDistrict,
  normalizePincodeState,
  uniqueVillageNames,
} from "@/lib/pincodeLookup";
import { fetchPinAreaVillages } from "@/lib/pinAreaVillages";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const PIN_RESULT_TTL_MS = 12 * 60 * 60 * 1000;
const pinResultCache = new Map<string, { exp: number; body: Record<string, unknown> }>();

interface PostalOffice {
  District?: string;
  State?: string;
  Block?: string;
  Name?: string;
}

function readCachedPin(pin: string): Record<string, unknown> | null {
  const hit = pinResultCache.get(pin);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    pinResultCache.delete(pin);
    return null;
  }
  return hit.body;
}

function writeCachedPin(pin: string, body: Record<string, unknown>) {
  pinResultCache.set(pin, { exp: Date.now() + PIN_RESULT_TTL_MS, body });
}

async function mergeVillages(
  seed: Array<string | undefined | null>,
  nearbyPromise: Promise<string[]>
): Promise<string[]> {
  const nearby = await nearbyPromise;
  return uniqueVillageNames([...seed, ...nearby]);
}

export async function GET(request: NextRequest) {
  const limited = await rateLimit(`pincode:${clientIp(request)}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const pin = request.nextUrl.searchParams.get("pin")?.replace(/\D/g, "").slice(0, 6);
  if (!pin || pin.length !== 6) {
    return NextResponse.json({ error: "Valid 6-digit PIN required" }, { status: 400 });
  }

  const cached = readCachedPin(pin);
  if (cached) return NextResponse.json(cached);

  const hint = getOfflinePincodeFallback(pin);
  const nearbyPromise = fetchPinAreaVillages(pin, { district: hint?.district ?? "" });

  // 1. Primary: Official Postal Pincode API
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const rawData = await res.json();
      // Postal API returns an array: [{ Status: "Success", PostOffice: [...] }]
      const item = (Array.isArray(rawData) ? rawData[0] : rawData) as {
        Status?: string;
        PostOffice?: PostalOffice[];
      };

      if (item?.Status === "Success" && item?.PostOffice?.length) {
        const office = item.PostOffice[0];
        const state = normalizePincodeState(office.State ?? "");
        const district = normalizePincodeDistrict(
          state,
          office.District ?? "",
          office.Block ?? office.Name
        );
        const villages = await mergeVillages(
          item.PostOffice.map((row) => row.Name),
          nearbyPromise
        );

        const body = {
          pincode: pin,
          district,
          state,
          block: office.Block && office.Block !== "NA" ? office.Block : office.Name,
          villages,
        };
        writeCachedPin(pin, body);
        return NextResponse.json(body);
      }
    }
  } catch {
    // Proceed to secondary fallback
  }

  // 2. Secondary: Zippopotam API
  try {
    const zipRes = await fetch(`https://api.zippopotam.us/in/${pin}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (zipRes.ok) {
      const zipData = (await zipRes.json()) as {
        places?: Array<{
          "place name"?: string;
          state?: string;
        }>;
      };
      if (zipData?.places?.length) {
        const place = zipData.places[0];
        const state = normalizePincodeState(place.state ?? "");
        const district = normalizePincodeDistrict(state, place["place name"] ?? "");
        const villages = await mergeVillages(
          zipData.places.map((row) => row["place name"]),
          nearbyPromise
        );
        const body = {
          pincode: pin,
          district,
          state,
          block: place["place name"],
          villages,
        };
        writeCachedPin(pin, body);
        return NextResponse.json(body);
      }
    }
  } catch {
    // Proceed to tertiary fallback
  }

  // 3. Tertiary: Offline Postal Circle Fallback (never leaves farmer stranded)
  const offline = getOfflinePincodeFallback(pin);
  if (offline) {
    const villages = await mergeVillages(offline.villages ?? [], nearbyPromise);
    const body = { ...offline, villages };
    writeCachedPin(pin, body);
    return NextResponse.json(body);
  }

  return NextResponse.json({ error: "PIN not found" }, { status: 404 });
}
