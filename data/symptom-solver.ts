import { THREAT_IMAGES } from "@/data/pest-disease-details";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import type { LucideIcon } from "lucide-react";
import {
  CircleDot,
  CloudFog,
  Droplets,
  Leaf,
  Minus,
  Sparkles,
  Target,
  TrendingDown,
} from "lucide-react";

export type SymptomSeverity = "low" | "medium" | "high";

export interface SolverIssue {
  id: string;
  name: string;
  severity: SymptomSeverity;
  image: string;
  diagnosis: string;
  immediateActions: string[];
  prevention: string[];
  /** Empty = all crops */
  cropSlugs?: string[];
  threatLink?: { cropSlug: string; threatType: "pest" | "disease" | "weed"; threatId: string };
}

export interface SymptomCategory {
  id: string;
  label: string;
  labelHi?: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  coverImage?: string;
  issues: SolverIssue[];
}

/** Background photo per symptom category — helps farmers recognise the problem */
export const SYMPTOM_CATEGORY_COVERS: Record<string, string> = {
  "yellowing-leaves": THREAT_IMAGES.paddy,
  "stem-holes": THREAT_IMAGES.stemBorer,
  "white-spots": THREAT_IMAGES.fungalLeaf,
  "wilting-plants": THREAT_IMAGES.wilting,
  "holes-in-leaves": THREAT_IMAGES.insectLeaf,
  "brown-spots": THREAT_IMAGES.rust,
  "stunted-growth": THREAT_IMAGES.viralPlant,
  "cottony-growth": THREAT_IMAGES.fungalLeaf,
  "wilting-drooping": THREAT_IMAGES.wilting,
  "fruit-flower-damage": THREAT_IMAGES.fruitDamage,
  "insect-chewing": THREAT_IMAGES.insect,
  "leaf-curling": THREAT_IMAGES.aphid,
  "mosaic-virus": THREAT_IMAGES.viralPlant,
  "sticky-leaves": THREAT_IMAGES.aphid,
  "purple-blotches": THREAT_IMAGES.bacterialLeaf,
};

