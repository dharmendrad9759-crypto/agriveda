export interface PincodeResult {
  pincode: string;
  district: string;
  state: string;
  block?: string;
}

export async function lookupPincode(pin: string): Promise<PincodeResult | null> {
  const cleaned = pin.replace(/\D/g, "").slice(0, 6);
  if (cleaned.length !== 6) return null;

  try {
    const res = await fetch(`/api/geo/pincode?pin=${cleaned}`);
    if (!res.ok) return null;
    const body = (await res.json()) as PincodeResult;
    if (!body.district || !body.state) return null;
    return body;
  } catch {
    return null;
  }
}

/** Match india-locations state name (title case). */
export function normalizePincodeState(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function normalizePincodeDistrict(raw: string): string {
  return raw.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}
