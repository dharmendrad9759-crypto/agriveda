import type { CropManagementProfile } from "@/types/crop-management";

/**
 * Chilli (Capsicum annuum) — protection protocols with IRAC/FRAC/HRAC
 * codes aligned to data/moa-lookup.ts and Indian market products.
 */
export const chilliProfile: CropManagementProfile = {
  slug: "chilli",
  name: "मिर्च",
  scientificName: "Capsicum annuum L.",
  category: "सब्जियाँ",
  image: "/images/chilli.png",
  summary:
    "मूल्यवान मसाला/सब्जी फसल। सफलता के लिए थ्रिप्स–सफ़ेद मक्खी–वायरस प्रबंधन, ड्रिप सिंचाई और फूल-फल अवस्था में संतुलित पोषण ज़रूरी है।",
  overview:
    "मिर्च भारत भर में हरी और सूखी फल के लिए उगाई जाती है। मुख्य नुकसान थ्रिप्स, पीला माइट, फल छेदक, anthracnose और leaf curl virus (सफ़ेद मक्खी से) से होता है। IRAC/FRAC समूह बदलकर छिड़काव करें — एक ही MoA लगातार दो बार न छिड़कें।",
  climate: "गर्म (20–30°C सर्वोत्तम)। पाला और लंबे समय जलभराव से संवेदनशील। तेज़ धूप चाहिए।",
  soil: "अच्छी जल निकासी वाली बलुई दोमट से दोमट, जैविक पदार्थ से समृद्ध; pH 6.0–7.0।",
  landPreparation: [
    "बारीक जुताई के लिए गहरी जुताई और 2–3 बार पाटा चलाएँ।",
    "FYM / compost 10–12 t/ha डालकर मिलाएँ।",
    "ड्रिप + मल्च के लिए उठी क्यारियाँ या मेड़ बनाएँ।",
  ],
  seedSelection: [
    "बाज़ार (हरी / सूखी / दोनों) के अनुसार प्रमाणित हाइब्रिड या सुधारित OP बीज लें।",
    "जहाँ उपलब्ध हो, leaf-curl और thrips सहनशील किस्में पसंद करें (e.g. Arka series, स्थानीय अनुशंसित hybrids)।",
  ],
  seedTreatment: [
    "Carbendazim 50 WP @ 2 g/kg seed (FRAC 1)।",
    "Trichoderma viride 1% WP @ 10 g/kg damping-off के लिए।",
    "Imidacloprid 30 FS @ 5–7 ml/kg seed शुरुआती चूसक कीटों के लिए (IRAC 4A) — वैकल्पिक।",
  ],
  sowingTime: [
    "नर्सरी: जून–जुलाई (खरीफ); अक्टूबर–नवंबर (कई राज्यों में रबी)।",
    "30–35 दिन की पौध 4–5 पत्ती अवस्था में रोपें।",
    "जलभराव या बहुत गर्म सूखी मिट्टी में रोपाई से बचें।",
  ],
  seedRate: "200–250 g/acre (नर्सरी बीज)",
  spacing: "60 × 45 cm (रोपाई); कॉम्पैक्ट hybrids के लिए 45 × 45 cm",
  nursery: [
    "1 m चौड़ी उठी नर्सरी क्यारियाँ जल निकासी के साथ।",
    "ज़रूरत हो तो भारी बारिश से shade net से बचाएँ।",
    "रोपाई से 5–7 दिन पहले पौध को कठोर (harden) करें।",
  ],
  transplanting: [
    "शाम को रोपें; तुरंत सिंचाई करें।",
    "7–10 दिन के भीतर रिक्त स्थान भरें।",
    "रोपाई से yellow sticky traps @ 20–25/acre लगाएँ।",
  ],
  irrigationSchedule: [
    "रोपाई पर हल्की सिंचाई और शुरू में हर 3–5 दिन।",
    "महत्वपूर्ण अवस्थाएँ: फूल और फल बनना — नमी की कमी न होने दें।",
    "ड्रिप सिंचाई बेहतर; overhead सिंचाई से बचें — anthracnose फैलता है।",
    "जलभराव न करें — जड़ सड़न और wilt बढ़ते हैं।",
  ],
  fertilizerSchedule: [
    "बेसल: FYM 10–12 t/ha + NPK 40:40:40 kg/ha (या मिट्टी परीक्षण के अनुसार DAP + MOP)।",
    "30, 45 और 60 DAT पर N को 2–3 हिस्सों में टॉप-ड्रेस करें।",
    "फल अवस्था में Potash और calcium महत्वपूर्ण — फल झड़ना और tip burn कम करते हैं।",
    "फूल–फल अवस्था में हर 15 दिन सूक्ष्म पोषक (Zn, B, Ca) पत्ती छिड़काव।",
  ],
  micronutrients: [
    "फूल अवस्था में Boron 0.2% पत्ती छिड़काव (फल बनना)",
    "शिराओं के बीच पीलापन हो तो Zinc sulphate 0.5% पत्ती छिड़काव",
    "blossom-end / tip disorders के लिए Calcium nitrate पत्ती छिड़काव",
  ],
  growthStages: [
    { title: "नर्सरी", period: "0–35 DAS", keyPoints: ["स्वस्थ पौध", "Damping-off पर नज़र"] },
    { title: "स्थापना", period: "0–20 DAT", keyPoints: ["रिक्त स्थान भरें", "Thrips निगरानी"] },
    { title: "वегिटेटिव", period: "20–45 DAT", keyPoints: ["छज्जा बनाना", "सफ़ेद मक्खी / leaf curl"] },
    { title: "फूल–फल", period: "45–90 DAT", keyPoints: ["फल छेदक", "Anthracnose", "माइट"] },
  ],
  interculturalOperations: [
    "जड़ी-बूटी नाशक न हो तो 20 और 40 DAT पर हाथ से निराई / interculture।",
    "उठी क्यारियों पर plastic mulch से खरपतवार और मिट्टी छींट कम।",
    "लंबे hybrids गिरें तो stake या सहारा दें।",
  ],

  weedManagement: [
    {
      weedName: "Parthenium (Congress grass)",
      scientificName: "Parthenium hysterophorus",
      type: "चौड़े पत्ते",
      criticalPeriod: "0–40 DAT",
      preEmergenceHerbicide: "Pendimethalin 30 EC @ 1.0 kg a.i./ha on moist soil within 3 DAT (directed, crop-safe)",
      postEmergenceHerbicide: "हाथ से निराई + mulch; फसल पर non-selective herbicide न लगाएँ",
      hracGroup: "HRAC 3",
      dose: "Pendimethalin ≈3.3 L/ha product in 500 L water; keep spray off crop foliage",
    },
    {
      weedName: "बिशखापड़ा (Trianthema)",
      scientificName: "Trianthema portulacastrum",
      type: "चौड़े पत्ते",
      criticalPeriod: "10–35 DAT",
      preEmergenceHerbicide: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
      postEmergenceHerbicide: "Interculture between rows; plastic mulch preferred",
      hracGroup: "HRAC 3",
      dose: "Pre-em on moist soil; one hand weeding at 20–25 DAT if needed",
    },
    {
      weedName: "घास की खरपतवार (Digitaria / Echinochloa)",
      scientificName: "Digitaria sanguinalis",
      type: "घास",
      criticalPeriod: "0–25 DAT",
      preEmergenceHerbicide: "Pendimethalin 30 EC @ 1.0 kg a.i./ha",
      postEmergenceHerbicide: "Quizalofop-ethyl 5 EC @ 50 g a.i./ha (directed between rows if label allows)",
      hracGroup: "HRAC 3 / HRAC 1",
      dose: "Quizalofop ≈1 L/ha product; घास 2–4 पत्ती पर छिड़कें; drift फसल पर न जाए",
    },
  ],

  pestManagement: [
    {
      pestName: "मिर्च थ्रिप्स",
      scientificName: "Scirtothrips dorsalis",
      identification:
        "नए पत्तों और कलियों पर छोटे पीले-भूरे कीट; पत्ते ऊपर की ओर मुड़कर भंगुर हो जाते हैं; नीचे चाँदी जैसा रंग।",
      symptoms: [
        "पत्तों का ऊपर की ओर मुड़ना और सिकुड़ना",
        "फलों पर भूरे निशान (bird-eye spots)",
        "कोमल अंकुर रुके",
        "भारी संक्रमण से फूल कम",
      ],
      etl: "2–5 thrips/leaf या 10% पत्ते क्षतिग्रस्त — जल्दी कार्रवाई; thrips वायरस लक्षण भी बढ़ाते हैं",
      biologicalControl: [
        "Blue / yellow sticky traps @ 20–25/acre",
        "अधिक नाइट्रोजन से बचें (नरम वृद्धि thrips आकर्षित करती है)",
        "जहाँ संभव हो, शिकारी माइट का संरक्षण",
      ],
      chemicalControl: [
        "Fipronil 5 SC — IRAC 2B",
        "Diafenthiuron 50 WP (e.g. Pegasus / Polo) — IRAC 12A",
        "Spinosad 45 SC — IRAC 5",
        "समूह बदलें — IRAC 4A neonics बार-बार न करें",
      ],
      iracGroup: "IRAC 2B / 12A / 5",
      activeIngredient: "Fipronil 5 SC",
      dose: "1.5–2.0 ml/L; Diafenthiuron 1 g/L alternate spray after 10 days; PHI 7–14 days as per label",
    },
    {
      pestName: "सफ़ेद मक्खी",
      scientificName: "Bemisia tabaci",
      identification:
        "पत्तों की नीचली सतह पर सफ़ेद कीट; पौध हिलाने पर उड़ जाते हैं। Chilli leaf curl virus का मुख्य वाहक।",
      symptoms: [
        "पीलापन और शहद से sooty mould",
        "संक्रमित वाहक हो तो leaf curl virus के लक्षण",
        "पौध कमज़ोर और फूल झड़ना",
      ],
      etl: "5–10 adults/leaf या खेत में पहले वायरस लक्षण — वाहक नियंत्रण प्राथमिकता",
      biologicalControl: [
        "Yellow sticky traps @ 20–25/acre",
        "गंभीर वायरस संक्रमित पौध हटाकर नष्ट करें",
        "लगातार solanaceous फसल से बचें",
      ],
      chemicalControl: [
        "Pyriproxyfen 10 EC — IRAC 7C (IGR — nymphs के लिए अच्छा)",
        "Diafenthiuron 50 WP — IRAC 12A",
        "Spiromesifen 240 SC (e.g. Oberon) — IRAC 23",
        "केवल IRAC 4A neonics पर निर्भर न रहें",
      ],
      iracGroup: "IRAC 7C / 12A / 23",
      activeIngredient: "Pyriproxyfen 10 EC",
      dose: "1 ml/L; Diafenthiuron 1 g/L or Spiromesifen 0.5 ml/L as rotation; PHI 7–14 days",
    },
    {
      pestName: "फल छेदक",
      scientificName: "Helicoverpa armigera",
      identification:
        "लार्वा कलियों और फलों में छेद करते हैं; प्रवेश छेद पर मल; क्षतिग्रस्त फल सड़कर गिरते हैं।",
      symptoms: [
        "हरे फलों में छेद",
        "फूल और कली झड़ना",
        "अंदरूनी खाने और द्वितीयक सड़न",
      ],
      etl: "1 larva/plant या 5% फल / कली क्षतिग्रस्त",
      biologicalControl: [
        "HaNPV @ 250 LE/ha शाम को",
        "Pheromone traps @ 5/ha निगरानी के लिए",
        "Trichogramma chilonis @ 50,000/ha साप्ताहिक × 4",
      ],
      chemicalControl: [
        "Emamectin benzoate 5 SG — IRAC 6",
        "Chlorantraniliprole 18.5 SC — IRAC 28",
        "Indoxacarb 14.5 SC — IRAC 22A",
        "शाम को छिड़कें; फल और कलियों को ढकें",
      ],
      iracGroup: "IRAC 6 / 28 / 22A",
      activeIngredient: "Emamectin benzoate 5 SG",
      dose: "0.4 g/L (≈80–100 g/ha); Chlorantraniliprole 0.4 ml/L alternate; PHI 7–14 days",
    },
    {
      pestName: "पीला माइट (Broad mite)",
      scientificName: "Polyphagotarsonemus latus",
      identification:
        "नए पत्तों पर सूक्ष्म माइट; पत्ते संकरे, नीचे की ओर मुड़कर ताम्र हो जाते हैं; सूखे मौसम में आम।",
      symptoms: [
        "पत्तों का नीचे की ओर मुड़ना (thrips के ऊपर मुड़ने के विपरीत)",
        "लंबे संकरे पत्ते",
        "ताम्र और खुरदरी फल की सतह",
        "शीर्ष अंकुर विकृत",
      ],
      etl: "कोमल पत्तों पर पहला ताम्र / नीचे मुड़ना — तुरंत उपचार",
      biologicalControl: [
        "धूल भरे सूखे मौसम से बचें; मिट्टी की नमी बनाए रखें",
        "Pyrethroids बार-बार न करें (माइट बढ़ते हैं)",
      ],
      chemicalControl: [
        "Abamectin 1.9 EC — IRAC 6",
        "Spiromesifen 240 SC — IRAC 23",
        "Propargite 57 EC — IRAC 12C (where registered)",
        "नए पत्तों की नीचली सतह अच्छी तरह छिड़कें",
      ],
      iracGroup: "IRAC 6 / 23 / 12C",
      activeIngredient: "Abamectin 1.9 EC",
      dose: "0.5–0.75 ml/L; Spiromesifen 0.5 ml/L as alternate MoA; PHI 7 days",
    },
    {
      pestName: "माहू",
      scientificName: "Aphis gossypii / Myzus persicae",
      identification:
        "कोमल अंकुर और पत्तों की नीचली सतह पर कॉलोनी में नरम कीट; शहद और sooty mould।",
      symptoms: [
        "कोमल पत्ते मुड़े",
        "चिपचिपा शहद",
        "वायरस फैलने का जोखिम",
      ],
      etl: "10–20 aphids/leaf या 10% पौधों पर कॉलोनी",
      biologicalControl: [
        "Ladybird beetles और syrphids — शुरुआती व्यापक स्पेक्ट्रम छिड़काव से बचें",
        "Yellow sticky traps",
      ],
      chemicalControl: [
        "Acetamiprid 20 SP — IRAC 4A",
        "Thiamethoxam 25 WG — IRAC 4A (rotation में केवल एक बार)",
        "सफ़ेद मक्खी के लिए 4A पहले ही उपयोग हो तो non-4A विकल्प पसंद करें",
      ],
      iracGroup: "IRAC 4A",
      activeIngredient: "Acetamiprid 20 SP",
      dose: "0.2–0.3 g/L; PHI 7–14 days",
    },
  ],

  diseaseManagement: [
    {
      diseaseName: "Anthracnose / फल सड़न",
      pathogen: "Colletotrichum capsici",
      type: "फफूंद",
      symptoms: [
        "फलों पर गड्ढेदार गोल धब्बे, संकेंद्रित वलय",
        "धब्बों के बीच काले acervuli",
        "नम मौसम में फल सड़कर गिरते हैं",
      ],
      favourableConditions: [
        "उच्च आर्द्रता और बारिश का छींट",
        "Overhead सिंचाई",
        "घना छज्जा और घायल फल",
      ],
      integratedManagement: [
        "Overhead सिंचाई से बचें — ड्रिप का उपयोग",
        "संक्रमित फल खेत से हटाएँ",
        "हवा के लिए पौध stake करें",
        "FRAC समूह बदलें — केवल FRAC 1 या 11 न करें",
      ],
      biologicalControl: ["Pseudomonas fluorescens पत्ती छिड़काव 10 g/L निवारक"],
      chemicalControl: [
        "Mancozeb 75 WP — FRAC M3",
        "Carbendazim 50 WP — FRAC 1",
        "Azoxystrobin 250 SC — FRAC 11 (बदलकर; प्रतिरोध का उच्च जोखिम)",
        "Copper oxychloride 50 WP — FRAC M1",
      ],
      fracGroup: "FRAC M3 / 1 / 11",
      activeIngredient: "Mancozeb 75 WP + Carbendazim 50 WP",
      dose: "Mancozeb 2 g/L + Carbendazim 1 g/L tank mix at first symptom; PHI 7–14 days",
      waitingPeriod: "7–14 days",
    },
    {
      diseaseName: "Die-back / Twig Blight",
      pathogen: "Colletotrichum gloeosporioides / C. capsici",
      type: "फफूंद",
      symptoms: [
        "कोमल टहनी की नोक से सूखना",
        "तने पर necrotic धब्बे",
        "फूल और फल झड़ना",
      ],
      favourableConditions: ["नम मौसम", "कीट या trimming से घाव", "जल तनाव"],
      integratedManagement: [
        "संक्रमित टहनियाँ काटकर नष्ट करें",
        "औज़ार कीटाणुशोधन",
        "संतुलित पोषण — अधिक N से बचें",
      ],
      biologicalControl: ["Trichoderma मिट्टी में 2.5 kg/ha"],
      chemicalControl: [
        "Copper oxychloride 50 WP — FRAC M1 after pruning",
        "Propiconazole 25 EC — FRAC 3",
        "Hexaconazole 5 EC — FRAC 3 (multi-site copper के साथ बदलकर)",
      ],
      fracGroup: "FRAC M1 / 3",
      activeIngredient: "Copper oxychloride 50 WP",
      dose: "3 g/L after pruning; Propiconazole 1 ml/L if severe; PHI 14 days",
      waitingPeriod: "14 days",
    },
    {
      diseaseName: "Leaf Curl Virus (ChiLCV)",
      pathogen: "Begomovirus (whitefly-transmitted)",
      type: "वायरस",
      symptoms: [
        "किनारों से पत्तों का ऊपर मुड़ना और पीलापन",
        "बुशी, रुके पौध",
        "फूल और फल कम",
        "गंभीर होने पर शिरा मोटी",
      ],
      favourableConditions: [
        "सफ़ेद मक्खी की उच्च आबादी",
        "आस-पास लगातार solanaceous फसल",
        "वाहक चरम के साथ देर से बुवाई",
      ],
      integratedManagement: [
        "वायरस की रासायनिक दवा नहीं — सफ़ेद मक्खी वाहक नियंत्रित करें",
        "संक्रमित पौध जल्दी हटाकर नष्ट करें",
        "अगले सीज़न सहनशील/प्रतिरोधी किस्म लगाएँ",
        "टमाटर–मिर्च–बैंगन लगातार क्रम से बचें",
      ],
      biologicalControl: ["Reflective mulch सफ़ेद मक्खी के बैठने से कम करता है"],
      chemicalControl: [
        "सफ़ेद मक्खी प्रबंधन: Pyriproxyfen 10 EC (IRAC 7C)",
        "Diafenthiuron 50 WP (IRAC 12A)",
        "Spiromesifen 240 SC (IRAC 23)",
        "Imidacloprid बीज उपचार केवल शुरू में — अकेली रणनीति न बनाएँ",
      ],
      fracGroup: "— (vector management)",
      activeIngredient: "Pyriproxyfen 10 EC (vector control)",
      dose: "1 ml/L for whitefly; remove infected plants same day",
      waitingPeriod: "7–14 days",
    },
    {
      diseaseName: "Powdery Mildew",
      pathogen: "Leveillula taurica",
      type: "फफूंद",
      symptoms: [
        "पत्तों की नीचली सतह पर सफ़ेद पाउडर",
        "ऊपरी सतह पर पीले धब्बे",
        "पत्ते समय से पहले झड़ना",
      ],
      favourableConditions: [
        "दिन सूखे, रात उच्च आर्द्रता",
        "मध्यम ताप 20–27°C",
        "घना छज्जा",
      ],
      integratedManagement: [
        "अधिक नाइट्रोजन से बचें",
        "हवा बढ़ाएँ — व्यापक दूरी",
        "गंभीर संक्रमित निचले पत्ते हटाएँ",
      ],
      biologicalControl: ["Potassium bicarbonate 5 g/L जैविक विकल्प"],
      chemicalControl: [
        "Wettable sulphur 80 WP — FRAC M2",
        "Hexaconazole 5 EC — FRAC 3",
        "दोपहर तेज़ धूप में sulphur न छिड़कें",
      ],
      fracGroup: "FRAC M2 / 3",
      activeIngredient: "Wettable sulphur 80 WP",
      dose: "2–3 g/L early morning; Hexaconazole 1 ml/L if severe; PHI 7 days",
      waitingPeriod: "7 days",
    },
    {
      diseaseName: "Damping-off / Wilt (seedling & soil-borne)",
      pathogen: "Pythium / Fusarium / Rhizoctonia spp.",
      type: "फफूंद",
      symptoms: [
        "मिट्टी की रेखा पर पौध गिरना",
        "रोपे पौध मुरझाना",
        "भूरा vascular discoloration (Fusarium)",
      ],
      favourableConditions: [
        "अधिक पानी और खराब जल निकासी",
        "संक्रमित नर्सरी मिट्टी",
        "लगातार मिर्च / solanaceous फसल",
      ],
      integratedManagement: [
        "जल निकासी वाली उठी नर्सरी क्यारियाँ",
        "2–3 साल फसल चक्र",
        "रोपाई के बाद जलभराव से बचें",
      ],
      biologicalControl: [
        "Trichoderma viride 10 g/kg seed + 2.5 kg/ha soil",
        "Pseudomonas fluorescens seedling dip",
      ],
      chemicalControl: [
        "Carbendazim 50 WP seed treatment — FRAC 1",
        "Metalaxyl + Mancozeb (e.g. Ridomil Gold) drench for Pythium — FRAC 4+M3",
        "Copper oxychloride soil drench in nursery — FRAC M1",
      ],
      fracGroup: "FRAC 1 / 4+M3",
      activeIngredient: "Carbendazim 50 WP (seed) / Metalaxyl + Mancozeb (drench)",
      dose: "Seed: 2 g/kg; Drench: Metalaxyl+Mancozeb 2 g/L in nursery beds",
      waitingPeriod: "— (nursery / early field)",
    },
  ],

  physiologicalDisorders: [
    "फूल / फल झड़ना: नमी तनाव, उच्च ताप, बोरॉन की कमी।",
    "फल पर धूप से झुलसना: thrips/माइट नुकसान के बाद छज्जा पतला।",
    "पत्ती/फल की नोक झुलसना: अनियमित सिंचाई में calcium की कमी।",
  ],
  nutrientDeficiencies: [
    {
      name: "नाइट्रोजन",
      role: "वегिटेटिव वृद्धि और पत्ती क्षेत्र",
      deficiencySymptoms: ["पुराने पत्ते हल्के हरे", "पौध रुके", "शाखाएँ कम"],
      excessSymptoms: ["नरम वृद्धि", "Thrips और माइट बढ़ते हैं", "फल देर से"],
      management: ["N बाँटकर दें", "फूल शुरू होने के बाद अधिक N से बचें"],
      recommendedFertilizers: ["Urea", "Calcium ammonium nitrate"],
    },
    {
      name: "पोटाश",
      role: "फल की गुणवत्ता, रोग सहनशीलता, जल नियमन",
      deficiencySymptoms: ["पत्ती किनारे झुलसे", "फल का रंग खराब", "कमज़ोर पौध"],
      excessSymptoms: ["Mg की कमी हो सकती है"],
      management: ["फल अवस्था में MOP / SOP", "ज़रूरत हो तो KNO₃ पत्ती 1%"],
      recommendedFertilizers: ["MOP", "SOP", "Potassium nitrate foliar"],
    },
    {
      name: "बोरॉन",
      role: "फूल और फल बनना",
      deficiencySymptoms: ["फूल झड़ना", "खोखले / फटे फल", "कोमल अंकुर भंगुर"],
      excessSymptoms: ["पत्ती की नोक झुलसना"],
      management: ["फूल अवस्था में Borax / solubor पत्ती 0.2%"],
      recommendedFertilizers: ["Borax", "Solubor foliar"],
    },
  ],
  harvesting: [
    "हरी मिर्च: फल सख्त और पूर्ण आकार पर काटें (कई बार)।",
    "सूखी मिर्च: फल लाल और पौध पर आंशिक सूखे हों तब काटें।",
    "सुबह तोड़ें; बाज़ार के लिए क्षतिग्रस्त फल न रखें।",
  ],
  yield: "हरी: 80–120 q/acre (hybrids); सूखी: 15–25 q/acre किस्म पर निर्भर",
  storage: [
    "हरी: ठंडी, हवादार पेटियाँ; 2–3 दिन में बाज़ार।",
    "सूखी: 8–10% नमी तक धूप में सुखाएँ; नमी से दूर सूखे गोदाम में रखें।",
  ],
  marketInformation: {
    majorMarkets: ["Guntur (AP)", "Khammam", "Byadgi (Karnataka)", "Delhi Azadpur", "Nagpur"],
    demand: "हरी के लिए साल भर मज़बूत मांग; सूखी मिर्च कटाई के बाद चरम",
    msp: "केंद्रीय MSP में नहीं — बाज़ार निर्धारित",
    priceTrend: "अस्थिर; गुणवत्ता (रंग, तीखापन) और निर्यात मांग प्रीमियम तय करती है",
  },
  faqs: [
    {
      question: "पत्ते मुड़ रहे हैं — क्या छिड़काव करूँ?",
      answer:
        "वायरस की सीधी दवा नहीं है। सफ़ेद मक्खी नियंत्रित करें (Pyriproxyfen / Diafenthiuron), गंभीर संक्रमित पौध हटाएँ, और अगले सीज़न प्रतिरोधी किस्म लगाएँ।",
    },
    {
      question: "थ्रिप्स और माइट में अंतर कैसे पहचानें?",
      answer:
        "थ्रिप्स: पत्ते ऊपर की ओर मुड़ते हैं, फल पर bird-eye निशान। पीला माइट: पत्ते नीचे की ओर मुड़ते हैं, संकरे/ताम्र कोमल पत्ते। उपचार अलग MoA समूह से करें।",
    },
    {
      question: "फल पर काले गड्ढेदार धब्बे क्यों?",
      answer:
        "ज़्यादातर anthracnose (Colletotrichum)। Mancozeb + Carbendazim छिड़काव, ड्रिप सिंचाई करें, संक्रमित फल खेत से हटाएँ।",
    },
  ],
};
