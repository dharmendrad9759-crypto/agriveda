export interface Crop {
  slug: string;
  name: string;
  image: string;
  category: "Cereals" | "Vegetables" | "Pulses" | "Millets" | "Cash-Crops";
  scientificName: string;
  overview: string;
  durationDays: string;
  estimatedYield: string;
  seedRate: string;
  spacing: string;
  suitableSeason: string;
  suitableSoil: string;
  climate: string;
  sowingGuide: {
    bestSowingTime: string;
    seedRate: string;
    seedTreatment: string;
    spacing: string;
    sowingMethod: string;
  };
  fertilizerSchedule: {
    basalDose: string[];
    stageWise: { stage: string; details: string[] }[];
    micronutrients: string[];
    foliarSpray: string[];
  };
  irrigationManagement: {
    waterRequirement: string;
    criticalStages: string[];
    schedule: string[];
  };
  cropProtection: {
    majorPests: string[];
    majorDiseases: string[];
    weedManagement: string[];
    symptoms: string[];
    prevention: string[];
    control: string[];
  };
  nutrientDeficiencies: {
    nutrient: string;
    symptoms: string;
    cause: string;
    solution: string;
  }[];
  harvestAndYield: {
    harvestingTime: string;
    maturitySigns: string[];
    yield: string;
    storageTips: string[];
  };
  marketInformation: {
    majorMarkets: string[];
    demand: string;
    msp: string;
    priceTrend: string;
  };
}

