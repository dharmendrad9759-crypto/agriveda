import { NextRequest, NextResponse } from "next/server";
import {
  getOfflinePincodeFallback,
  normalizePincodeDistrict,
  normalizePincodeState,
} from "@/lib/pincodeLookup";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

interface PostalOffice {
  District?: string;
  State?: string;
  Block?: string;
  Name?: string;
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

  // 1. Primary: Official Postal Pincode API
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4500),
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

        return NextResponse.json({
          pincode: pin,
          district,
          state,
          block: office.Block && office.Block !== "NA" ? office.Block : office.Name,
        });
      }
    }
  } catch {
    // Proceed to secondary fallback
  }

  // 2. Secondary: Zippopotam API
  try {
    const zipRes = await fetch(`https://api.zippopotam.us/in/${pin}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3500),
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
        return NextResponse.json({
          pincode: pin,
          district,
          state,
          block: place["place name"],
        });
      }
    }
  } catch {
    // Proceed to tertiary fallback
  }

  // 3. Tertiary: Offline Postal Circle Fallback (never leaves farmer stranded)
  const offline = getOfflinePincodeFallback(pin);
  if (offline) {
    return NextResponse.json(offline);
  }

  return NextResponse.json({ error: "PIN not found" }, { status: 404 });
}
