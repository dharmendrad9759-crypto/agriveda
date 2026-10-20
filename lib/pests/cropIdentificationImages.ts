/**
 * Crop-Specific Pest & Disease Identification Image Catalog (232 WebP visuals across 29 crops).
 * Maps each crop slug + problem/pest/disease to its dedicated field identification illustration
 * under `/images/crop-identification/<crop_folder>/<problem_slug>.webp`.
 */

export interface CropIdentificationProblemMeta {
  problemSlug: string;
  type: "pest" | "disease";
  nameHi: string;
  nameEn: string;
  scientificName: string;
  stageHi: string;
  symptomHi: string;
  keywords: string[];
  /** Optional sibling problem slug in the same crop folder to show as 2nd gallery slide */
  pairedSlugs?: string[];
}

export const CROP_SLUG_TO_ID_FOLDER: Record<string, string> = {
  tomato: "01_tomato",
  tamatar: "01_tomato",
  paddy: "02_paddy",
  rice: "02_paddy",
  dhan: "02_paddy",
  chawal: "02_paddy",
  soybean: "03_soybean",
  soya: "03_soybean",
  maize: "04_maize",
  corn: "04_maize",
  makka: "04_maize",
  moongfali: "05_groundnut",
  groundnut: "05_groundnut",
  peanut: "05_groundnut",
  mungfali: "05_groundnut",
  chilli: "06_chilli",
  chili: "06_chilli",
  mirch: "06_chilli",
  capsicum: "07_capsicum",
  "shimla-mirch": "07_capsicum",
  "bell-pepper": "07_capsicum",
  cauliflower: "08_cauliflower",
  "phool-gobhi": "08_cauliflower",
  gobhi: "08_cauliflower",
  cabbage: "09_cabbage",
  "patta-gobhi": "09_cabbage",
  bandgobhi: "09_cabbage",
  cucumber: "10_cucumber",
  kheera: "10_cucumber",
  khira: "10_cucumber",
  brinjal: "11_brinjal",
  eggplant: "11_brinjal",
  baingan: "11_brinjal",
  sugarcane: "12_sugarcane",
  ganna: "12_sugarcane",
  potato: "13_potato",
  aloo: "13_potato",
  alu: "13_potato",
  bajra: "14_pearl_millet",
  "pearl-millet": "14_pearl_millet",
  pearl_millet: "14_pearl_millet",
  wheat: "15_wheat",
  gehu: "15_wheat",
  gehun: "15_wheat",
  onion: "16_onion",
  pyaj: "16_onion",
  pyaz: "16_onion",
  garlic: "17_garlic",
  lahsun: "17_garlic",
  cotton: "18_cotton",
  kapas: "18_cotton",
  narma: "18_cotton",
  moong: "19_moong",
  mung: "19_moong",
  "green-gram": "19_moong",
  urad: "20_urad",
  "black-gram": "20_urad",
  pulses: "21_pigeon_pea",
  "pigeon-pea": "21_pigeon_pea",
  pigeon_pea: "21_pigeon_pea",
  arhar: "21_pigeon_pea",
  tur: "21_pigeon_pea",
  tuar: "21_pigeon_pea",
  chana: "22_chickpea",
  chickpea: "22_chickpea",
  gram: "22_chickpea",
  masoor: "23_lentil",
  lentil: "23_lentil",
  masur: "23_lentil",
  mustard: "24_mustard",
  sarson: "24_mustard",
  rapeseed: "24_mustard",
  bhindi: "25_okra",
  okra: "25_okra",
  bhendi: "25_okra",
  ladyfinger: "25_okra",
  ginger: "26_ginger",
  adrak: "26_ginger",
  turmeric: "26_ginger",
  haldi: "26_ginger",
  mango: "27_mango",
  aam: "27_mango",
  banana: "28_banana",
  kela: "28_banana",
  grapes: "29_grapes",
  grape: "29_grapes",
  angoor: "29_grapes",
};

/** Exact problem slugs available in each of the 29 crop folders (total = 232 WebP images) */
export const FOLDER_PROBLEMS: Record<string, string[]> = {
  "01_tomato": [
    "damping_off",
    "leaf_miner",
    "whitefly",
    "early_blight",
    "thrips",
    "red_spider_mite",
    "leaf_curl",
    "bacterial_spot",
    "bacterial_wilt",
    "fruit_borer",
    "tuta_absoluta",
    "late_blight",
  ],
  "02_paddy": [
    "bakanae",
    "stem_borer",
    "leaf_folder",
    "sheath_blight",
    "brown_planthopper",
    "white_backed_planthopper",
    "bacterial_leaf_blight",
    "leaf_blast",
    "neck_blast",
    "false_smut",
    "gundhi_bug",
  ],
  "03_soybean": [
    "stem_fly",
    "charcoal_rot",
    "rhizoctonia_root_rot",
    "girdle_beetle",
    "yellow_mosaic",
    "tobacco_caterpillar",
    "green_semilooper",
    "anthracnose",
    "purple_seed_stain",
  ],
  "04_maize": [
    "shoot_fly",
    "pink_stem_borer",
    "fall_armyworm",
    "turcicum_leaf_blight",
    "maydis_leaf_blight",
    "post_flowering_stalk_rot",
  ],
  "05_groundnut": [
    "collar_rot",
    "stem_rot",
    "white_grub",
    "thrips",
    "jassid",
    "tikka_leaf_spot",
    "rust",
    "hairy_caterpillar",
    "tobacco_caterpillar",
  ],
  "06_chilli": [
    "collar_rot",
    "fusarium_wilt",
    "chilli_thrips",
    "black_thrips",
    "broad_mite",
    "powdery_mildew",
    "spodoptera_fruit_borer",
    "helicoverpa_fruit_borer",
    "anthracnose",
    "dieback",
  ],
  "07_capsicum": [
    "collar_rot",
    "fusarium_wilt",
    "chilli_thrips",
    "black_thrips",
    "broad_mite",
    "powdery_mildew",
    "spodoptera_fruit_borer",
    "helicoverpa_fruit_borer",
    "anthracnose",
    "dieback",
  ],
  "08_cauliflower": [
    "damping_off",
    "wirestem",
    "aphid",
    "diamondback_moth",
    "tobacco_caterpillar",
    "cabbage_butterfly",
    "black_rot",
    "alternaria_leaf_spot",
    "downy_mildew",
  ],
  "09_cabbage": [
    "damping_off",
    "wirestem",
    "aphid",
    "diamondback_moth",
    "tobacco_caterpillar",
    "cabbage_butterfly",
    "black_rot",
    "alternaria_leaf_spot",
    "downy_mildew",
  ],
  "10_cucumber": [
    "red_pumpkin_beetle",
    "leaf_miner",
    "whitefly",
    "downy_mildew",
    "powdery_mildew",
    "fruit_fly",
  ],
  "11_brinjal": [
    "jassid",
    "whitefly",
    "little_leaf",
    "shoot_and_fruit_borer",
    "hadda_beetle",
    "red_spider_mite",
    "phomopsis_fruit_rot",
  ],
  "12_sugarcane": [
    "termite",
    "white_grub",
    "early_shoot_borer",
    "top_borer",
    "pokkah_boeng",
    "pyrilla",
    "woolly_aphid",
    "red_rot",
  ],
  "13_potato": [
    "black_scurf",
    "stem_canker",
    "cutworm",
    "aphid",
    "jassid",
    "whitefly",
    "early_blight",
    "late_blight",
  ],
  "14_pearl_millet": [
    "shoot_fly",
    "white_grub",
    "downy_mildew_green_ear",
    "ergot",
    "smut",
  ],
  "15_wheat": [
    "termite",
    "root_aphid",
    "pink_stem_borer",
    "yellow_rust",
    "brown_rust",
    "powdery_mildew",
    "karnal_bunt",
    "earhead_aphid",
  ],
  "16_onion": [
    "basal_rot",
    "pink_root",
    "thrips",
    "purple_blotch",
    "stemphylium_blight",
    "downy_mildew",
    "twister",
  ],
  "17_garlic": [
    "basal_rot",
    "pink_root",
    "thrips",
    "purple_blotch",
    "stemphylium_blight",
    "downy_mildew",
    "twister",
  ],
  "18_cotton": [
    "jassid",
    "aphid",
    "thrips",
    "whitefly",
    "mealybug",
    "pink_bollworm",
    "bacterial_angular_leaf_spot",
    "grey_mildew",
    "boll_rot",
  ],
  "19_moong": [
    "fusarium_wilt",
    "dry_root_rot",
    "yellow_mosaic",
    "whitefly",
    "flower_thrips",
    "aphid",
    "helicoverpa_pod_borer",
    "maruca_pod_borer",
    "powdery_mildew",
    "ascochyta_blight",
  ],
  "20_urad": [
    "fusarium_wilt",
    "dry_root_rot",
    "yellow_mosaic",
    "whitefly",
    "flower_thrips",
    "aphid",
    "helicoverpa_pod_borer",
    "maruca_pod_borer",
    "powdery_mildew",
    "ascochyta_blight",
  ],
  "21_pigeon_pea": [
    "fusarium_wilt",
    "dry_root_rot",
    "yellow_mosaic",
    "whitefly",
    "flower_thrips",
    "aphid",
    "helicoverpa_pod_borer",
    "maruca_pod_borer",
    "powdery_mildew",
    "ascochyta_blight",
  ],
  "22_chickpea": [
    "fusarium_wilt",
    "dry_root_rot",
    "yellow_mosaic",
    "whitefly",
    "flower_thrips",
    "aphid",
    "helicoverpa_pod_borer",
    "maruca_pod_borer",
    "powdery_mildew",
    "ascochyta_blight",
  ],
  "23_lentil": [
    "fusarium_wilt",
    "dry_root_rot",
    "yellow_mosaic",
    "whitefly",
    "flower_thrips",
    "aphid",
    "helicoverpa_pod_borer",
    "maruca_pod_borer",
    "powdery_mildew",
    "ascochyta_blight",
  ],
  "24_mustard": [
    "painted_bug",
    "sawfly",
    "white_rust",
    "alternaria_blight",
    "sclerotinia_stem_rot",
    "aphid",
  ],
  "25_okra": [
    "damping_off",
    "jassid",
    "whitefly",
    "yellow_vein_mosaic",
    "enation_leaf_curl",
    "shoot_and_fruit_borer",
    "red_spider_mite",
    "powdery_mildew",
    "cercospora_leaf_spot",
  ],
  "26_ginger": [
    "shoot_borer",
    "rhizome_soft_rot",
    "bacterial_wilt",
    "phyllosticta_leaf_spot",
  ],
  "27_mango": [
    "hopper",
    "powdery_mildew",
    "anthracnose",
    "fruit_fly",
  ],
  "28_banana": [
    "panama_wilt",
    "bacterial_head_rot",
    "sigatoka_leaf_spot",
    "scarring_beetle",
    "rust_thrips",
  ],
  "29_grapes": [
    "downy_mildew",
    "powdery_mildew",
    "thrips",
    "mealybug",
  ],
};

