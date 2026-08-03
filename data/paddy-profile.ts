import type { CropManagementProfile } from "@/types/crop-management";

/**
 * Paddy (transplanted) — protection protocols aligned with
 * IRAC Ed. 11.5 / FRAC 2024 / HRAC numeric codes (user PDFs)
 * and common Indian market products in data/spray-products.ts.
 */
export const paddyProfile: CropManagementProfile = {
  slug: "paddy",
  name: "धान (रोपाई)",
  scientificName: "Oryza sativa L.",
  category: "अनाज",
  image: "/images/paddy.png",
  summary:
    "मुख्य अनाज फसल — सही जल प्रबंधन, संतुलित NPK और कुशी व बाली निकलने के समय IPM ज़रूरी है।",
  overview:
    "रोपाई धान भारत में सबसे ज़्यादा बोई जाने वाली चावल प्रणाली है। महत्वपूर्ण अवस्थाएँ: कुशी (15–45 DAS), बाली निकलना (45–60 DAS) और दाना भरना (75–105 DAS)। IRAC/FRAC समूह बदलकर छिड़काव करें — एक ही MoA लगातार दो बार न छिड़कें।",
  climate: "गर्म नम उष्णकटिबंधीय/उपोष्णकटिबंधीय; 20–35°C; 1000–2000 mm वर्षा या सिंचाई।",
  soil: "दोमट से दोमट; pH 5.5–7.0; अच्छी जल धारण क्षमता।",
  landPreparation: [
    "रोपाई धान के लिए गहरी जुताई और कुटाई।",
    "समान जल गहराई (2–5 cm) के लिए खेत समतल करें।",
    "अंतिम कुटाई के समय 10–12 t FYM/ha डालें।",
  ],
  seedSelection: [
    "प्रमाणित HYV या हाइब्रिड बीज अधिकृत स्रोतों से लें।",
    ">80% अंकुरण वाला बीज चुनें।",
  ],
  seedTreatment: [
    "Carbendazim 50 WP @ 2 g/kg seed (FRAC 1)।",
    "Trichoderma viride 1% WP @ 10 g/kg मिट्टी जनित रोगज़नकों के लिए।",
  ],
  sowingTime: [
    "नर्सरी: मई–जून (खरीफ); नवंबर–दिसंबर (कुछ क्षेत्रों में रबी)।",
    "25–30 दिन की पौध 2–3 पत्ती अवस्था में रोपें।",
    "खरीफ रोपाई का समय: जून–जुलाई।",
  ],
  seedRate: "16–20 kg/acre (नर्सरी बीज); मुख्य खेत में 2–3 पौध/गड्डा",
  spacing: "20 × 15 cm (रोपाई); उच्च घनत्व के लिए 20 × 10 cm",
  nursery: [
    "1.0 m चौड़ी उठी हुई क्यारियाँ जल निकासी नालियों के साथ।",
    "100 m² नर्सरी में 2 kg यूरिया + 2 kg SSP डालें।",
  ],
  transplanting: [
    "25–30 दिन की पौध, प्रति गड्डा 2–3 रोपें।",
    "रोपाई के तुरंत बाद 2–3 cm खड़ा पानी रखें।",
    "गहरी रोपाई से बचें — जड़ गर्दन मिट्टी की सतह पर हो।",
  ],
  irrigationSchedule: [
    "0–7 DAS: 2–3 cm खड़ा पानी।",
    "15–45 DAS (कुशी): उथला बाढ़ ~5 cm।",
    "45–60 DAS (बाली निकलना): सबसे महत्वपूर्ण — नमी की कमी न होने दें।",
    "60–75 DAS (फूल): लगातार उथली जलमग्नता।",
    "75–105 DAS: धीरे-धीरे पानी कम करें।",
    "कटाई से 7–10 दिन पहले खेत का पानी निकालें।",
  ],
  fertilizerSchedule: [
    "बेसल: N 60 + P₂O₅ 30 + K₂O 30 kg/ha + पूरा FYM।",
    "पहली टॉप-ड्रेस (25 DAS): Urea 50 kg/ha।",
    "दूसरी टॉप-ड्रेस (45 DAS): बाली निकलने पर Urea 50 kg/ha।",
    "कमी वाली मिट्टी में कुशी पर ZnSO₄ 25 kg/ha।",
  ],
  micronutrients: [
    "Zinc sulphate 25 kg/ha (Khaira रोग से बचाव)",
    "लोहे की कमी वाली मिट्टी में Iron sulphate पत्ती छिड़काव 0.5%",
    "ज़रूरत हो तो फूल अवस्था में Boron 0.2% पत्ती छिड़काव",
  ],
  growthStages: [
    { title: "रोपाई", period: "0–7 DAS", keyPoints: ["पौध स्थापित करें", "खड़ा पानी"] },
    { title: "कुशी", period: "15–45 DAS", keyPoints: ["अधिकतम कुश", "पहली N टॉप-ड्रेस", "BPH और ब्लास्ट पर नज़र"] },
    { title: "बाली निकलना", period: "45–60 DAS", keyPoints: ["नमी बहुत ज़रूरी", "दूसरी N", "तना छेदक / शीथ ब्लाइट"] },
    { title: "दाना भरना", period: "75–105 DAS", keyPoints: ["दाने का वज़न", "सिंचाई कम करें"] },
  ],
  interculturalOperations: [
    "रोपाई के 7–10 दिन के भीतर रिक्त स्थान भरें।",
    "जड़ी-बूटी नाशक न हो तो 20 और 40 DAS पर हाथ से निराई।",
  ],

  weedManagement: [
    {
      weedName: "साँवा (Barnyard Grass)",
      scientificName: "Echinochloa crus-galli",
      type: "घास",
      criticalPeriod: "0–45 DAS",
      preEmergenceHerbicide: "Pretilachlor 50 EC (e.g. Refit / Sofit) @ 0.6–0.75 kg a.i./ha at 3 DAS on moist soil",
      postEmergenceHerbicide: "Bispyribac-sodium 10 SC (e.g. Nominee Gold) @ 25 g a.i./ha at 15–20 DAS",
      hracGroup: "HRAC 15 (pre) / HRAC 2 (post)",
      dose: "Pre: 500 L पानी में 1.2–1.5 L/ha product; Post: जब खरपतवार 2–4 पत्ती — 250 ml/ha product",
    },
    {
      weedName: "मोथा (Flat Sedge)",
      scientificName: "Cyperus iria",
      type: "नरगल",
      criticalPeriod: "15–60 DAS",
      preEmergenceHerbicide: "Pretilachlor 50 EC + Pyrazosulfuron-ethyl 10 WP (tank mix or ready mix)",
      postEmergenceHerbicide: "Bispyribac-sodium 10 SC @ 25 g a.i./ha or Pyrazosulfuron 10 WP @ 20 g a.i./ha",
      hracGroup: "HRAC 15 + 2",
      dose: "Pyrazosulfuron 200 g/ha product at 3–5 DAS; maintain 5 cm standing water",
    },
    {
      weedName: "Monochoria / चौड़े पत्ते की खरपतवार",
      scientificName: "Monochoria vaginalis",
      type: "चौड़े पत्ते",
      criticalPeriod: "20–50 DAS",
      preEmergenceHerbicide: "Pretilachlor 50 EC @ 0.6 kg a.i./ha",
      postEmergenceHerbicide: "2,4-D Na salt 80 WP @ 0.5 kg a.i./ha (सिर्फ direct-seeded; basmati पर PI में न लगाएँ)",
      hracGroup: "HRAC 15 / HRAC 4",
      dose: "2,4-D: 625 g/ha product in 500 L water; hand weed at 20 & 40 DAS if needed",
    },
  ],

  pestManagement: [
    {
      pestName: "भूरा प्लांटहॉपर (BPH)",
      scientificName: "Nilaparvata lugens",
      identification:
        "कुश के निचले हिस्से पर छोटे भूरे हॉपर; खेत में गोल पीले धब्बे (हॉपरबर्न)।",
      symptoms: [
        "खेत में गोल पीले धब्बे",
        "हॉपरबर्न — पौध नीचे से सूख जाते हैं",
        "निचले पत्तों पर शहद और काली फफूंद",
        "गंभीर होने पर दाना भरना कम",
      ],
      etl: "5–10 hoppers/hill (वегिटेटिव); 10–20/hill (प्रजनन) — पौध के आधार पर गिनती करें",
      biologicalControl: [
        "Cyrtorhinus lividipennis (मिरिड बग) का संरक्षण करें",
        "शुरुआती व्यापक स्पेक्ट्रम छिड़काव से बचें — प्राकृतिक शत्रु मरते हैं",
        "भिगोने-सुखाने से BPH की संख्या कम होती है",
      ],
      chemicalControl: [
        "Buprofezin 25 SC (e.g. Applaud) — IRAC 16",
        "Pymetrozine 50 WG (e.g. Chess) — IRAC 9B",
        "Triflumezopyrim 106 SC (e.g. Pexalon) — IRAC 4E (बदलकर छिड़कें; IRAC 4A neonics लगातार न करें)",
        "लगातार छिड़काव में एक ही IRAC समूह न छिड़कें",
      ],
      iracGroup: "IRAC 16 / 9B / 4E",
      activeIngredient: "Buprofezin 25 SC",
      dose: "1.0 ml/L (≈200–250 ml/ha); PHI 14 days. Alternate with Pymetrozine 0.75 g/L or Triflumezopyrim 0.5 ml/L",
    },
    {
      pestName: "पीला तना छेदक",
      scientificName: "Scirpophaga incertulas",
      identification:
        "वегिटेटिव अवस्था में डेड हार्ट; प्रजनन अवस्था में सफ़ेद बाल; लार्वा तने के अंदर छेद करते हैं।",
      symptoms: [
        "डेड हार्ट — बीच की कल्ली सूखकर आसानी से निकल आती है",
        "सफ़ेद बाल — खाली, हल्की बाल",
        "तने में छेद और मल",
      ],
      etl: "5% डेड हार्ट (वегिटेटिव) या 1 egg mass/m²; 1% सफ़ेद बाल (प्रजनन)",
      biologicalControl: [
        "Trichogramma japonicum @ 50,000/ha साप्ताहिक × 6 releases from 30 DAS",
        "निगरानी के लिए Light traps @ 1/ha",
        "अंडे हटाने के लिए रोपाई से पहले पौध की नोक काटें",
      ],
      chemicalControl: [
        "Cartap hydrochloride 50 SP / 4G — IRAC 14",
        "Chlorantraniliprole 18.5 SC (e.g. Coragen / Rynaxypyr) — IRAC 28",
        "Fipronil 0.3 GR (e.g. Regent) नर्सरी/शुरुआती खेत में — IRAC 2B",
      ],
      iracGroup: "IRAC 14 / 28",
      activeIngredient: "Cartap hydrochloride 50 SP",
      dose: "1 kg/ha granules at tillering OR 1 g/L spray; Chlorantraniliprole 0.4 ml/L; PHI 21 days (cartap)",
    },
    {
      pestName: "पत्ती मोड़क",
      scientificName: "Cnaphalocrocis medinalis",
      identification:
        "पत्ते लंबवत मुड़कर सफ़ेद खुरचे जाते हैं; लार्वा मोड़ के अंदर।",
      symptoms: [
        "पत्तों का लंबवत मोड़",
        "पत्तों पर सफ़ेद खुरचे हुए धब्बे",
        "प्रकाश संश्लेषण और दाना भरना कम",
      ],
      etl: "1–2 freshly damaged leaves/hill या 10% पत्ते क्षतिग्रस्त",
      biologicalControl: [
        "Trichogramma छोड़ें",
        "अधिक नाइट्रोजन से बचें — पत्ती मोड़क बढ़ता है",
      ],
      chemicalControl: [
        "Flubendiamide 20 WG — IRAC 28",
        "Spinosad 45 SC — IRAC 5",
        "Chlorantraniliprole 18.5 SC — IRAC 28 (IRAC 5 के साथ बदलकर)",
      ],
      iracGroup: "IRAC 28 / 5",
      activeIngredient: "Flubendiamide 20 WG",
      dose: "0.25 g/L (≈50 g/ha); Spinosad 0.3 ml/L; PHI 14–21 days as per label",
    },
    {
      pestName: "धान आर्मीवर्म / झुंड वाला कीट",
      scientificName: "Spodoptera mauritia / Mythimna separata",
      identification:
        "लार्वा रात में पत्ते खाते हैं; बारिश के बाद रातों-रात पूरे हिस्से उजाड़ सकते हैं।",
      symptoms: [
        "पत्ते कंकाल जैसे या पूरी तरह खाए",
        "दिन में लार्वा मिट्टी/दरारों में छिपे",
        "बारिश के बाद तेज़ी से धब्बेदार नुकसान",
      ],
      etl: "1–2 larvae/hill या दिखाई देने वाले पत्ते उजाड़ने वाले धब्बे",
      biologicalControl: [
        "जहाँ संभव हो, लार्वा डूबाने के लिए खेत में थोड़ी देर पानी भरें",
        "पतंग निगरानी के लिए Light traps",
      ],
      chemicalControl: [
        "Emamectin benzoate 5 SG (e.g. Proclaim) — IRAC 6",
        "Chlorantraniliprole 18.5 SC — IRAC 28",
        "शाम को छिड़कें जब लार्वा सक्रिय हों",
      ],
      iracGroup: "IRAC 6 / 28",
      activeIngredient: "Emamectin benzoate 5 SG",
      dose: "0.4 g/L (≈80–100 g/ha); PHI 14 days",
    },
    {
      pestName: "हरा पत्ती हॉपर (GLH)",
      scientificName: "Nephotettix virescens",
      identification:
        "पत्तों पर हरे हॉपर; चावल टंग्रो वायरस का महत्वपूर्ण वाहक।",
      symptoms: [
        "पत्तों का पीलापन",
        "टंग्रो लगने पर पौध कमज़ोर",
        "ऊपरी पत्तों पर हॉपर की आबादी",
      ],
      etl: "5–10 hoppers/hill; क्षेत्र में टंग्रो का इतिहास हो तो जल्दी कार्रवाई करें",
      biologicalControl: [
        "खेत के आस-पास की खरपतवार मेज़बान हटाएँ",
        "गाँव में एक साथ बुवाई से वाहक दबाव कम होता है",
      ],
      chemicalControl: [
        "Imidacloprid 200 SL (e.g. Confidor) — IRAC 4A",
        "Thiamethoxam 25 WG (e.g. Actara) — IRAC 4A",
        "Acetamiprid 20 SP (e.g. Pride) — IRAC 4A — एक बार के बाद IRAC 4A से दूर रहें",
      ],
      iracGroup: "IRAC 4A",
      activeIngredient: "Imidacloprid 200 SL",
      dose: "0.3 ml/L; Thiamethoxam 0.2 g/L; PHI 14–21 days",
    },
  ],

  diseaseManagement: [
    {
      diseaseName: "धान ब्लास्ट",
      pathogen: "Magnaporthe oryzae (Pyricularia oryzae)",
      type: "फफूंद",
      symptoms: [
        "पत्तों पर हीरे के आकार के धब्बे, बीच में भूरा, किनारे भूरे",
        "नेक ब्लास्ट — बाल की गर्दन काली, दाने हल्के",
        "गाँठ सड़न से पौध टूट जाते हैं",
      ],
      favourableConditions: [
        "आर्द्रता >90%",
        "ठंडी रातें 20–25°C",
        "अधिक नाइट्रोजन",
        "पत्तों पर लंबे समय तक नमी",
      ],
      integratedManagement: [
        "अधिक N से बचें — Leaf Colour Chart (LCC) का उपयोग करें",
        "Silicon 200 kg/ha से गंभीरता कम",
        "जहाँ उपलब्ध हो, मध्यम प्रतिरोधी किस्में लगाएँ",
        "FRAC समूह बदलें — Tricyclazole FRAC 16.1 है, DMI group 3 नहीं",
      ],
      biologicalControl: ["Pseudomonas fluorescens बीज उपचार 10 g/kg"],
      chemicalControl: [
        "Tricyclazole 75 WP (e.g. Beam / Sivic) — FRAC 16.1 @ boot leaf",
        "Isoprothiolane 40 EC — FRAC 6",
        "Azoxystrobin 250 SC — FRAC 11 (बदलकर; प्रतिरोध का उच्च जोखिम)",
        "Nativo (Trifloxystrobin + Tebuconazole) — FRAC 11+3",
      ],
      fracGroup: "FRAC 16.1 / 6 / 11",
      activeIngredient: "Tricyclazole 75 WP",
      dose: "0.6 g/L (≈120 g/ha) at boot leaf; repeat after 10 days if needed; PHI 21 days",
      waitingPeriod: "21 days",
    },
    {
      diseaseName: "शीथ ब्लाइट",
      pathogen: "Rhizoctonia solani AG-1 IA",
      type: "फफूंद",
      symptoms: [
        "जल रेखा के पास पत्ती की शीथ पर अंडाकार हरा-भूरा धब्बे",
        "धब्बे मिलकर शीथ और पत्ते सूख जाते हैं",
        "गंभीर होने पर खाली दाने और पौध गिराव",
      ],
      favourableConditions: [
        "उच्च आर्द्रता और घना पौध",
        "अधिक नाइट्रोजन",
        "25–32°C",
        "कम दूरी",
      ],
      integratedManagement: [
        "हवा के लिए व्यापक दूरी",
        "संतुलित NPK — अधिक N से बचें",
        "कटाई के बाद संक्रमित अवशेष हटाएँ",
      ],
      biologicalControl: ["Trichoderma harzianum मिट्टी में 2.5 kg/ha"],
      chemicalControl: [
        "Validamycin 3 L — FRAC 26",
        "Hexaconazole 5 EC — FRAC 3",
        "Propiconazole 25 EC (e.g. Tilt) — FRAC 3 (Validamycin के साथ बदलकर)",
      ],
      fracGroup: "FRAC 26 / 3",
      activeIngredient: "Validamycin 3 L",
      dose: "2.5 ml/L at first symptom; Hexaconazole 1 ml/L alternate spray; PHI 15 days",
      waitingPeriod: "15 days",
    },
    {
      diseaseName: "जीवाणु पत्ती झुलसा (BLB)",
      pathogen: "Xanthomonas oryzae pv. oryzae",
      type: "जीवाणु",
      symptoms: [
        "पत्ती के किनारों पर पानी से भरे धब्बे, पीले फिर सफ़ेद हो जाते हैं",
        "Kresek — पौध/कुश मुरझाना",
        "सुबह धब्बों पर दूधिया जीवाणु स्राव",
      ],
      favourableConditions: [
        "भारी बारिश और हवा",
        "अधिक नाइट्रोजन",
        "तूफ़ान या कीटों से घाव",
      ],
      integratedManagement: [
        "प्रतिरोधी किस्में (IR 64, Swarna-Sub1 जहाँ उपयुक्त)",
        "अधिक N से बचें",
        "छज्जा आर्द्रता कम करने के लिए थोड़ी देर पानी निकालें",
        "औज़ार साफ़ रखें, गीले खेत में काम न करें",
      ],
      biologicalControl: ["Pseudomonas fluorescens पत्ती छिड़काव 10 g/L निवारक रूप में"],
      chemicalControl: [
        "Streptocycline 90 SP (streptomycin + tetracycline) — FRAC 25+41",
        "Copper oxychloride 50 WP (e.g. Blitox) — FRAC M1",
        "बेहतर नियंत्रण के लिए Streptocycline + Copper टैंक-मिक्स",
      ],
      fracGroup: "FRAC 25 + M1",
      activeIngredient: "Streptocycline + Copper oxychloride",
      dose: "Streptocycline 0.15 g/L + Copper oxychloride 3 g/L; 2 sprays at 10-day interval",
      waitingPeriod: "15 days",
    },
    {
      diseaseName: "भूरा धब्बा",
      pathogen: "Bipolaris oryzae (Helminthosporium oryzae)",
      type: "फफूंद",
      symptoms: [
        "पत्तों पर अंडाकार भूरे धब्बे, बीच में भूरा",
        "दाने की पपड़ी पर धब्बे — दाने का रंग बिगड़ना",
        "पोषक तत्व कम मिट्टी में अधिक गंभीर",
      ],
      favourableConditions: [
        "पोषक तत्व की कमी (विशेषकर K, Si)",
        "जल तनाव",
        "उच्च आर्द्रता",
      ],
      integratedManagement: [
        "संतुलित खाद — K और Zn की कमी दूर करें",
        "स्वस्थ बीज का उपयोग",
        "अवशेष प्रबंधन के बिना लगातार धान-धान से बचें",
      ],
      biologicalControl: ["Trichoderma से बीज उपचार 10 g/kg"],
      chemicalControl: [
        "Mancozeb 75 WP — FRAC M3",
        "Propiconazole 25 EC — FRAC 3",
        "Carbendazim 50 WP — FRAC 1 (बीज उपचार बेहतर)",
      ],
      fracGroup: "FRAC M3 / 3",
      activeIngredient: "Mancozeb 75 WP",
      dose: "2 g/L foliar; Propiconazole 1 ml/L if severe; PHI 15–21 days",
      waitingPeriod: "15 days",
    },
    {
      diseaseName: "झूठा कंड",
      pathogen: "Ustilaginoidea virens",
      type: "फफूंद",
      symptoms: [
        "दाने की जगह नारंगी से हरा-काला कंड",
        "प्रति बाल कुछ से कई दाने प्रभावित",
        "फूल के बाद देर से संक्रमण",
      ],
      favourableConditions: [
        "फूल अवस्था में उच्च आर्द्रता",
        "बाली निकलने पर अधिक नाइट्रोजन",
        "देर पकने वाली किस्में",
      ],
      integratedManagement: [
        "बाली निकलने पर अधिक N से बचें",
        "बीज खेत से संक्रमित बाल हटाएँ",
        "संक्रमित अवशेष की गहरी जुताई",
      ],
      biologicalControl: ["कोई मज़बूत जैव नियंत्रण नहीं — boot अवस्था में सांस्कृतिक + रासायनिक पर ध्यान"],
      chemicalControl: [
        "Propiconazole 25 EC — FRAC 3 at boot leaf to early flowering",
        "Copper oxychloride 50 WP — FRAC M1",
      ],
      fracGroup: "FRAC 3 / M1",
      activeIngredient: "Propiconazole 25 EC",
      dose: "1 ml/L at boot leaf stage; PHI 30 days",
      waitingPeriod: "30 days",
    },
  ],

  physiologicalDisorders: [
    "Akiochi (straighthead): ज़िंक की कमी + निकासी वाली मिट्टी में जैविक पदार्थ का प्रभाव।",
    "Chalky grain: दाना भरने के समय पोटाश की कमी।",
    "Khaira रोग: ज़िंक की कमी — मध्य शिरा पर जंग जैसे भूरे धब्बे।",
  ],
  nutrientDeficiencies: [
    {
      name: "नाइट्रोजन",
      role: "कुश की संख्या, पत्ती क्षेत्र, दाने में प्रोटीन",
      deficiencySymptoms: ["पुराने पत्ते हल्के पीले", "कुश कम", "विकास रुका"],
      excessSymptoms: ["गहरे हरे, घने पौध", "ब्लास्ट और BPH बढ़ते हैं", "पौध गिराव"],
      management: ["25 और 45 DAS पर N बाँटकर दें", "N प्रबंधन के लिए LCC का उपयोग"],
      recommendedFertilizers: ["Urea", "Neem-coated urea", "DAP basal"],
    },
    {
      name: "ज़िंक",
      role: "एंजाइम सक्रियता; कुश और दाना बनना",
      deficiencySymptoms: ["Khaira — मध्य शिरा पर भूरे जंग जैसे धब्बे", "खेत में भूरे धूल जैसे धब्बे"],
      excessSymptoms: ["लोहे की कमी हो सकती है"],
      management: ["रोपाई पर ZnSO₄ 25 kg/ha", "कुशी पर पत्ती छिड़काव 0.5% ZnSO₄"],
      recommendedFertilizers: ["Zinc sulphate heptahydrate"],
    },
    {
      name: "लोहा",
      role: "क्लोरोफिल बनना",
      deficiencySymptoms: ["नए पत्तों पर शिराओं के बीच पीलापन", "गंभीर होने पर पत्ते सफ़ेद"],
      excessSymptoms: ["दुर्लभ; Mn की कमी हो सकती है"],
      management: ["चूने वाली मिट्टी में FeSO₄ पत्ती छिड़काव 0.5–1.0%"],
      recommendedFertilizers: ["Ferrous sulphate foliar"],
    },
  ],
  harvesting: [
    "80% दाने सुनहरे पीले हों तब काटें (20–22% नमी)।",
    "ज़मीन से 10–15 cm ऊपर काटें।",
    "24–48 घंटे के भीतर मड़ाई करें।",
  ],
  yield: "40–55 q/ha (रोपाई HYV); SRI से 60+ q/ha",
  storage: [
    "भंडारण से पहले 14% नमी तक सुखाएँ।",
    "लंबे समय के लिए Hermetic storage या phosphine fumigation।",
  ],
  marketInformation: {
    majorMarkets: ["Karnal (Haryana)", "Ludhiana (Punjab)", "Delhi Azadpur", "Kolkata", "Hyderabad"],
    demand: "स्थिर मुख्य मांग; बासमती को निर्यात प्रीमियम",
    msp: "₹2,300/quintal (Common Grade, 2025-26)",
    priceTrend: "खरीफ में मध्यम ऊपर; बासमती अक्टूबर–दिसंबर में चरम",
  },
  faqs: [
    {
      question: "धान की सिंचाई के लिए सबसे महत्वपूर्ण समय कब है?",
      answer:
        "बाली निकलना (45–60 DAS) सबसे महत्वपूर्ण है — इस समय नमी की कमी से उपज 30–50% घट सकती है।",
    },
    {
      question: "BPH पर छिड़काव काम क्यों नहीं करा?",
      answer:
        "अक्सर MoA बदलाव गलत होता है या केवल ऊपरी पत्तों पर छिड़काव होता है। BPH पौध के निचले हिस्से पर बैठता है — सीधे आधार पर छिड़कें और IRAC 16 / 9B / 4E बदलकर छिड़कें। IRAC 4A neonics बार-बार न करें।",
    },
    {
      question: "Tricyclazole किस FRAC समूह में है?",
      answer:
        "FRAC 16.1 (melanin biosynthesis), FRAC 3 नहीं। रोटेशन योजना में इसे DMI/triazole न समझें।",
    },
  ],
};
