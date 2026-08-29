/** Pick-stage guidance for vegetables sold at different ripeness (local vs transport). */
const PICK_STAGE_CROPS: Record<string, { hi: string[]; en: string[] }> = {
  tomato: {
    hi: [
      "गुलाबी / लाल — स्थानीय बाज़ार, तुरंत बिक्री",
      "हरा — दूर ट्रांसपोर्ट या थोक भेजने के लिए",
    ],
    en: [
      "Pink / red — local market, sell soon",
      "Green — long-distance transport or wholesale",
    ],
  },
  chilli: {
    hi: [
      "लाल पकी — सूखी मिर्च या ताज़ा बाज़ार",
      "हरी — ताज़ा बिक्री या पकने के लिए रखें",
    ],
    en: [
      "Fully red — dry chilli or fresh market",
      "Green — fresh sale or ripen in storage",
    ],
  },
};

export function cropHarvestStages(slug: string, hi: boolean): string[] | null {
  const entry = PICK_STAGE_CROPS[slug];
  if (!entry) return null;
  return hi ? entry.hi : entry.en;
}
