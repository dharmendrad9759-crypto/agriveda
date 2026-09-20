/**
 * Auto-built critical irrigation guides — source-of-truth farmer dataset.
 * Do not omit stages, DAS/DAT, field ID, or field experience.
 */
import type { CropIrrigationGuide, IrrigationExperience, IrrigationStageGuide } from "./cropIrrigationGuide";

const MOISTURE_HI =
  "पौधे के पास 2 इंच गहरी मिट्टी उठाकर मुट्ठी में दबाएँ। लड्डू बन जाए तो अभी पानी की ज़रूरत नहीं। मिट्टी भुरभुरी रहे और लड्डू न बने तो तुरंत सिंचाई करें।";
const MOISTURE_EN =
  "Pick soil 2 inches deep near the plant and squeeze. If it forms a ball, wait. If crumbly and no ball, irrigate now.";

function stage(
  o: Omit<IrrigationStageGuide, "pointsEn" | "badgeEn" | "titleEn" | "periodEn" | "waterEn"> & {
    titleEn?: string;
    periodEn?: string;
    pointsEn?: string[];
    badgeEn?: string;
    waterEn?: string;
    fieldIdEn?: string[];
  }
): IrrigationStageGuide {
  return {
    titleHi: o.titleHi,
    titleEn: o.titleEn ?? o.titleHi,
    periodHi: o.periodHi,
    periodEn: o.periodEn ?? o.periodHi,
    pointsHi: o.pointsHi,
    pointsEn: o.pointsEn ?? o.pointsHi,
    badgeHi: o.badgeHi,
    badgeEn: o.badgeEn ?? o.badgeHi,
    photoKind: o.photoKind,
    critical: o.critical,
    sequenceHi: o.sequenceHi,
    waterHi: o.waterHi,
    waterEn: o.waterEn ?? o.waterHi,
    fieldIdHi: o.fieldIdHi,
    fieldIdEn: o.fieldIdEn ?? o.fieldIdHi,
  };
}

function exp(titleHi: string, pointsHi: string[], titleEn?: string, pointsEn?: string[]): IrrigationExperience {
  return {
    titleHi,
    titleEn: titleEn ?? titleHi,
    pointsHi,
    pointsEn: pointsEn ?? pointsHi,
  };
}

function guide(partial: Omit<CropIrrigationGuide, "moistureHi" | "moistureEn"> & Partial<Pick<CropIrrigationGuide, "moistureHi" | "moistureEn">>): CropIrrigationGuide {
  return {
    moistureHi: MOISTURE_HI,
    moistureEn: MOISTURE_EN,
    ...partial,
  };
}

