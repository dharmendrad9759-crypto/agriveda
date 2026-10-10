/**
 * Farmer-facing spray line helpers: hide MoA codes, show dose as ml/g per litre water.
 * Acre→per-L uses standard knapsack volume ~200 L/acre (common field guide assumption).
 */

import { applyBilingualAgriNames, bilingualAgriName } from "@/lib/crops/bilingualAgriName";

export const FARMER_SPRAY_L_PER_ACRE = 200;

export function stripMoaCodes(text: string): string {
  return text
    .replace(/\([^)]*(?:IRAC|FRAC|HRAC)[^)]*\)/gi, " ")
    .replace(/\b(?:IRAC|FRAC|HRAC)\s*(?:समूह|group)?\s*[0-9A-Za-z./→>\-\s]*/gi, " ")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([,;])\s*/g, "$1 ")
    .replace(/\s*[—–·•|-]+\s*$/g, "")
    .trim();
}

function fmtQty(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 10) return String(Math.round(n * 10) / 10).replace(/\.0$/, "");
  if (n >= 1) return (Math.round(n * 10) / 10).toString().replace(/\.0$/, "");
  return (Math.round(n * 100) / 100)
    .toFixed(2)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

function perLLabel(amount: number, unit: "ml" | "g", hi: boolean): string {
  const q = fmtQty(amount / FARMER_SPRAY_L_PER_ACRE);
  if (!q) return "";
  const acreAmt = fmtQty(amount);
  return hi
    ? `${q} ${unit}/लीटर पानी (${acreAmt} ${unit}/एकड़ — 150–200 L पानी)`
    : `${q} ${unit}/L water (${acreAmt} ${unit}/acre — 150–200 L water)`;
}

function perLRange(a: number, b: number, unit: "ml" | "g", hi: boolean): string {
  const qa = fmtQty(a / FARMER_SPRAY_L_PER_ACRE);
  const qb = fmtQty(b / FARMER_SPRAY_L_PER_ACRE);
  if (!qa || !qb) return "";
  const acreA = fmtQty(a);
  const acreB = fmtQty(b);
  return hi
    ? `${qa}–${qb} ${unit}/लीटर पानी (${acreA}–${acreB} ${unit}/एकड़ — 150–200 L पानी)`
    : `${qa}–${qb} ${unit}/L water (${acreA}–${acreB} ${unit}/acre — 150–200 L water)`;
}

/** Find dose token in a line and convert acre/bare ml|g → per litre with water requirement. */
function replaceDoseWithPerL(text: string, hi: boolean): string {
  // If already has per-litre and acre/water, leave it
  if (/(?:\/\s*l\b|\/\s*लीटर|प्रति\s*लीटर|ml\/l|g\/l)/i.test(text) && /(?:एकड़|acre|लीटर\s*पानी)/i.test(text)) {
    return text;
  }

  // If already per litre but missing acre/water, append standard acre volume
  if (/(?:\/\s*l\b|\/\s*लीटर|प्रति\s*लीटर|ml\/l|g\/l)/i.test(text) && !/(?:एकड़|acre)/i.test(text)) {
    const m = text.match(/(\d+(?:\.\d+)?)\s*(ml|g|मिली|ग्राम)/i);
    if (m) {
      const perL = Number(m[1]);
      const perAcreMin = fmtQty(perL * 150);
      const perAcreMax = fmtQty(perL * 200);
      const u = m[2];
      return hi
        ? `${text} (${perAcreMin}–${perAcreMax} ${u}/एकड़ — 150–200 लीटर पानी)`
        : `${text} (${perAcreMin}–${perAcreMax} ${u}/acre — 150–200 L water)`;
    }
    return hi ? `${text} (150–200 लीटर पानी प्रति एकड़)` : `${text} (150–200 L water/acre)`;
  }

  // Range: 60–80 ml/acre | 60-80 ml | 60 to 80 g/acre
  const rangeRe =
    /(~?\s*)(\d+(?:\.\d+)?)\s*[\u2013\u2014\-−~]+\s*(\d+(?:\.\d+)?)\s*(ml|g)\b(?:\s*\/?\s*(?:acre|ha))?/i;
  const range = text.match(rangeRe);
  if (range && range.index != null) {
    const unit = range[4].toLowerCase() as "ml" | "g";
    let lo = Number(range[2]);
    let hiAmt = Number(range[3]);
    if (/\/\s*ha/i.test(range[0])) {
      lo /= 2.47;
      hiAmt /= 2.47;
    }
    const label = perLRange(lo, hiAmt, unit, hi);
    if (label) {
      return `${text.slice(0, range.index).trimEnd()} · ${label}${text.slice(range.index + range[0].length)}`
        .replace(/\s{2,}/g, " ")
        .trim();
    }
  }

  // Single: ~400 ml | 80 g | 250 g/acre | 200 ml/ha
  const singleRe = /(~?\s*)(\d+(?:\.\d+)?)\s*(ml|g)\b(?:\s*\/?\s*(?:acre|ha))?/i;
  const single = text.match(singleRe);
  if (single && single.index != null) {
    const unit = single[3].toLowerCase() as "ml" | "g";
    let amt = Number(single[2]);
    if (/\/\s*ha/i.test(single[0])) amt /= 2.47;
    const label = perLLabel(amt, unit, hi);
    if (label) {
      return `${text.slice(0, single.index).trimEnd()} · ${label}${text.slice(single.index + single[0].length)}`
        .replace(/\s{2,}/g, " ")
        .trim();
    }
  }

  return text;
}

/**
 * Rewrite a chemicalControl line for farmers:
 * strip IRAC/FRAC and put dose as ml or g per litre water.
 */
export function formatFarmerChemicalLine(line: string, hi = true): string {
  const cleaned = stripMoaCodes(line);
  if (!cleaned) return line;
  const withDose = replaceDoseWithPerL(cleaned, hi);
  return hi ? applyBilingualAgriNames(withDose) : withDose;
}

/** Format product + dose fields without MoA jargon. */
export function formatFarmerDoseSummary(
  activeIngredient: string,
  dose: string,
  hi = true
): string {
  const aiRaw = stripMoaCodes(activeIngredient);
  const ai = hi ? bilingualAgriName(aiRaw) : aiRaw;
  const dRaw = stripMoaCodes(dose);
  const d = dRaw ? formatFarmerChemicalLine(dRaw, hi) : "";
  if (!ai) return d || (hi ? "लेबल अनुसार" : "Follow label");
  if (!d || /^लेबल/i.test(dRaw)) {
    return `${ai} · ${hi ? "लेबल खुराक / लीटर पानी" : "label dose / L water"}`;
  }
  if (!/\d/.test(d)) {
    return hi
      ? `${ai} · ${d} (~${FARMER_SPRAY_L_PER_ACRE} लीटर पानी/एकड़)`
      : `${ai} · ${d} (~${FARMER_SPRAY_L_PER_ACRE} L water/acre)`;
  }
  return `${ai} · ${d}`;
}

export function formatFarmerChemicalList(lines: string[] | undefined, hi = true): string[] {
  if (!lines?.length) return [];
  return lines.map((l) => formatFarmerChemicalLine(l, hi)).filter(Boolean);
}