const baseCrop = {
  image: "",
  durationDays: "90-120 दिन",
  estimatedYield: "18-25 क्विंटल प्रति एकड़",
  seedRate: "15-25 kg/acre",
  spacing: "20 × 15 cm",
  suitableSeason: "खरीफ",
  suitableSoil: "अच्छी जल निकासी वाली दोमट मिट्टी",
  climate: "गर्म और धूप वाला मौसम",
  sowingGuide: {
    bestSowingTime: "शुरुआती मौसम",
    seedRate: "15-25 kg/acre",
    seedTreatment: "फफूंदनाशक और जैव उर्वरक से बीज उपचार",
    spacing: "20 × 15 cm",
    sowingMethod: "पंक्ति बुवाई या रोपाई",
  },
  fertilizerSchedule: {
    basalDose: ["खाद और संतुलित बुनियादी उर्वरक डालें"],
    stageWise: [{ stage: "शुरुआती वृद्धि", details: ["हल्का नाइट्रोजन और फास्फोरस दें"] }],
    micronutrients: ["जरूरत अनुसार zinc sulfate और boron"],
    foliarSpray: ["महत्वपूर्ण वृद्धि अवस्था में पर्ण स्प्रे"],
  },
  irrigationManagement: {
    waterRequirement: "नियमित लेकिन अधिक सिंचाई न करें",
    criticalStages: ["अंकुरण", "फूल आना"],
    schedule: ["ऊपरी मिट्टी सूखने पर सिंचाई करें"],
  },
  cropProtection: {
    majorPests: ["एफिड", "थ्रिप्स"],
    majorDiseases: ["पत्ती झुलसन", "जड़ सड़न"],
    weedManagement: ["समय पर निराई और मल्चिंग"],
    symptoms: ["पीलापन", "वृद्धि रुकना"],
    prevention: ["स्वच्छ बीज और उचित दूरी रखें"],
    control: ["अनुशंसित कीटनाशक और जैविक उपाय अपनाएं"],
  },
  nutrientDeficiencies: [
    { nutrient: "Nitrogen", symptoms: "पुरानी पत्तियां पीली होना", cause: "मिट्टी में नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
    { nutrient: "Phosphorus", symptoms: "जड़ की वृद्धि कमजोर", cause: "उपलब्ध फास्फोरस कम", solution: "DAP या SSP डालें" },
    { nutrient: "Potassium", symptoms: "पत्ती के किनारे जलना", cause: "पोटाश कम", solution: "MOP डालें" },
    { nutrient: "Zinc", symptoms: "शिराओं के बीच पीलापन", cause: "मिट्टी में जिंक कम", solution: "zinc sulfate डालें" },
    { nutrient: "Iron", symptoms: "नई पत्तियां फीकी पड़ना", cause: "लोहे की कमी", solution: "iron chelate या पर्ण iron स्प्रे करें" },
    { nutrient: "Boron", symptoms: "कमजोर वृद्धि और फूल कम आना", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
  ],
  harvestAndYield: {
    harvestingTime: "पूर्ण परिपक्वता पर",
    maturitySigns: ["एक समान रंग", "फली या फल सूखना"],
    yield: "अच्छी बाजार योग्य पैदावार",
    storageTips: ["भंडारण से पहले अच्छी तरह सुखाएं", "साफ बर्तनों में रखें"],
  },
  marketInformation: {
    majorMarkets: ["Local mandi", "Regional traders"],
    demand: "ताजा बाजार में स्थिर मांग",
    msp: "वर्तमान राज्य MSP देखें",
    priceTrend: "मौसमी भाव में उतार-चढ़ाव",
  },
};

export const rawCropsData: Crop[] = [
  {
    ...baseCrop,
    slug: "tomato",
    name: "Tomato (टमाटर)",
    category: "Vegetables",
    scientificName: "Solanum lycopersicum",
    overview: "संतुलित पोषण, नियमित सिंचाई और शुरुआती कीट नियंत्रण पर अच्छी प्रतिक्रिया देने वाली उच्च मूल्य की सब्जी।",
    durationDays: "90-100 दिन",
    estimatedYield: "180-220 क्विंटल प्रति एकड़",
    seedRate: "12000-15000 plants/acre",
    spacing: "75 × 45 cm",
    suitableSeason: "रबी और वसंत",
    suitableSoil: "अच्छी जैविक सामग्री वाली, जल निकासी वाली दोमट मिट्टी",
    climate: "गर्म और धूप वाला मौसम; पाला और जलभराव से बचें",
    sowingGuide: {
      bestSowingTime: "नर्सरी अंतिम गर्मी में; रोपाई शुरुआती शरद में",
      seedRate: "12000-15000 पौधे/acre",
      seedTreatment: "फफूंदनाशक और Trichoderma से बीज उपचार",
      spacing: "75 × 45 cm",
      sowingMethod: "मेड़ पर स्वस्थ पौधे लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "MOP 25 kg/acre", "Compost 4-5 t/acre"],
      stageWise: [
        { stage: "वनस्पति वृद्धि अवस्था", details: ["19:19:19 साप्ताहिक 1 kg/acre"] },
        { stage: "फूल आने की अवस्था", details: ["MKP 2 kg/acre और boron 250 g/acre"] },
      ],
      micronutrients: ["Zinc sulfate 2-3 kg/acre", "Boron 250 g/acre"],
      foliarSpray: ["फल बनने पर calcium nitrate स्प्रे", "हर 15 दिन सूक्ष्म पोषक मिश्रण"],
    },
    irrigationManagement: {
      waterRequirement: "शुरुआती वृद्धि और फल बनने में बार-बार हल्की सिंचाई",
      criticalStages: ["रोपाई", "फूल आना", "फल बढ़ना"],
      schedule: ["सूखे मौसम में हर 3-4 दिन सिंचाई", "जलभराव से बचें"],
    },
    cropProtection: {
      majorPests: ["Whitefly", "Thrips", "Fruit borer"],
      majorDiseases: ["Early blight", "Late blight", "Root rot"],
      weedManagement: ["मल्चिंग और हाथ से निराई"],
      symptoms: ["पत्ती पीली होना", "फल सड़ना", "पत्ती मुड़ना"],
      prevention: ["रोग-मुक्त पौधे लगाएं", "दूरी और हवा का प्रवाह बनाए रखें"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक", "संक्रमित पत्तियां हटाएं"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पुरानी पत्तियां फीकी पड़ना", cause: "नाइट्रोजन की कमी", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Zinc", symptoms: "पत्तियों पर सफेद धारियां", cause: "मिट्टी में जिंक कम", solution: "zinc sulfate पर्ण स्प्रे" },
      { nutrient: "Boron", symptoms: "फूल झड़ना और फल कम बनना", cause: "बोरॉन की कमी", solution: "boron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "रोपाई के 75-90 दिन बाद",
      maturitySigns: ["लाल रंग आना", "फल सख्त होना"],
      yield: "180-220 q/acre",
      storageTips: ["पूरा रंग आने पर काटें", "ठंडी छाया में रखें"],
    },
    marketInformation: {
      majorMarkets: ["Local mandi", "Processing units", "Vegetable wholesalers"],
      demand: "ताजा बाजार में मजबूत मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "मौसम और बाजार पर निर्भर",
    },
  },
  {
    ...baseCrop,
    slug: "paddy",
    name: "Paddy / Rice (धान)",
    category: "Cereals",
    scientificName: "Oryza sativa",
    overview: "समय पर पानी प्रबंधन, संतुलित पोषण और कीटों के शुरुआती नियंत्रण की जरूरत वाली मुख्य अनाज फसल।",
    durationDays: "120-150 दिन",
    estimatedYield: "20-28 क्विंटल प्रति एकड़",
    seedRate: "20-25 kg/acre",
    spacing: "20 × 15 cm",
    suitableSeason: "खरीफ",
    suitableSoil: "अच्छी जल धारण क्षमता वाली चिकनी दोमट या भारी मिट्टी",
    climate: "अच्छी धूप के साथ गर्म और आर्द्र मौसम",
    sowingGuide: {
      bestSowingTime: "नर्सरी जून-जुलाई में; 20-25 दिन बाद रोपाई",
      seedRate: "20-25 kg/acre",
      seedTreatment: "फफूंदनाशक और जैव उर्वरक से बीज उपचार",
      spacing: "20 × 15 cm",
      sowingMethod: "जुताई वाले खेत में पौधे लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["Zinc sulfate 10 kg/acre", "DAP 50 kg/acre", "MOP 20 kg/acre"],
      stageWise: [
        { stage: "कल्ले निकलना", details: ["urea को विभाजित मात्रा में डालें"] },
        { stage: "बाली बनना", details: ["ऊपरी खाद और potash डालें"] },
      ],
      micronutrients: ["बुनियादी अवस्था में zinc", "बाली अवस्था में boron"],
      foliarSpray: ["बाली अवस्था में NPK पर्ण स्प्रे", "कमी दिखे तो boron स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "कल्ले और बाली बनने में 2-5 cm खड़ा पानी रखें",
      criticalStages: ["कल्ले निकलना", "बाली बनना", "दाना भरना"],
      schedule: ["नियमित सिंचाई करें", "कटाई से पहले पानी निकालें"],
    },
    cropProtection: {
      majorPests: ["Stem borer", "Brown plant hopper", "Leaf folder"],
      majorDiseases: ["Blast", "BLB", "Sheath blight"],
      weedManagement: ["अंकुरण पूर्व खरपतवारनाशक", "शुरुआत में हाथ से निराई"],
      symptoms: ["मुरझाना", "भूरे धब्बे", "पत्ती पर दाग"],
      prevention: ["प्रतिरोधी किस्म लगाएं", "खेत साफ रखें"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक", "संक्रमित पौधे हटाएं"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पुरानी पत्तियां पीली होना", cause: "नाइट्रोजन की कम उपलब्धता", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Zinc", symptoms: "खैरा जैसे पीले धब्बे", cause: "मिट्टी में जिंक कम", solution: "zinc sulfate डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती के किनारे जलना", cause: "पोटाश कम", solution: "MOP डालें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 105-140 दिन बाद",
      maturitySigns: ["बाली सुनहरी होना", "दाने सख्त होना"],
      yield: "20-28 q/acre",
      storageTips: ["दाने सुरक्षित नमी तक सुखाएं", "नमी-रोधी बोरियों में रखें"],
    },
    marketInformation: {
      majorMarkets: ["Rice mandis", "Millers", "Procurement centers"],
      demand: "मजबूत और स्थिर मांग",
      msp: "वर्तमान MSP देखें",
      priceTrend: "मध्यम मौसमी उतार-चढ़ाव",
    },
  },
  {
    ...baseCrop,
    slug: "soybean",
    name: "Soybean (सोयाबीन)",
    category: "Pulses",
    scientificName: "Glycine max",
    overview: "समय पर बुवाई, जड़ पर अच्छे गांठ बनने और कीटों से सुरक्षा चाहने वाली लाभदायक दलहन फसल।",
    durationDays: "90-110 दिन",
    estimatedYield: "10-15 क्विंटल प्रति एकड़",
    seedRate: "60-70 kg/acre",
    spacing: "45 × 5 cm",
    suitableSeason: "खरीफ",
    suitableSoil: "अच्छी जल निकासी वाली काली या दोमट मिट्टी",
    climate: "मध्यम आर्द्रता वाला गर्म मौसम",
    sowingGuide: {
      bestSowingTime: "जून-जुलाई, पहली मानसून बारिश के बाद",
      seedRate: "60-70 kg/acre",
      seedTreatment: "Rhizobium और carbendazim से बीज उपचार",
      spacing: "45 × 5 cm",
      sowingMethod: "सही गहराई पर पंक्ति बुवाई",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "Sulfur 10 kg/acre"],
      stageWise: [{ stage: "वनस्पति वृद्धि अवस्था", details: ["जरूरत हो तो हल्का नाइट्रोजन दें"] }],
      micronutrients: ["जरूरत अनुसार molybdenum और zinc"],
      foliarSpray: ["फली बनने की अवस्था में पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "सूखे और फूल आने पर हल्की सिंचाई",
      criticalStages: ["अंकुरण", "फूल आना", "फली भरना"],
      schedule: ["ऊपरी मिट्टी सूखने पर सिंचाई करें"],
    },
    cropProtection: {
      majorPests: ["Stem fly", "Leaf eating caterpillar", "Whitefly"],
      majorDiseases: ["Yellow mosaic", "Rust", "Charcoal rot"],
      weedManagement: ["दो बार हाथ से निराई या अंकुरण पूर्व खरपतवारनाशक"],
      symptoms: ["पीलापन", "पत्ती मुड़ना", "फली झड़ना"],
      prevention: ["रोग-मुक्त बीज लगाएं", "घनी बुवाई से बचें"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पत्तियां फीकी", cause: "जड़ पर गांठ कम बनना", solution: "Rhizobium और हल्का नाइट्रोजन दें" },
      { nutrient: "Potassium", symptoms: "पत्ती के किनारे पीले होना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Iron", symptoms: "नई पत्तियां फीकी", cause: "लोहे की कमी", solution: "पर्ण iron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 90-110 दिन बाद",
      maturitySigns: ["फली भूरी होना", "पौधे का हरा रंग हटना"],
      yield: "10-15 q/acre",
      storageTips: ["फली अच्छी तरह सुखाएं", "साफ बोरियों में रखें"],
    },
    marketInformation: {
      majorMarkets: ["Pulse traders", "Oil mills", "Local mandi"],
      demand: "खाद्य तेल और दाल के लिए अच्छी मांग",
      msp: "बाजार और राज्य सहायता देखें",
      priceTrend: "आपूर्ति और तेल की मांग से भाव बदलता है",
    },
  },
  {
    ...baseCrop,
    slug: "maize",
    name: "Maize (मक्का)",
    category: "Cereals",
    scientificName: "Zea mays",
    overview: "तेजी से बढ़ने वाली अनाज फसल; अच्छी पैदावार के लिए मजबूत पोषण और समय पर सिंचाई जरूरी।",
    durationDays: "90-110 दिन",
    estimatedYield: "20-30 क्विंटल प्रति एकड़",
    seedRate: "8-10 kg/acre",
    spacing: "60 × 20 cm",
    suitableSeason: "खरीफ, रबी और जायद",
    suitableSoil: "जल निकासी वाली उपजाऊ दोमट",
    climate: "चमकीली धूप वाला गर्म और आर्द्र मौसम",
    sowingGuide: {
      bestSowingTime: "मानसून से पहले से मानसून शुरू तक",
      seedRate: "8-10 kg/acre",
      seedTreatment: "फफूंदनाशक और जैव उर्वरक से बीज उपचार",
      spacing: "60 × 20 cm",
      sowingMethod: "सही गहराई पर पंक्ति बुवाई",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "MOP 25 kg/acre"],
      stageWise: [{ stage: "शुरुआती वृद्धि", details: ["नाइट्रोजन को विभाजित मात्रा में डालें"] }],
      micronutrients: ["जरूरत अनुसार zinc और sulfur"],
      foliarSpray: ["घुटने की ऊंचाई पर NPK पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "मध्यम सिंचाई, खासकर बाली और रेशम निकलने पर",
      criticalStages: ["अंकुरण", "बाली निकलना", "रेशम निकलना"],
      schedule: ["सूखे में सिंचाई करें", "रेशम निकलने पर पानी की कमी न होने दें"],
    },
    cropProtection: {
      majorPests: ["Stem borer", "Fall armyworm", "Aphids"],
      majorDiseases: ["Turcicum leaf blight", "Maydis leaf blight"],
      weedManagement: ["अंकुरण पूर्व खरपतवारनाशक और गुड़ाई"],
      symptoms: ["पत्ती में छेद", "मुरझाना", "पीलापन"],
      prevention: ["प्रतिरोधी संकर लगाएं", "खेत साफ रखें"],
      control: ["जल्दी अनुशंसित नियंत्रण उपाय अपनाएं"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पत्तियां समान हल्की हरी", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती के किनारे भूरे होना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Zinc", symptoms: "शिराओं के बीच धारियां", cause: "जिंक कम", solution: "zinc sulfate डालें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 90-110 दिन बाद",
      maturitySigns: ["भुट्टे का छिलका सूखना", "दाने सख्त होना"],
      yield: "20-30 q/acre",
      storageTips: ["भंडारण से पहले दाने सुखाएं", "साफ बोरियों में रखें"],
    },
    marketInformation: {
      majorMarkets: ["Feed mills", "Grain traders", "Local mandi"],
      demand: "चारे और खाने के लिए अधिक मांग",
      msp: "स्थानीय बाजार भाव देखें",
      priceTrend: "कम आपूर्ति में भाव बढ़ते हैं",
    },
  },
  {
    ...baseCrop,
    slug: "moongfali",
    name: "Groundnut / Peanut (मूंगफली)",
    category: "Pulses",
    scientificName: "Arachis hypogaea",
    overview: "अच्छे फली विकास, संतुलित पोषण और समय पर सिंचाई पर सबसे अच्छा प्रदर्शन करने वाली मूल्यवान तिलहन फसल।",
    durationDays: "100-120 दिन",
    estimatedYield: "12-18 क्विंटल प्रति एकड़",
    seedRate: "80-100 kg/acre",
    spacing: "30 × 10 cm",
    suitableSeason: "खरीफ",
    suitableSoil: "अच्छी जल निकासी वाली बलुई दोमट",
    climate: "मध्यम वर्षा वाला गर्म मौसम",
    sowingGuide: {
      bestSowingTime: "जून-जुलाई, मानसून की बारिश के बाद",
      seedRate: "80-100 kg/acre",
      seedTreatment: "फफूंदनाशक और Rhizobium से बीज उपचार",
      spacing: "30 × 10 cm",
      sowingMethod: "5 cm गहराई पर पंक्ति बुवाई",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "Gypsum 200 kg/acre"],
      stageWise: [{ stage: "पेगिंग अवस्था", details: ["potassium और gypsum डालें"] }],
      micronutrients: ["फली भरने में boron और calcium सहायक"],
      foliarSpray: ["फली विकास के दौरान पोषक पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "बुवाई और फली बनने पर हल्की सिंचाई",
      criticalStages: ["फूल आना", "पेगिंग", "फली भरना"],
      schedule: ["जलभराव से बचें", "सूखे में सिंचाई करें"],
    },
    cropProtection: {
      majorPests: ["Leaf miner", "Aphids", "Termites"],
      majorDiseases: ["Tikka leaf spot", "Collar rot"],
      weedManagement: ["दो बार हाथ से निराई और मल्चिंग"],
      symptoms: ["पत्ती पर दाग", "पौधे रुकना", "फली कम भरना"],
      prevention: ["स्वच्छ बीज और उचित दूरी रखें"],
      control: ["अनुशंसित फफूंदनाशक और कीटनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Phosphorus", symptoms: "जड़ और फली की वृद्धि कम", cause: "फास्फोरस कम", solution: "DAP या SSP डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती के किनारे जलना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Boron", symptoms: "फली कम भरना", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 100-120 दिन बाद",
      maturitySigns: ["फली गहरे रंग की", "पौधे जल्दी सूखना"],
      yield: "12-18 q/acre",
      storageTips: ["भंडारण से पहले फली सुखाएं", "नमी से दूर रखें"],
    },
    marketInformation: {
      majorMarkets: ["Oil mills", "Groundnut traders", "Local mandi"],
      demand: "खाद्य तेल के लिए अच्छी मांग",
      msp: "वर्तमान सहायता मूल्य देखें",
      priceTrend: "तिलहन बाजार के साथ जुड़ा",
    },
  },
  {
    ...baseCrop,
    slug: "chilli",
    name: "Chilli (मिर्च)",
    category: "Vegetables",
    scientificName: "Capsicum annuum",
    overview: "नियमित पोषण, समय पर सिंचाई और मजबूत कीट नियंत्रण चाहने वाली उच्च मूल्य की सब्जी।",
    durationDays: "90-120 दिन",
    estimatedYield: "80-120 क्विंटल प्रति एकड़",
    seedRate: "200-250 g/acre",
    spacing: "60 × 45 cm",
    suitableSeason: "रबी और वसंत",
    suitableSoil: "जैविक सामग्री से समृद्ध, जल निकासी वाली दोमट",
    climate: "अच्छी धूप वाला गर्म और आर्द्र मौसम",
    sowingGuide: {
      bestSowingTime: "नर्सरी अंतिम गर्मी में; 30-35 दिन बाद रोपाई",
      seedRate: "200-250 g/acre",
      seedTreatment: "फफूंदनाशक और Trichoderma से बीज उपचार",
      spacing: "60 × 45 cm",
      sowingMethod: "स्वस्थ पौधे लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 4-5 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "फल बनने की अवस्था", details: ["potash और calcium डालें"] }],
      micronutrients: ["Boron, zinc और calcium"],
      foliarSpray: ["हर 15 दिन सूक्ष्म पोषक पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "फूल और फल बनने में नियमित सिंचाई",
      criticalStages: ["रोपाई", "फूल आना", "फल बनना"],
      schedule: ["मिट्टी नम रखें, जलभराव न हो"],
    },
    cropProtection: {
      majorPests: ["Thrips", "Whitefly", "Fruit borer"],
      majorDiseases: ["Leaf curl", "Dieback", "Powdery mildew"],
      weedManagement: ["मल्चिंग और नियमित निराई"],
      symptoms: ["पत्ती मुड़ना", "फल झड़ना", "पीलापन"],
      prevention: ["प्रतिरोधी किस्म लगाएं", "भीड़ न लगाएं"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पत्तियां फीकी", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती की नोक जलना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Boron", symptoms: "फल कम बनना", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "रोपाई के 90-120 दिन बाद",
      maturitySigns: ["फल चमकदार और गहरा होना", "फली सख्त"],
      yield: "80-120 q/acre",
      storageTips: ["भंडारण से पहले सुखाकर छांटें", "ठंडी जगह रखें"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable market", "Spice traders", "Processing units"],
      demand: "ताजा और मसाला बाजार में अधिक मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "मौसम और गुणवत्ता पर निर्भर",
    },
  },
  {
    ...baseCrop,
    slug: "cauliflower",
    name: "Cauliflower (फूलगोभी)",
    category: "Vegetables",
    scientificName: "Brassica oleracea var. botrytis",
    overview: "ठंडे मौसम की सब्जी; सावधानी से पोषण संतुलन और कीट-पानी तनाव का प्रबंधन जरूरी।",
    durationDays: "70-90 दिन",
    estimatedYield: "150-220 क्विंटल प्रति एकड़",
    seedRate: "400-500 g/acre",
    spacing: "60 × 45 cm",
    suitableSeason: "रबी",
    suitableSoil: "उपजाऊ और जल निकासी वाली दोमट",
    climate: "मध्यम नमी वाला ठंडा मौसम",
    sowingGuide: {
      bestSowingTime: "नर्सरी अंतिम गर्मी में; शरद में रोपाई",
      seedRate: "400-500 g/acre",
      seedTreatment: "फफूंदनाशक से बीज उपचार",
      spacing: "60 × 45 cm",
      sowingMethod: "मेड़ पर पौधे लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 5-6 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "फूल गोभी बनना", details: ["नाइट्रोजन और potash सावधानी से डालें"] }],
      micronutrients: ["Boron और molybdenum"],
      foliarSpray: ["गोभी बनने से पहले सूक्ष्म पोषक पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "नमी नियंत्रण के साथ नियमित सिंचाई",
      criticalStages: ["रोपाई", "फूल गोभी बनना"],
      schedule: ["मिट्टी समान रूप से नम रखें"],
    },
    cropProtection: {
      majorPests: ["Diamondback moth", "Aphids"],
      majorDiseases: ["Black rot", "Downy mildew"],
      weedManagement: ["मल्चिंग और हाथ से निराई"],
      symptoms: ["गोभी का रंग बदलना", "पत्ती मुड़ना", "वृद्धि रुकना"],
      prevention: ["स्वस्थ पौधे लगाएं", "फसल चक्र अपनाएं"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पुरानी पत्तियां पीली", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Boron", symptoms: "गोभी का आकार बिगड़ना", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
      { nutrient: "Molybdenum", symptoms: "पत्ती का आकार बिगड़ना", cause: "molybdenum कम", solution: "molybdenum स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "रोपाई के 70-90 दिन बाद",
      maturitySigns: ["सफेद गठीला फूल", "पत्तियां थोड़ी खुली"],
      yield: "150-220 q/acre",
      storageTips: ["ठंडे समय में काटें", "हवादार जगह रखें"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable mandi", "Retail chains", "Wholesalers"],
      demand: "शहरी बाजार में स्थिर मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "आपूर्ति और मौसम से भाव बदलता है",
    },
  },
  {
    ...baseCrop,
    slug: "cucumber",
    name: "Cucumber (खीरा)",
    category: "Vegetables",
    scientificName: "Cucumis sativus",
    overview: "तेजी से बढ़ने वाली बेल वाली सब्जी; समय पर सिंचाई, संतुलित खाद और रोग प्रबंधन पर अच्छा फल देती है।",
    durationDays: "45-60 दिन",
    estimatedYield: "120-180 क्विंटल प्रति एकड़",
    seedRate: "1.5-2 kg/acre",
    spacing: "150 × 50 cm",
    suitableSeason: "वसंत और गर्मी",
    suitableSoil: "जल निकासी वाली बलुई दोमट",
    climate: "अधिक धूप वाला गर्म मौसम",
    sowingGuide: {
      bestSowingTime: "वसंत या शुरुआती गर्मी",
      seedRate: "1.5-2 kg/acre",
      seedTreatment: "फफूंदनाशक से बीज उपचार",
      spacing: "150 × 50 cm",
      sowingMethod: "सीधी बुवाई या रोपाई",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 3-4 t/acre", "DAP 40 kg/acre"],
      stageWise: [{ stage: "फल बनने की अवस्था", details: ["potash और संतुलित NPK डालें"] }],
      micronutrients: ["Boron और zinc"],
      foliarSpray: ["शुरुआती फल बनने पर पर्ण खाद"],
    },
    irrigationManagement: {
      waterRequirement: "मध्यम नमी के साथ नियमित सिंचाई",
      criticalStages: ["पौध", "फूल आना", "फल विकास"],
      schedule: ["गर्म मौसम में हर 2-3 दिन पानी दें"],
    },
    cropProtection: {
      majorPests: ["Fruit fly", "Whitefly", "Aphids"],
      majorDiseases: ["Powdery mildew", "Downy mildew"],
      weedManagement: ["मल्चिंग और गुड़ाई"],
      symptoms: ["पत्ती पर दाग", "फल का आकार बिगड़ना", "पीलापन"],
      prevention: ["अच्छी हवा और सफाई रखें"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "धीमी वृद्धि और फीकी पत्तियां", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती के किनारे जलना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Boron", symptoms: "फल कम बनना", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 45-60 दिन बाद",
      maturitySigns: ["फल कुरकुरा और हरा होना", "फल की लंबाई ठीक"],
      yield: "120-180 q/acre",
      storageTips: ["ठंडी सुबह में काटें", "ठंडी जगह रखें"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable mandi", "Retail shops", "Wholesalers"],
      demand: "गर्मी के बाजार में अधिक मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "कम आपूर्ति में भाव बढ़ते हैं",
    },
  },
  {
    ...baseCrop,
    slug: "brinjal",
    name: "Brinjal / Eggplant (बैंगन)",
    category: "Vegetables",
    scientificName: "Solanum melongena",
    overview: "लोकप्रिय सब्जी; संतुलित पोषण, अच्छी जल निकासी और शुरुआती कीट प्रबंधन से लाभ मिलता है।",
    durationDays: "90-120 दिन",
    estimatedYield: "180-250 क्विंटल प्रति एकड़",
    seedRate: "300-400 g/acre",
    spacing: "75 × 60 cm",
    suitableSeason: "खरीफ और वसंत",
    suitableSoil: "जल निकासी वाली उपजाऊ दोमट",
    climate: "मध्यम आर्द्रता वाला गर्म मौसम",
    sowingGuide: {
      bestSowingTime: "नर्सरी गर्मी में; 4-5 हफ्ते बाद रोपाई",
      seedRate: "300-400 g/acre",
      seedTreatment: "फफूंदनाशक से बीज उपचार",
      spacing: "75 × 60 cm",
      sowingMethod: "मेड़ पर पौधे लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 5 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "फल बनने की अवस्था", details: ["potash और phosphorus डालें"] }],
      micronutrients: ["Boron और zinc"],
      foliarSpray: ["फल बनने पर सूक्ष्म पोषक स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "खासकर फूल और फल बनने में नियमित सिंचाई",
      criticalStages: ["रोपाई", "फूल आना", "फल बनना"],
      schedule: ["सूखे मौसम में हर 3-4 दिन सिंचाई"],
    },
    cropProtection: {
      majorPests: ["Shoot and fruit borer", "Whitefly", "Aphids"],
      majorDiseases: ["Wilt", "Phomopsis blight"],
      weedManagement: ["हाथ से निराई और मल्चिंग"],
      symptoms: ["फल में छेद", "पत्ती पीली", "पौधे रुकना"],
      prevention: ["स्वस्थ पौधे लगाएं", "नियमित निगरानी"],
      control: ["अनुशंसित कीटनाशक और फफूंदनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "फीकी पत्तियां और कम वृद्धि", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती की नोक जलना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Boron", symptoms: "फल का विकास कम", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "रोपाई के 90-120 दिन बाद",
      maturitySigns: ["फल की चमकदार त्वचा", "फल सख्त होना"],
      yield: "180-250 q/acre",
      storageTips: ["ठंडी जगह रखें", "नमी से दूर रखें"],
    },
    marketInformation: {
      majorMarkets: ["Vegetable mandi", "Retail and wholesalers"],
      demand: "स्थानीय बाजार में मजबूत मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "मौसमी उतार-चढ़ाव के साथ स्थिर",
    },
  },
  {
    ...baseCrop,
    slug: "sugarcane",
    name: "Sugarcane (गन्ना)",
    category: "Cash-Crops",
    scientificName: "Saccharum officinarum",
    overview: "लंबी अवधि की नकदी फसल; मजबूत पोषण योजना, समय पर सिंचाई और शुरुआती कीट नियंत्रण जरूरी।",
    durationDays: "300-360 दिन",
    estimatedYield: "500-700 क्विंटल प्रति एकड़",
    seedRate: "40,000-50,000 setts/acre",
    spacing: "90 × 45 cm",
    suitableSeason: "वसंत और शुरुआती गर्मी",
    suitableSoil: "गहरी दोमट या चिकनी दोमट, जल निकासी के साथ",
    climate: "लंबी धूप वाला गर्म और आर्द्र मौसम",
    sowingGuide: {
      bestSowingTime: "फरवरी-मार्च या वसंत की रोपाई",
      seedRate: "40,000-50,000 setts/acre",
      seedTreatment: "फफूंदनाशक से बीज cane उपचार",
      spacing: "90 × 45 cm",
      sowingMethod: "नाली में स्वस्थ cane setts लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 10 t/acre", "DAP 100 kg/acre"],
      stageWise: [{ stage: "तेज वृद्धि अवस्था", details: ["नाइट्रोजन और potash को विभाजित मात्रा में डालें"] }],
      micronutrients: ["Zinc, iron और manganese"],
      foliarSpray: ["तेज वृद्धि में NPK स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "पूरी फसल अवधि में नियमित सिंचाई",
      criticalStages: ["अंकुरण", "कल्ले निकलना", "तेज वृद्धि"],
      schedule: ["नियमित अंतराल पर सिंचाई", "पानी की कमी न होने दें"],
    },
    cropProtection: {
      majorPests: ["Top borer", "Early shoot borer"],
      majorDiseases: ["Red rot", "Smut"],
      weedManagement: ["शुरुआत में गुड़ाई और खरपतवारनाशक"],
      symptoms: ["मुरझाना", "पत्ती लाल होना", "वृद्धि कम"],
      prevention: ["रोग-मुक्त cane setts", "खेत की सफाई"],
      control: ["अनुशंसित जैविक और रासायनिक नियंत्रण"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पत्तियां फीकी", cause: "नाइट्रोजन कम", solution: "नाइट्रोजन को विभाजित मात्रा में डालें" },
      { nutrient: "Phosphorus", symptoms: "जड़ की वृद्धि कम", cause: "फास्फोरस कम", solution: "DAP डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती के किनारे जलना", cause: "पोटाश कम", solution: "MOP डालें" },
    ],
    harvestAndYield: {
      harvestingTime: "रोपाई के 300-360 दिन बाद",
      maturitySigns: ["गन्ना सख्त होना", "Brix बढ़ना"],
      yield: "500-700 q/acre",
      storageTips: ["जल्दी काटकर पेरना", "रस सावधानी से रखें"],
    },
    marketInformation: {
      majorMarkets: ["Sugar mills", "Sugarcane traders", "Local market"],
      demand: "चीनी उद्योग से मजबूत मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "चीनी mill भाव से जुड़ा",
    },
  },
  {
    ...baseCrop,
    slug: "potato",
    name: "Potato (आलू)",
    category: "Vegetables",
    scientificName: "Solanum tuberosum",
    overview: "उच्च पैदावार वाली कंद फसल; संतुलित पोषण, सावधान सिंचाई और रोग रोकथाम जरूरी।",
    durationDays: "80-100 दिन",
    estimatedYield: "180-250 क्विंटल प्रति एकड़",
    seedRate: "20-25 q/acre",
    spacing: "60 × 20 cm",
    suitableSeason: "रबी",
    suitableSoil: "ढीली और जल निकासी वाली दोमट",
    climate: "मध्यम तापमान वाला ठंडा मौसम",
    sowingGuide: {
      bestSowingTime: "अक्टूबर-नवंबर",
      seedRate: "20-25 q/acre",
      seedTreatment: "फफूंदनाशक से बीज कंद उपचार",
      spacing: "60 × 20 cm",
      sowingMethod: "मेड़ पर स्वस्थ बीज कंद लगाएं",
    },
    fertilizerSchedule: {
      basalDose: ["Compost 10 t/acre", "DAP 50 kg/acre"],
      stageWise: [{ stage: "कंद बढ़ना", details: ["potash और नाइट्रोजन को विभाजित मात्रा में डालें"] }],
      micronutrients: ["Boron और zinc"],
      foliarSpray: ["कंद बढ़ने पर सूक्ष्म पोषक पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "नियमित सिंचाई, जलभराव से बचें",
      criticalStages: ["अंकुरण", "कंद बनना", "कंद बढ़ना"],
      schedule: ["मिट्टी की सूखापन के अनुसार सिंचाई"],
    },
    cropProtection: {
      majorPests: ["Aphids", "White grub"],
      majorDiseases: ["Late blight", "Early blight"],
      weedManagement: ["मिट्टी चढ़ाना और निराई"],
      symptoms: ["पत्ती झुलसन", "कंद सड़ना", "मुरझाना"],
      prevention: ["स्वस्थ बीज लगाएं", "फसल चक्र अपनाएं"],
      control: ["अनुशंसित फफूंदनाशक और कीटनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पीलापन और कम वृद्धि", cause: "नाइट्रोजन कम", solution: "नाइट्रोजन को विभाजित मात्रा में डालें" },
      { nutrient: "Potassium", symptoms: "पत्ती जलना", cause: "पोटाश कम", solution: "MOP डालें" },
      { nutrient: "Boron", symptoms: "कंद का आकार कम", cause: "बोरॉन कम", solution: "boron स्प्रे करें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 80-100 दिन बाद",
      maturitySigns: ["पौधे सूखना", "कंद सख्त और छिलका तैयार"],
      yield: "180-250 q/acre",
      storageTips: ["भंडारण से पहले कंद सुखाएं", "ठंडी अंधेरी जगह रखें"],
    },
    marketInformation: {
      majorMarkets: ["Potato mandi", "Cold storage traders", "Retail chains"],
      demand: "ताजा और प्रसंस्करण बाजार में स्थिर मांग",
      msp: "कोई निश्चित MSP नहीं",
      priceTrend: "मौसम और भंडारण पर निर्भर",
    },
  },
  {
    ...baseCrop,
    slug: "bajra",
    name: "Bajra / Pearl Millet (बाजरा)",
    category: "Millets",
    scientificName: "Pennisetum glaucum",
    overview: "सूखे क्षेत्रों के लिए उपयुक्त सख्त मिलेट; अच्छे सूखा प्रबंधन और संतुलित पोषण की जरूरत।",
    durationDays: "70-90 दिन",
    estimatedYield: "10-15 क्विंटल प्रति एकड़",
    seedRate: "3-4 kg/acre",
    spacing: "45 × 10 cm",
    suitableSeason: "खरीफ",
    suitableSoil: "हल्की बलुई दोमट और सूखे प्रवण मिट्टी",
    climate: "कम वर्षा वाला गर्म सूखा मौसम",
    sowingGuide: {
      bestSowingTime: "जून-जुलाई, मानसून शुरू होने पर",
      seedRate: "3-4 kg/acre",
      seedTreatment: "फफूंदनाशक से बीज उपचार",
      spacing: "45 × 10 cm",
      sowingMethod: "सूखे खेतों में पंक्ति बुवाई",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 30 kg/acre", "Compost 2-3 t/acre"],
      stageWise: [{ stage: "शुरुआती वृद्धि", details: ["थोड़ी मात्रा नाइट्रोजन दें"] }],
      micronutrients: ["Zinc और iron"],
      foliarSpray: ["तनाव अवधि में पोषक पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "पानी की कम जरूरत; तनाव में ही सिंचाई",
      criticalStages: ["कल्ले निकलना", "बाली बनना"],
      schedule: ["जरूरत पड़ने पर ही सिंचाई"],
    },
    cropProtection: {
      majorPests: ["Shoot fly", "Stem borer"],
      majorDiseases: ["Downy mildew", "Ergot"],
      weedManagement: ["शुरुआत में निराई और मिट्टी की गुड़ाई"],
      symptoms: ["पत्ती पीलापन", "कल्ले कम", "Ergot के लक्षण"],
      prevention: ["प्रतिरोधी बीज", "समय पर निराई"],
      control: ["अनुशंसित फफूंदनाशक और कीटनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पत्तियां पीली", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Iron", symptoms: "नई पत्तियां फीकी", cause: "लोहे की कमी", solution: "पर्ण iron स्प्रे करें" },
      { nutrient: "Zinc", symptoms: "शिराओं के बीच पीलापन", cause: "जिंक कम", solution: "zinc sulfate डालें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 70-90 दिन बाद",
      maturitySigns: ["बाली भूरी होना", "दाने सख्त होना"],
      yield: "10-15 q/acre",
      storageTips: ["भंडारण से पहले अच्छी तरह सुखाएं", "ठंडी सूखी जगह रखें"],
    },
    marketInformation: {
      majorMarkets: ["Millet traders", "Feed industry", "Local mandi"],
      demand: "खाने और चारे के लिए अच्छा बाजार",
      msp: "राज्य सहायता मूल्य देखें",
      priceTrend: "मौसमी मांग के साथ स्थिर",
    },
  },
  {
    ...baseCrop,
    slug: "wheat",
    name: "Wheat (गेहूं)",
    category: "Cereals",
    scientificName: "Triticum aestivum",
    overview: "मुख्य रबी अनाज; समय पर बुवाई, सही पोषण और शुरुआती रोग से बचाव से अच्छी पैदावार मिलती है।",
    durationDays: "120-135 दिन",
    estimatedYield: "18-25 क्विंटल प्रति एकड़",
    seedRate: "100-120 kg/acre",
    spacing: "22.5 × 5 cm",
    suitableSeason: "रबी",
    suitableSoil: "जल निकासी वाली दोमट से चिकनी दोमट",
    climate: "परिपक्वता में धूप वाला ठंडा मौसम",
    sowingGuide: {
      bestSowingTime: "1-25 नवंबर",
      seedRate: "100-120 kg/acre",
      seedTreatment: "फफूंदनाशक से बीज उपचार",
      spacing: "22.5 × 5 cm",
      sowingMethod: "सही गहराई पर पंक्ति बुवाई",
    },
    fertilizerSchedule: {
      basalDose: ["DAP 50 kg/acre", "MOP 25 kg/acre"],
      stageWise: [{ stage: "CRI अवस्था", details: ["urea और zinc sulfate डालें"] }],
      micronutrients: ["Zinc और sulfur"],
      foliarSpray: ["दाना भरने की अवस्था में पर्ण स्प्रे"],
    },
    irrigationManagement: {
      waterRequirement: "CRI और दाना भरने पर महत्वपूर्ण सिंचाई",
      criticalStages: ["CRI", "कल्ले निकलना", "फूल आना"],
      schedule: ["समय पर सिंचाई दें", "पानी की कमी न होने दें"],
    },
    cropProtection: {
      majorPests: ["Aphids", "Termites"],
      majorDiseases: ["Yellow rust", "Leaf rust"],
      weedManagement: ["खरपतवारनाशक और हाथ से निराई"],
      symptoms: ["पत्ती में जंग", "पीलापन", "कल्ले कम"],
      prevention: ["प्रतिरोधी किस्म लगाएं", "फसल चक्र अपनाएं"],
      control: ["अनुशंसित फफूंदनाशक और खरपतवारनाशक"],
    },
    nutrientDeficiencies: [
      { nutrient: "Nitrogen", symptoms: "पत्तियां फीकी", cause: "नाइट्रोजन कम", solution: "urea को विभाजित मात्रा में डालें" },
      { nutrient: "Zinc", symptoms: "वृद्धि रुकना", cause: "जिंक कम", solution: "zinc sulfate डालें" },
      { nutrient: "Sulphur", symptoms: "नई पत्तियां फीकी", cause: "सल्फर कम", solution: "sulfur उर्वरक दें" },
    ],
    harvestAndYield: {
      harvestingTime: "बुवाई के 120-135 दिन बाद",
      maturitySigns: ["बाली सुनहरी", "दाने सख्त"],
      yield: "18-25 q/acre",
      storageTips: ["भंडारण से पहले सुखाएं", "साफ बोरियों में रखें"],
    },
    marketInformation: {
      majorMarkets: ["Grain mandis", "Flour mills", "Cooperative centers"],
      demand: "खरीद में मजबूत मांग",
      msp: "वर्तमान MSP देखें",
      priceTrend: "आम तौर पर स्थिर, खरीद से चलता है",
    },
  },
];

import { importedCropListings } from "@/data/imported-crop-exports";

/** Legacy list merged with ClickUp / batch JSON imports */
export const cropsData: Crop[] = rawCropsData.map((crop) => {
  const patch = importedCropListings[crop.slug];
  return patch ? ({ ...crop, ...patch } as Crop) : crop;
});

export const crops = cropsData;
export default cropsData;
