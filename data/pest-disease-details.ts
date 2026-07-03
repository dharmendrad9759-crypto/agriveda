import type { ThreatCategory } from "@/types/pest-disease-ui";

/** Curated agricultural imagery — relevant stock photos per threat type */
export const THREAT_IMAGES = {
  insect: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80",
  insectLeaf: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=600&h=400&fit=crop&q=80",
  fungalLeaf: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80",
  bacterialLeaf: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80",
  viralPlant: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&q=80",
  weed: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=400&fit=crop&q=80",
  tomato: "https://images.unsplash.com/photo-1592921453113-2fdceb6e3c9f?w=600&h=400&fit=crop&q=80",
  maize: "https://images.unsplash.com/photo-1551754655-cd27f13c3a88?w=600&h=400&fit=crop&q=80",
  soybean: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80",
  paddy: "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=600&h=400&fit=crop&q=80",
  rust: "https://images.unsplash.com/photo-1622205313162-b1e0aafd392f?w=600&h=400&fit=crop&q=80",
} as const;

export interface ThreatDetailOverride {
  category?: ThreatCategory;
  image?: string;
  description?: string;
  symptoms?: string[];
  remediation?: string[];
  activeIngredient?: string;
  etl?: string;
}

/** Key: cropSlug-threatType-id e.g. potato-disease-d1 */
export const THREAT_DETAIL_OVERRIDES: Record<string, ThreatDetailOverride> = {
  "potato-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Late blight caused by Phytophthora infestans is the most destructive potato disease globally. The oomycete produces sporangia that spread via wind and rain splash, causing rapid collapse of foliage and tuber rot.",
    symptoms: [
      "Water-soaked dark lesions on leaf margins spreading inward",
      "White sporulation on leaf undersides in humid mornings",
      "Brown dry rot on tubers with reddish-brown internal discoloration",
    ],
    remediation: [
      "Apply Metalaxyl-M + Mancozeb prophylactically before weather turns cool and wet",
      "Destroy volunteer potato plants and cull piles near fields",
      "Harvest only when vines are fully dead; avoid wounding tubers",
      "Store at 4°C with ventilation; inspect weekly for soft rot spread",
    ],
    activeIngredient: "Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L",
  },
  "potato-disease-d2": {
    category: "fungal",
    image: THREAT_IMAGES.tomato,
    description:
      "Early blight (Alternaria solani) produces characteristic concentric ring spots. Survives on crop debris and infects through stomata during warm, humid periods.",
    symptoms: [
      "Dark brown target-like spots with concentric rings on older leaves",
      "Yellow halo around lesions; premature defoliation from bottom up",
      "Dark sunken lesions on stems and tubers near soil line",
    ],
    remediation: [
      "Spray Azoxystrobin 250 SC @ 1 ml/L at first symptom",
      "Rotate with non-solanaceous crops for 3 years",
      "Remove lower infected leaves to improve airflow",
      "Avoid overhead irrigation after 10 AM",
    ],
    activeIngredient: "Azoxystrobin 250 SC @ 1 ml/L (FRAC 11)",
  },
  "potato-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Green peach aphid (Myzus persicae) vectors potato virus Y (PVY) and feeds on phloem sap, causing leaf curl and honeydew that supports sooty mould.",
    symptoms: [
      "Curled and yellowing leaves",
      "Sticky honeydew on leaf surfaces",
      "Stunted plant growth",
      "Virus mosaic patterns if PVY infected",
    ],
    remediation: [
      "Use virus-free certified seed tubers",
      "Spray Imidacloprid 17.8 SL @ 0.3 ml/L at ETL (5 aphids per leaf)",
      "Release ladybird beetles in greenhouse nurseries",
      "Apply reflective mulch to repel winged aphids",
    ],
    activeIngredient: "Imidacloprid 17.8 SL @ 0.3 ml/L (IRAC 4A)",
    etl: "5 aphids per compound leaf",
  },
  "tomato-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Alternaria solani causes early blight in tomato. Dense staking and overhead irrigation accelerate spread in Indian Rabi season.",
    symptoms: [
      "Brown lesions with concentric rings on lower leaves first",
      "Stem cankers causing girdling and plant death",
      "Fruit lesions near calyx — leathery dark depressions",
    ],
    remediation: [
      "Chlorothalonil 75 WP @ 2 g/L preventive spray every 10 days",
      "Maintain 75×45 cm spacing with single-stem staking",
      "Apply calcium nitrate foliar to strengthen cell walls",
      "Remove crop debris immediately after final harvest",
    ],
    activeIngredient: "Chlorothalonil 75 WP @ 2 g/L (FRAC M5)",
  },
  "tomato-disease-d3": {
    category: "bacterial",
    image: THREAT_IMAGES.bacterialLeaf,
    description:
      "Ralstonia solanacearum causes bacterial wilt — a soil-borne pathogen that blocks xylem vessels. Once established in a field, it persists for years.",
    symptoms: [
      "Sudden wilting of entire plant during hot midday",
      "Brown discoloration of vascular tissue when stem cut",
      "White bacterial ooze in water — bacterial streaming test positive",
    ],
    remediation: [
      "Use resistant hybrids (Arka Vikas, Sakthi) in endemic areas",
      "Soil solarization for 4–6 weeks before transplanting",
      "Graft susceptible varieties onto resistant rootstock",
      "Never plant tomato after potato, brinjal, or chilli in same plot",
    ],
    activeIngredient: "Streptocycline 0.5 g/L soil drench (suppressive only)",
  },
  "tomato-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insectLeaf,
    description:
      "Helicoverpa armigera (fruit borer) larvae bore into tomato fruits, making them unmarketable and creating entry points for secondary rot.",
    symptoms: [
      "Circular bore holes on green and ripe fruits",
      "Frass pellets at entry holes",
      "Premature fruit drop",
      "Secondary bacterial soft rot at bore sites",
    ],
    remediation: [
      "Install pheromone traps @ 5/ha for monitoring",
      "Spray Emamectin benzoate 5 SG @ 0.4 g/L at 10% fruit infestation",
      "Release HaNPV @ 250 LE/ha when larvae are 1st–2nd instar",
      "Harvest ripe fruits promptly; destroy damaged fruits away from field",
    ],
    activeIngredient: "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
    etl: "10% fruits with live larvae",
  },
  "maize-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.maize,
    description:
      "Spodoptera frugiperda (Fall Armyworm) is a devastating invasive pest in Indian maize. Larvae feed inside the whorl — foliar sprays must be directed into the whorl.",
    symptoms: [
      "Window-pane feeding on young leaves in whorl",
      "Large ragged holes and frass in leaf axils",
      "Dead heart in seedling stage",
      "Damage to tassel and cob in severe infestation",
    ],
    remediation: [
      "Scout daily at dawn — check whorl for larvae <2 cm",
      "Apply Chlorantraniliprole 18.5 SC @ 0.4 ml/L directly into whorl",
      "Use pheromone traps @ 5/ha for adult monitoring",
      "Intercrop with cowpea to support natural enemies",
    ],
    activeIngredient: "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
    etl: "10% plants with egg masses or 5% whorl damage",
  },
  "maize-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.rust,
    description:
      "Exserohilum turcicum causes Turcicum Leaf Blight. Long elliptical lesions reduce photosynthetic area during grain fill.",
    symptoms: [
      "Elliptical tan lesions 3–15 cm with dark brown borders",
      "Lesions parallel to leaf veins on lower leaves first",
      "Premature leaf senescence in susceptible hybrids",
    ],
    remediation: [
      "Plant TLB-tolerant hybrids (PMH 8, NK 6240)",
      "Azoxystrobin 250 SC @ 1 ml/L at first symptom",
      "Rotate maize with legumes to reduce inoculum",
      "Balanced potassium fertilization improves resistance",
    ],
    activeIngredient: "Azoxystrobin 250 SC @ 1 ml/L (FRAC 11)",
  },
  "soybean-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.rust,
    description:
      "Asian soybean rust (Phakopsora pachyrhizi) is the most yield-limiting foliar disease. Spores travel long distances on wind.",
    symptoms: [
      "Small tan to reddish-brown pustules on leaf undersides",
      "Yellowing and defoliation from lower canopy upward",
      "Up to 80% yield loss if untreated in susceptible varieties",
    ],
    remediation: [
      "Spray Propiconazole 25 EC @ 1 ml/L at R1 (first flower) stage",
      "Use resistant varieties (JS 20-29, MACS 1407)",
      "Scout lower canopy weekly post-monsoon",
      "Rotate with cereals; avoid consecutive soybean",
    ],
    activeIngredient: "Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
  },
  "soybean-disease-d2": {
    category: "viral",
    image: THREAT_IMAGES.viralPlant,
    description:
      "Mungbean Yellow Mosaic Virus (MYMV) in soybean causes severe stunting and pod loss. Transmitted by whitefly (Bemisia tabaci).",
    symptoms: [
      "Bright yellow mosaic pattern on leaves",
      "Stunted plants with few pods",
      "Pod size reduced; grain shrivelled",
    ],
    remediation: [
      "Use virus-resistant varieties (JS 20-34, MACS 58)",
      "Control whitefly with Thiamethoxam seed treatment 4 g/kg",
      "Rogue infected plants immediately on first symptom",
      "Avoid late sowing which coincides with peak whitefly population",
    ],
    activeIngredient: "Thiamethoxam 30 FS seed treatment @ 4 g/kg",
  },
  "paddy-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.paddy,
    description:
      "Rice blast (Magnaporthe oryzae) is the #1 rice disease in India. Neck blast at heading can cause 100% grain loss.",
    symptoms: [
      "Diamond-shaped lesions with grey centre and brown margin",
      "Neck rot — blackened panicle neck causing chaffy grains",
      "Node rot causing plant breakage",
    ],
    remediation: [
      "Tricyclazole 75 WP @ 0.6 g/L at boot leaf stage",
      "Avoid excess nitrogen — split application using LCC",
      "Silicon fertilization 200 kg/ha reduces blast severity",
      "Use resistant varieties where available",
    ],
    activeIngredient: "Tricyclazole 75 WP @ 0.6 g/L (FRAC 3)",
  },
  "paddy-disease-d3": {
    category: "bacterial",
    image: THREAT_IMAGES.bacterialLeaf,
    description:
      "Bacterial leaf blight (Xanthomonas oryzae pv. oryzae) enters through hydathodes and wounds. Spread by rain splash.",
    symptoms: [
      "Water-soaked lesions on leaf margins turning yellow then white",
      "Kresek phase — wilting of entire seedling clump",
      "Milky bacterial ooze on lesion surface in morning",
    ],
    remediation: [
      "Streptocycline 0.15 g/L + Copper oxychloride 3 g/L spray",
      "Use resistant varieties (IR 64, Swarna Sub-1)",
      "Avoid excessive nitrogen fertilization",
      "Drain field briefly to reduce humidity in canopy",
    ],
    activeIngredient: "Streptocycline sulphate 9% + Tetracycline 1% @ 0.15 g/L",
  },
};
