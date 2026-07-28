import { CROP_TIMING, getEstablishment } from "@/data/crop-detail-timing";

/** Parse free-form fertilizer spray lines into farmer-readable fields */

export type SprayAdvice = {
  raw: string;
  name: string;
  /** e.g. DAS 20–25, DAT 10, फल लगते समय */
  timing: string;
  /** e.g. 2–3 kg/acre, 2 g/L */
  dose: string;
  /** e.g. 150–200 L पानी / acre */
  water: string;
};

function defaultRef(cropSlug?: string): "DAS" | "DAT" {
  if (!cropSlug) return "DAS";
  return getEstablishment(cropSlug) === "transplant" ? "DAT" : "DAS";
}

/** Match CROP_TIMING foliar/micro rows to a free-text spray line */
function timingFromCropPack(raw: string, cropSlug?: string, isHi = false): string | null {
  if (!cropSlug) return null;
  const pack = CROP_TIMING[cropSlug];
  if (!pack) return null;
  const key = raw.toLowerCase();
  const hit = pack.fertilizers.find((f) => {
    const label = f.label.toLowerCase();
    const dose = f.dose.toLowerCase();
    if (/foliar|micronutrient|spray|zinc|boron|calcium|fe|zn|borax/i.test(label + dose)) {
      const tokens = raw.toLowerCase().split(/[\s,/()+-]+/).filter((t) => t.length > 2);
      return tokens.some((t) => label.includes(t) || dose.includes(t) || key.includes(label.slice(0, 8)));
    }
    return false;
  });
  if (hit?.timing) return hit.timing;
  if (/fruit set|flowering|fruiting|flower|फल|फूल/i.test(raw)) {
    const stage = pack.fertilizers.find((f) => /flower|fruit|foliar/i.test(f.label));
    if (stage?.timing) return stage.timing;
  }
  return isHi ? null : null;
}

const TIMING_RE =
  /\b(DAS|DAT|DAP)\s*[:\-]?\s*(\d+\s*[–\-to]+\s*\d+|\d+)/i;
const EVERY_DAYS_RE = /every\s+(\d+)\s*days?/i;
const DURING_RE = /during\s+([^,.]+)/i;
const DOSE_ACRE_RE =
  /(\d+(?:\.\d+)?\s*[–\-]\s*\d+(?:\.\d+)?|\d+(?:\.\d+)?)\s*(kg|g|ml|l|litre|liter)s?\s*\/?\s*(acre|ha)?/i;
const DOSE_PER_L_RE =
  /(\d+(?:\.\d+)?\s*[–\-]\s*\d+(?:\.\d+)?|\d+(?:\.\d+)?)\s*(g|ml|%)\s*\/\s*(?:L|litre|liter|लीटर)/i;

function stripDoseAndTiming(s: string): string {
  return s
    .replace(TIMING_RE, "")
    .replace(EVERY_DAYS_RE, "")
    .replace(DURING_RE, "")
    .replace(DOSE_ACRE_RE, "")
    .replace(DOSE_PER_L_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-–—,]+|[\s\-–—,]+$/g, "")
    .trim();
}

export function parseSprayAdvice(raw: string, isHi = false, cropSlug?: string): SprayAdvice {
  const text = raw.trim();
  const timingMatch = text.match(TIMING_RE);
  const everyMatch = text.match(EVERY_DAYS_RE);
  const duringMatch = text.match(DURING_RE);
  const perL = text.match(DOSE_PER_L_RE);
  const perAcre = text.match(DOSE_ACRE_RE);
  const ref = defaultRef(cropSlug);

  let timing = isHi ? `जरूरत पर (${ref})` : `As needed (${ref})`;
  const fromPack = timingFromCropPack(text, cropSlug, isHi);
  if (timingMatch) {
    timing = `${timingMatch[1].toUpperCase()} ${timingMatch[2].replace(/\s*to\s*/i, "–").replace(/\s+/g, "")}`;
  } else if (fromPack) {
    timing = fromPack;
  } else if (everyMatch) {
    timing = isHi ? `हर ${everyMatch[1]} दिन` : `Every ${everyMatch[1]} days`;
  } else if (duringMatch) {
    timing = `${duringMatch[1].trim()} (${ref})`;
  }

  let dose = isHi ? "मात्रा पैक पर देखें" : "See pack label";
  let water = isHi ? "150–200 L पानी / एकड़" : "150–200 L water / acre";

  if (perL) {
    dose = `${perL[1]} ${perL[2]}/L`;
    water = isHi ? "150–200 L पानी / एकड़ में घोलें" : "Mix in 150–200 L water / acre";
  } else if (perAcre) {
    const unit = (perAcre[2] || "kg").toLowerCase();
    const area = (perAcre[3] || "acre").toLowerCase();
    dose = `${perAcre[1]} ${unit}/${area === "ha" ? "ha" : "acre"}`;
    if (/spray|foliar|mix|micronutrient/i.test(text)) {
      water = isHi ? "150–200 L पानी / एकड़" : "150–200 L water / acre";
    } else {
      water = isHi ? "मिट्टी / बेसल — स्प्रे पानी नहीं" : "Soil / basal — not foliar water";
    }
  }

  const name = stripDoseAndTiming(text) || text;

  return { raw: text, name, timing, dose, water };
}

export function parseSprayList(lines: string[], isHi = false, cropSlug?: string): SprayAdvice[] {
  return lines.filter(Boolean).map((l) => parseSprayAdvice(l, isHi, cropSlug));
}
