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
  descriptionHi?: string;
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
  low: { label: "कम", className: "bg-emerald-100 text-emerald-900 ring-emerald-300" },
  medium: { label: "मध्यम", className: "bg-amber-100 text-amber-950 ring-amber-300" },
  high: { label: "ज्यादा", className: "bg-red-100 text-red-900 ring-red-300" },
};

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: "yellowing-leaves",
    label: "Yellowing Leaves",
    labelHi: "पत्तियाँ पीली होना",
    description: "पत्तियाँ पीली होना, हल्के धब्बे या पूरी पत्ती पीली",
    descriptionHi: "क्लोरोसिस, हल्के धब्बे या पूरी पत्ती पीली",
    icon: Leaf,
    accent: "from-lime-100 to-yellow-50 border-lime-200",
    issues: [
      {
        id: "n-deficiency",
        name: "नाइट्रोजन की कमी",
        severity: "medium",
        image: THREAT_IMAGES.paddy,
        diagnosis:
          "नाइट्रोजन पौधे में mobile है — पहले पुरानी पत्तियाँ पीली होती हैं, शिराएँ थोड़ी देर तक हरी रह सकती हैं। भारी बारिश, leaching या cereals/vegetables में top-dressing छूटने पर आम।",
        immediateActions: [
          "खेत का इतिहास देखें — basal/top-dress मात्रा समय पर दी गई?",
          "Urea 25–50 kg/ha top-dress (paddy/wheat) या vegetables पर foliar urea 2% spray।",
          "नाइट्रोजन देने से पहले मिट्टी में पर्याप्त नमी सुनिश्चित करें।",
          "एक बार में भारी मात्रा की बजाय नाइट्रोजन 2–3 हिस्सों में दें।",
        ],
        prevention: [
          "अपनी फसल और soil test के अनुसार NPK अनुसूची का पालन करें।",
          "Paddy में urea का समय तय करने के लिए leaf colour chart (LCC) उपयोग करें।",
          "मिट्टी में नाइट्रोजन रोकने के लिए जैविक खाद या green manure मिलाएँ।",
        ],
      },
      {
        id: "ysb-dead-heart",
        name: "पीला तना छेदक (Yellow Stem Borer)",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy"],
        diagnosis:
          "इल्लियाँ तने में छेद करती हैं — vegetative अवस्था में 'dead heart' होता है, बीच की कली पीली होकर आसानी से निकल जाती है। Transplanted और direct-seeded rice में उपज सीमित करने वाला प्रमुख कीट।",
        immediateActions: [
          "अंडों के समूह और dead heart की जाँच करें — 5% dead hearts (vegetative) पर उपचार करें।",
          "जैविक नियंत्रण उपलब्ध हो तो Trichogramma japonicum @ 50,000/ha साप्ताहिक छोड़ें।",
          "Chlorantraniliprole 18.5% SC @ 0.4 ml/L (IRAC 28) या Cartap hydrochloride label के अनुसार लगाएँ।",
          "रोपाई से पहले seedling tips काटें ताकि छिपे अंडे हट जाएँ।",
        ],
        prevention: [
          "वयस्क moth की निगरानी के लिए light traps @ 1/ha लगाएँ।",
          "Ratooning से बचें और कटाई के बाद stubble नष्ट करें।",
          "IRAC groups बदलें — लगातार sprays में एक ही MoA न उपयोग करें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p2" },
      },
      {
        id: "tungro",
        name: "धान टंग्रो वायरस (Rice Tungro Virus)",
        severity: "high",
        image: THREAT_IMAGES.viralPlant,
        cropSlugs: ["paddy"],
        diagnosis:
          "Green leafhopper (Nephotettix spp.) से फैलता है। पौधे बौने होते हैं, पत्तियों पर शिराओं के बीच पीला-नारंगी रंग। अक्सर खेत के किनारे से patches में फैलता है।",
        immediateActions: [
          "संक्रमित पौधे तुरंत उखाड़कर नष्ट करें — virus स्रोत कम होगा।",
          "Leafhopper vector पर Imidacloprid 200 SL @ 0.3 ml/L या Buprofezin 25 SC @ 1 ml/L।",
          "Endemic क्षेत्रों में susceptible varieties न बोएँ — प्रतिरोधी varieties (जैसे IR64-derived lines) उपयोग करें।",
        ],
        prevention: [
          "गाँव में एक साथ बुवाई से vector और virus दबाव कम होता है।",
          "Virus-free seedlings उपयोग करें और शुरू में संक्रमित पौधे हटाएँ।",
          "प्राकृतिक शत्रु बचाएँ; निवारक broad-spectrum sprays से बचें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p5" },
      },
      {
        id: "blast-yellow",
        name: "धान ब्लास्ट — शुरुआती पत्ती दाग (Rice Blast)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Magnaporthe oryzae से होता है। पत्तियों पर हीरे के आकार के दाग, बीच में grey, किनारे brown; गंभीर संक्रमण में पत्ती पीली और panicles पर neck blast।",
        immediateActions: [
          "पहले लक्षण पर Tricyclazole 75% WP @ 0.6 g/L spray (FRAC 16.1)।",
          "अगले spray में Isoprothiolane 40 EC @ 1.5 ml/L से बदलें।",
          "फसल हरी-घनी हो और रोग फैल रहा हो तो nitrogen कम करें।",
        ],
        prevention: [
          "जहाँ उपलब्ध हो, प्रतिरोधी varieties उपयोग करें।",
          "अधिक nitrogen से बचें और सही plant spacing रखें।",
          "Silicon-कम मिट्टी में silicon-rich amendments दें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d1" },
      },
    ],
  },
  {
    id: "stem-holes",
    label: "Stem Holes",
    labelHi: "तने में छेद",
    description: "छेद, मल या खोखला तना",
    descriptionHi: "छेद, मल या खोखला तना",
    icon: CircleDot,
    accent: "from-orange-100 to-amber-50 border-orange-200",
    issues: [
      {
        id: "stem-borer-paddy",
        name: "पीला तना छेदक (Yellow Stem Borer)",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy"],
        diagnosis:
          "तने पर गोल या अनियमित bore holes, प्रवेश स्थान पर frass। इल्लियाँ तने के अंदर feed करती हैं, पोषक प्रवाह रोकती हैं — dead hearts या white ears होते हैं।",
        immediateActions: [
          "जीवन चरण पहचानें — vegetative dead heart बनाम reproductive white ear।",
          "प्रभावित tillers में Chlorantraniliprole 18.5% SC @ 0.4 ml/L सीधे लगाएँ।",
          "Field-wide infestation हो तो tillering पर Cartap hydrochloride 50% SP @ 1 kg/ha granules।",
        ],
        prevention: [
          "रोपाई से पहले seedling tips जल्दी clip करें।",
          "वयस्क moths की निगरानी के लिए pheromone traps।",
          "IRAC 14 और IRAC 28 MoA के बीच बदलाव करें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p2" },
      },
      {
        id: "pink-borer",
        name: "गुलाबी तना छेदक (मक्का/बाजरा)",
        severity: "high",
        image: THREAT_IMAGES.maize,
        cropSlugs: ["maize", "bajra"],
        diagnosis:
          "इल्लियाँ तने में छेद करती हैं — young plants में dead hearts, mature stalks में tunneling। कटे तने के अंदर गुलाबी larva दिखता है।",
        immediateActions: [
          "Dead hearts / infested stems उखाड़कर नष्ट करें।",
          "Chlorantraniliprole 18.5% SC @ 0.4 ml/L या Emamectin benzoate 5% SG @ 0.4 g/L लगाएँ।",
          "Maize में, स्थानीय सलाह हो तो whorl में sand + carbofuran मिश्रण डालें।",
        ],
        prevention: [
          "Peak moth flights से बचने के लिए early planting।",
          "Non-host crops के साथ crop rotation।",
          "वयस्क monitoring के लिए light traps।",
        ],
        threatLink: { cropSlug: "maize", threatType: "pest", threatId: "p1" },
      },
      {
        id: "fruit-borer-stem",
        name: "फल छेदक (कपास/टमाटर)",
        severity: "medium",
        image: THREAT_IMAGES.tomato,
        cropSlugs: ["cotton", "tomato", "chilli"],
        diagnosis:
          "Helicoverpa armigera larvae squares, bolls या fruits में छेद करते हैं, कभी stems/branches पर feeding sites के पास entry holes छोड़ते हैं।",
        immediateActions: [
          "ETL पर scout — 10 plants में 2 eggs या 1 larva (vegetables)।",
          "Emamectin benzoate 5% SG @ 0.4 g/L शाम को spray।",
          "Larvae young (1st–2nd instar) हों तो HaNPV @ 250 LE/ha।",
        ],
        prevention: [
          "Monitoring के लिए pheromone traps @ 5/ha लगाएँ।",
          "जहाँ practised हो, marigold या castor trap crop के रूप में intercrop करें।",
          "IRAC 6 और IRAC 28 chemistry बदलें।",
        ],
        threatLink: { cropSlug: "tomato", threatType: "pest", threatId: "p1" },
      },
    ],
  },
  {
    id: "white-spots",
    label: "White Spots",
    labelHi: "सफेद धब्बे",
    description: "चूर्ण जैसे धब्बे, फफूंद या हल्के निशान",
    descriptionHi: "चूर्ण जैसे धब्बे, फफूंद या हल्के निशान",
    icon: Sparkles,
    accent: "from-slate-100 to-gray-50 border-slate-200",
    issues: [
      {
        id: "powdery-mildew",
        name: "चूर्णिल फफूंद (Powdery Mildew)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "पत्तियों की ऊपरी सतह पर सफेद powdery fungal growth। Dry days और ठंडी रातें + high humidity में बढ़ता है। Cucurbits, grapes और chilli में आम।",
        immediateActions: [
          "Wettable Sulphur 80% WP @ 3 g/L या Hexaconazole 5% EC @ 1 ml/L spray।",
          "भारी संक्रमित पत्तियाँ हटाकर खेत से दूर नष्ट करें।",
          "Dense planting से बचें — हवा का circulation बढ़ाएँ।",
        ],
        prevention: [
          "जहाँ उपलब्ध हो, प्रतिरोधी varieties उपयोग करें।",
          "देर दोपहर overhead irrigation से बचें।",
          "FRAC Group 3 fungicides को sulphur (M2) के साथ बदलें।",
        ],
      },
      {
        id: "sheath-blight-white",
        name: "पर्ण आवरण सड़न — सफेद फफूंद जाल (Sheath Blight)",
        severity: "high",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Rhizoctonia solani leaf sheaths पर oval greenish-grey lesions और white mycelial growth पैदा करता है। Humid, dense canopies में ऊपर की ओर फैलता है।",
        immediateActions: [
          "अतिरिक्त पानी निकालें और canopy में हवा बढ़ाएँ।",
          "Panicle initiation पर Validamycin 3% L @ 2.5 ml/L या Hexaconazole 5% EC @ 1 ml/L spray।",
          "खेत के किनारे गंभीर संक्रमित पौधे हटाएँ।",
        ],
        prevention: [
          "अत्यधिक nitrogen fertilization से बचें।",
          "अनुशंसित plant spacing बनाए रखें।",
          "Sheath blight endemic हो तो बीज Trichoderma से treat करें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d2" },
      },
      {
        id: "leaf-folder-patches",
        name: "पत्ती मोड़क (Leaf Folder)",
        severity: "low",
        image: THREAT_IMAGES.insectLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Larvae पत्तियाँ longitudinal fold करके हरी tissue scrape करते हैं, white scraped patches छोड़ते हैं। Tillering से PI stage तक photosynthesis कम होती है।",
        immediateActions: [
          "Scout — 10% damaged leaves या 1–2 fresh folds/hill पर treat करें।",
          "Flubendiamide 20% WG @ 0.25 g/L या Spinosad 45% SC @ 0.3 ml/L spray।",
        ],
        prevention: [
          "संतुलित nitrogen — अधिक N से leaf folder outbreak बढ़ता है।",
          "Spiders और mirid bugs जैसे natural enemies बचाएँ।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p4" },
      },
    ],
  },
  {
    id: "wilting-plants",
    label: "Wilting Plants",
    labelHi: "पौधे मुरझाना",
    description: "अचानक झुकना, गिरना या सूखना",
    descriptionHi: "अचानक झुकना, गिरना या सूखना",
    icon: Droplets,
    accent: "from-sky-100 to-blue-50 border-sky-200",
    issues: [
      {
        id: "water-stress",
        name: "पानी / सूखा तनाव",
        severity: "low",
        image: THREAT_IMAGES.paddy,
        diagnosis:
          "गर्मी के चरम में dry soil के साथ wilting moisture stress दर्शाता है। जड़ों को पानी मिले तो पत्तियाँ रात में ठीक हो सकती हैं। सिंचाई के बाद recovery हो तो pathogenic wilt से अलग।",
        immediateActions: [
          "Root zone की soil moisture जाँचें — dry हो तो सिंचाई करें।",
          "Evaporation कम करने के लिए सुबह या शाम सिंचाई।",
          "Vegetables में mulch से soil moisture बचाएँ।",
        ],
        prevention: [
          "फसल की critical stages के अनुसार सिंचाई अनुसूची।",
          "Paddy में drip या alternate wetting-drying जहाँ उपयुक्त।",
          "जैविक पदार्थ बढ़ाकर water-holding capacity सुधारें।",
        ],
      },
      {
        id: "bacterial-wilt",
        name: "जीवाणु मुरझान (Bacterial Wilt)",
        severity: "high",
        image: THREAT_IMAGES.bacterialLeaf,
        cropSlugs: ["tomato", "brinjal", "chilli", "potato"],
        diagnosis:
          "Ralstonia solanacearum vascular tissue ब्लॉक करता है। गर्म दिनों में अचानक wilting, तना काटकर पानी में रखने पर brown discolouration (bacterial ooze)।",
        immediateActions: [
          "Murjhaye पौधे उखाड़कर नष्ट करें — खेत में compost न करें।",
          "पौधों के बीच tools bleach solution से disinfect करें।",
          "संक्रमित soil और irrigation water साफ क्षेत्र में न ले जाएँ।",
        ],
        prevention: [
          "Certified disease-free seedlings उपयोग करें।",
          "3+ वर्ष non-solanaceous crops के साथ rotation।",
          "Heavy soils में beds ऊँचे करें और drainage सुनिश्चित करें।",
        ],
      },
      {
        id: "root-rot",
        name: "जड़ सड़न / अंकुर मरण",
        severity: "high",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "Rhizoctonia, Pythium या Fusarium waterlogged/compact soils में जड़ों पर attack करते हैं। मिट्टी गीली होते हुए भी wilting; जड़ें brown और छोटी।",
        immediateActions: [
          "Drainage सुधारें — nursery और field में standing water न रखें।",
          "Root zone पर Trichoderma viride 1% WP @ 5 g/L drench।",
          "गंभीर nursery infection में Metalaxyl-M + Mancozeb drench।",
        ],
        prevention: [
          "Label के अनुसार बीज Trichoderma या carbendazim से treat करें।",
          "Nursery में over-irrigation से बचें।",
          "बुवाई से पहले nursery beds solarize करें।",
        ],
      },
    ],
  },
  {
    id: "holes-in-leaves",
    label: "Holes in Leaves",
    labelHi: "पत्ती में छेद",
    description: "चबाने का नुकसान, पत्ती जाली जैसी",
    descriptionHi: "चबाने का नुकसान, पत्ती जाली जैसी",
    icon: Target,
    accent: "from-red-100 to-rose-50 border-red-200",
    issues: [
      {
        id: "armyworm",
        name: "धान सेना इल्ली (Rice Armyworm)",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy", "maize"],
        diagnosis:
          "Nocturnal larvae पत्ती के किनारे खाते हैं, बारिश के बाद रातों-रात patches defoliate कर सकते हैं। मिट्टी पर frass pellets दिखते हैं।",
        immediateActions: [
          "शाम को dusk पर scout — larvae पत्तियाँ खाते हैं।",
          "Emamectin benzoate 5% SG @ 0.4 g/L शाम को spray।",
          "Chlorantraniliprole 18.5% SC @ 0.4 ml/L (IRAC 28) से बदलें।",
        ],
        prevention: [
          "जहाँ संभव, छिपे larvae expose करने के लिए खेत briefly drain करें।",
          "Moth monitoring के लिए light traps।",
          "IRAC 6 और IRAC 28 groups बदलें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p3" },
      },
      {
        id: "flea-beetle",
        name: "फुदका भृंग / छोटे गोल छेद",
        severity: "medium",
        image: THREAT_IMAGES.insectLeaf,
        cropSlugs: ["mustard", "brinjal", "potato"],
        diagnosis:
          "Adult feeding से पत्तियों पर छोटे गोल shot-holes। Disturb करने पर jumping beetles दिखते हैं। Seedling stage सबसे कमजोर।",
        immediateActions: [
          "पहले लक्षण पर seedlings पर Imidacloprid 17.8% SL @ 0.3 ml/L spray।",
          "Adult beetles monitoring के लिए yellow sticky traps।",
          "Organic plots के लिए neem oil 1% softer विकल्प।",
        ],
        prevention: [
          "Trap crops उपयोग करें और volunteer host plants हटाएँ।",
          "Damage से बचने के लिए बड़े, मजबूत seedlings transplant करें।",
        ],
      },
      {
        id: "early-blight-holes",
        name: "शुरुआती झुलसा (मृत छेद)",
        severity: "medium",
        image: THREAT_IMAGES.tomato,
        cropSlugs: ["tomato", "potato"],
        diagnosis:
          "Alternaria solani brown concentric ring spots पैदा करता है, जो गिरकर tomato/potato foliage पर shot-hole जैसा दिख सकता है।",
        immediateActions: [
          "Azoxystrobin 250 SC @ 1 ml/L या Chlorothalonil 75% WP @ 2 g/L spray।",
          "नीचली infected leaves हटाएँ, staking/airflow सुधारें।",
        ],
        prevention: [
          "Crop rotation — लगातार solanaceous planting से बचें।",
          "Spores के splash dispersal रोकने के लिए mulch।",
        ],
        threatLink: { cropSlug: "tomato", threatType: "disease", threatId: "d1" },
      },
    ],
  },
  {
    id: "brown-spots",
    label: "Brown Spots",
    labelHi: "भूरे धब्बे",
    description: "दाग, रतुआ या मृत धब्बे",
    descriptionHi: "दाग, रस्ट या मृत धब्बे",
    icon: Minus,
    accent: "from-amber-100 to-orange-50 border-amber-200",
    issues: [
      {
        id: "brown-spot-rice",
        name: "भूरा धब्बा (धान)",
        severity: "medium",
        image: THREAT_IMAGES.rust,
        cropSlugs: ["paddy"],
        diagnosis:
          "Bipolaris oryzae पत्तियों और glumes पर yellow halo वाले oval brown spots पैदा करता है। Nutrient-deficient, drought-stressed rice में बढ़ता है।",
        immediateActions: [
          "Mancozeb 75% WP @ 2 g/L या Propiconazole 25% EC @ 1 ml/L spray।",
          "Soil fertility सुधारें — संतुलित NPK दें।",
        ],
        prevention: [
          "बुवाई से पहले carbendazim से बीज treat करें।",
          "Tillering के दौरान पर्याप्त soil moisture बनाए रखें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d4" },
      },
      {
        id: "rust",
        name: "पत्ती रतुआ (Leaf Rust)",
        severity: "medium",
        image: THREAT_IMAGES.rust,
        cropSlugs: ["wheat", "maize"],
        diagnosis:
          "पत्तियों पर orange-brown pustules powdery spores छोड़ते हैं। ठंडी, moist conditions और dew में rust तेजी से फैलता है।",
        immediateActions: [
          "पहले pustule पर Propiconazole 25% EC @ 1 ml/L या Tebuconazole 25% EC @ 0.5 ml/L spray।",
          "Field borders पर volunteer host plants हटाएँ।",
        ],
        prevention: [
          "Rust-resistant varieties बोएँ।",
          "Rust-prone क्षेत्रों में late sowing से बचें।",
          "FRAC Group 3 fungicides को अन्य MoA के साथ बदलें।",
        ],
      },
      {
        id: "bph-hopperburn",
        name: "भूरा फुदका (हॉपरबर्न)",
        severity: "high",
        image: THREAT_IMAGES.insect,
        cropSlugs: ["paddy"],
        diagnosis:
          "Nilaparvata lugens tillers के base पर sap चूसता है। Population explode होने पर गोल brown patches ('hopperburn'), अक्सर बार-बार IRAC 4A sprays के बाद।",
        immediateActions: [
          "Spray plant base की ओर — Buprofezin 25% SC @ 1 ml/L (IRAC 16)।",
          "Pymetrozine 50% WG @ 0.75 g/L (IRAC 9B) alternate spray।",
          "Broad-spectrum pyrethroid sprays बंद करें — natural enemies मरते हैं।",
        ],
        prevention: [
          "अत्यधिक nitrogen top-dressing से बचें।",
          "Alternate wetting and drying water management।",
          "लगातार applications में एक ही IRAC group न उपयोग करें।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "pest", threatId: "p1" },
      },
    ],
  },
  {
    id: "stunted-growth",
    label: "Stunted Growth",
    labelHi: "बौनी बढ़वार",
    description: "छोटे पौधे, कम कल्ले, असमान खड़ी फसल",
    descriptionHi: "छोटे पौधे, कम कल्ले, असमान खड़ी फसल",
    icon: TrendingDown,
    accent: "from-violet-100 to-purple-50 border-violet-200",
    issues: [
      {
        id: "zinc-deficiency",
        name: "जिंक की कमी (खैरा)",
        severity: "low",
        image: THREAT_IMAGES.paddy,
        cropSlugs: ["paddy", "maize"],
        diagnosis:
          "Flooded rice में zinc unavailable हो जाता है — बौने पौधे, upper leaves पर dusty brown spots, poor root development ('Khaira' in paddy)।",
        immediateActions: [
          "Zinc sulphate 25 kg/ha basal या affected patches पर 2% foliar spray।",
          "Over-liming या excessive phosphorous से बचें — zinc lock होता है।",
          "Permanently flooded हो तो field briefly drain करें।",
        ],
        prevention: [
          "Zinc-deficient soils में basally zinc sulphate दें।",
          "Micronutrient availability के लिए organic matter बढ़ाएँ।",
        ],
      },
      {
        id: "nematode",
        name: "जड़-गाँठ सूत्रकृमि (Root-Knot Nematode)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "Meloidogyne spp. जड़ों पर galls, stunting और moisture stress में wilting। Vegetables और sandy soils में आम।",
        immediateActions: [
          "Paecilomyces lilacinus या Trichoderma seed treatment लगाएँ।",
          "Carbofuran 3G @ 1 kg/ai/ha केवल जहाँ legally permitted और label allows।",
          "Transplanting से पहले nursery beds solarize करें।",
        ],
        prevention: [
          "Marigold या non-host cereals के साथ crop rotation।",
          "Nematode-free seedlings और resistant varieties उपयोग करें।",
        ],
      },
      {
        id: "weed-competition",
        name: "खरपतवार प्रतिस्पर्धा",
        severity: "medium",
        image: THREAT_IMAGES.weed,
        diagnosis:
          "Critical period (पहले 30–45 दिन) में weeds light, nutrients और moisture के लिए compete करते हैं। Crop stunted, tillering uneven।",
        immediateActions: [
          "Hand-weed या अपनी फसल के लिए recommended post-emergence herbicide।",
          "Paddy: grasses dominate हो तो 15–20 DAS पर Bispyribac-sodium 10% SC @ 25 g a.i./ha।",
          "Thinning के बाद recommended plant population बनाए रखें।",
        ],
        prevention: [
          "Label stage पर समय पर pre-emergence herbicide।",
          "Transplanting से पहले stale seedbed technique।",
        ],
      },
    ],
  },
  {
    id: "cottony-growth",
    label: "Cottony Growth",
    labelHi: "रूई जैसा फफूंद",
    description: "रूई जैसा फफूंद, काला कालिख जैसा जमाव",
    descriptionHi: "रूई जैसा फफूंद, काला कालिख जैसा जमाव",
    icon: CloudFog,
    accent: "from-teal-100 to-cyan-50 border-teal-200",
    issues: [
      {
        id: "sheath-blight-cottony",
        name: "पर्ण आवरण सड़न (Sheath Blight)",
        severity: "high",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Water line के पास leaf sheaths पर white से grey cottony mycelium। Lesions मिलकर severe cases में lodging।",
        immediateActions: [
          "Lesions दिखते ही Validamycin 3% L @ 2.5 ml/L spray।",
          "Nitrogen कम करें और drainage सुधारें।",
        ],
        prevention: [
          "Dense planting और excess nitrogen से बचें।",
          "कटाई के बाद infected crop residue हटाएँ।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d2" },
      },
      {
        id: "sooty-mold",
        name: "कालिख फफूंद (Sooty Mould)",
        severity: "low",
        image: THREAT_IMAGES.insectLeaf,
        diagnosis:
          "Aphids, whiteflies या leafhoppers के honeydew पर पत्तियों पर black fungal growth। अंतर्निहित sucking pest infestation का संकेत।",
        immediateActions: [
          "पहले sap-sucking pest control — Imidacloprid 17.8% SL @ 0.3 ml/L।",
          "High-value crops पर mild soap solution से sooty mould धोएँ।",
        ],
        prevention: [
          "Aphids और whiteflies की साप्ताहिक monitoring।",
          "Natural enemies (ladybirds, lacewings) बचाएँ।",
        ],
      },
      {
        id: "false-smut",
        name: "झूठा कंड (False Smut)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["paddy"],
        diagnosis:
          "Orange-yellow से greenish spore balls individual grains की जगह panicles पर। Flowering के दौरान humid weather में बढ़ता है।",
        immediateActions: [
          "Boot leaf stage, flowering से पहले Propiconazole 25% EC @ 1 ml/L spray।",
          "Infected panicles हटाकर नष्ट करें।",
        ],
        prevention: [
          "संतुलित fertilization — excess nitrogen से बचें।",
          "Infection window से पहले recommended growth stage पर spray।",
        ],
        threatLink: { cropSlug: "paddy", threatType: "disease", threatId: "d5" },
      },
    ],
  },
  {
    id: "wilting-drooping",
    label: "Wilting / Drooping",
    labelHi: "मुरझाना / झुकना",
    description: "पौधा मुरझाया, तना नरम, जड़ समस्या",
    descriptionHi: "पौधा मुरझाया, तना नरम, जड़ समस्या",
    icon: TrendingDown,
    accent: "from-orange-100 to-red-50 border-orange-200",
    issues: [
      {
        id: "root-rot",
        name: "जड़ सड़न / अंकुर मरण",
        severity: "high",
        image: THREAT_IMAGES.rootRot,
        diagnosis:
          "Over-watering, poor drainage या fungal pathogens (Pythium, Rhizoctonia) से जड़ें brown होती हैं और wet soil में भी wilting।",
        immediateActions: [
          "2–3 दिन सिंचाई रोकें; drainage channels सुधारें।",
          "Label के अनुसार Metalaxyl-M + Mancozeb या Validamycin drench।",
          "गंभीर प्रभावित पौधे हटाकर spread रोकें।",
        ],
        prevention: [
          "बुवाई से पहले बीज Trichoderma से treat करें।",
          "Waterlogging से बचें — खासकर nursery और early stage।",
        ],
      },
      {
        id: "wilt-bacterial",
        name: "जीवाणु मुरझान (Bacterial Wilt)",
        severity: "high",
        image: THREAT_IMAGES.wilting,
        cropSlugs: ["tomato", "bhindi", "chilli"],
        diagnosis:
          "पूरा पौधा अचानक murjhata है, पहले पत्ती पीली नहीं होती। तना काटें — पानी में white bacterial ooze दिख सकता है।",
        immediateActions: [
          "प्रभावित पौधे उखाड़कर नष्ट करें — compost न करें।",
          "पास के healthy plants पर Streptocycline 0.05% spray।",
          "Crop rotation — अगले season same field में solanaceous crops न बोएँ।",
        ],
        prevention: [
          "जहाँ उपलब्ध हो wilt-resistant varieties उपयोग करें।",
          "Problem fields में transplanting से पहले soil solarization।",
        ],
      },
    ],
  },
  {
    id: "fruit-flower-damage",
    label: "Fruit / Flower Damage",
    labelHi: "फल / फूल नुकसान",
    description: "फल पर दाग, फूल गिरना, आकार कम",
    descriptionHi: "फल पर दाग, फूल गिरना, आकार कम",
    icon: CircleDot,
    accent: "from-pink-100 to-rose-50 border-pink-200",
    issues: [
      {
        id: "fruit-borer",
        name: "फल छेदक (Fruit Borer)",
        severity: "high",
        image: THREAT_IMAGES.fruitDamage,
        cropSlugs: ["tomato", "bhindi", "chilli"],
        diagnosis:
          "Fruits में holes + frass, premature fruit drop या internal feeding — tomato, okra, chilli में आम।",
        immediateActions: [
          "Damaged fruits इकट्ठे करके नष्ट करें।",
          "Emamectin benzoate 5% SG @ 0.4 g/L या Spinosad label के अनुसार spray।",
          "शाम को spray; जरूरत हो तो 10 दिन बाद repeat।",
        ],
        prevention: [
          "Flowering से पहले pheromone traps (5/acre) लगाएँ।",
          "कटाई के बाद crop residue हटाएँ।",
        ],
      },
      {
        id: "blossom-end-rot",
        name: "फूल सिरे की सड़न (Blossom End Rot)",
        severity: "medium",
        image: THREAT_IMAGES.tomato,
        cropSlugs: ["tomato"],
        diagnosis:
          "Tomato के blossom end पर dark sunken patch — calcium imbalance, irregular watering; fungal disease नहीं।",
        immediateActions: [
          "Even soil moisture बनाए रखें — plants के आसपास mulch।",
          "Calcium nitrate 1% foliar spray साप्ताहिक 2–3 बार।",
          "Excess nitrogen से बचें — समस्या बढ़ती है।",
        ],
        prevention: [
          "Soil test करें; calcium कम हो तो gypsum दें।",
          "Fruit set stage में नियमित सिंचाई।",
        ],
      },
    ],
  },
  {
    id: "insect-chewing",
    label: "Insects / Chewing Pests",
    labelHi: "कीट / चबाने वाले कीड़े",
    description: "पत्ती कटी, छेद, इल्ली दिखे",
    descriptionHi: "पत्ती कटी, छेद, इल्ली दिखे",
    icon: Target,
    accent: "from-amber-100 to-yellow-50 border-amber-200",
    issues: [
      {
        id: "aphid-infestation",
        name: "एफिड का प्रकोप",
        severity: "medium",
        image: THREAT_IMAGES.aphid,
        diagnosis:
          "पत्तियों के नीचे छोटे soft insects के clusters, sticky honeydew, curled leaves, vegetables/cereals पर sooty mould।",
        immediateActions: [
          "Imidacloprid 17.8% SL @ 0.3 ml/L या Neem oil 1% शाम को spray।",
          "उपलब्ध हो तो ladybird beetles release (IPM)।",
          "Broad-spectrum sprays से बचें — natural enemies मरते हैं।",
        ],
        prevention: [
          "Early detection के लिए yellow sticky traps (5/acre)।",
          "Excess nitrogen से बचें — aphids attract होते हैं।",
        ],
      },
      {
        id: "stem-borer-maize",
        name: "तना छेदक (मक्का/कपास)",
        severity: "high",
        image: THREAT_IMAGES.stemBorer,
        cropSlugs: ["maize", "cotton"],
        diagnosis:
          "Maize centre में dead heart, stem में bore holes, frass visible — larvae stem के अंदर feed करते हैं।",
        immediateActions: [
          "Maize में leaf whorl पर granular Chlorantraniliprole लगाएँ।",
          "Egg-laying stage पर Trichogramma cards @ 50,000/ha release।",
          "Dead heart वाले plants उखाड़कर नष्ट करें।",
        ],
        prevention: [
          "Peak pest population से बचने early sowing।",
          "Adult moths monitoring के लिए light trap (1/acre)।",
        ],
      },
    ],
  },
  {
    id: "leaf-curling",
    label: "Leaf Curling",
    labelHi: "पत्ती मुड़ना",
    description: "पत्ती अंदर मुड़ना, कटोरी जैसी या किनारे लिपटना",
    descriptionHi: "पत्ती अंदर मुड़ना, कटोरी जैसी या किनारे लिपटना",
    icon: Leaf,
    accent: "from-teal-100 to-cyan-50 border-teal-200",
    issues: [
      {
        id: "whitefly-curl",
        name: "सफेद मक्खी (पत्ती मोड़)",
        severity: "high",
        image: THREAT_IMAGES.aphid,
        cropSlugs: ["tomato", "chilli", "brinjal", "cotton"],
        diagnosis:
          "पत्तियों के नीचे छोटे white flies upward curling, yellowing, sticky honeydew पैदा करते हैं। Tomato में TYLCV risk।",
        immediateActions: [
          "Yellow sticky traps 10–15/acre; Neem oil 1% + sticker spray।",
          "Diafenthiuron 50% WP @ 15 g/15 L pump (IRAC 12A)।",
          "भारी infestation वाली leaves हटाएँ; same IRAC दो बार न लगाएँ।",
        ],
        prevention: [
          "Nursery में reflective mulch; endemic areas में resistant varieties।",
          "Natural enemies बचाएँ — broad-spectrum sprays से बचें।",
        ],
      },
      {
        id: "aphid-curl",
        name: "एफिड से पत्ती मुड़ना",
        severity: "medium",
        image: THREAT_IMAGES.aphid,
        diagnosis:
          "Young leaves के नीचे colonies curling, stunting, honeydew पैदा करती हैं। Wheat heading, vegetables, cotton में आम।",
        immediateActions: [
          "Imidacloprid 17.8% SL @ 0.3 ml/L शाम को spray।",
          "Population कम हो तो Neem oil 1%।",
        ],
        prevention: ["Yellow traps; excess nitrogen से बचें।", "Crop rotation; field के आसपास weeds नष्ट करें।"],
      },
    ],
  },
  {
    id: "mosaic-virus",
    label: "Mosaic / Viral",
    labelHi: "मोजेक / वायरस",
    description: "हरे-पीले धब्बेदार पैटर्न, पत्ती पर मोज़ेक",
    descriptionHi: "हरे-पीले धब्बेदार पैटर्न, पत्ती पर मोजेक",
    icon: Sparkles,
    accent: "from-violet-100 to-purple-50 border-violet-200",
    issues: [
      {
        id: "tmv",
        name: "तम्बाकू मोज़ेक वायरस (Tobacco Mosaic Virus)",
        severity: "high",
        image: THREAT_IMAGES.viralPlant,
        cropSlugs: ["tomato", "chilli", "brinjal"],
        diagnosis:
          "पत्तियों पर light-dark green mosaic, leaf distortion, stunted plants। Contact और tools से फैलता है।",
        immediateActions: [
          "संक्रमित plants उखाड़कर जलाएँ — कोई cure नहीं।",
          "Vectors aphids/whiteflies control; हाथ/tools soap से धोएँ।",
        ],
        prevention: ["Virus-free seedlings उपयोग करें।", "Tomato fields के पास धूम्रपान न करें (TMV carrier)।"],
      },
      {
        id: "leaf-curl-virus",
        name: "मिर्च पत्ती मोड़ वायरस (Chilli Leaf Curl Virus)",
        severity: "high",
        image: THREAT_IMAGES.viralPlant,
        cropSlugs: ["chilli", "tomato"],
        diagnosis:
          "गंभीर upward leaf curl, puckering, stunted bushy plants। Whitefly से फैलता है।",
        immediateActions: [
          "संक्रमित plants हटाएँ; whitefly vector control।",
          "Label के अनुसार Imidacloprid soil drench या foliar।",
        ],
        prevention: ["Resistant hybrids; nursery में reflective mulch।", "शुरू में infected plants rogue करें।"],
      },
    ],
  },
  {
    id: "sticky-leaves",
    label: "Sticky Leaves",
    labelHi: "चिपचिपी पत्तियाँ",
    description: "शहद जैसा द्रव, काला कालिख फफूंद",
    descriptionHi: "शहद जैसा द्रव, काला कालिख फफूंद",
    icon: Droplets,
    accent: "from-sky-100 to-blue-50 border-sky-200",
    issues: [
      {
        id: "honeydew-whitefly",
        name: "शहद जैसा स्राव (सफेद मक्खी/एफिड)",
        severity: "medium",
        image: THREAT_IMAGES.aphid,
        diagnosis:
          "Sap-sucking insects से पत्तियों पर चमकदार sticky coating। Black sooty mould और photosynthesis कम होती है।",
        immediateActions: [
          "पहले underlying insect treat — Neem 1% या Imidacloprid 0.3 ml/L।",
          "Vegetables पर जरूरत हो तो mild soap water से sooty mould धोएँ।",
        ],
        prevention: ["पत्तियों के नीचे regular scouting।", "Early catch के लिए yellow traps।"],
      },
      {
        id: "sooty-mold-sticky",
        name: "कालिख फफूंद (Sooty Mould)",
        severity: "low",
        image: THREAT_IMAGES.fungalLeaf,
        diagnosis:
          "Upper leaf surface पर black powdery fungal growth — honeydew पर grows, primary disease नहीं।",
        immediateActions: [
          "पहले sap-sucking insects control करें।",
          "Mould heavy हो तो Wettable sulphur 2 g/L spray।",
        ],
        prevention: ["Insect population कम रखें; air flow बढ़ाएँ।"],
      },
    ],
  },
  {
    id: "purple-blotches",
    label: "Purple / Red Blotches",
    labelHi: "बैंगनी / लाल धब्बे",
    description: "बैंगनी तना, लाल-नारंगी दाग, पत्ती का बैंगनी होना",
    descriptionHi: "बैंगनी तना, लाल-नारंगी दाग, पत्ती का बैंगनी होना",
    icon: CircleDot,
    accent: "from-fuchsia-100 to-pink-50 border-fuchsia-200",
    issues: [
      {
        id: "phosphorus-def",
        name: "फास्फोरस की कमी",
        severity: "medium",
        image: THREAT_IMAGES.paddy,
        diagnosis:
          "Older leaves और stems पर purplish-red colour, खासकर cold weather या acidic soils में।",
        immediateActions: [
          "DAP 50–75 kg/ha या foliar DAP 2% spray।",
          "Soil pH जाँचें — बहुत acidic हो तो lime।",
        ],
        prevention: ["बुवाई पर संतुलित basal dose।", "हर 2–3 वर्ष soil test।"],
      },
      {
        id: "purple-blotch-onion",
        name: "बैंगनी धब्बा (प्याज)",
        severity: "medium",
        image: THREAT_IMAGES.fungalLeaf,
        cropSlugs: ["onion"],
        diagnosis:
          "Onion leaves पर purple sunken lesions yellow halo के साथ — humid weather में फैलता है।",
        immediateActions: [
          "Mancozeb 75% WP @ 2 g/L या Azoxystrobin 250 SC @ 1 ml/L।",
          "Drainage सुधारें; late evening overhead irrigation से बचें।",
        ],
        prevention: ["Wider spacing; crop debris नष्ट करें।", "Non-allium crops के साथ rotation।"],
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
