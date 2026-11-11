import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { INDIAN_STATES, getDistrictsForState } from "@/lib/india-locations";
import { isFarmerPlaceName } from "@/lib/farmerPlaceName";
import { matchStateName } from "@/lib/farm/placeProfile";

export const runtime = "nodejs";

function matchState(raw?: string | null): string {
  if (!raw) return "";
  const byName = matchStateName(raw, INDIAN_STATES);
  if (byName) return byName;
  const n = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const hit = INDIAN_STATES.find(
    (s) => n === s.toLowerCase() || n.includes(s.toLowerCase()) || s.toLowerCase().includes(n)
  );
  return hit ?? "";
}

/** Hindi names Nominatim returns when the response language is Hindi. */
const HI_DISTRICT: Record<string, string> = {
  "अलीगढ़": "Aligarh",
  "मथुरा": "Mathura",
  "आगरा": "Agra",
  "मेरठ": "Meerut",
  "हाथरस": "Hathras",
  "एटा": "Etah",
  "बुलंदशहर": "Bulandshahr",
  "गाजियाबाद": "Ghaziabad",
  "गौतम बुद्ध नगर": "Gautam Buddha Nagar",
  "बागपत": "Baghpat",
  "हापुड़": "Hapur",
  "मुजफ्फरनगर": "Muzaffarnagar",
  "सहारनपुर": "Saharanpur",
  "शामली": "Shamli",
  "बिजनौर": "Bijnor",
  "मुरादाबाद": "Moradabad",
  "अमरोहा": "Amroha",
  "संभल": "Sambhal",
  "रामपुर": "Rampur",
  "बरेली": "Bareilly",
  "पीलीभीत": "Pilibhit",
  "फिरोजाबाद": "Firozabad",
  "मैनपुरी": "Mainpuri",
  "कासगंज": "Kasganj",
  "इटावा": "Etawah",
  "जोधपुर": "Jodhpur",
  "बीकानेर": "Bikaner",
  "जयपुर": "Jaipur",
  "लखनऊ": "Lucknow",
  "वाराणसी": "Varanasi",
  "कानपुर": "Kanpur Nagar",
};

function resolveDistrict(state: string, raw: string): string {
  const cleaned = raw.replace(/जिला|ज़िला|district/gi, " ").replace(/\s+/g, " ").trim();
  const direct = matchDistrict(state, cleaned) || matchDistrict(state, raw);
  if (direct) return direct;
  const alias = HI_DISTRICT[cleaned];
  return alias ? matchDistrict(state, alias) || alias : "";
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
  const rl = await rateLimit(`geo-reverse:${ip}`, 30, 60_000);
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
  let villageRaw = "";
  let displayName = "";

  try {
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=16&accept-language=hi,en`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "hi,en",
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
          hamlet?: string;
          locality?: string;
          suburb?: string;
          neighbourhood?: string;
        };
      };
      displayName = data.display_name ?? "";
      const address = data.address ?? {};
      stateRaw = address.state ?? "";
      districtRaw = address.state_district || address.county || address.district || "";
      villageRaw =
        address.village ||
        address.hamlet ||
        address.locality ||
        address.suburb ||
        address.neighbourhood ||
        address.town ||
        "";
    }

    if (!stateRaw && owKey) {
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
          stateRaw = hit.state ?? "";
          districtRaw = districtRaw || hit.name || "";
          displayName =
            displayName || [hit.name, hit.state, hit.country].filter(Boolean).join(", ");
        }
      }
    }
  } catch {
    return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
  }

  const state = matchState(stateRaw);
  const district = resolveDistrict(state, districtRaw);
  const villageName = villageRaw.trim();
  const village =
    isFarmerPlaceName(villageName) &&
    villageName.toLowerCase() !== district.toLowerCase()
      ? villageName
      : "";

  return NextResponse.json({
    lat,
    lon,
    state,
    district,
    village,
    stateRaw,
    districtRaw,
    displayName,
  });
}
