import { dataKeyForSlug } from "@/data/agriveda2/crop-slug-map";

export type NutrientValue = string | number | Record<string, string | number | boolean>;

export interface FertilizerCropEntry {
  N?: NutrientValue;
  P?: NutrientValue;
  K?: NutrientValue;
  Ca?: NutrientValue;
  Mg?: NutrientValue;
  S?: NutrientValue;
  Zn?: NutrientValue;
  Fe?: NutrientValue;
  B?: NutrientValue;
  Mo?: NutrientValue;
  Si?: NutrientValue;
  Rhizobium?: NutrientValue;
  Rhizobium_PSB?: NutrientValue;
  fertilizer_bags_per_acre?: Record<string, string>;
  fertilizer_bags?: Record<string, string>;
  schedule?: { time: string; apply: string }[];
}

export const FERTILIZER_DATA: Record<string, FertilizerCropEntry> = {
  "Gehun (Wheat)": {
    N: { total: 50, basal: 25, top1: "CRI stage (21 DAS): 12.5 kg", top2: "Tillering (45 DAS): 12.5 kg" },
    P: { total: 25, basal: 25, note: "Poora P bunai ke samay dena hai" },
    K: { total: 12, basal: 12, note: "Poora K bunai ke samay" },
    S: { total: 8, source: "Gypsum 40 kg/acre — bunai ke samay", note: "Zyada zaroori agar SSP use na ho" },
    Zn: { total: 5, source: "ZnSO4 21% — bunai ke samay", note: "Har 3 saal mein ek baar zaroori" },
    Fe: {
      apply: "Only if deficiency seen",
      dose: "FeSO4 10 kg/acre basal OR 0.5% FeSO4 spray",
      symptoms: "Nyi pattiyaan peeli padna (interveinal chlorosis)",
    },
    fertilizer_bags_per_acre: {
      DAP: "55 kg (P + N dono milta hai)",
      Urea: "75 kg (remaining N ke liye)",
      MOP: "20 kg",
      Gypsum: "40 kg",
      ZnSO4_21: "5 kg",
    },
    schedule: [
      { time: "Bunai ke samay (Basal)", apply: "DAP 55kg + MOP 20kg + Gypsum 40kg + ZnSO4 5kg" },
      { time: "21 DAS (CRI — pehli sinchai ke baad)", apply: "Urea 38 kg" },
      { time: "45 DAS (Tillering)", apply: "Urea 37 kg" },
    ],
  },

  "Dhan (Paddy)": {
    N: { total: 50, split: "Basal: 12 kg | Tillering (21 DAT): 20 kg | Panicle initiation (45 DAT): 18 kg" },
    P: { total: 20, basal: 20 },
    K: { total: 20, split: "Basal: 10 kg | Panicle initiation: 10 kg" },
    Zn: { total: 5, source: "ZnSO4 21% kg/acre", note: "Khaali khet mein pichli fasal ke baad dena best hai" },
    S: { total: 8, source: "Gypsum 40 kg/acre", note: "Zyada zaroori is UP/Bihar ki mitti mein" },
    Fe: {
      apply: "Agar paudhe peele paden (Fe deficiency)",
      dose: "FeSO4 0.5% + Citric acid 0.1% spray, 2-3 baar 10 din ke antral par",
    },
    fertilizer_bags: { DAP: "44 kg", Urea: "80 kg (total, teen bhagon mein)", MOP: "33 kg", ZnSO4_21: "5 kg" },
  },

  "Makka (Maize)": {
    N: { total: 60, split: "Basal: 20 kg | V4 stage (30 DAS): 20 kg | V8 stage (50 DAS): 20 kg" },
    P: { total: 25, basal: 25 },
    K: { total: 20, basal: 20 },
    S: { total: 10, source: "Gypsum 50 kg/acre — bunai ke samay" },
    Zn: { total: 5, source: "ZnSO4 21% — bunai ke samay" },
    Mg: { dose: "MgSO4 5 kg/acre — foliar spray 0.5% agar chlorosis dike" },
    fertilizer_bags: { DAP: "55 kg", Urea: "95 kg (3 bhagon mein)", MOP: "33 kg", Gypsum: "50 kg", ZnSO4_21: "5 kg" },
  },

  "Sarson (Mustard)": {
    N: { total: 25, split: "Basal: 12.5 kg | 30 DAS: 12.5 kg" },
    P: { total: 15, basal: 15 },
    K: { total: 8, basal: 8 },
    S: {
      total: 12,
      source: "Gypsum 60 kg/acre — BAHUT ZAROORI for mustard quality",
      note: "S deficiency se erucic acid badhta hai, oil quality girti hai",
    },
    B: { total: 0.5, source: "Borax 1 kg/acre — bunai ke samay", note: "Flowering stage mein foliar: Boron 0.1% spray" },
    Zn: { dose: "ZnSO4 5 kg/acre agar deficiency history ho" },
    fertilizer_bags: { DAP: "33 kg", Urea: "24 kg (dono kishtein mila ke)", MOP: "13 kg", Gypsum: "60 kg", Borax: "1 kg" },
  },

  "Chana (Chickpea)": {
    N: { total: 8, basal: 8, note: "Zyada N mat dena — nodules se khud N fix karta hai. Starter dose only." },
    P: { total: 20, basal: 20 },
    K: { total: 8, basal: 8 },
    S: { total: 8, source: "Gypsum 40 kg/acre" },
    Zn: { dose: "ZnSO4 5 kg/acre basal agar deficiency ho" },
    Rhizobium: {
      essential: true,
      note: "Rhizobium culture 200g/10kg beej — 40-60% N ki bachat hoti hai, yield 15-20% badhti hai",
    },
    fertilizer_bags: { SSP: "125 kg (P + S dono milta hai — better for chana)", Urea: "18 kg (sirf basal)", MOP: "13 kg" },
  },

  "Soybean": {
    N: { total: 8, basal: 8, note: "Rhizobium nodules se N milti hai — zyada N mat dena" },
    P: { total: 30, basal: 30 },
    K: { total: 20, basal: 20 },
    S: { total: 10, source: "Gypsum 50 kg/acre — bahut zaroori protein quality ke liye" },
    Zn: { total: 5, source: "ZnSO4 5 kg/acre basal" },
    Mo: { dose: "Ammonium molybdate 200g/acre — seed treatment mein milao", note: "Nodule formation improve karta hai" },
    Rhizobium_PSB: { essential: true },
  },

  "Alu (Potato)": {
    N: { total: 80, split: "Bunai ke samay: 40 kg | 30 DAS mitti chadhaate samay: 40 kg" },
    P: { total: 40, basal: 40 },
    K: { total: 50, split: "Bunai: 25 kg | 30 DAS: 25 kg", note: "K starch quality improve karta hai — bahut zaroori" },
    Ca: { total: 20, source: "Gypsum 100 kg/acre ya Calcium nitrate 25 kg", note: "Common scab rokne ke liye important" },
    Mg: { total: 10, source: "MgSO4 50 kg/acre basal", note: "Chlorophyll ke liye zaroori" },
    S: { total: 12, source: "Gypsum se milta hai — alag se nahi dena" },
    Zn: { total: 5, source: "ZnSO4 5 kg/acre basal" },
    Fe: { dose: "FeSO4 0.5% foliar spray agar interveinal chlorosis dike" },
    B: { total: 0.5, source: "Borax 1 kg/acre", note: "Tuber size uniform rakta hai" },
    fertilizer_bags: {
      DAP: "88 kg",
      Urea: "95 kg (2 bhagon mein)",
      MOP: "84 kg",
      Gypsum: "100 kg",
      MgSO4: "50 kg",
      ZnSO4_21: "5 kg",
      Borax: "1 kg",
    },
  },

  "Tamatar (Tomato)": {
    N: { total: 60, split: "Transplanting: 20 kg | 30 DAT: 20 kg | Fruiting: 20 kg" },
    P: { total: 35, basal: 35, note: "Bunai se pehle hi daalna hai" },
    K: { total: 45, split: "Transplanting: 15 kg | Fruiting shuru: 20 kg | Mid-fruiting: 10 kg", note: "K fruit quality aur shelf life badhata hai" },
    Ca: { total: 25, source: "Calcium nitrate 25 kg foliar ya Gypsum 125 kg basal", note: "Blossom End Rot rokne ke liye CRITICAL" },
    Mg: { total: 8, source: "MgSO4 0.5% foliar spray 3 baar, ya 20 kg basal" },
    S: { total: 10, source: "Gypsum 50 kg/acre basal" },
    Zn: { total: 5, source: "ZnSO4 5 kg/acre basal ya 0.5% foliar" },
    Fe: { dose: "Chelated Fe (EDTA) 0.2% foliar spray agar chlorosis ho" },
    B: { dose: "Borax 0.1-0.2% foliar spray flowering mein — fruit setting ke liye zaroori" },
    fertilizer_bags: {
      DAP: "77 kg",
      Urea: "80 kg (teen bhagon mein)",
      MOP: "75 kg",
      Gypsum: "50 kg",
      Calcium_nitrate: "25 kg (foliar mein use karo fruiting mein)",
      MgSO4: "20 kg",
      ZnSO4_21: "5 kg",
    },
  },

  "Baingan (Brinjal)": {
    N: { total: 50, split: "Transplanting: 17 kg | 30 DAT: 17 kg | Fruiting: 16 kg" },
    P: { total: 30, basal: 30 },
    K: { total: 30, split: "Basal: 15 kg | Fruiting mein: 15 kg" },
    Ca: { dose: "Calcium nitrate 0.5% foliar — fruiting mein 2 baar" },
    Mg: { dose: "MgSO4 0.5% foliar spray — agar pattiyaan peeli paden" },
    Zn: { dose: "ZnSO4 5 kg/acre basal" },
    B: { dose: "Borax 0.1% foliar — flowering mein" },
  },

  "Mirch (Chilli)": {
    N: { total: 50, split: "Transplanting: 17 kg | 30 DAT: 17 kg | Fruiting: 16 kg" },
    P: { total: 30, basal: 30 },
    K: { total: 35, split: "Basal: 15 kg | Fruiting shuru: 20 kg", note: "K capsaicin content badhata hai" },
    Ca: { dose: "Calcium nitrate 0.3-0.5% foliar spray blossom end rot rokne ke liye" },
    Mg: { dose: "MgSO4 0.5% foliar spray 2-3 baar" },
    S: { dose: "Gypsum 40 kg/acre basal" },
    Zn: { dose: "ZnSO4 5 kg/acre basal" },
    B: { dose: "Borax 0.1% foliar — flowering mein" },
  },

  "Gobhi (Cauliflower)": {
    N: { total: 55, split: "Transplanting: 18 kg | 25 DAT: 18 kg | Curd formation: 19 kg" },
    P: { total: 25, basal: 25 },
    K: { total: 25, basal: 25 },
    Ca: { total: 15, source: "Gypsum 75 kg/acre", note: "Tip burn rokne ke liye zaroori" },
    Mg: { dose: "MgSO4 0.5% foliar spray 2 baar" },
    S: { dose: "Gypsum se milta hai — alag se nahi chahiye" },
    B: { dose: "Borax 1 kg/acre basal ya 0.2% foliar", note: "Hollow stem aur browning rokta hai — CRITICAL" },
    Mo: { dose: "Ammonium molybdate 0.5% foliar spray agar whiptail symptom ho" },
  },

  "Bhindi (Okra)": {
    N: { total: 25, split: "Bunai: 12.5 kg | 30 DAS: 12.5 kg" },
    P: { total: 20, basal: 20 },
    K: { total: 15, basal: 15 },
    S: { dose: "Gypsum 30 kg/acre — basal" },
    Zn: { dose: "ZnSO4 5 kg/acre basal" },
  },

  "Ganna (Sugarcane)": {
    N: { total: 100, split: "Bunai: 25 kg | 3 mahine: 50 kg | 5-6 mahine: 25 kg" },
    P: { total: 35, basal: 35 },
    K: { total: 40, split: "Bunai: 20 kg | 3 mahine: 20 kg" },
    Ca: { dose: "Lime/Chuna 200 kg/acre agar mitti acidic ho (pH <6.5)" },
    Mg: { dose: "MgSO4 25 kg/acre agar deficiency ho" },
    S: { dose: "Gypsum 80 kg/acre — basal" },
    Zn: { dose: "ZnSO4 10 kg/acre — very important for sugarcane yield" },
    Fe: { dose: "FeSO4 10 kg/acre basal ya foliar agar chlorosis ho" },
    Si: { note: "Silica application (200 kg slag/acre) se stem borer resistance badhti hai" },
  },
};

