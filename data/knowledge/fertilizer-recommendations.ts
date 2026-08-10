import type { FertilizerRecommendation } from "@/lib/knowledge/types";

/** NPK kg/ha from NFSM PoP, ICAR-IISR, state PoPs in knowledge/ folder */
export const FERTILIZER_RECOMMENDATIONS: FertilizerRecommendation[] = [
  {
    cropSlug: "paddy",
    cropName: "Paddy",
    source: "NFSM_Package.pdf",
    n: 100,
    p2o5: 60,
    k2o: 60,
    micronutrients: ["ZnSO₄ 25 kg/ha if deficient"],
    splits: ["50% N बेसल", "25% N कुशी अवस्था में", "25% N बाली निकलने पर"],
    notes: ["निचले/transplanted: 100:60:60 NPK kg/ha", "ऊपरी: 90:60:60", "Hybrid rice: 120-150 N"],
  },
  {
    cropSlug: "maize",
    cropName: "Maize",
    source: "MaizePackage.pdf / maize-profile",
    n: 180,
    p2o5: 60,
    k2o: 40,
    micronutrients: ["ZnSO₄ 25 kg/ha in deficient soils"],
    splits: ["50% N बुवाई पर", "25% N घुटने-ऊँचाई (~35 DAS)", "25% N tasseling से पहले"],
    notes: ["Kharif hybrid: 72-80 kg N/acre equivalent", "Silking पर सिंचाई सबसे ज़रूरी"],
  },
  {
    cropSlug: "cotton",
    cropName: "Cotton",
    source: "cotton.pdf",
    n: 120,
    p2o5: 60,
    k2o: 60,
    micronutrients: ["ZnSO₄ 5.5 kg/ha once in two cotton-wheat cycles (North zone)"],
    splits: ["उत्तर: आधा N गिनती पर, बाकी पहले फूल पर", "मध्य/दक्षिण hybrid: N 3-4 भाग में squaring और peak flowering पर"],
    notes: ["Bt hybrid सिंचित: 150-240 N high-yield blocks के लिए", "P & K मिट्टी परीक्षण अनुसार"],
  },
  {
    cropSlug: "soybean",
    cropName: "Soybean",
    source: "Soybeanpackageofpractices.pdf",
    n: 20,
    p2o5: 60,
    k2o: 40,
    micronutrients: ["Gypsum 150-200 kg/ha with FYM if no S source", "Rhizobium + PSB seed treatment"],
    splits: ["पूरी बेसल बुवाई पर — legume 60-100 kg N जोड़ता है"],
    notes: ["FYM 5-10 t/ha", "अधिक N न दें — nodulation घटता है"],
  },
  {
    cropSlug: "bajra",
    cropName: "Bajra (Pearl millet)",
    source: "Recommended_package_of_practices-Pearl_millet.pdf",
    n: 60,
    p2o5: 30,
    k2o: 0,
    micronutrients: [
      "ZnSO₄ 25 kg/ha (≈10 kg/acre) in Zn-deficient soils — or PoP lower rate if soil test adequate",
      "0.5% ZnSO₄ foliar if deficiency symptoms appear",
    ],
    splits: ["शुष्क: 40N+20P", "अर्ध-शुष्क: 60N+30P", "रेतली मिट्टी: आधा N बुवाई, आधा 25 DAS"],
    notes: ["Seed rate 3-4 kg/ha", "बीज की दर में खाद न रखें"],
  },
  {
    cropSlug: "moongfali",
    cropName: "Moongfali (Groundnut)",
    source: "moongfali.pdf",
    n: 20,
    p2o5: 40,
    k2o: 50,
    micronutrients: ["Gypsum 500 kg/ha at flowering", "ZnSO₄ 50 kg/ha once in 3 seasons if deficient"],
    splits: ["Kharif: पूरी बेसल", "Rabi: बेसल + 10 kg N flowering पर"],
    notes: ["Rhizobium + PSB", "FYM 10 t/ha 2-3 सीज़न में एक बार", "P SSP से"],
  },
  {
    cropSlug: "chilli",
    cropName: "Chilli",
    source: "chilli.pdf / chilli-profile",
    n: 120,
    p2o5: 60,
    k2o: 60,
    micronutrients: ["Boron 0.2% foliar at flowering", "Ca foliar at fruiting"],
    splits: ["बेसल NPK + N top-dress 30, 45, 60 DAT"],
    notes: ["FYM 10-12 t/ha", "Flowering के बाद अधिक N न दें — thrips/mite का खतरा"],
  },
  {
    cropSlug: "tomato",
    cropName: "Tomato",
    source: "PRECISION_FARMING_TECHNOLOGIES_new.pdf",
    n: 200,
    p2o5: 250,
    k2o: 250,
    micronutrients: ["19:19:19+MN @ 0.5% at 18 DAS nursery", "Micronutrient mix 0.1% at 40 & 80 DAT"],
    splits: ["ड्रिप से fertigation हर 3 दिन में बाँटकर", "75% SSP बेसल"],
    notes: ["FYM 25 t/ha", "Paired row 90×60×60 cm with drip"],
  },
  {
    cropSlug: "potato",
    cropName: "Potato",
    source: "potato.pdf / NFSM",
    n: 150,
    p2o5: 100,
    k2o: 120,
    micronutrients: ["Zn and B per soil test"],
    splits: ["रोपाई पर पूरी बेसल NPK", "आवश्यकता पर earthing up के साथ दूसरा N"],
    notes: ["FYM 15-20 t/ha", "कंद शुरू होने पर सिंचाई सबसे महत्वपूर्ण"],
  },
  {
    cropSlug: "wheat",
    cropName: "Wheat",
    source: "NFSM / standard PoP",
    n: 120,
    p2o5: 60,
    k2o: 40,
    micronutrients: ["ZnSO₄ 25 kg/ha on deficient soils"],
    splits: ["आधा N बुवाई पर", "आधा N पहली सिंचाई (CRI ~21 DAS)"],
    notes: ["Karnal bunt से बचने के लिए देर से बुवाई न करें"],
  },
  {
    cropSlug: "sugarcane",
    cropName: "Sugarcane",
    source: "ICAR-IISR / state sugarcane PoP",
    n: 250,
    p2o5: 80,
    k2o: 120,
    micronutrients: ["ZnSO₄ / FeSO4 if chlorosis on alkaline soils", "Trash mulching after earthing"],
    splits: ["रोपाई पर बेसल P+K", "N 2–3 भाग में grand growth तक", "मानसून से पहले आखिरी N"],
    notes: ["FYM 10-15 t/ha", "Ratoon: N थोड़ा कम; gap filling ज़रूरी"],
  },
  {
    cropSlug: "onion",
    cropName: "Onion",
    source: "NHRDF / ICAR vegetable PoP",
    n: 100,
    p2o5: 50,
    k2o: 50,
    micronutrients: ["S through gypsum/SSP — quality bulbs", "Boron if hollow stems"],
    splits: ["बेसल NPK रोपाई/बुवाई पर", "N top-dress 30 & 45 DAT"],
    notes: ["FYM 15-20 t/ha", "देर से अधिक N न दें — नरम कंद / खराब भंडारण"],
  },
  {
    cropSlug: "cauliflower",
    cropName: "Cauliflower",
    source: "ICAR vegetable PoP",
    n: 120,
    p2o5: 80,
    k2o: 60,
    micronutrients: ["Boron (borax) critical — prevents browning", "Mo if deficiency on sandy soils"],
    splits: ["बेसल + curd initiation पर N top-dress"],
    notes: ["FYM 20 t/ha", "फूल की गुणवत्ता के लिए ठंडा तापमान बनाए रखें"],
  },
  {
    cropSlug: "brinjal",
    cropName: "Brinjal",
    source: "ICAR / SAU vegetable PoP",
    n: 100,
    p2o5: 50,
    k2o: 50,
    micronutrients: ["Foliar micronutrient mix if stunting"],
    splits: ["बेसल + N 30, 60 DAT"],
    notes: ["FYM 20 t/ha", "लंबे hybrid को stake करें; drip fertigation बेहतर"],
  },
  {
    cropSlug: "cucumber",
    cropName: "Cucumber",
    source: "Protected cultivation / ICAR PoP",
    n: 80,
    p2o5: 40,
    k2o: 40,
    micronutrients: ["Ca foliar for tip burn under protected culture"],
    splits: ["बेसल + drip पर बार-बार हल्की fertigation"],
    notes: ["Flowering/fruiting पर पानी की कमी न होने दें", "जैविक mulch सहायक"],
  },
  {
    cropSlug: "mustard",
    cropName: "Mustard",
    source: "ICAR / mustard PoP",
    n: 80,
    p2o5: 40,
    k2o: 40,
    micronutrients: ["Sulphur critical — gypsum/SSP", "Boron for sterility issues"],
    splits: ["बेसल + 30 DAS N top-dress"],
    notes: ["S की कमी से तेल की गुणवत्ता घटती है", "जलभराव से बचें"],
  },
  {
    cropSlug: "moong",
    cropName: "Moong",
    source: "ICAR pulse PoP",
    n: 20,
    p2o5: 40,
    k2o: 20,
    micronutrients: ["Rhizobium + PSB seed treatment", "Mo for acid soils"],
    splits: ["पूरी बेसल — legume"],
    notes: ["N अधिक न दें", "FYM 5 t/ha उपज बढ़ाता है"],
  },
  {
    cropSlug: "pulses",
    cropName: "Arhar / Tur",
    source: "ICAR pigeonpea PoP",
    n: 25,
    p2o5: 50,
    k2o: 20,
    micronutrients: ["Rhizobium + PSB", "ZnSO₄ if deficient"],
    splits: ["बुवाई पर बेसल; nodulation कम हो तो हल्का N"],
    notes: ["Line sowing + drainage महत्वपूर्ण", "वर्षा आधारित में intercrop विकल्प"],
  },
  {
    cropSlug: "bhindi",
    cropName: "Bhindi (Okra)",
    source: "ICAR vegetable PoP",
    n: 80,
    p2o5: 40,
    k2o: 40,
    micronutrients: ["Foliar NPK+MN if YVM stress plants"],
    splits: ["बेसल + 30 DAS N"],
    notes: ["FYM 10-15 t/ha", "प्रतिरोधी किस्में से कीटनाशक कम लगते हैं"],
  },
];

