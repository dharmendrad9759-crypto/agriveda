/**
 * Farmer-facing irrigation wording — short Hindi, drop jargon where possible.
 */

function replaceAll(text: string, pairs: [RegExp | string, string][]): string {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.replace(from, to);
  }
  return out;
}

const HI_REPLACEMENTS: [RegExp | string, string][] = [
  [/\bDAT\b/gi, "रोपाई के दिन"],
  [/\bDAS\b/gi, "बुवाई के दिन"],
  [/Alternate Wetting\s*&\s*Drying/gi, "सूखा–गीला तरीका"],
  [/\bAWD\b/g, "सूखा–गीला"],
  [/\bPI[–\-]?फ्लावरिंग\b/gi, "गभोट और फूल"],
  [/\bPI\b/g, "गभोट"],
  [/BPH\/WBPH/gi, "भूरा फुदका"],
  [/If rain fails/gi, "बारिश कम हो तो"],
  [/Light irrigation/gi, "हल्की सिंचाई"],
  [/Heavy irrigation/gi, "ज़्यादा पानी"],
  [/Stop irrigation/gi, "पानी बंद करें"],
  [/Daily light/gi, "रोज़ हल्का पानी"],
  [/Drip\s*\/\s*frequent/gi, "ड्रिप या बार-बार हल्का पानी"],
  [/Every\s*5[\s–-]*7\s*days/gi, "हर 5–7 दिन"],
  [/Every\s*7\s*days/gi, "हर 7 दिन"],
  [/Germination/gi, "अंकुरण"],
  [/Grand growth/gi, "तेज़ वृद्धि"],
  [/Vegetative/gi, "पत्ती-तने की अवस्था"],
  [/Tuber bulking/gi, "कंद बढ़ना"],
  [/Pre-harvest/gi, "कटाई से पहले"],
  [/Planting/gi, "बुवाई"],
  [/pegging/gi, "गाँठ बनने पर"],
  [/pod fill(ing)?/gi, "फली भरना"],
  [/flowering/gi, "फूल आना"],
  [/Critical for pod fill/gi, "फली भरने के लिए बहुत ज़रूरी"],
  [/irrigation/gi, "सिंचाई"],
  [/waterlogging/gi, "जलभराव"],
  [/\bmm\b/gi, "मिमी"],
  [/\bacre\b/gi, "एकड़"],
  [/\bha\b/gi, "हेक्टर"],
];

export function simplifyIrrigationLineHi(line: string): string {
  return replaceAll(line, HI_REPLACEMENTS).replace(/\s+/g, " ").trim();
}

export function simplifyWaterNeedHi(text: string): string {
  const t = simplifyIrrigationLineHi(text);
  if (/^\d/.test(t) || /मिमी|mm/i.test(t)) {
    return `पूरे मौसम में करीब ${t.replace(/about |typically |≈/gi, "").trim()} पानी लगता है (बारिश + सिंचाई मिलाकर)।`;
  }
  if (/हल्की|बार-बार|ज़रूरी|सिंचाई/.test(t)) {
    return t.endsWith("।") ? t : `${t}।`;
  }
  return `${t} — बारिश कम हो तो इन समय पर पानी दें।`;
}

export function simplifyCriticalStageHi(stage: string): string {
  return simplifyIrrigationLineHi(stage)
    .replace(/पेगिंग/gi, "गाँठ बनने पर")
    .replace(/पेग प्रवेश/gi, "गाँठ ज़मीन में जाने पर");
}

export function formatIrrigationStepHi(step: {
  label?: string;
  amount?: string;
  timing?: string;
  notes?: string;
}): string {
  const when = simplifyIrrigationLineHi(step.timing ?? "");
  const what = simplifyIrrigationLineHi(step.amount ?? step.label ?? "");
  const note = step.notes ? simplifyIrrigationLineHi(step.notes) : "";
  if (when && what) {
    return note ? `${when}: ${what} — ${note}` : `${when}: ${what}`;
  }
  return what || when || note;
}