export const SEVERITY_STYLES: Record<
  SymptomSeverity,
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-emerald-100 text-emerald-900 ring-emerald-300" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-950 ring-amber-300" },
  high: { label: "High", className: "bg-red-100 text-red-900 ring-red-300" },
};

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: "yellowing-leaves",
    label: "Yellowing Leaves",
    description: "Chlorosis, pale patches, or uniform yellowing",
    icon: Leaf,
    accent: "from-lime-100 to-yellow-50 border-lime-200",
    issues: [
      {
        id: "n-deficiency",
        name: "Nitrogen Deficiency",
        severity: "medium",
        image: THREAT_IMAGES.paddy,
        diagnosis:
          "Nitrogen is mobile in the plant — older leaves yellow first while veins may stay green briefly. Common after heavy rains, leaching, or skipped top-dressing in cereals and vegetables.",
        immediateActions: [
          "Confirm with field history — was basal/top-dress dose applied on time?",
          "Apply urea 25–50 kg/ha as top-dress (paddy/wheat) or foliar urea 2% spray on vegetables.",
          "Ensure adequate soil moisture before applying nitrogen.",
          "Split nitrogen into 2–3 doses rather than one heavy application.",
        ],
        prevention: [
          "Follow recommended NPK schedule for your crop and soil test results.",
          "Use leaf colour chart (LCC) in paddy to time urea application.",
          "Incorporate organic manure or green manure to improve soil nitrogen retention.",
        ],
      },
      {
        id: "ysb-dead-heart",
        name: "Yellow Stem Borer",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy"],
        diagnosis:
          "Larvae bore into the stem causing 'dead heart' in vegetative stage — central shoot turns yellow and pulls out easily. A major yield-limiting pest in transplanted and direct-seeded rice.",
        immediateActions: [
          "Scout for egg masses and dead hearts — treat at 5% dead hearts (vegetative stage).",
          "Release Trichogramma japonicum @ 50,000/ha weekly if biological control is available.",
          "Apply Chlorantraniliprole 18.5% SC @ 0.4 ml/L (IRAC 28) or Cartap hydrochloride as per label.",
          "Clip seedling tips before transplant to remove hidden egg masses.",
        ],
        prevention: [
          "Install light traps @ 1/ha for adult moth monitoring.",
          "Avoid ratooning and destroy stubble after harvest.",
          "Rotate IRAC groups — never use the same MoA in consecutive sprays.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p2" },
      },
      {
        id: "tungro",
        name: "Rice Tungro Virus",
        severity: "high",
        image: THREAT_IMAGES.viralPlant,
        cropSlugs: ["paddy"],
        diagnosis:
          "Spread by green leafhopper (Nephotettix spp.). Plants show stunted growth with interveinal yellow-orange discoloration of leaves. Often appears in patches spreading from field edges.",
        immediateActions: [
          "Remove and destroy infected plants immediately to reduce virus source.",
          "Control leafhopper vector with Imidacloprid 200 SL @ 0.3 ml/L or Buprofezin 25 SC @ 1 ml/L.",
          "Avoid planting susceptible varieties in endemic areas — use resistant varieties (e.g. IR64-derived lines).",
        ],
        prevention: [
          "Synchronous planting in the village reduces vector and virus pressure.",
          "Use virus-free seedlings and rogue infected plants early.",
          "Conserve natural enemies; avoid prophylactic broad-spectrum sprays.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p5" },
      },
      {
        id: "blast-yellow",
        name: "Rice Blast (early leaf spots)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Caused by Magnaporthe oryzae. Diamond-shaped lesions with grey centres and brown margins appear on leaves; severe infections cause leaf yellowing and neck blast on panicles.",
        immediateActions: [
          "Spray Tricyclazole 75% WP @ 0.6 g/L at first symptom (FRAC 16.1).",
          "Alternate with Isoprothiolane 40 EC @ 1.5 ml/L in next spray.",
          "Reduce nitrogen if crop is lush and disease is spreading.",
        ],
        prevention: [
          "Use resistant varieties where available.",
          "Avoid excessive nitrogen and maintain proper plant spacing.",
          "Apply silicon-rich amendments in deficient soils.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d1" },
      },
    ],
  },
  {
    id: "stem-holes",
    label: "Stem Holes",
    description: "Bore holes, frass, or hollow stems",
    icon: CircleDot,
    accent: "from-orange-100 to-amber-50 border-orange-200",
    issues: [
      {
        id: "stem-borer-paddy",
        name: "Yellow Stem Borer",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy"],
        diagnosis:
          "Circular or irregular bore holes on stems with frass at the entry point. Larvae feed inside the stem, disrupting nutrient flow and causing dead hearts or white ears.",
        immediateActions: [
          "Identify life stage — vegetative dead heart vs reproductive white ear.",
          "Apply Chlorantraniliprole 18.5% SC @ 0.4 ml/L directly into affected tillers.",
          "Use Cartap hydrochloride 50% SP @ 1 kg/ha granules at tillering if infestation is field-wide.",
        ],
        prevention: [
          "Early clipping of seedling tips before transplant.",
          "Pheromone traps for monitoring adult moths.",
          "Rotate between IRAC 14 and IRAC 28 modes of action.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p2" },
      },
      {
        id: "pink-borer",
        name: "Pink Stem Borer (Maize/Sorghum)",
        severity: "high",
        image: THREAT_IMAGES.maize,
        cropSlugs: ["maize", "bajra"],
        diagnosis:
          "Larvae bore into stems causing dead hearts in young plants and tunneling in mature stalks. Pinkish larva visible inside cut stems.",
        immediateActions: [
          "Remove and destroy dead hearts / infested stems.",
          "Apply Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Emamectin benzoate 5% SG @ 0.4 g/L.",
          "For maize, pour sand + carbofuran mixture into whorl only if recommended locally.",
        ],
        prevention: [
          "Early planting to avoid peak moth flights.",
          "Crop rotation with non-host crops.",
          "Light traps for adult monitoring.",
        ],
        threatLink: { cropSlug: "maize", threatType: "pest", threatId: "p1" },
      },
      {
        id: "fruit-borer-stem",
        name: "Fruit Borer (cotton/tomato)",
        severity: "medium",
        image: THREAT_IMAGES.tomato,
        cropSlugs: ["cotton", "tomato", "chilli"],
        diagnosis:
          "Helicoverpa armigera larvae bore into squares, bolls, or fruits, sometimes leaving entry holes on stems and branches near feeding sites.",
        immediateActions: [
          "Scout at ETL — 2 eggs or 1 larva per 10 plants (vegetables).",
          "Spray Emamectin benzoate 5% SG @ 0.4 g/L evening application.",
          "Use HaNPV @ 250 LE/ha when larvae are young (1st–2nd instar).",
        ],
        prevention: [
          "Install pheromone traps @ 5/ha for monitoring.",
          "Intercrop with marigold or castor as trap crop where practised.",
          "Rotate IRAC 6 and IRAC 28 chemistry.",
        ],
        threatLink: { cropSlug: "tomato", threatType: "pest", threatId: "p1" },
      },
    ],
  },
  {
    id: "white-spots",
    label: "White Spots",
    description: "Powdery patches, mildew, or pale lesions",
    icon: Sparkles,
    accent: "from-slate-100 to-gray-50 border-slate-200",
    issues: [
      {
        id: "powdery-mildew",
        name: "Powdery Mildew",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "White powdery fungal growth on upper leaf surfaces. Favoured by dry days and cool nights with high humidity. Common on cucurbits, grapes, and chilli.",
        immediateActions: [
          "Spray Wettable Sulphur 80% WP @ 3 g/L or Hexaconazole 5% EC @ 1 ml/L.",
          "Remove heavily infected leaves and destroy away from field.",
          "Improve air circulation by avoiding dense planting.",
        ],
        prevention: [
          "Use resistant varieties where available.",
          "Avoid overhead irrigation in late afternoon.",
          "Rotate FRAC Group 3 fungicides with sulphur (M2).",
        ],
      },
      {
        id: "sheath-blight-white",
        name: "Sheath Blight (white mycelium)",
        severity: "high",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Rhizoctonia solani causes oval greenish-grey lesions on leaf sheaths with white mycelial growth. Spreads upward in humid, dense canopies.",
        immediateActions: [
          "Drain excess water and improve canopy airflow.",
          "Spray Validamycin 3% L @ 2.5 ml/L or Hexaconazole 5% EC @ 1 ml/L at panicle initiation.",
          "Remove severely infected plants at field margins.",
        ],
        prevention: [
          "Avoid excessive nitrogen fertilization.",
          "Maintain recommended plant spacing.",
          "Treat seeds with Trichoderma where sheath blight is endemic.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d2" },
      },
      {
        id: "leaf-folder-patches",
        name: "Leaf Folder",
        severity: "low",
        image: THREAT_IMAGES.insectLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Larvae fold leaves longitudinally and scrape green tissue, leaving white scraped patches. Damage reduces photosynthesis during tillering to PI stage.",
        immediateActions: [
          "Scout — treat at 10% damaged leaves or 1–2 fresh folds per hill.",
          "Spray Flubendiamide 20% WG @ 0.25 g/L or Spinosad 45% SC @ 0.3 ml/L.",
        ],
        prevention: [
          "Balanced nitrogen — excess N increases leaf folder outbreaks.",
          "Conserve spiders and mirid bugs as natural enemies.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p4" },
      },
    ],
  },
  {
    id: "wilting-plants",
    label: "Wilting Plants",
    description: "Sudden drooping, collapse, or drying",
    icon: Droplets,
    accent: "from-sky-100 to-blue-50 border-sky-200",
    issues: [
      {
        id: "water-stress",
        name: "Water / Drought Stress",
        severity: "low",
        image: THREAT_IMAGES.paddy,
        diagnosis:
          "Wilting during peak heat with dry soil indicates moisture stress. Leaves may recover overnight if roots access water. Distinct from pathogenic wilt by recovery after irrigation.",
        immediateActions: [
          "Check soil moisture at root zone — irrigate if dry.",
          "Schedule irrigation early morning or evening to reduce evaporation.",
          "Apply mulch in vegetables to conserve soil moisture.",
        ],
        prevention: [
          "Align irrigation schedule with crop critical stages.",
          "Use drip or alternate wetting-drying in paddy where suitable.",
          "Improve organic matter to increase water-holding capacity.",
        ],
      },
      {
        id: "bacterial-wilt",
        name: "Bacterial Wilt",
        severity: "high",
        image: THREAT_IMAGES.bacterialLeaf,
        cropSlugs: ["tomato", "brinjal", "chilli", "potato"],
        diagnosis:
          "Ralstonia solanacearum blocks vascular tissue. Sudden wilting on hot days, brown discolouration in stem when cut and placed in water (bacterial ooze).",
        immediateActions: [
          "Uproot and destroy wilted plants — do not compost on farm.",
          "Disinfect tools with bleach solution between plants.",
          "Avoid movement of infected soil and irrigation water to clean areas.",
        ],
        prevention: [
          "Use certified disease-free seedlings.",
          "Rotate with non-solanaceous crops for 3+ years.",
          "Raise beds and ensure drainage in heavy soils.",
        ],
      },
      {
        id: "root-rot",
        name: "Root Rot / Seedling Blight",
        severity: "high",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "Rhizoctonia, Pythium, or Fusarium attack roots in waterlogged or compacted soils. Plants wilt despite moist soil; roots appear brown and shortened.",
        immediateActions: [
          "Improve drainage — avoid standing water in nursery and field.",
          "Drench Trichoderma viride 1% WP @ 5 g/L at root zone.",
          "Apply Metalaxyl-M + Mancozeb drench in severe nursery infections.",
        ],
        prevention: [
          "Treat seeds with Trichoderma or carbendazim as per label.",
          "Avoid over-irrigation in nurseries.",
          "Solarize nursery beds before sowing.",
        ],
      },
    ],
  },
  {
    id: "holes-in-leaves",
    label: "Holes in Leaves",
    description: "Chewing damage, skeletonised tissue",
    icon: Target,
    accent: "from-red-100 to-rose-50 border-red-200",
    issues: [
      {
        id: "armyworm",
        name: "Rice Armyworm",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy", "maize"],
        diagnosis:
          "Nocturnal larvae consume leaf margins and can defoliate patches overnight, especially after rains. Frass pellets visible on soil.",
        immediateActions: [
          "Scout at dusk when larvae feed on foliage.",
          "Spray Emamectin benzoate 5% SG @ 0.4 g/L in evening.",
          "Alternate with Chlorantraniliprole 18.5% SC @ 0.4 ml/L (IRAC 28).",
        ],
        prevention: [
          "Drain field briefly to expose hiding larvae where feasible.",
          "Light traps for moth monitoring.",
          "Rotate IRAC 6 and IRAC 28 groups.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p3" },
      },
      {
        id: "flea-beetle",
        name: "Flea Beetle / Shot Holes",
        severity: "medium",
        image: THREAT_IMAGES.insectLeaf,
        cropSlugs: ["mustard", "brinjal", "potato"],
        diagnosis:
          "Small round shot-holes in leaves from adult feeding. Jumping beetles are visible when disturbed. Seedling stage is most vulnerable.",
        immediateActions: [
          "Spray Imidacloprid 17.8% SL @ 0.3 ml/L on seedlings at first sign.",
          "Use yellow sticky traps for monitoring adult beetles.",
          "Apply neem oil 1% as a softer option for organic plots.",
        ],
        prevention: [
          "Use trap crops and remove volunteer host plants.",
          "Transplant older, sturdy seedlings to outgrow damage.",
        ],
      },
      {
        id: "early-blight-holes",
        name: "Early Blight (necrotic holes)",
        severity: "medium",
        image: THREAT_IMAGES.tomato,
        cropSlugs: ["tomato", "potato"],
        diagnosis:
          "Alternaria solani causes brown concentric ring spots that may fall out leaving shot-hole appearance on tomato and potato foliage.",
        immediateActions: [
          "Spray Azoxystrobin 250 SC @ 1 ml/L or Chlorothalonil 75% WP @ 2 g/L.",
          "Remove lower infected leaves and improve staking/airflow.",
        ],
        prevention: [
          "Rotate crops — avoid continuous solanaceous planting.",
          "Mulch soil to prevent splash dispersal of spores.",
        ],
        threatLink: { cropSlug: "tomato", threatType: "disease", threatId: "d1" },
      },
    ],
  },
  {
    id: "brown-spots",
    label: "Brown Spots",
    description: "Lesions, rust pustules, or necrotic patches",
    icon: Minus,
    accent: "from-amber-100 to-orange-50 border-amber-200",
    issues: [
      {
        id: "brown-spot-rice",
        name: "Brown Spot (rice)",
        severity: "medium",
        image: THREAT_IMAGES.rust,
        cropSlugs: ["paddy"],
        diagnosis:
          "Bipolaris oryzae produces oval brown spots with a yellow halo on leaves and glumes. Worsens in nutrient-deficient, drought-stressed rice.",
        immediateActions: [
          "Spray Mancozeb 75% WP @ 2 g/L or Propiconazole 25% EC @ 1 ml/L.",
          "Correct soil fertility — apply balanced NPK.",
        ],
        prevention: [
          "Treat seeds with carbendazim before sowing.",
          "Maintain adequate soil moisture during tillering.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d4" },
      },
      {
        id: "rust",
        name: "Leaf Rust",
        severity: "medium",
        image: THREAT_IMAGES.rust,
        cropSlugs: ["wheat", "maize"],
        diagnosis:
          "Orange-brown pustules on leaves release powdery spores. Rust spreads rapidly in cool, moist conditions with dew on leaves.",
        immediateActions: [
          "Spray Propiconazole 25% EC @ 1 ml/L or Tebuconazole 25% EC @ 0.5 ml/L at first pustule.",
          "Remove volunteer host plants at field borders.",
        ],
        prevention: [
          "Plant rust-resistant varieties.",
          "Avoid late sowing in rust-prone areas.",
          "Rotate FRAC Group 3 fungicides with other MoA.",
        ],
      },
      {
        id: "bph-hopperburn",
        name: "Brown Planthopper (hopperburn)",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy"],
        diagnosis:
          "Nilaparvata lugens sucks sap at the base of tillers. Circular brown patches ('hopperburn') appear when populations explode, often after repeated IRAC 4A sprays.",
        immediateActions: [
          "Direct spray toward plant base — Buprofezin 25% SC @ 1 ml/L (IRAC 16).",
          "Alternate with Pymetrozine 50% WG @ 0.75 g/L (IRAC 9B).",
          "Stop broad-spectrum pyrethroid sprays that kill natural enemies.",
        ],
        prevention: [
          "Avoid excessive nitrogen top-dressing.",
          "Alternate wetting and drying water management.",
          "Never use the same IRAC group in consecutive applications.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p1" },
      },
    ],
  },
  {
    id: "stunted-growth",
    label: "Stunted Growth",
    description: "Small plants, poor tillering, uneven stand",
    icon: TrendingDown,
    accent: "from-violet-100 to-purple-50 border-violet-200",
    issues: [
      {
        id: "zinc-deficiency",
        name: "Zinc Deficiency (Khaira)",
        severity: "low",
        image: THREAT_IMAGES.paddy,
        cropSlugs: ["paddy", "maize"],
        diagnosis:
          "In flooded rice, zinc becomes unavailable causing stunted plants with dusty brown spots on upper leaves and poor root development ('Khaira' in paddy).",
        immediateActions: [
          "Apply zinc sulphate 25 kg/ha as basal or 2% foliar spray on affected patches.",
          "Avoid over-liming or excessive phosphorous that locks zinc.",
          "Drain field briefly if permanently flooded.",
        ],
        prevention: [
          "Apply zinc sulphate basally in zinc-deficient soils.",
          "Use organic matter to improve micronutrient availability.",
        ],
      },
      {
        id: "nematode",
        name: "Root-Knot Nematode",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "Meloidogyne spp. cause galls on roots, stunting, and wilting under moisture stress. Common in vegetables and sandy soils.",
        immediateActions: [
          "Apply Paecilomyces lilacinus or Trichoderma seed treatment.",
          "Use carbofuran 3G @ 1 kg/ai/ha only where legally permitted and label allows.",
          "Solarize soil in nursery beds before transplanting.",
        ],
        prevention: [
          "Crop rotation with marigold or non-host cereals.",
          "Use nematode-free seedlings and resistant varieties.",
        ],
      },
      {
        id: "weed-competition",
        name: "Weed Competition",
        severity: "medium",
        image: THREAT_IMAGES.weed,
        diagnosis:
          "Weeds compete for light, nutrients, and moisture during the critical period (first 30–45 days). Crop appears stunted with uneven tillering.",
        immediateActions: [
          "Hand-weed or use recommended post-emergence herbicide for your crop.",
          "In paddy: Bispyribac-sodium 10% SC @ 25 g a.i./ha at 15–20 DAS if grasses dominate.",
          "Maintain recommended plant population after thinning.",
        ],
        prevention: [
          "Timely pre-emergence herbicide at label stage.",
          "Stale seedbed technique before transplanting.",
        ],
      },
    ],
  },
  {
    id: "cottony-growth",
    label: "Cottony Growth",
    description: "Fuzzy mould, mycelium, or sooty deposits",
    icon: CloudFog,
    accent: "from-teal-100 to-cyan-50 border-teal-200",
    issues: [
      {
        id: "sheath-blight-cottony",
        name: "Sheath Blight",
        severity: "high",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "White to grey cottony mycelium on leaf sheaths near water line. Lesions coalesce and plants lodge in severe cases.",
        immediateActions: [
          "Spray Validamycin 3% L @ 2.5 ml/L when lesions first appear.",
          "Reduce nitrogen and improve drainage.",
        ],
        prevention: [
          "Avoid dense planting and excess nitrogen.",
          "Remove infected crop residue after harvest.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d2" },
      },
      {
        id: "sooty-mold",
        name: "Sooty Mould",
        severity: "low",
        image: THREAT_IMAGES.insectLeaf,
        diagnosis:
          "Black fungal growth on leaf surfaces fed by honeydew from aphids, whiteflies, or leafhoppers. Indicates underlying sucking pest infestation.",
        immediateActions: [
          "Control the sap-sucking pest first — Imidacloprid 17.8% SL @ 0.3 ml/L.",
          "Wash sooty mould with mild soap solution on high-value crops.",
        ],
        prevention: [
          "Monitor for aphids and whiteflies weekly.",
          "Conserve natural enemies (ladybirds, lacewings).",
        ],
      },
      {
        id: "false-smut",
        name: "False Smut (Ustilaginoidea)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Orange-yellow to greenish spore balls replace individual grains on panicles. Favoured by humid weather during flowering.",
        immediateActions: [
          "Spray Propiconazole 25% EC @ 1 ml/L at boot leaf stage before flowering.",
          "Remove infected panicles and destroy.",
        ],
        prevention: [
          "Balanced fertilization — avoid excess nitrogen.",
          "Spray at recommended growth stage before infection window.",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d5" },
      },
    ],
  },
  {
    id: "wilting-drooping",
    label: "Wilting / Drooping",
    description: "Paudha murjha gaya, stem soft, root problem",
    icon: TrendingDown,
    accent: "from-orange-100 to-red-50 border-orange-200",
    issues: [
      {
        id: "root-rot",
        name: "Root Rot / Damping Off",
        severity: "high",
        image: THREAT_IMAGES.rootRot,
        diagnosis:
          "Over-watering, poor drainage, or fungal pathogens (Pythium, Rhizoctonia) cause roots to turn brown and plants to wilt even with wet soil.",
        immediateActions: [
          "Stop irrigation for 2–3 days; improve drainage channels.",
          "Drench with Metalaxyl-M + Mancozeb or Validamycin as per label.",
          "Remove severely affected plants to stop spread.",
        ],
        prevention: [
          "Treat seeds with Trichoderma before sowing.",
          "Avoid waterlogging — especially in nursery and early stage.",
        ],
      },
      {
        id: "wilt-bacterial",
        name: "Bacterial Wilt",
        severity: "high",
        image: THREAT_IMAGES.wilting,
        cropSlugs: ["tomato", "bhindi", "chilli"],
        diagnosis:
          "Sudden wilting of entire plant with no leaf yellowing first. Cut stem — white bacterial ooze may appear in water.",
        immediateActions: [
          "Uproot and destroy affected plants — do not compost.",
          "Spray Streptocycline 0.05% on nearby healthy plants.",
          "Rotate crop — avoid solanaceous crops in same field next season.",
        ],
        prevention: [
          "Use wilt-resistant varieties where available.",
          "Soil solarization before transplanting in problem fields.",
        ],
      },
    ],
  },
  {
    id: "fruit-flower-damage",
    label: "Fruit / Flower Damage",
    description: "Fruit pe daag, flower girta hai, size kam",
    icon: CircleDot,
    accent: "from-pink-100 to-rose-50 border-pink-200",
    issues: [
      {
        id: "fruit-borer",
        name: "Fruit Borer",
        severity: "high",
        image: THREAT_IMAGES.fruitDamage,
        cropSlugs: ["tomato", "bhindi", "chilli"],
        diagnosis:
          "Holes in fruits with frass, premature fruit drop, or internal feeding damage — common in tomato, okra, and chilli.",
        immediateActions: [
          "Collect and destroy damaged fruits.",
          "Spray Emamectin benzoate 5% SG @ 0.4 g/L or Spinosad as per label.",
          "Spray in evening; repeat after 10 days if needed.",
        ],
        prevention: [
          "Install pheromone traps (5/acre) before flowering.",
          "Remove crop residue after harvest.",
        ],
      },
      {
        id: "blossom-end-rot",
        name: "Blossom End Rot",
        severity: "medium",
        image: THREAT_IMAGES.tomato,
        cropSlugs: ["tomato"],
        diagnosis:
          "Dark sunken patch at blossom end of tomato — calcium imbalance, irregular watering, not a fungal disease.",
        immediateActions: [
          "Maintain even soil moisture — mulch around plants.",
          "Foliar spray Calcium nitrate 1% weekly for 2–3 sprays.",
          "Avoid excess nitrogen which worsens the problem.",
        ],
        prevention: [
          "Soil test and apply gypsum if calcium is low.",
          "Irrigate regularly during fruit set stage.",
        ],
      },
    ],
  },
  {
    id: "insect-chewing",
    label: "Insects / Chewing Pests",
    description: "Patti kaat di, holes, caterpillar dikhe",
    icon: Target,
    accent: "from-amber-100 to-yellow-50 border-amber-200",
    issues: [
      {
        id: "aphid-infestation",
        name: "Aphid Attack",
        severity: "medium",
        image: THREAT_IMAGES.aphid,
        diagnosis:
          "Clusters of small soft insects under leaves, sticky honeydew, curled leaves, and sooty mould on vegetables and cereals.",
        immediateActions: [
          "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Neem oil 1% in evening.",
          "Release ladybird beetles if available (IPM).",
          "Avoid broad-spectrum sprays that kill natural enemies.",
        ],
        prevention: [
          "Yellow sticky traps (5/acre) for early detection.",
          "Avoid excess nitrogen which attracts aphids.",
        ],
      },
      {
        id: "stem-borer-maize",
        name: "Stem Borer (Maize/Cotton)",
        severity: "high",
        image: THREAT_IMAGES.stemBorer,
        cropSlugs: ["maize", "cotton"],
        diagnosis:
          "Dead heart in maize centre, bore holes in stem, frass visible — larvae feed inside stem.",
        immediateActions: [
          "Apply granular Chlorantraniliprole on leaf whorl in maize.",
          "Release Trichogramma cards @ 50,000/ha at egg-laying stage.",
          "Remove and destroy plants with dead heart.",
        ],
        prevention: [
          "Early sowing to escape peak pest population.",
          "Light trap (1/acre) to monitor adult moths.",
        ],
      },
    ],
  },
  {
    id: "leaf-curling",
    label: "Leaf Curling",
    labelHi: "पत्ते मुड़े / सिकुड़े",
    description: "Leaves curl inward, cup upward, or roll at edges",
    icon: Leaf,
    accent: "from-teal-100 to-cyan-50 border-teal-200",
    issues: [
      {
        id: "whitefly-curl",
        name: "Whitefly (Leaf Curl)",
        severity: "high",
        image: THREAT_IMAGES.aphid,
        cropSlugs: ["tomato", "chilli", "brinjal", "cotton"],
        diagnosis:
          "Tiny white flies under leaves cause upward curling, yellowing, and sticky honeydew. TYLCV risk in tomato.",
        immediateActions: [
          "Yellow sticky traps 10–15/acre; spray Neem oil 1% + sticker.",
          "Diafenthiuron 50% WP @ 15 g/15 L pump (IRAC 12A).",
          "Remove heavily infested leaves; avoid same IRAC twice.",
        ],
        prevention: [
          "Reflective mulch in nursery; resistant varieties in endemic areas.",
          "Conserve natural enemies — avoid broad-spectrum sprays.",
        ],
      },
      {
        id: "aphid-curl",
        name: "Aphid Curl",
        severity: "medium",
        image: THREAT_IMAGES.aphid,
        diagnosis:
          "Colonies under young leaves cause curling, stunting, and honeydew. Common in wheat heading, vegetables, and cotton.",
        immediateActions: [
          "Imidacloprid 17.8% SL @ 0.3 ml/L evening spray.",
          "Neem oil 1% if population is low.",
        ],
        prevention: ["Yellow traps; avoid excess nitrogen.", "Rotate crops; destroy weeds around field."],
      },
    ],
  },
  {
    id: "mosaic-virus",
    label: "Mosaic / Viral",
    labelHi: "मोज़ेक / वायरस",
    description: "Mottled green-yellow pattern, mosaic on leaves",
    icon: Sparkles,
    accent: "from-violet-100 to-purple-50 border-violet-200",
    issues: [
      {
        id: "tmv",
        name: "Tobacco Mosaic Virus",
        severity: "high",
        image: THREAT_IMAGES.viralPlant,
        cropSlugs: ["tomato", "chilli", "brinjal"],
        diagnosis:
          "Light and dark green mosaic on leaves, leaf distortion, stunted plants. Spreads by contact and tools.",
        immediateActions: [
          "Uproot and burn infected plants — no cure.",
          "Control aphids/whiteflies as vectors; wash hands/tools with soap.",
        ],
        prevention: ["Use virus-free seedlings.", "Do not smoke near tomato fields (TMV carrier)."],
      },
      {
        id: "leaf-curl-virus",
        name: "Chilli Leaf Curl Virus",
        severity: "high",
        image: THREAT_IMAGES.viralPlant,
        cropSlugs: ["chilli", "tomato"],
        diagnosis:
          "Severe upward leaf curl, puckering, stunted bushy plants. Spread by whitefly.",
        immediateActions: [
          "Remove infected plants; control whitefly vector.",
          "Imidacloprid soil drench or foliar as per label.",
        ],
        prevention: ["Resistant hybrids; reflective mulch in nursery.", "Rogue infected plants early."],
      },
    ],
  },
  {
    id: "sticky-leaves",
    label: "Sticky Leaves",
    labelHi: "चिपचिपी पत्तियाँ",
    description: "Honeydew, black sooty mould on leaf surface",
    icon: Droplets,
    accent: "from-sky-100 to-blue-50 border-sky-200",
    issues: [
      {
        id: "honeydew-whitefly",
        name: "Honeydew (Whitefly/Aphid)",
        severity: "medium",
        image: THREAT_IMAGES.aphid,
        diagnosis:
          "Shiny sticky coating on leaves from sap-sucking insects. Leads to black sooty mould and reduced photosynthesis.",
        immediateActions: [
          "Treat underlying insect — Neem 1% or Imidacloprid 0.3 ml/L.",
          "Wash sooty mould with mild soap water on vegetables if needed.",
        ],
        prevention: ["Regular scouting under leaves.", "Yellow traps for early catch."],
      },
      {
        id: "sooty-mold-sticky",
        name: "Sooty Mould",
        severity: "low",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "Black powdery fungal growth on upper leaf surface — grows on honeydew, not a primary disease.",
        immediateActions: [
          "Control sap-sucking insects first.",
          "Spray Wettable sulphur 2 g/L if mould is heavy.",
        ],
        prevention: ["Keep insect population low; improve air flow."],
      },
    ],
  },
  {
    id: "purple-blotches",
    label: "Purple / Red Blotches",
    labelHi: "बैंगनी / लाल धब्बे",
    description: "Purple stems, red-orange lesions, purpling of leaves",
    icon: CircleDot,
    accent: "from-fuchsia-100 to-pink-50 border-fuchsia-200",
    issues: [
      {
        id: "phosphorus-def",
        name: "Phosphorus Deficiency",
        severity: "medium",
        image: THREAT_IMAGES.paddy,
        diagnosis:
          "Purplish-red colour on older leaves and stems, especially in cold weather or acidic soils.",
        immediateActions: [
          "Apply DAP 50–75 kg/ha or foliar DAP 2% spray.",
          "Check soil pH — lime if too acidic.",
        ],
        prevention: ["Balanced basal dose at sowing.", "Soil test every 2–3 years."],
      },
      {
        id: "purple-blotch-onion",
        name: "Purple Blotch (Onion)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["onion"],
        diagnosis:
          "Purple sunken lesions with yellow halo on onion leaves — spreads in humid weather.",
        immediateActions: [
          "Mancozeb 75% WP @ 2 g/L or Azoxystrobin 250 SC @ 1 ml/L.",
          "Improve drainage; avoid overhead irrigation late evening.",
        ],
        prevention: ["Wider spacing; destroy crop debris.", "Rotate with non-allium crops."],
      },
    ],
  },
];

export function getCategoryCoverImage(categoryId: string): string {
  return SYMPTOM_CATEGORY_COVERS[categoryId] ?? THREAT_IMAGES.insectLeaf;
}

export function getSymptomCategory(id: string): SymptomCategory | undefined {
  return SYMPTOM_CATEGORIES.find((c) => c.id === id);
}

export function getIssuesForCrop(categoryId: string, cropSlug: string): SolverIssue[] {
  const category = getSymptomCategory(categoryId);
  if (!category) return [];
  return category.issues.filter(
    (issue) => !issue.cropSlugs || issue.cropSlugs.includes(cropSlug)
  );
}

export function getIssueById(categoryId: string, issueId: string): SolverIssue | undefined {
  const category = getSymptomCategory(categoryId);
  return category?.issues.find((i) => i.id === issueId);
}

export function issueDetailHref(issue: SolverIssue): string | null {
  if (!issue.threatLink) return null;
  const { cropSlug, threatType, threatId } = issue.threatLink;
  return threatDetailPath(cropSlug, threatType, threatId);
}