export function getFertilizerForCrop(slug: string): FertilizerRecommendation | null {
  const key =
    slug === "groundnut" || slug === "mungfali"
      ? "moongfali"
      : slug === "arhar" || slug === "tur"
        ? "pulses"
        : slug === "rice" || slug === "dhaan"
          ? "paddy"
          : slug;
  return FERTILIZER_RECOMMENDATIONS.find((f) => f.cropSlug === key) ?? null;
}

/** Convert kg/ha to kg/acre (1 ha ≈ 2.47 acre) */
export function haToAcre(kgPerHa: number, acres: number): number {
  return Math.round((kgPerHa / 2.47) * acres);
}

/** Urea is 46% N, DAP is 46% P2O5 + 18% N, MOP is 60% K2O */
export function calculateFertilizerProducts(input: {
  n: number;
  p2o5: number;
  k2o: number;
  acres: number;
}): { ureaKg: number; dapKg: number; mopKg: number; areaHa: number } {
  const areaHa = input.acres / 2.47;
  const n = input.n * areaHa;
  const p = input.p2o5 * areaHa;
  const k = input.k2o * areaHa;

  const dapKg = Math.round(p / 0.46);
  const nFromDap = dapKg * 0.18;
  const ureaKg = Math.round(Math.max(0, n - nFromDap) / 0.46);
  const mopKg = Math.round(k / 0.6);

  return { ureaKg, dapKg, mopKg, areaHa: Math.round(areaHa * 100) / 100 };
}
