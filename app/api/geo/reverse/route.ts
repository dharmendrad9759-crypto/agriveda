import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { INDIAN_STATES, getDistrictsForState } from "@/lib/india-locations";

export const runtime = "nodejs";

function matchState(raw?: string | null): string {
  if (!raw) return "";
  const n = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const hit = INDIAN_STATES.find(
    (s) => n === s.toLowerCase() || n.includes(s.toLowerCase()) || s.toLowerCase().includes(n)
  );
  return hit ?? "";
}

function matchDistrict(state: string, raw?: string | null): string {
  if (!raw || !state) return "";
  const districts = getDistrictsForState(state);
  const n = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const hit = districts.find(
    (d) => n === d.toLowerCase() || n.includes(d.toLowerCase()) || d.toLowerCase().includes(n)
  );
  return hit ?? "";
}

/** Reverse-geocode GPS → Indian state/district for crop recommendations. */
export async function GET(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`geo-reverse:${ip}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }

  const owKey = process.env.OPENWEATHER_API_KEY?.trim();
  let stateRaw = "";
  let districtRaw = "";
  let displayName = "";

  try {
    if (owKey) {
      const owRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${owKey}`,
        { next: { revalidate: 86400 } }
      );
      if (owRes.ok) {
        const arr = (await owRes.json()) as Array<{
          name?: string;
          state?: string;
          country?: string;
        }>;
        const hit = arr[0];
        if (hit) {
          districtRaw = hit.name ?? "";
          stateRaw = hit.state ?? "";
          displayName = [hit.name, hit.state, hit.country].filter(Boolean).join(", ");
        }
      }
    }

    if (!stateRaw) {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=10`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "AgrivedaFarmApp/1.0 (farmer-location)",
          },
          next: { revalidate: 86400 },
        }
      );
      if (nomRes.ok) {
        const data = (await nomRes.json()) as {
          display_name?: string;
          address?: {
            state?: string;
            state_district?: string;
            county?: string;
            district?: string;
            city?: string;
            town?: string;
            village?: string;
          };
        };
        displayName = data.display_name ?? displayName;
        const a = data.address ?? {};
        stateRaw = a.state ?? stateRaw;
        districtRaw =
          a.state_district || a.county || a.district || a.city || a.town || a.village || districtRaw;
      }
    }
  } catch {
    return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
  }

  const state = matchState(stateRaw);
  const district = matchDistrict(state, districtRaw) || districtRaw;

  return NextResponse.json({
    lat,
    lon,
    state,
    district,
    stateRaw,
    districtRaw,
    displayName,
  });
}
