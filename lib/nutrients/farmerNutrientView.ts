import type { NutrientDeficiencyData } from "@/types/deficiency";

/** Simple Hindi copy for farmers — short, exact, no jargon */
export interface FarmerNutrientView {
  slug: string;
  nameHi: string;
  nameEn: string;
  symbol: string;
  icon: string;
  oneLiner: string;
  pehchan: string;
  lakshan: string[];
  kyaKaren: { title: string; detail: string }[];
  bachav: string[];
  faq: { q: string; a: string }[];
  crops: { name: string; lakshan: string; upay: string }[];
}

const NUTRIENT_HI: Record<
  string,
  { nameHi: string; oneLiner: string; pehchan: string; lakshan: string[]; bachav: string[] }
> = {
  nitrogen: {
    nameHi: "नाइट्रोजन",
    oneLiner: "हरियाली और बढ़वार की सबसे ज़रूरी खाद। कमी हो तो नीची पत्तियाँ पीली होती हैं।",
    pehchan: "पुरानी (नीचे की) पत्ती पहले पीली — ऊपर की बाद में।",
    lakshan: [
      "नीची पत्तियाँ पीली, पौधा छोटा और कमज़ोर",
      "कम टिलर / कम शाखाएँ",
      "मक्का में नीची पत्ती के सिरे से V-आकार में पीलापन",
    ],
    bachav: [
      "यूरिया बँटकर दें, एक बार में सारा न डालें",
      "गीली मिट्टी में ही खाद डालें",
      "गोबर-खाद मिलाएँ",
    ],
  },
  phosphorus: {
    nameHi: "फॉस्फोरस",
    oneLiner: "जड़ और फूल के लिए ज़रूरी। कमी में पत्ती बैंगनी-लाल हो सकती है।",
    pehchan: "पुरानी पत्ती पर पहले — बैंगनी या गहरा हरा रंग।",
    lakshan: ["पौधा बौना", "पुरानी पत्ती बैंगनी-लाल", "जड़ कमज़ोर, फूल देर से"],
    bachav: ["DAP/SSP बुवाई पर बीज के पास डालें", "मिट्टी पर फैलाकर न छोड़ें", "मिट्टी परीक्षण कराएँ"],
  },
  potassium: {
    nameHi: "पोटैश",
    oneLiner: "फल की गुणवत्ता और तने की मज़बूती के लिए। कमी में पत्ती के किनारे जलते हैं।",
    pehchan: "पुरानी पत्ती के किनारे पहले पीले फिर भूरे।",
    lakshan: ["पत्ती के किनारे पीले-भूरे", "तना कमज़ोर, लोडिंग (गिरना)", "छोटा फल / कम भराव"],
    bachav: ["MOP या SOP समय पर दें", "फल लगने पर भी पोटैश दें", "सिर्फ यूरिया-DAP पर न रहें"],
  },
  calcium: {
    nameHi: "कैल्शियम",
    oneLiner: "नई पत्ती और फल के लिए। कमी में टमाटर-मिर्च के फल का निचला हिस्सा काला सड़ सकता है।",
    pehchan: "नई पत्ती और फल पर पहले — पुरानी ठीक रहती है।",
    lakshan: ["नई पत्ती मुड़ी या विकृत", "फल का निचला हिस्सा काला (BER)", "मूंगफली में खाली फली"],
    bachav: ["सिंचाई एक जैसी रखें", "फल पर कैल्शियम नाइट्रेट छिड़काव", "मूंगफली में फूल पर जिप्सम"],
  },
  magnesium: {
    nameHi: "मैग्नीशियम",
    oneLiner: "हरियाली के लिए। कमी में पत्ती के बीच पीला, नसें हरी।",
    pehchan: "पुरानी पत्ती पर पहले — नसों के बीच पीलापन।",
    lakshan: ["पुरानी पत्ती नसों के बीच पीली", "नसें हरी रहती हैं", "ज़्यादा MOP के बाद अक्सर"],
    bachav: ["MgSO4 (एप्सम सॉल्ट) छिड़काव", "MOP के साथ मैग्नीशियम भी दें", "खट्टी रेतली मिट्टी में डोलोमाइट"],
  },
  sulphur: {
    nameHi: "सल्फर",
    oneLiner: "तेल वाली फसलों में छुपी कमी। नई पत्ती पीली — नाइट्रोजन जैसी लगती है पर ऊपर की पत्ती पर।",
    pehchan: "नई (ऊपर की) पत्ती पहले पीली — नाइट्रोजन नीचे की पत्ती पर।",
    lakshan: ["ऊपर की पत्ती पीली", "पौधा पीला और बौना", "दाल / तिलहन में तेल प्रतिशत कम"],
    bachav: ["जिप्सम या SSP दें", "सिर्फ यूरिया-DAP नहीं", "तिलहन-दाल में सल्फर ज़रूर रखें"],
  },
  iron: {
    nameHi: "आयरन (लोहा)",
    oneLiner: "नई पत्ती पीली, नसें हरी — चूना वाली मिट्टी में बहुत आम।",
    pehchan: "सबसे नई पत्ती पहले — नसों के बीच पीला।",
    lakshan: ["नई पत्ती चमकीली पीली", "नसें हरी", "पुरानी पत्ती ठीक"],
    bachav: ["FeSO4 + सिट्रिक एसिड छिड़काव", "ज़्यादा DAP न डालें", "उच्च pH मिट्टी में Fe-EDDHA"],
  },
  zinc: {
    nameHi: "जिंक",
    oneLiner: "धान, मक्का, सोयाबीन में बहुत आम। छोटी पत्ती, पौधा बौना।",
    pehchan: "नई पत्ती और अंकुर पर — छोटी पत्ती, पीला धब्बा।",
    lakshan: ["छोटी पत्ती, कम अंतराल", "नई पत्ती पीली धारियाँ", "धान में खैरा — भूरी धब्बे"],
    bachav: ["ZnSO4 बुवाई/रोपाई पर", "0.5% जिंक सल्फेट छिड़काव", "ज़्यादा DAP से बचें"],
  },
  manganese: {
    nameHi: "मैंगनीज",
    oneLiner: "नई पत्ती पर नसों के बीच पीलापन — ज़्यादा पानी भरे खेत में।",
    pehchan: "नई पत्ती पर — आयरन जैसा पर थोड़ा अलग पैटर्न।",
    lakshan: ["नई पत्ती पीली धब्बेदार", "नसें हरी", "भीगी मिट्टी में बढ़ता है"],
    bachav: ["MnSO4 छिड़काव", "निकासी ठीक करें", "ज़्यादा चूना न डालें"],
  },
  boron: {
    nameHi: "बोरॉन",
    oneLiner: "फूल और फल के लिए। कमी में फल नहीं लगता या टेढ़ा फल।",
    pehchan: "नई पत्ती और फूल-फल पर।",
    lakshan: ["फूल गिरते हैं", "फल टेढ़े या सड़े", "गोभी में छोटा फूल"],
    bachav: ["बहुत कम मात्रा में बोरॉन", "सूखे समय में पानी दें", "मिट्टी परीक्षण के बाद ही"],
  },
  copper: {
    nameHi: "तांबा (कॉपर)",
    oneLiner: "नई पत्ती पीली, कलम सूखती है — कम ही दिखता है।",
    pehchan: "नई पत्ती और ऊपर की कलम।",
    lakshan: ["नई पत्ती पीली-विकृत", "कलम सूखना", "कम फूल-फल"],
    bachav: ["कम मात्रा में कॉपर सल्फेट", "ज़्यादा चूना न डालें", "संतुलित खाद"],
  },
  molybdenum: {
    nameHi: "मॉलिब्डेनम",
    oneLiner: "दाल में जड़ गांठ और नाइट्रोजन उपयोग के लिए। खट्टी मिट्टी में कम।",
    pehchan: "दाल में पीलापन + कम गांठ — नाइट्रोजन जैसा लग सकता है।",
    lakshan: ["दाल पीली, कम गांठ", "फूल गोभी में पत्ती पतली (व्हिपटेल)", "खट्टी मिट्टी"],
    bachav: ["खट्टी मिट्टी में चूना", "दाल में मॉलिब्डेनम बीज उपचार", "बहुत कम मात्रा"],
  },
  silicon: {
    nameHi: "सिलिकॉन",
    oneLiner: "धान और गन्ने में तना मज़बूत, कीट-रोग से बचाव।",
    pehchan: "धान में गिराव, गन्ने में कमज़ोर तना।",
    lakshan: ["तना कमज़ोर, गिराव", "कीट-रोग ज़्यादा", "धान में लोडिंग"],
    bachav: ["सिलिकेट खाद", "जल प्रबंधन", "संतुलित NPK"],
  },
  chlorine: {
    nameHi: "क्लोरीन",
    oneLiner: "बहुत कम दिखता है। पानी संतुलन के लिए।",
    pehchan: "आमतौर पर कमी नहीं मिलती।",
    lakshan: ["पत्ती मुरझाना", "कमज़ोर वृद्धि"],
    bachav: ["सामान्य NPK से पर्याप्त", "मिट्टी परीक्षण"],
  },
  cobalt: {
    nameHi: "कोबाल्ट",
    oneLiner: "दाल की जड़ गांठ (Rhizobium) के लिए — पौधे को सीधे नहीं, बैक्टीरिया को चाहिए।",
    pehchan: "दाल पीली + कम गांठ।",
    lakshan: ["दाल में कम गांठ", "पीलापन", "कम फली"],
    bachav: ["Rhizobium बीज उपचार", "संतुलित खाद", "कोबाल्ट अलग से ज़रूरी नहीं"],
  },
  nickel: {
    nameHi: "निकल",
    oneLiner: "बहुत कम मात्रा में चाहिए — आम खेतों में कमी दुर्लभ।",
    pehchan: "पत्ती के सिरे पर जलन जैसा।",
    lakshan: ["पत्ती सिरे से सूखना", "कमज़ोर वृद्धि"],
    bachav: ["संतुलित सूक्ष्म खाद", "मिट्टी परीक्षण"],
  },
};