export const FERTILIZER_SOURCES = {
  "N (Nitrogen)": {
    "Urea (46% N)": "kg Urea = (N kg × 100) / 46",
    "DAP (18% N + 46% P2O5)": "P ke hisaab se calculate karo, N bonus milegi",
  },
  "P (Phosphorus as P2O5)": {
    "DAP (46% P2O5)": "kg DAP = (P kg × 100) / 46",
    "SSP (16% P2O5)": "kg SSP = (P kg × 100) / 16",
  },
  "K (Potassium as K2O)": {
    "MOP/KCl (60% K2O)": "kg MOP = (K kg × 100) / 60",
    "SOP (50% K2O)": "kg SOP = (K kg × 100) / 50",
  },
  Zn: {
    "ZnSO4 21%": "kg ZnSO4 = Zn requirement × 4.76",
    "ZnSO4 33%": "kg ZnSO4 = Zn requirement × 3.03",
  },
  S: {
    "Gypsum (18% S)": "kg Gypsum = (S kg × 100) / 18",
    "Elemental S (90%)": "kg S = (S kg × 100) / 90",
  },
};

export const FERTILIZER_UNIT_NOTE =
  "N = Elemental Nitrogen (kg/acre) · P = P2O5 · K = K2O · Ca/Mg/S = elemental kg/acre · Zn = ZnSO4 · Fe = FeSO4 · B = Borax";

export function getFertilizerForSlug(slug: string): FertilizerCropEntry | null {
  const key = dataKeyForSlug(slug);
  return key ? FERTILIZER_DATA[key] ?? null : null;
}

export function formatNutrientValue(v: NutrientValue): string {
  if (typeof v === "string" || typeof v === "number") return String(v);
  return Object.entries(v)
    .map(([k, val]) => `${k}: ${val}`)
    .join(" · ");
}

export function scaleBagKg(kgStr: string, acres: number): string {
  const m = kgStr.match(/^([\d.]+)\s*kg/);
  if (!m) return kgStr;
  const scaled = Math.round(parseFloat(m[1]) * acres);
  return kgStr.replace(m[0], `${scaled} kg`);
}
