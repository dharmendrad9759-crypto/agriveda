/** Farmer-facing safety copy. Do not invent doses, PHI days, or replacement products. */

export const ADVICE_DISCLAIMER_HI =
  "सामान्य सलाह। डिब्बे का लेबल और सुरक्षा अंतराल देखें। नक्शा खतौनी नहीं। योजना सरकारी ऐप नहीं।";

export const SULFOSULFURON_NEXT_CROP_HI =
  "कटाई के बाद इसी खेत में मक्का, ज्वार या मूंग जल्दी मत बोओ। घास के लिए क्लोडिनाफॉप या पिनोक्साडेन पहले से विकल्प हैं।";

const PHI_VEG = new Set([
  "tomato",
  "tamatar",
  "chilli",
  "chili",
  "mirch",
  "brinjal",
  "baingan",
  "eggplant",
  "okra",
  "bhindi",
  "ladyfinger",
  "cabbage",
  "gobhi",
  "patta-gobhi",
]);

const ALWAYS_HIDDEN =
  /streptocycline|streptomycin|bismerthiazol|स्ट्रेप्टोसाइक्लिन|स्ट्रेप्टोमाइसिन|बिस्मर्थिया|phorate|फोरेट|dichlorvos|डाइक्लोरोवोस|डाइक्लोरवॉस|डाइक्लोरवोस|ddvp|triazophos|ट्रायजोफॉस|ट्रायज़ोफॉस|aluminium phosphide|aluminum phosphide|एल्युमिनियम फॉस्फाइड|एल्यूमिनियम फॉस्फाइड/i;

const MONOCROTOPHOS = /monocrotophos|मोनोक्रोटोफॉस|मोनोक्रोटोफास|मोनोसिल/i;

export function isPhiVegetable(cropSlug: string | undefined): boolean {
  if (!cropSlug) return false;
  return PHI_VEG.has(cropSlug.trim().toLowerCase());
}

/** Exact days only when the note already contains a day count. */
export function vegetablePhiLine(cropSlug: string | undefined, phiNoteHi?: string): string | null {
  if (!isPhiVegetable(cropSlug)) return null;
  const note = (phiNoteHi || "").trim();
  if (/\d+\s*(दिन|day)/i.test(note)) return note;
  return "डिब्बे पर दिया अंतराल देखें";
}

export function isSulfosulfuronText(text: string): boolean {
  return /sulfosulfuron|सल्फोसल्फ्यूरॉन/i.test(text);
}

export function isHiddenMedicineText(text: string, cropSlug?: string): boolean {
  if (!text.trim()) return false;
  if (ALWAYS_HIDDEN.test(text)) return true;
  if (isPhiVegetable(cropSlug) && MONOCROTOPHOS.test(text)) return true;
  return false;
}

/** Keep the safe half of an "A या B" line. Null when nothing listed remains. */
export function filterAdviceLine(line: string, cropSlug?: string): string | null {
  const parts = line.split(/\s+(?:या|अथवा|\bor\b)\s+/i).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return isHiddenMedicineText(line, cropSlug) ? null : line;
  const kept = parts.filter((p) => !isHiddenMedicineText(p, cropSlug));
  if (!kept.length) return null;
  if (kept.length === parts.length) return line;
  return kept.join(" या ");
}

/** Azoxystrobin 18.2% + Difenoconazole is Amistar Top, not Custodia. */
export function brandsForTechnical(technical: string, brands: string[]): string[] {
  const amistarTop =
    /azoxystrobin\s*18\.2|एज़ोक्सीस्ट्रोबिन\s*18\.2/i.test(technical) &&
    /difenoconazole|डिफेनोकोनाज़ोल/i.test(technical);
  if (!amistarTop) return brands.filter(Boolean);
  return brands.filter((b) => b && !/custodia|कस्टोडिया/i.test(b));
}
