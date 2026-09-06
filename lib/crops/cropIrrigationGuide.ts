/**
 * Farmer-first irrigation guides — simple Hindi stages, no V6/VT/R1/DAS codes.
 */

export type IrrigationStageGuide = {
  titleHi: string;
  titleEn: string;
  periodHi: string;
  periodEn: string;
  pointsHi: string[];
  pointsEn: string[];
  badgeHi: string;
  badgeEn: string;
  /** Growth photo kind for crop-specific images */
  photoKind: "sow" | "veg" | "flower" | "bulk" | "harvest";
  critical?: boolean;
};

export type CropIrrigationGuide = {
  irrigationsHi: string;
  irrigationsEn: string;
  methodHi: string;
  methodEn: string;
  noteHi: string;
  noteEn: string;
  warningHi: string;
  warningEn: string;
  moistureHi: string;
  moistureEn: string;
  stages: IrrigationStageGuide[];
};

const DESI_MOISTURE_HI =
  "पौधे के पास 2 इंच गहरी मिट्टी उठाकर मुट्ठी में दबाएँ। लड्डू बन जाए तो अभी पानी की ज़रूरत नहीं। मिट्टी भुरभुरी रहे और लड्डू न बने तो तुरंत सिंचाई करें।";
const DESI_MOISTURE_EN =
  "Pick soil 2 inches deep near the plant and squeeze. If it forms a ball, wait. If crumbly and no ball, irrigate now.";

function cerealLike(stages: IrrigationStageGuide[], overrides: Partial<CropIrrigationGuide> = {}): CropIrrigationGuide {
  return {
    irrigationsHi: "4–5 बार",
    irrigationsEn: "4–5 times",
    methodHi: "नाली (Furrow)",
    methodEn: "Furrow",
    noteHi: "सही जल निकास बहुत ज़रूरी",
    noteEn: "Good drainage is essential",
    warningHi:
      "खेत में पानी भरकर न छोड़ें। पानी जमा रहने से जड़ें सड़ सकती हैं — नाली से निकास सही रखें।",
    warningEn:
      "Do not flood the field. Standing water can rot roots — keep drainage clear.",
    moistureHi: DESI_MOISTURE_HI,
    moistureEn: DESI_MOISTURE_EN,
    stages,
    ...overrides,
  };
}

const MAIZE_STAGES: IrrigationStageGuide[] = [
  {
    titleHi: "अंकुरण समय",
    titleEn: "Germination",
    periodHi: "बुवाई से 0–10 दिन",
    periodEn: "0–10 days after sowing",
    pointsHi: [
      "पहली हल्की सिंचाई करें।",
      "मिट्टी पर पपड़ी न जमने दें — अंकुर आसानी से बाहर निकले।",
    ],
    pointsEn: [
      "Give a light first irrigation.",
      "Do not let a soil crust form so seedlings emerge easily.",
    ],
    badgeHi: "सिंचाई 1 बार",
    badgeEn: "1 irrigation",
    photoKind: "sow",
  },
  {
    titleHi: "पौधा घुटने की ऊँचाई तक",
    titleEn: "Knee-high growth",
    periodHi: "15–40 दिन",
    periodEn: "15–40 days",
    pointsHi: [
      "8 से 10 दिन के अंतर पर सिंचाई करें।",
      "अच्छी बढ़वार के लिए खेत में हल्की नमी बनी रहे।",
    ],
    pointsEn: [
      "Irrigate every 8–10 days.",
      "Keep light moisture for steady growth.",
    ],
    badgeHi: "हर 8–10 दिन",
    badgeEn: "Every 8–10 days",
    photoKind: "veg",
  },
  {
    titleHi: "मूंछ व भुट्टा बनते समय",
    titleEn: "Silk & cob formation",
    periodHi: "45–65 दिन",
    periodEn: "45–65 days",
    pointsHi: [
      "हर 5 से 6 दिन में पानी दें।",
      "इस समय खेत सूखना नहीं चाहिए — वरना उपज बहुत घट सकती है।",
    ],
    pointsEn: [
      "Irrigate every 5–6 days.",
      "Field must not dry now — yield can drop sharply.",
    ],
    badgeHi: "हर 5–6 दिन",
    badgeEn: "Every 5–6 days",
    photoKind: "flower",
    critical: true,
  },
  {
    titleHi: "दाना भरते समय",
    titleEn: "Grain filling",
    periodHi: "65–85 दिन",
    periodEn: "65–85 days",
    pointsHi: [
      "7 से 8 दिन के अंतर पर सिंचाई करें।",
      "दाना मजबूत और भारी बने — इसके लिए नमी ज़रूरी है।",
    ],
    pointsEn: [
      "Irrigate every 7–8 days.",
      "Moisture helps grains fill heavy and strong.",
    ],
    badgeHi: "हर 7–8 दिन",
    badgeEn: "Every 7–8 days",
    photoKind: "bulk",
  },
];

