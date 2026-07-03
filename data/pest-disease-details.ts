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
  "paddy-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Brown planthopper (Nilaparvata lugens) feeds at the base of tillers and causes hopperburn. Overuse of IRAC 4A neonics worsens outbreaks by killing natural enemies.",
    symptoms: [
      "Circular yellow patches in the field",
      "Hopperburn — plants dry from the base upward",
      "Honeydew and sooty mould on lower leaves",
    ],
    remediation: [
      "Buprofezin 25 SC @ 1 ml/L (IRAC 16) — spray toward plant base",
      "Pymetrozine 50 WG @ 0.75 g/L (IRAC 9B) as alternate spray",
      "Triflumezopyrim 106 SC @ 0.5 ml/L (IRAC 4E) — do not follow with another 4A/4E",
      "Conserve mirid bugs; avoid early broad-spectrum sprays",
    ],
    activeIngredient: "Buprofezin 25 SC @ 1 ml/L (IRAC 16)",
    etl: "5–10 hoppers/hill (vegetative); 10–20/hill (reproductive)",
  },
  "paddy-pest-p2": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Yellow stem borer (Scirpophaga incertulas) causes dead hearts and white ears. Larvae bore inside the stem so contact sprays alone often fail.",
    symptoms: [
      "Dead heart — central shoot dries and pulls out easily",
      "White ear — empty chaffy panicle at heading",
      "Bore holes and frass in stem",
    ],
    remediation: [
      "Cartap hydrochloride 50 SP / 4G @ 1 kg/ha (IRAC 14) at tillering",
      "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
      "Trichogramma japonicum @ 50,000/ha weekly × 6 from 30 DAS",
      "Clip seedling tips before transplant to remove egg masses",
    ],
    activeIngredient: "Cartap hydrochloride 50 SP @ 1 kg/ha (IRAC 14)",
    etl: "5% dead hearts or 1 egg mass/m²",
  },
  "paddy-pest-p3": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Rice armyworm / swarming caterpillar can defoliate patches overnight after rains. Larvae hide in soil by day — spray in the evening.",
    symptoms: [
      "Skeletonised or fully eaten leaves",
      "Larvae hide in soil cracks by day",
      "Rapid patchy damage after rain",
    ],
    remediation: [
      "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6) evening spray",
      "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28) as alternate MoA",
      "Brief flooding can drown larvae where field allows",
    ],
    activeIngredient: "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
    etl: "1–2 larvae/hill or visible defoliation patches",
  },
  "paddy-pest-p4": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Leaf folder (Cnaphalocrocis medinalis) folds leaves longitudinally and scrapes the green tissue. Excess nitrogen increases damage.",
    symptoms: [
      "Longitudinal leaf folds",
      "White scraped patches on leaves",
      "Reduced grain filling in severe cases",
    ],
    remediation: [
      "Flubendiamide 20 WG @ 0.25 g/L (IRAC 28)",
      "Spinosad 45 SC @ 0.3 ml/L (IRAC 5) — rotate with diamides",
      "Avoid excess nitrogen; release Trichogramma",
    ],
    activeIngredient: "Flubendiamide 20 WG @ 0.25 g/L (IRAC 28)",
    etl: "1–2 freshly damaged leaves/hill",
  },
  "paddy-pest-p5": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Green leafhopper (Nephotettix virescens) is the main vector of rice tungro virus. Control vectors early if tungro is common in your area.",
    symptoms: [
      "Yellowing of leaves",
      "Stunted plants if tungro is transmitted",
      "Hoppers on upper canopy",
    ],
    remediation: [
      "Imidacloprid 200 SL @ 0.3 ml/L (IRAC 4A)",
      "Thiamethoxam 25 WG @ 0.2 g/L (IRAC 4A) — do not repeat 4A consecutively",
      "Remove weed hosts; synchronised village planting reduces pressure",
    ],
    activeIngredient: "Imidacloprid 200 SL @ 0.3 ml/L (IRAC 4A)",
    etl: "5–10 hoppers/hill",
  },
  "paddy-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.paddy,
    description:
      "Rice blast (Magnaporthe oryzae) is the #1 rice disease in India. Neck blast at heading can cause near-total grain loss. Tricyclazole is FRAC 16.1 (melanin), not FRAC 3.",
    symptoms: [
      "Diamond-shaped lesions with grey centre and brown margin",
      "Neck rot — blackened panicle neck causing chaffy grains",
      "Node rot causing plant breakage",
    ],
    remediation: [
      "Tricyclazole 75 WP @ 0.6 g/L at boot leaf stage (FRAC 16.1)",
      "Isoprothiolane 40 EC @ 1.5 ml/L (FRAC 6) as alternate MoA",
      "Avoid excess nitrogen — split application using LCC",
      "Silicon fertilization 200 kg/ha reduces blast severity",
    ],
    activeIngredient: "Tricyclazole 75 WP @ 0.6 g/L (FRAC 16.1)",
  },
  "paddy-disease-d2": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Sheath blight (Rhizoctonia solani) starts near the water line and spreads upward in dense, high-N canopies.",
    symptoms: [
      "Oval greenish-grey lesions on leaf sheath",
      "Lesions coalesce; sheath and leaves dry",
      "Unfilled grains and lodging",
    ],
    remediation: [
      "Validamycin 3 L @ 2.5 ml/L (FRAC 26) at first symptom",
      "Hexaconazole 5 EC @ 1 ml/L (FRAC 3) as alternate spray",
      "Wider spacing and balanced N to reduce humidity",
      "Trichoderma harzianum soil application 2.5 kg/ha",
    ],
    activeIngredient: "Validamycin 3 L @ 2.5 ml/L (FRAC 26)",
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
      "Use resistant varieties (IR 64, Swarna-Sub1)",
      "Avoid excessive nitrogen fertilization",
      "Drain field briefly to reduce humidity in canopy",
    ],
    activeIngredient: "Streptocycline @ 0.15 g/L + Copper oxychloride 50 WP @ 3 g/L",
  },
  "paddy-disease-d4": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Brown spot (Bipolaris oryzae) is worse in nutrient-poor or drought-stressed fields. Correct K and Zn deficiency along with fungicide.",
    symptoms: [
      "Oval brown spots with grey centre on leaves",
      "Spots on glumes — grain discolouration",
      "More severe in poor soils",
    ],
    remediation: [
      "Mancozeb 75 WP @ 2 g/L (FRAC M3)",
      "Propiconazole 25 EC @ 1 ml/L (FRAC 3) if severe",
      "Correct potassium and zinc deficiency",
      "Use healthy certified seed",
    ],
    activeIngredient: "Mancozeb 75 WP @ 2 g/L (FRAC M3)",
  },
  "paddy-disease-d5": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "False smut (Ustilaginoidea virens) replaces grains with orange to greenish-black spore balls. Spray at boot leaf, not after full flowering.",
    symptoms: [
      "Orange to greenish-black spore balls on panicle",
      "Few to many grains per panicle affected",
      "Late infection after flowering",
    ],
    remediation: [
      "Propiconazole 25 EC @ 1 ml/L (FRAC 3) at boot leaf to early flowering",
      "Avoid excess nitrogen at panicle initiation",
      "Remove infected panicles from seed plots",
    ],
    activeIngredient: "Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
  },
  "paddy-weed-w1": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Barnyard grass (Echinochloa crus-galli) is the most competitive grassy weed in transplanted rice. Critical period is 0–45 DAS.",
    symptoms: [
      "Grass-like plants mimicking rice seedlings",
      "Reduces tillers and yield if uncontrolled early",
    ],
    remediation: [
      "Pretilachlor 50 EC @ 0.6–0.75 kg a.i./ha at 3 DAS (HRAC 15)",
      "Bispyribac-sodium 10 SC @ 25 g a.i./ha at 15–20 DAS (HRAC 2)",
      "Puddling and stale seedbed before transplant",
    ],
    activeIngredient: "Pretilachlor 50 EC (pre) / Bispyribac-sodium 10 SC (post)",
  },
  "paddy-weed-w2": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description: "Flat sedge (Cyperus iria) thrives in poorly levelled fields. Maintain standing water after herbicide.",
    symptoms: ["Triangular stem sedges in field", "Competes for nutrients at tillering"],
    remediation: [
      "Pyrazosulfuron-ethyl 10 WP @ 20 g a.i./ha (HRAC 2) at 3–5 DAS",
      "Bispyribac-sodium 10 SC @ 25 g a.i./ha post-emergence",
      "Maintain 5 cm standing water",
    ],
    activeIngredient: "Pyrazosulfuron-ethyl 10 WP @ 20 g a.i./ha",
  },
  "paddy-weed-w3": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Monochoria and other broadleaf weeds. Use 2,4-D only on direct-seeded rice and never near basmati at panicle initiation.",
    symptoms: ["Broadleaf weeds in standing water", "Competes during tillering"],
    remediation: [
      "Pretilachlor 50 EC pre-emergence",
      "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (HRAC 4) — direct-seeded only",
      "Hand weeding at 20 & 40 DAS",
    ],
    activeIngredient: "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (direct-seeded)",
  },

  "chilli-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Chilli thrips (Scirtothrips dorsalis) curl young leaves upward and scar fruits. Early control prevents yield loss and reduces secondary virus stress.",
    symptoms: [
      "Upward leaf curl and crinkling",
      "Bird-eye scars on fruits",
      "Brittle tender shoots",
    ],
    remediation: [
      "Fipronil 5 SC @ 1.5–2 ml/L (IRAC 2B)",
      "Diafenthiuron 50 WP @ 1 g/L (IRAC 12A) after 10 days",
      "Spinosad 45 SC @ 0.3 ml/L (IRAC 5) as third rotation option",
      "Yellow/blue sticky traps @ 20–25/acre",
    ],
    activeIngredient: "Fipronil 5 SC @ 1.5–2 ml/L (IRAC 2B)",
    etl: "2–5 thrips/leaf or 10% damaged leaves",
  },
  "chilli-pest-p2": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Whitefly (Bemisia tabaci) is the main vector of chilli leaf curl virus. Vector management is more important than waiting for virus symptoms.",
    symptoms: [
      "White insects on leaf undersides",
      "Honeydew and sooty mould",
      "Leaf curl if virus is transmitted",
    ],
    remediation: [
      "Pyriproxyfen 10 EC @ 1 ml/L (IRAC 7C)",
      "Diafenthiuron 50 WP @ 1 g/L (IRAC 12A)",
      "Spiromesifen 240 SC @ 0.5 ml/L (IRAC 23)",
      "Rogue virus-infected plants immediately",
    ],
    activeIngredient: "Pyriproxyfen 10 EC @ 1 ml/L (IRAC 7C)",
    etl: "5–10 adults/leaf or first virus symptoms",
  },
  "chilli-pest-p3": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Fruit borer (Helicoverpa armigera) bores into buds and fruits. Spray in the evening and cover fruits thoroughly.",
    symptoms: [
      "Holes in green fruits with frass",
      "Flower and bud drop",
      "Internal feeding and secondary rot",
    ],
    remediation: [
      "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
      "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
      "Indoxacarb 14.5 SC @ 0.5 ml/L (IRAC 22A)",
      "HaNPV @ 250 LE/ha and pheromone traps for monitoring",
    ],
    activeIngredient: "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
    etl: "1 larva/plant or 5% damaged fruits",
  },
  "chilli-pest-p4": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Yellow mite (Polyphagotarsonemus latus) causes downward leaf curl and bronzing — opposite of thrips upward curl. Common in dry weather.",
    symptoms: [
      "Downward leaf curl",
      "Narrow elongated tender leaves",
      "Bronzing and corky fruit surface",
    ],
    remediation: [
      "Abamectin 1.9 EC @ 0.5–0.75 ml/L (IRAC 6)",
      "Spiromesifen 240 SC @ 0.5 ml/L (IRAC 23)",
      "Spray undersides of young leaves",
      "Avoid repeated pyrethroids which flare mites",
    ],
    activeIngredient: "Abamectin 1.9 EC @ 0.5–0.75 ml/L (IRAC 6)",
    etl: "First bronzing / downward curl on tender leaves",
  },
  "chilli-pest-p5": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Aphids colonise tender shoots and can transmit viruses. Prefer non-4A options if neonics were already used for whitefly.",
    symptoms: ["Curled tender leaves", "Sticky honeydew", "Sooty mould"],
    remediation: [
      "Acetamiprid 20 SP @ 0.2–0.3 g/L (IRAC 4A)",
      "Conserve ladybird beetles — avoid early broad-spectrum sprays",
      "Yellow sticky traps",
    ],
    activeIngredient: "Acetamiprid 20 SP @ 0.2–0.3 g/L (IRAC 4A)",
    etl: "10–20 aphids/leaf or colonies on 10% plants",
  },
  "chilli-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Anthracnose / fruit rot (Colletotrichum capsici) causes sunken spots on fruits in humid weather. Drip irrigation reduces splash spread.",
    symptoms: [
      "Sunken circular spots with concentric rings",
      "Black acervuli in lesion centre",
      "Fruit rot and drop",
    ],
    remediation: [
      "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L",
      "Azoxystrobin 250 SC @ 1 ml/L (FRAC 11) — rotate, high resistance risk",
      "Remove infected fruits; avoid overhead irrigation",
    ],
    activeIngredient: "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L",
  },
  "chilli-disease-d2": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Die-back starts from tender twig tips. Prune infected parts and protect cuts with copper fungicide.",
    symptoms: [
      "Die-back of twigs from tip",
      "Necrotic stem lesions",
      "Flower and fruit drop",
    ],
    remediation: [
      "Prune and destroy infected twigs",
      "Copper oxychloride 50 WP @ 3 g/L (FRAC M1)",
      "Propiconazole 25 EC @ 1 ml/L (FRAC 3) if severe",
    ],
    activeIngredient: "Copper oxychloride 50 WP @ 3 g/L (FRAC M1)",
  },
  "chilli-disease-d3": {
    category: "viral",
    image: THREAT_IMAGES.viralPlant,
    description:
      "Chilli leaf curl virus (Begomovirus) has no chemical cure. Control whitefly vector and rogue infected plants early.",
    symptoms: [
      "Upward leaf curling and yellowing from margins",
      "Stunted bushy plants",
      "Poor flowering and fruiting",
    ],
    remediation: [
      "Remove and destroy infected plants same day",
      "Pyriproxyfen 10 EC @ 1 ml/L for whitefly (IRAC 7C)",
      "Diafenthiuron 50 WP @ 1 g/L (IRAC 12A)",
      "Use tolerant varieties next season",
    ],
    activeIngredient: "Pyriproxyfen 10 EC @ 1 ml/L (vector control)",
  },
  "chilli-disease-d4": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Powdery mildew (Leveillula taurica) shows white growth on leaf undersides. Spray sulphur in early morning, not in hot sun.",
    symptoms: [
      "White powdery growth on leaf undersides",
      "Yellow patches on upper leaf surface",
      "Premature leaf drop",
    ],
    remediation: [
      "Wettable sulphur 80 WP @ 2–3 g/L (FRAC M2)",
      "Hexaconazole 5 EC @ 1 ml/L (FRAC 3) if severe",
      "Avoid excess nitrogen; improve airflow",
    ],
    activeIngredient: "Wettable sulphur 80 WP @ 2–3 g/L (FRAC M2)",
  },
  "chilli-disease-d5": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Damping-off and wilt are soil-borne. Prevention in nursery is more effective than curative sprays in the field.",
    symptoms: [
      "Seedling collapse at soil line",
      "Wilting after transplant",
      "Brown vascular tissue (Fusarium)",
    ],
    remediation: [
      "Carbendazim 50 WP seed treatment @ 2 g/kg (FRAC 1)",
      "Trichoderma viride 10 g/kg seed + 2.5 kg/ha soil",
      "Metalaxyl + Mancozeb drench 2 g/L for Pythium in nursery",
      "Raised beds and avoid waterlogging",
    ],
    activeIngredient: "Carbendazim 50 WP @ 2 g/kg seed",
  },
  "chilli-weed-w1": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Parthenium competes strongly in the first 40 days. Plastic mulch on raised beds is the best long-term option.",
    symptoms: ["Broadleaf weed infestation", "Reduced early growth"],
    remediation: [
      "Pendimethalin 30 EC @ 1.0 kg a.i./ha within 3 DAT (HRAC 3)",
      "Hand weeding at 20–25 DAT",
      "Plastic mulch on raised beds",
    ],
    activeIngredient: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
  },
  "chilli-weed-w2": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description: "Trianthema is a common broadleaf weed in chilli beds. Control early with pre-emergence herbicide.",
    symptoms: ["Broadleaf weeds between rows", "Competes at establishment"],
    remediation: [
      "Pendimethalin 30 EC pre-emergence",
      "Interculture between rows",
      "Drip + mulching",
    ],
    activeIngredient: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
  },
  "chilli-weed-w3": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Grassy weeds in chilli. Use quizalofop only as directed spray between rows if the label allows.",
    symptoms: ["Grassy weeds in inter-row", "Early competition"],
    remediation: [
      "Pendimethalin 30 EC pre-emergence (HRAC 3)",
      "Quizalofop-ethyl 5 EC @ 50 g a.i./ha directed (HRAC 1)",
      "Stale seedbed before transplant",
    ],
    activeIngredient: "Pendimethalin 30 EC / Quizalofop-ethyl 5 EC",
  },
};
