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
    splits: ["50% N basal", "25% N at tillering", "25% N at panicle initiation"],
    notes: ["Lowland transplanted: 100:60:60 NPK kg/ha", "Upland: 90:60:60", "Hybrid rice: 120-150 N"],
  },
  {
    cropSlug: "maize",
    cropName: "Maize",
    source: "MaizePackage.pdf / maize-profile",
    n: 180,
    p2o5: 60,
    k2o: 40,
    micronutrients: ["ZnSO₄ 25 kg/ha in deficient soils"],
    splits: ["50% N at sowing", "25% N knee-high (~35 DAS)", "25% N pre-tasseling"],
    notes: ["Kharif hybrid: 72-80 kg N/acre equivalent", "Critical irrigation at silking"],
  },
  {
    cropSlug: "cotton",
    cropName: "Cotton",
    source: "cotton.pdf",
    n: 120,
    p2o5: 60,
    k2o: 60,
    micronutrients: ["ZnSO₄ 5.5 kg/ha once in two cotton-wheat cycles (North zone)"],
    splits: ["North: half N at thinning, rest at first flowering", "Central/South hybrids: N in 3-4 splits at squaring and peak flowering"],
    notes: ["Bt hybrid irrigated: adjust to 150-240 N for high-yield blocks", "P & K per soil test"],
  },
  {
    cropSlug: "soybean",
    cropName: "Soybean",
    source: "Soybeanpackageofpractices.pdf",
    n: 20,
    p2o5: 60,
    k2o: 40,
    micronutrients: ["Gypsum 150-200 kg/ha with FYM if no S source", "Rhizobium + PSB seed treatment"],
    splits: ["Full basal at sowing — legume fixes 60-100 kg N"],
    notes: ["FYM 5-10 t/ha", "Do not over-apply N — reduces nodulation"],
  },
  {
    cropSlug: "bajra",
    cropName: "Bajra (Pearl millet)",
    source: "Recommended_package_of_practices-Pearl_millet.pdf",
    n: 60,
    p2o5: 30,
    k2o: 0,
    micronutrients: ["ZnSO₄ 10 kg/ha in deficient soils", "0.2% ZnSO₄ foliar if needed"],
    splits: ["Arid: 40N+20P", "Semi-arid: 60N+30P", "Half N at sowing, half at 25 DAS on sandy soils"],
    notes: ["Seed rate 3-4 kg/ha", "Do not place fertilizer in seed furrow"],
  },
  {
    cropSlug: "moongfali",
    cropName: "Moongfali (Groundnut)",
    source: "moongfali.pdf",
    n: 20,
    p2o5: 40,
    k2o: 50,
    micronutrients: ["Gypsum 500 kg/ha at flowering", "ZnSO₄ 50 kg/ha once in 3 seasons if deficient"],
    splits: ["Kharif: full basal", "Rabi: basal + 10 kg N at flowering"],
    notes: ["Rhizobium + PSB", "FYM 10 t/ha once in 2-3 seasons", "P through SSP"],
  },
  {
    cropSlug: "chilli",
    cropName: "Chilli",
    source: "chilli.pdf / chilli-profile",
    n: 120,
    p2o5: 60,
    k2o: 60,
    micronutrients: ["Boron 0.2% foliar at flowering", "Ca foliar at fruiting"],
    splits: ["Basal NPK + top-dress N at 30, 45, 60 DAT"],
    notes: ["FYM 10-12 t/ha", "Avoid excess N after flowering — thrips/mite risk"],
  },
  {
    cropSlug: "tomato",
    cropName: "Tomato",
    source: "PRECISION_FARMING_TECHNOLOGIES_new.pdf",
    n: 200,
    p2o5: 250,
    k2o: 250,
    micronutrients: ["19:19:19+MN @ 0.5% at 18 DAS nursery", "Micronutrient mix 0.1% at 40 & 80 DAT"],
    splits: ["Fertigation split every 3 days through drip", "75% SSP as basal"],
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
    splits: ["Full basal NPK at planting", "Earthing up with second N if needed"],
    notes: ["FYM 15-20 t/ha", "Critical irrigation at tuber initiation"],
  },
  {
    cropSlug: "wheat",
    cropName: "Wheat",
    source: "NFSM / standard PoP",
    n: 120,
    p2o5: 60,
    k2o: 40,
    micronutrients: ["ZnSO₄ 25 kg/ha on deficient soils"],
    splits: ["Half N at sowing", "Half N at first irrigation (CRI ~21 DAS)"],
    notes: ["Avoid late sowing for Karnal bunt risk"],
  },
  {
    cropSlug: "sugarcane",
    cropName: "Sugarcane",
    source: "ICAR-IISR / state sugarcane PoP",
    n: 250,
    p2o5: 80,
    k2o: 120,
    micronutrients: ["ZnSO₄ / FeSO4 if chlorosis on alkaline soils", "Trash mulching after earthing"],
    splits: ["Basal P+K at planting", "N in 2–3 splits till grand growth", "Last N before monsoon peak"],
    notes: ["FYM 10-15 t/ha", "Ratoon: reduce N slightly; gap filling essential"],
  },
  {
    cropSlug: "onion",
    cropName: "Onion",
    source: "NHRDF / ICAR vegetable PoP",
    n: 100,
    p2o5: 50,
    k2o: 50,
    micronutrients: ["S through gypsum/SSP — quality bulbs", "Boron if hollow stems"],
    splits: ["Basal NPK at transplant/sowing", "Top-dress N at 30 & 45 DAT"],
    notes: ["FYM 15-20 t/ha", "Avoid excess late N — soft bulbs / poor storage"],
  },
  {
    cropSlug: "cauliflower",
    cropName: "Cauliflower",
    source: "ICAR vegetable PoP",
    n: 120,
    p2o5: 80,
    k2o: 60,
    micronutrients: ["Boron (borax) critical — prevents browning", "Mo if deficiency on sandy soils"],
    splits: ["Basal + top-dress N at curd initiation"],
    notes: ["FYM 20 t/ha", "Maintain cool temperatures for curd quality"],
  },
  {
    cropSlug: "brinjal",
    cropName: "Brinjal",
    source: "ICAR / SAU vegetable PoP",
    n: 100,
    p2o5: 50,
    k2o: 50,
    micronutrients: ["Foliar micronutrient mix if stunting"],
    splits: ["Basal + N splits at 30, 60 DAT"],
    notes: ["FYM 20 t/ha", "Stake tall hybrids; drip fertigation preferred"],
  },
  {
    cropSlug: "cucumber",
    cropName: "Cucumber",
    source: "Protected cultivation / ICAR PoP",
    n: 80,
    p2o5: 40,
    k2o: 40,
    micronutrients: ["Ca foliar for tip burn under protected culture"],
    splits: ["Basal + frequent light fertigation under drip"],
    notes: ["Avoid water stress at flowering/fruiting", "Organic mulch helps"],
  },
  {
    cropSlug: "mustard",
    cropName: "Mustard",
    source: "ICAR / mustard PoP",
    n: 80,
    p2o5: 40,
    k2o: 40,
    micronutrients: ["Sulphur critical — gypsum/SSP", "Boron for sterility issues"],
    splits: ["Basal + top-dress N at 30 DAS"],
    notes: ["S deficiency hurts oil quality", "Avoid waterlogging"],
  },
  {
    cropSlug: "moong",
    cropName: "Moong",
    source: "ICAR pulse PoP",
    n: 20,
    p2o5: 40,
    k2o: 20,
    micronutrients: ["Rhizobium + PSB seed treatment", "Mo for acid soils"],
    splits: ["Full basal — legume"],
    notes: ["Do not overload N", "FYM 5 t/ha improves yield"],
  },
  {
    cropSlug: "pulses",
    cropName: "Arhar / Tur",
    source: "ICAR pigeonpea PoP",
    n: 25,
    p2o5: 50,
    k2o: 20,
    micronutrients: ["Rhizobium + PSB", "ZnSO₄ if deficient"],
    splits: ["Basal at sowing; light N only if poor nodulation"],
    notes: ["Line sowing + drainage important", "Intercrop options in rainfed"],
  },
  {
    cropSlug: "bhindi",
    cropName: "Bhindi (Okra)",
    source: "ICAR vegetable PoP",
    n: 80,
    p2o5: 40,
    k2o: 40,
    micronutrients: ["Foliar NPK+MN if YVM stress plants"],
    splits: ["Basal + N at 30 DAS"],
    notes: ["FYM 10-15 t/ha", "Resistant varieties reduce pesticide load"],
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