const GUIDES: Record<string, CropIrrigationGuide> = {
  maize: cerealLike(MAIZE_STAGES, {
    warningHi:
      "मक्का में पानी भरना नहीं चाहिए! खेत में पानी जमा रहने से जड़ें सड़ जाती हैं — जल निकास सही रखें।",
    warningEn:
      "Never flood maize! Standing water rots roots — keep drainage clear.",
  }),
  wheat: cerealLike(
    [
      {
        titleHi: "अंकुरण / जड़ फूटना",
        titleEn: "Germination / crown root",
        periodHi: "बुवाई के बाद पहले 20 दिन",
        periodEn: "First 20 days",
        pointsHi: ["हल्की सिंचाई — मिट्टी नम रहे, पानी खड़ा न हो।", "पपड़ी न जमने दें।"],
        pointsEn: ["Light irrigation — moist soil, no standing water.", "Avoid soil crust."],
        badgeHi: "1–2 बार",
        badgeEn: "1–2 times",
        photoKind: "sow",
      },
      {
        titleHi: "कल्ले निकलते समय",
        titleEn: "Tillering",
        periodHi: "21–45 दिन",
        periodEn: "21–45 days",
        pointsHi: ["इस अवस्था में पानी न चूकें।", "मिट्टी की ऊपरी परत सूखे तो सिंचाई करें।"],
        pointsEn: ["Do not miss water at tillering.", "Irrigate when top soil dries."],
        badgeHi: "ज़रूरी सिंचाई",
        badgeEn: "Critical",
        photoKind: "veg",
        critical: true,
      },
      {
        titleHi: "फूल आने पर",
        titleEn: "Flowering",
        periodHi: "मध्य फसल",
        periodEn: "Mid crop",
        pointsHi: ["हल्की–मध्यम सिंचाई।", "पाला या तेज़ ठंड में पानी का ध्यान रखें।"],
        pointsEn: ["Light–medium irrigation.", "Watch frost and cold spells."],
        badgeHi: "हर 10–12 दिन",
        badgeEn: "Every 10–12 days",
        photoKind: "flower",
      },
      {
        titleHi: "दाना भरते समय",
        titleEn: "Grain fill",
        periodHi: "अंतिम बढ़वार",
        periodEn: "Late growth",
        pointsHi: ["नमी बनाए रखें।", "कटाई से पहले पानी घटाएँ / बंद करें।"],
        pointsEn: ["Keep moisture.", "Reduce / stop water before harvest."],
        badgeHi: "हल्की सिंचाई",
        badgeEn: "Light irrigation",
        photoKind: "bulk",
      },
    ],
    {
      irrigationsHi: "4–6 बार",
      irrigationsEn: "4–6 times",
      methodHi: "नाली / बाढ़ (हल्की)",
      methodEn: "Furrow / light flood",
      warningHi: "गेहूँ में जलभराव से पीलापन और जड़ सड़न हो सकती है — निकास खुला रखें।",
    }
  ),
  paddy: cerealLike(
    [
      {
        titleHi: "रोपाई के बाद",
        titleEn: "After transplant",
        periodHi: "पहले 7–10 दिन",
        periodEn: "First 7–10 days",
        pointsHi: ["उथला पानी रखें।", "पौध जड़ पकड़ ले तब पानी का स्तर स्थिर करें।"],
        pointsEn: ["Keep shallow water.", "Stabilize water once seedlings establish."],
        badgeHi: "उथला पानी",
        badgeEn: "Shallow water",
        photoKind: "sow",
      },
      {
        titleHi: "कल्ले निकलते समय",
        titleEn: "Tillering",
        periodHi: "मध्य बढ़वार",
        periodEn: "Mid growth",
        pointsHi: [
          "खेत में हल्का पानी ठीक।",
          "पानी बचाने वाला तरीका अपनाएँ तो भी खेत पूरी तरह सूखने न दें — पाइप में पानी देखकर सींचें।",
        ],
        pointsEn: [
          "Light standing water is fine.",
          "Even with save-water method, do not let the field crack dry — check the pipe and irrigate.",
        ],
        badgeHi: "नियमित पानी",
        badgeEn: "Regular water",
        photoKind: "veg",
      },
      {
        titleHi: "बाली और फूल आने पर",
        titleEn: "Heading & flowering",
        periodHi: "फूल आने के आसपास",
        periodEn: "Around flowering",
        pointsHi: ["इस समय पानी की कमी न होने दें।", "सूखे से बाली और दाना कमज़ोर हो सकते हैं।"],
        pointsEn: ["Do not miss water now.", "Drought weakens panicle and grain."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "flower",
        critical: true,
      },
      {
        titleHi: "दाना भरना",
        titleEn: "Grain fill",
        periodHi: "पकने से पहले",
        periodEn: "Before maturity",
        pointsHi: ["नमी बनाए रखें।", "कटाई से कुछ दिन पहले पानी निकाल दें।"],
        pointsEn: ["Maintain moisture.", "Drain before harvest."],
        badgeHi: "फिर पानी निकालें",
        badgeEn: "Then drain",
        photoKind: "bulk",
      },
    ],
    {
      irrigationsHi: "पूरे समय नमी रखें",
      irrigationsEn: "Keep moist all season",
      methodHi: "हल्का पानी",
      methodEn: "Light standing water",
      noteHi: "कटाई से पहले पानी निकालना ज़रूरी",
      warningHi: "ज्यादा गहरा पानी न भरें — कल्ले कम निकलते हैं। थोड़ा उथला पानी ठीक। खेत में पानी सड़ने न दें।",
    }
  ),
  tomato: cerealLike(
    [
      {
        titleHi: "रोपाई के बाद",
        titleEn: "After transplant",
        periodHi: "पहले 7 दिन",
        periodEn: "First 7 days",
        pointsHi: ["हल्की सिंचाई से पौध जमाएँ।", "जलभराव से जड़ सड़न हो सकती है।"],
        pointsEn: ["Light irrigation to establish.", "Waterlogging causes root rot."],
        badgeHi: "हल्की सिंचाई",
        badgeEn: "Light",
        photoKind: "sow",
      },
      {
        titleHi: "बढ़वार अवस्था",
        titleEn: "Vegetative",
        periodHi: "फूल आने तक",
        periodEn: "Until flowering",
        pointsHi: ["मिट्टी नम रखें — ऊपरी परत सूखे तो पानी दें।", "ड्रिप हो तो छोटी–छोटी खुराक अच्छी।"],
        pointsEn: ["Keep soil moist.", "Drip in small frequent doses if available."],
        badgeHi: "हर 3–4 दिन",
        badgeEn: "Every 3–4 days",
        photoKind: "veg",
      },
      {
        titleHi: "फूल और फल लगते समय",
        titleEn: "Flower & fruit set",
        periodHi: "मध्य–अंत फसल",
        periodEn: "Mid–late crop",
        pointsHi: ["नियमित पानी — सूखे से फूल झड़ सकते हैं।", "अचानक ज़्यादा पानी से फल फट सकते हैं।"],
        pointsEn: ["Regular water — drought drops flowers.", "Sudden heavy water may crack fruit."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "flower",
        critical: true,
      },
    ],
    {
      irrigationsHi: "बार-बार हल्की",
      irrigationsEn: "Frequent light",
      methodHi: "ड्रिप / नाली",
      methodEn: "Drip / furrow",
      warningHi: "टमाटर में पानी जमा न रखें — जड़ सड़न और बीमारी बढ़ती है।",
    }
  ),
  potato: cerealLike(
    [
      {
        titleHi: "अंकुरण समय",
        titleEn: "Sprouting",
        periodHi: "रोपण के बाद",
        periodEn: "After planting",
        pointsHi: ["हल्की सिंचाई।", "कंद सड़ने से बचाने के लिए जलभराव न करें।"],
        pointsEn: ["Light irrigation.", "Avoid waterlogging to prevent tuber rot."],
        badgeHi: "हल्की",
        badgeEn: "Light",
        photoKind: "sow",
      },
      {
        titleHi: "पौधा बढ़ते समय",
        titleEn: "Vegetative",
        periodHi: "कंद बनने से पहले",
        periodEn: "Before tuber set",
        pointsHi: ["मिट्टी समान नम रखें।", "मिट्टी चढ़ाने के बाद हल्का पानी दें।"],
        pointsEn: ["Keep even moisture.", "Light water after earthing-up."],
        badgeHi: "नियमित",
        badgeEn: "Regular",
        photoKind: "veg",
      },
      {
        titleHi: "कंद बनते–बढ़ते समय",
        titleEn: "Tuber bulking",
        periodHi: "मध्य फसल",
        periodEn: "Mid crop",
        pointsHi: ["नमी की कमी न होने दें — कंद छोटे रह सकते हैं।", "पकने के पास पानी घटाएँ।"],
        pointsEn: ["Do not stress moisture — tubers stay small.", "Reduce water near maturity."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "bulk",
        critical: true,
      },
    ],
    {
      methodHi: "नाली / ड्रिप",
      warningHi: "आलू में पानी भरना खतरनाक है — झुलसा और कंद सड़न बढ़ती है।",
    }
  ),
  onion: cerealLike(
    [
      {
        titleHi: "रोपाई के बाद",
        titleEn: "After transplant",
        periodHi: "पहले 10 दिन",
        periodEn: "First 10 days",
        pointsHi: ["बार-बार हल्की सिंचाई।", "पौध जमा होने तक सूखा न छोड़ें।"],
        pointsEn: ["Frequent light irrigation.", "Do not dry until established."],
        badgeHi: "हल्की–बार-बार",
        badgeEn: "Frequent light",
        photoKind: "sow",
      },
      {
        titleHi: "बल्ब बनते समय",
        titleEn: "Bulb formation",
        periodHi: "मध्य फसल",
        periodEn: "Mid crop",
        pointsHi: ["नमी समान रखें।", "अचानक सूखा–गीला से बल्ब फट सकते हैं।"],
        pointsEn: ["Keep even moisture.", "Sudden dry–wet can split bulbs."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "veg",
        critical: true,
      },
      {
        titleHi: "कटाई से पहले",
        titleEn: "Before harvest",
        periodHi: "अंतिम 10–15 दिन",
        periodEn: "Last 10–15 days",
        pointsHi: ["पानी बंद करें — भंडारण बेहतर होता है।", "गर्दन सूखने दें।"],
        pointsEn: ["Stop water — better storage.", "Let necks dry."],
        badgeHi: "पानी बंद",
        badgeEn: "Stop water",
        photoKind: "harvest",
      },
    ],
    {
      irrigationsHi: "बार-बार हल्की",
      methodHi: "नाली / ड्रिप",
      warningHi: "प्याज में असमान पानी से जुड़वाँ या फटे बल्ब बनते हैं।",
    }
  ),
  cotton: cerealLike(
    [
      {
        titleHi: "अंकुरण / स्थापना",
        titleEn: "Establishment",
        periodHi: "शुरुआत",
        periodEn: "Early",
        pointsHi: ["हल्की सिंचाई।", "जलभराव न करें।"],
        pointsEn: ["Light irrigation.", "No waterlogging."],
        badgeHi: "हल्की",
        badgeEn: "Light",
        photoKind: "sow",
      },
      {
        titleHi: "फूल–गांठ बनते समय",
        titleEn: "Flower & square",
        periodHi: "मध्य फसल",
        periodEn: "Mid crop",
        pointsHi: ["पानी की कमी न होने दें।", "सूखे से फूल–गांठ झड़ सकते हैं।"],
        pointsEn: ["Do not miss water.", "Drought drops flowers and squares."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "flower",
        critical: true,
      },
      {
        titleHi: "बॉल भरते समय",
        titleEn: "Boll filling",
        periodHi: "अंत की ओर",
        periodEn: "Late",
        pointsHi: ["नमी बनाए रखें।", "चुनाई के पास पानी घटाएँ।"],
        pointsEn: ["Keep moisture.", "Reduce water near picking."],
        badgeHi: "नियमित",
        badgeEn: "Regular",
        photoKind: "bulk",
      },
    ],
    {
      irrigationsHi: "5–8 बार (मौसम पर)",
      methodHi: "नाली / ड्रिप",
      warningHi: "कपास में पानी जमा न रखें — जड़ और बीमारी का खतरा।",
    }
  ),
  chilli: cerealLike(
    [
      {
        titleHi: "रोपाई के बाद",
        titleEn: "After transplant",
        periodHi: "पहले हफ्ते",
        periodEn: "First week",
        pointsHi: ["हल्की सिंचाई से पौध जमाएँ।"],
        pointsEn: ["Light irrigation to establish."],
        badgeHi: "हल्की",
        badgeEn: "Light",
        photoKind: "sow",
      },
      {
        titleHi: "फूल–फल लगते समय",
        titleEn: "Flower & fruit",
        periodHi: "मुख्य फसल",
        periodEn: "Main crop",
        pointsHi: ["मिट्टी नम रखें।", "सूखे से फूल झड़ते हैं।"],
        pointsEn: ["Keep soil moist.", "Drought drops flowers."],
        badgeHi: "हर 3–4 दिन",
        badgeEn: "Every 3–4 days",
        photoKind: "flower",
        critical: true,
      },
    ],
    { methodHi: "ड्रिप / नाली", warningHi: "मिर्च में जलभराव से उकठा बढ़ता है — निकास सही रखें।" }
  ),
  soybean: cerealLike(
    [
      {
        titleHi: "अंकुरण",
        titleEn: "Germination",
        periodHi: "बुवाई के बाद",
        periodEn: "After sowing",
        pointsHi: ["सूखा हो तो हल्की सिंचाई।", "जलभराव से बचें।"],
        pointsEn: ["Light irrigation if dry.", "Avoid waterlogging."],
        badgeHi: "ज़रूरत पर",
        badgeEn: "If needed",
        photoKind: "sow",
      },
      {
        titleHi: "फूल और फली भरते समय",
        titleEn: "Flower & pod fill",
        periodHi: "मध्य फसल",
        periodEn: "Mid crop",
        pointsHi: ["बारिश न हो तो एक–दो सिंचाई ज़रूरी।", "इस समय सूखा सबसे नुकसान पहुँचाता है।"],
        pointsEn: ["1–2 irrigations if no rain.", "Drought now hurts yield most."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "flower",
        critical: true,
      },
    ],
    { irrigationsHi: "2–3 बार", methodHi: "नाली", warningHi: "सोयाबीन में खड़ा पानी न रखें।" }
  ),
  moongfali: cerealLike(
    [
      {
        titleHi: "अंकुरण",
        titleEn: "Germination",
        periodHi: "बुवाई के बाद",
        periodEn: "After sowing",
        pointsHi: ["हल्की सिंचाई अगर सूखा हो।"],
        pointsEn: ["Light irrigation if dry."],
        badgeHi: "हल्की",
        badgeEn: "Light",
        photoKind: "sow",
      },
      {
        titleHi: "गाँठ ज़मीन में जाने पर",
        titleEn: "Pegging",
        periodHi: "फूल के बाद",
        periodEn: "After flowering",
        pointsHi: ["नमी बनाए रखें — गाँठ सही से अंदर जाए।", "सूखे में फली कम बनती है।"],
        pointsEn: ["Keep moisture so pegs enter soil.", "Drought reduces pods."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "flower",
        critical: true,
      },
      {
        titleHi: "फली भरते समय",
        titleEn: "Pod fill",
        periodHi: "अंत की ओर",
        periodEn: "Late",
        pointsHi: ["हल्की सिंचाई।", "कटाई से पहले पानी घटाएँ।"],
        pointsEn: ["Light irrigation.", "Reduce water before harvest."],
        badgeHi: "हल्की",
        badgeEn: "Light",
        photoKind: "bulk",
      },
    ],
    { methodHi: "नाली", warningHi: "मूंगफली में जलभराव से गलन बढ़ती है।" }
  ),
  sugarcane: cerealLike(
    [
      {
        titleHi: "अंकुरण / जमाव",
        titleEn: "Germination",
        periodHi: "रोपण के बाद",
        periodEn: "After planting",
        pointsHi: ["नियमित हल्की–मध्यम सिंचाई।"],
        pointsEn: ["Regular light–medium irrigation."],
        badgeHi: "नियमित",
        badgeEn: "Regular",
        photoKind: "sow",
      },
      {
        titleHi: "कल्ले और तेज़ वृद्धि",
        titleEn: "Tillering & grand growth",
        periodHi: "मुख्य बढ़वार",
        periodEn: "Main growth",
        pointsHi: ["पानी की कमी न होने दें।", "नाली से सिंचाई अच्छी रहती है।"],
        pointsEn: ["Do not miss water.", "Furrow irrigation works well."],
        badgeHi: "सबसे ज़रूरी",
        badgeEn: "Most critical",
        photoKind: "veg",
        critical: true,
      },
    ],
    {
      irrigationsHi: "पूरे मौसम नियमित",
      methodHi: "नाली",
      warningHi: "गन्ने में पानी जमा रहने से जड़ कमज़ोर होती है — निकास रखें।",
    }
  ),
  bajra: cerealLike(
    [
      {
        titleHi: "अंकुरण",
        titleEn: "Germination",
        periodHi: "बुवाई के बाद",
        periodEn: "After sowing",
        pointsHi: ["ज़रूरत हो तो हल्की सिंचाई।"],
        pointsEn: ["Light irrigation only if needed."],
        badgeHi: "कम पानी",
        badgeEn: "Low water",
        photoKind: "sow",
      },
      {
        titleHi: "फूल / बाली समय",
        titleEn: "Flowering",
        periodHi: "मध्य फसल",
        periodEn: "Mid crop",
        pointsHi: ["सूखा पड़े तो एक सिंचाई बहुत फ़ायदेमंद।"],
        pointsEn: ["One irrigation at flowering helps a lot in drought."],
        badgeHi: "ज़रूरी हो तो",
        badgeEn: "If dry",
        photoKind: "flower",
        critical: true,
      },
    ],
    { irrigationsHi: "1–2 बार", methodHi: "नाली / जरूरत पर", noteHi: "सूखा सहनशील — ज़्यादा पानी न दें" }
  ),
};

const ALIASES: Record<string, string> = {
  groundnut: "moongfali",
  mungfali: "moongfali",
  rice: "paddy",
  dhaan: "paddy",
  arhar: "pulses",
  tur: "pulses",
};

function fallbackFromCrop(input: {
  criticalStages: string[];
  schedule: string[];
  waterRequirement: string;
}): CropIrrigationGuide {
  const stages: IrrigationStageGuide[] = (input.criticalStages.length
    ? input.criticalStages
    : ["अंकुरण", "बढ़वार", "फूल आना"]
  ).slice(0, 4).map((stage, i) => {
    const kinds: IrrigationStageGuide["photoKind"][] = ["sow", "veg", "flower", "bulk"];
    const scheduleHint = input.schedule[i] ?? input.schedule[0] ?? "ऊपरी मिट्टी सूखे तब पानी दें";
    return {
      titleHi: stage,
      titleEn: stage,
      periodHi: `अवस्था ${i + 1}`,
      periodEn: `Stage ${i + 1}`,
      pointsHi: [scheduleHint, "जलभराव न होने दें।"],
      pointsEn: [scheduleHint, "Avoid waterlogging."],
      badgeHi: i === Math.min(2, input.criticalStages.length - 1) ? "ज़रूरी समय" : "सिंचाई",
      badgeEn: "Irrigation",
      photoKind: kinds[i] ?? "veg",
      critical: i === Math.min(2, Math.max(0, input.criticalStages.length - 1)),
    };
  });

  return cerealLike(stages, {
    irrigationsHi: input.schedule.length ? `${input.schedule.length}+ बार` : "ज़रूरत अनुसार",
    irrigationsEn: "As needed",
    methodHi: "नाली / स्थानीय तरीका",
    methodEn: "Furrow / local method",
    noteHi: input.waterRequirement || "मिट्टी देखकर पानी दें",
    noteEn: input.waterRequirement || "Water by soil feel",
  });
}

export function getCropIrrigationGuide(
  slug: string,
  cropBits?: {
    criticalStages: string[];
    schedule: string[];
    waterRequirement: string;
  }
): CropIrrigationGuide {
  const key = ALIASES[slug] ?? slug;
  if (GUIDES[key]) return GUIDES[key];

  if (/brinjal|cucumber|bhindi|cauliflower/.test(key)) {
    return {
      ...GUIDES.tomato,
      warningHi: "इस फसल में पानी जमा न रखें — जड़ सड़न और बीमारी बढ़ती है।",
      warningEn: "Do not leave standing water — root rot and disease increase.",
    };
  }
  if (/mustard|chana|masoor|urad|moong|pulses|ginger|garlic/.test(key)) {
    return fallbackFromCrop(
      cropBits ?? {
        criticalStages: ["अंकुरण", "फूल आना", "दाना/फली भरना"],
        schedule: ["ऊपरी मिट्टी सूखे तब पानी दें", "जलभराव से बचें"],
        waterRequirement: "मध्यम सिंचाई",
      }
    );
  }
  if (/mango|banana|grapes/.test(key)) {
    return fallbackFromCrop(
      cropBits ?? {
        criticalStages: ["नई वृद्धि", "फूल आना", "फल बढ़ना"],
        schedule: ["ड्रिप से नियमित नमी", "जलभराव न करें"],
        waterRequirement: "नियमित नमी",
      }
    );
  }
  return fallbackFromCrop(
    cropBits ?? {
      criticalStages: ["अंकुरण", "बढ़वार", "फूल आना"],
      schedule: ["ऊपरी मिट्टी सूखे तब पानी दें"],
      waterRequirement: "मिट्टी देखकर पानी दें",
    }
  );
}

export function irrigationStagePhoto(cropSlug: string, kind: IrrigationStageGuide["photoKind"]): string {
  const file = kind === "bulk" ? "veg" : kind;
  return `/images/growth/${cropSlug}-${file}.jpg`;
}

export function irrigationStagePhotoFallback(kind: IrrigationStageGuide["photoKind"]): string {
  const map = {
    sow: "/images/growth/growth-stage-sow.jpg",
    veg: "/images/growth/growth-stage-veg.jpg",
    flower: "/images/growth/growth-stage-flower.jpg",
    bulk: "/images/growth/growth-stage-veg.jpg",
    harvest: "/images/growth/growth-stage-harvest.jpg",
  } as const;
  return map[kind];
}
