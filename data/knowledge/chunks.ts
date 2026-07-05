import type { KnowledgeChunk } from "@/lib/knowledge/types";

/**
 * Structured knowledge extracted from knowledge/ PDFs.
 * Sources: ICAR PoPs, NFSM, IRAC/HRAC guides, Hindi pesticide master class, IPM, etc.
 */
export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  // ——— PADDY ———
  {
    id: "paddy-nfsm-npk",
    sourceFile: "NFSM_Package.pdf",
    title: "Paddy NPK & sowing (NFSM)",
    crops: ["paddy"],
    topics: ["fertilizer", "sowing"],
    lang: "en",
    text: "Recommended NPK kg/ha: upland 90:60:60, lowland 100:60:60, hybrid rice 120-150 N + 60 P2O5 + 60 K2O + 25 kg ZnSO4. Sowing: last week May to first week June. Transplant 25-day seedlings 20×10 cm, 2-3 seedlings/hill. Maintain 2-5 cm water. Resistant varieties: stem borer (Ratna, Vikas), blast (Rasi, KRH-2), BLB (Karjat-1). Weeds: Pretilachlor, Butachlor, Bispyribac-sodium post-emergence.",
  },
  {
    id: "paddy-weed-hrac",
    sourceFile: "NFSM_Package.pdf",
    title: "Paddy weed management HRAC",
    crops: ["paddy"],
    topics: ["herbicide", "general"],
    lang: "en",
    text: "Barnyard grass: Pretilachlor 50 EC @ 0.6-0.75 kg a.i./ha (HRAC 15) at 3 DAS. Post-emergence: Bispyribac-sodium 10 SC @ 25 g a.i./ha (HRAC 2) at 15-20 DAS. Flat sedge: Pretilachlor + Pyrazosulfuron. Monochoria: 2,4-D Na salt 80 WP @ 0.5 kg a.i./ha direct-seeded only (HRAC 4). Hand weeding at 20 & 40 DAS in transplanted rice.",
  },
  // ——— MAIZE ———
  {
    id: "maize-pop-ap",
    sourceFile: "MaizePackage.pdf",
    title: "Maize package Andhra Pradesh",
    crops: ["maize"],
    topics: ["fertilizer", "sowing", "herbicide"],
    lang: "en",
    text: "Kharif sowing June 15-July 15. Seed rate 7-8 kg/acre hybrids. Spacing 60×20 cm. Kharif fertilizer: 72-80 kg N, 24 kg P2O5, 20 kg K2O per acre in 3 splits (sowing, knee-high, flowering). Pre-emergence Atrazine 50 WP @ 800-1200 g/acre within 3 DAS. ZnSO4 20 kg/acre if deficient. Fall Armyworm: scout whorl, Chlorantraniliprole/Emamectin evening spray.",
  },
  // ——— COTTON ———
  {
    id: "cotton-pop-basics",
    sourceFile: "cotton.pdf",
    title: "Cotton package of practices",
    crops: ["cotton"],
    topics: ["sowing", "fertilizer", "irrigation", "herbicide"],
    lang: "en",
    text: "Cotton needs 21-27°C vegetative, frost-free. Sowing: North irrigated March-May, rainfed June-July with monsoon. Bt hybrid spacing 90×60 cm, seed rate 1.5 kg/ha. Water 700-1200 mm; critical at flowering and boll development. Weed-free 0-70 DAS — yield loss 50-85% if unchecked. Pre-plant: Fluchloralin or Pendimethalin @ 1 kg a.i./ha + one hand weeding. NPK Central hybrids: 100-240 N, 50-120 P, 50-120 K kg/ha in splits at squaring and peak flowering.",
  },
  {
    id: "cotton-pest-irac",
    sourceFile: "cotton.pdf",
    title: "Cotton major pests control",
    crops: ["cotton"],
    topics: ["pest", "ipm"],
    lang: "en",
    text: "Pink bollworm, spotted bollworm, jassids, whitefly, aphids major pests. IPM: light traps, pheromone traps, avoid same IRAC group back-to-back. Bollworm: Emamectin benzoate (IRAC 6) or Chlorantraniliprole (IRAC 28). Sucking pests: Imidacloprid (4A) seed treatment; rotate with Diafenthiuron (12A) or Pyriproxyfen (7C) for whitefly. Do not spray during peak bee hours.",
  },
  // ——— SOYBEAN ———
  {
    id: "soybean-iisr-pop",
    sourceFile: "Soybeanpackageofpractices.pdf",
    title: "Soybean ICAR-IISR agronomy",
    crops: ["soybean"],
    topics: ["sowing", "fertilizer", "general"],
    lang: "en",
    text: "Well-drained sandy loam to clay, pH near neutral. Summer deep plough. FYM 5-10 t/ha. Gypsum 150-200 kg/ha with FYM if no sulphur. Grow 3-4 varieties different maturity (varietal cafeteria). BBF/Ridge-Furrow for moisture conservation. Rhizobium + PSB seed treatment. Fixes 60-100 kg N — avoid excess nitrogen. Popular intercrops: soybean+pigeonpea, soybean+maize 4:2.",
  },
  {
    id: "soybean-pest-disease",
    sourceFile: "Soybeanpackageofpractices.pdf",
    title: "Soybean pest and disease",
    crops: ["soybean"],
    topics: ["pest", "disease"],
    lang: "en",
    text: "Girdle beetle, stem fly, semilooper, whitefly. Seed treatment Carbendazim + Imidacloprid. Rust, charcoal rot, yellow mosaic virus. Rogue YMV plants. Rust: Propiconazole or Tebuconazole (FRAC 3). Stem fly: early sowing, seed treatment Thiamethoxam. Harvest when leaves turn yellow and pods brown — moisture 12% for storage.",
  },
  // ——— BAJRA ———
  {
    id: "bajra-pop",
    sourceFile: "Recommended_package_of_practices-Pearl_millet.pdf",
    title: "Pearl millet (Bajra) PoP",
    crops: ["bajra"],
    topics: ["sowing", "fertilizer", "herbicide", "pest"],
    lang: "en",
    text: "Kharif sowing first fortnight July. Seed rate 3-4 kg/ha, spacing 45×10-15 cm, population 1.75-2 lakh/ha. Fertilizer semi-arid: 60N+30P kg/ha; arid 40N+20P. Half N on sandy soils at sowing, half at 25 DAS. Atrazine 0.5 kg/ha pre-emergence + one hand weeding. ZnSO4 10 kg/ha or 0.2% foliar. Downy mildew: metalaxyl seed treatment 6 g/kg. Shoot fly: carbofuran 3G @ 10 kg/ha at sowing.",
  },
  // ——— MOONGFALI ———
  {
    id: "groundnut-pop",
    sourceFile: "moongfali.pdf",
    title: "Groundnut (Moongfali) PoP",
    crops: ["moongfali"],
    topics: ["fertilizer", "irrigation", "herbicide", "pest"],
    lang: "en",
    text: "Kharif June-July, Rabi Nov-Dec. RDF Kharif: 20N+40P+50K kg/ha basal. Gypsum 500 kg/ha at flowering. Rhizobium+PSB. Weed-free 45 DAS. Pre-emergence Pendimethalin 2.5-3 L/ha or Oxyfluorfen. Critical irrigation: flowering, peg penetration, pod development. Intercrop groundnut+redgram 7:1. Leaf spot/rust: Tebuconazole or Hexaconazole. Aphids/jassids: Imidacloprid; termites: chlorpyrifos seed treatment.",
  },
  // ——— CHILLI ———
  {
    id: "chilli-pop",
    sourceFile: "chilli.pdf",
    title: "Chilli cultivation practices",
    crops: ["chilli"],
    topics: ["sowing", "fertilizer"],
    lang: "en",
    text: "Ideal 20-25°C; avoid 37°C+ during fruiting. Loam pH 6.5-7.5. Nursery June-July, Sept-Oct, Jan-Feb. Hybrid seed 100 g/acre, varieties 400 g/acre. Trichoderma 4 g/kg seed. Transplant spacing 60×45 cm drip. Thrips and mites major — yellow sticky traps 20/acre. Leaf curl virus: rogue infected plants, whitefly vector control Pyriproxyfen.",
  },
  // ——— TOMATO ———
  {
    id: "tomato-precision",
    sourceFile: "PRECISION_FARMING_TECHNOLOGIES_new.pdf",
    title: "Tomato precision farming drip",
    crops: ["tomato"],
    topics: ["fertilizer", "irrigation", "sowing"],
    lang: "en",
    text: "Hybrid seed 100 g/ha nursery. Fertigation NPK 200:250:250 kg/ha split every 3 days via drip. FYM 25 t/ha. Paired row 90×60×60 cm. Pre-emergence Pendimethalin 3 L/ha before transplant. African marigold trap crop every 16 rows. Staking at 30 DAT. Pseudomonas 0.5% foliar fortnightly. Early blight/late blight: Mancozeb + Metalaxyl rotation.",
  },
  {
    id: "tomato-disease-atlas",
    sourceFile: "Tomato_Diagnostic_Atlas.pdf",
    title: "Tomato disease symptoms guide",
    crops: ["tomato"],
    topics: ["disease"],
    lang: "en",
    text: "Early blight: concentric rings on older leaves. Late blight: water-soaked lesions, white sporulation underside in humid weather. Leaf curl: upward curling, stunting — virus, no cure, vector control. Septoria: small circular spots with grey centre. Bacterial wilt: sudden wilt, brown vascular tissue. Blossom end rot: calcium deficiency, irregular irrigation. Target spot: brown spots with yellow halo.",
  },
  // ——— POTATO ———
  {
    id: "potato-pop",
    sourceFile: "potato.pdf",
    title: "Potato cultivation",
    crops: ["potato"],
    topics: ["fertilizer", "disease"],
    lang: "en",
    text: "Seed rate 10-12 quintal/ha. NPK 150:100:120 kg/ha mostly basal. Earthing up critical. Late blight: Metalaxyl+Mancozeb (FRAC 4+M3) preventive in humid weather. Early blight: Mancozeb. Aphids vector PVY — Imidacloprid, rogue virus plants. Tuber moth storage: Malathion dust. Harvest when vines dry; cure tubers before storage.",
  },
  // ——— PESTICIDE SAFETY HINDI ———
  {
    id: "pesticide-safety-hi",
    sourceFile: "कृषि रक्षा रसायन PESTICIDE मास्टर क्लास.pdf",
    title: "कीटनाशक सुरक्षा और प्रकार",
    crops: [],
    topics: ["safety", "general"],
    lang: "hi",
    text: "खंड 1: दवा खरीदते, रखते और छिड़कते समय PPE ज़रूरी — मास्क, दस्ताने, चश्मा। पैकेट पर लाल/पीला/नीला/हरा निशान ज़हर का स्तर बताता है। इमरजेंसी: ज़हर लगने पर पहला इलाज और एंटीडोट लेबल पर देखें। खंड 2: सिस्टमिक दवा पौधे में फैलती है; कॉन्टैक्ट छूते ही मारती है। एक ही दवा बार-बार — resistance। सही मात्रा, पानी और समय महत्वपूर्ण।",
  },
  {
    id: "fungicide-herbicide-hi",
    sourceFile: "कृषि रक्षा रसायन PESTICIDE मास्टर क्लास.pdf",
    title: "फफूंदनाशक और खरपतवारनाशक",
    crops: [],
    topics: ["safety", "herbicide", "disease"],
    lang: "hi",
    text: "फफूंदनाशक: निवारक (रोग से पहले) और उपचारात्मक (बाद में)। सिस्टमिक बनाम कॉन्टैक्ट। FRAC समूह बदलकर छिड़कें। खरपतवारनाशक: Pre-emergence मिट्टी पर बुवाई से पहले/तुरंत बाद; Post-emergence खरपतवार निकलने पर। HRAC समूह रोटेशन ज़रूरी — ALS (2) में resistance जल्दी आता है।",
  },
  // ——— IRAC ———
  {
    id: "irac-rotation",
    sourceFile: "Insecticide Mastery- IRAC Classification Guide.pdf",
    title: "IRAC insecticide rotation",
    crops: [],
    topics: ["pest", "ipm", "safety"],
    lang: "en",
    text: "IRAC MoA rotation prevents resistance. Never apply same group twice consecutively. Key groups: 3A Pyrethroids, 4A Neonicotinoids, 5 Spinosyns, 6 Avermectins, 28 Diamides (Chlorantraniliprole), 22A Metaflumizone. Mixtures count as both groups. Prefer biologicals and IVM before chemical escalation.",
  },
  // ——— IPM ———
  {
    id: "ipm-approaches",
    sourceFile: "11+Integrated+pest+management+approaches+against.pdf",
    title: "Integrated Pest Management",
    crops: [],
    topics: ["ipm", "pest"],
    lang: "en",
    text: "IPM combines cultural (crop rotation, clean cultivation), mechanical (traps, hand picking), biological (Trichoderma, NPV, parasitoids), and chemical (only at ETL). Monitor with pheromone/yellow sticky traps. Economic Threshold Level before spray. Avoid calendar spraying. Preserve natural enemies — avoid broad-spectrum pyrethroids early season.",
  },
  // ——— NUTRIENT ———
  {
    id: "nutrient-mgmt-basics",
    sourceFile: "Textbook of Plant Nutrient management by IAS-..pdf",
    title: "Plant nutrient deficiency basics",
    crops: [],
    topics: ["deficiency", "fertilizer"],
    lang: "en",
    text: "N deficiency: older leaves yellow first (mobile). P deficiency: purplish leaves, stunted roots. K deficiency: leaf margin scorch. Zn deficiency: interveinal chlorosis in maize/rice. B deficiency: flower/fruit drop, hollow fruits in chilli/tomato. Fe deficiency: young leaves pale on calcareous soils. Foliar correction faster; soil application longer lasting. Split N application reduces leaching.",
  },
  {
    id: "soil-fertigation",
    sourceFile: "_कृषि रक्षा रसायन SOIL और फर्टिलाइज़र फर्टिगेशन मास्टर क्लास (5).pdf",
    title: "फर्टिगेशन और मिट्टी स्वास्थ्य",
    crops: ["tomato", "chilli", "potato"],
    topics: ["fertilizer", "irrigation"],
    lang: "hi",
    text: "ड्रिप फर्टिगेशन से NPK छोटी मात्रा में बार-बार दें — उपयोग क्षमता 80-90%। पहले पानी, फिर खाद। EC और pH का पानी पर ध्यान। FYM/कम्पोस्ट से मिट्टी जीवाणु बढ़ाएँ। अत्यधिक नाइट्रोजन से कीट बढ़ते हैं। फूल अवस्था पर K और Ca ज़रूरी।",
  },
  // ——— ORGANIC ———
  {
    id: "organic-chhattisgarh",
    sourceFile: "_Package of Practices (PoPs) for organic production of crops in chhattisgarh.pdf",
    title: "Organic soybean-chickpea Chhattisgarh",
    crops: ["soybean"],
    topics: ["organic", "sowing"],
    lang: "en",
    state: "Chhattisgarh",
    text: "Organic systems: Soybean-Chickpea, Soybean-Onion, Rice-Chickpea. Soybean JS-335, sow second fortnight June, harvest second fortnight October. Seed rate 70-75 kg/ha. Spacing 30×10 cm. FYM 2 t/ha + vermicompost 0.8 t/ha + neem cake 0.2 t/ha. Rhizobium + PSB + Trichoderma seed treatment. No chemical pesticides — neem, trap crops, hand weeding.",
  },
  // ——— SUGARCANE ———
  {
    id: "sugarcane-disease",
    sourceFile: "Sugarcane_ Diseases and Symptoms.pdf",
    title: "Sugarcane diseases",
    crops: ["sugarcane"],
    topics: ["disease"],
    lang: "en",
    text: "Red rot: red internal tissue with alcohol smell — use resistant varieties, hot water seed treatment. Smut: black whip from crown — rogue and burn. Wilt: yellowing and drying — avoid ratoon in infected fields. Grassy shoot: phytoplasma, leafhopper vector. Yellow leaf virus: aphid vector. Intercropping and balanced nutrition reduce disease pressure.",
  },
  // ——— ALL CROPS ———
  {
    id: "all-crops-imp",
    sourceFile: "all crps imp points.pdf",
    title: "Multi-crop important points",
    crops: ["paddy", "wheat", "maize", "cotton", "soybean", "tomato", "chilli"],
    topics: ["general"],
    lang: "en",
    text: "Certified seed, timely sowing, seed treatment, balanced NPK per soil test, weed-free first 45 days, pest monitoring at ETL, MoA rotation for chemicals, harvest at right maturity, dry grains to safe moisture before storage.",
  },
  // ——— STATE ADVISORIES (samples) ———
  {
    id: "icar-mp-kharif",
    sourceFile: "ICAR-En-Kharif-Agro-Advisories-for-Farmers-2025.pdf",
    title: "Madhya Pradesh Kharif 2025",
    crops: ["soybean", "maize", "cotton", "bajra"],
    topics: ["advisory", "sowing"],
    lang: "hi",
    state: "Madhya Pradesh",
    text: "सोयाबीन जून में बुवाई; विभिन्न परिपक्वता की 3-4 किस्में। मक्का/बाजरा मानसून शुरू। कपास Bt हाइब्रिड — खरपतवार 70 DAS तक नियंत्रण। भारी बारिश में जल निकासी। मिट्टी परीक्षण पर आधारित उर्वरक।",
  },
  {
    id: "icar-punjab-kharif",
    sourceFile: "ICAR-En-Kharif-Agro-Advisories-for-Farmers-2025.pdf",
    title: "Punjab Kharif 2025",
    crops: ["paddy", "cotton", "maize"],
    topics: ["advisory"],
    lang: "hi",
    state: "Punjab",
    text: "धान रोपाई जून प्रथम सप्ताह। कपास जून-जुलाई। PAU Kharif 2026 PoP के अनुसार किस्म चुनें। सिंचित खेत में समय पर निराई-गुड़ाई।",
  },
  {
    id: "icar-mh-kharif",
    sourceFile: "ICAR-En-Kharif-Agro-Advisories-for-Farmers-2025.pdf",
    title: "Maharashtra Kharif 2025",
    crops: ["soybean", "cotton", "bajra"],
    topics: ["advisory"],
    lang: "hi",
    state: "Maharashtra",
    text: "सोयाबीन मानसून पर तुरंत; BBF बुवाई। कपास जून-जुलाई। अंतरफसल बाजरा+मूंग। सफेद मक्खी/थ्रिप्स निगरानी।",
  },
  // ——— HRAC POSTER ———
  {
    id: "hrac-poster-2024",
    sourceFile: "WEB-15x17-5-Herbicide-Classification-Poster-GROW-2024-Jan-V3-V2.pdf",
    title: "HRAC herbicide classification 2024",
    crops: [],
    topics: ["herbicide"],
    lang: "en",
    text: "HRAC global numeric groups for herbicide rotation. Group 1 ACCase (grassy post-em), 2 ALS (broadleaf/sedge), 3 Microtubule (pendimethalin), 4 Auxins (2,4-D), 5 PSII (atrazine), 15 VLCFA (pretilachlor/butachlor), 27 HPPD (tembotrione). Rotate groups across seasons to delay resistance.",
  },
  // ——— BRINJAL ———
  {
    id: "brinjal-sustainability",
    sourceFile: "Vol.+15+No.+1+(2014)-+An+Appraisal+of+Production+Sustainability+of+Brinjal+-.pdf",
    title: "Brinjal pest management",
    crops: ["brinjal"],
    topics: ["pest", "disease"],
    lang: "en",
    text: "Shoot and fruit borer major pest year-round brinjal. Fruit and shoot borer: Emamectin or Indoxacarb at fruit initiation, remove infested fruits. Jassids and whitefly: Imidacloprid rotation. Little leaf phytoplasma: leafhopper vector, rogue plants. Avoid excess pesticides — focus IPM and balanced fertilizer per soil test.",
  },
  // ——— WHEAT ———
  {
    id: "wheat-basic",
    sourceFile: "NFSM_Package.pdf",
    title: "Wheat basics",
    crops: ["wheat"],
    topics: ["fertilizer", "disease"],
    lang: "en",
    text: "NPK 120:60:40 kg/ha typical. CRI irrigation ~21 DAS critical. Yellow rust: Propiconazole at first stripe. Karnal bunt: avoid late sowing, carboxin seed treatment. Weeds: Pendimethalin pre-emergence, Clodinafop for Phalaris minor post-emergence (HRAC 1).",
  },
];

export const KNOWLEDGE_INDEX = {
  version: 1,
  chunkCount: KNOWLEDGE_CHUNKS.length,
  sources: [...new Set(KNOWLEDGE_CHUNKS.map((c) => c.sourceFile))],
  updated: "2026-07-05",
};
