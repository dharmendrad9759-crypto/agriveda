export type MoABadgeType = "IRAC" | "FRAC" | "HRAC";

export interface ControlRecommendation {
  id: string;
  activeIngredient: string;
  target: string;
  moaBadge: string;
  moaType: MoABadgeType;
  doseHint?: string;
  notes?: string;
}

const PADDY_CONTROLS: ControlRecommendation[] = [
  {
    id: "paddy-ysb-cta",
    activeIngredient: "Chlorantraniliprole 18.5% SC",
    target: "Yellow Stem Borer",
    moaBadge: "IRAC Group 28",
    moaType: "IRAC",
    doseHint: "0.4 ml/L · PHI 14 days",
    notes: "Direct spray into whorl at dead-heart stage; alternate with IRAC 14.",
  },
  {
    id: "paddy-ysb-cartap",
    activeIngredient: "Cartap hydrochloride 50% SP",
    target: "Yellow Stem Borer",
    moaBadge: "IRAC Group 14",
    moaType: "IRAC",
    doseHint: "1 kg/ha granules at tillering",
  },
  {
    id: "paddy-bph-bupro",
    activeIngredient: "Buprofezin 25% SC",
    target: "Brown Planthopper",
    moaBadge: "IRAC Group 16",
    moaType: "IRAC",
    doseHint: "1 ml/L toward plant base",
    notes: "Do not follow with IRAC 4A neonics in next spray.",
  },
  {
    id: "paddy-bph-pym",
    activeIngredient: "Pymetrozine 50% WG",
    target: "Brown Planthopper",
    moaBadge: "IRAC Group 9B",
    moaType: "IRAC",
    doseHint: "0.75 g/L",
  },
  {
    id: "paddy-armyworm-ema",
    activeIngredient: "Emamectin benzoate 5% SG",
    target: "Rice Armyworm",
    moaBadge: "IRAC Group 6",
    moaType: "IRAC",
    doseHint: "0.4 g/L evening spray",
  },
  {
    id: "paddy-lf-flub",
    activeIngredient: "Flubendiamide 20% WG",
    target: "Leaf Folder",
    moaBadge: "IRAC Group 28",
    moaType: "IRAC",
    doseHint: "0.25 g/L",
    notes: "Rotate with IRAC Group 5 (Spinosad).",
  },
  {
    id: "paddy-blast-tri",
    activeIngredient: "Tricyclazole 75% WP",
    target: "Rice Blast",
    moaBadge: "FRAC Code 16.1",
    moaType: "FRAC",
    doseHint: "0.6 g/L at boot leaf",
  },
  {
    id: "paddy-sb-val",
    activeIngredient: "Validamycin 3% L",
    target: "Sheath Blight",
    moaBadge: "FRAC Code 26",
    moaType: "FRAC",
    doseHint: "2.5 ml/L at panicle initiation",
  },
  {
    id: "paddy-blb-strep",
    activeIngredient: "Streptocycline 90 SP + Copper oxychloride",
    target: "Bacterial Leaf Blight",
    moaBadge: "FRAC 25 + M1",
    moaType: "FRAC",
    doseHint: "0.15 g/L + 3 g/L tank-mix",
  },
];

const COTTON_CONTROLS: ControlRecommendation[] = [
  {
    id: "cotton-pbw-flub",
    activeIngredient: "Flubendiamide 20% WG",
    target: "Pink Bollworm",
    moaBadge: "IRAC Group 28",
    moaType: "IRAC",
    doseHint: "0.25 g/L",
  },
  {
    id: "cotton-whitefly-spiro",
    activeIngredient: "Spiromesifen 240 SC",
    target: "Whitefly",
    moaBadge: "IRAC Group 23",
    moaType: "IRAC",
    doseHint: "0.5 ml/L",
  },
  {
    id: "cotton-bollworm-indox",
    activeIngredient: "Indoxacarb 14.5% SC",
    target: "American Bollworm",
    moaBadge: "IRAC Group 22A",
    moaType: "IRAC",
    doseHint: "0.5 ml/L at ETL",
  },
  {
    id: "cotton-alternaria-difen",
    activeIngredient: "Difenoconazole 250 EC",
    target: "Alternaria Leaf Spot",
    moaBadge: "FRAC Code 3",
    moaType: "FRAC",
    doseHint: "0.5 ml/L",
  },
];

const MAIZE_CONTROLS: ControlRecommendation[] = [
  {
    id: "maize-faw-spino",
    activeIngredient: "Spinosad 45% SC",
    target: "Fall Armyworm",
    moaBadge: "IRAC Group 5",
    moaType: "IRAC",
    doseHint: "0.3 ml/L into whorl",
  },
  {
    id: "maize-faw-cta",
    activeIngredient: "Chlorantraniliprole 18.5% SC",
    target: "Fall Armyworm",
    moaBadge: "IRAC Group 28",
    moaType: "IRAC",
    doseHint: "0.4 ml/L",
  },
  {
    id: "maize-rust-azo",
    activeIngredient: "Azoxystrobin 250 SC",
    target: "Common Rust",
    moaBadge: "FRAC Code 11",
    moaType: "FRAC",
    doseHint: "1 ml/L preventive",
  },
];

const MOONGFALI_CONTROLS: ControlRecommendation[] = [
  {
    id: "gn-pod-ema",
    activeIngredient: "Emamectin benzoate 5% SG",
    target: "Pod Borer",
    moaBadge: "IRAC Group 6",
    moaType: "IRAC",
    doseHint: "0.4 g/L",
  },
  {
    id: "gn-leaf-spot-manco",
    activeIngredient: "Mancozeb 75% WP",
    target: "Early Leaf Spot",
    moaBadge: "FRAC Code M3",
    moaType: "FRAC",
    doseHint: "2 g/L",
  },
  {
    id: "gn-rust-hexa",
    activeIngredient: "Hexaconazole 5% EC",
    target: "Rust",
    moaBadge: "FRAC Code 3",
    moaType: "FRAC",
    doseHint: "1 ml/L",
  },
];

const BY_CROP: Record<string, ControlRecommendation[]> = {
  paddy: PADDY_CONTROLS,
  cotton: COTTON_CONTROLS,
  maize: MAIZE_CONTROLS,
  moongfali: MOONGFALI_CONTROLS,
  groundnut: MOONGFALI_CONTROLS,
};

export function getControlRecommendations(cropSlug: string): ControlRecommendation[] {
  const slug = cropSlug === "groundnut" ? "moongfali" : cropSlug;
  return BY_CROP[slug] ?? PADDY_CONTROLS;
}

export function moaBadgeClasses(type: MoABadgeType): string {
  if (type === "IRAC") return "bg-indigo-100 text-indigo-800 ring-indigo-200";
  if (type === "FRAC") return "bg-violet-100 text-violet-800 ring-violet-200";
  return "bg-amber-100 text-amber-900 ring-amber-200";
}
