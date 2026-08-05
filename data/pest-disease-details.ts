import type { StageSprayRecommendation } from "@/types/crop-protection";
import type { ThreatCategory } from "@/types/pest-disease-ui";

/** Curated agricultural imagery — relevant stock photos per threat type */
export const THREAT_IMAGES = {
  insect: "/images/threats/threat-insect.jpg",
  insectLeaf: "/images/threats/threat-insect.jpg",
  fungalLeaf: "/images/threats/threat-disease.jpg",
  bacterialLeaf: "/images/threats/threat-disease.jpg",
  viralPlant: "/images/threats/threat-yellow.jpg",
  weed: "/images/threats/threat-weed.jpg",
  potato: "/images/crops/potato.jpg",
  tomato: "/images/crops/tomato.jpg",
  maize: "/images/crops/maize.jpg",
  soybean: "/images/crops/soybean.jpg",
  paddy: "/images/crops/paddy.jpg",
  rust: "/images/threats/threat-disease.jpg",
  wilting: "/images/threats/threat-yellow.jpg",
  fruitDamage: "/images/threats/threat-insect.jpg",
  rootRot: "/images/threats/threat-yellow.jpg",
  stemBorer: "/images/threats/threat-insect.jpg",
  aphid: "/images/threats/threat-insect.jpg",
} as const;

export interface ThreatDetailOverride {
  category?: ThreatCategory;
  image?: string;
  description?: string;
  symptoms?: string[];
  remediation?: string[];
  activeIngredient?: string;
  etl?: string;
  stageSprays?: StageSprayRecommendation[];
  rotationNotes?: string;
  stageExtraNotes?: string[];
  continuousHarvest?: boolean;
}

