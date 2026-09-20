/**
 * Farmer-facing irrigation wording — सरल हिंदी, अंग्रेज़ी jargon हटाएँ।
 */

function replaceAll(text: string, pairs: [RegExp | string, string][]): string {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.replace(from, to);
  }
  return out;
}

/** शीर्षक से आगे लगे 1. / 2. हटाएँ — UI खुद नंबर लगाती है */
export function stripLeadingIndex(text: string): string {
  return text.replace(/^\s*\d+\s*[.)、।:-]+\s*/u, "").trim();
}

const ORDINAL_HI: Record<string, string> = {
  "1": "पहली",
  "1st": "पहली",
  first: "पहली",
  "2": "दूसरी",
  "2nd": "दूसरी",
  second: "दूसरी",
  "3": "तीसरी",
  "3rd": "तीसरी",
  third: "तीसरी",
  "4": "चौथी",
  "4th": "चौथी",
  fourth: "चौथी",
  "5": "पाँचवीं",
  "5th": "पाँचवीं",
  fifth: "पाँचवीं",
  "6": "छठी",
  "6th": "छठी",
  sixth: "छठी",
  "7": "सातवीं",
  "7th": "सातवीं",
  "8": "आठवीं",
  "8th": "आठवीं",
  "9": "नौवीं",
  "9th": "नौवीं",
  "10": "दसवीं",
  "10th": "दसवीं",
};

/** 1st / 3rd / 5th+ → पहली / तीसरी / पाँचवीं और आगे */
export function formatIrrigationSequenceHi(seq?: string, index = 0): string {
  if (!seq?.trim()) {
    return `${ORDINAL_HI[String(index + 1)] ?? `${index + 1}वीं`} सिंचाई`;
  }
  const raw = seq.trim();
  // Already Hindi stage name (स्थापना, गभोट, कल्ले…)
  if (/[\u0900-\u097F]/.test(raw) && !/^\d/.test(raw)) {
    return raw;
  }
  const plus = /\+|और|onwards|ahead/i.test(raw);
  const m = raw.match(/(\d+)(st|nd|rd|th)?/i);
  if (m) {
    const key = (m[0] || m[1]).toLowerCase();
    const word =
      ORDINAL_HI[key] ??
      ORDINAL_HI[m[1]] ??
      `${m[1]}वीं`;
    return plus ? `${word} और आगे की सिंचाई` : `${word} सिंचाई`;
  }
  return simplifyIrrigationLineHi(raw);
}

/**
 * "20–25 दिन DAS" → "बुवाई के 20–25 दिन बाद"
 * "0–5 दिन DAT" → "रोपाई के 0–5 दिन बाद"
 */
export function formatIrrigationPeriodHi(period: string): string {
  let t = period.trim();
  t = t
    .replace(
      /(\d+\s*[–\-]\s*\d+|\d+)\s*दिन\s*DAS\b/gi,
      "बुवाई के $1 दिन बाद"
    )
    .replace(
      /(\d+\s*[–\-]\s*\d+|\d+)\s*दिन\s*DAT\b/gi,
      "रोपाई के $1 दिन बाद"
    )
    .replace(
      /(\d+\s*[–\-]\s*\d+|\d+)\s*दिन\s*DAP\b/gi,
      "रोपाई के $1 दिन बाद"
    )
    .replace(/\bDAS\b/gi, "बुवाई के बाद")
    .replace(/\bDAT\b/gi, "रोपाई के बाद")
    .replace(/\bDAP\b/gi, "रोपाई के बाद")
    .replace(
      /(\d+\s*[–\-]\s*\d+|\d+)\s*days?\s*after\s*sowing/gi,
      "बुवाई के $1 दिन बाद"
    )
    .replace(
      /(\d+\s*[–\-]\s*\d+|\d+)\s*days?\s*after\s*transplant/gi,
      "रोपाई के $1 दिन बाद"
    );
  return simplifyIrrigationLineHi(t);
}

