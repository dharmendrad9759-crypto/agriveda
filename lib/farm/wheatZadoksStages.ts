/**
 * Scientific FAO / Zadoks Growth Stages Framework for Wheat (Triticum aestivum)
 * Verified against ICAR-IIWBR (Indian Institute of Wheat and Barley Research, Karnal) agronomic standards.
 */

import { CropStageDefinition } from "@/lib/farm/types";

export const WHEAT_ZADOKS_STAGES: CropStageDefinition[] = [
  {
    cropId: "wheat",
    stageId: "germination",
    zadoksCode: "Z00-Z09",
    stageNameHi: "अंकुरण व जमाव (Germination & Emergence)",
    stageNameEn: "Germination & Emergence",
    stageOrder: 0,
    descriptionHi:
      "बीज में नमी का प्रवेश, जड़ (Radicle) का निकलना और प्रथम प्रांकुर (Coleoptile) का मिट्टी से बाहर आना।",
    identificationCriteriaHi: [
      "मिट्टी की सतह पर हल्की हरी सुई जैसी पत्तियां दिखना।",
      "खेत में 70-80% अंकुरण 6 से 10 दिनों के अंदर पूरा हो जाता है।",
      "पौधों की कतारें दूर से स्पष्ट दिखने लगती हैं।",
    ],
    typicalDaysRange: [0, 10],
    baseTempC: 5.0,
    targetGDD: [0, 120],
    photoUrl: "/images/home/home-job-plan.jpg",
    importantActivitiesHi: [
      "खेत में समान जमाव (Crop Stand) का निरीक्षण करें।",
      "यदि कहीं जमाव कम है, तो तुरंत हल्की नमी में नागा भरें (Gap Filling)।",
      "चिड़ियों और चूहों से नए अंकुरित पौधों की सुरक्षा करें।",
    ],
    irrigationConsiderationsHi:
      "इस समय पानी न दें जब तक कि मिट्टी में बहुत अधिक सूखा न हो। अधिक पानी से जमाव रुक सकता है और बीज सड़ सकता है।",
    nutrientManagementHi:
      "बुवाई के समय डाला गया बेसल पोटाश (MOP) व डीएपी (DAP) पौधे की जड़ों को मजबूती दे रहा है। अभी कोई खाद न डालें।",
    weedManagementHi:
      "यदि प्री-इमर्जेंस हर्बिसाइड (जैसे पेंडीमेथालिन 30% EC) नहीं डाला था, तो पहले 20 दिन तक खरपतवार की निगरानी करें।",
    pestMonitoringHi:
      "दीमक और कटवर्म (Guzhia weevil) की निगरानी करें। यदि तने कटे मिलें तो क्लोरपायरीफॉस का प्रयोग करें।",
    diseaseMonitoringHi:
      "बीज-जनित फफूंद (Foot rot / Damping off) की निगरानी करें।",
    commonMistakesHi: [
      "अंकुरण के तुरंत बाद भारी सिंचाई करना जिससे मिट्टी पर पपड़ी जम जाती है।",
      "बीज को बहुत गहरा (5 सेमी से अधिक) बोना जिससे अंकुर बाहर नहीं आ पाता।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: ताज जड़ विकास (Crown Root Initiation - CRI) जो 20-22 दिन पर आएगी (पहला पानी)।",
  },
  {
    cropId: "wheat",
    stageId: "cri",
    zadoksCode: "Z10-Z19",
    stageNameHi: "ताज जड़ विकास (Crown Root Initiation - CRI)",
    stageNameEn: "Crown Root Initiation (CRI)",
    stageOrder: 1,
    descriptionHi:
      "गेहूँ के जीवन चक्र की सबसे महत्वपूर्ण अवस्था! बीज के ऊपर तने के आधार से स्थायी क्राउन जड़ें निकलती हैं जो पूरे जीवन पौधे को भोजन और सहारा देंगी।",
    identificationCriteriaHi: [
      "पौधे में 3 से 4 हरी पत्तियां निकल आती हैं।",
      "पौधे को सावधानी से उखाड़कर जड़ धोएं तो बीज के ठीक ऊपर सफेद छल्ले जैसी नई जड़ें दिखेंगी।",
      "बुवाई के ठीक 20 से 25 दिन बाद यह अवस्था आती है।",
    ],
    typicalDaysRange: [18, 25],
    baseTempC: 5.0,
    targetGDD: [120, 260],
    photoUrl: "/images/home/ask-expert-trust.jpg",
    importantActivitiesHi: [
      "गेहूँ का पहला और सबसे महत्वपूर्ण पानी लगाएं (CRI Irrigation)।",
      "सिंचाई के 2-3 दिन बाद पहली यूरिया टॉप-ड्रेसिंग (45-50 किग्रा/एकड़) डालें।",
      "चौड़ी और संकरी पत्ती वाले खरपतवारों की पहचान शुरू करें।",
    ],
    irrigationConsiderationsHi:
      "अत्यंत संवेदनशील! यदि इस अवस्था में पानी देने में 10 दिन की भी देरी हुई तो पैदावार में 25-30% तक की भारी गिरावट आ सकती है। पानी हल्का लगाएं, जलभराव न होने दें।",
    nutrientManagementHi:
      "पहली सिंचाई के ओट आने पर यूरिया 45 किग्रा + जिंक सल्फेट (यदि बुवाई पर नहीं डाला था) का छिड़काव करें।",
    weedManagementHi:
      "गुल्ली डंडा (Phalaris minor) और बथुआ निकलना शुरू होते हैं। पहली सिंचाई के बाद खरपतवार नाशक का सही समय होता है।",
    pestMonitoringHi:
      "माहू (Aphid) और तना छेदक के शुरुआती लक्षणों की निगरानी करें।",
    diseaseMonitoringHi:
      "जड़ सड़न (Root rot) के लक्षणों की जांच करें।",
    commonMistakesHi: [
      "CRI पानी को नजरअंदाज करना या 30-35 दिन तक टालना।",
      "खेत में बहुत ज्यादा पानी भर देना जिससे पौधा पीला पड़ने लगता है।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: कल्ले फूटना (Tillering) जहां मुख्य पौधे से नए तने निकलेंगे।",
  },
  {
    cropId: "wheat",
    stageId: "tillering",
    zadoksCode: "Z20-Z29",
    stageNameHi: "कल्ले फूटना (Tillering Stage)",
    stageNameEn: "Tillering Stage",
    stageOrder: 2,
    descriptionHi:
      "पौधे की मुख्य शाखा से सहायक कल्ले (Tillers) फूटते हैं। अधिक स्वस्थ कल्ले = अधिक बालियां = बंपर पैदावार!",
    identificationCriteriaHi: [
      "एक पौधे में मुख्य तने के बगल से 4 से 6 नए कल्ले निकलते दिखते हैं।",
      "खेत पूरी तरह हरा-भरा और घना दिखाई देने लगता है।",
      "बुवाई के 25 से 45 दिन का समय।",
    ],
    typicalDaysRange: [25, 45],
    baseTempC: 5.0,
    targetGDD: [260, 520],
    photoUrl: "/images/home/home-job-plan.jpg",
    importantActivitiesHi: [
      "खरपतवार नाशक का सही समय (30-35 दिन पर)। गुल्ली डंडा हेतु क्लोडिनाफॉप / सल्फोसल्फ्यूरॉन का छिड़काव।",
      "यूरिया की दूसरी खुराक (35-40 दिन पर) डालें।",
      "कल्लों की संख्या और बढ़वार का साप्ताहिक निरीक्षण करें।",
    ],
    irrigationConsiderationsHi:
      "40-45 दिन पर दूसरी सिंचाई (कल्ले फूटने के समय) करें। इससे बनने वाले सभी कल्ले मजबूत बालियों में बदलते हैं।",
    nutrientManagementHi:
      "यूरिया (नाइट्रोजन) की दूसरी किस्त। यदि पत्तियां पीली पड़ रही हों तो 0.5% जिंक सल्फेट + 2% यूरिया का पर्णीय स्प्रे करें।",
    weedManagementHi:
      "खरपतवार नियंत्रण की सबसे महत्वपूर्ण खिड़की! बथुआ, कृष्णनील, गुल्ली डंडा 2-3 पत्ती अवस्था में आसानी से नियंत्रित होते हैं।",
    pestMonitoringHi:
      "सैनिक कीट (Armyworm) और दीमक की निगरानी।",
    diseaseMonitoringHi:
      "पत्तियों पर पीले रतुआ (Yellow rust) के धब्बों की निगरानी (खासकर उत्तरी भारत/तराई क्षेत्रों में)।",
    commonMistakesHi: [
      "खरपतवार नाशक का देर से (45 दिन बाद) स्प्रे करना जब खरपतवार बड़े हो जाते हैं और दवा का असर कम होता है।",
      "सिंचाई के बिना सूखी मिट्टी में यूरिया बिखेर देना।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: तना वृद्धि व गांठ बनना (Stem Elongation / Jointing)।",
  },
  {
    cropId: "wheat",
    stageId: "stem_elongation",
    zadoksCode: "Z30-Z39",
    stageNameHi: "तना वृद्धि व गांठ बनना (Jointing / Stem Elongation)",
    stageNameEn: "Stem Elongation / Jointing",
    stageOrder: 3,
    descriptionHi:
      "पौधे का तना तेजी से ऊपर बढ़ता है और तने के निचले हिस्से में पहली और दूसरी गांठ (Node) महसूस होने लगती है।",
    identificationCriteriaHi: [
      "तने को जमीन के पास दबाने पर पहली सख्त गांठ (First Node) उंगलियों से महसूस होती है।",
      "पौधे की ऊंचाई तेजी से बढ़ती है (30 से 50 सेमी)।",
      "बुवाई के 45 से 65 दिन का समय।",
    ],
    typicalDaysRange: [45, 65],
    baseTempC: 5.0,
    targetGDD: [520, 800],
    photoUrl: "/images/home/ask-expert-trust.jpg",
    importantActivitiesHi: [
      "तीसरी सिंचाई 60-65 दिन पर करें।",
      "यूरिया की अंतिम टॉप-ड्रेसिंग इस अवस्था से पहले पूरी कर लें।",
      "पीले रतुआ (Yellow Rust) और माहू की नियमित खेत निगरानी (Scouting) करें।",
    ],
    irrigationConsiderationsHi:
      "इस समय पानी की कमी से बालियों में दानों की संख्या घट जाती है। मिट्टी में उचित नमी बनाए रखें।",
    nutrientManagementHi:
      "नाइट्रोजन की अंतिम टॉप-ड्रेसिंग। इसके बाद जमीन में यूरिया न डालें, अन्यथा फसल गिरने (Lodging) का खतरा बढ़ जाता है।",
    weedManagementHi:
      "इस समय 2,4-D जैसे हार्मोनल हर्बिसाइड का प्रयोग न करें, इससे बालियां मुड़ सकती हैं।",
    pestMonitoringHi:
      "चेपा / माहू (Aphids) पत्तों और तने पर रस चूसते दिख सकते हैं।",
    diseaseMonitoringHi:
      "पीला रतुआ (Yellow Rust - पट्टियों में हल्दी जैसा पाउडर) का दैनिक निरीक्षण।",
    commonMistakesHi: [
      "गांठ बनने के बाद बहुत देर से यूरिया डालना जिससे फसल कमजोर होकर गिर जाती है।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: बूटिंग / गोभ अवस्था (Booting) जहां पत्ती में बाली फूलती है।",
  },
  {
    cropId: "wheat",
    stageId: "booting",
    zadoksCode: "Z40-Z49",
    stageNameHi: "गोभ अवस्था (Booting Stage)",
    stageNameEn: "Booting Stage",
    stageOrder: 4,
    descriptionHi:
      "आखिरी पत्ती (झंडा पत्ती / Flag Leaf) के खोल के अंदर बाली बनकर फूलने लगती है। झंडा पत्ती पैदावार का 50% से अधिक भोजन बनाती है!",
    identificationCriteriaHi: [
      "सबसे ऊपरी पत्ती का तना फूला हुआ (सूजा हुआ) दिखता है।",
      "हाथ से छूने पर पत्ती के अंदर बाली का उभार साफ महसूस होता है।",
      "बुवाई के 65 से 80 दिन का समय।",
    ],
    typicalDaysRange: [65, 80],
    baseTempC: 5.0,
    targetGDD: [800, 1050],
    photoUrl: "/images/home/home-job-plan.jpg",
    importantActivitiesHi: [
      "झंडा पत्ती को रोगमुक्त रखने के लिए 0:52:34 (N-P-K) + बोरॉन 20% का स्प्रे लाभदायक होता है।",
      "रतुआ रोग दिखते ही प्रोपिकोनाज़ोल 25% EC का तुरंत स्प्रे करें।",
      "मौसम के पूर्वानुमान पर नजर रखें (असामयिक वर्षा/तेज हवा)।",
    ],
    irrigationConsiderationsHi:
      "पानी की बहुत अधिक मांग होती है। यदि मिट्टी में नमी कम हो तो बालियों का आकार छोटा रह जाता है।",
    nutrientManagementHi:
      "एनपीके 00:52:34 (1 किग्रा/एकड़) + बोरॉन 20% (100 ग्राम/एकड़) का 150 लीटर पानी में स्प्रे परागण को मजबूत करता है।",
    weedManagementHi:
      "अब खरपतवार नाशक का स्प्रे न करें। यदि कोई बड़ा खरपतवार बचा हो तो हाथ से निकालें।",
    pestMonitoringHi:
      "माहू (Aphid) का प्रकोप बढ़ सकता है। थ्रेशोल्ड (10-15 माहू प्रति टिलर) पर इमिडाक्लोप्रिड का छिड़काव करें।",
    diseaseMonitoringHi:
      "करनाल बंट (Karnal Bunt) और पीला/भूरा रतुआ की रोकथाम।",
    commonMistakesHi: [
      "झंडा पत्ती के रोगों को नजरअंदाज करना जिससे दानों का वजन 40% तक कम हो जाता है।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: बालियां निकलना (Heading Stage)।",
  },
  {
    cropId: "wheat",
    stageId: "heading",
    zadoksCode: "Z50-Z59",
    stageNameHi: "बालियां निकलना (Heading / Ear Emergence)",
    stageNameEn: "Heading / Ear Emergence",
    stageOrder: 5,
    descriptionHi:
      "खेत में हरी-हरी बालियां पत्ती के खोल से बाहर निकल आती हैं। पूरा खेत एक समान बालियों से सज जाता है।",
    identificationCriteriaHi: [
      "तने के शीर्ष से बालियां पूरी तरह बाहर निकल आती हैं।",
      "खेत में 50% से अधिक पौधों की बालियां दिखाई देने लगती हैं।",
      "बुवाई के 80 से 95 दिन का समय।",
    ],
    typicalDaysRange: [80, 95],
    baseTempC: 5.0,
    targetGDD: [1050, 1280],
    photoUrl: "/images/home/ask-expert-trust.jpg",
    importantActivitiesHi: [
      "खेत में समान बाली निकलने की जांच करें।",
      "हल्की सिंचाई (चौथी सिंचाई) करें ताकि तेज हवा में पौधे न गिरें।",
      "माहू और सैनिक कीट की निगरानी जारी रखें।",
    ],
    irrigationConsiderationsHi:
      "हवा शांत होने पर ही पानी लगाएं। दोपहर के समय तेज हवा में पानी देने से फसल गिर (Lodging) सकती है।",
    nutrientManagementHi:
      "पत्तियों पर 13:00:45 (पोटैशियम नाइट्रेट) का 1% घोल दानों की चमक और वजन बढ़ाने के लिए डाला जा सकता है।",
    weedManagementHi:
      "फसल की छाया से नीचे के खरपतवार स्वतः दब जाते हैं।",
    pestMonitoringHi:
      "बालियों में माहू चिपकना शुरू हो सकते हैं।",
    diseaseMonitoringHi:
      "हेड ब्लाइट और पाउडरी मिल्ड्यू (सफेद चूर्ण) की निगरानी करें।",
    commonMistakesHi: [
      "तेज पछुआ हवा में भारी सिंचाई कर देना जिससे पूरी फसल जमीन पर बिछ जाती है।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: फूल व परागण (Flowering / Anthesis)।",
  },
  {
    cropId: "wheat",
    stageId: "flowering",
    zadoksCode: "Z60-Z69",
    stageNameHi: "फूल व परागण (Flowering / Anthesis)",
    stageNameEn: "Flowering / Anthesis",
    stageOrder: 6,
    descriptionHi:
      "बाली के दानों वाले खानों से छोटे पीले परागकोश (Anthers) बाहर लटकते हैं। परागण द्वारा प्रत्येक दाने का गर्भधारण होता है।",
    identificationCriteriaHi: [
      "बाली के मध्य भाग से शुरू होकर ऊपर और नीचे हल्के पीले रंग के बारीक फूल लटके दिखते हैं।",
      "प्रातःकाल धूप खिलने पर पराग उड़ते हैं।",
      "बुवाई के 95 से 105 दिन का समय।",
    ],
    typicalDaysRange: [95, 105],
    baseTempC: 5.0,
    targetGDD: [1280, 1450],
    photoUrl: "/images/home/home-job-plan.jpg",
    importantActivitiesHi: [
      "इस 4-5 दिन की अवधि में किसी भी प्रकार के कीटनाशक का स्प्रे न करें ताकि परागण बाधित न हो।",
      "मिट्टी में पर्याप्त नमी बनाए रखें।",
      "तापमान में अचानक वृद्धि (पछेती गर्मी) पर नजर रखें।",
    ],
    irrigationConsiderationsHi:
      "यदि बहुत सूखा हो तो शाम के समय अत्यंत हल्की सिंचाई करें।",
    nutrientManagementHi:
      "इस नाजुक अवस्था में किसी भी उर्वरक का छिड़काव न करें।",
    weedManagementHi: "कोई कार्य नहीं।",
    pestMonitoringHi: "दैनिक निगरानी, किंतु स्प्रे से बचें।",
    diseaseMonitoringHi: "करनाल बंट के संक्रमण की अनुकूल परिस्थितियां।",
    commonMistakesHi: [
      "फूल खिलने के समय सुबह के वक्त तेज दबाव से कीटनाशक का छिड़काव करना जिससे दाना नहीं बनता (पछेती बंध्यता)।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: दुग्ध अवस्था (Milking Stage) जहां दाने में दूध भरता है।",
  },
  {
    cropId: "wheat",
    stageId: "milking",
    zadoksCode: "Z70-Z79",
    stageNameHi: "दुग्ध अवस्था (Milk Stage / Grain Filling)",
    stageNameEn: "Milk Stage / Grain Filling",
    stageOrder: 7,
    descriptionHi:
      "दाने का तेजी से विकास! दाने को अंगूठे से दबाने पर सफेद दूध जैसा तरल निकलता है। यह दाने का वजन तय करने का निर्णायक समय है।",
    identificationCriteriaHi: [
      "बाली के दाने को दबाने पर सफेद दूधिया रस बाहर निकलता है।",
      "बाली का वजन बढ़ जाता है और वह हल्की नीचे झुकने लगती है।",
      "बुवाई के 105 से 120 दिन का समय।",
    ],
    typicalDaysRange: [105, 120],
    baseTempC: 5.0,
    targetGDD: [1450, 1720],
    photoUrl: "/images/home/ask-expert-trust.jpg",
    importantActivitiesHi: [
      "पांचवी सिंचाई (दूधिया अवस्था में) करें।",
      "पछेती गर्मी (Terminal Heat) से बचाव के लिए 00:00:50 (पोटेशियम सल्फेट) 1% का छिड़काव दाने को मोटा करता है।",
      "माहू यदि बालियों पर रस चूस रहे हों तो त्वरित नियंत्रण करें।",
    ],
    irrigationConsiderationsHi:
      "पानी की अंतिम मुख्य सिंचाई। इस समय सूखा पड़ने पर दाना सिकुड़ जाता है (Shriveled Grains) और 20% तक पैदावार घट जाती है।",
    nutrientManagementHi:
      "00:00:50 (पोटेशियम सल्फेट) 1 किग्रा प्रति 100 लीटर पानी का स्प्रे दानों में स्टार्च और प्रोटीन का भराव बढ़ाता है।",
    weedManagementHi: "कोई कार्य नहीं।",
    pestMonitoringHi: "माहू (Aphids) का अंतिम प्रकोप।",
    diseaseMonitoringHi: "भूरा रतुआ (Brown Rust) के लक्षण।",
    commonMistakesHi: [
      "दूधिया अवस्था में पानी रोक देना जिससे दाने बारीक और हल्के रह जाते हैं।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: दाना सख्त होना (Dough Stage)।",
  },
  {
    cropId: "wheat",
    stageId: "dough",
    zadoksCode: "Z80-Z89",
    stageNameHi: "दाना सख्त होना (Dough Stage)",
    stageNameEn: "Dough Stage",
    stageOrder: 8,
    descriptionHi:
      "दूध सूखकर गाढ़ा गूंधा हुआ आटा (Dough) बन जाता है। दाने को दबाने पर वह नाखून से दबता है लेकिन दूध नहीं निकलता। पौधा पीला पड़ने लगता है।",
    identificationCriteriaHi: [
      "दाने को नाखून से दबाने पर निशान बनता है, लेकिन रस नहीं निकलता।",
      "पौधे की निचली पत्तियां सूखने लगती हैं और बालियां सुनहरी होने लगती हैं।",
      "बुवाई के 120 से 135 दिन का समय।",
    ],
    typicalDaysRange: [120, 135],
    baseTempC: 5.0,
    targetGDD: [1720, 1980],
    photoUrl: "/images/home/home-job-plan.jpg",
    importantActivitiesHi: [
      "सिंचाई पूरी तरह बंद कर दें। अब पानी देने से कोई लाभ नहीं होगा बल्कि फसल गिर सकती है।",
      "कटाई यंत्र (Combine Harvester / थ्रेशर) की व्यवस्था शुरू करें।",
      "भंडारण हेतु बोरियों और गोदाम की सफाई व धूप दिखाएं।",
    ],
    irrigationConsiderationsHi:
      "अब पानी बिल्कुल न लगाएं! मिट्टी को सूखने दें ताकि कटाई मशीनें खेत में आसानी से चल सकें।",
    nutrientManagementHi: "किसी भी खाद की आवश्यकता नहीं है।",
    weedManagementHi: "कोई कार्य नहीं।",
    pestMonitoringHi: "चूहों की रोकथाम के लिए बिलों में विष चुग्गा रखें।",
    diseaseMonitoringHi: "फसल रोगमुक्त अवस्था में परिपक्व हो रही है।",
    commonMistakesHi: [
      "इस अवस्था में अनावश्यक पानी लगाना जिससे फसल गिर जाती है और कटाई में भारी परेशानी होती है।",
    ],
    nextStagePreviewHi:
      "अगली अवस्था: पूर्ण पक्वता व कटाई (Ripening & Harvest)।",
  },
  {
    cropId: "wheat",
    stageId: "ripening",
    zadoksCode: "Z90-Z99",
    stageNameHi: "पूर्ण पक्वता व कटाई (Ripening & Harvest)",
    stageNameEn: "Ripening & Harvest",
    stageOrder: 9,
    descriptionHi:
      "फसल सुनहरी पीली होकर पूरी तरह पक चुकी है। दाने में नमी 12-14% रह जाती है। यह किसान की 5 महीने की मेहनत का फल समेटने का समय है!",
    identificationCriteriaHi: [
      "पूरा पौधा और बालियां सुनहरी-भूरी हो चुकी हैं।",
      "दाने को दांत से काटने पर 'कट' की आवाज आती है।",
      "पत्तियां पूरी तरह सूख चुकी हैं।",
      "बुवाई के 135 से 150 दिन का समय।",
    ],
    typicalDaysRange: [135, 150],
    baseTempC: 5.0,
    targetGDD: [1980, 2300],
    photoUrl: "/images/home/ask-expert-trust.jpg",
    importantActivitiesHi: [
      "धूप खिली होने पर कंबाइन हार्वेस्टर या रीपर द्वारा कटाई करें।",
      "भूसे (तूड़ी) को सुरक्षित स्थान पर ढककर रखें।",
      "अनाज को 1-2 दिन अच्छी धूप में सुखाकर 12% नमी पर भंडारण करें।",
      "अगली जायद/खरीफ फसल (जैसे मूंग, मक्का) की तैयारी करें।",
    ],
    irrigationConsiderationsHi: "सिंचाई की आवश्यकता नहीं है।",
    nutrientManagementHi: "कोई आवश्यकता नहीं।",
    weedManagementHi: "कोई कार्य नहीं।",
    pestMonitoringHi:
      "भंडारण कीटों (खपरा बीटल, घुन) से सुरक्षा हेतु बोरियों में एल्युमिनियम फॉस्फाइड या नीम की सूखी पत्तियां रखें।",
    diseaseMonitoringHi: "कोई नहीं।",
    commonMistakesHi: [
      "गीले अनाज का भंडारण करना जिससे फफूंद लग जाती है और अंकुरण क्षमता नष्ट हो जाती है।",
    ],
    nextStagePreviewHi:
      "फसल सीजन संपन्न! आप नई फसल का सफर शुरू कर सकते हैं।",
  },
];

export function getWheatStageById(stageId: string): CropStageDefinition | undefined {
  return WHEAT_ZADOKS_STAGES.find((s) => s.stageId === stageId);
}

export function getWheatStageByDays(das: number): CropStageDefinition {
  for (const stage of WHEAT_ZADOKS_STAGES) {
    if (das >= stage.typicalDaysRange[0] && das <= stage.typicalDaysRange[1]) {
      return stage;
    }
  }
  if (das > 150) {
    return WHEAT_ZADOKS_STAGES[WHEAT_ZADOKS_STAGES.length - 1];
  }
  return WHEAT_ZADOKS_STAGES[0];
}