/** Metadata for all 116 unique problem slugs across the 232 images */
export const PROBLEM_META: Record<string, CropIdentificationProblemMeta> = {
  damping_off: {
    problemSlug: "damping_off",
    type: "disease",
    nameHi: "आर्द्र गलन / पौध गिरना (Damping-off)",
    nameEn: "Damping-off",
    scientificName: "Pythium aphanidermatum / Rhizoctonia solani",
    stageHi: "नर्सरी–अंकुर अवस्था",
    symptomHi: "मिट्टी की सतह के पास नन्हे पौधे का तना पानी से भीगा व पतला होकर सड़ जाता है और पौध अचानक लुढ़क कर गिर जाती है।",
    keywords: ["damping_off", "damping-off", "damping off", "pythium aphanidermatum", "आर्द्र गलन", "पौध गलन", "पौध गिरना", "अंकुर मरण"],
    pairedSlugs: ["wirestem"],
  },
  wirestem: {
    problemSlug: "wirestem",
    type: "disease",
    nameHi: "वायरस्टेम / तना सिकुड़न (Wirestem)",
    nameEn: "Wirestem (Rhizoctonia)",
    scientificName: "Rhizoctonia solani",
    stageHi: "नर्सरी–रोपाई अवस्था",
    symptomHi: "मिट्टी की सतह पर पौधे का निचला तना गहरा भूरा-काला और तार जैसा पतला व सख्त हो जाता है जिससे पौधा बौना रह जाता है या टूट जाता है।",
    keywords: ["wirestem", "wire stem", "वायरस्टेम", "तना सिकुड़न"],
    pairedSlugs: ["damping_off"],
  },
  collar_rot: {
    problemSlug: "collar_rot",
    type: "disease",
    nameHi: "कॉलर रॉट / तना आधार सड़न (Collar Rot)",
    nameEn: "Collar Rot",
    scientificName: "Aspergillus niger / Sclerotium rolfsii / Phytophthora capsici",
    stageHi: "अंकुर–वानस्पतिक अवस्था",
    symptomHi: "जमीन की सतह (कॉलर भाग) पर तना सड़कर काला या सफेद फफूंद युक्त हो जाता है और पौधा मुरझाकर सूख जाता है।",
    keywords: ["collar_rot", "collar-rot", "collar rot", "aspergillus niger", "phytophthora capsici", "कॉलर रॉट", "तना आधार सड़ना", "कॉलर व जड़ सड़न"],
    pairedSlugs: ["stem_rot"],
  },
  stem_rot: {
    problemSlug: "stem_rot",
    type: "disease",
    nameHi: "तना सड़न / स्क्लेरोशियम रॉट (Stem Rot)",
    nameEn: "Stem Rot (Sclerotium)",
    scientificName: "Sclerotium rolfsii",
    stageHi: "वानस्पतिक–फली बनना",
    symptomHi: "तने के आधार और मिट्टी पर सफेद रेशमी फफूंद की परत व सरसों के दाने जैसे भूरे गोल स्क्लेरोशिया दिखाई देते हैं।",
    keywords: ["stem_rot", "stem-rot", "stem rot", "sclerotium rolfsii", "तना सड़न", "स्टैम रॉट"],
    pairedSlugs: ["collar_rot"],
  },
  rhizoctonia_root_rot: {
    problemSlug: "rhizoctonia_root_rot",
    type: "disease",
    nameHi: "राइजोक्टोनिया जड़ सड़न (Rhizoctonia Root Rot)",
    nameEn: "Rhizoctonia Root Rot",
    scientificName: "Rhizoctonia solani",
    stageHi: "अंकुर–वानस्पतिक अवस्था",
    symptomHi: "मिट्टी की सतह के पास मुख्य जड़ और निचले तने पर लाल-भूरे धँसे हुए घाव बनते हैं और पौधा पीला पड़कर सूखने लगता है।",
    keywords: ["rhizoctonia_root_rot", "rhizoctonia root rot", "rhizoctonia solani", "जड़ सड़न", "राइजोक्टोनिया"],
    pairedSlugs: ["charcoal_rot"],
  },
  dry_root_rot: {
    problemSlug: "dry_root_rot",
    type: "disease",
    nameHi: "सूखी जड़ सड़न (Dry Root Rot)",
    nameEn: "Dry Root Rot",
    scientificName: "Rhizoctonia bataticola (Macrophomina phaseolina)",
    stageHi: "फूल–फली भरना",
    symptomHi: "पौधा अचानक सूखता है; उखाड़ने पर मूसला जड़ काली, सूखी व भुरभुरी निकलती है तथा बारीक जड़ें नष्ट हो जाती हैं।",
    keywords: ["dry_root_rot", "dry-root-rot", "dry root rot", "rhizoctonia bataticola", "macrophomina phaseolina", "सूखी जड़ सड़न"],
    pairedSlugs: ["fusarium_wilt"],
  },
  charcoal_rot: {
    problemSlug: "charcoal_rot",
    type: "disease",
    nameHi: "चारकोल रॉट / कोयला जड़ सड़न (Charcoal Rot)",
    nameEn: "Charcoal Rot",
    scientificName: "Macrophomina phaseolina",
    stageHi: "फली भरना–पकना",
    symptomHi: "निचला तना व जड़ चीरने पर अंदर धूसर रंग और कोयले के चूरे जैसे असंख्य काले सूक्ष्म बिंदु (Microsclerotia) दिखते हैं।",
    keywords: ["charcoal_rot", "charcoal-rot", "charcoal rot", "macrophomina phaseolina", "चारकोल रॉट", "कोयला सड़न"],
    pairedSlugs: ["rhizoctonia_root_rot"],
  },
  post_flowering_stalk_rot: {
    problemSlug: "post_flowering_stalk_rot",
    type: "disease",
    nameHi: "फूल के बाद तना सड़न (Post-Flowering Stalk Rot)",
    nameEn: "Post-Flowering Stalk Rot",
    scientificName: "Fusarium verticillioides / Macrophomina phaseolina",
    stageHi: "फूल के बाद–दाना भरना",
    symptomHi: "भुट्टा बनते समय निचली गांठें भूरे-काले रंग की होकर अंदर से खोखली व रेशेदार हो जाती हैं और पौधा हवा से गिर जाता है।",
    keywords: ["post_flowering_stalk_rot", "stalk rot", "charcoal rot", "macrophomina phaseolina", "fusarium verticillioides", "तना सड़न", "चारकोल रॉट"],
  },
  fusarium_wilt: {
    problemSlug: "fusarium_wilt",
    type: "disease",
    nameHi: "फ्यूजेरियम उकठा / मुरझान (Fusarium Wilt)",
    nameEn: "Fusarium Wilt",
    scientificName: "Fusarium oxysporum / Fusarium udum",
    stageHi: "वानस्पतिक–फूल व फली",
    symptomHi: "पत्तियाँ नीचे से पीली पड़कर लटक जाती हैं, पूरा पौधा सूख जाता है और तना चीरने पर अंदर की नलिकाएँ भूरी-काली दिखती हैं।",
    keywords: ["fusarium_wilt", "fusarium-wilt", "fusarium wilt", "fusarium oxysporum", "fusarium udum", "उकठा", "मुरझान", "फ्यूजेरियम", "फ्यूज़ेरियम", "wilt"],
    pairedSlugs: ["dry_root_rot"],
  },
  panama_wilt: {
    problemSlug: "panama_wilt",
    type: "disease",
    nameHi: "पनामा मुरझान / उकठा (Panama Wilt)",
    nameEn: "Panama Wilt",
    scientificName: "Fusarium oxysporum f.sp. cubense",
    stageHi: "वानस्पतिक–गुच्छा अवस्था",
    symptomHi: "पुरानी पत्तियाँ किनारों से तेज पीली पड़कर डंठल से टूटकर तने के चारों ओर स्कर्ट की तरह लटक जाती हैं; तना काटने पर लाल-भूरे छल्ले दिखते हैं।",
    keywords: ["panama_wilt", "panama-wilt", "panama wilt", "cubense", "पनामा मुरझान", "पनामा विल्ट"],
  },
  bacterial_wilt: {
    problemSlug: "bacterial_wilt",
    type: "disease",
    nameHi: "जीवाणु मुरझान (Bacterial Wilt)",
    nameEn: "Bacterial Wilt",
    scientificName: "Ralstonia solanacearum",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "हरा-भरा पौधा बिना पीला पड़े अचानक दिन की धूप में मुरझा जाता है; तना काटकर पानी में रखने पर दूधिया जीवाणु स्राव (Bacterial ooze) निकलता है।",
    keywords: ["bacterial_wilt", "bacterial-wilt", "bacterial wilt", "ralstonia solanacearum", "ralstonia", "जीवाणु मुरझान", "बैक्टीरियल विल्ट"],
  },
  bacterial_head_rot: {
    problemSlug: "bacterial_head_rot",
    type: "disease",
    nameHi: "जीवाणु मुलायम सड़न / कंद सड़न (Bacterial Soft / Head Rot)",
    nameEn: "Bacterial Head / Soft Rot",
    scientificName: "Erwinia chrysanthemi (Dickeya / Pectobacterium)",
    stageHi: "वानस्पतिक–कंद विकास",
    symptomHi: "राइजोम व आभासी तने का आधार गीला, बदबूदार और मुलायम होकर सड़ जाता है तथा पौधा हल्का धक्का लगने पर ही उखड़ जाता है।",
    keywords: ["bacterial_head_rot", "head rot", "soft rot", "erwinia", "pectobacterium", "जीवाणु मुलायम सड़न", "सॉफ्ट रॉट"],
  },
  rhizome_soft_rot: {
    problemSlug: "rhizome_soft_rot",
    type: "disease",
    nameHi: "प्रकंद / कंद मुलायम सड़न (Rhizome Soft Rot)",
    nameEn: "Rhizome Soft Rot",
    scientificName: "Pythium aphanidermatum / Pythium myriotylum",
    stageHi: "मानसून–कंद विकास",
    symptomHi: "पत्तियों के सिरे पीले पड़कर सूखते हैं, कॉलर भाग पानी जैसा गल जाता है और कंद अंदर से सड़कर बदबूदार लुगदी बन जाता है।",
    keywords: ["rhizome_soft_rot", "rhizome-rot", "soft-rot", "soft rot", "rhizome rot", "pythium", "प्रकंद सड़न", "नरम सड़न", "कंद सड़न", "सॉफ्ट रॉट"],
  },
  basal_rot: {
    problemSlug: "basal_rot",
    type: "disease",
    nameHi: "आधार सड़न / बेसल रॉट (Basal Rot)",
    nameEn: "Basal Rot",
    scientificName: "Fusarium oxysporum f.sp. cepae",
    stageHi: "बल्ब विकास–भंडारण",
    symptomHi: "पत्तियाँ ऊपर से पीली होकर सूखती हैं, बल्ब की निचली प्लेट भूरे रंग की होकर सड़ जाती है और जड़ें गलकर सफेद फफूंद दिखती है।",
    keywords: ["basal_rot", "basal-rot", "basal rot", "fusarium oxysporum", "आधार सड़न", "बेसल रॉट"],
    pairedSlugs: ["pink_root"],
  },
  pink_root: {
    problemSlug: "pink_root",
    type: "disease",
    nameHi: "गुलाबी जड़ रोग (Pink Root)",
    nameEn: "Pink Root",
    scientificName: "Setophoma terrestris (Phoma terrestris)",
    stageHi: "बल्ब विकास अवस्था",
    symptomHi: "संक्रमित जड़ें पहले हल्की गुलाबी और बाद में गहरी लाल-बैंगनी होकर सूख जाती हैं जिससे बल्ब का आकार छोटा रह जाता है।",
    keywords: ["pink_root", "pink-root", "pink root", "phoma terrestris", "setophoma", "गुलाबी जड़"],
    pairedSlugs: ["basal_rot"],
  },
  black_scurf: {
    problemSlug: "black_scurf",
    type: "disease",
    nameHi: "काला कवच / काली पपड़ी (Black Scurf)",
    nameEn: "Black Scurf",
    scientificName: "Rhizoctonia solani",
    stageHi: "कंद बनना–पकना",
    symptomHi: "आलू के कंद की सतह पर मिट्टी या कोयले के टुकड़ों जैसे सख्त काले उभरे हुए धब्बे (Sclerotia) चिपके रहते हैं जो धोने से भी नहीं हटते।",
    keywords: ["black_scurf", "black-scurf", "black scurf", "rhizoctonia solani", "काला कवच", "काली पपड़ी"],
    pairedSlugs: ["stem_canker"],
  },
  stem_canker: {
    problemSlug: "stem_canker",
    type: "disease",
    nameHi: "तना कैंकर (Rhizoctonia Stem Canker)",
    nameEn: "Stem Canker",
    scientificName: "Rhizoctonia solani",
    stageHi: "अंकुर–वानस्पतिक अवस्था",
    symptomHi: "जमीन के नीचे उगते अंकुरों और स्टोलन पर लाल-भूरे धँसे हुए घाव (Cankers) बनते हैं जिससे अंकुरण रुक जाता है।",
    keywords: ["stem_canker", "stem-canker", "stem canker", "तना कैंकर"],
    pairedSlugs: ["black_scurf"],
  },
  red_rot: {
    problemSlug: "red_rot",
    type: "disease",
    nameHi: "लाल सड़न / कैंसर रोग (Red Rot)",
    nameEn: "Red Rot",
    scientificName: "Colletotrichum falcatum",
    stageHi: "बढ़वार–पकना",
    symptomHi: "गन्ना बीच से चीरने पर गूदा लाल रंग का दिखता है जिस पर आड़ी सफेद पट्टियाँ होती हैं और सिरके जैसी खट्टी गंध आती है।",
    keywords: ["red_rot", "red-rot", "red rot", "colletotrichum falcatum", "लाल सड़न", "रेड रॉट"],
  },
  pokkah_boeng: {
    problemSlug: "pokkah_boeng",
    type: "disease",
    nameHi: "पोक्का बोएंग (Pokkah Boeng)",
    nameEn: "Pokkah Boeng",
    scientificName: "Fusarium moniliforme (Fusarium proliferatum)",
    stageHi: "मानसून–तेज़ बढ़वार",
    symptomHi: "ऊपरी नई पत्तियों का आधार पीला-सफेद होकर मुड़ जाता है, आपस में उलझ जाता है और गंभीर अवस्था में अगोला सड़ जाता है।",
    keywords: ["pokkah_boeng", "pokkah-boeng", "pokkah boeng", "fusarium moniliforme", "पोक्का बोएंग"],
  },
  bakanae: {
    problemSlug: "bakanae",
    type: "disease",
    nameHi: "बकाने / झंडा रोग (Bakanae / Foot Rot)",
    nameEn: "Bakanae (Foot Rot)",
    scientificName: "Fusarium fujikuroi (Gibberella fujikuroi)",
    stageHi: "नर्सरी–कल्ले फूटना",
    symptomHi: "ग्रसित पौधे सामान्य पौधों से असामान्य रूप से लंबे, पतले और हल्के पीले-हरे होकर खेत में अलग ही ऊँचे दिखाई देते हैं।",
    keywords: ["bakanae", "foot rot", "fusarium fujikuroi", "gibberella fujikuroi", "बकाने", "फुट रॉट", "झंडा रोग"],
  },
  sclerotinia_stem_rot: {
    problemSlug: "sclerotinia_stem_rot",
    type: "disease",
    nameHi: "स्क्लेरोटिनिया तना गलन / पोलियो रोग (Sclerotinia Stem Rot)",
    nameEn: "Sclerotinia Stem Rot",
    scientificName: "Sclerotinia sclerotiorum",
    stageHi: "फूल आना–फली बनना",
    symptomHi: "तने पर सफेद रुई जैसी फफूंद लिपट जाती है, तने के अंदर काले सख्त दाने (Sclerotia) बनते हैं और तना बीच से टूट जाता है।",
    keywords: ["sclerotinia_stem_rot", "sclerotinia", "sclerotinia sclerotiorum", "स्क्लेरोटिनिया", "तना गलन", "तना सड़न"],
  },
  early_blight: {
    problemSlug: "early_blight",
    type: "disease",
    nameHi: "अगेती झुलसा (Early Blight)",
    nameEn: "Early Blight",
    scientificName: "Alternaria solani",
    stageHi: "वानस्पतिक–फल/कंद बनना",
    symptomHi: "पुरानी निचली पत्तियों पर गहरे भूरे रंग के गोल छल्लेदार (Target-board concentric rings) धब्बे बनते हैं जिनके चारों ओर पीला घेरा होता है।",
    keywords: ["early_blight", "early-blight", "early blight", "alternaria solani", "अगेती झुलसा", "शुरुआती झुलसा"],
  },
  late_blight: {
    problemSlug: "late_blight",
    type: "disease",
    nameHi: "पछेती झुलसा (Late Blight)",
    nameEn: "Late Blight",
    scientificName: "Phytophthora infestans",
    stageHi: "ठंडा-नम मौसम / फल व कंद",
    symptomHi: "पत्तियों के किनारों पर पानी से भीगे गहरे भूरे-काले अनियमित धब्बे तेजी से फैलते हैं और सुबह पत्ती के नीचे सफेद फफूंद दिखती है।",
    keywords: ["late_blight", "late-blight", "late blight", "phytophthora infestans", "पछेती झुलसा", "देर से झुलसा"],
  },
  alternaria_blight: {
    problemSlug: "alternaria_blight",
    type: "disease",
    nameHi: "अल्टरनेरिया झुलसा (Alternaria Blight)",
    nameEn: "Alternaria Blight",
    scientificName: "Alternaria brassicae / Alternaria brassicicola",
    stageHi: "फूल–फली बनना",
    symptomHi: "पत्तियों और फलियों पर गहरे भूरे-काले गोल छल्लेदार (Concentric) धब्बे बनते हैं जिससे फलियाँ सिकुड़ जाती हैं।",
    keywords: ["alternaria_blight", "alternaria-blight", "alternaria blight", "alternaria brassicae", "अल्टरनेरिया झुलसा", "सरसों पत्ती झुलसा", "alternaria"],
  },
  alternaria_leaf_spot: {
    problemSlug: "alternaria_leaf_spot",
    type: "disease",
    nameHi: "अल्टरनेरिया पत्ती धब्बा (Alternaria Leaf Spot)",
    nameEn: "Alternaria Leaf Spot",
    scientificName: "Alternaria brassicicola / Alternaria brassicae",
    stageHi: "वानस्पतिक–हेड/फूल बनना",
    symptomHi: "बाहरी पत्तियों पर गोल भूरे-काले छल्लेदार धब्बे और फूल/हेड पर भूरे सड़न के निशान उभरते हैं।",
    keywords: ["alternaria_leaf_spot", "alternaria-leaf-spot", "alternaria leaf spot", "alternaria brassicicola", "अल्टरनेरिया पत्ती धब्बा", "पत्ती धब्बा"],
  },
  purple_blotch: {
    problemSlug: "purple_blotch",
    type: "disease",
    nameHi: "बैंगनी धब्बा / पर्पल ब्लॉच (Purple Blotch)",
    nameEn: "Purple Blotch",
    scientificName: "Alternaria porri",
    stageHi: "वानस्पतिक–बल्ब विकास",
    symptomHi: "पत्तियों पर धँसे हुए अंडाकार धब्बे बनते हैं जिनका बीच का भाग बैंगनी-लाल और किनारा पीला होता है।",
    keywords: ["purple_blotch", "purple-blotch", "purple blotch", "alternaria porri", "बैंगनी धब्बा", "पर्पल ब्लॉच"],
    pairedSlugs: ["stemphylium_blight"],
  },
  stemphylium_blight: {
    problemSlug: "stemphylium_blight",
    type: "disease",
    nameHi: "स्टेम्फिलियम झुलसा (Stemphylium Blight)",
    nameEn: "Stemphylium Blight",
    scientificName: "Stemphylium vesicarium",
    stageHi: "वानस्पतिक–बल्ब पकना",
    symptomHi: "पत्तियों के सिरों से हल्के पीले-भूरे व काले फफूंद युक्त धब्बे शुरू होकर पूरी पत्ती को ऊपर से नीचे की ओर सुखा देते हैं।",
    keywords: ["stemphylium_blight", "stemphylium-blight", "stemphylium", "stemphylium vesicarium", "स्टेम्फिलियम", "पत्ती सिर झुलसा"],
    pairedSlugs: ["purple_blotch"],
  },
  twister: {
    problemSlug: "twister",
    type: "disease",
    nameHi: "ट्विस्टर / गर्दन मरोड़ रोग (Twister / Anthracnose)",
    nameEn: "Twister Disease",
    scientificName: "Colletotrichum gloeosporioides / Gibberella moniliformis",
    stageHi: "मानसून–वानस्पतिक अवस्था",
    symptomHi: "पत्तियाँ असामान्य रूप से ऐंठकर व मुड़कर पीली पड़ जाती हैं और पौधे की गर्दन लंबी होकर गलने लगती है।",
    keywords: ["twister", "ट्विस्टर", "गर्दन मरोड़"],
  },
  tikka_leaf_spot: {
    problemSlug: "tikka_leaf_spot",
    type: "disease",
    nameHi: "टिक्का पत्ती धब्बा रोग (Tikka Leaf Spot)",
    nameEn: "Tikka Leaf Spot",
    scientificName: "Phaeoisariopsis personata / Cercospora arachidicola",
    stageHi: "वानस्पतिक–फली बनना",
    symptomHi: "पत्तियों पर गहरे भूरे-काले गोल धब्बे बनते हैं जिनके चारों ओर स्पष्ट पीला घेरा (Yellow halo) होता है और पत्तियाँ समय से पहले झड़ जाती हैं।",
    keywords: ["tikka_leaf_spot", "tikka-leaf-spot", "tikka", "phaeoisariopsis personata", "cercospora arachidicola", "passalora", "टिक्का", "पत्ती धब्बा"],
  },
  cercospora_leaf_spot: {
    problemSlug: "cercospora_leaf_spot",
    type: "disease",
    nameHi: "सर्कोस्पोरा पत्ती धब्बा (Cercospora Leaf Spot)",
    nameEn: "Cercospora Leaf Spot",
    scientificName: "Pseudocercospora abelmoschi / Cercospora canescens",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "पत्तियों पर भूरे-काले कोणीय धब्बे और निचली सतह पर कालिख जैसा धूसर फफूंद जमाव दिखता है जिससे पत्तियाँ सूखकर गिरती हैं।",
    keywords: ["cercospora_leaf_spot", "cercospora", "cercospora abelmoschi", "cercospora canescens", "सर्कोस्पोरा", "पत्ती धब्बा"],
  },
  sigatoka_leaf_spot: {
    problemSlug: "sigatoka_leaf_spot",
    type: "disease",
    nameHi: "सिगाटोका पत्ती धब्बा (Sigatoka Leaf Spot)",
    nameEn: "Sigatoka Leaf Spot",
    scientificName: "Mycosphaerella musicola (Pseudocercospora musae)",
    stageHi: "वानस्पतिक–गुच्छा अवस्था",
    symptomHi: "पत्तियों के किनारों पर पीली-भूरी समानांतर धारियाँ व धूसर केंद्र वाले धब्बे बनते हैं जो मिलकर पूरी पत्ती को झुलसा देते हैं।",
    keywords: ["sigatoka_leaf_spot", "sigatoka", "mycosphaerella musicola", "pseudocercospora musae", "सिगाटोका"],
  },
  phyllosticta_leaf_spot: {
    problemSlug: "phyllosticta_leaf_spot",
    type: "disease",
    nameHi: "फिलोस्टिक्टा पत्ती धब्बा (Phyllosticta Leaf Spot)",
    nameEn: "Phyllosticta Leaf Spot",
    scientificName: "Phyllosticta zingiberi",
    stageHi: "मानसून–वानस्पतिक अवस्था",
    symptomHi: "पत्तियों पर सफेद कागजी केंद्र और गहरे भूरे किनारे व पीले घेरे वाले अंडाकार धब्बे बनते हैं जिनमें सूक्ष्म काले बिंदु दिखते हैं।",
    keywords: ["phyllosticta_leaf_spot", "phyllosticta", "leaf-spot", "leaf spot", "phyllosticta zingiberi", "पत्ती धब्बा"],
  },
  turcicum_leaf_blight: {
    problemSlug: "turcicum_leaf_blight",
    type: "disease",
    nameHi: "टर्सिकम पत्ती झुलसा (Turcicum Leaf Blight)",
    nameEn: "Turcicum Leaf Blight",
    scientificName: "Exserohilum turcicum",
    stageHi: "वानस्पतिक–फूल आना",
    symptomHi: "निचली पत्तियों पर नाव या सिगार के आकार के लंबे धूसर-भूरे धब्बे (5–15 सेमी) बनते हैं जिससे पूरी पत्ती झुलस जाती है।",
    keywords: ["turcicum_leaf_blight", "turcicum", "exserohilum turcicum", "टर्सिकम", "मक्का पत्ती झुलसा"],
    pairedSlugs: ["maydis_leaf_blight"],
  },
  maydis_leaf_blight: {
    problemSlug: "maydis_leaf_blight",
    type: "disease",
    nameHi: "मेडिस पत्ती झुलसा (Maydis Leaf Blight)",
    nameEn: "Maydis Leaf Blight",
    scientificName: "Bipolaris maydis",
    stageHi: "वानस्पतिक–दाना बनना",
    symptomHi: "पत्तियों की नसों के बीच समानांतर किनारों वाले आयताकार/लंबे हल्के भूरे धब्बे बनते हैं जिनके किनारे गहरे लाल-भूरे होते हैं।",
    keywords: ["maydis_leaf_blight", "maydis", "bipolaris maydis", "मेडिस", "मक्का पत्ती धब्बा"],
    pairedSlugs: ["turcicum_leaf_blight"],
  },
  ascochyta_blight: {
    problemSlug: "ascochyta_blight",
    type: "disease",
    nameHi: "एस्कोचाइटा झुलसा (Ascochyta Blight)",
    nameEn: "Ascochyta Blight",
    scientificName: "Ascochyta rabiei / Ascochyta lentis",
    stageHi: "फूल–फली बनना",
    symptomHi: "पत्तियों, तनों और फलियों पर भूरे किनारे व छल्लेदार काले बिंदुओं (Pycnidia) वाले गोल धब्बे बनते हैं जिनसे टहनियाँ टूट जाती हैं।",
    keywords: ["ascochyta_blight", "ascochyta", "ascochyta rabiei", "ascochyta lentis", "एस्कोचाइटा", "एस्कोकाइटा"],
  },
  anthracnose: {
    problemSlug: "anthracnose",
    type: "disease",
    nameHi: "एन्थ्रेक्नोज / फल सड़न (Anthracnose)",
    nameEn: "Anthracnose",
    scientificName: "Colletotrichum capsici / C. gloeosporioides / C. truncatum",
    stageHi: "फूल–फल व फली पकना",
    symptomHi: "फलों, फलियों या पत्तियों पर धँसे हुए काले-भूरे गोल घाव बनते हैं जिनके बीच छल्लेदार काले या गुलाबी बीजाणु बिंदु दिखते हैं।",
    keywords: ["anthracnose", "colletotrichum capsici", "colletotrichum truncatum", "colletotrichum lindemuthianum", "एन्थ्रेक्नोज", "एंथ्रेक्नोज", "फल सड़न", "फल धब्बा", "फल झुलसा"],
    pairedSlugs: ["dieback"],
  },
  dieback: {
    problemSlug: "dieback",
    type: "disease",
    nameHi: "डाइबैक / टहनी सूखना (Dieback)",
    nameEn: "Dieback",
    scientificName: "Colletotrichum gloeosporioides / Lasiodiplodia",
    stageHi: "फूल–फलन अवस्था",
    symptomHi: "शाखाएँ ऊपर के सिरे से नीचे की ओर भूरे-काले रंग की होकर सूखती जाती हैं और फूल व छोटे फल झड़ जाते हैं।",
    keywords: ["dieback", "die-back", "colletotrichum gloeosporioides", "lasiodiplodia", "डाइबैक", "सूखना-पीछे हटना", "टहनी सूखना"],
    pairedSlugs: ["anthracnose"],
  },
  phomopsis_fruit_rot: {
    problemSlug: "phomopsis_fruit_rot",
    type: "disease",
    nameHi: "फोमोप्सिस फल सड़न / झुलसा (Phomopsis Blight)",
    nameEn: "Phomopsis Fruit Rot",
    scientificName: "Phomopsis vexans",
    stageHi: "फल विकास अवस्था",
    symptomHi: "बैंगन के फलों पर बड़े धँसे हुए हल्के भूरे व छल्लेदार सड़न के धब्बे बनते हैं जिन पर सूक्ष्म काले दाने (Pycnidia) उभरते हैं।",
    keywords: ["phomopsis_fruit_rot", "phomopsis", "phomopsis vexans", "फोमोप्सिस", "बैंगन फल झुलसा", "फल सड़न"],
  },
  purple_seed_stain: {
    problemSlug: "purple_seed_stain",
    type: "disease",
    nameHi: "बैंगनी बीज धब्बा / सर्कोस्पोरा (Purple Seed Stain / Cercospora)",
    nameEn: "Purple Seed Stain (Cercospora)",
    scientificName: "Cercospora kikuchii / Cercospora sojina",
    stageHi: "फली भरना–पकना",
    symptomHi: "सोयाबीन के दानों के आवरण पर स्पष्ट गुलाबी से गहरे बैंगनी रंग के धब्बे पड़ जाते हैं और पत्तियों पर लाल-भूरे निशान दिखते हैं।",
    keywords: ["purple_seed_stain", "purple seed stain", "cercospora kikuchii", "cercospora sojina", "cercospora", "बैंगनी बीज", "बीज बैंगनी दाग", "मेंढक-आँख"],
  },
  sheath_blight: {
    problemSlug: "sheath_blight",
    type: "disease",
    nameHi: "शीथ ब्लाइट / पर्ण आवरण झुलसा (Sheath Blight)",
    nameEn: "Sheath Blight",
    scientificName: "Rhizoctonia solani",
    stageHi: "कल्ले फूटना–बाली निकलना",
    symptomHi: "पानी की सतह के ऊपर तने के आवरण (Sheath) पर साँप की केंचुली जैसे बड़े अंडाकार धूसर-हरे व भूरे किनारे वाले धब्बे बनते हैं।",
    keywords: ["sheath_blight", "sheath-blight", "sheath blight", "पर्ण आवरण", "शीथ ब्लाइट"],
  },
  leaf_blast: {
    problemSlug: "leaf_blast",
    type: "disease",
    nameHi: "धान पत्ती ब्लास्ट / झुलसा (Leaf Blast)",
    nameEn: "Leaf Blast",
    scientificName: "Magnaporthe oryzae (Pyricularia oryzae)",
    stageHi: "कल्ले–वानस्पतिक अवस्था",
    symptomHi: "पत्तियों पर आँख या नाव (Spindle/Diamond) के आकार के धब्बे बनते हैं जिनका बीच का भाग राख जैसा धूसर और किनारा गहरा भूरा होता है।",
    keywords: ["leaf_blast", "leaf-blast", "blast", "rice blast", "magnaporthe oryzae", "pyricularia", "धान झुलसा", "धान ब्लास्ट", "ब्लास्ट"],
    pairedSlugs: ["neck_blast"],
  },
  neck_blast: {
    problemSlug: "neck_blast",
    type: "disease",
    nameHi: "धान गर्दन ब्लास्ट / तोड़ रोग (Neck Blast)",
    nameEn: "Neck Blast",
    scientificName: "Magnaporthe oryzae",
    stageHi: "बाली निकलना–दाना भरना",
    symptomHi: "बाली के ठीक नीचे की मुख्य गाँठ (गर्दन) काली-भूरी होकर सड़ जाती है और बाली टूटकर लटक जाती है व दाने खाली रह जाते हैं।",
    keywords: ["neck_blast", "neck-blast", "neck blast", "गर्दन झुलसा", "गर्दन ब्लास्ट"],
    pairedSlugs: ["leaf_blast"],
  },
  false_smut: {
    problemSlug: "false_smut",
    type: "disease",
    nameHi: "झूठा कंड / हल्दी रोग (False Smut)",
    nameEn: "False Smut",
    scientificName: "Ustilaginoidea virens",
    stageHi: "फूल आना–दूधिया दाना",
    symptomHi: "बाली के कुछ दाने फूलकर पीले-नारंगी और बाद में मखमली हरे-काले रंग की बड़ी गेंदों (Smut balls) में बदल जाते हैं।",
    keywords: ["false_smut", "false-smut", "false smut", "ustilaginoidea virens", "झूठा कंड", "फॉल्स स्मट", "हल्दी रोग"],
  },
  karnal_bunt: {
    problemSlug: "karnal_bunt",
    type: "disease",
    nameHi: "करनाल बंट / करनाल कंड (Karnal Bunt)",
    nameEn: "Karnal Bunt",
    scientificName: "Tilletia indica (Neovossia indica)",
    stageHi: "फूल–दाना पकना",
    symptomHi: "गेहूँ की बाली के कुछ दाने आंशिक रूप से काले कोयले जैसे चूर्ण में बदल जाते हैं जिनसे सड़ी मछली जैसी तीखी गंध आती है।",
    keywords: ["karnal_bunt", "karnal-bunt", "karnal bunt", "tilletia indica", "neovossia", "करनाल बंट", "करनाल कंड"],
  },
  smut: {
    problemSlug: "smut",
    type: "disease",
    nameHi: "कंड रोग / कांगियारी (Grain Smut)",
    nameEn: "Smut",
    scientificName: "Tolyposporium penicillariae (Moesziomyces)",
    stageHi: "बाली व दाना भरना",
    symptomHi: "बाली में सामान्य दानों की जगह चमकदार हरे और बाद में गहरे भूरे-काले रंग की थैलियाँ बन जाती हैं जिनके अंदर काला चूर्ण भरा होता है।",
    keywords: ["smut", "grain smut", "tolyposporium penicillariae", "moesziomyces", "कंड", "स्मट", "कांगियारी"],
  },
  ergot: {
    problemSlug: "ergot",
    type: "disease",
    nameHi: "अर्गोट / गूंदिया रोग (Ergot)",
    nameEn: "Ergot",
    scientificName: "Claviceps fusiformis",
    stageHi: "फूल आना–दाना बनना",
    symptomHi: "बाली के फूलों से गुलाबी-भूरे रंग का चिपचिपा मीठा शहद जैसा रस टपकता है जो बाद में काले सख्त सींग (Sclerotia) में बदल जाता है।",
    keywords: ["ergot", "claviceps fusiformis", "claviceps", "अर्गोट", "अरगट", "गूंदिया"],
  },
  downy_mildew_green_ear: {
    problemSlug: "downy_mildew_green_ear",
    type: "disease",
    nameHi: "हरित बाली / जोगिया रोग (Downy Mildew / Green Ear)",
    nameEn: "Downy Mildew (Green Ear)",
    scientificName: "Sclerospora graminicola",
    stageHi: "वानस्पतिक–बाली निकलना",
    symptomHi: "बाली में दानों की जगह मुड़ी-तुड़ी हरी पत्ती जैसी संरचनाएँ (झाड़ू जैसी हरित बाली) निकल आती हैं।",
    keywords: ["downy_mildew_green_ear", "green ear", "downy mildew", "sclerospora graminicola", "हरित बाली", "जोगिया", "डाउनी मिल्ड्यू", "बलूत फफूंद"],
  },
  downy_mildew: {
    problemSlug: "downy_mildew",
    type: "disease",
    nameHi: "डाउनी मिल्ड्यू / मृदुरोमिल आसिता (Downy Mildew)",
    nameEn: "Downy Mildew",
    scientificName: "Pseudoperonospora cubensis / Peronospora destructor / Plasmopara viticola / Hyaloperonospora brassicae",
    stageHi: "ठंडा-नम व ओस वाला मौसम",
    symptomHi: "पत्ती की ऊपरी सतह पर नसों से घिरे पीले कोणीय धब्बे और निचली सतह पर बैंगनी-धूसर या सफेद रोमिल फफूंद दिखाई देती है।",
    keywords: ["downy_mildew", "downy-mildew", "downy mildew", "downy", "pseudoperonospora cubensis", "peronospora destructor", "hyaloperonospora brassicae", "plasmopara viticola", "डाउनी मिल्ड्यू", "रोमिल फफूंद", "बलूत फफूंद", "मृदुरोमिल"],
  },
  powdery_mildew: {
    problemSlug: "powdery_mildew",
    type: "disease",
    nameHi: "चूर्णिल फफूंद / छाछिया रोग (Powdery Mildew)",
    nameEn: "Powdery Mildew",
    scientificName: "Erysiphe / Leveillula taurica / Podosphaera xanthii / Blumeria graminis / Oidium mangiferae",
    stageHi: "वानस्पतिक–फूल व फलन",
    symptomHi: "पत्तियों, तनों या बौर के ऊपर सफेद आटे या टेलकम पाउडर जैसी फफूंद की परत जम जाती है जिससे पत्तियाँ पीली पड़कर सूखती हैं।",
    keywords: ["powdery_mildew", "powdery-mildew", "powdery mildew", "powdery", "leveillula taurica", "erysiphe", "podosphaera xanthii", "blumeria graminis", "oidium mangiferae", "uncinula", "चूर्णिल फफूंद", "सफेद चूर्ण", "पाउडरी मिलड्यू", "छाछिया", "भभूतिया"],
  },
  grey_mildew: {
    problemSlug: "grey_mildew",
    type: "disease",
    nameHi: "दहिया रोग / ग्रे मिल्ड्यू (Grey Mildew)",
    nameEn: "Grey Mildew",
    scientificName: "Ramularia areola",
    stageHi: "फूल–टिंडा बनना",
    symptomHi: "पत्तियों की छोटी नसों के बीच कोणीय धब्बे बनते हैं जिन पर दही या पाले जैसी सफेद-धूसर चूर्णी फफूंद दिखाई देती है।",
    keywords: ["grey_mildew", "grey-mildew", "grey mildew", "ramularia areola", "दहिया", "धूसर फफूंद", "ग्रे मिल्ड्यू"],
  },
  boll_rot: {
    problemSlug: "boll_rot",
    type: "disease",
    nameHi: "टिंडा सड़न / बॉल रॉट (Boll Rot Complex)",
    nameEn: "Boll Rot",
    scientificName: "Colletotrichum / Fusarium / Xanthomonas / Aspergillus",
    stageHi: "टिंडा विकास–खुलना",
    symptomHi: "कपास के टिंडों पर काले-भूरे धँसे हुए घाव पड़ जाते हैं, टिंडे पूरी तरह नहीं खिलते और अंदर की रुई काली व कड़ी होकर सड़ जाती है।",
    keywords: ["boll_rot", "boll-rot", "boll rot", "टिंडा सड़न", "बॉल रॉट"],
  },
  yellow_rust: {
    problemSlug: "yellow_rust",
    type: "disease",
    nameHi: "पीला रतुआ / धारीदार रतुआ (Yellow / Stripe Rust)",
    nameEn: "Yellow Rust",
    scientificName: "Puccinia striiformis",
    stageHi: "कल्ले फूटना–बाली निकलना",
    symptomHi: "पत्तियों की नसों के समानांतर चमकीले पीले-नारंगी फफोलों की सीधी कतारें (धारियाँ) बनती हैं जिन्हें छूने पर पीला पाउडर लगता है।",
    keywords: ["yellow_rust", "yellow-rust", "yellow rust", "stripe rust", "puccinia striiformis", "पीला रतुआ"],
    pairedSlugs: ["brown_rust"],
  },
  brown_rust: {
    problemSlug: "brown_rust",
    type: "disease",
    nameHi: "भूरा रतुआ / पत्ती रतुआ (Brown / Leaf Rust)",
    nameEn: "Brown Rust",
    scientificName: "Puccinia triticina (Puccinia recondita)",
    stageHi: "कल्ले–दूधिया दाना",
    symptomHi: "पत्तियों की ऊपरी सतह पर नारंगी-भूरे रंग के छोटे गोल या अंडाकार फफोले (Pustules) बिना किसी कतार के बिखरे हुए दिखाई देते हैं।",
    keywords: ["brown_rust", "brown-rust", "brown rust", "leaf rust", "puccinia triticina", "puccinia recondita", "भूरा रतुआ"],
    pairedSlugs: ["yellow_rust"],
  },
  white_rust: {
    problemSlug: "white_rust",
    type: "disease",
    nameHi: "सफेद रतुआ / सफेद रोली (White Rust)",
    nameEn: "White Rust",
    scientificName: "Albugo candida",
    stageHi: "वानस्पतिक–फूल व फली",
    symptomHi: "पत्तियों की निचली सतह पर चूने जैसे चमकदार सफेद उभरे हुए फफोले बनते हैं और ऊपरी फूल की टहनी फूलकर सींग जैसी विकृत (Staghead) हो जाती है।",
    keywords: ["white_rust", "white-rust", "white rust", "albugo candida", "सफेद रतुआ", "सफेद रोली"],
  },
  rust: {
    problemSlug: "rust",
    type: "disease",
    nameHi: "रतुआ / गेरुई रोग (Rust)",
    nameEn: "Rust",
    scientificName: "Puccinia arachidis / Phakopsora pachyrhizi / Uromyces",
    stageHi: "वानस्पतिक–फली भरना",
    symptomHi: "पत्तियों की निचली सतह पर जंग (लोहे के जंग) जैसे नारंगी-लाल से कत्थई भूरे रंग के उभरे हुए पाउडरी दाने/फफोले उभर आते हैं।",
    keywords: ["rust", "puccinia arachidis", "phakopsora", "uromyces", "रतुआ", "गेरुई", "रस्ट"],
  },
  bacterial_leaf_blight: {
    problemSlug: "bacterial_leaf_blight",
    type: "disease",
    nameHi: "जीवाणु पत्ती झुलसा (Bacterial Leaf Blight - BLB)",
    nameEn: "Bacterial Leaf Blight",
    scientificName: "Xanthomonas oryzae pv. oryzae",
    stageHi: "कल्ले फूटना–बाली आना",
    symptomHi: "पत्ती की नोक से दोनों किनारों के साथ पीले-सफेद लहरदार (Wavy margin) धब्बे नीचे की ओर बढ़ते हैं और पत्तियाँ ऊपर से सूखने लगती हैं।",
    keywords: ["bacterial_leaf_blight", "blb", "bacterial leaf blight", "xanthomonas oryzae", "जीवाणु पत्ती झुलसा", "बैक्टीरियल लीफ ब्लाइट"],
  },
  bacterial_angular_leaf_spot: {
    problemSlug: "bacterial_angular_leaf_spot",
    type: "disease",
    nameHi: "जीवाणु झुलसा / कोणीय पत्ती धब्बा (Bacterial Blight / Angular Leaf Spot)",
    nameEn: "Bacterial Angular Leaf Spot",
    scientificName: "Xanthomonas citri pv. malvacearum",
    stageHi: "वानस्पतिक–टिंडा बनना",
    symptomHi: "पत्तियों पर नसों से घिरे पानी से भीगे गहरे भूरे-काले कोणीय धब्बे बनते हैं और नसें काली पड़ जाती हैं (Black arm)।",
    keywords: ["bacterial_angular_leaf_spot", "bacterial-blight", "bacterial blight", "angular leaf spot", "xanthomonas citri", "जीवाणु झुलसा", "कोणीय पत्ती धब्बा"],
  },
  bacterial_spot: {
    problemSlug: "bacterial_spot",
    type: "disease",
    nameHi: "जीवाणु धब्बा / पर्ण व फल धब्बा (Bacterial Spot)",
    nameEn: "Bacterial Spot",
    scientificName: "Xanthomonas vesicatoria / Septoria lycopersici",
    stageHi: "वानस्पतिक–फल लगना",
    symptomHi: "पत्तियों पर छोटे गहरे भूरे-काले धब्बे और हरे फलों पर उभरे हुए खुरदरे पपड़ीदार काले निशान (Scabby spots) बनते हैं।",
    keywords: ["bacterial_spot", "bacterial spot", "xanthomonas vesicatoria", "septoria", "जीवाणु धब्बा", "सेप्टोरिया"],
  },
  black_rot: {
    problemSlug: "black_rot",
    type: "disease",
    nameHi: "काला गलन / ब्लैक रॉट (Black Rot)",
    nameEn: "Black Rot",
    scientificName: "Xanthomonas campestris pv. campestris",
    stageHi: "वानस्पतिक–हेड/फूल बनना",
    symptomHi: "पत्ती के बाहरी किनारे से अंदर की ओर अंग्रेजी के 'V' आकार का पीला धब्बा बनता है जिसके अंदर की नसें स्याही जैसी काली पड़ जाती हैं।",
    keywords: ["black_rot", "black-rot", "black rot", "xanthomonas campestris", "काला गलन", "ब्लैक रॉट"],
  },
  leaf_curl: {
    problemSlug: "leaf_curl",
    type: "disease",
    nameHi: "पत्ती मोड़ वायरस / मरोड़िया (Leaf Curl Virus)",
    nameEn: "Leaf Curl Virus",
    scientificName: "Tomato Leaf Curl Begomovirus (Whitefly vector)",
    stageHi: "वानस्पतिक–फूल आना",
    symptomHi: "नई पत्तियाँ छोटी, मोटी व पीली होकर नाव/कप की तरह ऊपर की ओर मुड़ जाती हैं और पौधा झाड़ीनुमा बौना रह जाता है।",
    keywords: ["leaf_curl", "leaf-curl", "leaf curl", "begomovirus", "tylcv", "पत्ती मोड़", "पत्ती मुड़ना", "मरोड़िया"],
  },
  yellow_mosaic: {
    problemSlug: "yellow_mosaic",
    type: "disease",
    nameHi: "पीला मोज़ेक वायरस (Yellow Mosaic Virus - YMV)",
    nameEn: "Yellow Mosaic Virus",
    scientificName: "Mungbean Yellow Mosaic Virus (Begomovirus)",
    stageHi: "वानस्पतिक–फूल आना",
    symptomHi: "पत्तियों पर चमकीले सुनहरे-पीले और हरे रंग के अनियमित चकत्ते (Mosaic patches) उभर आते हैं और पौधे में फलियाँ बहुत कम लगती हैं।",
    keywords: ["yellow_mosaic", "yellow-mosaic", "yellow mosaic", "mosaic", "mymv", "mungbean yellow mosaic", "पीला मोज़ेक", "पीली पच्चीकारी", "येलो मोज़ेक"],
  },
  yellow_vein_mosaic: {
    problemSlug: "yellow_vein_mosaic",
    type: "disease",
    nameHi: "पीत शिरा मोज़ेक / पीली नस रोग (Yellow Vein Mosaic - YVMV)",
    nameEn: "Yellow Vein Mosaic Virus",
    scientificName: "Bhendi Yellow Vein Mosaic Virus (Whitefly vector)",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "भिंडी की पत्तियों की सभी बड़ी व छोटी नसें चमकीली पीली हो जाती हैं और बीच का भाग हरा दिखता है (पीला जाल) तथा फल छोटे व पीले-सफेद लगते हैं।",
    keywords: ["yellow_vein_mosaic", "ymv", "yvmv", "yellow vein mosaic", "bhendi yellow vein", "पीत शिरा मोज़ेक", "पीली नस रोग"],
    pairedSlugs: ["enation_leaf_curl"],
  },
  enation_leaf_curl: {
    problemSlug: "enation_leaf_curl",
    type: "disease",
    nameHi: "एनेशन पत्ती मोड़ वायरस (Enation Leaf Curl Virus - OELCV)",
    nameEn: "Enation Leaf Curl Virus",
    scientificName: "Okra Enation Leaf Curl Virus (Begomovirus)",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "पत्तियाँ मोटी और खुरदरी होकर ऊपर की ओर मुड़ जाती हैं, डंठल टेढ़े-मेढ़े हो जाते हैं और निचली नसों पर छोटे पत्तीनुमा उभार (Enations) दिखते हैं।",
    keywords: ["enation_leaf_curl", "oelcv", "enation leaf curl", "leaf curl", "पत्ती मोड़", "एनेशन लीफ कर्ल"],
    pairedSlugs: ["yellow_vein_mosaic"],
  },
  little_leaf: {
    problemSlug: "little_leaf",
    type: "disease",
    nameHi: "छोटी पत्ती रोग (Little Leaf of Brinjal)",
    nameEn: "Little Leaf (Phytoplasma)",
    scientificName: "Candidatus Phytoplasma trifolii (Leafhopper vector)",
    stageHi: "वानस्पतिक–फूल अवस्था",
    symptomHi: "पत्तियाँ अत्यंत छोटी, पतली व हल्की पीली होकर गुच्छों में निकलती हैं जिससे पौधा घनी झाड़ी (Witches' broom) जैसा दिखता है और फल नहीं लगते।",
    keywords: ["little_leaf", "little-leaf", "little leaf", "phytoplasma", "छोटी पत्ती", "लिटिल लीफ"],
  },
  whitefly: {
    problemSlug: "whitefly",
    type: "pest",
    nameHi: "सफेद मक्खी (Whitefly)",
    nameEn: "Whitefly",
    scientificName: "Bemisia tabaci",
    stageHi: "पूरी फसल अवधि",
    symptomHi: "पत्तियों की निचली सतह पर नन्ही सफेद पंखों वाली मक्खियाँ व चपटे शिशु चिपके रहते हैं जो रस चूसते हैं और लीफ कर्ल/मोज़ेक वायरस फैलाते हैं।",
    keywords: ["whitefly", "white-fly", "bemisia tabaci", "सफेद मक्खी", "सफ़ेद मक्खी"],
  },
  jassid: {
    problemSlug: "jassid",
    type: "pest",
    nameHi: "हरा तेला / जैसिड (Jassid / Leafhopper)",
    nameEn: "Jassid (Leafhopper)",
    scientificName: "Amrasca biguttula biguttula / Empoasca kerri",
    stageHi: "वानस्पतिक वृद्धि अवस्था",
    symptomHi: "पत्ती के नीचे हरे पच्चर के आकार के फुदके तिरछे चलते दिखते हैं; रस चूसने से पत्ती के किनारे पीले फिर ईंट जैसे लाल होकर नीचे मुड़ते हैं (Hopperburn)।",
    keywords: ["jassid", "jassids", "leafhopper", "amrasca biguttula", "empoasca", "हरा तेला", "तेला", "जैसिड", "हरा तैलक"],
  },
  aphid: {
    problemSlug: "aphid",
    type: "pest",
    nameHi: "माहू / चेपा / एफिड (Aphid)",
    nameEn: "Aphid",
    scientificName: "Myzus persicae / Aphis gossypii / Aphis craccivora / Lipaphis erysimi",
    stageHi: "वानस्पतिक–फूल व फली",
    symptomHi: "कोमल पत्तियों, डंठलों और फूलों पर हरे, पीले या काले रंग के मुलायम माहू झुंड में चिपककर रस चूसते हैं और चिपचिपा मधुस्राव छोड़ते हैं।",
    keywords: ["aphid", "aphids", "myzus persicae", "aphis gossypii", "aphis craccivora", "lipaphis erysimi", "माहू", "माहूँ", "एफिड", "चेपा"],
  },
  earhead_aphid: {
    problemSlug: "earhead_aphid",
    type: "pest",
    nameHi: "बाली व पत्ती का माहू (Earhead / Foliar Aphid)",
    nameEn: "Earhead Aphid",
    scientificName: "Sitobion avenae / Rhopalosiphum padi",
    stageHi: "कल्ले–बाली व दूधिया अवस्था",
    symptomHi: "गेहूँ की हरी बाली और झंडा पत्ती पर हरे-भूरे माहू कॉलोनी बनाकर दानों का रस चूसते हैं और चिपचिपा पदार्थ छोड़ते हैं।",
    keywords: ["earhead_aphid", "aphid", "aphids", "sitobion avenae", "माहू", "बाली का माहू", "एफिड"],
    pairedSlugs: ["root_aphid"],
  },
  root_aphid: {
    problemSlug: "root_aphid",
    type: "pest",
    nameHi: "जड़ का माहू (Root Aphid)",
    nameEn: "Root Aphid",
    scientificName: "Rhopalosiphum rufiabdominale",
    stageHi: "अंकुर–कल्ले फूटना",
    symptomHi: "मिट्टी की सतह के नीचे तने के आधार और जड़ों पर गोल भूरे-हरे माहू चिपककर रस चूसते हैं जिससे पौधा पीला पड़कर सूखने लगता है।",
    keywords: ["root_aphid", "root aphid", "rhopalosiphum rufiabdominale", "जड़ का माहू", "जड़ माहू"],
    pairedSlugs: ["earhead_aphid"],
  },
  woolly_aphid: {
    problemSlug: "woolly_aphid",
    type: "pest",
    nameHi: "ऊनी माहूँ / वूली एफिड (Woolly Aphid)",
    nameEn: "Sugarcane Woolly Aphid",
    scientificName: "Ceratovacuna lanigera",
    stageHi: "मानसून–बढ़वार अवस्था",
    symptomHi: "गन्ने की पत्ती की निचली सतह पर मध्य शिरा के दोनों ओर सफेद रुई/ऊन जैसी मोटी परत में ढके माहूँ का भारी जमाव और नीचे की पत्तियों पर काली फफूंद दिखती है।",
    keywords: ["woolly_aphid", "woolly aphid", "ceratovacuna lanigera", "ऊनी माहूँ", "वूली एफिड"],
  },
  thrips: {
    problemSlug: "thrips",
    type: "pest",
    nameHi: "थ्रिप्स / रस चूसक कीट (Thrips)",
    nameEn: "Thrips",
    scientificName: "Thrips tabaci / Thrips palmi / Scirtothrips dorsalis",
    stageHi: "वानस्पतिक–फूल व फलन",
    symptomHi: "सूक्ष्म पीले-भूरे थ्रिप्स पत्तियों व फूलों को खुरचकर रस चूसते हैं जिससे पत्तियों पर चाँदी जैसी सफेद चमक (Silvery streaks) आती है और पत्तियाँ ऊपर मुड़ती हैं।",
    keywords: ["thrips", "thrips tabaci", "thrips palmi", "scirtothrips", "थ्रिप्स", "रस चूसक कीड़ा"],
  },
  chilli_thrips: {
    problemSlug: "chilli_thrips",
    type: "pest",
    nameHi: "मिर्च का पीला थ्रिप्स (Chilli Thrips)",
    nameEn: "Chilli Thrips",
    scientificName: "Scirtothrips dorsalis",
    stageHi: "वानस्पतिक–फूल व फल",
    symptomHi: "सूक्ष्म पीले थ्रिप्स नई पत्तियों का रस चूसते हैं जिससे पत्तियाँ नाव की तरह ऊपर की ओर मुड़ जाती हैं (Upward boat-shaped curling) और डंठल भुरभुरे हो जाते हैं।",
    keywords: ["chilli_thrips", "thrips", "scirtothrips dorsalis", "मिर्च थ्रिप्स", "चाँदी पत्ती कीड़ा", "थ्रिप्स"],
    pairedSlugs: ["black_thrips"],
  },
  black_thrips: {
    problemSlug: "black_thrips",
    type: "pest",
    nameHi: "काला थ्रिप्स / फूल थ्रिप्स (Black Thrips)",
    nameEn: "Black Thrips",
    scientificName: "Thrips parvispinus",
    stageHi: "फूल आना–फल बनना",
    symptomHi: "गहरे काले-भूरे थ्रिप्स फूलों के अंदर भारी संख्या में घुसकर पराग और पंखुड़ियों को खुरचते हैं जिससे फूल सूखकर बड़े पैमाने पर झड़ जाते हैं।",
    keywords: ["black_thrips", "black thrips", "thrips parvispinus", "काला थ्रिप्स", "ब्लैक थ्रिप्स"],
    pairedSlugs: ["chilli_thrips"],
  },
  flower_thrips: {
    problemSlug: "flower_thrips",
    type: "pest",
    nameHi: "फूल का थ्रिप्स (Flower Thrips)",
    nameEn: "Flower Thrips",
    scientificName: "Megalurothrips distalis / Megalurothrips usitatus",
    stageHi: "कली–फूल आना",
    symptomHi: "दलहनी फसलों के फूलों के अंदर छोटे काले-भूरे थ्रिप्स रस चूसते हैं जिससे पंखुड़ियों पर भूरे निशान पड़ते हैं और फूल बिना फली बने गिर जाते हैं।",
    keywords: ["flower_thrips", "thrips", "megalurothrips", "फूल का थ्रिप्स", "थ्रिप्स"],
  },
  rust_thrips: {
    problemSlug: "rust_thrips",
    type: "pest",
    nameHi: "केले का रस्ट थ्रिप्स (Banana Rust Thrips)",
    nameEn: "Banana Rust Thrips",
    scientificName: "Chaetanaphothrips signipennis",
    stageHi: "गुच्छा व फल विकास",
    symptomHi: "आपस में सटे केले के फलों के छिलके पर जंग (Rust) जैसा लाल-भूरा खुरदरा दाग और बारीक दरारें पड़ जाती हैं।",
    keywords: ["rust_thrips", "thrips", "chaetanaphothrips", "रस्ट थ्रिप्स", "थ्रिप्स"],
  },
  brown_planthopper: {
    problemSlug: "brown_planthopper",
    type: "pest",
    nameHi: "भूरा फुदका / बीपीएच (Brown Planthopper - BPH)",
    nameEn: "Brown Planthopper (BPH)",
    scientificName: "Nilaparvata lugens",
    stageHi: "कल्ले–दूधिया दाना",
    symptomHi: "पानी की सतह के ठीक ऊपर धान के तनों के आधार पर भूरे फुदके झुंड में चिपककर रस चूसते हैं जिससे फसल गोलाकार पैच में जलकर सूख जाती है (Hopperburn)।",
    keywords: ["brown_planthopper", "bph", "brown planthopper", "brown plant hopper", "nilaparvata lugens", "भूरा फुदका"],
    pairedSlugs: ["white_backed_planthopper"],
  },
  white_backed_planthopper: {
    problemSlug: "white_backed_planthopper",
    type: "pest",
    nameHi: "सफेद पीठ फुदका (White-backed Planthopper - WBPH)",
    nameEn: "White-backed Planthopper",
    scientificName: "Sogatella furcifera",
    stageHi: "कल्ले–गाभा अवस्था",
    symptomHi: "पीठ पर स्पष्ट सफेद पट्टी वाले फुदके धान के निचले तनों से रस चूसते हैं जिससे पत्तियाँ नारंगी-पीली होकर सूखती हैं।",
    keywords: ["white_backed_planthopper", "wbph", "whitebacked planthopper", "white-backed planthopper", "sogatella furcifera", "सफेद पीठ फुदका"],
    pairedSlugs: ["brown_planthopper"],
  },
  hopper: {
    problemSlug: "hopper",
    type: "pest",
    nameHi: "आम का भुनगा / फुदका (Mango Hopper)",
    nameEn: "Mango Hopper",
    scientificName: "Idioscopus clypealis / Amritodus atkinsoni",
    stageHi: "बौर (फूल) निकलना–छोटे फल",
    symptomHi: "पच्चर के आकार के भूरे फुदके आम के बौर और नई कोपलों का रस चूसते हैं तथा मीठा चिपचिपा स्राव छोड़ते हैं जिस पर काली फफूंद जम जाती है।",
    keywords: ["hopper", "mango hopper", "idioscopus", "amritodus", "आम फुदका", "भुनगा", "मधुआ"],
  },
  pyrilla: {
    problemSlug: "pyrilla",
    type: "pest",
    nameHi: "गन्ने का पायरिला (Sugarcane Pyrilla)",
    nameEn: "Pyrilla Leafhopper",
    scientificName: "Pyrilla perpusilla",
    stageHi: "वानस्पतिक–मानसून",
    symptomHi: "लंबे थूथन वाले भूरे वयस्क और सफेद पूंछ-गुच्छे वाले शिशु पत्ती के नीचे रस चूसते हैं और शहद जैसा चिपचिपा पदार्थ व काली फफूंद फैलाते हैं।",
    keywords: ["pyrilla", "pyrilla perpusilla", "पायरिला", "गन्ना पत्ता चूसक"],
  },
  mealybug: {
    problemSlug: "mealybug",
    type: "pest",
    nameHi: "मिलीबग / दहिया कीट (Mealybug)",
    nameEn: "Mealybug",
    scientificName: "Phenacoccus solenopsis / Maconellicoccus hirsutus",
    stageHi: "वानस्पतिक–फल/टिंडा विकास",
    symptomHi: "तनों, कोपलों और फलों के गुच्छों पर सफेद मोमी रुई जैसे कीट चिपके रहते हैं जो रस चूसकर चिपचिपा पदार्थ छोड़ते हैं और चींटियों को आकर्षित करते हैं।",
    keywords: ["mealybug", "mealy-bug", "phenacoccus solenopsis", "maconellicoccus hirsutus", "drosicha", "मिलीबग", "रूई जैसा कीड़ा"],
  },
  gundhi_bug: {
    problemSlug: "gundhi_bug",
    type: "pest",
    nameHi: "गंधी बग (Rice Earhead / Gundhi Bug)",
    nameEn: "Gundhi Bug",
    scientificName: "Leptocorisa acuta",
    stageHi: "दूधिया दाना अवस्था",
    symptomHi: "लंबी टांगों वाला हरा-भूरा बदबूदार कीट दूधिया अवस्था में धान के दानों का रस चूस लेता है जिससे दानों पर भूरा निशान पड़ता है और दाने खाली (पोंगा) रह जाते हैं।",
    keywords: ["gundhi_bug", "gundhi-bug", "gundhi bug", "leptocorisa acuta", "leptocorisa oratorius", "leptocorisa", "earhead bug", "गंधी बग"],
  },
  painted_bug: {
    problemSlug: "painted_bug",
    type: "pest",
    nameHi: "पेंटेड बग / चितकबरा कीड़ा (Painted Bug)",
    nameEn: "Painted Bug",
    scientificName: "Bagrada hilaris",
    stageHi: "अंकुर व फली पकने की अवस्था",
    symptomHi: "काले शरीर पर लाल-नारंगी व पीले धब्बों वाले चपटे बग पत्तियों व फलियों से रस चूसते हैं जिससे पौधे पर सफेद धब्बे पड़कर वह मुरझा जाता है।",
    keywords: ["painted_bug", "painted-bug", "painted bug", "bagrada hilaris", "पेंटेड बग", "रंगीन बग", "फलिया का रंगीन कीड़ा"],
  },
  red_spider_mite: {
    problemSlug: "red_spider_mite",
    type: "pest",
    nameHi: "लाल मकड़ी माइट (Red Spider Mite)",
    nameEn: "Red Spider Mite",
    scientificName: "Tetranychus urticae",
    stageHi: "गर्म व सूखा मौसम",
    symptomHi: "पत्ती की निचली सतह पर सूक्ष्म लाल मकड़ियाँ बारीक रेशमी जाला बुनती हैं और रस चूसती हैं जिससे पत्ती पर पीले-सफेद सूक्ष्म बिंदु व तांबे जैसा रंग दिखता है।",
    keywords: ["red_spider_mite", "spider mite", "tetranychus urticae", "tetranychus", "लाल मकड़ी", "रेड स्पाइडर माइट", "माइट"],
  },
  broad_mite: {
    problemSlug: "broad_mite",
    type: "pest",
    nameHi: "पीला माइट / ब्रॉड माइट (Broad / Yellow Mite)",
    nameEn: "Broad Mite (Yellow Mite)",
    scientificName: "Polyphagotarsonemus latus",
    stageHi: "वानस्पतिक–फूल आना",
    symptomHi: "शीर्ष की नई पत्तियाँ नीचे की ओर उल्टी नाव की तरह मुड़ जाती हैं (Downward curling), निचली सतह तांबे जैसी चमकदार हो जाती है और डंठल लंबे हो जाते हैं।",
    keywords: ["broad_mite", "yellow-mite", "yellow mite", "mite", "polyphagotarsonemus latus", "पीला माइट", "ब्रॉड माइट", "पीला मकड़ी कीड़ा", "माइट"],
  },
  leaf_miner: {
    problemSlug: "leaf_miner",
    type: "pest",
    nameHi: "लीफ माइनर / पत्ती सुरंगक (Serpentine Leaf Miner)",
    nameEn: "Leaf Miner",
    scientificName: "Liriomyza trifolii / Liriomyza huidobrensis",
    stageHi: "वानस्पतिक अवस्था",
    symptomHi: "पत्तियों की ऊपरी सतह पर साँप जैसी टेढ़ी-मेढ़ी सफेद-चाँदी के रंग की सुरंगें (Serpentine mines) बनती हैं जिनके अंदर सूक्ष्म पीला लार्वा रहता है।",
    keywords: ["leaf_miner", "leaf-miner", "leaf miner", "liriomyza", "पत्ती खनक", "लीफ माइनर", "पत्ती सुरंगक"],
  },
  tuta_absoluta: {
    problemSlug: "tuta_absoluta",
    type: "pest",
    nameHi: "टूटा एब्सोल्यूटा / पिनवर्म (Tomato Pinworm)",
    nameEn: "Tomato Pinworm (Tuta absoluta)",
    scientificName: "Tuta absoluta",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "पत्तियों में चौड़े कागजी पारदर्शी छाले (Blotch mines) बनते हैं जिनमें काला मल दिखता है और फलों के डंठल के पास बारीक पिन जैसे छेद हो जाते हैं।",
    keywords: ["tuta_absoluta", "tuta-absoluta", "tuta absoluta", "pinworm", "पिनवर्म", "टूटा एब्सोल्यूटा"],
  },
  fruit_borer: {
    problemSlug: "fruit_borer",
    type: "pest",
    nameHi: "फल छेदक सुंडी (Fruit Borer - Helicoverpa)",
    nameEn: "Fruit Borer (Helicoverpa)",
    scientificName: "Helicoverpa armigera",
    stageHi: "फूल–फल विकास",
    symptomHi: "हरी-भूरी धारीदार सुंडी अपना आधा शरीर फल के अंदर घुसाकर गूदा खाती है और पिछला हिस्सा बाहर रहता है; फल में गोल छेद व मल दिखता है।",
    keywords: ["fruit_borer", "fruit-borer", "fruit borer", "helicoverpa armigera", "फल छेदक"],
  },
  helicoverpa_fruit_borer: {
    problemSlug: "helicoverpa_fruit_borer",
    type: "pest",
    nameHi: "फल छेदक सुंडी (Helicoverpa Fruit Borer)",
    nameEn: "Helicoverpa Fruit Borer",
    scientificName: "Helicoverpa armigera",
    stageHi: "फूल–फल विकास",
    symptomHi: "सुंडी फल के आधार के पास साफ गोल छेद बनाकर आधा शरीर अंदर घुसाकर बीज व गूदा खाती है।",
    keywords: ["helicoverpa_fruit_borer", "fruit-borer", "fruit borer", "helicoverpa armigera", "फल छेदक"],
    pairedSlugs: ["spodoptera_fruit_borer"],
  },
  spodoptera_fruit_borer: {
    problemSlug: "spodoptera_fruit_borer",
    type: "pest",
    nameHi: "स्पोडोप्टेरा फल व पत्ती छेदक (Spodoptera Caterpillars)",
    nameEn: "Spodoptera Fruit Borer",
    scientificName: "Spodoptera litura / Spodoptera exigua",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "गहरे भूरे रंग की मखमली धब्बेदार इल्ली पत्तियों और फलों में अनियमित बड़े छेद करके उन्हें खोखला कर देती है।",
    keywords: ["spodoptera_fruit_borer", "spodoptera", "spodoptera litura", "spodoptera exigua", "स्पोडोप्टेरा", "तंबाकू इल्ली"],
    pairedSlugs: ["helicoverpa_fruit_borer"],
  },
  helicoverpa_pod_borer: {
    problemSlug: "helicoverpa_pod_borer",
    type: "pest",
    nameHi: "फली छेदक सुंडी (Gram Pod Borer - Helicoverpa)",
    nameEn: "Helicoverpa Pod Borer",
    scientificName: "Helicoverpa armigera",
    stageHi: "फूल–फली भरना",
    symptomHi: "सुंडी फली में गोल छेद बनाकर सिर अंदर डालकर दाने खाती है और आधा शरीर फली के बाहर दिखाई देता है।",
    keywords: ["helicoverpa_pod_borer", "pod-borer", "pod borer", "helicoverpa armigera", "फली छेदक", "चना फली छेदक", "घेंटी छेदक"],
    pairedSlugs: ["maruca_pod_borer"],
  },
  maruca_pod_borer: {
    problemSlug: "maruca_pod_borer",
    type: "pest",
    nameHi: "चित्तीदार फली छेदक / मारुका (Maruca Spotted Pod Borer)",
    nameEn: "Maruca Pod Borer",
    scientificName: "Maruca vitrata",
    stageHi: "कली–फूल व फली बनना",
    symptomHi: "हल्के क्रीम रंग की काले बिंदुओं वाली इल्ली फूलों, कलियों और फलियों को रेशमी जाले से आपस में बाँधकर अंदर ही अंदर खाती है।",
    keywords: ["maruca_pod_borer", "maruca", "spotted pod borer", "maruca vitrata", "मारुका", "चित्तीदार फली छेदक"],
    pairedSlugs: ["helicoverpa_pod_borer"],
  },
  shoot_and_fruit_borer: {
    problemSlug: "shoot_and_fruit_borer",
    type: "pest",
    nameHi: "तना एवं फल छेदक (Shoot and Fruit Borer)",
    nameEn: "Shoot & Fruit Borer",
    scientificName: "Leucinodes orbonalis / Earias vittella",
    stageHi: "वानस्पतिक–फलन अवस्था",
    symptomHi: "शुरुआती अवस्था में नई कोपल (शूट) छेद होने से मुरझाकर लटक जाती है और बाद में फलों के अंदर गुलाबी/चित्तीदार सुंडी सुरंग बनाकर मल भर देती है।",
    keywords: ["shoot_and_fruit_borer", "shoot-borer", "fruit-borer", "shoot & fruit borer", "shoot and fruit borer", "leucinodes orbonalis", "earias vittella", "earias", "तना / फल छेदक", "तना और फल छेदक", "फल छेदक"],
  },
  shoot_borer: {
    problemSlug: "shoot_borer",
    type: "pest",
    nameHi: "प्ररोह / तना छेदक (Shoot Borer)",
    nameEn: "Shoot Borer",
    scientificName: "Conogethes punctiferalis",
    stageHi: "वानस्पतिक अवस्था",
    symptomHi: "आभासी तने (Pseudostem) पर छेद से बुरादा/मल बाहर निकलता है और बीच की मुख्य गोभ पीली पड़कर सूख जाती है (Deadheart)।",
    keywords: ["shoot_borer", "shoot-borer", "shoot borer", "conogethes punctiferalis", "प्ररोह छेदक", "तना छेदक"],
  },
  stem_borer: {
    problemSlug: "stem_borer",
    type: "pest",
    nameHi: "पीला तना छेदक (Yellow Stem Borer)",
    nameEn: "Yellow Stem Borer",
    scientificName: "Scirpophaga incertulas",
    stageHi: "कल्ले फूटना–बाली निकलना",
    symptomHi: "सुंडी तने के अंदर से काट देती है जिससे कल्ले अवस्था में बीच की गोभ सूख जाती है (Deadheart) और बाली अवस्था में सफेद खाली बाली (White ear) निकलती है।",
    keywords: ["stem_borer", "stem-borer", "stem borer", "yellow stem borer", "scirpophaga incertulas", "तना छेदक", "पीला तना छेदक"],
  },
  early_shoot_borer: {
    problemSlug: "early_shoot_borer",
    type: "pest",
    nameHi: "अगेती प्ररोह छेदक / कंसुआ (Early Shoot Borer)",
    nameEn: "Early Shoot Borer",
    scientificName: "Chilo infuscatellus",
    stageHi: "अंकुरण–कल्ले (0–90 दिन)",
    symptomHi: "युवा गन्ने के तने के आधार में छेद होने से बीच की गोभ सूख जाती है (Deadheart) जो खींचने पर बदबू के साथ आसानी से बाहर निकल आती है।",
    keywords: ["early_shoot_borer", "early-shoot-borer", "early shoot borer", "chilo infuscatellus", "अगेती प्ररोह छेदक", "शुरुआती अंकुर छेदक", "कंसुआ"],
    pairedSlugs: ["top_borer"],
  },
  top_borer: {
    problemSlug: "top_borer",
    type: "pest",
    nameHi: "शीर्ष छेदक / चोटी बींधक (Top Borer)",
    nameEn: "Top Shoot Borer",
    scientificName: "Scirpophaga excerptalis",
    stageHi: "वानस्पतिक–बढ़वार अवस्था",
    symptomHi: "पत्ती की मध्य शिरा में लाल सुरंग, खुलती पत्तियों पर आड़े छर्रे जैसे छेद (Shot-holes) और शीर्ष से नीचे कई कल्ले निकलकर गुच्छा (Bunchy top) बन जाता है।",
    keywords: ["top_borer", "top-borer", "top borer", "scirpophaga excerptalis", "शीर्ष छेदक", "ऊपरी छेदक", "चोटी बींधक"],
    pairedSlugs: ["early_shoot_borer"],
  },
  pink_stem_borer: {
    problemSlug: "pink_stem_borer",
    type: "pest",
    nameHi: "गुलाबी तना छेदक (Pink Stem Borer)",
    nameEn: "Pink Stem Borer",
    scientificName: "Sesamia inferens / Chilo partellus",
    stageHi: "अंकुर–वानस्पतिक अवस्था",
    symptomHi: "गुलाबी रंग की चिकनी सुंडी तने के निचले भाग में सुरंग बनाती है जिससे मध्य गोभ सूखकर डेडहार्ट बन जाता है और पत्ती पर कतार में छेद दिखते हैं।",
    keywords: ["pink_stem_borer", "pink stem borer", "stem-borer", "stem borer", "sesamia inferens", "chilo partellus", "गुलाबी तना छेदक", "तना छेदक"],
  },
  pink_bollworm: {
    problemSlug: "pink_bollworm",
    type: "pest",
    nameHi: "गुलाबी सुंडी (Pink Bollworm)",
    nameEn: "Pink Bollworm",
    scientificName: "Pectinophora gossypiella",
    stageHi: "फूल–टिंडा विकास",
    symptomHi: "फूल की पंखुड़ियाँ आपस में जुड़कर गुलाब जैसी (Rosetted flower) हो जाती हैं और हरे टिंडों के अंदर गुलाबी इल्ली बिनौले व रुई को खाकर बर्बाद कर देती है।",
    keywords: ["pink_bollworm", "pink-bollworm", "pink bollworm", "pectinophora gossypiella", "गुलाबी सुंडी", "गुलाबी रुई इल्ली"],
  },
  fall_armyworm: {
    problemSlug: "fall_armyworm",
    type: "pest",
    nameHi: "फॉल आर्मीवर्म (Fall Armyworm - FAW)",
    nameEn: "Fall Armyworm",
    scientificName: "Spodoptera frugiperda",
    stageHi: "अंकुर–गाभा (Whorl) व भुट्टा",
    symptomHi: "मक्का की गोभ (Whorl) में बड़े फटे हुए छेद और लकड़ी के बुरादे जैसा गीला मल भरा रहता है; इल्ली के पिछले सिरे पर चौकोर काले चार बिंदु होते हैं।",
    keywords: ["fall_armyworm", "fall-army", "fall armyworm", "spodoptera frugiperda", "फॉल आर्मीवर्म", "फॉल आर्मीवॉर्म"],
  },
  leaf_folder: {
    problemSlug: "leaf_folder",
    type: "pest",
    nameHi: "पत्ती मोड़क / लीफ फोल्डर (Rice Leaf Folder)",
    nameEn: "Leaf Folder",
    scientificName: "Cnaphalocrocis medinalis",
    stageHi: "कल्ले–बाली आरंभ",
    symptomHi: "हरी इल्ली धान की पत्ती के दोनों किनारों को रेशमी धागे से मोड़कर नली बना लेती है और अंदर से हरा भाग खुरचकर सफेद पारदर्शी धारियाँ बना देती है।",
    keywords: ["leaf_folder", "leaf-folder", "leaf folder", "cnaphalocrocis medinalis", "पत्ती मोड़क", "लीफ फोल्डर"],
  },
  tobacco_caterpillar: {
    problemSlug: "tobacco_caterpillar",
    type: "pest",
    nameHi: "तंबाकू की इल्ली / स्पोडोप्टेरा (Tobacco Caterpillar)",
    nameEn: "Tobacco Caterpillar",
    scientificName: "Spodoptera litura",
    stageHi: "वानस्पतिक–फली/हेड अवस्था",
    symptomHi: "भूरे रंग की काले तिकोने धब्बों वाली इल्लियाँ झुंड में रहकर पत्तियों को खुरचकर जालीदार कर देती हैं और बाद में पूरी पत्तियाँ खा जाती हैं।",
    keywords: ["tobacco_caterpillar", "tobacco-caterpillar", "tobacco caterpillar", "spodoptera litura", "तंबाकू की इल्ली", "पत्ती कुतरने वाली इल्ली", "स्पोडोप्टेरा"],
  },
  green_semilooper: {
    problemSlug: "green_semilooper",
    type: "pest",
    nameHi: "हरी सेमीलूपर इल्ली (Green Semilooper)",
    nameEn: "Green Semilooper",
    scientificName: "Chrysodeixis acuta / Thysanoplusia orichalcea",
    stageHi: "वानस्पतिक–फूल व फली",
    symptomHi: "चमकीले हरे रंग की इल्ली चलते समय पीठ को कमान/कुंडली (Loop) की तरह उठाकर चलती है और पत्तियों में बड़े छेद कर देती है।",
    keywords: ["green_semilooper", "semilooper", "chrysodeixis acuta", "thysanoplusia", "सेमीलूपर", "अर्ध-लूपर"],
  },
  hairy_caterpillar: {
    problemSlug: "hairy_caterpillar",
    type: "pest",
    nameHi: "कातरे / लाल रोएंदार सुंडी (Red Hairy Caterpillar)",
    nameEn: "Red Hairy Caterpillar",
    scientificName: "Amsacta albistriga / Spilosoma obliqua",
    stageHi: "मानसून–वानस्पतिक अवस्था",
    symptomHi: "पूरे शरीर पर घने लाल-भूरे बालों वाली सुंडियाँ खेत में तेजी से चलते हुए पत्तियों को पूरी तरह चट कर केवल डंठल छोड़ती हैं।",
    keywords: ["hairy_caterpillar", "red hairy caterpillar", "amsacta", "spilosoma", "कातरे", "रोएंदार इल्ली", "लाल रोएंदार सुंडी"],
  },
  diamondback_moth: {
    problemSlug: "diamondback_moth",
    type: "pest",
    nameHi: "हीरक पृष्ठ पतंगा / डीबीएम (Diamondback Moth)",
    nameEn: "Diamondback Moth (DBM)",
    scientificName: "Plutella xylostella",
    stageHi: "वानस्पतिक–फूल/हेड बनना",
    symptomHi: "छोटी हल्की हरी सुंडियाँ पत्ती की निचली सतह से हरा भाग खाकर पारदर्शी खिड़की जैसे धब्बे और अनगिनत छेद बना देती हैं।",
    keywords: ["diamondback_moth", "diamondback", "diamondback moth", "plutella xylostella", "हीरा पीठ इल्ली", "डीबीएम", "हीरक पृष्ठ पतंगा"],
  },
  cabbage_butterfly: {
    problemSlug: "cabbage_butterfly",
    type: "pest",
    nameHi: "गोभी तितली की सुंडी (Cabbage Butterfly Caterpillar)",
    nameEn: "Cabbage Butterfly",
    scientificName: "Pieris brassicae",
    stageHi: "वानस्पतिक–हेड अवस्था",
    symptomHi: "पीली धारी व काले बिंदुओं वाली मखमली हरी सुंडियाँ बाहरी पत्तियों को किनारों से तेजी से खाकर केवल मोटी नसें छोड़ती हैं।",
    keywords: ["cabbage_butterfly", "cabbage-butterfly", "cabbage butterfly", "pieris brassicae", "गोभी तितली", "कैबेज बटरफ्लाई"],
  },
  cutworm: {
    problemSlug: "cutworm",
    type: "pest",
    nameHi: "कटवर्म / तना काटने वाली सुंडी (Cutworm)",
    nameEn: "Cutworm",
    scientificName: "Agrotis ipsilon",
    stageHi: "अंकुर–कंद विकास",
    symptomHi: "मटमैली भूरी-काली सुंडी दिन में मिट्टी में 'C' आकार में मुड़कर छिपी रहती है और रात में नन्हें पौधों को जमीन की सतह से काटकर गिरा देती है।",
    keywords: ["cutworm", "cut-worm", "cut worm", "agrotis ipsilon", "agrotis", "कटवर्म", "तना काटने वाला कीड़ा", "कुतरने वाली सुंडी"],
  },
  sawfly: {
    problemSlug: "sawfly",
    type: "pest",
    nameHi: "सरसों की आरी मक्खी (Mustard Sawfly)",
    nameEn: "Mustard Sawfly",
    scientificName: "Athalia proxima",
    stageHi: "अंकुर–वानस्पतिक (15–35 दिन)",
    symptomHi: "काले-हरे रंग की लार्वा पत्तियों के किनारों से बीच की तरफ छेद करते हुए खाती है और छूने पर गोल कुंडली मारकर जमीन पर गिर जाती है।",
    keywords: ["sawfly", "mustard sawfly", "athalia proxima", "आरी मक्खी", "पत्ती कुतरने वाली मक्खी", "सॉफ्लाई"],
  },
  shoot_fly: {
    problemSlug: "shoot_fly",
    type: "pest",
    nameHi: "अंकुर मक्खी / शूट फ्लाई (Shoot Fly)",
    nameEn: "Shoot Fly",
    scientificName: "Atherigona soccata / Atherigona approximata",
    stageHi: "अंकुर अवस्था (7–28 दिन)",
    symptomHi: "छोटा सफेद मैगॉट पौधे के आधार में घुसकर मुख्य कोंपल को काट देता है जिससे बीच की पत्ती सूखकर डेडहार्ट (Deadheart) बन जाती है।",
    keywords: ["shoot_fly", "shoot-fly", "shoot fly", "atherigona soccata", "atherigona approximata", "atherigona", "अंकुर मक्खी", "शूट फ्लाई"],
  },
  stem_fly: {
    problemSlug: "stem_fly",
    type: "pest",
    nameHi: "तना मक्खी / स्टैम फ्लाई (Soybean Stem Fly)",
    nameEn: "Stem Fly",
    scientificName: "Melanagromyza sojae",
    stageHi: "अंकुर–वानस्पतिक अवस्था",
    symptomHi: "तने को चीरने पर अंदर लाल-भूरे रंग की सुरंग और सूक्ष्म पीला-सफेद मैगॉट या प्यूपा दिखता है तथा ऊपरी पत्तियाँ सूखने लगती हैं।",
    keywords: ["stem_fly", "stem-fly", "stem fly", "melanagromyza sojae", "तना मक्खी", "स्टैम फ्लाई"],
  },
  fruit_fly: {
    problemSlug: "fruit_fly",
    type: "pest",
    nameHi: "फल मक्खी (Fruit Fly)",
    nameEn: "Fruit Fly",
    scientificName: "Bactrocera cucurbitae / Bactrocera dorsalis",
    stageHi: "फल बनना–पकना",
    symptomHi: "मादा मक्खी फल के छिलके में डंक मारकर अंडे देती है जहाँ से भूरा गोंद निकलता है और अंदर सफेद मैगॉट गूदे को सड़ा देते हैं।",
    keywords: ["fruit_fly", "fruit-fly", "fruit fly", "bactrocera cucurbitae", "bactrocera dorsalis", "bactrocera", "फल मक्खी"],
  },
  girdle_beetle: {
    problemSlug: "girdle_beetle",
    type: "pest",
    nameHi: "गर्डल बीटल / चक्र भृंग (Girdle Beetle)",
    nameEn: "Girdle Beetle",
    scientificName: "Oberea brevis",
    stageHi: "वानस्पतिक–फूल आना",
    symptomHi: "मादा भृंग तने या पत्ती के डंठल पर थोड़ी दूरी पर दो समानांतर गोल छल्ले (Girdles) काट देती है जिससे उसके ऊपर का हिस्सा मुरझाकर लटक जाता है।",
    keywords: ["girdle_beetle", "girdle-beetle", "girdle beetle", "oberea brevis", "गर्डल बीटल", "कमर बंद भृंग", "चक्र भृंग"],
  },
  red_pumpkin_beetle: {
    problemSlug: "red_pumpkin_beetle",
    type: "pest",
    nameHi: "लाल कद्दू भृंग (Red Pumpkin Beetle)",
    nameEn: "Red Pumpkin Beetle",
    scientificName: "Aulacophora foveicollis",
    stageHi: "अंकुर–2 से 6 पत्ती अवस्था",
    symptomHi: "चमकदार नारंगी-लाल भृंग नन्हें पौधों की बीजपत्र और नई पत्तियों में बड़े गोल-अनियमित छेद करके उन्हें छलनी कर देते हैं।",
    keywords: ["red_pumpkin_beetle", "red-pumpkin-beetle", "red pumpkin beetle", "aulacophora foveicollis", "लाल कद्दू भृंग", "लाल भृंग"],
  },
  hadda_beetle: {
    problemSlug: "hadda_beetle",
    type: "pest",
    nameHi: "हड्डा बीटल / कुतरने वाला भृंग (Epilachna / Hadda Beetle)",
    nameEn: "Hadda Beetle (Epilachna)",
    scientificName: "Henosepilachna vigintioctopunctata",
    stageHi: "वानस्पतिक अवस्था",
    symptomHi: "काले धब्बों वाला तांबई गोल भृंग और पीले काँटेदार ग्रब पत्तियों के हरे भाग को समानांतर रेखाओं में खुरचकर पत्ती को कागज की जाली जैसा बना देते हैं।",
    keywords: ["hadda_beetle", "epilachna", "hadda beetle", "henosepilachna", "हड्डा बीटल", "कुतरने वाला भृंग", "हैड्डा"],
  },
  scarring_beetle: {
    problemSlug: "scarring_beetle",
    type: "pest",
    nameHi: "केले का फल खुरचने वाला भृंग (Banana Scarring Beetle)",
    nameEn: "Banana Scarring Beetle",
    scientificName: "Basilepta subcostatum (Nodeostoma subcostatum)",
    stageHi: "नई पत्ती व गुच्छा निकलना",
    symptomHi: "छोटा तांबई-भूरा भृंग नए निकलते केले के गुच्छे और कोमल छिलके को खुरचकर खाता है जिससे फलों पर काले-भूरे खुरदरे निशान (Scars) पड़ जाते हैं।",
    keywords: ["scarring_beetle", "scarring beetle", "basilepta", "nodeostoma", "स्केरिंग बीटल", "फल खुरचने वाला भृंग"],
  },
  white_grub: {
    problemSlug: "white_grub",
    type: "pest",
    nameHi: "सफेद लट / सफेद गिडार (White Grub)",
    nameEn: "White Grub",
    scientificName: "Holotrichia consanguinea / Holotrichia serrata",
    stageHi: "मानसून–जड़ व कंद अवस्था",
    symptomHi: "भूरे सिर वाली मोटी सफेद लट मिट्टी में 'C' आकार में मुड़ी रहती है और पौधे की जड़ों को काटकर खा जाती है जिससे पौधे कतार में सूखकर आसानी से उखड़ जाते हैं।",
    keywords: ["white_grub", "white-grub", "white grub", "holotrichia consanguinea", "holotrichia serrata", "holotrichia", "सफेद लट", "सफेद गिडार", "सफेद ग्रब"],
  },
  termite: {
    problemSlug: "termite",
    type: "pest",
    nameHi: "दीमक (Termite)",
    nameEn: "Termite",
    scientificName: "Odontotermes obesus",
    stageHi: "बुवाई–अंकुरण व सूखी अवस्था",
    symptomHi: "पीले-सफेद मजदूर दीमक जड़ और तने के आधार को अंदर से खोखला कर अंदर गीली मिट्टी की सुरंग भर देते हैं और पौधा सूखकर गिर जाता है।",
    keywords: ["termite", "termites", "odontotermes obesus", "odontotermes", "दीमक"],
  },
};

