/**
 * Active-ingredient → MoA group lookup.
 * Sources (user-supplied PDFs, Feb 2026):
 *  - IRAC MoA Classification Brochure Ed. 11.5 (Feb 2026)
 *  - FRAC Code List 2024
 *  - HRAC global MoA (numeric codes; legacy letter codes noted in comments)
 *
 * Rotation uses the primary group code only (e.g. "28", "3", "15").
 * Mixtures are joined with "+" (e.g. "11+3").
 */

export type MoAScheme = "IRAC" | "FRAC" | "HRAC";

export interface MoAEntry {
  scheme: MoAScheme;
  /** Primary group code used for resistance rotation */
  group: string;
  /** Optional class label for UI */
  className?: string;
}

/** Normalize active names for lookup (lowercase, strip salts/spaces) */
export function normalizeActive(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[-–]/g, " ")
    .replace(/\b(sodium|potassium|hydrochloride|benzoate|ethyl|methyl|m)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const IRAC: Record<string, MoAEntry> = {
  // 1A Carbamates
  thiodicarb: { scheme: "IRAC", group: "1A", className: "Carbamates" },
  methomyl: { scheme: "IRAC", group: "1A", className: "Carbamates" },
  carbofuran: { scheme: "IRAC", group: "1A", className: "Carbamates" },
  carbaryl: { scheme: "IRAC", group: "1A", className: "Carbamates" },
  carbosulfan: { scheme: "IRAC", group: "1A", className: "Carbamates" },
  // 1B Organophosphates
  monocrotophos: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  acephate: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  quinalphos: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  triazophos: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  profenofos: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  profenophos: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  chlorpyrifos: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  dimethoate: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  malathion: { scheme: "IRAC", group: "1B", className: "Organophosphates" },
  // 2A / 2B
  endosulfan: { scheme: "IRAC", group: "2A", className: "Cyclodiene organochlorines" },
  fipronil: { scheme: "IRAC", group: "2B", className: "Phenylpyrazoles (Fiproles)" },
  ethiprole: { scheme: "IRAC", group: "2B", className: "Phenylpyrazoles (Fiproles)" },
  // 3A Pyrethroids
  deltamethrin: { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  "lambda cyhalothrin": { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  cypermethrin: { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  "alpha cypermethrin": { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  bifenthrin: { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  etofenprox: { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  fenvalerate: { scheme: "IRAC", group: "3A", className: "Pyrethroids" },
  // 4A–4F nAChR competitive modulators
  imidacloprid: { scheme: "IRAC", group: "4A", className: "Neonicotinoids" },
  thiamethoxam: { scheme: "IRAC", group: "4A", className: "Neonicotinoids" },
  acetamiprid: { scheme: "IRAC", group: "4A", className: "Neonicotinoids" },
  clothianidin: { scheme: "IRAC", group: "4A", className: "Neonicotinoids" },
  thiacloprid: { scheme: "IRAC", group: "4A", className: "Neonicotinoids" },
  dinotefuran: { scheme: "IRAC", group: "4A", className: "Neonicotinoids" },
  sulfoxaflor: { scheme: "IRAC", group: "4C", className: "Sulfoximines" },
  flupyradifurone: { scheme: "IRAC", group: "4D", className: "Butenolides" },
  triflumezopyrim: { scheme: "IRAC", group: "4E", className: "Mesoionics" },
  // 5 Spinosyns
  spinosad: { scheme: "IRAC", group: "5", className: "Spinosyns" },
  spinetoram: { scheme: "IRAC", group: "5", className: "Spinosyns" },
  // 6 Avermectins / milbemycins
  abamectin: { scheme: "IRAC", group: "6", className: "Avermectins" },
  "emamectin benzoate": { scheme: "IRAC", group: "6", className: "Avermectins" },
  emamectin: { scheme: "IRAC", group: "6", className: "Avermectins" },
  // 7C
  pyriproxyfen: { scheme: "IRAC", group: "7C", className: "Pyriproxyfen" },
  // 9 Chordotonal
  pymetrozine: { scheme: "IRAC", group: "9B", className: "Pyridine azomethine derivatives" },
  pyrifluquinazon: { scheme: "IRAC", group: "9B", className: "Pyridine azomethine derivatives" },
  afidopyropen: { scheme: "IRAC", group: "9D", className: "Pyropenes" },
  // 12–16
  diafenthiuron: { scheme: "IRAC", group: "12A", className: "Diafenthiuron" },
  chlorfenapyr: { scheme: "IRAC", group: "13", className: "Pyrroles" },
  "cartap hydrochloride": { scheme: "IRAC", group: "14", className: "Nereistoxin analogues" },
  cartap: { scheme: "IRAC", group: "14", className: "Nereistoxin analogues" },
  novaluron: { scheme: "IRAC", group: "15", className: "Benzoylureas" },
  lufenuron: { scheme: "IRAC", group: "15", className: "Benzoylureas" },
  buprofezin: { scheme: "IRAC", group: "16", className: "Buprofezin" },
  // 18 Ecdysone agonists
  methoxyfenozide: { scheme: "IRAC", group: "18", className: "Diacylhydrazines" },
  tebufenozide: { scheme: "IRAC", group: "18", className: "Diacylhydrazines" },
  // 22 Voltage-dependent Na channel blockers
  indoxacarb: { scheme: "IRAC", group: "22A", className: "Oxadiazines" },
  metaflumizone: { scheme: "IRAC", group: "22B", className: "Semicarbazones" },
  // 23 Tetronic / tetramic acids
  spiromesifen: { scheme: "IRAC", group: "23", className: "Tetronic and tetramic acid derivatives" },
  spirotetramat: { scheme: "IRAC", group: "23", className: "Tetronic and tetramic acid derivatives" },
  // 28 Diamides
  chlorantraniliprole: { scheme: "IRAC", group: "28", className: "Diamides" },
  cyantraniliprole: { scheme: "IRAC", group: "28", className: "Diamides" },
  flubendiamide: { scheme: "IRAC", group: "28", className: "Diamides" },
  tetraniliprole: { scheme: "IRAC", group: "28", className: "Diamides" },
  // 29–30
  flonicamid: { scheme: "IRAC", group: "29", className: "Flonicamid" },
  broflanilide: { scheme: "IRAC", group: "30", className: "Meta-diamides / isoxazolines" },
  fluxametamide: { scheme: "IRAC", group: "30", className: "Meta-diamides / isoxazolines" },
  // UN
  pyridalyl: { scheme: "IRAC", group: "UN", className: "Unknown / uncertain MoA" },
  azadirachtin: { scheme: "IRAC", group: "UN", className: "Unknown / uncertain MoA" },
};

const FRAC: Record<string, MoAEntry> = {
  // 1 MBC
  carbendazim: { scheme: "FRAC", group: "1", className: "MBC (benzimidazoles)" },
  "thiophanate methyl": { scheme: "FRAC", group: "1", className: "MBC (benzimidazoles)" },
  // 3 DMI
  hexaconazole: { scheme: "FRAC", group: "3", className: "DMI (triazoles)" },
  propiconazole: { scheme: "FRAC", group: "3", className: "DMI (triazoles)" },
  tebuconazole: { scheme: "FRAC", group: "3", className: "DMI (triazoles)" },
  difenoconazole: { scheme: "FRAC", group: "3", className: "DMI (triazoles)" },
  // 4 Phenylamides
  metalaxyl: { scheme: "FRAC", group: "4", className: "Phenylamides" },
  "metalaxyl m": { scheme: "FRAC", group: "4", className: "Phenylamides" },
  mefenoxam: { scheme: "FRAC", group: "4", className: "Phenylamides" },
  // 6 Phospholipid biosynthesis (organophosphorus)
  isoprothiolane: { scheme: "FRAC", group: "6", className: "Phospholipid biosynthesis" },
  edifenphos: { scheme: "FRAC", group: "6", className: "Phospholipid biosynthesis" },
  // 7 SDHI
  carboxin: { scheme: "FRAC", group: "7", className: "SDHI" },
  fluxapyroxad: { scheme: "FRAC", group: "7", className: "SDHI" },
  // 11 QoI
  azoxystrobin: { scheme: "FRAC", group: "11", className: "QoI (strobilurins)" },
  trifloxystrobin: { scheme: "FRAC", group: "11", className: "QoI (strobilurins)" },
  pyraclostrobin: { scheme: "FRAC", group: "11", className: "QoI (strobilurins)" },
  // 16.1 Melanin biosynthesis (reductase) — NOT DMI group 3
  tricyclazole: { scheme: "FRAC", group: "16.1", className: "MBI-R (melanin biosynthesis)" },
  // 24–26 Antibiotics
  kasugamycin: { scheme: "FRAC", group: "24", className: "Hexopyranosyl antibiotic" },
  streptomycin: { scheme: "FRAC", group: "25", className: "Glucopyranosyl antibiotic" },
  streptocycline: { scheme: "FRAC", group: "25", className: "Glucopyranosyl antibiotic" },
  tetracycline: { scheme: "FRAC", group: "41", className: "Tetracycline antibiotic" },
  oxytetracycline: { scheme: "FRAC", group: "41", className: "Tetracycline antibiotic" },
  validamycin: { scheme: "FRAC", group: "26", className: "Glucopyranosyl antibiotic" },
  // 27 CAA-related / cyanoacetamide oxime
  cymoxanil: { scheme: "FRAC", group: "27", className: "Cyanoacetamide oxime" },
  // Multi-site
  "copper oxychloride": { scheme: "FRAC", group: "M1", className: "Inorganic (copper)" },
  "copper hydroxide": { scheme: "FRAC", group: "M1", className: "Inorganic (copper)" },
  "wettable sulphur": { scheme: "FRAC", group: "M2", className: "Inorganic (sulphur)" },
  sulphur: { scheme: "FRAC", group: "M2", className: "Inorganic (sulphur)" },
  sulfur: { scheme: "FRAC", group: "M2", className: "Inorganic (sulphur)" },
  mancozeb: { scheme: "FRAC", group: "M3", className: "Dithiocarbamates" },
  propineb: { scheme: "FRAC", group: "M3", className: "Dithiocarbamates" },
  chlorothalonil: { scheme: "FRAC", group: "M5", className: "Chloronitriles" },
  // Biologicals
  "trichoderma viride": { scheme: "FRAC", group: "BM02", className: "Biologicals (multiple MoA)" },
};

/** HRAC numeric codes (global MoA classification) */
const HRAC: Record<string, MoAEntry> = {
  // 1 ACCase (legacy A)
  "quizalofop ethyl": { scheme: "HRAC", group: "1", className: "ACCase inhibitors" },
  quizalofop: { scheme: "HRAC", group: "1", className: "ACCase inhibitors" },
  // 2 ALS (legacy B)
  "bispyribac sodium": { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  bispyribac: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  "pyrazosulfuron ethyl": { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  pyrazosulfuron: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  nicosulfuron: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  imazethapyr: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  "halosulfuron methyl": { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  halosulfuron: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  // 3 Microtubule (legacy K1)
  pendimethalin: { scheme: "HRAC", group: "3", className: "Microtubule assembly inhibitors" },
  trifluralin: { scheme: "HRAC", group: "3", className: "Microtubule assembly inhibitors" },
  fluchloralin: { scheme: "HRAC", group: "3", className: "Microtubule assembly inhibitors" },
  // 4 Synthetic auxins (legacy O)
  "2,4 d sodium salt": { scheme: "HRAC", group: "4", className: "Synthetic auxins" },
  "2,4 d": { scheme: "HRAC", group: "4", className: "Synthetic auxins" },
  // 5 PSII (legacy C1/C2)
  atrazine: { scheme: "HRAC", group: "5", className: "PSII inhibitors" },
  metribuzin: { scheme: "HRAC", group: "5", className: "PSII inhibitors" },
  diuron: { scheme: "HRAC", group: "5", className: "PSII inhibitors" },
  // 8 Lipid synthesis (legacy N)
  anilofos: { scheme: "HRAC", group: "8", className: "Lipid synthesis inhibitors" },
  // 9 EPSPS (legacy G)
  glyphosate: { scheme: "HRAC", group: "9", className: "EPSPS inhibitors" },
  // 14 PPO (legacy E)
  oxyfluorfen: { scheme: "HRAC", group: "14", className: "PPO inhibitors" },
  // 15 VLCFA (legacy K3)
  pretilachlor: { scheme: "HRAC", group: "15", className: "VLCFA inhibitors" },
  butachlor: { scheme: "HRAC", group: "15", className: "VLCFA inhibitors" },
  alachlor: { scheme: "HRAC", group: "15", className: "VLCFA inhibitors" },
  "clodinafop propargyl": { scheme: "HRAC", group: "1", className: "ACCase inhibitors" },
  clodinafop: { scheme: "HRAC", group: "1", className: "ACCase inhibitors" },
  fenoxaprop: { scheme: "HRAC", group: "1", className: "ACCase inhibitors" },
  "metsulfuron methyl": { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  metsulfuron: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  cinmethyline: { scheme: "HRAC", group: "15", className: "VLCFA inhibitors" },
  fentrazamide: { scheme: "HRAC", group: "15", className: "VLCFA inhibitors" },
  ethoxysulfuron: { scheme: "HRAC", group: "2", className: "ALS inhibitors" },
  mesotrione: { scheme: "HRAC", group: "27", className: "HPPD inhibitors" },
  // 22 PSI electron diverter (legacy D)
  "paraquat dichloride": { scheme: "HRAC", group: "22", className: "PSI electron diverter" },
  paraquat: { scheme: "HRAC", group: "22", className: "PSI electron diverter" },
  // 27 HPPD (legacy F2)
  tembotrione: { scheme: "HRAC", group: "27", className: "HPPD inhibitors" },
};

const ALL: Record<string, MoAEntry> = { ...IRAC, ...FRAC, ...HRAC };

/**
 * Resolve MoA for a single active or a mixture ("A + B").
 * Returns null if any component is unknown.
 */
export function lookupMoA(activeIngredient: string): MoAEntry | null {
  const parts = activeIngredient.split(/\s*\+\s*/).map((p) => normalizeActive(p));
  const entries: MoAEntry[] = [];

  for (const part of parts) {
    let entry = ALL[part];
    if (!entry) {
      // try without trailing formulation words
      const loose = Object.keys(ALL).find(
        (k) => part.includes(k) || k.includes(part)
      );
      if (loose) entry = ALL[loose];
    }
    if (!entry) return null;
    entries.push(entry);
  }

  if (entries.length === 1) return entries[0];

  const scheme = entries[0].scheme;
  if (!entries.every((e) => e.scheme === scheme)) {
    // Mixed schemes (rare) — keep first scheme, join groups
  }

  return {
    scheme: entries[0].scheme,
    group: entries.map((e) => e.group).join("+"),
    className: entries.map((e) => e.className).filter(Boolean).join(" + "),
  };
}

export function resolveMoAGroup(
  activeIngredient: string,
  fallbackScheme: MoAScheme,
  fallbackGroup: string
): { moaType: MoAScheme; moaGroup: string } {
  const found = lookupMoA(activeIngredient);
  if (found) return { moaType: found.scheme, moaGroup: found.group };
  return { moaType: fallbackScheme, moaGroup: fallbackGroup };
}