const HI_REPLACEMENTS: [RegExp | string, string][] = [
  [/\bV\d+\s*[–\-]\s*V\d+\b/gi, ""],
  [/\bV\d+\b/gi, ""],
  [/\bVT\s*[–\-]\s*R\d+\b/gi, "मूंछ/फूल"],
  [/\bR\d+\s*[–\-]\s*R\d+\b/gi, ""],
  [/\bVT\b/gi, "मूंछ निकलना"],
  [/\bR1\b/gi, "सिल्क / मूंछ"],
  [/\bR2\b/gi, "फूल"],
  [/\bR3\b/gi, "दाना भरना"],
  [/\bR5\b/gi, "फली में दाना भरना"],
  [/\bR6\b/gi, "पकना"],
  [/\bVE\b/gi, "अंकुरण"],
  [/\bCRI\b/gi, "जड़ फूटना"],
  [/\bBER\b/gi, "फल का निचला हिस्सा सड़ना"],
  [/\bcrack(ing)?\b/gi, "फल फटना"],
  [/\bCracking\b/gi, "फल फटना"],
  [/\(\s*फल फटना\s*\)/g, ""],
  [/\(\s*flowering\s*\)/gi, ""],
  [/\(\s*vegetative\s*\)/gi, ""],
  [/\(\s*establishment\s*\)/gi, ""],
  [/\(\s*maturity\s*\)/gi, ""],
  [/\(\s*germination\s*\)/gi, ""],
  [/Para-wilting/gi, "अचानक पानी से झड़ना"],
  [/\bGA3\b/gi, "जिबरेलिक एसिड"],
  [/\bTSS\b/gi, "मिठास"],
  [/\bBrix\b/gi, "मिठास"],
  [/Blossom End Rot/gi, "फल का निचला हिस्सा सड़ना"],
  [/Soft [Rr]ot/gi, "कंद सड़न"],
  [/Rhizome Rot/gi, "कंद सड़न"],
  [/Sheath blight/gi, "तना गलन"],
  [/Downy [Mm]ildew/gi, "झुलसा / फफूंद"],
  [/White [Rr]ust/gi, "सफेद रतुआ"],
  [/Spongy Tissue/gi, "स्पंजी गूदा"],
  [/Choke Throat/gi, "कमल अंदर फंसना"],
  [/Erwinia Rot/gi, "तना सड़न"],
  [/Veraison/gi, "रंग बदलना व मिठास"],
  [/Berry Cracking/gi, "दाना फटना"],
  [/Buttoning/gi, "छोटी गोभी (बटन)"],
  [/Riceyness/gi, "ढीला/पीला फूल"],
  [/Lodging/gi, "फसल गिरना"],
  [/Furrow/gi, "नाली"],
  [/Flood/gi, "बाढ़ विधि"],
  [/Sprinkler/gi, "फव्वारा"],
  [/Ring Basin/gi, "थाला"],
  [/Canopy/gi, "छतरी"],
  [/Drip line/gi, "टपक रेखा"],
  [/\bDrip\b/gi, "ड्रिप"],
  [/\balt\b/gi, "एक दिन छोड़कर"],
  [/रोज\/alt/gi, "रोज़ या एक दिन छोड़कर"],
  [/\/alt\b/gi, " या एक दिन छोड़कर"],
  [/(\d+)\s*–\s*(\d+)\s*d\b/gi, "$1–$2 दिन"],
  [/(\d+)\s*d\b/gi, "$1 दिन"],
  [/\(\s*DAS[^)]*\)/gi, ""],
  [/\(\s*DAT[^)]*\)/gi, ""],
  [/\b\d+\s*[–\-]\s*\d+\s*DAS\b/gi, ""],
  [/\b\d+\s*DAS\b/gi, ""],
  [/\b\d+\s*DAT\b/gi, ""],
  [/\bDAT\b/gi, "रोपाई के बाद"],
  [/\bDAS\b/gi, "बुवाई के बाद"],
  [/\bDAP\b/gi, "रोपाई के बाद"],
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
  [/Vegetative/gi, "बढ़वार अवस्था"],
  [/Tasseling\s*&\s*silking/gi, "मूंछ व भुट्टा"],
  [/Tasseling/gi, "मूंछ निकलना"],
  [/Silking/gi, "मूंछ / सिल्क"],
  [/Moisture\s*stress/gi, "पानी की कमी से नुकसान"],
  [/Tuber bulking/gi, "कंद बढ़ना"],
  [/Pre-harvest/gi, "कटाई से पहले"],
  [/Planting/gi, "बुवाई"],
  [/pegging/gi, "गाँठ बनने पर"],
  [/pod fill(ing)?/gi, "फली भरना"],
  [/flowering/gi, "फूल आना"],
  [/Establishment/gi, "स्थापना"],
  [/Fruit Bulking/gi, "फल बढ़ना"],
  [/Picking Phase/gi, "तुड़ाई का दौर"],
  [/Critical for pod fill/gi, "फली भरने के लिए बहुत ज़रूरी"],
  [/irrigation/gi, "सिंचाई"],
  [/waterlogging/gi, "जलभराव"],
  [/\bmm\b/gi, "मिमी"],
  [/\bacre\b/gi, "एकड़"],
  [/\bha\b/gi, "हेक्टर"],
  [/के अनुसार/gi, "के हिसाब से"],
];

export function simplifyIrrigationLineHi(line: string): string {
  return replaceAll(line, HI_REPLACEMENTS)
    .replace(/\(जड़ फूटना\s*[-–—]\s*/g, "(")
    .replace(/\([A-Za-z0-9\s\-–—/&.,+%'’]+\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;।])/g, "$1")
    .replace(/[·\-–—]\s*$/g, "")
    .trim();
}

/** UI पर दिखाने वाली पूरी लाइन — सरल हिंदी */
export function farmerIrrigationHi(text: string): string {
  return simplifyIrrigationLineHi(stripLeadingIndex(text));
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
