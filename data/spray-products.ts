import type { SprayProduct } from "@/types/spray-rotation";
import { resolveMoAGroup } from "@/data/moa-lookup";

/**
 * Indian-market products for Spray Rotation Tracker.
 * MoA codes resolved from IRAC Ed. 11.5 / FRAC 2024 / HRAC numeric
 * (see data/moa-lookup.ts — sourced from user-supplied PDFs).
 */
function p(
  id: string,
  productName: string,
  activeIngredient: string,
  category: SprayProduct["category"],
  moaType: SprayProduct["moaType"],
  moaGroup: string,
  crops: string[],
  targets?: { pests?: string[]; diseases?: string[] },
  doseHint?: string
): SprayProduct {
  const moa = resolveMoAGroup(activeIngredient, moaType, moaGroup);
  return {
    id,
    productName,
    activeIngredient,
    category,
    moaType: moa.moaType,
    moaGroup: moa.moaGroup,
    cropRecommended: crops,
    targetPests: targets?.pests,
    targetDiseases: targets?.diseases,
    doseHint,
  };
}

const PADDY = ["paddy"];
const COTTON = ["cotton"];
const MAIZE = ["maize"];
const GROUNDNUT = ["moongfali", "groundnut"];
const ALL_FOUR = [...PADDY, ...COTTON, ...MAIZE, ...GROUNDNUT];

