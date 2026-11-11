/**
 * Optional extras for five priority crops — distilled from existing
 * crop-curative specialFact / tip text, not invented chemistry.
 * PHI numbers are omitted: field-guide JSON only says “लेबल देखें”.
 */

import type { HubOverlay } from "@/lib/crops/intelligenceHub";

const KEY = (crop: string, id: string) => `${crop}:${id}`;

const MAP: Record<string, HubOverlay> = {
  "tomato:thrips": {
    fieldCheckHi: "फूल या पत्ती पलटकर देखें — छोटे पतले कीड़े रेंगते दिखें तो थ्रिप्स। नीचे जाला/लाल दाने हों तो माइट है।",
    lookAlikes: [
      {
        id: "red-spider-mite",
        similarHi: "पत्ती मुड़ना और पीलापन दोनों में दिखता है",
        differHi: "माइट में पत्ती के नीचे जाला और लाल नन्हे जीव; थ्रिप्स में चाँदी जैसी खुरचन, जाला नहीं",
      },
    ],
    dontDoHi: ["सादे कीटनाशक से माइट बढ़ सकती है — माइट समझकर थ्रिप्स की दवा मत मारो"],
    localAliases: ["थ्रिप्स", "फूल छेदक कीड़ा"],
    sprayWindow: "evening",
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "tomato:red-spider-mite": {
    fieldCheckHi: "पत्ती धूप में उल्टी करके देखें — लाल नन्हे जीव या बारीक जाला दिखे तो माइट।",
    lookAlikes: [
      {
        id: "thrips",
        similarHi: "पत्ती पीली-भूसी जैसी दोनों में",
        differHi: "थ्रिप्स में चाँदी खुरचन और फूल सूखना; जाला नहीं",
      },
    ],
    dontDoHi: ["केवल माइटनाशक डालें — आम कीटनाशक से मकड़ी बढ़ती है"],
    localAliases: ["लाल मकड़ी", "माइट"],
    sourceLabel: "Agriveda crop-problems tipHi",
    reviewedOn: "2026-11-05",
  },
  "tomato:leaf-curl": {
    fieldCheckHi: "ऊपर की नई पत्तियाँ कप जैसी छोटी और मुड़ी हों, पौधा बौना — वायरस हो सकता है। फफूंदनाशक आजमाएँ नहीं।",
    lookAlikes: [
      {
        id: "thrips",
        similarHi: "पत्ती मुड़ना",
        differHi: "थ्रिप्स में फूल के अंदर कीड़े दिखते हैं; वायरस में पूरा पौधा रुक जाता है, कीड़े कम",
      },
    ],
    dontDoHi: ["फफूंदनाशक वायरस नहीं मिटाता — पैसा बर्बाद"],
    localAliases: ["पत्ता मरोड़", "कुकड़ा", "मरोड़िया"],
    sourceLabel: "Agriveda crop-problems tipHi",
    reviewedOn: "2026-11-05",
  },
  "tomato:early-blight": {
    fieldCheckHi: "पुरानी पत्तियों पर गोल छल्लेदार भूरे धब्बे — अगेती झुलसा। नई पत्ती की नसें हरी रहें और सिर्फ पीलापन हो तो खाद/जस्ता जाँचें, फंगीसाइड जल्दी मत मारो।",
    localAliases: ["अगेती झुलसा", "अल्टरनेरिया"],
    sourceLabel: "Agriveda crop-problems",
    reviewedOn: "2026-11-05",
  },
  "paddy:stem-borer": {
    fieldCheckHi: "कल्ले में बीच की गोभ सूखी (Dead Heart) या बाली सफेद खाली (White Ear) — तना चीरकर सुंडी देखें।",
    dontDoHi: ["बाली निकलने के बाद स्प्रे तने के अंदर नहीं जाता — गाभा अवस्था में ही दवा"],
    localAliases: ["गोभ की सुंडी", "तना छेदक", "पीला तना छेदक"],
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "paddy:blast": {
    fieldCheckHi: "पत्ती पर आँख जैसे धब्बे (बीच भूरा, किनारा पीला) — ब्लास्ट। यूरिया की कमी का समान पीलापन धब्बे नहीं बनाता।",
    localAliases: ["ब्लास्ट", "झुलसा"],
    sourceLabel: "Agriveda crop-problems",
    reviewedOn: "2026-11-05",
  },
  "paddy:bph": {
    fieldCheckHi: "पौधे के तने के नीचे भूरे फुदके झुंड में — भूरा फुदका। पत्ती पलटकर देखें।",
    localAliases: ["भूरा फुदका", "टेला"],
    dontDoHi: ["एक ही चूसक दवा बार-बार न दोहराएँ"],
    sourceLabel: "Agriveda crop-problems",
    reviewedOn: "2026-11-05",
  },
  "chilli:thrips": {
    fieldCheckHi: "पत्ती नाव की तरह ऊपर मुड़ी हो — थ्रिप्स। नीचे मुड़ी उल्टी नाव हो तो पीली मकड़ी।",
    lookAlikes: [
      {
        id: "broad-mite",
        similarHi: "कुकड़ा / पत्ती मुड़ना",
        differHi: "थ्रिप्स = ऊपर मुड़ना; पीली मकड़ी = नीचे मुड़ना और तांबे जैसी चमक",
      },
    ],
    localAliases: ["थ्रिप्स", "कुकड़ा"],
    sprayWindow: "evening",
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "chilli:broad-mite": {
    fieldCheckHi: "पत्ती उल्टी नाव (नीचे मुड़ी) और डंठल लंबा — पीली मकड़ी। ऊपर मुड़ी नाव थ्रिप्स है।",
    lookAlikes: [
      {
        id: "thrips",
        similarHi: "पत्ती मुड़ना",
        differHi: "थ्रिप्स ऊपर मुड़ती है; माइट नीचे मुड़ती है",
      },
    ],
    dontDoHi: ["थ्रिप्स वाली दवा माइट पर कम चलती है — पत्ती पलटकर पक्का करो"],
    localAliases: ["पीली मकड़ी", "ब्रॉड माइट"],
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "wheat:yellow-rust": {
    fieldCheckHi: "पत्ती पर हल्दी जैसी सीधी पीली लकीरें, छूने पर हाथ पीला — रतुआ। सिर्फ समान पीलापन बिना पाउडर हो तो खाद की कमी हो सकती है।",
    lookAlikes: [
      {
        id: "brown-rust",
        similarHi: "पत्ती पर पाउडर",
        differHi: "पीला रतुआ लकीरों में; भूरा रतुआ गोल बिखरे दाने",
      },
    ],
    localAliases: ["पीला रतुआ", "हल्दी रोग", "झुलसा"],
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "wheat:brown-rust": {
    fieldCheckHi: "पत्ती पर कत्थई गोल दाने बिखरे हों — भूरा रतुआ। पीली सीधी लकीरें पीला रतुआ हैं।",
    lookAlikes: [{ id: "yellow-rust", similarHi: "रतुआ पाउडर", differHi: "पीला = लकीर; भूरा = गोल दाने" }],
    localAliases: ["भूरा रतुआ"],
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "cotton:thrips": {
    fieldCheckHi: "पत्ती पर चाँदी चमक और नाव जैसी मुड़ी कड़क पत्ती — थ्रिप्स। किनारे लाल-जले (hopper burn) तो तेला।",
    lookAlikes: [
      {
        id: "jassid-aphid",
        similarHi: "पत्ती मुड़ना",
        differHi: "तेला किनारे नीचे मोड़कर लाल जलाता है; थ्रिप्स चाँदी खुरचन करती है",
      },
    ],
    localAliases: ["थ्रिप्स"],
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "cotton:jassid-aphid": {
    fieldCheckHi: "पत्ती किनारे नीचे मुड़कर पीली फिर ईंट जैसी लाल — तेला (hopper burn)।",
    localAliases: ["तेला", "हरा तेला", "चेपा", "माहू"],
    sourceLabel: "Agriveda crop-problems specialFact",
    reviewedOn: "2026-11-05",
  },
  "cotton:whitefly": {
    fieldCheckHi: "पत्ती हिलाएँ — सफेद छोटे कीड़े उड़ें। चिपचिपा रस (honeydew) काला फफूंद लाता है।",
    localAliases: ["सफेद मक्खी"],
    dontDoHi: ["एक ही चूसक ग्रुप बार-बार न दोहराएँ"],
    sourceLabel: "Agriveda crop-problems",
    reviewedOn: "2026-11-05",
  },
};

export function getHubOverlay(cropSlug: string, problemId: string): HubOverlay {
  return MAP[KEY(cropSlug, problemId)] ?? {};
}

export function listOverlayKeys(): string[] {
  return Object.keys(MAP);
}