/** Key: cropSlug-threatType-id e.g. potato-disease-d1 */
export const THREAT_DETAIL_OVERRIDES: Record<string, ThreatDetailOverride> = {
  "potato-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Phytophthora infestans से Late blight दुनिया में सबसे विनाशकारी आलू रोग है। Oomycete sporangia हवा और rain splash से फैलते हैं, पत्तियाँ तेजी से सूखती हैं और tuber rot होता है।",
    symptoms: [
      "पत्ती के किनारों पर water-soaked dark lesions अंदर की ओर फैलते हैं",
      "Humid सुबह leaf undersides पर white sporulation",
      "Tubers पर brown dry rot, अंदर reddish-brown discoloration",
    ],
    remediation: [
      "मौसम ठंडा-गीला होने से पहले Metalaxyl-M + Mancozeb निवारक रूप से लगाएँ",
      "Volunteer potato plants और cull piles खेत के पास नष्ट करें",
      "Vines पूरी तरह सूखने पर ही harvest; tubers में chot न लगाएँ",
      "4°C पर ventilation के साथ store; soft rot spread के लिए साप्ताहिक inspection",
    ],
    activeIngredient: "Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L",
  },
  "potato-disease-d2": {
    category: "fungal",
    image: THREAT_IMAGES.tomato,
    description:
      "Early blight (Alternaria solani) विशिष्ट concentric ring spots पैदा करता है। Crop debris पर survive करता है, warm humid periods में stomata से infect करता है।",
    symptoms: [
      "पुरानी पत्तियों पर dark brown target-like spots concentric rings के साथ",
      "Lesions के चारों ओर yellow halo; नीचे से premature defoliation",
      "Stems और soil line के पास tubers पर dark sunken lesions",
    ],
    remediation: [
      "पहले लक्षण पर Azoxystrobin 250 SC @ 1 ml/L spray",
      "3 वर्ष non-solanaceous crops के साथ rotation",
      "Airflow बढ़ाने के लिए नीचली infected leaves हटाएँ",
      "10 AM के बाद overhead irrigation से बचें",
    ],
    activeIngredient: "Azoxystrobin 250 SC @ 1 ml/L (FRAC 11)",
  },
  "potato-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Green peach aphid (Myzus persicae) potato virus Y (PVY) vector है और phloem sap चूसता है — leaf curl और honeydew, sooty mould को बढ़ावा।",
    symptoms: [
      "पत्तियाँ मुड़कर पीली होना",
      "Leaf surfaces पर sticky honeydew",
      "पौधे की वृद्धि रुकना",
      "PVY infection हो तो virus mosaic patterns",
    ],
    remediation: [
      "Virus-free certified seed tubers उपयोग करें",
      "ETL (5 aphids per leaf) पर Imidacloprid 17.8 SL @ 0.3 ml/L spray",
      "Greenhouse nursery में ladybird beetles release",
      "Winged aphids repel करने reflective mulch लगाएँ",
    ],
    activeIngredient: "Imidacloprid 17.8 SL @ 0.3 ml/L (IRAC 4A)",
    etl: "5 aphids per compound leaf",
  },
  "tomato-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Alternaria solani tomato में early blight पैदा करता है। Dense staking और overhead irrigation भारतीय Rabi season में spread बढ़ाते हैं।",
    symptoms: [
      "पहले lower leaves पर brown lesions concentric rings के साथ",
      "Stem cankers girdling और plant death",
      "Calyx के पास fruit lesions — leathery dark depressions",
    ],
    remediation: [
      "Chlorothalonil 75 WP @ 2 g/L preventive spray हर 10 दिन",
      "75×45 cm spacing single-stem staking के साथ",
      "Cell walls मजबूत करने Calcium nitrate foliar",
      "Final harvest के तुरंत बाद crop debris हटाएँ",
    ],
    activeIngredient: "Chlorothalonil 75 WP @ 2 g/L (FRAC M5)",
  },
  "tomato-disease-d3": {
    category: "bacterial",
    image: THREAT_IMAGES.bacterialLeaf,
    description:
      "Ralstonia solanacearum bacterial wilt पैदा करता है — soil-borne pathogen xylem vessels ब्लॉक करता है। Field में establish होने पर वर्षों तक रहता है।",
    symptoms: [
      "गर्म दोपहर में पूरे पौधे का अचानक wilting",
      "Stem काटने पर vascular tissue brown discoloration",
      "पानी में white bacterial ooze — bacterial streaming test positive",
    ],
    remediation: [
      "Endemic areas में resistant hybrids (Arka Vikas, Sakthi) उपयोग",
      "Transplanting से पहले 4–6 weeks soil solarization",
      "Susceptible varieties resistant rootstock पर graft",
      "Same plot में potato, brinjal, chilli के बाद tomato न बोएँ",
    ],
    activeIngredient: "Streptocycline 0.5 g/L soil drench (suppressive only)",
  },
  "tomato-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insectLeaf,
    description:
      "Helicoverpa armigera (fruit borer) larvae tomato fruits में bore करते हैं — unmarketable और secondary rot entry points।",
    symptoms: [
      "Green और ripe fruits पर circular bore holes",
      "Entry holes पर frass pellets",
      "Premature fruit drop",
      "Bore sites पर secondary bacterial soft rot",
    ],
    remediation: [
      "Monitoring के लिए pheromone traps @ 5/ha",
      "10% fruit infestation पर Emamectin benzoate 5 SG @ 0.4 g/L spray",
      "Larvae 1st–2nd instar हों तो HaNPV @ 250 LE/ha release",
      "Ripe fruits promptly harvest; damaged fruits field से दूर नष्ट",
    ],
    activeIngredient: "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
    etl: "10% fruits with live larvae",
  },
  "maize-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.maize,
    description:
      "Spodoptera frugiperda (Fall Armyworm) भारतीय maize में विनाशकारी invasive pest है। Larvae whorl के अंदर feed करते हैं — foliar sprays whorl में directed होने चाहिए।",
    symptoms: [
      "Young leaves पर whorl में window-pane feeding",
      "Leaf axils में large ragged holes और frass",
      "Seedling stage में dead heart",
      "गंभीर infestation में tassel और cob damage",
    ],
    remediation: [
      "Dawn पर daily scout — whorl में larvae <2 cm जाँचें",
      "Chlorantraniliprole 18.5 SC @ 0.4 ml/L सीधे whorl में",
      "Adult monitoring pheromone traps @ 5/ha",
      "Natural enemies support के लिए cowpea intercrop",
    ],
    activeIngredient: "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
    etl: "10% plants with egg masses or 5% whorl damage",
  },
  "maize-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.rust,
    description:
      "Exserohilum turcicum Turcicum Leaf Blight पैदा करता है। Long elliptical lesions grain fill के दौरान photosynthetic area कम करते हैं।",
    symptoms: [
      "3–15 cm elliptical tan lesions dark brown borders के साथ",
      "Lower leaves पर leaf veins के parallel lesions",
      "Susceptible hybrids में premature leaf senescence",
    ],
    remediation: [
      "TLB-tolerant hybrids (PMH 8, NK 6240) बोएँ",
      "पहले लक्षण पर Azoxystrobin 250 SC @ 1 ml/L",
      "Inoculum कम करने maize-legumes rotation",
      "Balanced potassium fertilization resistance बढ़ाती है",
    ],
    activeIngredient: "Azoxystrobin 250 SC @ 1 ml/L (FRAC 11)",
  },
  "soybean-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.rust,
    description:
      "Asian soybean rust (Phakopsora pachyrhizi) सबसे उपज सीमित foliar disease है। Spores हवा से लंबी दूरी तक जाते हैं।",
    symptoms: [
      "Leaf undersides पर छोटे tan से reddish-brown pustules",
      "Lower canopy से ऊपर yellowing और defoliation",
      "Susceptible varieties में untreated 80% yield loss तक",
    ],
    remediation: [
      "R1 (first flower) stage पर Propiconazole 25 EC @ 1 ml/L spray",
      "Resistant varieties (JS 20-29, MACS 1407) उपयोग",
      "Monsoon के बाद lower canopy साप्ताहिक scout",
      "Cereals के साथ rotation; consecutive soybean से बचें",
    ],
    activeIngredient: "Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
  },
  "soybean-disease-d2": {
    category: "viral",
    image: THREAT_IMAGES.viralPlant,
    description:
      "Soybean में Mungbean Yellow Mosaic Virus (MYMV) गंभीर stunting और pod loss। Whitefly (Bemisia tabaci) से transmitted।",
    symptoms: [
      "पत्तियों पर bright yellow mosaic pattern",
      "Stunted plants, few pods",
      "Pod size कम; grain shrivelled",
    ],
    remediation: [
      "Virus-resistant varieties (JS 20-34, MACS 58) उपयोग",
      "Thiamethoxam seed treatment 4 g/kg से whitefly control",
      "पहले लक्षण पर infected plants तुरंत rogue",
      "Late sowing से बचें — peak whitefly population से overlap",
    ],
    activeIngredient: "Thiamethoxam 30 FS seed treatment @ 4 g/kg",
  },
  "paddy-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Brown planthopper (Nilaparvata lugens) tillers के base पर feed करता है, hopperburn पैदा करता है। IRAC 4A neonics का overuse natural enemies मारकर outbreaks बढ़ाता है।",
    symptoms: [
      "खेत में circular yellow patches",
      "Hopperburn — base से ऊपर plants सूखते हैं",
      "Lower leaves पर honeydew और sooty mould",
    ],
    remediation: [
      "Buprofezin 25 SC @ 1 ml/L (IRAC 16) — plant base की ओर spray",
      "Alternate spray Pymetrozine 50 WG @ 0.75 g/L (IRAC 9B)",
      "Triflumezopyrim 106 SC @ 0.5 ml/L (IRAC 4E) — 4A/4E के बाद दोबारा 4A/4E न लगाएँ",
      "Mirid bugs बचाएँ; early broad-spectrum sprays से बचें",
    ],
    activeIngredient: "Buprofezin 25 SC @ 1 ml/L (IRAC 16)",
    etl: "5–10 hoppers/hill (vegetative); 10–20/hill (reproductive)",
  },
  "paddy-pest-p2": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Yellow stem borer (Scirpophaga incertulas) dead hearts और white ears पैदा करता है। Larvae stem के अंदर bore — contact sprays अकेले अक्सर fail।",
    symptoms: [
      "Dead heart — central shoot सूखकर आसानी से निकलता है",
      "White ear — heading पर empty chaffy panicle",
      "Stem में bore holes और frass",
    ],
    remediation: [
      "Tillering पर Cartap hydrochloride 50 SP / 4G @ 1 kg/ha (IRAC 14)",
      "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
      "30 DAS से Trichogramma japonicum @ 50,000/ha साप्ताहिक × 6",
      "Transplant से पहले seedling tips clip — egg masses हटाएँ",
    ],
    activeIngredient: "Cartap hydrochloride 50 SP @ 1 kg/ha (IRAC 14)",
    etl: "5% dead hearts or 1 egg mass/m²",
  },
  "paddy-pest-p3": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Rice armyworm / swarming caterpillar बारिश के बाद रातों-रात patches defoliate कर सकता है। Larvae दिन में soil में छिपते हैं — शाम spray।",
    symptoms: [
      "Skeletonised या पूरी तरह खाई leaves",
      "दिन में larvae soil cracks में छिपते हैं",
      "बारिश के बाद rapid patchy damage",
    ],
    remediation: [
      "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6) evening spray",
      "Alternate MoA Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
      "Field allows हो तो brief flooding larvae को डुबो सकता है",
    ],
    activeIngredient: "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
    etl: "1–2 larvae/hill or visible defoliation patches",
  },
  "paddy-pest-p4": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Leaf folder (Cnaphalocrocis medinalis) leaves longitudinal fold कर green tissue scrape करता है। Excess nitrogen damage बढ़ाता है।",
    symptoms: [
      "Longitudinal leaf folds",
      "पत्तियों पर white scraped patches",
      "गंभीर cases में grain filling कम",
    ],
    remediation: [
      "Flubendiamide 20 WG @ 0.25 g/L (IRAC 28)",
      "Spinosad 45 SC @ 0.3 ml/L (IRAC 5) — diamides के साथ rotate",
      "Excess nitrogen से बचें; Trichogramma release",
    ],
    activeIngredient: "Flubendiamide 20 WG @ 0.25 g/L (IRAC 28)",
    etl: "1–2 freshly damaged leaves/hill",
  },
  "paddy-pest-p5": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Green leafhopper (Nephotettix virescens) rice tungro virus का मुख्य vector है। Tungro common हो तो vectors early control करें।",
    symptoms: [
      "पत्तियों का yellowing",
      "Tungro transmit हो तो stunted plants",
      "Upper canopy पर hoppers",
    ],
    remediation: [
      "Imidacloprid 200 SL @ 0.3 ml/L (IRAC 4A)",
      "Thiamethoxam 25 WG @ 0.2 g/L (IRAC 4A) — 4A consecutively repeat न करें",
      "Weed hosts हटाएँ; synchronised village planting pressure कम करता है",
    ],
    activeIngredient: "Imidacloprid 200 SL @ 0.3 ml/L (IRAC 4A)",
    etl: "5–10 hoppers/hill",
  },
  "paddy-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.paddy,
    description:
      "Rice blast (Magnaporthe oryzae) भारत में #1 rice disease है। Heading पर neck blast near-total grain loss। Tricyclazole FRAC 16.1 (melanin) है, FRAC 3 नहीं।",
    symptoms: [
      "Grey centre brown margin वाले diamond-shaped lesions",
      "Neck rot — blackened panicle neck, chaffy grains",
      "Node rot plant breakage",
    ],
    remediation: [
      "Boot leaf stage पर Tricyclazole 75 WP @ 0.6 g/L (FRAC 16.1)",
      "Alternate MoA Isoprothiolane 40 EC @ 1.5 ml/L (FRAC 6)",
      "Excess nitrogen से बचें — LCC से split application",
      "Silicon fertilization 200 kg/ha blast severity कम करता है",
    ],
    activeIngredient: "Tricyclazole 75 WP @ 0.6 g/L (FRAC 16.1)",
  },
  "paddy-disease-d2": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Sheath blight (Rhizoctonia solani) water line के पास शुरू, dense high-N canopies में ऊपर फैलता है।",
    symptoms: [
      "Leaf sheath पर oval greenish-grey lesions",
      "Lesions मिलकर sheath और leaves सूखती हैं",
      "Unfilled grains और lodging",
    ],
    remediation: [
      "पहले लक्षण पर Validamycin 3 L @ 2.5 ml/L (FRAC 26)",
      "Alternate spray Hexaconazole 5 EC @ 1 ml/L (FRAC 3)",
      "Wider spacing और balanced N humidity कम करते हैं",
      "Trichoderma harzianum soil application 2.5 kg/ha",
    ],
    activeIngredient: "Validamycin 3 L @ 2.5 ml/L (FRAC 26)",
  },
  "paddy-disease-d3": {
    category: "bacterial",
    image: THREAT_IMAGES.bacterialLeaf,
    description:
      "Bacterial leaf blight (Xanthomonas oryzae pv. oryzae) hydathodes और wounds से प्रवेश। Rain splash से spread।",
    symptoms: [
      "Leaf margins पर water-soaked lesions yellow फिर white",
      "Kresek phase — पूरे seedling clump का wilting",
      "सुबह lesion surface पर milky bacterial ooze",
    ],
    remediation: [
      "Streptocycline 0.15 g/L + Copper oxychloride 3 g/L spray",
      "Resistant varieties (IR 64, Swarna-Sub1) उपयोग",
      "Excessive nitrogen fertilization से बचें",
      "Canopy humidity कम करने field briefly drain",
    ],
    activeIngredient: "Streptocycline @ 0.15 g/L + Copper oxychloride 50 WP @ 3 g/L",
  },
  "paddy-disease-d4": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Brown spot (Bipolaris oryzae) nutrient-poor या drought-stressed fields में ज्यादा बुरा होता है। Fungicide के साथ K और Zn deficiency सुधारें।",
    symptoms: [
      "पत्तियों पर grey centre वाले oval brown spots",
      "Glumes पर spots — grain discolouration",
      "Poor soils में अधिक severe",
    ],
    remediation: [
      "Mancozeb 75 WP @ 2 g/L (FRAC M3)",
      "गंभीर हो तो Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
      "Potassium और zinc deficiency सुधारें",
      "Healthy certified seed उपयोग",
    ],
    activeIngredient: "Mancozeb 75 WP @ 2 g/L (FRAC M3)",
  },
  "paddy-disease-d5": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "False smut (Ustilaginoidea virens) grains की जगह orange से greenish-black spore balls। Boot leaf पर spray, full flowering के बाद नहीं।",
    symptoms: [
      "Panicle पर orange से greenish-black spore balls",
      "Panicle में few से many grains affected",
      "Flowering के बाद late infection",
    ],
    remediation: [
      "Boot leaf से early flowering Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
      "Panicle initiation पर excess nitrogen से बचें",
      "Seed plots से infected panicles हटाएँ",
    ],
    activeIngredient: "Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
  },
  "paddy-weed-w1": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Barnyard grass (Echinochloa crus-galli) transplanted rice में सबसे competitive grassy weed। Critical period 0–45 DAS।",
    symptoms: [
      "Rice seedlings जैसे grass-like plants",
      "Early uncontrolled होने पर tillers और yield कम",
    ],
    remediation: [
      "3 DAS पर Pretilachlor 50 EC @ 0.6–0.75 kg a.i./ha (HRAC 15)",
      "15–20 DAS पर Bispyribac-sodium 10 SC @ 25 g a.i./ha (HRAC 2)",
      "Transplant से पहले puddling और stale seedbed",
    ],
    activeIngredient: "Pretilachlor 50 EC (pre) / Bispyribac-sodium 10 SC (post)",
  },
  "paddy-weed-w2": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description: "Flat sedge (Cyperus iria) poorly levelled fields में thrive करता है। Herbicide के बाद standing water बनाए रखें।",
    symptoms: ["खेत में triangular stem sedges", "Tillering पर nutrients के लिए compete"],
    remediation: [
      "3–5 DAS पर Pyrazosulfuron-ethyl 10 WP @ 20 g a.i./ha (HRAC 2)",
      "Post-emergence Bispyribac-sodium 10 SC @ 25 g a.i./ha",
      "5 cm standing water बनाए रखें",
    ],
    activeIngredient: "Pyrazosulfuron-ethyl 10 WP @ 20 g a.i./ha",
  },
  "paddy-weed-w3": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Monochoria और अन्य broadleaf weeds। 2,4-D केवल direct-seeded rice पर; panicle initiation पर basmati के पास कभी नहीं।",
    symptoms: ["Standing water में broadleaf weeds", "Tillering के दौरान compete"],
    remediation: [
      "Pretilachlor 50 EC pre-emergence",
      "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (HRAC 4) — direct-seeded only",
      "20 & 40 DAS पर hand weeding",
    ],
    activeIngredient: "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (direct-seeded)",
  },

  "chilli-pest-p1": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Chilli thrips (Scirtothrips dorsalis) young leaves upward curl और fruits scar करते हैं। Early control yield loss और secondary virus stress कम करता है।",
    symptoms: [
      "Upward leaf curl और crinkling",
      "Fruits पर bird-eye scars",
      "Brittle tender shoots",
    ],
    remediation: [
      "Fipronil 5 SC @ 1.5–2 ml/L (IRAC 2B)",
      "10 दिन बाद Diafenthiuron 50 WP @ 1 g/L (IRAC 12A)",
      "Third rotation Spinosad 45 SC @ 0.3 ml/L (IRAC 5)",
      "Yellow/blue sticky traps @ 20–25/acre",
    ],
    activeIngredient: "Fipronil 5 SC @ 1.5–2 ml/L (IRAC 2B)",
    etl: "2–5 thrips/leaf or 10% damaged leaves",
  },
  "chilli-pest-p2": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Whitefly (Bemisia tabaci) chilli leaf curl virus का मुख्य vector है। Virus symptoms का इंतजार करने से vector management ज्यादा महत्वपूर्ण।",
    symptoms: [
      "Leaf undersides पर white insects",
      "Honeydew और sooty mould",
      "Virus transmit हो तो leaf curl",
    ],
    remediation: [
      "Pyriproxyfen 10 EC @ 1 ml/L (IRAC 7C)",
      "Diafenthiuron 50 WP @ 1 g/L (IRAC 12A)",
      "Spiromesifen 240 SC @ 0.5 ml/L (IRAC 23)",
      "Virus-infected plants तुरंत rogue",
    ],
    activeIngredient: "Pyriproxyfen 10 EC @ 1 ml/L (IRAC 7C)",
    etl: "5–10 adults/leaf or first virus symptoms",
  },
  "chilli-pest-p3": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Fruit borer (Helicoverpa armigera) buds और fruits में bore करता है। शाम spray, fruits thoroughly cover करें।",
    symptoms: [
      "Frass के साथ green fruits में holes",
      "Flower और bud drop",
      "Internal feeding और secondary rot",
    ],
    remediation: [
      "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
      "Chlorantraniliprole 18.5 SC @ 0.4 ml/L (IRAC 28)",
      "Indoxacarb 14.5 SC @ 0.5 ml/L (IRAC 22A)",
      "HaNPV @ 250 LE/ha और monitoring pheromone traps",
    ],
    activeIngredient: "Emamectin benzoate 5 SG @ 0.4 g/L (IRAC 6)",
    etl: "1 larva/plant or 5% damaged fruits",
  },
  "chilli-pest-p4": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Yellow mite (Polyphagotarsonemus latus) downward leaf curl और bronzing — thrips upward curl के विपरीत। Dry weather में common।",
    symptoms: [
      "Downward leaf curl",
      "Narrow elongated tender leaves",
      "Bronzing और corky fruit surface",
    ],
    remediation: [
      "Abamectin 1.9 EC @ 0.5–0.75 ml/L (IRAC 6)",
      "Spiromesifen 240 SC @ 0.5 ml/L (IRAC 23)",
      "Young leaves के undersides spray",
      "Repeated pyrethroids mites flare करते हैं — बचें",
    ],
    activeIngredient: "Abamectin 1.9 EC @ 0.5–0.75 ml/L (IRAC 6)",
    etl: "First bronzing / downward curl on tender leaves",
  },
  "chilli-pest-p5": {
    category: "insect",
    image: THREAT_IMAGES.insect,
    description:
      "Aphids tender shoots colonise कर viruses transmit कर सकते हैं। Whitefly के लिए neonics use हो चुके हों तो non-4A options prefer।",
    symptoms: ["Curled tender leaves", "Sticky honeydew", "Sooty mould"],
    remediation: [
      "Acetamiprid 20 SP @ 0.2–0.3 g/L (IRAC 4A)",
      "Ladybird beetles बचाएँ — early broad-spectrum sprays से बचें",
      "Yellow sticky traps",
    ],
    activeIngredient: "Acetamiprid 20 SP @ 0.2–0.3 g/L (IRAC 4A)",
    etl: "10–20 aphids/leaf or colonies on 10% plants",
  },
  "chilli-disease-d1": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Anthracnose / fruit rot (Colletotrichum capsici) humid weather में fruits पर sunken spots। Drip irrigation splash spread कम करता है।",
    symptoms: [
      "Concentric rings वाले sunken circular spots",
      "Lesion centre में black acervuli",
      "Fruit rot और drop",
    ],
    remediation: [
      "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L",
      "Azoxystrobin 250 SC @ 1 ml/L (FRAC 11) — rotate, high resistance risk",
      "Infected fruits हटाएँ; overhead irrigation से बचें",
    ],
    activeIngredient: "Mancozeb 75 WP @ 2 g/L + Carbendazim 50 WP @ 1 g/L",
  },
  "chilli-disease-d2": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Die-back tender twig tips से शुरू। Infected parts prune कर cuts copper fungicide से protect।",
    symptoms: [
      "Twigs का tip से die-back",
      "Necrotic stem lesions",
      "Flower और fruit drop",
    ],
    remediation: [
      "Infected twigs prune और destroy",
      "Copper oxychloride 50 WP @ 3 g/L (FRAC M1)",
      "गंभीर हो तो Propiconazole 25 EC @ 1 ml/L (FRAC 3)",
    ],
    activeIngredient: "Copper oxychloride 50 WP @ 3 g/L (FRAC M1)",
  },
  "chilli-disease-d3": {
    category: "viral",
    image: THREAT_IMAGES.viralPlant,
    description:
      "Chilli leaf curl virus (Begomovirus) का chemical cure नहीं। Whitefly vector control और infected plants early rogue।",
    symptoms: [
      "Margins से upward leaf curling और yellowing",
      "Stunted bushy plants",
      "Poor flowering और fruiting",
    ],
    remediation: [
      "Same day infected plants remove और destroy",
      "Whitefly के लिए Pyriproxyfen 10 EC @ 1 ml/L (IRAC 7C)",
      "Diafenthiuron 50 WP @ 1 g/L (IRAC 12A)",
      "अगले season tolerant varieties",
    ],
    activeIngredient: "Pyriproxyfen 10 EC @ 1 ml/L (vector control)",
  },
  "chilli-disease-d4": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Powdery mildew (Leveillula taurica) leaf undersides पर white growth। Sulphur early morning spray, hot sun में नहीं।",
    symptoms: [
      "Leaf undersides पर white powdery growth",
      "Upper leaf surface पर yellow patches",
      "Premature leaf drop",
    ],
    remediation: [
      "Wettable sulphur 80 WP @ 2–3 g/L (FRAC M2)",
      "गंभीर हो तो Hexaconazole 5 EC @ 1 ml/L (FRAC 3)",
      "Excess nitrogen से बचें; airflow सुधारें",
    ],
    activeIngredient: "Wettable sulphur 80 WP @ 2–3 g/L (FRAC M2)",
  },
  "chilli-disease-d5": {
    category: "fungal",
    image: THREAT_IMAGES.fungalLeaf,
    description:
      "Damping-off और wilt soil-borne हैं। Nursery में prevention field curative sprays से ज्यादा effective।",
    symptoms: [
      "Soil line पर seedling collapse",
      "Transplant के बाद wilting",
      "Brown vascular tissue (Fusarium)",
    ],
    remediation: [
      "Carbendazim 50 WP seed treatment @ 2 g/kg (FRAC 1)",
      "Trichoderma viride 10 g/kg seed + 2.5 kg/ha soil",
      "Nursery Pythium के लिए Metalaxyl + Mancozeb drench 2 g/L",
      "Raised beds और waterlogging से बचें",
    ],
    activeIngredient: "Carbendazim 50 WP @ 2 g/kg seed",
  },
  "chilli-weed-w1": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Parthenium पहले 40 दिन strongly compete करता है। Raised beds पर plastic mulch long-term best option।",
    symptoms: ["Broadleaf weed infestation", "Early growth कम"],
    remediation: [
      "3 DAT के भीतर Pendimethalin 30 EC @ 1.0 kg a.i./ha (HRAC 3)",
      "20–25 DAT hand weeding",
      "Raised beds पर plastic mulch",
    ],
    activeIngredient: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
  },
  "chilli-weed-w2": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description: "Trianthema chilli beds में common broadleaf weed। Pre-emergence herbicide से early control।",
    symptoms: ["Rows के बीच broadleaf weeds", "Establishment पर compete"],
    remediation: [
      "Pendimethalin 30 EC pre-emergence",
      "Rows के बीच interculture",
      "Drip + mulching",
    ],
    activeIngredient: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
  },
  "chilli-weed-w3": {
    category: "weed",
    image: THREAT_IMAGES.weed,
    description:
      "Chilli में grassy weeds। Label allows हो तो rows के बीच directed Quizalofop only।",
    symptoms: ["Inter-row grassy weeds", "Early competition"],
    remediation: [
      "Pendimethalin 30 EC pre-emergence (HRAC 3)",
      "Quizalofop-ethyl 5 EC @ 50 g a.i./ha directed (HRAC 1)",
      "Transplant से पहले stale seedbed",
    ],
    activeIngredient: "Pendimethalin 30 EC / Quizalofop-ethyl 5 EC",
  },
};