export const sprayProducts: SprayProduct[] = [
  // ─── PADDY INSECTICIDES ───
  p("p01", "Monocil 36 SL", "Monocrotophos", "insecticide", "IRAC", "1B", PADDY, { pests: ["p1", "p2"] }, "1.5 ml/L"),
  p("p02", "Regent 0.3 GR", "Fipronil", "insecticide", "IRAC", "2B", PADDY, { pests: ["p1"] }, "8 kg/ha granules"),
  p("p03", "Confidor 200 SL", "Imidacloprid", "insecticide", "IRAC", "4A", PADDY, { pests: ["p1", "p4"] }, "0.3 ml/L"),
  p("p04", "Actara 25 WG", "Thiamethoxam", "insecticide", "IRAC", "4A", PADDY, { pests: ["p1"] }, "0.2 g/L"),
  p("p05", "Orthene 75 SP", "Acephate", "insecticide", "IRAC", "1B", PADDY, { pests: ["p1", "p3"] }, "1.5 g/L"),
  p("p06", "Larvin 80 WP", "Thiodicarb", "insecticide", "IRAC", "1A", PADDY, { pests: ["p3"] }, "2 g/L"),
  p("p07", "Coragen 20 SC", "Chlorantraniliprole", "insecticide", "IRAC", "28", PADDY, { pests: ["p3", "p2"] }, "0.4 ml/L"),
  p("p08", "Proclaim 5 SG", "Emamectin benzoate", "insecticide", "IRAC", "6", PADDY, { pests: ["p3"] }, "0.4 g/L"),
  p("p09", "Cartap Hydrochloride 50 SP", "Cartap hydrochloride", "insecticide", "IRAC", "14", PADDY, { pests: ["p2"] }, "1 kg/ha"),
  p("p10", "Buprofezin 25 SC", "Buprofezin", "insecticide", "IRAC", "16", PADDY, { pests: ["p1"] }, "1 ml/L"),
  p("p11", "Pymetrozine 50 WG", "Pymetrozine", "insecticide", "IRAC", "9B", PADDY, { pests: ["p1"] }, "0.75 g/L"),
  p("p12", "Flubendiamide 20 WG", "Flubendiamide", "insecticide", "IRAC", "28", PADDY, { pests: ["p4"] }, "0.25 g/L"),
  p("p13", "Spinosad 45 SC", "Spinosad", "insecticide", "IRAC", "5", PADDY, { pests: ["p3", "p4"] }, "0.3 ml/L"),
  p("p14", "Deltamethrin 2.8 EC", "Deltamethrin", "insecticide", "IRAC", "3A", PADDY, { pests: ["p3"] }, "0.5 ml/L"),
  p("p15", "Lambda Cyhalothrin 5 EC", "Lambda-cyhalothrin", "insecticide", "IRAC", "3A", PADDY, { pests: ["p3", "p4"] }, "0.5 ml/L"),
  // ─── PADDY FUNGICIDES ───
  p("p16", "Bavistin 50 WP", "Carbendazim", "fungicide", "FRAC", "1", PADDY, { diseases: ["d2"] }, "1 g/L"),
  p("p17", "Tricyclazole 75 WP", "Tricyclazole", "fungicide", "FRAC", "16.1", PADDY, { diseases: ["d1"] }, "0.6 g/L"),
  p("p18", "Nativo 75 WG", "Trifloxystrobin + Tebuconazole", "fungicide", "FRAC", "11+3", PADDY, { diseases: ["d1"] }, "0.4 g/L"),
  p("p19", "Validamycin 3 L", "Validamycin", "fungicide", "FRAC", "26", PADDY, { diseases: ["d2"] }, "2.5 ml/L"),
  p("p20", "Kasugamycin 3 SL", "Kasugamycin", "fungicide", "FRAC", "24", PADDY, { diseases: ["d2"] }, "2 ml/L"),
  p("p21", "Copper Oxychloride 50 WP", "Copper oxychloride", "fungicide", "FRAC", "M1", PADDY, { diseases: ["d3"] }, "3 g/L"),
  p("p22", "Streptocycline 90 SP", "Streptocycline + Tetracycline", "fungicide", "FRAC", "25", PADDY, { diseases: ["d3"] }, "0.15 g/L"),
  p("p23", "Azoxystrobin 250 SC", "Azoxystrobin", "fungicide", "FRAC", "11", PADDY, { diseases: ["d1"] }, "1 ml/L"),
  p("p24", "Hexaconazole 5 EC", "Hexaconazole", "fungicide", "FRAC", "3", PADDY, { diseases: ["d2"] }, "1 ml/L"),
  p("p25", "Mancozeb 75 WP", "Mancozeb", "fungicide", "FRAC", "M3", PADDY, { diseases: ["d1", "d2"] }, "2 g/L"),
  // ─── PADDY HERBICIDES ───
  p("p26", "Pretilachlor 50 EC", "Pretilachlor", "herbicide", "HRAC", "15", PADDY, {}, "0.6 kg/ha"),
  p("p27", "Bispyribac Sodium 10 SC", "Bispyribac-sodium", "herbicide", "HRAC", "2", PADDY, {}, "25 g/ha"),
  p("p28", "Pyrazosulfuron 10 WP", "Pyrazosulfuron ethyl", "herbicide", "HRAC", "2", PADDY, {}, "20 g/ha"),
  p("p29", "Butachlor 50 EC", "Butachlor", "herbicide", "HRAC", "15", PADDY, {}, "1.0 kg/ha"),
  p("p30", "Anilofos 30 EC", "Anilofos", "herbicide", "HRAC", "8", PADDY, {}, "0.4 kg/ha"),
  // Extra paddy actives from IRAC brochure / Hindi MoA guide
  p("p31", "Pexalon 106 SC", "Triflumezopyrim", "insecticide", "IRAC", "4E", PADDY, { pests: ["p1"] }, "0.5 ml/L"),
  p("p32", "Ulala 50 WG", "Flonicamid", "insecticide", "IRAC", "29", PADDY, { pests: ["p1"] }, "0.3 g/L"),
  p("p33", "Pride 20 SP", "Acetamiprid", "insecticide", "IRAC", "4A", PADDY, { pests: ["p1", "p4"] }, "0.2 g/L"),

  // ─── COTTON INSECTICIDES ───
  p("c01", "Pegasus 50 WG", "Diafenthiuron", "insecticide", "IRAC", "12A", COTTON, { pests: ["p2"] }, "0.5 g/L"),
  p("c02", "Oberon 240 SC", "Spiromesifen", "insecticide", "IRAC", "23", COTTON, { pests: ["p2"] }, "0.5 ml/L"),
  p("c03", "Polo 500 SC", "Diafenthiuron", "insecticide", "IRAC", "12A", COTTON, { pests: ["p2"] }, "0.5 ml/L"),
  p("c04", "Intrepid 150 SC", "Methoxyfenozide", "insecticide", "IRAC", "18", COTTON, { pests: ["p1"] }, "1 ml/L"),
  p("c05", "Rynaxypyr 20 SC", "Chlorantraniliprole", "insecticide", "IRAC", "28", COTTON, { pests: ["p1"] }, "0.4 ml/L"),
  p("c06", "Endosulfan 35 EC", "Endosulfan", "insecticide", "IRAC", "2A", COTTON, { pests: ["p3"] }, "1.5 ml/L"),
  p("c07", "Quinalphos 25 EC", "Quinalphos", "insecticide", "IRAC", "1B", COTTON, { pests: ["p3"] }, "2 ml/L"),
  p("c08", "Triazophos 40 EC", "Triazophos", "insecticide", "IRAC", "1B", COTTON, { pests: ["p3"] }, "1.5 ml/L"),
  p("c09", "Pyriproxyfen 10 EC", "Pyriproxyfen", "insecticide", "IRAC", "7C", COTTON, { pests: ["p2"] }, "1 ml/L"),
  p("c10", "Profenophos 50 EC", "Profenophos", "insecticide", "IRAC", "1B", COTTON, { pests: ["p1", "p3"] }, "2 ml/L"),
  p("c11", "Indoxacarb 14.5 SC", "Indoxacarb", "insecticide", "IRAC", "22A", COTTON, { pests: ["p1"] }, "0.5 ml/L"),
  p("c12", "Novaluron 10 EC", "Novaluron", "insecticide", "IRAC", "15", COTTON, { pests: ["p1"] }, "1 ml/L"),
  // ─── COTTON FUNGICIDES ───
  p("c13", "Ridomil Gold 68 WP", "Metalaxyl-M + Mancozeb", "fungicide", "FRAC", "4+M3", COTTON, { diseases: ["d3"] }, "2 g/L"),
  p("c14", "Tilt 25 EC", "Propiconazole", "fungicide", "FRAC", "3", COTTON, { diseases: ["d2"] }, "1 ml/L"),
  p("c15", "Score 250 EC", "Difenoconazole", "fungicide", "FRAC", "3", COTTON, { diseases: ["d2"] }, "0.5 ml/L"),
  p("c16", "Antracol 70 WP", "Propineb", "fungicide", "FRAC", "M3", COTTON, { diseases: ["d2"] }, "2 g/L"),
  p("c17", "Blitox 50 WP", "Copper oxychloride", "fungicide", "FRAC", "M1", COTTON, { diseases: ["d1"] }, "3 g/L"),
  p("c18", "Kavach 40 EC", "Chlorothalonil", "fungicide", "FRAC", "M5", COTTON, { diseases: ["d2"] }, "2 ml/L"),
  // ─── COTTON HERBICIDES ───
  p("c19", "Pendimethalin 30 EC", "Pendimethalin", "herbicide", "HRAC", "3", COTTON, {}, "1.0 kg/ha"),
  p("c20", "Fluchloralin 45 EC", "Fluchloralin", "herbicide", "HRAC", "3", COTTON, {}, "1.0 kg/ha"),
  p("c21", "Diuron 80 WP", "Diuron", "herbicide", "HRAC", "5", COTTON, {}, "1.0 kg/ha"),
  p("c22", "Trifluralin 48 EC", "Trifluralin", "herbicide", "HRAC", "3", COTTON, {}, "1.0 kg/ha"),
  p("c23", "Dantotsu 50 WG", "Clothianidin", "insecticide", "IRAC", "4A", COTTON, { pests: ["p2"] }, "0.2 g/L"),
  p("c24", "Broflanilide 300 SC", "Broflanilide", "insecticide", "IRAC", "30", COTTON, { pests: ["p1"] }, "0.2 ml/L"),

  // ─── MAIZE INSECTICIDES ───
  p("m01", "Delegate 11.7 SC", "Spinetoram", "insecticide", "IRAC", "5", MAIZE, { pests: ["p1"] }, "0.9 ml/L"),
  p("m02", "Ampligo 150 ZC", "Chlorantraniliprole + Lambda-cyhalothrin", "insecticide", "IRAC", "28+3A", MAIZE, { pests: ["p1"] }, "0.5 ml/L"),
  p("m03", "Lannate 40 SP", "Methomyl", "insecticide", "IRAC", "1A", MAIZE, { pests: ["p1", "p2"] }, "1 g/L"),
  p("m04", "Furadan 3G", "Carbofuran", "insecticide", "IRAC", "1A", MAIZE, { pests: ["p3"] }, "8 kg/ha"),
  p("m05", "Sevin 50 WP", "Carbaryl", "insecticide", "IRAC", "1A", MAIZE, { pests: ["p2"] }, "2 g/L"),
  p("m06", "Tracer 480 SC", "Spinosad", "insecticide", "IRAC", "5", MAIZE, { pests: ["p1"] }, "0.3 ml/L"),
  p("m07", "Belt 480 SC", "Flubendiamide", "insecticide", "IRAC", "28", MAIZE, { pests: ["p1"] }, "0.25 ml/L"),
  p("m08", "Cymbush 10 EC", "Cypermethrin", "insecticide", "IRAC", "3A", MAIZE, { pests: ["p2"] }, "0.5 ml/L"),
  // ─── MAIZE FUNGICIDES ───
  p("m09", "Nativo 75 WG", "Trifloxystrobin + Tebuconazole", "fungicide", "FRAC", "11+3", MAIZE, { diseases: ["d1"] }, "0.4 g/L"),
  p("m10", "Amistar Top 325 SC", "Azoxystrobin + Difenoconazole", "fungicide", "FRAC", "11+3", MAIZE, { diseases: ["d1"] }, "1 ml/L"),
  p("m11", "Curzate M8 68 WP", "Mancozeb + Cymoxanil", "fungicide", "FRAC", "M3+27", MAIZE, { diseases: ["d2"] }, "2 g/L"),
  p("m12", "Carbendazim 50 WP", "Carbendazim", "fungicide", "FRAC", "1", MAIZE, { diseases: ["d3"] }, "1 g/L"),
  // ─── MAIZE HERBICIDES ───
  p("m13", "Atrazine 50 WP", "Atrazine", "herbicide", "HRAC", "5", MAIZE, {}, "1.0 kg/ha"),
  p("m14", "Tembotrione 42 SC", "Tembotrione", "herbicide", "HRAC", "27", MAIZE, {}, "120 g/ha"),
  p("m15", "2,4-D Na Salt 80 WP", "2,4-D sodium salt", "herbicide", "HRAC", "4", MAIZE, {}, "0.5 kg/ha"),
  p("m16", "Nicosulfuron 75 WG", "Nicosulfuron", "herbicide", "HRAC", "2", MAIZE, {}, "20 g/ha"),
  p("m17", "Alachlor 50 EC", "Alachlor", "herbicide", "HRAC", "15", MAIZE, {}, "1.0 kg/ha"),

  // ─── GROUNDNUT INSECTICIDES ───
  p("g01", "Quinalphos 25 EC", "Quinalphos", "insecticide", "IRAC", "1B", GROUNDNUT, { pests: ["p1"] }, "2 ml/L"),
  p("g02", "Chlorpyrifos 20 EC", "Chlorpyrifos", "insecticide", "IRAC", "1B", GROUNDNUT, { pests: ["p2"] }, "2.5 ml/L"),
  p("g03", "Dimethoate 30 EC", "Dimethoate", "insecticide", "IRAC", "1B", GROUNDNUT, { pests: ["p1"] }, "1.5 ml/L"),
  p("g04", "Carbaryl 50 WP", "Carbaryl", "insecticide", "IRAC", "1A", GROUNDNUT, { pests: ["p3"] }, "2 g/L"),
  p("g05", "Indoxacarb 14.5 SC", "Indoxacarb", "insecticide", "IRAC", "22A", GROUNDNUT, { pests: ["p1"] }, "0.5 ml/L"),
  p("g06", "Emamectin benzoate 5 SG", "Emamectin benzoate", "insecticide", "IRAC", "6", GROUNDNUT, { pests: ["p1"] }, "0.4 g/L"),
  // ─── GROUNDNUT FUNGICIDES ───
  p("g07", "Mancozeb 75 WP", "Mancozeb", "fungicide", "FRAC", "M3", GROUNDNUT, { diseases: ["d1", "d2"] }, "2 g/L"),
  p("g08", "Hexaconazole 5 EC", "Hexaconazole", "fungicide", "FRAC", "3", GROUNDNUT, { diseases: ["d1"] }, "1 ml/L"),
  p("g09", "Tebuconazole 250 EC", "Tebuconazole", "fungicide", "FRAC", "3", GROUNDNUT, { diseases: ["d1"] }, "0.5 ml/L"),
  p("g10", "Carbendazim + Mancozeb", "Carbendazim + Mancozeb", "fungicide", "FRAC", "1+M3", GROUNDNUT, { diseases: ["d2"] }, "2 g/L"),
  p("g11", "Chlorothalonil 75 WP", "Chlorothalonil", "fungicide", "FRAC", "M5", GROUNDNUT, { diseases: ["d1"] }, "2 g/L"),
  p("g12", "Metalaxyl + Mancozeb", "Metalaxyl + Mancozeb", "fungicide", "FRAC", "4+M3", GROUNDNUT, { diseases: ["d3"] }, "2 g/L"),
  // ─── GROUNDNUT HERBICIDES ───
  p("g13", "Pendimethalin 30 EC", "Pendimethalin", "herbicide", "HRAC", "3", GROUNDNUT, {}, "1.0 kg/ha"),
  p("g14", "Imazethapyr 10 SL", "Imazethapyr", "herbicide", "HRAC", "2", GROUNDNUT, {}, "100 g/ha"),
  p("g15", "Quizalofop ethyl 5 EC", "Quizalofop-ethyl", "herbicide", "HRAC", "1", GROUNDNUT, {}, "50 g/ha"),

  // ─── CROSS-CROP ADDITIONAL (fill to ~100) ───
  p("x01", "Thiamethoxam 25 WG", "Thiamethoxam", "insecticide", "IRAC", "4A", ALL_FOUR, { pests: ["p1", "p2"] }, "0.2 g/L"),
  p("x02", "Fipronil 5 SC", "Fipronil", "insecticide", "IRAC", "2B", ALL_FOUR, { pests: ["p2", "p3"] }, "1.5 ml/L"),
  p("x03", "Abamectin 1.9 EC", "Abamectin", "insecticide", "IRAC", "6", ALL_FOUR, { pests: ["p2"] }, "0.5 ml/L"),
  p("x04", "Etofenprox 10 EW", "Etofenprox", "insecticide", "IRAC", "3A", ALL_FOUR, { pests: ["p1"] }, "1 ml/L"),
  p("x05", "Pyridalyl 10 EC", "Pyridalyl", "insecticide", "IRAC", "UN", ALL_FOUR, { pests: ["p3"] }, "1 ml/L"),
  p("x06", "Propiconazole 25 EC", "Propiconazole", "fungicide", "FRAC", "3", ALL_FOUR, { diseases: ["d1", "d2"] }, "1 ml/L"),
  p("x07", "Tebuconazole 25 EC", "Tebuconazole", "fungicide", "FRAC", "3", ALL_FOUR, { diseases: ["d1"] }, "0.5 ml/L"),
  p("x08", "Difenoconazole 250 EC", "Difenoconazole", "fungicide", "FRAC", "3", ALL_FOUR, { diseases: ["d2"] }, "0.5 ml/L"),
  p("x09", "Copper Hydroxide 77 WP", "Copper hydroxide", "fungicide", "FRAC", "M1", ALL_FOUR, { diseases: ["d1"] }, "2 g/L"),
  p("x10", "Sulphur 80 WP", "Wettable sulphur", "fungicide", "FRAC", "M2", ALL_FOUR, { diseases: ["d2"] }, "3 g/L"),
  p("x11", "Glyphosate 41 SL", "Glyphosate", "herbicide", "HRAC", "9", ALL_FOUR, {}, "3 L/ha directed"),
  p("x12", "Paraquat 24 SL", "Paraquat dichloride", "herbicide", "HRAC", "22", ALL_FOUR, {}, "1.5 L/ha"),
  p("x13", "Oxyfluorfen 23.5 EC", "Oxyfluorfen", "herbicide", "HRAC", "14", ALL_FOUR, {}, "0.15 kg/ha"),
  p("x14", "Metribuzin 70 WP", "Metribuzin", "herbicide", "HRAC", "5", ALL_FOUR, {}, "0.35 kg/ha"),
  p("x15", "Halosulfuron 75 WG", "Halosulfuron-methyl", "herbicide", "HRAC", "2", ALL_FOUR, {}, "36 g/ha"),
  p("x16", "Chlorantraniliprole 18.5 SC", "Chlorantraniliprole", "insecticide", "IRAC", "28", ALL_FOUR, { pests: ["p1", "p3"] }, "0.4 ml/L"),
  p("x17", "Cyantraniliprole 10 OD", "Cyantraniliprole", "insecticide", "IRAC", "28", ALL_FOUR, { pests: ["p1"] }, "0.5 ml/L"),
  p("x18", "Metaflumizone 24 SC", "Metaflumizone", "insecticide", "IRAC", "22B", ALL_FOUR, { pests: ["p3"] }, "1 ml/L"),
  p("x19", "Pyrifluquinazon 20 WG", "Pyrifluquinazon", "insecticide", "IRAC", "9B", ALL_FOUR, { pests: ["p1"] }, "0.2 g/L"),
  p("x20", "Sulfoxaflor 21.8 SC", "Sulfoxaflor", "insecticide", "IRAC", "4C", ALL_FOUR, { pests: ["p1", "p2"] }, "0.3 ml/L"),
  p("x21", "Fluxapyroxad + Pyraclostrobin", "Fluxapyroxad + Pyraclostrobin", "fungicide", "FRAC", "7+11", ALL_FOUR, { diseases: ["d1"] }, "0.5 ml/L"),
  p("x22", "Isoprothiolane 40 EC", "Isoprothiolane", "fungicide", "FRAC", "6", PADDY, { diseases: ["d1"] }, "1.5 ml/L"),
  p("x23", "Edifenphos 50 EC", "Edifenphos", "fungicide", "FRAC", "6", PADDY, { diseases: ["d1"] }, "1 ml/L"),
  p("x24", "Carboxin 75 WP", "Carboxin", "fungicide", "FRAC", "7", GROUNDNUT, { diseases: ["d3"] }, "2 g/kg seed"),
  p("x25", "Trichoderma viride 1%", "Trichoderma viride", "fungicide", "FRAC", "BM02", ALL_FOUR, { diseases: ["d2", "d3"] }, "5 g/kg seed"),
];

export function getProductById(id: string): SprayProduct | undefined {
  return sprayProducts.find((p) => p.id === id);
}

export function getProductsForCrop(cropSlug: string): SprayProduct[] {
  const slug = cropSlug === "groundnut" ? "moongfali" : cropSlug;
  return sprayProducts.filter((p) => p.cropRecommended.includes(slug));
}
