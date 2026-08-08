/**
 * Farmer-facing irrigation wording — short Hindi, drop jargon where possible.
 */

export function simplifyIrrigationLineHi(line: string): string {
  return line
    .replace(/\bDAT\b/gi, "रोपाई के दिन")
    .replace(/\bDAS\b/gi, "बुवाई के दिन")
    .replace(/Alternate Wetting\s*&\s*Drying/gi, "सूखा–गीला तरीका")
    .replace(/\bAWD\b/g, "सूखा–गीला (AWD)")
    .replace(/\bPI[–\-]?फ्लावरिंग\b/gi, "गभोट और फूल")
    .replace(/\bPI\b/g, "गभोट")
    .replace(/BPH\/WBPH/gi, "भूरा फुदका")
    .replace(/\bmm\b/gi, "मिमी")
    .replace(/irrigation/gi, "सिंचाई")
    .replace(/waterlogging/gi, "जलभराव")
    .trim();
}

export function simplifyWaterNeedHi(text: string): string {
  const t = simplifyIrrigationLineHi(text);
  if (/^\d/.test(t) || /मिमी|mm/i.test(t)) {
    return `पूरे मौसम में करीब ${t.replace(/about |typically |≈/gi, "").trim()} पानी लगता है (बारिश + सिंचाई मिलाकर)।`;
  }
  return t;
}