const CROP_HI: Record<string, string> = {
  Paddy: "धान",
  Soybean: "सोयाबीन",
  Groundnut: "मूंगफली",
  Chilli: "मिर्च",
  Capsicum: "शिमला मिर्च",
  Cauliflower: "फूल गोभी",
  Cabbage: "पत्ता गोभी",
  Cucumber: "खीरा",
  Brinjal: "बैंगन",
  Okra: "भिंडी",
  Maize: "मक्का",
  Bajra: "बाजरा",
  Moong: "मूंग",
  Arhar: "अरहर",
  Sugarcane: "गन्ना",
};

function shorten(text: string, max = 90): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const last = cut.lastIndexOf(" ");
  return (last > 40 ? cut.slice(0, last) : cut).trim() + "…";
}

function topFixes(nutrient: NutrientDeficiencyData, limit = 3) {
  return (nutrient.howToFix ?? nutrient.corrections.map((c) => ({
    fertilizer: c.title,
    soilApplicationDose: c.details.find((d) => d.startsWith("Soil:"))?.replace("Soil: ", ""),
    foliarSprayDose: c.details.find((d) => d.startsWith("Foliar:"))?.replace("Foliar: ", ""),
  }))).slice(0, limit).map((fix) => {
    const f = fix as { fertilizer: string; soilApplicationDose?: string; foliarSprayDose?: string };
    const dose =
      f.foliarSprayDose && f.foliarSprayDose !== "NA"
        ? `छिड़काव: ${shorten(f.foliarSprayDose, 60)}`
        : f.soilApplicationDose && f.soilApplicationDose !== "NA"
          ? shorten(f.soilApplicationDose, 70)
          : "मिट्टी परीक्षण के अनुसार";
    return { title: f.fertilizer, detail: dose };
  });
}

