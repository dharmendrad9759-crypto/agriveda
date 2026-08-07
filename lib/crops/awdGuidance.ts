/**
 * Alternate Wetting & Drying (AWD) — paddy-first field guidance.
 * Practical steps farmers can follow with a field water tube; not a subsidy claim.
 */

export const AWD_FIELD_TUBE_CM = 15;

export const AWD_CHECK_STORAGE_KEY = "agriveda-awd-tube-check";

export interface AwdStep {
  id: string;
  titleHi: string;
  titleEn: string;
  detailHi: string;
  detailEn: string;
}

export interface AwdGuidance {
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  steps: AwdStep[];
  neverStressHi: string;
  neverStressEn: string;
  safeNotesHi: string[];
  safeNotesEn: string[];
  checklistLabelHi: string;
  checklistLabelEn: string;
}

export const AWD_GUIDANCE: AwdGuidance = {
  titleHi: "AWD सिंचाई — धान में पानी बचाएँ",
  titleEn: "AWD irrigation — save water in paddy",
  subtitleHi: `खेत में ट्यूब लगाएँ · पानी ट्यूब में ${AWD_FIELD_TUBE_CM} सेमी नीचे उतरे तब दोबारा सिंचाई`,
  subtitleEn: `Install a field tube · re-irrigate when water drops ${AWD_FIELD_TUBE_CM} cm below soil surface`,
  steps: [
    {
      id: "tube",
      titleHi: "1. खेत ट्यूब लगाएँ",
      titleEn: "1. Install field tube",
      detailHi:
        "10–20 सेमी व्यास वाला छिद्रित पाइप/ट्यूब खेत में गाड़ें (करीब 25–30 सेमी गहरा)। पानी का स्तर ट्यूब में साफ़ दिखे — यही AWD का मीटर है।",
      detailEn:
        "Drive a perforated pipe/tube (10–20 cm dia) ~25–30 cm into the field so the water level is readable — that is your AWD gauge.",
    },
    {
      id: "irrigate",
      titleHi: `2. पानी गायब होकर ${AWD_FIELD_TUBE_CM} सेमी नीचे आए तब सींचें`,
      titleEn: `2. Irrigate when water disappears to ${AWD_FIELD_TUBE_CM} cm below`,
      detailHi: `सतही पानी सूखने दें। ट्यूब में पानी मिट्टी की सतह से ~${AWD_FIELD_TUBE_CM} सेमी नीचे दिखे — तब ही फिर से बाढ़ दें (लगभग 2–5 सेमी खड़ा पानी)। हर दिन बाढ़ ज़रूरी नहीं।`,
      detailEn: `Let ponded water disappear. When the tube reads ~${AWD_FIELD_TUBE_CM} cm below the soil surface, re-flood to ~2–5 cm. Continuous flooding is not required.`,
    },
    {
      id: "never-pi",
      titleHi: "3. PI / फूल पर कभी तनाव न दें",
      titleEn: "3. NEVER stress at PI / flowering",
      detailHi:
        "पैनिकल आरंभ (PI) से फूल आने तक खेत में नमी बनाए रखें — पानी न काटें। इस अवस्था में AWD बंद / सतर्क बाढ़ रखें।",
      detailEn:
        "From panicle initiation (PI) through flowering, keep the field moist — do not dry down. Pause safe-AWD dryness in this window.",
    },
  ],
  neverStressHi:
    "महत्वपूर्ण: बाली निकलने (PI) और फूल आने पर पानी की कमी न होने दें — उपज गिर सकती है।",
  neverStressEn:
    "Critical: never water-stress at PI or flowering — yield can drop sharply.",
  safeNotesHi: [
    "रोपाई के बाद पहले ~10–15 दिन हल्की खड़ी पानी रखें — जड़ जमें।",
    "लवणीय / बहुत बलुआ / खराब जल निकासी खेत में AWD सीमित रखें — स्थानीय सलाह लें।",
    "खरपतवार बढ़े तो एक बार पानी कुछ दिन खड़ा रख सकते हैं।",
    "यह सामान्य मार्गदर्शन है — खेत की ढलान और मिट्टी अनुसार बदलें। सब्सिडी % का दावा यहाँ नहीं।",
  ],
  safeNotesEn: [
    "Keep light standing water for ~10–15 days after transplant so roots establish.",
    "Limit AWD on saline, very sandy, or poorly drained fields — ask local advisory.",
    "If weeds surge, a short flooded spell can help suppress them.",
    "General guidance only — adapt to field slope and soil. No subsidy % claimed here.",
  ],
  checklistLabelHi: "आज AWD ट्यूब चेक किया",
  checklistLabelEn: "Checked AWD tube today",
};

export function getAwdGuidance(): AwdGuidance {
  return AWD_GUIDANCE;
}

export function awdTodayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
