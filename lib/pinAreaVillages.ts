import {
  expandPostalBbox,
  formatVillageLabel,
  hasDevanagari,
  nominatimViewbox,
  parseNominatimBoundingBox,
  splitBboxLatBands,
  uniqueVillageNames,
  villageMatchesPinArea,
  type PostalBbox,
} from "@/lib/pincodeLookup";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "AgrivedaFarmApp/1.0 (farmer-villages)";
const CACHE_NS = "v4";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const FAIL_TTL_MS = 15 * 60 * 1000;

interface NominatimPlace {
  name?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
  boundingbox?: string[];
  namedetails?: Record<string, string>;
}

const memoryCache = new Map<string, { exp: number; villages: string[] }>();

function cacheKey(pin: string, district: string): string {
  return `${CACHE_NS}:${pin}:${district.trim().toLowerCase()}`;
}

function cacheGet(pin: string, district: string): string[] | undefined {
  const hit = memoryCache.get(cacheKey(pin, district));
  if (!hit) return undefined;
  if (Date.now() > hit.exp) {
    memoryCache.delete(cacheKey(pin, district));
    return undefined;
  }
  return hit.villages;
}

function cacheSet(pin: string, district: string, villages: string[], ttl: number) {
  memoryCache.set(cacheKey(pin, district), { exp: Date.now() + ttl, villages });
}

async function nominatimSearch(params: URLSearchParams, timeoutMs: number): Promise<NominatimPlace[]> {
  const res = await fetch(`${NOMINATIM}?${params}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Accept: "application/json",
      // English display_name so district/PIN filters match; name:hi still comes via namedetails.
      "Accept-Language": "en",
      "User-Agent": USER_AGENT,
    },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? (data as NominatimPlace[]) : [];
}

function bboxFromPlace(place: NominatimPlace): PostalBbox | null {
  const fromBox = parseNominatimBoundingBox(place.boundingbox);
  if (fromBox) return fromBox;
  const lat = Number(place.lat);
  const lon = Number(place.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    south: lat - 0.05,
    north: lat + 0.05,
    west: lon - 0.05,
    east: lon + 0.05,
  };
}

function labelFromPlace(place: NominatimPlace): string {
  const details = place.namedetails ?? {};
  const rawName = (place.name || "").trim();
  const english =
    details.name && !hasDevanagari(details.name)
      ? details.name
      : rawName && !hasDevanagari(rawName)
        ? rawName
        : "";
  const hindi =
    details["name:hi"] ||
    (rawName && hasDevanagari(rawName) ? rawName : "") ||
    (details.name && hasDevanagari(details.name) ? details.name : "");
  return formatVillageLabel(english, hindi);
}

export function villagesFromNominatimPlaces(
  places: NominatimPlace[],
  opts: { pin: string; district: string }
): string[] {
  const names: string[] = [];
  for (const place of places) {
    const display = place.display_name || "";
    if (!villageMatchesPinArea(display, opts)) continue;
    const label = labelFromPlace(place);
    if (label) names.push(label);
  }
  return uniqueVillageNames(names);
}

async function geocodePincode(pin: string): Promise<PostalBbox | null> {
  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    countrycodes: "in",
    postalcode: pin,
  });
  const places = await nominatimSearch(params, 6000);
  const place = places[0];
  return place ? bboxFromPlace(place) : null;
}

async function searchBand(bbox: PostalBbox, query: string): Promise<NominatimPlace[]> {
  const params = new URLSearchParams({
    format: "json",
    countrycodes: "in",
    addressdetails: "0",
    namedetails: "1",
    limit: "50",
    dedupe: "0",
    bounded: "1",
    viewbox: nominatimViewbox(bbox),
    featureType: "settlement",
    q: query,
  });
  return nominatimSearch(params, 8000);
}

/** OSM census villages around a PIN — post offices alone miss places like Bhogpur. */
export async function fetchPinAreaVillages(
  pin: string,
  opts: { district: string }
): Promise<string[]> {
  const cached = cacheGet(pin, opts.district);
  if (cached) return cached;

  try {
    const bbox = await geocodePincode(pin);
    if (!bbox) {
      cacheSet(pin, opts.district, [], FAIL_TTL_MS);
      return [];
    }
    const expanded = expandPostalBbox(bbox, 0.06);
    const [southBand, northBand] = splitBboxLatBands(expanded);
    const [south, southPur, north] = await Promise.all([
      searchBand(southBand, "village"),
      searchBand(southBand, "pur"),
      searchBand(northBand, "village"),
    ]);
    const villages = villagesFromNominatimPlaces([...south, ...southPur, ...north], {
      pin,
      district: opts.district,
    });
    cacheSet(pin, opts.district, villages, villages.length ? CACHE_TTL_MS : FAIL_TTL_MS);
    return villages;
  } catch {
    cacheSet(pin, opts.district, [], FAIL_TTL_MS);
    return [];
  }
}