function pickFaq(nutrient: NutrientDeficiencyData, limit = 3) {
  const faq = nutrient.faq ?? [];
  const hindiFirst = [...faq].sort((a, b) => {
    const aHi = /[\u0900-\u097F]/.test(a.q) ? 1 : 0;
    const bHi = /[\u0900-\u097F]/.test(b.q) ? 1 : 0;
    return bHi - aHi;
  });
  return hindiFirst.slice(0, limit).map((f) => ({
    q: f.q,
    a: shorten(f.a, 120),
  }));
}

function pickCrops(nutrient: NutrientDeficiencyData, limit = 8) {
  return nutrient.cropSpecificData.slice(0, limit).map((c) => ({
    name: CROP_HI[c.cropName] ?? c.cropName,
    lakshan: shorten(c.symptoms[0] ?? "", 85),
    upay: shorten(c.correction, 70),
  }));
}

export function toFarmerNutrientView(nutrient: NutrientDeficiencyData): FarmerNutrientView {
  const meta = NUTRIENT_HI[nutrient.slug];
  return {
    slug: nutrient.slug,
    nameHi: meta?.nameHi ?? nutrient.name,
    nameEn: nutrient.name,
    symbol: nutrient.symbol,
    icon: nutrient.icon,
    oneLiner: meta?.oneLiner ?? shorten(nutrient.summary, 100),
    pehchan: meta?.pehchan ?? shorten(nutrient.confirmation[0] ?? "", 80),
    lakshan: meta?.lakshan ?? nutrient.generalSymptoms.slice(0, 3).map((s) => shorten(s, 80)),
    kyaKaren: topFixes(nutrient, 3),
    bachav: meta?.bachav ?? (nutrient.prevention ?? []).slice(0, 3).map((s) => shorten(s, 70)),
    faq: pickFaq(nutrient, 3),
    crops: pickCrops(nutrient, 8),
  };
}

export function toFarmerCropNutrientCard(
  name: string,
  deficiencySymptoms: string[],
  management: string[],
  recommendedFertilizers: string[]
) {
  const slug = NAME_TO_SLUG[name] ?? name.toLowerCase();
  const m = NUTRIENT_HI[slug];

  return {
    nameHi: m?.nameHi ?? name,
    lakshan:
      m?.lakshan?.slice(0, 2) ??
      deficiencySymptoms.slice(0, 2).map((s) => simplifySymptomLine(s)),
    upay: management.slice(0, 2).map((s) => shorten(s, 65)),
    khad: recommendedFertilizers.slice(0, 3),
  };
}

const NAME_TO_SLUG: Record<string, string> = {
  Nitrogen: "nitrogen",
  Phosphorus: "phosphorus",
  Potassium: "potassium",
  Calcium: "calcium",
  Magnesium: "magnesium",
  Sulphur: "sulphur",
  Sulfur: "sulphur",
  Iron: "iron",
  Zinc: "zinc",
  Boron: "boron",
  Copper: "copper",
  Manganese: "manganese",
  Molybdenum: "molybdenum",
  Silicon: "silicon",
  Chlorine: "chlorine",
  Cobalt: "cobalt",
  Nickel: "nickel",
};

/** Short Hindi lines for crop profile merge — avoid dumping long English */
export function simplifySymptomLine(text: string): string {
  if (/[\u0900-\u097F]/.test(text)) return shorten(text, 80);
  return shorten(text, 75);
}