export function getCropIdentificationFolder(cropSlug?: string): string | undefined {
  if (!cropSlug) return undefined;
  const clean = cropSlug.trim().toLowerCase();
  return CROP_SLUG_TO_ID_FOLDER[clean];
}

export function buildCropIdImageUrl(folder: string, problemSlug: string): string {
  return `/images/crop-identification/${folder}/${problemSlug}.webp`;
}

/**
 * Matches a free-text query (e.g. problemId + name + nameHi + scientificName/pathogen)
 * against the available problem slugs for a specific crop folder.
 */
export function matchProblemSlugForFolder(
  folder: string,
  query: string
): string | undefined {
  const available = FOLDER_PROBLEMS[folder];
  if (!available?.length || !query) return undefined;

  const qLower = query.toLowerCase().trim();
  const qNorm = qLower.replace(/[-\s]+/g, "_");

  // 1. Direct exact slug match
  for (const slug of available) {
    if (qNorm === slug || qLower === slug) return slug;
  }

  // 2. Special disambiguation for paired problems in the same crop folder
  if (available.includes("neck_blast") && available.includes("leaf_blast")) {
    if (/neck|गर्दन|तोड़/i.test(qLower)) return "neck_blast";
    if (/blast|magnaporthe|pyricularia|ब्लास्ट|झुलसा/i.test(qLower)) return "leaf_blast";
  }
  if (available.includes("black_thrips") && available.includes("chilli_thrips")) {
    if (/black|parvispinus|काला|फूल/i.test(qLower)) return "black_thrips";
    if (/thrips|scirtothrips|थ्रिप्स|चाँदी/i.test(qLower)) return "chilli_thrips";
  }
  if (available.includes("spodoptera_fruit_borer") && available.includes("helicoverpa_fruit_borer")) {
    if (/spodoptera|litura|exigua|स्पोडोप्टेरा|तंबाकू/i.test(qLower)) return "spodoptera_fruit_borer";
    if (/helicoverpa|fruit[-_\s]*borer|फल\s*छेदक/i.test(qLower)) return "helicoverpa_fruit_borer";
  }
  if (available.includes("maruca_pod_borer") && available.includes("helicoverpa_pod_borer")) {
    if (/maruca|vitrata|spotted|मारुका|चित्तीदार/i.test(qLower)) return "maruca_pod_borer";
    if (/helicoverpa|pod[-_\s]*borer|फली\s*छेदक|घेंटी/i.test(qLower)) return "helicoverpa_pod_borer";
  }
  if (available.includes("root_aphid") && available.includes("earhead_aphid")) {
    if (/root|rufiabdominale|जड़/i.test(qLower)) return "root_aphid";
    if (/aphid|sitobion|माहू|एफिड|चेपा/i.test(qLower)) return "earhead_aphid";
  }
  if (available.includes("stem_canker") && available.includes("black_scurf")) {
    if (/canker|कैंकर/i.test(qLower)) return "stem_canker";
    if (/scurf|rhizoctonia|काला\s*कवच|काली\s*पपड़ी/i.test(qLower)) return "black_scurf";
  }
  if (available.includes("enation_leaf_curl") && available.includes("yellow_vein_mosaic")) {
    if (/enation|oelcv|curl|मोड़|कर्ल/i.test(qLower)) return "enation_leaf_curl";
    if (/mosaic|yvmv|ymv|vein|पीत\s*शिरा|पीली\s*नस/i.test(qLower)) return "yellow_vein_mosaic";
  }
  if (available.includes("stem_rot") && available.includes("collar_rot")) {
    if (/stem[-_\s]*rot|sclerotium|तना\s*सड़न|स्टैम\s*रॉट/i.test(qLower)) return "stem_rot";
    if (/collar|aspergillus|phytophthora|कॉलर|आधार/i.test(qLower)) return "collar_rot";
  }
  if (available.includes("dieback") && available.includes("anthracnose")) {
    if (/die[-_\s]*back|gloeosporioides|सूखना|डाइबैक|टहनी/i.test(qLower) && !/anthracnose|एन्थ्रेक्नोज|एंथ्रेक्नोज/i.test(qLower)) {
      return "dieback";
    }
  }

  // 3. Score each available problem in the crop's folder
  let bestSlug: string | undefined;
  let bestScore = 0;

  for (const slug of available) {
    const meta = PROBLEM_META[slug];
    if (!meta) continue;
    let score = 0;

    if (qNorm.includes(slug)) {
      score += 80 + slug.length;
    }

    for (const kw of meta.keywords) {
      const kwLow = kw.toLowerCase();
      if (qLower.includes(kwLow)) {
        score += 25 + kwLow.length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestSlug = slug;
    }
  }

  return bestScore > 0 ? bestSlug : undefined;
}

/**
 * Resolves the exact crop-specific WebP identification image for `(cropSlug, query)`.
 * Returns `undefined` if no crop-specific WebP matches for that crop.
 */
export function getCropIdentificationImage(
  cropSlug: string | undefined,
  query: string
): string | undefined {
  const folder = getCropIdentificationFolder(cropSlug);
  if (!folder) return undefined;
  const matched = matchProblemSlugForFolder(folder, query);
  if (!matched) return undefined;
  return buildCropIdImageUrl(folder, matched);
}

/**
 * Extracts folder and problemSlug from `/images/crop-identification/<folder>/<slug>.webp`
 * and returns the problem metadata + paired gallery photos.
 */
export function getCropIdentificationFromUrl(url?: string): {
  folder: string;
  problemSlug: string;
  meta?: CropIdentificationProblemMeta;
  gallery: { src: string; badgeHi: string; badgeEn: string; captionHi: string; captionEn: string }[];
} | null {
  if (!url) return null;
  const m = url.match(/\/images\/crop-identification\/([^/]+)\/([^/.]+)\.webp/i);
  if (!m?.[1] || !m[2]) return null;
  const folder = m[1];
  const problemSlug = m[2];
  const meta = PROBLEM_META[problemSlug];
  const available = FOLDER_PROBLEMS[folder] || [];

  const gallery: {
    src: string;
    badgeHi: string;
    badgeEn: string;
    captionHi: string;
    captionEn: string;
  }[] = [
    {
      src: buildCropIdImageUrl(folder, problemSlug),
      badgeHi: meta ? meta.nameHi.replace(/\s*\([^)]+\)\s*$/, "") : "मुख्य पहचान",
      badgeEn: meta ? meta.nameEn : "Primary symptom",
      captionHi: meta
        ? `${meta.nameHi} — ${meta.symptomHi}`
        : "फसल पर मुख्य लक्षण और कीट/रोग की पहचान",
      captionEn: meta
        ? `${meta.nameEn} (${meta.scientificName})`
        : "Primary crop-specific field symptom",
    },
  ];

  if (meta?.pairedSlugs?.length) {
    for (const sib of meta.pairedSlugs) {
      if (available.includes(sib) && sib !== problemSlug) {
        const sibMeta = PROBLEM_META[sib];
        gallery.push({
          src: buildCropIdImageUrl(folder, sib),
          badgeHi: sibMeta ? sibMeta.nameHi.replace(/\s*\([^)]+\)\s*$/, "") : "संबंधित लक्षण",
          badgeEn: sibMeta ? sibMeta.nameEn : "Related stage",
          captionHi: sibMeta
            ? `${sibMeta.nameHi} — ${sibMeta.symptomHi}`
            : "संबंधित अवस्था एवं लक्षण",
          captionEn: sibMeta
            ? `${sibMeta.nameEn} (${sibMeta.scientificName})`
            : "Related stage & field symptom",
        });
      }
    }
  }

  return { folder, problemSlug, meta, gallery };
}

