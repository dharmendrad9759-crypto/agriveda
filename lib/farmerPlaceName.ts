/** Drop GPS fragments and junk reverse-geocode labels before they hit the header. */

const DEVANAGARI = /[\u0900-\u097F]/;
const VOWEL = /[aeiou]/i;

export function isFarmerPlaceName(raw: string | null | undefined): boolean {
  const s = (raw ?? "").replace(/\s+/g, " ").trim();
  if (s.length < 3 || s.length > 48) return false;
  if (/[+@#]/.test(s) || /\d/.test(s)) return false;
  if (/(.)\1\1/i.test(s)) return false;
  if (DEVANAGARI.test(s)) return /[\u0905-\u0939]/.test(s);
  if (!VOWEL.test(s)) return false;
  return /^[A-Za-z][A-Za-z .'-]*$/.test(s);
}

export function farmerPlaceLine(parts: {
  village?: string | null;
  district?: string | null;
  state?: string | null;
}): { short: string; full: string; ok: boolean } {
  const village = isFarmerPlaceName(parts.village) ? parts.village!.trim() : "";
  const district = isFarmerPlaceName(parts.district) ? parts.district!.trim() : "";
  const state = isFarmerPlaceName(parts.state) ? parts.state!.trim() : "";
  const head = village || district;
  const full = [head, state].filter(Boolean).join(", ");
  return { short: head || state, full, ok: Boolean(full) };
}
