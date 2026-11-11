import { STATE_DISTRICTS, INDIAN_STATES } from "@/lib/india-locations";

export interface PincodeResult {
  pincode: string;
  district: string;
  state: string;
  block?: string;
  /** Post offices / villages under this PIN */
  villages?: string[];
}

const DEVANAGARI_RE = /[\u0900-\u097F]/;

/** Strip GPO/SO/BO suffixes so farmers see the गाँव name. */
export function cleanPostOfficeVillage(raw?: string | null): string {
  if (!raw) return "";
  let name = raw.trim().replace(/\s+/g, " ");
  if (!name || /^na$/i.test(name)) return "";
  name = name
    .replace(/\s*\((?:g\.?\s*p\.?\s*o\.?|h\.?\s*o\.?|s\.?\s*o\.?|b\.?\s*o\.?)\)\s*$/i, "")
    .replace(/\s+(?:G\.?\s*P\.?\s*O\.?|GPO|H\.?O\.?|S\.?O\.?|B\.?O\.?)$/i, "")
    .trim();
  return name;
}

export function hasDevanagari(value: string): boolean {
  return DEVANAGARI_RE.test(value);
}

/** Latin core so "भोगपुर (Bhogpur)" and "Bhogpur" collapse to one chip. */
export function villageMergeKey(name: string): string {
  const cleaned = cleanPostOfficeVillage(name);
  if (!cleaned) return "";
  const latin = cleaned
    .match(/[A-Za-z][A-Za-z0-9\s'.-]*/g)
    ?.join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return latin || cleaned.toLowerCase();
}

export function formatVillageLabel(english?: string | null, hindi?: string | null): string {
  const en = cleanPostOfficeVillage(english);
  const hi = cleanPostOfficeVillage(hindi);
  if (hi && en && hi.toLowerCase() !== en.toLowerCase()) return `${hi} (${en})`;
  return hi || en;
}

function villageTokens(name: string): string[] {
  const cleaned = cleanPostOfficeVillage(name);
  if (!cleaned) return [];
  const tokens = new Set<string>([cleaned.toLowerCase()]);
  const latin = cleaned.match(/[A-Za-z][A-Za-z0-9\s'.-]*/g) ?? [];
  for (const part of latin) {
    const token = part.replace(/\s+/g, " ").trim().toLowerCase();
    if (token) tokens.add(token);
  }
  const hindi = cleaned.match(/[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*/g) ?? [];
  for (const part of hindi) {
    const token = part.trim();
    if (token) tokens.add(token);
  }
  return [...tokens];
}

export function villageNamesMatch(a: string, b: string): boolean {
  const left = villageTokens(a);
  const right = new Set(villageTokens(b));
  if (!left.length || !right.size) return false;
  return left.some((token) => right.has(token));
}

function pickPreferredVillageLabel(candidates: string[]): string {
  const unique = [...new Set(candidates.map((item) => cleanPostOfficeVillage(item)).filter(Boolean))];
  return unique.find((item) => hasDevanagari(item)) || unique[0] || "";
}

export function uniqueVillageNames(names: Array<string | undefined | null>): string[] {
  const groups = new Map<string, string[]>();
  for (const raw of names) {
    const cleaned = cleanPostOfficeVillage(raw);
    if (!cleaned) continue;
    const key = villageMergeKey(cleaned);
    const bucket = groups.get(key) ?? [];
    bucket.push(cleaned);
    groups.set(key, bucket);
  }
  return [...groups.values()]
    .map(pickPreferredVillageLabel)
    .filter(Boolean)
    .sort((a, b) => villageMergeKey(a).localeCompare(villageMergeKey(b), "en"));
}

export interface PostalBbox {
  south: number;
  north: number;
  west: number;
  east: number;
}

/** Nominatim boundingbox is [south, north, west, east]. */
export function parseNominatimBoundingBox(box?: Array<string | number> | null): PostalBbox | null {
  if (!box || box.length < 4) return null;
  const south = Number(box[0]);
  const north = Number(box[1]);
  const west = Number(box[2]);
  const east = Number(box[3]);
  if (![south, north, west, east].every(Number.isFinite)) return null;
  return { south, north, west, east };
}

export function expandPostalBbox(bbox: PostalBbox, padDeg = 0.06): PostalBbox {
  return {
    south: bbox.south - padDeg,
    north: bbox.north + padDeg,
    west: bbox.west - padDeg,
    east: bbox.east + padDeg,
  };
}

export function splitBboxLatBands(bbox: PostalBbox): [PostalBbox, PostalBbox] {
  const mid = (bbox.south + bbox.north) / 2;
  return [
    { ...bbox, north: mid },
    { ...bbox, south: mid },
  ];
}

/** Nominatim viewbox = left,top,right,bottom */
export function nominatimViewbox(bbox: PostalBbox): string {
  return `${bbox.west},${bbox.north},${bbox.east},${bbox.south}`;
}

export function villageMatchesPinArea(
  displayName: string,
  opts: { pin: string; district: string }
): boolean {
  const hay = displayName.toLowerCase();
  if (!hay.trim()) return false;
  if (opts.pin && hay.includes(opts.pin)) return true;
  const district = opts.district.trim().toLowerCase();
  return Boolean(district && hay.includes(district));
}

const STATE_ALIASES: Record<string, string> = {
  "nct of delhi": "Delhi",
  "new delhi": "Delhi",
  delhi: "Delhi",
  orissa: "Odisha",
  uttaranchal: "Uttarakhand",
  pondicherry: "Puducherry",
  "jammu & kashmir": "Jammu and Kashmir",
  "jammu and kashmir": "Jammu and Kashmir",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
  "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "dadra & nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "andaman & nicobar islands": "Andaman and Nicobar Islands",
};

const DISTRICT_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru Urban",
  "bangalore urban": "Bengaluru Urban",
  "bangalore rural": "Bengaluru Rural",
  bengaluru: "Bengaluru Urban",
  mysore: "Mysuru",
  belgaum: "Belagavi",
  bellary: "Ballari",
  gulbarga: "Kalaburagi",
  bijapur: "Vijayapura",
  shimoga: "Shivamogga",
  chikmagalur: "Chikkamagaluru",
  tumkur: "Tumakuru",
  mangalore: "Dakshina Kannada",
  gurgaon: "Gurugram",
  mewat: "Nuh",
  allahabad: "Prayagraj",
  faizabad: "Ayodhya",
  firozpur: "Ferozepur",
  calicut: "Kozhikode",
  cochin: "Ernakulam",
  trivandrum: "Thiruvananthapuram",
  trichur: "Thrissur",
  madras: "Chennai",
  baroda: "Vadodara",
  ahmedabad: "Ahmedabad",
  benares: "Varanasi",
  cawnpore: "Kanpur Nagar",
  bombay: "Mumbai",
  poona: "Pune",
};

// 2-digit PIN prefix fallback mapping (all Indian Postal Circles)
const PIN_PREFIX_MAP: Record<string, { state: string; district: string }> = {
  "11": { state: "Delhi", district: "New Delhi" },
  "12": { state: "Haryana", district: "Gurugram" },
  "13": { state: "Haryana", district: "Ambala" },
  "14": { state: "Punjab", district: "Ludhiana" },
  "15": { state: "Punjab", district: "Bathinda" },
  "16": { state: "Punjab", district: "Rupnagar" },
  "17": { state: "Himachal Pradesh", district: "Shimla" },
  "18": { state: "Jammu and Kashmir", district: "Jammu" },
  "19": { state: "Jammu and Kashmir", district: "Srinagar" },
  "20": { state: "Uttar Pradesh", district: "Aligarh" },
  "21": { state: "Uttar Pradesh", district: "Prayagraj" },
  "22": { state: "Uttar Pradesh", district: "Lucknow" },
  "23": { state: "Uttar Pradesh", district: "Varanasi" },
  "24": { state: "Uttarakhand", district: "Dehradun" },
  "25": { state: "Uttar Pradesh", district: "Meerut" },
  "26": { state: "Uttar Pradesh", district: "Bareilly" },
  "27": { state: "Uttar Pradesh", district: "Gorakhpur" },
  "28": { state: "Uttar Pradesh", district: "Agra" },
  "30": { state: "Rajasthan", district: "Jaipur" },
  "31": { state: "Rajasthan", district: "Udaipur" },
  "32": { state: "Rajasthan", district: "Kota" },
  "33": { state: "Rajasthan", district: "Bikaner" },
  "34": { state: "Rajasthan", district: "Jodhpur" },
  "36": { state: "Gujarat", district: "Rajkot" },
  "37": { state: "Gujarat", district: "Kachchh" },
  "38": { state: "Gujarat", district: "Ahmedabad" },
  "39": { state: "Gujarat", district: "Surat" },
  "40": { state: "Maharashtra", district: "Mumbai" },
  "41": { state: "Maharashtra", district: "Pune" },
  "42": { state: "Maharashtra", district: "Nashik" },
  "43": { state: "Maharashtra", district: "Chhatrapati Sambhajinagar" },
  "44": { state: "Maharashtra", district: "Nagpur" },
  "45": { state: "Madhya Pradesh", district: "Indore" },
  "46": { state: "Madhya Pradesh", district: "Bhopal" },
  "47": { state: "Madhya Pradesh", district: "Gwalior" },
  "48": { state: "Madhya Pradesh", district: "Jabalpur" },
  "49": { state: "Chhattisgarh", district: "Raipur" },
  "50": { state: "Telangana", district: "Hyderabad" },
  "51": { state: "Andhra Pradesh", district: "Tirupati" },
  "52": { state: "Andhra Pradesh", district: "Guntur" },
  "53": { state: "Andhra Pradesh", district: "Visakhapatnam" },
  "56": { state: "Karnataka", district: "Bengaluru Urban" },
  "57": { state: "Karnataka", district: "Mysuru" },
  "58": { state: "Karnataka", district: "Dharwad" },
  "59": { state: "Karnataka", district: "Belagavi" },
  "60": { state: "Tamil Nadu", district: "Chennai" },
  "61": { state: "Tamil Nadu", district: "Thanjavur" },
  "62": { state: "Tamil Nadu", district: "Madurai" },
  "63": { state: "Tamil Nadu", district: "Salem" },
  "64": { state: "Tamil Nadu", district: "Coimbatore" },
  "67": { state: "Kerala", district: "Kozhikode" },
  "68": { state: "Kerala", district: "Ernakulam" },
  "69": { state: "Kerala", district: "Thiruvananthapuram" },
  "70": { state: "West Bengal", district: "Kolkata" },
  "71": { state: "West Bengal", district: "Howrah" },
  "72": { state: "West Bengal", district: "Purba Medinipur" },
  "73": { state: "West Bengal", district: "Jalpaiguri" },
  "74": { state: "West Bengal", district: "North 24 Parganas" },
  "75": { state: "Odisha", district: "Khordha" },
  "76": { state: "Odisha", district: "Ganjam" },
  "77": { state: "Odisha", district: "Sambalpur" },
  "78": { state: "Assam", district: "Kamrup" },
  "79": { state: "Arunachal Pradesh", district: "Papum Pare" },
  "80": { state: "Bihar", district: "Patna" },
  "81": { state: "Bihar", district: "Bhagalpur" },
  "82": { state: "Jharkhand", district: "Ranchi" },
  "83": { state: "Jharkhand", district: "East Singhbum" },
  "84": { state: "Bihar", district: "Muzaffarpur" },
  "85": { state: "Bihar", district: "Purnia" },
};

// In-memory client cache for fast instant lookups
const clientPinCache = new Map<string, PincodeResult>();

/** Match india-locations state name to exact key in INDIAN_STATES */
export function normalizePincodeState(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (STATE_ALIASES[lower]) return STATE_ALIASES[lower];

  const exact = INDIAN_STATES.find((s) => s.toLowerCase() === lower);
  if (exact) return exact;

  const partial = INDIAN_STATES.find(
    (s) => s.toLowerCase().includes(lower) || lower.includes(s.toLowerCase())
  );
  if (partial) return partial;

  return trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Normalizes and matches district to an exact element of STATE_DISTRICTS[state].
 * Supports calling with (rawDistrict) or (state, rawDistrict, hint).
 */
export function normalizePincodeDistrict(
  stateOrRaw: string,
  rawDistrict?: string,
  hint?: string
): string {
  let state = "";
  let district = "";

  if (rawDistrict === undefined) {
    district = stateOrRaw || "";
  } else {
    state = stateOrRaw || "";
    district = rawDistrict || "";
  }

  const validDistricts = STATE_DISTRICTS[state] || [];
  if (!validDistricts.length) {
    return district.trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const lower = district.trim().toLowerCase();

  // 1. Alias check
  if (DISTRICT_ALIASES[lower]) {
    const target = DISTRICT_ALIASES[lower].toLowerCase();
    const aliasFound = validDistricts.find((d) => d.toLowerCase() === target);
    if (aliasFound) return aliasFound;
  }

  // 2. Exact match
  const exact = validDistricts.find((d) => d.toLowerCase() === lower);
  if (exact) return exact;

  // 3. Clean alphanumeric match
  const cleanD = lower.replace(/[^a-z0-9]/g, "");
  const cleanFound = validDistricts.find(
    (d) => d.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanD
  );
  if (cleanFound) return cleanFound;

  // 4. Word boundary / substring matches (e.g. "Central Delhi" -> "Central")
  const subInDistrict = validDistricts.find((d) => lower.includes(d.toLowerCase()));
  if (subInDistrict) return subInDistrict;

  const districtInSub = validDistricts.find((d) => d.toLowerCase().includes(lower));
  if (districtInSub) return districtInSub;

  // 5. Try block / tehsil / place hint
  if (hint) {
    const hintLower = hint.trim().toLowerCase();
    const hintMatch = validDistricts.find(
      (d) =>
        d.toLowerCase() === hintLower ||
        hintLower.includes(d.toLowerCase()) ||
        d.toLowerCase().includes(hintLower)
    );
    if (hintMatch) return hintMatch;
  }

  return validDistricts[0];
}

/** Offline postal circle fallback based on Indian PIN prefix */
export function getOfflinePincodeFallback(pin: string): PincodeResult | null {
  const cleaned = pin.replace(/\D/g, "").slice(0, 6);
  if (cleaned.length !== 6) return null;

  // 3-digit special checks
  const p3 = cleaned.slice(0, 3);
  if (p3 === "403") return { pincode: cleaned, state: "Goa", district: "North Goa" };
  if (p3 === "605") return { pincode: cleaned, state: "Puducherry", district: "Puducherry" };
  if (p3 === "682") return { pincode: cleaned, state: "Lakshadweep", district: "Lakshadweep" };
  if (p3 === "737") return { pincode: cleaned, state: "Sikkim", district: "East Sikkim" };
  if (p3 === "744") return { pincode: cleaned, state: "Andaman and Nicobar Islands", district: "South Andamans" };
  if (p3 === "793" || p3 === "794") return { pincode: cleaned, state: "Meghalaya", district: "East Khasi Hills" };
  if (p3 === "795") return { pincode: cleaned, state: "Manipur", district: "Imphal West" };
  if (p3 === "796") return { pincode: cleaned, state: "Mizoram", district: "Aizawl" };
  if (p3 === "797") return { pincode: cleaned, state: "Nagaland", district: "Kohima" };
  if (p3 === "799") return { pincode: cleaned, state: "Tripura", district: "West Tripura" };

  // 2-digit circle checks
  const p2 = cleaned.slice(0, 2);
  const match = PIN_PREFIX_MAP[p2];
  if (match) {
    return {
      pincode: cleaned,
      state: match.state,
      district: match.district,
    };
  }

  return null;
}

export async function lookupPincode(pin: string): Promise<PincodeResult | null> {
  const cleaned = pin.replace(/\D/g, "").slice(0, 6);
  if (cleaned.length !== 6) return null;

  if (clientPinCache.has(cleaned)) {
    return clientPinCache.get(cleaned)!;
  }

  try {
    const res = await fetch(`/api/geo/pincode?pin=${cleaned}`);
    if (res.ok) {
      const body = (await res.json()) as PincodeResult;
      if (body.district && body.state) {
        // Ensure state and district match exact system tokens
        const state = normalizePincodeState(body.state);
        const district = normalizePincodeDistrict(state, body.district, body.block);
        const normalized: PincodeResult = {
          pincode: cleaned,
          state,
          district,
          block: body.block,
          villages: uniqueVillageNames(body.villages ?? [body.block]),
        };
        clientPinCache.set(cleaned, normalized);
        return normalized;
      }
    }
  } catch {
    // Network / offline fallback below
  }

  // Graceful offline fallback
  const fallback = getOfflinePincodeFallback(cleaned);
  if (fallback) {
    clientPinCache.set(cleaned, fallback);
  }
  return fallback;
}