export const CRITICAL_IRRIGATION_GUIDES: Record<string, CropIrrigationGuide> = {
  wheat: guide({
    irrigationsHi: "4–6 सिंचाई",
    irrigationsEn: "4–6 irrigations",
    methodHi: "नाली / हल्की–मध्यम",
    methodEn: "Furrow / light–medium",
    noteHi: "भारी मिट्टी 4–5 · हल्की/रेतीली 5–6",
    noteEn: "Heavy soil 4–5 · Light/sandy 5–6",
    soilOrRegionHi: "भारी/मटियारी: 4–5 · हल्की/रेतीली: 5–6",
    soilOrRegionEn: "Heavy/clay: 4–5 · Light/sandy: 5–6",
    principleHi:
      "क्राउन रूट इनिशिएशन (CRI) और दाना भराव (Milk/Dough) पर पानी की कमी से उपज में 30–40% तक गिरावट आती है।",
    principleEn:
      "Water stress at CRI and milk/dough can cut yield by 30–40%.",
    warningHi:
      "पहली सिंचाई कभी भारी न करें। 24 घंटे से ज्यादा पानी खड़ा रहे तो गेहूं पीला पड़ जाता है और कल्ले दब जाते हैं।",
    warningEn:
      "Never make the first irrigation heavy. Standing water >24h yellows wheat and suppresses tillers.",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "क्राउन रूट (CRI - शिखर जड़ फूटना)",
        titleEn: "Crown root initiation (CRI)",
        periodHi: "20–25 दिन DAS",
        periodEn: "20–25 days DAS",
        waterHi: "हल्की सिंचाई (5–6 सेमी)",
        badgeHi: "CRI — ज़रूरी",
        photoKind: "sow",
        critical: true,
        fieldIdHi: [
          "पौधे में 3-4 पत्तियां आ चुकी हों।",
          "मुख्य जड़ के ऊपर से रेशेदार जड़ें निकलना शुरू हों।",
          "मिट्टी की ऊपरी 2 इंच परत सूख चुकी हो।",
        ],
        pointsHi: ["यह सबसे महत्वपूर्ण पहली सिंचाई है — पानी हल्का रखें।"],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "टिलरिंग (कल्ले निकलते समय)",
        titleEn: "Tillering",
        periodHi: "40–45 दिन DAS",
        periodEn: "40–45 days DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम",
        photoKind: "veg",
        fieldIdHi: ["पौधे झाड़ीनुमा होने लगें।", "साइड से नए कल्ले तेजी से फूट रहे हों।"],
        pointsHi: ["कल्ले फूटने के लिए नमी बनाए रखें।"],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "जॉइंटिंग (गांठें बनते समय)",
        titleEn: "Jointing",
        periodHi: "60–65 दिन DAS",
        periodEn: "60–65 days DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम",
        photoKind: "veg",
        fieldIdHi: ["तने में पहली-दूसरी गांठ साफ महसूस होने लगे।", "तना सीधा ऊपर उठने लगे।"],
        pointsHi: ["गांठ बनते समय नमी न टूटे।"],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "बूटिंग / फ्लॉवरिंग (गोभ / फूल अवस्था)",
        titleEn: "Booting / flowering",
        periodHi: "80–85 दिन DAS",
        periodEn: "80–85 days DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "गोभ/फूल",
        photoKind: "flower",
        critical: true,
        fieldIdHi: ["बालियां झंडे वाले पत्ते (Flag leaf) के अंदर से बाहर निकलने की स्थिति में हों।"],
        pointsHi: ["तेज हवा में सिंचाई न करें — lodging का खतरा।"],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "मिल्किंग (दूधिया अवस्था)",
        titleEn: "Milking",
        periodHi: "100–105 दिन DAS",
        periodEn: "100–105 days DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "दूधिया",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: ["दाने को दबाने पर दूध जैसा सफेद रस निकले।"],
        pointsHi: ["दाना भराव — पानी की कमी से 30–40% उपज गिर सकती है।"],
      }),
      stage({
        sequenceHi: "6th",
        titleHi: "डफ स्टेज (दाना पकते समय)",
        titleEn: "Dough stage",
        periodHi: "115–120 दिन DAS (यदि तापमान बढ़े)",
        periodEn: "115–120 days DAS (if temperature rises)",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की",
        photoKind: "harvest",
        fieldIdHi: ["दाना सख्त होने लगे।", "हरापन कम होकर पीलापन आने लगे।"],
        pointsHi: ["तापमान बढ़े तभी यह पानी दें — वरना जरूरत न हो।"],
      }),
    ],
    experiences: [
      exp("CRI पर जलभराव न होने दें", [
        "पहली सिंचाई कभी भारी न करें।",
        "अगर खेत में 24 घंटे से ज्यादा पानी खड़ा रह गया, तो गेहूं पीला पड़ जाता है और कल्ले दब जाते हैं।",
      ]),
      exp("हवा और सिंचाई — गिरने का खतरा", [
        "4थी और 5वीं सिंचाई के समय अगर तेज पछुआ/पुरवा हवा चल रही हो, तो सिंचाई तुरंत रोक दें।",
        "वरना फसल आड़ी (Lodging) गिर जाएगी।",
        "शाम के समय जब हवा शांत हो, तभी पानी दें।",
      ]),
      exp("पलेवा (Pre-sowing)", [
        "बुवाई हमेशा अच्छी नमी (पलेवा) में करें।",
        "ताकि पहली सिंचाई 21 दिन से पहले न देनी पड़े।",
      ]),
    ],
  }),

  paddy: guide({
    irrigationsHi: "रोपाई से कटाई−12–15 दिन तक जल प्रबंधन",
    irrigationsEn: "Water manage transplant to 12–15 days before harvest",
    methodHi: "AWD — पानी सूखने पर दोबारा भरना",
    methodEn: "AWD — refill when dry",
    noteHi: "हर समय 4 इंच पानी भरकर रखना जरूरी नहीं",
    noteEn: "No need to keep 4 inches standing always",
    soilOrRegionHi: "रोपाई वाली विधि · DAT के अनुसार",
    soilOrRegionEn: "Transplanted method · by DAT",
    principleHi:
      "हर समय 4 इंच पानी भरकर रखना जरूरी नहीं होता। AWD (Alternate Wetting and Drying - पानी सूखने पर दोबारा भरना) से जड़ें मजबूत रहती हैं।",
    principleEn:
      "Constant 4-inch standing water is not needed. AWD keeps roots stronger.",
    warningHi:
      "गभोट और फूल अवस्था में खेत सूखा नहीं होना चाहिए — वरना बालियां पोच/खाली रह जाती हैं।",
    warningEn:
      "Do not dry the field at panicle initiation or flowering — grains stay empty.",
    stages: [
      stage({
        sequenceHi: "स्थापना",
        titleHi: "रोपाई से जड़ पकड़ने तक",
        titleEn: "Establishment",
        periodHi: "0–10 दिन DAT",
        periodEn: "0–10 days DAT",
        waterHi: "2 से 3 सेमी स्थिर पानी",
        badgeHi: "2–3 सेमी",
        photoKind: "sow",
        fieldIdHi: [
          "पौधे को सीधा खड़ा रखने के लिए खेत में हल्का पानी बना रहना चाहिए।",
          "खरपतवार दबाने के लिए भी हल्का पानी बना रहना चाहिए।",
        ],
        pointsHi: ["स्थापना के लिए हल्का स्थिर पानी।"],
      }),
      stage({
        sequenceHi: "टिलरिंग",
        titleHi: "कल्ले फूटते समय",
        titleEn: "Tillering",
        periodHi: "15–40 दिन DAT",
        periodEn: "15–40 days DAT",
        waterHi: "हल्का पानी (सूखने पर भरें)",
        badgeHi: "AWD",
        photoKind: "veg",
        fieldIdHi: [
          "खेत की दरारें न फटने दें।",
          "बाल-बराबर दरार दिखे तो तुरंत 2-3 सेमी पानी लगाएं।",
        ],
        pointsHi: ["कल्ले फूटते समय पानी बहुत गहरा न रखें — जड़ तक ऑक्सीजन पहुंचे।"],
      }),
      stage({
        sequenceHi: "गभोट",
        titleHi: "पैनिकल इनिशिएशन (बालियां बनना)",
        titleEn: "Panicle initiation",
        periodHi: "50–65 दिन DAT",
        periodEn: "50–65 days DAT",
        waterHi: "4 से 5 सेमी पानी अनिवार्य",
        badgeHi: "4–5 सेमी अनिवार्य",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
          "तना नीचे से मोटा और गोल होने लगे।",
          "इस समय पानी की कमी से बालियां आधी खाली (पोच) रह जाती हैं।",
        ],
        pointsHi: ["गभोट — सबसे क्रिटिकल जल स्तर।"],
      }),
      stage({
        sequenceHi: "फूल",
        titleHi: "फ्लॉवरिंग (फूल आना)",
        titleEn: "Flowering",
        periodHi: "70–85 दिन DAT",
        periodEn: "70–85 days DAT",
        waterHi: "3 से 5 सेमी स्थिर पानी",
        badgeHi: "3–5 सेमी",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
          "खेत में सफेद जीरे जैसे फूल दिखें।",
          "इस समय खेत किसी भी हाल में सूखा नहीं होना चाहिए।",
        ],
        pointsHi: ["फूल अवस्था में सूखा बिल्कुल न होने दें।"],
      }),
      stage({
        sequenceHi: "दूधिया/दाना",
        titleHi: "मिल्किंग व दाना भराव",
        titleEn: "Milking & grain fill",
        periodHi: "90–105 दिन DAT",
        periodEn: "90–105 days DAT",
        waterHi: "गीला-सूखा चक्र (हल्का पानी)",
        badgeHi: "हल्का पानी",
        photoKind: "bulk",
        fieldIdHi: [
          "दाना भरने लगे।",
          "ज्यादा पानी भरने से तना गलन (Sheath blight) का खतरा बढ़ता है।",
        ],
        pointsHi: ["ज्यादा गहरा पानी न भरें — Sheath blight का खतरा।"],
      }),
    ],
    experiences: [
      exp("कटाई से पहले पानी बंद करना", [
        "जब बाली का निचला 20-25% हिस्सा पीला पड़ने लगे — कटाई से लगभग 12–15 दिन पहले खेत का पानी पूरी तरह निकाल दें।",
        "इससे दाने में चमक आती है।",
        "कंबाइन हार्वेस्टर आसानी से खेत में चल पाता है।",
      ]),
      exp("जिंक और यूरिया के साथ तालमेल", [
        "कल्ले फूटते समय पानी बहुत गहरा न रखें।",
        "वरना पौधे की जड़ तक ऑक्सीजन नहीं पहुंचती।",
      ]),
    ],
  }),

  maize: guide({
    irrigationsHi: "4–6 सिंचाई (रबी/जायद 5–7)",
    irrigationsEn: "4–6 irrigations (rabi/zaid 5–7)",
    methodHi: "कूंड़ विधि (Furrow) — बाढ़ न करें",
    methodEn: "Furrow — never flood",
    noteHi: "खरीफ में बारिश पर निर्भर · रबी/जायद में 5–7",
    noteEn: "Kharif rain-fed · Rabi/zaid 5–7",
    soilOrRegionHi: "खरीफ: बारिश · रबी/जायद: 5–7 सिंचाई",
    soilOrRegionEn: "Kharif: rain · Rabi/zaid: 5–7",
    principleHi:
      "मक्का सूखे से ज्यादा जलभराव (Waterlogging) से मरता है। खेत में पानी रुकना नहीं चाहिए।",
    principleEn:
      "Maize dies more from waterlogging than drought. Water must not stagnate.",
    warningHi:
      "टेसलिंग और सिल्किंग में 3–4 दिन सूखा पड़ने पर परागकण सूख जाते हैं — गंजा भुट्टा बनता है।",
    warningEn:
      "3–4 dry days at tassel/silk dry pollen — bald cobs.",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "अंकुरण व स्थापना",
        titleEn: "Germination & establishment",
        periodHi: "12–18 दिन DAS",
        periodEn: "12–18 days DAS",
        waterHi: "हल्की सिंचाई (कूंड़ में)",
        badgeHi: "हल्की · कूंड़",
        photoKind: "sow",
        fieldIdHi: ["पौधे 4-5 पत्ती की अवस्था में हों।"],
        pointsHi: ["कभी बाढ़ विधि से पूरा डुबोकर पानी न दें।"],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "घुटने तक ऊंचाई (Knee-high Stage)",
        titleEn: "Knee-high stage",
        periodHi: "30–35 दिन DAS",
        periodEn: "30–35 days DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम",
        photoKind: "veg",
        fieldIdHi: ["पौधा घुटने के बराबर आ जाए।", "तेजी से बढ़वार पर हो।"],
        pointsHi: ["तेज बढ़वार — नमी बनाए रखें।"],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "टेसलिंग (नर मंजरी निकलना)",
        titleEn: "Tasseling",
        periodHi: "50–55 दिन DAS",
        periodEn: "50–55 days DAS",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य",
        photoKind: "flower",
        critical: true,
        fieldIdHi: ["पौधे के शीर्ष से जीरी/मंजरी निकलना शुरू हो जाए।"],
        pointsHi: ["टेसलिंग पर पानी न चूकें।"],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "सिल्किंग (भुट्टे से बाल/मूंछ निकलना)",
        titleEn: "Silking",
        periodHi: "65–70 दिन DAS",
        periodEn: "65–70 days DAS",
        waterHi: "सबसे क्रिटिकल सिंचाई",
        badgeHi: "सबसे क्रिटिकल",
        photoKind: "flower",
        critical: true,
        fieldIdHi: ["भुट्टे से सफेद/हल्के भूरे रेशमी बाल निकल रहे हों।"],
        pointsHi: ["सिल्किंग — सबसे क्रिटिकल पानी।"],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "दाना भराव (Grain filling)",
        titleEn: "Grain filling",
        periodHi: "80–85 दिन DAS",
        periodEn: "80–85 days DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम",
        photoKind: "bulk",
        fieldIdHi: ["भुट्टे में दाने दूध से ठोस अवस्था में बदल रहे हों।"],
        pointsHi: ["दाना भरने के लिए नमी जरूरी।"],
      }),
    ],
    experiences: [
      exp("कूंड़ विधि (Furrow Irrigation)", [
        "मक्का को कभी भी बाढ़ विधि (Flood) से पूरा डुबोकर पानी न दें।",
        "मेड़ बनाकर नालियों में पानी चलाएं।",
      ]),
      exp("टेसलिंग और सिल्किंग का नियम", [
        "अगर इस दौरान 3-4 दिन भी खेत सूख गया: परागकण (Pollen) सूख जाएंगे।",
        "भुट्टे में दाने नहीं भरेंगे — गंजा भुट्टा बनेगा।",
      ]),
    ],
  }),

  bajra: guide({
    irrigationsHi: "2–3 सिंचाई (मुख्यतः वर्षा आधारित)",
    irrigationsEn: "2–3 irrigations (mainly rainfed)",
    methodHi: "जीवन रक्षक सिंचाई · स्प्रिंकलर सावधानी",
    methodEn: "Life-saving irrigation · careful sprinkler",
    noteHi: "बारिश न होने पर ही जीवन रक्षक सिंचाई",
    noteEn: "Life-saving irrigation only if no rain",
    soilOrRegionHi: "मुख्यतः वर्षा आधारित",
    soilOrRegionEn: "Mainly rainfed",
    principleHi:
      "अत्यंत सूखा-रोधी फसल है, लेकिन फूल आने और सिट्टा भरते समय नमी अनिवार्य है।",
    principleEn:
      "Highly drought-hardy, but moisture is essential at flowering and ear filling.",
    warningHi:
      "फूल आने के समय तेज फव्वारा (Sprinkler) न चलाएं — परागकण धुल जाते हैं।",
    warningEn:
      "Do not run strong sprinkler at flowering — pollen washes off.",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "कल्ले फूटते समय (Tillering)",
        titleEn: "Tillering",
        periodHi: "25–30 दिन DAS",
        periodEn: "25–30 days DAS",
        waterHi: "यदि 20 दिन से बारिश न हो",
        badgeHi: "जरूरत पर",
        photoKind: "veg",
        fieldIdHi: ["पौधे में साइड से कल्ले निकल रहे हों।", "पत्तियां दोपहर में मुड़ने लगें।"],
        pointsHi: ["20 दिन से बारिश न हो तभी पानी दें।"],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "सिट्टा निकलते समय (Booting/Flowering)",
        titleEn: "Booting / flowering",
        periodHi: "45–50 दिन DAS",
        periodEn: "45–50 days DAS",
        waterHi: "सबसे महत्वपूर्ण सिंचाई",
        badgeHi: "सबसे महत्वपूर्ण",
        photoKind: "flower",
        critical: true,
        fieldIdHi: ["सिट्टा पत्ते से बाहर आ रहा हो।"],
        pointsHi: ["सिट्टा निकलते समय नमी अनिवार्य।"],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "दाना भराव (Dough stage)",
        titleEn: "Dough stage",
        periodHi: "65–70 दिन DAS",
        periodEn: "65–70 days DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की",
        photoKind: "bulk",
        fieldIdHi: ["सिट्टे में दाने भर रहे हों।"],
        pointsHi: ["दाना भराव — हल्का पानी।"],
      }),
    ],
    experiences: [
      exp("रेतीली जमीन व स्प्रिंकलर", [
        "रेतीली जमीन में बाजरे की जड़ें गहरी जाती हैं, इसलिए जलभराव से बचाएं।",
        "फूल आने के समय तेज फव्वारा (Sprinkler) न चलाएं।",
        "वरना परागकण धुल जाते हैं।",
      ]),
    ],
  }),

  sugarcane: guide({
    irrigationsHi: "उत्तर भारत 8–10 · दक्षिण/डेकन 18–25 (बिना ड्रिप)",
    irrigationsEn: "North India 8–10 · Deccan/South 18–25 (without drip)",
    methodHi: "कूंड़ · मल्चिंग · मिट्टी चढ़ाने के बाद नाली",
    methodEn: "Furrow · mulch · furrow after earthing-up",
    noteHi: "फॉर्मेटिव स्टेज (60–120 दिन) सबसे बड़ी पानी मांग",
    noteEn: "Formative stage (60–120 days) highest water demand",
    soilOrRegionHi: "उत्तर: 8–10 · दक्कन/दक्षिण या बिना ड्रिप: 18–25",
    soilOrRegionEn: "North: 8–10 · Deccan/South or no drip: 18–25",
    principleHi:
      "कल्ले फूटने और बढ़वार की अवस्था (Formative stage: 60–120 दिन) गन्ने की पानी की सबसे बड़ी मांग की अवधि होती है।",
    principleEn:
      "Tillering/formative stage (60–120 days) is sugarcane’s highest water demand period.",
    warningHi:
      "पकाव में पानी घटाएँ ताकि मिठास (Sucrose) बढ़े। जमाव में पानी खड़ा न रहे।",
    warningEn:
      "Reduce water at ripening for sucrose. No standing water at germination.",
    stages: [
      stage({
        sequenceHi: "जमाव",
        titleHi: "अंकुरण (Germination)",
        titleEn: "Germination",
        periodHi: "0–35 दिन DAS · अंतराल: बुवाई तुरंत + 10–12 दिन पर",
        periodEn: "0–35 days DAS · right after planting then every 10–12 days",
        waterHi: "नमी रखें · पानी खड़ा न रहे",
        badgeHi: "10–12 दिन",
        photoKind: "sow",
        fieldIdHi: [
          "पोरियों के आंख से अंकुर फूटने तक खेत में नमी रहे।",
          "पानी खड़ा न रहे।",
        ],
        pointsHi: ["अंकुर फूटने तक नमी, जलभराव नहीं।"],
      }),
      stage({
        sequenceHi: "कल्ले",
        titleHi: "फॉर्मेटिव स्टेज (Tillering)",
        titleEn: "Formative / tillering",
        periodHi: "45–110 दिन DAS · गर्मियों में 8–10 दिन के अंतर पर",
        periodEn: "45–110 days DAS · every 8–10 days in summer",
        waterHi: "लाइफ लाइन — नियमित",
        badgeHi: "लाइफ लाइन",
        photoKind: "veg",
        critical: true,
        fieldIdHi: [
          "यह गन्ने की 'लाइफ लाइन' है।",
          "इस समय पानी की कमी से प्रति एकड़ गन्ने की संख्या घट जाती है।",
        ],
        pointsHi: ["60–120 दिन formative — सबसे बड़ी पानी मांग।"],
      }),
      stage({
        sequenceHi: "बढ़वार",
        titleHi: "ग्रैंड ग्रोथ (Grand Growth)",
        titleEn: "Grand growth",
        periodHi: "120–240 दिन DAS · मानसून पर निर्भर / अन्यथा 12–15 दिन पर",
        periodEn: "120–240 days DAS · monsoon or every 12–15 days",
        waterHi: "कूंड़ में गहरा पानी",
        badgeHi: "12–15 दिन",
        photoKind: "veg",
        fieldIdHi: [
          "गन्ने की लंबाई और मोटाई तेजी से बढ़ती है।",
          "कूंड़ में गहरा पानी दें।",
        ],
        pointsHi: ["लंबाई-मोटाई बढ़वार — गहरा कूंड़ पानी।"],
      }),
      stage({
        sequenceHi: "पकाव",
        titleHi: "परिपक्वता (Ripening)",
        titleEn: "Ripening",
        periodHi: "कटाई से 30–45 दिन पहले · 20–25 दिन के अंतर पर (बहुत कम)",
        periodEn: "30–45 days before harvest · every 20–25 days (very less)",
        waterHi: "पानी घटाया जाता है",
        badgeHi: "पानी घटाएँ",
        photoKind: "harvest",
        fieldIdHi: [
          "पानी घटाया जाता है ताकि गन्ने में मिठास (Sucrose) बढ़े।",
          "पानी का वजन घटे।",
        ],
        pointsHi: ["Sucrose बढ़ाने के लिए पानी कम करें।"],
      }),
    ],
    experiences: [
      exp("सूखी पत्तियों की मल्चिंग", [
        "गन्ने की दो लाइनों के बीच सूखी पत्तियां बिछाकर पानी लगाने से 30–40% पानी की बचत होती है।",
        "कल्ले ज्यादा फूटते हैं।",
      ]),
      exp("मिट्टी चढ़ाना (Earthing-up)", [
        "जुलाई में मिट्टी चढ़ाने के बाद पानी केवल नालियों में दिया जाता है।",
        "इससे बरसात में गन्ना गिरता नहीं है।",
      ]),
    ],
  }),

  cotton: guide({
    irrigationsHi: "4–6 (भारी) · 6–8 (हल्की/रेतीली)",
    irrigationsEn: "4–6 (heavy) · 6–8 (light/sandy)",
    methodHi: "नाली / हल्की–मध्यम",
    methodEn: "Furrow / light–medium",
    noteHi: "भारी मिट्टी 4–6 · हल्की/रेतीली 6–8",
    noteEn: "Heavy soil 4–6 · Light/sandy 6–8",
    soilOrRegionHi: "भारी मिट्टी: 4–6 · हल्की/रेतीली: 6–8",
    soilOrRegionEn: "Heavy soil: 4–6 · Light/sandy: 6–8",
    principleHi: "वानस्पतिक वृद्धि (Vegetative) के समय ज्यादा पानी देने से पौधा सिर्फ लंबा होता है (बांझ बढ़वार)। पानी का सही संतुलन फूल और टिंडे बनने पर चाहिए।",
    principleEn: "वानस्पतिक वृद्धि (Vegetative) के समय ज्यादा पानी देने से पौधा सिर्फ लंबा होता है (बांझ बढ़वार)। पानी का सही संतुलन फूल और टिंडे बनने पर चाहिए।",
    warningHi: "वानस्पतिक अवस्था में ज्यादा पानी = बांझ बढ़वार। सूखे के बाद अचानक भारी पानी से Para-wilting — फूल/टिंडे झड़ सकते हैं।",
    warningEn: "वानस्पतिक अवस्था में ज्यादा पानी = बांझ बढ़वार। सूखे के बाद अचानक भारी पानी से Para-wilting — फूल/टिंडे झड़ सकते हैं।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "शुरुआती बढ़वार",
        periodHi: "30 – 35 दिन DAS",
        waterHi: "पहला पानी देर से (हल्का)",
        badgeHi: "पहला पानी देर से (हल्का)",
        photoKind: "veg",
        fieldIdHi: [
        "पौधा जड़ें गहरी जमा ले।",
        "तब तक पानी टालें (जब तक पौधा हल्का मुरझाए नहीं)।",
      ],
        pointsHi: [
        "पहला पानी देर से (हल्का)",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "चौकोर/फूल कलियां (Square formation)",
        periodHi: "50 – 60 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "पौधे पर छोटे चौकोर (Squares/फूल कलियां) दिखना शुरू हों।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल खिलने पर (Flowering)",
        periodHi: "75 – 85 दिन DAS",
        waterHi: "नियमित व मध्यम",
        badgeHi: "नियमित व मध्यम",
        photoKind: "flower",
        fieldIdHi: [
        "खेत में पीले फूल दिखने लगें।",
        "नमी की कमी से फूल झड़ जाते हैं।",
      ],
        pointsHi: [
        "नियमित व मध्यम",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "टिंडे का विकास (Boll development)",
        periodHi: "100 – 110 दिन DAS",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य सिंचाई",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "टिंडे का आकार बढ़ रहा हो।",
        "इस समय पानी रुकना नहीं चाहिए।",
      ],
        pointsHi: [
        "अनिवार्य सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "टिंडे फटने पर (Boll opening)",
        periodHi: "125 – 135 दिन DAS",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "नीचे के टिंडे खिलने लगें।",
        "ज्यादा पानी से रूई काली पड़ जाती है।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. पहला पानी लेट क्यों?", [
        "फील्ड में अनुभवी किसान कपास का पहला पानी 30-35 दिन तक रोकते हैं।",
        "ताकि पौधे की मूसला जड़ (Tap root) जमीन में गहराई तक नमी खोजने नीचे जाए।",
        "इससे पौधा आगे चलकर आंधी और सूखे को झेल लेता है।",
      ]),
      exp("2. फूल/टिंडा झड़ना (Para-wilting)", [
        "लंबे सूखे के बाद अचानक भारी पानी देने से:",
        "कपास की पत्तियां पीले पड़ सकती हैं।",
        "फूल पीले पड़कर झड़ सकते हैं।",
        "टिंडे पीले पड़कर झड़ सकते हैं।",
        "सिंचाई हमेशा हल्की करें।",
      ])
    ],
  }),

  potato: guide({
    irrigationsHi: "6–8 (हल्की, बार-बार)",
    irrigationsEn: "6–8 (light, frequent)",
    methodHi: "मेड़ — 2/3 ऊँचाई तक पानी, चोटी पर नहीं",
    methodEn: "Ridge — water to 2/3 height, never crest",
    noteHi: "हल्की और बार-बार सिंचाई",
    noteEn: "Light and frequent irrigation",
    soilOrRegionHi: "उथली जड़ · मेड़ विधि",
    soilOrRegionEn: "Shallow roots · ridge method",
    principleHi: "आलू की जड़ें उथली होती हैं। मेड़ (Ridge) की चोटी तक पानी कभी नहीं चढ़ना चाहिए। सिर्फ 2/3 ऊंचाई तक ही पानी दें।",
    principleEn: "आलू की जड़ें उथली होती हैं। मेड़ (Ridge) की चोटी तक पानी कभी नहीं चढ़ना चाहिए। सिर्फ 2/3 ऊंचाई तक ही पानी दें।",
    warningHi: "मेड़ की चोटी तक पानी न चढ़ाएं — Black heart / Soft rot। केवल 2/3 मेड़ ऊँचाई तक पानी।",
    warningEn: "मेड़ की चोटी तक पानी न चढ़ाएं — Black heart / Soft rot। केवल 2/3 मेड़ ऊँचाई तक पानी।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "अंकुरण के बाद (Emergence)",
        periodHi: "10 – 12 दिन DAS",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे जमीन से 2-3 इंच बाहर निकल आए हों।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "मिट्टी चढ़ाने के बाद (Stolon formation)",
        periodHi: "22 – 25 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "sow",
        fieldIdHi: [
        "पौधे पर मिट्टी चढ़ाई जा चुकी हो।",
        "अंदर धागे जैसी जड़ें (स्टोलन) बन रही हों।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "कंद बनना (Tuber initiation)",
        periodHi: "35 – 40 दिन DAS",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य सिंचाई",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "स्टोलन के सिरों पर छोटे कंचे जैसे आलू बनने लगें।",
        "सूखा रहने पर कंद कम बनते हैं।",
      ],
        pointsHi: [
        "अनिवार्य सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "कंद का फैलाव (Tuber bulking - 1)",
        periodHi: "50 – 55 दिन DAS",
        waterHi: "नियमित सिंचाई",
        badgeHi: "नियमित सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "आलू का आकार तेजी से बढ़ता है।",
      ],
        pointsHi: [
        "नियमित सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "कंद का फैलाव (Tuber bulking - 2)",
        periodHi: "65 – 70 दिन DAS",
        waterHi: "नियमित सिंचाई",
        badgeHi: "नियमित सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "आलू बाजार के साइज का होने लगता है।",
      ],
        pointsHi: [
        "नियमित सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "6th",
        titleHi: "परिपक्वता (Maturity)",
        periodHi: "80 – 85 दिन DAS",
        waterHi: "आखिरी हल्की सिंचाई",
        badgeHi: "आखिरी हल्की सिंचाई",
        photoKind: "harvest",
        fieldIdHi: [
        "पत्तियां हल्की पीली पड़ने लगें।",
      ],
        pointsHi: [
        "आखिरी हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. मेड़ पर पानी चढ़ने से सड़न", [
        "अगर पानी आलू की मेड़ के ऊपर चढ़ गया:",
        "मिट्टी सख्त हो जाएगी।",
        "कंदों को हवा नहीं मिलेगी।",
        "इससे 'ब्लैक हार्ट' और कंद सड़न (Soft rot) हो जाएगी।",
      ]),
      exp("2. खुदाई से 10-12 दिन पहले पानी बंद", [
        "खुदाई से पहले सिंचाई बंद करने से आलू का छिलका सख्त (Skin set) हो जाता है।",
        "इससे भंडारण और ढुलाई में आलू छिलता नहीं है।",
      ])
    ],
  }),

  tomato: guide({
    irrigationsHi: "8–12 · गर्मी 4–5d · सर्दी 8–10d · ड्रिप रोज/alt",
    irrigationsEn: "8–12 · summer 4–5d · winter 8–10d · drip daily/alt",
    methodHi: "ड्रिप / नाली — संतुलित नमी",
    methodEn: "Drip / furrow — even moisture",
    noteHi: "DAT के अनुसार · BER/crack से बचाव",
    noteEn: "By DAT · avoid BER/cracking",
    soilOrRegionHi: "गर्मी vs सर्दी अंतराल अलग",
    soilOrRegionEn: "Summer vs winter intervals differ",
    principleHi: "मिट्टी में नमी का उतार-चढ़ाव: 'ब्लॉसम एंड रॉट' (फल का निचला हिस्सा काला होकर सड़ना) फल फटना का मुख्य कारण है।",
    principleEn: "मिट्टी में नमी का उतार-चढ़ाव: 'ब्लॉसम एंड रॉट' (फल का निचला हिस्सा काला होकर सड़ना) फल फटना का मुख्य कारण है।",
    warningHi: "नमी का उतार-चढ़ाव → BER और फल फटना। 10–12 दिन सूखा + अचानक भारी पानी = 30–40% crack।",
    warningEn: "नमी का उतार-चढ़ाव → BER और फल फटना। 10–12 दिन सूखा + अचानक भारी पानी = 30–40% crack।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "रोपाई व स्थापना (Establishment)",
        periodHi: "0 – 5 दिन DAT",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "sow",
        fieldIdHi: [
        "पौधे सीधे खड़े होकर नई जड़ें जमाने लगें।",
      ],
        pointsHi: [
        "हल्की सिंचाई से पौध जमाएँ।",
        "जलभराव से जड़ सड़न हो सकती है।",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "वानस्पतिक बढ़वार (Vegetative)",
        periodHi: "15 – 20 दिन DAT",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधा झाड़ीनुमा हो रहा हो।",
        "डालियां फैल रही हों।",
      ],
        pointsHi: [
        "मिट्टी नम रखें — ऊपरी परत सूखे तो पानी दें।",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल आते समय (Flowering)",
        periodHi: "35 – 45 दिन DAT",
        waterHi: "नियंत्रित सिंचाई (न ज्यादा, न कम)",
        badgeHi: "नियंत्रित · नाजुक",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
        "पीले फूल गुच्छों में खिलें।",
        "इस समय सूखा पड़ने पर फूल गिरते हैं।",
        "ज्यादा पानी देने पर केवल पत्तियां बढ़ती हैं।",
      ],
        pointsHi: [
        "नियंत्रित सिंचाई (न ज्यादा, न कम)।",
        "सूखा = फूल झड़ना · ज्यादा पानी = सिर्फ पत्ते।",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "फल बनते व बढ़ते समय (Fruit Bulking)",
        periodHi: "55 – 70 दिन DAT",
        waterHi: "नियमित व संतुलित",
        badgeHi: "नियमित व संतुलित",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "कंचे के आकार के टमाटर नींबू जितने बड़े होने लगें।",
      ],
        pointsHi: [
        "नमी का उतार-चढ़ाव न होने दें — वरना BER और फल फटना।",
      ],
      }),
      stage({
        sequenceHi: "5th+",
        titleHi: "तुड़ाई का दौर (Picking Phase)",
        periodHi: "75 दिन से आगे · हर तुड़ाई के बाद",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "harvest",
        fieldIdHi: [
        "लाल टमाटर तोड़ने के तुरंत बाद हल्का पानी दें।",
        "इससे अगले फल तेजी से फूलें।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. फल फटने (Cracking) से बचाव", [
        "10-12 दिन खेत सूखा रहा।",
        "किसान ने अचानक नहर या ट्यूबवेल से भारी पानी भर दिया।",
        "अगले 48 घंटे में 30-40% टमाटर फट सकते हैं।",
        "सिंचाई हमेशा नियमित और हल्की रखें।",
      ]),
      exp("2. पत्तियों पर पानी न लगने दें", [
        "मेड़ के ऊपर तक पानी न चढ़ाएं।",
        "गीली पत्तियों पर अगेती व पछेती झुलसा (Blight) फंगस बहुत तेजी से फैलती है।",
      ])
    ],
  }),

  chilli: guide({
    irrigationsHi: "9–13 · सर्दी 8–10d · गर्मी 4–6d",
    irrigationsEn: "9–13 · winter 8–10d · summer 4–6d",
    methodHi: "ड्रिप / नाली · जलभराव नहीं",
    methodEn: "Drip / furrow · no waterlogging",
    noteHi: "12h waterlogging = yellow/wilt",
    noteEn: "12h waterlogging = yellow/wilt",
    soilOrRegionHi: "DAT · Living water रोपाई",
    soilOrRegionEn: "DAT · living water at transplant",
    principleHi: "मिर्च जलभराव के प्रति अत्यंत संवेदनशील है। यदि जड़ में: 12 घंटे भी पानी खड़ा रहा, तो: पौधा पीला पड़ सकता है। उकठा (Wilt) से मर सकता है।",
    principleEn: "मिर्च जलभराव के प्रति अत्यंत संवेदनशील है। यदि जड़ में: 12 घंटे भी पानी खड़ा रहा, तो: पौधा पीला पड़ सकता है। उकठा (Wilt) से मर सकता है।",
    warningHi: "12 घंटे जलभराव → पीला पड़ना / Wilt। जड़ में पानी न रुके।",
    warningEn: "12 घंटे जलभराव → पीला पड़ना / Wilt। जड़ में पानी न रुके।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "रोपाई के समय (Living water)",
        periodHi: "0 – 3 दिन DAT",
        waterHi: "बहुत हल्का पानी",
        badgeHi: "बहुत हल्का पानी",
        photoKind: "sow",
        fieldIdHi: [
        "पौधा खेत में सीधा खड़ा होने लगे।",
      ],
        pointsHi: [
        "बहुत हल्का पानी",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "शाखाएं फूटते समय (Branching)",
        periodHi: "20 – 25 दिन DAT",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे में 4-5 मुख्य शाखाएं निकल आएं।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल खिलते समय (Bloom initiation)",
        periodHi: "40 – 45 दिन DAT",
        waterHi: "सबसे नाजुक समय (हल्का पानी)",
        badgeHi: "सबसे नाजुक समय (हल्का पानी)",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
        "सफेद फूल दिखने लगें।",
        "इस समय खेत ज्यादा गीला नहीं होना चाहिए।",
      ],
        pointsHi: [
        "सबसे नाजुक समय (हल्का पानी)",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "फल विकास व तुड़ाई (Fruiting & Pickings)",
        periodHi: "60 दिन से आगे · नियमित चक्र",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "harvest",
        fieldIdHi: [
        "हरी मिर्च लंबी और चमकदार होने लगे।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("फूल झड़ना रोकने का देसी फॉर्मूला", [
        "पानी में 2-3 दिन की देरी करें।",
        "मिट्टी में हल्का तनाव दें।",
        "पौधे को झटका लगता है।",
        "वानस्पतिक बढ़वार रुकती है।",
        "भारी मात्रा में फूल निकलते हैं।",
        "फिर नियमित पानी शुरू करें।",
      ])
    ],
  }),

  brinjal: guide({
    irrigationsHi: "सर्दी 8–10 · गर्मी 12–15",
    irrigationsEn: "Winter 8–10 · summer 12–15",
    methodHi: "नाली / ड्रिप — लगातार नमी",
    methodEn: "Furrow / drip — continuous moisture",
    noteHi: "Glossiness + weight के लिए नमी",
    noteEn: "Moisture for glossiness and weight",
    soilOrRegionHi: "DAT",
    soilOrRegionEn: "DAT",
    principleHi: "बैंगन को: फल की चमक (Glossiness) फल का वजन बनाए रखने के लिए लगातार नमी चाहिए होती है।",
    principleEn: "बैंगन को: फल की चमक (Glossiness) फल का वजन बनाए रखने के लिए लगातार नमी चाहिए होती है।",
    warningHi: "गर्मी में 4–5 दिन से ज्यादा सूखा → कड़े बीज, कड़वापन, मंडी में आधा भाव।",
    warningEn: "गर्मी में 4–5 दिन से ज्यादा सूखा → कड़े बीज, कड़वापन, मंडी में आधा भाव।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "रोपाई स्थापना",
        periodHi: "0 – 5 दिन DAT",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "तने के पास मिट्टी गीली रहे।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "वानस्पतिक बढ़वार",
        periodHi: "20 – 25 दिन DAT",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "तना मजबूत हो।",
        "पत्तियां चौड़ी हों।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल व छोटे फल",
        periodHi: "45 – 55 दिन DAT",
        waterHi: "नियमित सिंचाई",
        badgeHi: "नियमित सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "जामुनी/बैंगनी फूल दिखें।",
        "नीचे छोटे फल टिकें।",
      ],
        pointsHi: [
        "नियमित सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "4th+",
        titleHi: "फल का आकार व तुड़ाई",
        periodHi: "65 दिन से आगे · हर 6–8 दिन पर",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "harvest",
        fieldIdHi: [
        "फल चमकदार और गूदेदार बने रहें।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("कड़वापन और सख्त बीज", [
        "बैंगन के अंदर बीज कड़े हो जाते हैं।",
        "स्वाद में कड़वापन आ जाता है।",
        "मंडी में भाव आधा मिलता है।",
        "गर्मियों में 4-5 दिन से ज्यादा खेत न सूखने दें।",
      ])
    ],
  }),

  cauliflower: guide({
    irrigationsHi: "7–9 · मिट्टी पूरी सूखी नहीं",
    irrigationsEn: "7–9 · never fully dry",
    methodHi: "हल्की–मध्यम · निरंतर",
    methodEn: "Light–medium · continuous",
    noteHi: "Curd अवस्था में Buttoning खतरा",
    noteEn: "Buttoning risk at curd stage",
    soilOrRegionHi: "DAT · उथली जड़",
    soilOrRegionEn: "DAT · shallow roots",
    principleHi: "फूलगोभी की जड़ें बहुत उथली होती हैं। गोभी का गट्टा (Curd) बनने के समय सूखा पड़ने पर: गोभी 'बटन' जैसी छोटी रह जाती है। इसे Buttoning कहा जाता है।",
    principleEn: "फूलगोभी की जड़ें बहुत उथली होती हैं। गोभी का गट्टा (Curd) बनने के समय सूखा पड़ने पर: गोभी 'बटन' जैसी छोटी रह जाती है। इसे Buttoning कहा जाता है।",
    warningHi: "Curd अवस्था में सूखा → Buttoning। मिट्टी कभी पूरी सूखी न रहे।",
    warningEn: "Curd अवस्था में सूखा → Buttoning। मिट्टी कभी पूरी सूखी न रहे।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "रोपाई के बाद जड़ जमाव",
        periodHi: "0 – 4 दिन DAT",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे की नई जड़ें मिट्टी पकड़ लें।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "पत्तियों की बढ़वार (Vegetative)",
        periodHi: "18 – 22 दिन DAT",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पत्तियां चारों तरफ फैलकर कटोरा जैसा आकार बनाएं।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल बनना (Curd Initiation)",
        periodHi: "38 – 45 दिन DAT",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य सिंचाई",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
        "केंद्र में सिक्के/कंचे के आकार का सफेद फूल दिखने लगे।",
      ],
        pointsHi: [
        "अनिवार्य सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "फूल का फैलाव (Curd Bulking)",
        periodHi: "50 – 65 दिन DAT",
        waterHi: "निरंतर नमी",
        badgeHi: "निरंतर नमी",
        photoKind: "flower",
        fieldIdHi: [
        "फूल तेजी से वजन और आकार ले रहा हो।",
      ],
        pointsHi: [
        "निरंतर नमी",
      ],
      }),
    ],
    experiences: [
      exp("1. ढीला और पीला फूल (Riceyness)", [
        "पानी की अनियमितता",
        "तेज धूप में खेत सूखना",
        "फूल छितरा (ढीला) हो जाता है।",
        "उस पर मखमली रोएं आ जाते हैं।",
      ]),
      exp("2. कटाई से 3 दिन पहले पानी बंद", [
        "3-4 दिन पहले पानी रोक दें।",
        "गोभी का गट्टा ठोस रहे।",
        "पैकिंग के दौरान काला न पड़े।",
      ])
    ],
  }),

  bhindi: guide({
    irrigationsHi: "गर्मी 10–12 (4–5d) · वर्षा 2–4",
    irrigationsEn: "Summer 10–12 (every 4–5d) · rainy 2–4",
    methodHi: "नाली / ड्रिप",
    methodEn: "Furrow / drip",
    noteHi: "DAS · हर तुड़ाई/4–5d",
    noteEn: "DAS · every pick / 4–5d",
    soilOrRegionHi: "ग्रीष्म vs वर्षाकालीन",
    soilOrRegionEn: "Summer vs rainy season",
    principleHi: "गर्मियों की भिंडी में नमी की कमी होते ही: फल में रेशा (Fiber) बढ़ जाता है। फल सख्त हो जाता है।",
    principleEn: "गर्मियों की भिंडी में नमी की कमी होते ही: फल में रेशा (Fiber) बढ़ जाता है। फल सख्त हो जाता है।",
    warningHi: "नमी तनाव → रेशेदार / सख्त फल। दोपहर पत्ते लटकें = शाम को पानी।",
    warningEn: "नमी तनाव → रेशेदार / सख्त फल। दोपहर पत्ते लटकें = शाम को पानी।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "अंकुरण के बाद पहला पानी",
        periodHi: "10 – 12 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे 3-4 पत्तियों के हो जाएं।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "शाखाएं व फूल कलियां",
        periodHi: "25 – 30 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "पत्तियों के कक्ष (Axils) से कलियां निकलें।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल खिलना व पहली फली",
        periodHi: "40 – 45 दिन DAS",
        waterHi: "नियमित सिंचाई",
        badgeHi: "नियमित सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "पीले फूल खिलें।",
        "नीचे छोटी भिंडी बने।",
      ],
        pointsHi: [
        "नियमित सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "4th+",
        titleHi: "लगातार तुड़ाई का दौर",
        periodHi: "50 से 90 दिन · हर तुड़ाई के बाद",
        waterHi: "मुलायम",
        badgeHi: "मुलायम",
        photoKind: "harvest",
        pointsHi: [
        "मुलायम",
      ],
      }),
    ],
    experiences: [
    ],
  }),

  cucumber: guide({
    irrigationsHi: "10–15 · गर्मी 3–4d · सर्दी 7–8d · ड्रिप 1–2h/दिन",
    irrigationsEn: "10–15 · summer 3–4d · winter 7–8d · drip 1–2h/day",
    methodHi: "नाली only — बेल flood नहीं",
    methodEn: "Furrow only — do not flood vines",
    noteHi: "DAS · 45–75 alt day continuous",
    noteEn: "DAS · 45–75 alternate-day continuous",
    soilOrRegionHi: "95% water in fruit",
    soilOrRegionEn: "95% water in fruit",
    principleHi: "खीरे के फल में: 95% पानी होता है। पानी का तनाव होते ही: फल कड़वा (Bitter) हो जाता है।",
    principleEn: "खीरे के फल में: 95% पानी होता है। पानी का तनाव होते ही: फल कड़वा (Bitter) हो जाता है।",
    warningHi: "95% पानी फल में — तनाव → Cucurbitacin कड़वापन। बेल को flood न करें।",
    warningEn: "95% पानी फल में — तनाव → Cucurbitacin कड़वापन। बेल को flood न करें।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "जमाव के बाद",
        periodHi: "8 – 10 दिन DAS",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "बीज से 2 पत्ते निकलकर तीसरे पत्ते की शुरुआत हो।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "बेल फैलते समय (Vining)",
        periodHi: "20 – 25 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "बेल नालियों या मचान की तरफ बढ़ने लगे।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फूल आते समय (Flowering)",
        periodHi: "35 – 40 दिन DAS",
        waterHi: "नियमित व हल्की",
        badgeHi: "नियमित व हल्की",
        photoKind: "flower",
        fieldIdHi: [
        "पीले फूल बड़ी संख्या में दिखें।",
      ],
        pointsHi: [
        "नियमित व हल्की",
      ],
      }),
      stage({
        sequenceHi: "4th+",
        titleHi: "फल विकास व तुड़ाई",
        periodHi: "45 से 75 दिन · एक दिन छोड़कर",
        waterHi: "निरंतर नमी",
        badgeHi: "निरंतर नमी",
        photoKind: "harvest",
        fieldIdHi: [
        "खीरा लंबा",
        "सीधा",
        "गहरा हरा",
        "बना रहे।",
      ],
        pointsHi: [
        "निरंतर नमी",
      ],
      }),
    ],
    experiences: [
      exp("1. कड़वापन (Cucurbitacin)", [
        "दोपहर की तेज धूप में खीरे की बेल मुरझा जाती है,",
        "उसमें कुकुरबिटासिन रसायन बनता है।",
        "इससे खीरा कड़वा हो जाता है।",
      ]),
      exp("2. नाली विधि", [
        "केवल नाली में चलाएं।",
        "कभी पानी में डूबने न दें।",
        "डाउनी मिल्ड्यू फंगस से पत्ते जल जाएंगे।",
      ])
    ],
  }),

  onion: guide({
    irrigationsHi: "रबी 12–15 · खरीफ 8–10",
    irrigationsEn: "Rabi 12–15 · kharif 8–10",
    methodHi: "उथली, बार-बार — गहरी सिंचाई नहीं",
    methodEn: "Shallow, frequent — not deep irrigation",
    noteHi: "जड़ ~15cm · DAT",
    noteEn: "Roots ~15cm · DAT",
    soilOrRegionHi: "रबी vs खरीफ",
    soilOrRegionEn: "Rabi vs kharif",
    principleHi: "प्याज की जड़ें केवल: 15 सेमी गहराई तक होती हैं। इसलिए प्याज: गहरी सिंचाई नहीं मांगता। उथली और बार-बार सिंचाई मांगता है।",
    principleEn: "प्याज की जड़ें केवल: 15 सेमी गहराई तक होती हैं। इसलिए प्याज: गहरी सिंचाई नहीं मांगता। उथली और बार-बार सिंचाई मांगता है।",
    warningHi: "जड़ें केवल 15 सेमी — गहरी सिंचाई नहीं। Neck fall के बाद 12–15 दिन पानी बंद नहीं तो storage rot।",
    warningEn: "जड़ें केवल 15 सेमी — गहरी सिंचाई नहीं। Neck fall के बाद 12–15 दिन पानी बंद नहीं तो storage rot।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "रोपाई के तुरंत बाद",
        periodHi: "0 – 3 दिन DAT",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "sow",
        fieldIdHi: [
        "पौधा खेत में जड़ पकड़ ले।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "बढ़वार अवस्था (Vegetative)",
        periodHi: "20 – 25 दिन DAT",
        waterHi: "7-8 दिन के अंतर पर",
        badgeHi: "7-8 दिन के अंतर पर",
        photoKind: "veg",
        fieldIdHi: [
        "पत्ते हरे-भरे और मोटे हों।",
      ],
        pointsHi: [
        "7-8 दिन के अंतर पर",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "गांठ बनना (Bulb Initiation)",
        periodHi: "45 – 55 दिन DAT",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य सिंचाई",
        photoKind: "sow",
        critical: true,
        fieldIdHi: [
        "तने का निचला हिस्सा गोल और मोटा होने लगे।",
      ],
        pointsHi: [
        "अनिवार्य सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "गांठ का फैलाव (Bulb Enlargement)",
        periodHi: "65 – 85 दिन DAT",
        waterHi: "सबसे महत्वपूर्ण चरण",
        badgeHi: "सबसे महत्वपूर्ण चरण",
        photoKind: "sow",
        critical: true,
        fieldIdHi: [
        "प्याज का आकार तेजी से बड़ा हो रहा हो।",
      ],
        pointsHi: [
        "सबसे महत्वपूर्ण चरण",
      ],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "परिपक्वता (Maturity)",
        periodHi: "100 – 110 दिन DAT",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "harvest",
        fieldIdHi: [
        "पत्तियां ऊपर से पीली होकर सूखने लगें।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("गर्दन मुड़ना (Neck Fall) और सिंचाई बंद करना", [
        "खेत के 20-25% पौधों की गर्दन मुड़कर नीचे गिर जाए।",
        "कटाई से 12–15 दिन पहले।",
        "पानी पूरी तरह बंद कर देना चाहिए।",
        "प्याज भंडारण में 1 महीने के अंदर सड़ सकता है।",
        "दोबारा कल्ले फूट सकते हैं।",
      ])
    ],
  }),

  garlic: guide({
    irrigationsHi: "10–12 · अक्टूबर–मार्च/अप्रैल",
    irrigationsEn: "10–12 · Oct–Mar/Apr",
    methodHi: "नाली / हल्की",
    methodEn: "Furrow / light",
    noteHi: "DAS · clove/bulb formation",
    noteEn: "DAS · clove/bulb formation",
    soilOrRegionHi: "रबी season crop",
    soilOrRegionEn: "Rabi season crop",
    principleHi: "कली बनते और गांठ फूलते समय: पानी का अभाव गांठों को छोटा रखता है।",
    principleEn: "कली बनते और गांठ फूलते समय: पानी का अभाव गांठों को छोटा रखता है।",
    warningHi: "Bulking में सूखे के बाद अचानक पानी → splitting। 70% पत्ते सूखें तो 15 दिन पहले पानी बंद।",
    warningEn: "Bulking में सूखे के बाद अचानक पानी → splitting। 70% पत्ते सूखें तो 15 दिन पहले पानी बंद।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "बुवाई के तुरंत बाद",
        periodHi: "0 – 2 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "sow",
        fieldIdHi: [
        "कलियां जमीन पकड़ लें।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "अंकुरण के बाद",
        periodHi: "10 – 12 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "हरी सुइयां जमीन से बाहर आ जाएं।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "वानस्पतिक बढ़वार",
        periodHi: "30 – 50 दिन DAS · 10-12 दिन के अंतर पर",
        waterHi: "सिंचाई",
        badgeHi: "सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे 6-8 पत्तियों के हो जाएं।",
      ],
        pointsHi: [
        "स्रोत अनुसार सिंचाई का ध्यान रखें।",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "कलियां बनना (Clove Differentiation)",
        periodHi: "70 – 80 दिन DAS",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य सिंचाई",
        photoKind: "sow",
        critical: true,
        fieldIdHi: [
        "नीचे गांठ में अलग-अलग कलियां बनना शुरू हों।",
      ],
        pointsHi: [
        "अनिवार्य सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "गांठ का विकास (Bulb Bulking)",
        periodHi: "95 – 115 दिन DAS",
        waterHi: "नियमित सिंचाई",
        badgeHi: "नियमित सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "गांठ पूरी मोटाई ले रही हो।",
      ],
        pointsHi: [
        "नियमित सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. गांठों का फटना (Splitting)", [
        "लंबे सूखे के बाद अचानक पानी देने से:",
        "लहसुन का छिलका फट जाता है।",
        "कलियां बिखर जाती हैं।",
      ]),
      exp("2. खुदाई से 15 दिन पहले पानी बंद", [
        "पत्तियां 70% सूख जाएं,",
        "पानी बंद कर दें।",
        "छिलका सफेद",
        "कड़ा",
        "चमकदार",
        "बने।",
      ])
    ],
  }),

  ginger: guide({
    irrigationsHi: "16–20 (8–9 महीने) · 7–10d गर्मी/सर्दी",
    irrigationsEn: "16–20 (8–9 months) · 7–10d summer/winter",
    methodHi: "Raised bed 15–20cm · mulch",
    methodEn: "Raised bed 15–20cm · mulch",
    noteHi: "4h waterlogging = rhizome rot",
    noteEn: "4h waterlogging = rhizome rot",
    soilOrRegionHi: "DAS · long duration",
    soilOrRegionEn: "DAS · long duration",
    principleHi: "अदरक को: लगातार नमी चाहिए। लेकिन: *4 घंटे का जलभराव भी कंद सड़न (Rhizome Rot / Soft Rot) रोग से पूरा खेत साफ कर सकता है।",
    principleEn: "अदरक को: लगातार नमी चाहिए। लेकिन: *4 घंटे का जलभराव भी कंद सड़न (Rhizome Rot / Soft Rot) रोग से पूरा खेत साफ कर सकता है।",
    warningHi: "4 घंटे waterlogging = Rhizome rot — पूरा खेत। समतल खेत में न लगाएं — Raised bed 15–20 सेमी।",
    warningEn: "4 घंटे waterlogging = Rhizome rot — पूरा खेत। समतल खेत में न लगाएं — Raised bed 15–20 सेमी।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "अंकुरण व जमाव (Sprouting)",
        periodHi: "0 – 40 दिन DAS",
        waterHi: "हल्की व निरंतर नमी",
        badgeHi: "हल्की व निरंतर नमी",
        photoKind: "veg",
        fieldIdHi: [
        "हरी पत्तियां मल्चिंग (घास-पत्ती) के बीच से बाहर आएं।",
      ],
        pointsHi: [
        "हल्की व निरंतर नमी",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "कल्ले निकलना (Tillering)",
        periodHi: "60 – 90 दिन DAS",
        waterHi: "नियमित सिंचाई",
        badgeHi: "नियमित सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "एक पौधे से 4-6 कल्ले फूट रहे हों।",
      ],
        pointsHi: [
        "नियमित सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "कंद का फैलाव (Rhizome Development)",
        periodHi: "120 – 180 दिन DAS",
        waterHi: "सबसे क्रिटिकल स्टेज",
        badgeHi: "सबसे क्रिटिकल स्टेज",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "जमीन के नीचे नए पंजानुमा कंद तेजी से फैल रहे हों।",
      ],
        pointsHi: [
        "सबसे क्रिटिकल स्टेज",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "परिपक्वता (Maturity)",
        periodHi: "210 – 240 दिन DAS",
        waterHi: "बहुत कम पानी",
        badgeHi: "बहुत कम पानी",
        photoKind: "harvest",
        fieldIdHi: [
        "पत्तियां पीली पड़कर सूखने लगें।",
      ],
        pointsHi: [
        "बहुत कम पानी",
      ],
      }),
    ],
    experiences: [
      exp("1. उठी हुई क्यारियां (Raised Beds)", [
        "कभी भी समतल खेत में न लगाएं।",
        "15-20 सेमी ऊंची क्यारियों पर लगाएं।",
        "सिंचाई का पानी जड़ों में न रुके।",
        "सिर्फ नमी पहुंचे।",
      ]),
      exp("2. मल्चिंग (हरी पत्तियों की खाद)", [
        "पेड़ की हरी पत्तियों से खेत ढकें।",
        "इसके बाद पानी दें।",
        "जमीन भुरभुरी रहती है।",
        "कंद का फैलाव दोगुना होता है।",
      ])
    ],
  }),

  chana: guide({
    irrigationsHi: "1–2 · भारी 1 · हल्की 2",
    irrigationsEn: "1–2 · heavy 1 · light 2",
    methodHi: "Sprinkler preferred · flood avoid",
    methodEn: "Sprinkler preferred · avoid flood",
    noteHi: "DAS · NEVER water at peak flower",
    noteEn: "DAS · NEVER water at peak flower",
    soilOrRegionHi: "रबी · Fusarium wilt risk",
    soilOrRegionEn: "Rabi · Fusarium wilt risk",
    principleHi: "चना अधिक पानी को सहन नहीं करता। ज्यादा पानी या जलभराव से: उकठा (Fusarium Wilt) जड़ गलन (Root Rot) की महामारी फैल सकती है।",
    principleEn: "चना अधिक पानी को सहन नहीं करता। ज्यादा पानी या जलभराव से: उकठा (Fusarium Wilt) जड़ गलन (Root Rot) की महामारी फैल सकती है।",
    warningHi: "50–70% फूल पर पानी = फूल झड़। Excess water → Fusarium wilt / Root rot।",
    warningEn: "50–70% फूल पर पानी = फूल झड़। Excess water → Fusarium wilt / Root rot।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "शाखाएं फूटते समय (Pre-flowering / Branching)",
        periodHi: "40 – 45 दिन DAS",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "पौधे में 5-7 शाखाएं निकल आई हों।",
        "पहली-दूसरी फूल कली दिखने की तैयारी में हो।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
        "स्प्रिंकलर सबसे बेस्ट",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "घेंटी / फली बनते समय (Pod Development)",
        periodHi: "70 – 75 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "खेत में फूल झड़ चुके हों।",
        "छोटी हरी घंटियां (Pods) बन चुकी हों।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. फूल अवस्था पर पानी = महापाप", [
        "उस समय भूलकर भी पानी न लगाएं।",
        "पानी लगते ही सारे फूल झड़ जाएंगे।",
        "पौधा सिर्फ लम्बाई बढ़ाएगा।",
      ]),
      exp("2. उकठा (Wilt) से बचाव", [
        "बाढ़ विधि (Flood) से पानी न दें।",
        "केवल फव्वारा (Sprinkler) से पानी दें।",
        "1.5–2 घंटे ही पानी चलाएं।",
      ]),
      exp("3. पाला (Frost) से बचाव", [
        "शाम के समय खेत में बहुत हल्की सिंचाई कर दें।",
        "इससे पाले का असर 80% तक खत्म हो जाता है।",
      ])
    ],
  }),

  pulses: guide({
    irrigationsHi: "1–3 · खरीफ rainfed",
    irrigationsEn: "1–3 · kharif rainfed",
    methodHi: "Ridge & furrow",
    methodEn: "Ridge & furrow",
    noteHi: "Tap root 2m · 24h waterlogging kills",
    noteEn: "Tap root 2m · 24h waterlogging kills",
    soilOrRegionHi: "अरहर/तुअर · long vs medium duration",
    soilOrRegionEn: "Arhar/tur · long vs medium duration",
    principleHi: "अरहर की मूसला जड़ (Tap Root): जमीन में 2 मीटर तक गहरी जाती है। सूखे को सह सकती है। लेकिन 24 घंटे का जलभराव पूरी फसल सुखा देता है।",
    principleEn: "अरहर की मूसला जड़ (Tap Root): जमीन में 2 मीटर तक गहरी जाती है। सूखे को सह सकती है। लेकिन 24 घंटे का जलभराव पूरी फसल सुखा देता है।",
    warningHi: "24 घंटे waterlogging फसल मारता है। Tap root 2 m — सूखा झेलता है, खड़ा पानी नहीं।",
    warningEn: "24 घंटे waterlogging फसल मारता है। Tap root 2 m — सूखा झेलता है, खड़ा पानी नहीं।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "शुरुआती शाखाएं बनते समय",
        periodHi: "30 – 35 दिन DAS",
        waterHi: "यदि 25 दिन से बारिश न हुई हो",
        badgeHi: "यदि 25 दिन से बारिश न हुई हो",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे 1–1.5 फीट के हों।",
        "साइड की डालियां निकल रही हों।",
      ],
        pointsHi: [
        "यदि 25 दिन से बारिश न हुई हो",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फूल कलियां बनते समय (Pre-flowering)",
        periodHi: "मध्यम किस्म: 65 – 75 दिन DAS",
        waterHi: "अति आवश्यक सिंचाई",
        badgeHi: "अति आवश्यक सिंचाई",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
        "डालियों के सिरों पर फूल के गुच्छे बनने से ठीक पहले।",
      ],
        pointsHi: [
        "अति आवश्यक सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फली बनते व दाना भरते समय (Pod filling)",
        periodHi: "110 – 125 दिन DAS",
        waterHi: "अनिवार्य सिंचाई",
        badgeHi: "अनिवार्य सिंचाई",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "हरी फलियों में दाने का उभार आने लगे।",
      ],
        pointsHi: [
        "अनिवार्य सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. मेड़ पर बुवाई (Ridge & Furrow)", [
        "पानी नालियों में रहे।",
        "तने के पास फाइटोफ्थोरा ब्लाइट (तना सड़न) न लगे।",
      ]),
      exp("2. पॉड बोरर (इल्ली) का ध्यान", [
        "सिंचाई के तुरंत बाद इल्ली (Helicoverpa) का प्रकोप बढ़ता है।",
        "इसलिए सिंचाई के 2 दिन बाद कीटनाशक/जैविक स्प्रे का शेड्यूल रखें।",
      ])
    ],
  }),

  moong: guide({
    irrigationsHi: "खरीफ 0–1 · जायद 3–5 (10–12d)",
    irrigationsEn: "Kharif 0–1 · zaid 3–5 (10–12d)",
    methodHi: "Moisture yes · standing no",
    methodEn: "Moisture yes · standing no",
    noteHi: "DAS zaid schedule",
    noteEn: "DAS zaid schedule",
    soilOrRegionHi: "जायद/गर्मी मूंग",
    soilOrRegionEn: "Zaid/summer moong",
    principleHi: "ग्रीष्मकालीन मूंग में: मिट्टी में नमी बनी रहनी चाहिए। लेकिन पानी खड़ा नहीं होना चाहिए।",
    principleEn: "ग्रीष्मकालीन मूंग में: मिट्टी में नमी बनी रहनी चाहिए। लेकिन पानी खड़ा नहीं होना चाहिए।",
    warningHi: "Standing water नहीं। Heavy water → YMV / whitefly।",
    warningEn: "Standing water नहीं। Heavy water → YMV / whitefly।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "पहली बढ़वार (Vegetative)",
        periodHi: "20 – 22 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे 4-5 पत्तियों के हों।",
        "पहला पानी जल्दी न दें ताकि जड़ें गहराई में जाएं।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फूल आने से ठीक पहले (Pre-bloom)",
        periodHi: "32 – 35 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "फूल की पहली कली दिखते ही पानी दें।",
        "ताकि फूल एक साथ खिलें।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फली विकास (Pod Formation)",
        periodHi: "45 – 48 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "फलियां लंबी होने लगें।",
        "उनमें दाना बनने लगे।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "दाना भराव (यदि गर्मी तेज हो)",
        periodHi: "55 – 58 दिन DAS",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "फलियां पकने की ओर हों।",
        "दाना मोटा करने के लिए पानी की आवश्यकता हो।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. पीला मोजेक से संबंध", [
        "पौधे की जड़ें घुटती हैं।",
        "रस चूसक कीट (सफेद मक्खी) का हमला बढ़ता है।",
        "पीला मोजेक वायरस तेजी से फैलता है।",
      ]),
      exp("2. कटाई से पूर्व", [
        "70-80% फलियां काली/भूरी होकर सूख जाएं,",
        "सिंचाई पूरी तरह बंद कर दें।",
        "वरना नीचे की फलियां खेत में ही चटक (Shattering) जाएंगी।",
      ])
    ],
  }),

  urad: guide({
    irrigationsHi: "खरीफ 1 (if dry) · जायद 3–4",
    irrigationsEn: "Kharif 1 (if dry) · zaid 3–4",
    methodHi: "Sprinkler safest · flood <2h",
    methodEn: "Sprinkler safest · flood <2h",
    noteHi: "Sprawling · pod rot risk",
    noteEn: "Sprawling · pod rot risk",
    soilOrRegionHi: "DAS",
    soilOrRegionEn: "DAS",
    principleHi: "मूंग की तुलना में उड़द का पौधा जमीन से सटकर फैलता है। इसलिए: जलभराव होने पर फली सड़ने का खतरा दोगुना होता है।",
    principleEn: "मूंग की तुलना में उड़द का पौधा जमीन से सटकर फैलता है। इसलिए: जलभराव होने पर फली सड़ने का खतरा दोगुना होता है।",
    warningHi: "Sprawling plant — waterlogging पर pod rot दोगुना। Flood <2h।",
    warningEn: "Sprawling plant — waterlogging पर pod rot दोगुना। Flood <2h।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "शाखाएं बनते समय (Branching)",
        periodHi: "22 – 25 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधा जमीन पर फैलना शुरू करे।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फूल आने से ठीक पहले",
        periodHi: "35 – 38 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "फूल के गुच्छे बनने से ठीक पहले।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फली बनते व दाना भरते समय",
        periodHi: "48 – 52 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "फलियों में रोएं (Hairs) साफ दिखें।",
        "दाना भर रहा हो।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("Irrigation Method", [
        "फव्वारा (स्प्रिंकलर) विधि से पानी देना सबसे सुरक्षित रहता है।",
        "क्यारियों की लंबाई छोटी रखें।",
        "पानी खेत में 2 घंटे से ज्यादा न रुके।",
      ])
    ],
  }),

  masoor: guide({
    irrigationsHi: "1–2 · सबसे कम पानी (रबी दलहन)",
    irrigationsEn: "1–2 · lowest water rabi pulse",
    methodHi: "Extremely light · top 3 inch dry",
    methodEn: "Extremely light · top 3 inch dry",
    noteHi: "Delicate roots",
    noteEn: "Delicate roots",
    soilOrRegionHi: "Light/sandy for 2nd only",
    soilOrRegionEn: "Light/sandy for 2nd only",
    principleHi: "मसूर की जड़ें बहुत नाजुक होती हैं। अधिक नमी मिलते ही: पौधा पीला पड़ने लगता है। पौधा सूखने लगता है।",
    principleEn: "मसूर की जड़ें बहुत नाजुक होती हैं। अधिक नमी मिलते ही: पौधा पीला पड़ने लगता है। पौधा सूखने लगता है।",
    warningHi: "Excess moisture → पीला / सूखना। Heavy loam पर 2nd irrigation = lodging।",
    warningEn: "Excess moisture → पीला / सूखना। Heavy loam पर 2nd irrigation = lodging।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "शाखाएं फूटते समय (Vegetative/Branching)",
        periodHi: "40 – 45 दिन DAS",
        waterHi: "अत्यंत हल्की सिंचाई",
        badgeHi: "अत्यंत हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे में शाखाएं फैल रही हों।",
        "मिट्टी की ऊपरी 3 इंच परत सूख चुकी हो।",
      ],
        pointsHi: [
        "अत्यंत हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फली बनते समय (Pod filling)",
        periodHi: "70 – 75 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "फलियों में दाना भर रहा हो।",
        "यह सिंचाई केवल हल्की/रेतीली जमीन में जरूरी होती है।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. मावठ होने पर सिंचाई की आवश्यकता", [
        "बुवाई के समय खेत में नमी अच्छी थी।",
        "दिसंबर-जनवरी में एक बार भी 10-15 मिमी की मावठ (सर्दियों की बारिश) हो गई।",
        "मसूर में एक भी सिंचाई की आवश्यकता नहीं पड़ती।",
      ]),
      exp("2. भारी दोमट मिट्टी", [
        "भारी दोमट मिट्टी में दूसरी सिंचाई देने से बचें।",
        "वरना मसूर जमीन पर बिछ (Lodging) जाती है।",
      ])
    ],
  }),

  soybean: guide({
    irrigationsHi: "Rainfed + 2–3 supplemental dry spell",
    irrigationsEn: "Rainfed + 2–3 supplemental dry spell",
    methodHi: "BBF drain + furrow irrigate",
    methodEn: "BBF drain + furrow irrigate",
    noteHi: "R5/R6 critical · V3 if rain stops",
    noteEn: "R5/R6 critical · V3 if rain stops",
    soilOrRegionHi: "DAS · R1/R2 sensitive",
    soilOrRegionEn: "DAS · R1/R2 sensitive",
    principleHi: "सोयाबीन में: *'फली में दाना भरते समय' (R5/R6 Stage) जल तनाव बहुत महत्वपूर्ण होता है। पानी का तनाव: उपज को 50% तक घटा देता है। दानों में तेल की मात्रा कम हो जाती है।",
    principleEn: "सोयाबीन में: *'फली में दाना भरते समय' (R5/R6 Stage) जल तनाव बहुत महत्वपूर्ण होता है। पानी का तनाव: उपज को 50% तक घटा देता है। दानों में तेल की मात्रा कम हो जाती है।",
    warningHi: "R5/R6 stress → 50% yield + oil loss। Midday leaf flip = तुरंत पानी।",
    warningEn: "R5/R6 stress → 50% yield + oil loss। Midday leaf flip = तुरंत पानी।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "अंकुरण व शुरुआती बढ़वार",
        periodHi: "15 – 20 दिन DAS",
        waterHi: "यदि बुवाई के बाद बारिश रुक जाए",
        badgeHi: "यदि बुवाई के बाद बारिश रुक जाए",
        photoKind: "veg",
        fieldIdHi: [
        "3 पत्ती वाली अवस्था (V3)।",
      ],
        pointsHi: [
        "यदि बुवाई के बाद बारिश रुक जाए",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फूल आते समय (R1/R2 Stage)",
        periodHi: "35 – 45 दिन DAS",
        waterHi: "बहुत संवेदनशील",
        badgeHi: "बहुत संवेदनशील",
        photoKind: "flower",
        fieldIdHi: [
        "पौधे पर छोटे बैंगनी/सफेद फूल दिखने लगें।",
      ],
        pointsHi: [
        "बहुत संवेदनशील",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "फली विकास व दाना भराव (R5 Stage)",
        periodHi: "55 – 70 दिन DAS",
        waterHi: "सबसे क्रिटिकल सिंचाई",
        badgeHi: "सबसे क्रिटिकल सिंचाई",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "फलियों के अंदर दाना मोटा होना शुरू हो चुका हो।",
      ],
        pointsHi: [
        "सबसे क्रिटिकल सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. ब्रॉड बेड फरो (BBF) या चौड़ी क्यारी विधि", [
        "हर 4 या 6 कतारों के बाद एक नाली जरूर होनी चाहिए।",
        "बारिश ज्यादा होने पर जल निकासी हो।",
        "सूखा पड़ने पर उसी नाली में पानी चलाकर सिंचाई की जा सके।",
      ]),
      exp("2. दोपहर में पत्ती झुकना", [
        "पत्तियां उल्टी करके देता है।",
        "यानी निचला हिस्सा धूप की तरफ कर देता है।",
        "तुरंत स्प्रिंकलर या नाली से पानी दें।",
      ])
    ],
  }),

  mustard: guide({
    irrigationsHi: "2–3",
    irrigationsEn: "2–3",
    methodHi: "No overhead at full yellow bloom",
    methodEn: "No overhead at full yellow bloom",
    noteHi: "1st water most important · 2nd at siliqua",
    noteEn: "1st water most important · 2nd at siliqua",
    soilOrRegionHi: "DAS · urea topdress with 1st",
    soilOrRegionEn: "DAS · urea topdress with 1st",
    principleHi: "सरसों में: पहला पानी सबसे महत्वपूर्ण होता है। दूसरा पानी फली बनते समय चाहिए।",
    principleEn: "सरसों में: पहला पानी सबसे महत्वपूर्ण होता है। दूसरा पानी फली बनते समय चाहिए।",
    warningHi: "Full yellow bloom पर overhead sprinkler = White rust / Sclerotinia।",
    warningEn: "Full yellow bloom पर overhead sprinkler = White rust / Sclerotinia।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "शाखाएं निकलते समय (Rosette/Branching)",
        periodHi: "28 – 35 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "तने से साइड की शाखाएं तेजी से निकल रही हों।",
        "इस पानी के साथ यूरिया का टॉप ड्रेसिंग होता है।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फलियां बनते समय (Siliqua formation)",
        periodHi: "60 – 65 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "खेत से 80% पीले फूल झड़ चुके हों।",
        "हरी फलियां (सींगियां) बन चुकी हों।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "दाना पकते समय (केवल हल्की/रेतीली जमीन में)",
        periodHi: "85 – 90 दिन DAS",
        waterHi: "बहुत हल्की सिंचाई",
        badgeHi: "बहुत हल्की सिंचाई",
        photoKind: "harvest",
        fieldIdHi: [
        "फलियों में दाना कड़ा हो रहा हो।",
      ],
        pointsHi: [
        "बहुत हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. सफेद रतुआ (White Rust) व तना गलन", [
        "यानी फूलों से भरा हो,",
        "ऊपर से फव्वारे से पानी न दें।",
        "नमी और छांव से सफेद रतुआ।",
        "स्केलेरोटिनिया तना गलन।",
        "ये फंगस पूरे खेत को बर्बाद कर सकते हैं।",
      ]),
      exp("2. हवा का रुख", [
        "सरसों का पौधा भारी हो जाता है।",
        "पूरी फसल आड़ी गिर सकती है।",
        "इससे 20-30% तेल की रिकवरी घट सकती है।",
      ])
    ],
  }),

  moongfali: guide({
    irrigationsHi: "खरीफ 2–4 · जायद 8–10 (8–10d)",
    irrigationsEn: "Kharif 2–4 · zaid 8–10 (every 8–10d)",
    methodHi: "Soft moist soil at pegging",
    methodEn: "Soft moist soil at pegging",
    noteHi: "Pegging CRITICAL · gypsum 45–50d",
    noteEn: "Pegging CRITICAL · gypsum 45–50d",
    soilOrRegionHi: "DAS",
    soilOrRegionEn: "DAS",
    principleHi: "मूंगफली में: *'पेगिंग अवस्था' (सूइयां जमीन में घुसना) सबसे नाजुक समय है। अगर इस समय: जमीन सख्त हो। जमीन सूखी हुई हो। तो: सूइयां जमीन में नहीं घुस पाएंगी। मूंगफली नहीं बनेगी।",
    principleEn: "मूंगफली में: *'पेगिंग अवस्था' (सूइयां जमीन में घुसना) सबसे नाजुक समय है। अगर इस समय: जमीन सख्त हो। जमीन सूखी हुई हो। तो: सूइयां जमीन में नहीं घुस पाएंगी। मूंगफली नहीं बनेगी।",
    warningHi: "Pegging पर hard/dry soil = no pods। Dig से 5–7 दिन पहले हल्का पानी।",
    warningEn: "Pegging पर hard/dry soil = no pods। Dig से 5–7 दिन पहले हल्का पानी।",
    stages: [
      stage({
        sequenceHi: "1st",
        titleHi: "वानस्पतिक बढ़वार (Vegetative)",
        periodHi: "20 – 25 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "पौधे की शाखाएं चारों तरफ फैल रही हों।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2nd",
        titleHi: "फूल आते समय (Flowering)",
        periodHi: "35 – 40 दिन DAS",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "पीले फूल बहुतायत में दिखने लगें।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3rd",
        titleHi: "सूइयां जमीन में घुसते समय (Pegging)",
        periodHi: "45 – 55 दिन DAS",
        waterHi: "सबसे महत्वपूर्ण",
        badgeHi: "सबसे महत्वपूर्ण",
        photoKind: "bulk",
        critical: true,
        fieldIdHi: [
        "फूलों के पीछे से पतली धागे जैसी सूइयां (Pegs) निकलें।",
        "ये मिट्टी की तरफ झुककर अंदर जा रही हों।",
      ],
        pointsHi: [
        "सबसे महत्वपूर्ण",
        "मिट्टी नम व मुलायम रहे।",
      ],
      }),
      stage({
        sequenceHi: "4th",
        titleHi: "फली का विकास (Pod development)",
        periodHi: "65 – 75 दिन DAS",
        waterHi: "नियमित मध्यम सिंचाई",
        badgeHi: "नियमित मध्यम सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "जमीन के अंदर छोटी मुलायम फलियां बन रही हों।",
      ],
        pointsHi: [
        "नियमित मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "5th",
        titleHi: "दाना भराव (Kernel filling)",
        periodHi: "85 – 95 दिन DAS",
        waterHi: "हल्की सिंचाई",
        badgeHi: "हल्की सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "फलियों के अंदर दाना मोटा हो रहा हो।",
      ],
        pointsHi: [
        "हल्की सिंचाई",
      ],
      }),
    ],
    experiences: [
      exp("1. जिप्सम और पानी का संगम", [
        "जिप्सम (कैल्शियम व सल्फर हेतु)",
        "उसके तुरंत बाद हल्की सिंचाई अनिवार्य है।",
        "कैल्शियम घुलकर सीधा बन रही फलियों (Pods) तक पहुंचे।",
        "खाली फली (Pop Pods) की समस्या न आए।",
      ]),
      exp("2. खुदाई से 7 दिन पहले हल्की सिंचाई", [
        "30-40% फलियां टूटकर जमीन के अंदर ही रह जाती हैं।",
        "खुदाई से 5-7 दिन पहले एक हल्का पानी दें।",
        "मिट्टी को भुरभुरी कर लें।",
      ])
    ],
  }),

  mango: guide({
    irrigationsHi: "आयु/मौसम अनुसार · Oct–Jan STOP",
    irrigationsEn: "Age/season based · Oct–Jan STOP",
    methodHi: "Ring basin 1.5–2m from trunk",
    methodEn: "Ring basin 1.5–2m from trunk",
    noteHi: "Flowering stress Oct–Jan",
    noteEn: "Flowering stress Oct–Jan",
    soilOrRegionHi: "Orchard · canopy drip line",
    soilOrRegionEn: "Orchard · canopy drip line",
    principleHi: "'अक्टूबर से जनवरी तक पानी का पूर्ण बहिष्कार (तनाव)' यदि इस समय पेड़ को पानी दिया गया: पेड़ पर बौर (फूल) नहीं आएगा। केवल नए पत्ते (Vegetative flush) निकल आएंगे। इसलिए यह period intentional water stress period है।",
    principleEn: "'अक्टूबर से जनवरी तक पानी का पूर्ण बहिष्कार (तनाव)' यदि इस समय पेड़ को पानी दिया गया: पेड़ पर बौर (फूल) नहीं आएगा। केवल नए पत्ते (Vegetative flush) निकल आएंगे। इसलिए यह period intentional water stress period है।",
    warningHi: "Oct–Jan FULL stop — flowering stress। Bloom पर पानी नहीं। Alphonso spongy tissue — harvest से पहले stop।",
    warningEn: "Oct–Jan FULL stop — flowering stress। Bloom पर पानी नहीं। Alphonso spongy tissue — harvest से पहले stop।",
    stages: [
      stage({
        sequenceHi: "1",
        titleHi: "तनाव अवधि (Rest / Stress Period)",
        periodHi: "अक्टूबर से जनवरी मध्य तक",
        waterHi: "सिंचाई पूरी तरह बंद",
        badgeHi: "पानी बंद",
        photoKind: "harvest",
        fieldIdHi: [
        "पेड़ों की पत्तियां पुरानी और गहरी हरी हो जाएं।",
        "यह तनाव पेड़ को बौर (फूल कलियां) बनाने पर मजबूर करता है।",
      ],
        pointsHi: [
        "सिंचाई पूरी तरह बंद",
      ],
      }),
      stage({
        sequenceHi: "2",
        titleHi: "बौर खिलते समय (Full Bloom)",
        periodHi: "फरवरी – मार्च शुरुआत",
        waterHi: "सिंचाई नहीं करनी चाहिए",
        badgeHi: "सिंचाई नहीं करनी चाहिए",
        photoKind: "flower",
        fieldIdHi: [
        "पूरे पेड़ पर पीला बौर खिला हो।",
        "इस समय पानी देने से:",
        "परागण रुकता है।",
        "बौर झुलसकर गिर जाता है।",
      ],
        pointsHi: [
        "सिंचाई नहीं करनी चाहिए",
      ],
      }),
      stage({
        sequenceHi: "3",
        titleHi: "फल टिकने पर (Fruit Set - मटर दाना)",
        periodHi: "मार्च मध्य · बौर झड़ने के बाद",
        waterHi: "पहला पानी (अति आवश्यक)",
        badgeHi: "पहला पानी (अति आवश्यक)",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
        "बौर झड़ जाए।",
        "छोटे-छोटे मटर/कंचे के आकार के आम दिखने लगें।",
        "यह पानी फल गिरने से रोकता है।",
      ],
        pointsHi: [
        "पहला पानी (अति आवश्यक)",
      ],
      }),
      stage({
        sequenceHi: "4",
        titleHi: "फल का विकास (Marble to Egg size)",
        periodHi: "अप्रैल से मई मध्य तक",
        waterHi: "10 – 12 दिन के अंतर पर नियमित पानी",
        badgeHi: "10 – 12 दिन के अंतर पर नियमित पानी",
        photoKind: "bulk",
        fieldIdHi: [
        "फल तेजी से गूदा और वजन ले रहे हों।",
        "गर्मियों की लू से बचाने के लिए थाले में नमी रखें।",
      ],
        pointsHi: [
        "10 – 12 दिन के अंतर पर नियमित पानी",
      ],
      }),
      stage({
        sequenceHi: "5",
        titleHi: "परिपक्वता (Maturity / Ripening)",
        periodHi: "तुड़ाई से 15–20 दिन पहले",
        waterHi: "सिंचाई पूर्णतः बंद",
        badgeHi: "पानी बंद",
        photoKind: "harvest",
        fieldIdHi: [
        "आम की डंडी के पास गड्ढा (Shoulder) बनने लगे।",
      ],
        pointsHi: [
        "सिंचाई पूर्णतः बंद",
      ],
      }),
    ],
    experiences: [
      exp("1. रिंग बेसिन (थाला) विधि", [
        "कभी भी आम के मुख्य तने से सटाकर न दें।",
        "तने से 1.5 से 2 मीटर दूर।",
        "पेड़ की छतरी (Canopy/Drip line) के नीचे नाली बनाकर पानी दें।",
        "पोषक तत्व लेने वाली सक्रिय जड़ें वहीं होती हैं।",
      ])
    ],
  }),

  banana: guide({
    irrigationsHi: "Drip 20–30 L/plant/day · flood 4–5d/8–10d",
    irrigationsEn: "Drip 20–30 L/plant/day · flood 4–5d/8–10d",
    methodHi: "Drip / flood · water 1 foot from stem",
    methodEn: "Drip / flood · water 1 foot from stem",
    noteHi: "DAP terminology · winter 12–15 · summer 30–35 L",
    noteEn: "DAP terminology · winter 12–15 · summer 30–35 L",
    soilOrRegionHi: "210–240 DAP shooting critical",
    soilOrRegionEn: "210–240 DAP shooting critical",
    principleHi: "",
    principleEn: "",
    warningHi: "Shooting (210–240 DAP) सबसे critical। Stem पर पानी pool = Erwinia। 7–8 month dry → choke throat।",
    warningEn: "Shooting (210–240 DAP) सबसे critical। Stem पर पानी pool = Erwinia। 7–8 month dry → choke throat।",
    stages: [
      stage({
        sequenceHi: "1",
        titleHi: "स्थापना व अंकुरण",
        periodHi: "0 – 60 दिन · DAP",
        waterHi: "हल्की व निरंतर नमी",
        badgeHi: "हल्की व निरंतर नमी",
        photoKind: "veg",
        fieldIdHi: [
        "कंद/टिश्यू कल्चर पौधा नई जड़ें जमाए।",
      ],
        pointsHi: [
        "हल्की व निरंतर नमी",
      ],
      }),
      stage({
        sequenceHi: "2",
        titleHi: "मुख्य वानस्पतिक बढ़वार (Grand Growth)",
        periodHi: "60 – 180 दिन · DAP",
        waterHi: "भारी पानी की मांग",
        badgeHi: "भारी पानी की मांग",
        photoKind: "veg",
        fieldIdHi: [
        "पौधा तेजी से चौड़े पत्ते निकाले।",
        "उत्तम पैदावार के लिए 30-35 स्वस्थ पत्तियां जरूरी हैं।",
      ],
        pointsHi: [
        "भारी पानी की मांग",
      ],
      }),
      stage({
        sequenceHi: "3",
        titleHi: "घार/कमल निकलना (Shooting / Inflorescence)",
        periodHi: "210 – 240 दिन · 7–8 महीने",
        waterHi: "सबसे क्रिटिकल स्टेज",
        badgeHi: "सबसे क्रिटिकल स्टेज",
        photoKind: "flower",
        critical: true,
        fieldIdHi: [
        "पौधे के बीच से लाल रंग का फूल (कमल/घार) बाहर निकलने की स्थिति में हो।",
      ],
        pointsHi: [
        "सबसे क्रिटिकल स्टेज",
      ],
      }),
      stage({
        sequenceHi: "4",
        titleHi: "फली भराव (Finger Development)",
        periodHi: "250 – 320 दिन",
        waterHi: "निरंतर व भरपूर पानी",
        badgeHi: "निरंतर व भरपूर पानी",
        photoKind: "bulk",
        fieldIdHi: [
        "केले की उंगलियां मोटी और सीधी हो रही हों।",
      ],
        pointsHi: [
        "निरंतर व भरपूर पानी",
      ],
      }),
      stage({
        sequenceHi: "5",
        titleHi: "कटाई से पूर्व",
        periodHi: "कटाई से 10–12 दिन पहले",
        waterHi: "पानी बंद",
        badgeHi: "पानी बंद",
        photoKind: "harvest",
        fieldIdHi: [
        "घार के पहले 2-3 पंजों के केले गोल होने लगें।",
        "उनके कोने (Angles) खत्म हो जाएं।",
      ],
        pointsHi: [
        "पानी बंद",
      ],
      }),
    ],
    experiences: [
      exp("1. चोक-थ्रोट (Choke Throat) से बचाव", [
        "7वें-8वें महीने में पानी की कमी हो गई।",
        "या कड़ाके की ठंड में खेत सूखा रह गया।",
        "केले का कमल तने के अंदर ही फंस जाता है।",
        "बाहर नहीं निकल पाता।",
        "पूरी घार बर्बाद हो जाती है।",
      ])
    ],
  }),

  grapes: guide({
    irrigationsHi: "Pruning-linked · North 1 · MH/South Apr + Oct",
    irrigationsEn: "Pruning-linked · North 1 · MH/South Apr + Oct",
    methodHi: "Days after pruning · drip last 25d light",
    methodEn: "Days after pruning · drip last 25d light",
    noteHi: "40–55 flowering reduce · 95–120 veraison reduce",
    noteEn: "40–55 flowering reduce · 95–120 veraison reduce",
    soilOrRegionHi: "Oct fruit cycle / April foundation",
    soilOrRegionEn: "Oct fruit cycle / April foundation",
    principleHi: "",
    principleEn: "",
    warningHi: "Flowering पर mild stress — reduce water। Dry + sudden rain/canal = berry cracking।",
    warningEn: "Flowering पर mild stress — reduce water। Dry + sudden rain/canal = berry cracking।",
    stages: [
      stage({
        sequenceHi: "1",
        titleHi: "छंटाई के बाद फुटाव (Sprouting)",
        periodHi: "0 – 15 दिन · छंटाई के बाद दिन",
        waterHi: "भारी सिंचाई",
        badgeHi: "भारी सिंचाई",
        photoKind: "veg",
        fieldIdHi: [
        "छंटाई के तुरंत बाद एक भारी पानी दिया जाता है।",
        "उद्देश्य:",
        "सुप्त कलियां (Buds) तेजी से फूटें।",
      ],
        pointsHi: [
        "भारी सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "2",
        titleHi: "बेल की बढ़वार व फूल कलियां",
        periodHi: "15 – 40 दिन",
        waterHi: "मध्यम सिंचाई",
        badgeHi: "मध्यम सिंचाई",
        photoKind: "flower",
        fieldIdHi: [
        "हरी टहनियां 10-15 पत्ती की हो जाएं।",
        "छोटे बौर के गुच्छे दिखें।",
      ],
        pointsHi: [
        "मध्यम सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "3",
        titleHi: "फूल खिलते समय (Flowering / Bloom)",
        periodHi: "40 – 55 दिन",
        waterHi: "पानी घटाएं (हल्का तनाव)",
        badgeHi: "पानी घटाएं (हल्का तनाव)",
        photoKind: "flower",
        fieldIdHi: [
        "सफेद बारीक फूल खिलें।",
      ],
        pointsHi: [
        "पानी घटाएं (हल्का तनाव)",
      ],
      }),
      stage({
        sequenceHi: "4",
        titleHi: "दाना विकास (Berry Growth / GA3 Dips)",
        periodHi: "60 – 90 दिन",
        waterHi: "भरपूर व नियमित सिंचाई",
        badgeHi: "भरपूर व नियमित सिंचाई",
        photoKind: "bulk",
        fieldIdHi: [
        "दाने कंचे के आकार के हो रहे हों।",
      ],
        pointsHi: [
        "भरपूर व नियमित सिंचाई",
      ],
      }),
      stage({
        sequenceHi: "5",
        titleHi: "वेराइसन (रंग बदलना व मिठास आना)",
        periodHi: "95 – 120 दिन",
        waterHi: "पानी धीरे-धीरे कम करें",
        badgeHi: "पानी धीरे-धीरे कम करें",
        photoKind: "sow",
        fieldIdHi: [
        "दाने मुलायम पड़ने लगें।",
        "उनमें चीनी (Brix) बनने लगे।",
      ],
        pointsHi: [
        "पानी धीरे-धीरे कम करें",
      ],
      }),
      stage({
        sequenceHi: "6",
        titleHi: "तुड़ाई से ठीक पहले",
        periodHi: "तुड़ाई से 7–10 दिन पहले",
        waterHi: "सिंचाई बंद",
        badgeHi: "पानी बंद",
        photoKind: "harvest",
        fieldIdHi: [
        "अंगूर में पूरी मिठास और प्राकृतिक चमक आ जाए।",
      ],
        pointsHi: [
        "सिंचाई बंद",
      ],
      }),
    ],
    experiences: [
      exp("अंगूर फटना (Berry Cracking)", [
        "जमीन सूखी हो।",
        "अचानक नहर का पानी लग जाए।",
        "या बेमौसम बारिश हो जाए।",
        "दाख (दाने) बीच से फट जाते हैं।",
        "उन पर मधुमक्खियां लगती हैं।",
        "फफूंद लग जाती है।",
      ]),
      exp("Practical rule", [
        "ड्रिप से केवल हल्की और नियंत्रित नमी दी जाती है।",
      ])
    ],
  }),
};

export const CRITICAL_IRRIGATION_ALIASES: Record<string, string> = {
  groundnut: "moongfali",
  mungfali: "moongfali",
  rice: "paddy",
  dhaan: "paddy",
  arhar: "pulses",
  tur: "pulses",
  pigeonpea: "pulses",
  okra: "bhindi",
  eggplant: "brinjal",
  baingan: "brinjal",
};