/**
 * Resolves a multi-photo identification gallery for `(cropSlug, query)`.
 * Includes the primary crop-specific WebP image first, followed by any paired
 * sibling WebP image from the same crop folder (e.g., Leaf Blast + Neck Blast on Paddy,
 * Chilli Thrips + Black Thrips on Chilli, Earhead Aphid + Root Aphid on Wheat).
 */
export function getCropIdentificationGallery(
  cropSlug: string | undefined,
  query: string
): { src: string; captionHi: string; captionEn: string }[] {
  const folder = getCropIdentificationFolder(cropSlug);
  if (!folder) return [];

  const matched = matchProblemSlugForFolder(folder, query);
  if (!matched) return [];

  const available = FOLDER_PROBLEMS[folder] || [];
  const meta = PROBLEM_META[matched];
  const out: { src: string; captionHi: string; captionEn: string }[] = [
    {
      src: buildCropIdImageUrl(folder, matched),
      captionHi: meta
        ? `${meta.nameHi} — ${meta.symptomHi}`
        : "फसल पर मुख्य लक्षण और कीट/रोग की पहचान",
      captionEn: meta
        ? `${meta.nameEn} (${meta.scientificName}) — Field identification`
        : "Primary crop-specific symptom identification",
    },
  ];

  if (meta?.pairedSlugs?.length) {
    for (const sib of meta.pairedSlugs) {
      if (available.includes(sib) && sib !== matched) {
        const sibMeta = PROBLEM_META[sib];
        out.push({
          src: buildCropIdImageUrl(folder, sib),
          captionHi: sibMeta
            ? `${sibMeta.nameHi} — ${sibMeta.symptomHi}`
            : "संबंधित अवस्था एवं लक्षण",
          captionEn: sibMeta
            ? `${sibMeta.nameEn} (${sibMeta.scientificName})`
            : "Related stage & field symptom",
        });
      }
    }
  }

  return out;
}

/**
 * Returns all crop-specific problem items (with their `.webp` image URLs) for a crop slug.
 */
export function getAllCropIdentificationProblems(
  cropSlug: string
): (CropIdentificationProblemMeta & { imageUrl: string; folder: string })[] {
  const folder = getCropIdentificationFolder(cropSlug);
  if (!folder) return [];
  const slugs = FOLDER_PROBLEMS[folder] || [];
  return slugs
    .map((s) => {
      const meta = PROBLEM_META[s];
      if (!meta) return null;
      return {
        ...meta,
        folder,
        imageUrl: buildCropIdImageUrl(folder, s),
      };
    })
    .filter((x): x is CropIdentificationProblemMeta & { imageUrl: string; folder: string } => Boolean(x));
}
