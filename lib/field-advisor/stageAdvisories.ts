export interface StageActionItem {
  category: "सिंचाई" | "खाद" | "सुरक्षा" | "निराई / देखभाल";
  icon: string;
  action: string;
  tip?: string;
}

export interface CropStageAdvisory {
  stageId: string;
  stageNameHi: string;
  stageNameEn: string;
  minDas: number;
  maxDas: number;
  todayTaskHi: string;
  urgency: "high" | "medium" | "normal";
  checklist: StageActionItem[];
}

export const CROP_STAGE_ADVISORIES: Record<string, CropStageAdvisory[]> = {
  paddy: [
    {
      stageId: "nursery",
      stageNameHi: "नर्सरी / रोपाई (0-20 दिन)",
      stageNameEn: "Nursery / Transplanting",
      minDas: 0,
      maxDas: 20,
      todayTaskHi: "रोपाई के समय बेसल खाद (DAP 40 kg + MOP 25 kg + जिंक 5 kg) खेत में आखिरी जुताई पर मिलाएँ।",
      urgency: "high",
      checklist: [
        {
          category: "खाद",
          icon: "🌱",
          action: "DAP 40-50 kg/एकड़ व MOP 25 kg/एकड़ बुवाई/रोपाई पर बीज के पास डालें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "रोपाई के पहले हफ्ते खेत में 2 सेमी पानी खड़ा रखें ताकि पौधे जड़ पकड़ सकें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "रोपाई के 3-5 दिन के भीतर प्रेटिलाक्लोर 50% EC @ 500 ml/एकड़ रेत में मिलाकर डालें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "जड़ गलन या दीमक से बचाव हेतु रोपाई से पहले पौध को कार्बेन्डाजिम घोल में डुबोएँ।",
        },
      ],
    },
    {
      stageId: "tillering",
      stageNameHi: "कल्ले फूटना (21-45 दिन)",
      stageNameEn: "Tillering Stage",
      minDas: 21,
      maxDas: 45,
      todayTaskHi: "खेत में कल्ले फूट रहे हैं। सिंचाई के तुरंत बाद यूरिया (30 kg/एकड़) + जिंक सल्फेट की पहली टॉप-ड्रेसिंग करें।",
      urgency: "high",
      checklist: [
        {
          category: "खाद",
          icon: "🌱",
          action: "यूरिया 30-35 kg/एकड़ + जिंक सल्फेट 33% @ 5 kg/एकड़ पहली सिंचाई पर दें।",
          tip: "जिंक को DAP के साथ कभी न मिलाएँ, यूरिया के साथ दें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "खेत में 2-3 सेमी पानी बनाए रखें। कल्ले फूटते समय पानी की कमी न होने दें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "तना छेदक (डेड हार्ट) या पत्ता लपेटक दिखे तो कोराजन (क्लोरेंट्रानिलिप्रोल 18.5% SC) 60 ml/एकड़ स्प्रे करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "चौड़ी पत्ती व मोथा खरपतवार के लिए बिस्पायरीबैक सोडियम 10% SC @ 100 ml/एकड़ 150 लीटर पानी में छिड़कें।",
        },
      ],
    },
    {
      stageId: "panicle",
      stageNameHi: "गभोट व बाली निकलना (46-75 दिन)",
      stageNameEn: "Panicle Initiation & Booting",
      minDas: 46,
      maxDas: 75,
      todayTaskHi: "गभोट अवस्था में यूरिया की आखिरी खुराक (25 kg/एकड़) दें और खेत में पानी का स्तर 3-5 सेमी बनाए रखें।",
      urgency: "medium",
      checklist: [
        {
          category: "सिंचाई",
          icon: "💧",
          action: "गभोट व फूल आने तक खेत में नमी कम न होने दें, यह पैदावार के लिए सबसे नाज़ुक समय है।",
        },
        {
          category: "खाद",
          icon: "🌱",
          action: "बाली निकलते समय 00:52:34 (मोनोपोटैशियम फॉस्फेट) @ 1 kg/एकड़ का फोलियर स्प्रे करें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "शीथ ब्लाइट या ब्लास्ट (झुलसा) दिखने पर ट्राईसाइक्लाजोल 75% WP @ 120 ग्राम/एकड़ या अमिस्टार टॉप 200 ml स्प्रे करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "बीपीएच (भूरा फुदका) की जाँच हेतु पौधे के निचले हिस्से में पानी की सतह पर नज़र रखें।",
        },
      ],
    },
    {
      stageId: "grain",
      stageNameHi: "दूधिया अवस्था व दाना भराव (76-110 दिन)",
      stageNameEn: "Milking & Grain Filling",
      minDas: 76,
      maxDas: 110,
      todayTaskHi: "दाना भराव के समय पोटाश (00:00:50) का स्प्रे करें ताकि दाना चमकदार व भारी बने। गंधी बग से सतर्क रहें।",
      urgency: "normal",
      checklist: [
        {
          category: "खाद",
          icon: "🌱",
          action: "NPK 00:00:50 @ 1 kg/एकड़ 150 लीटर पानी में स्प्रे करें ताकि दानों का वजन व चमक बढ़े।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "गंधी बग (बदबूदार कीड़ा) के लिए सुबह या शाम मैलाथियान 5% डस्ट या लैम्ब्डा साइहलोथ्रिन 5% EC @ 250 ml/एकड़ स्प्रे करें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "दाने कड़े होने पर (कटाई से 10-12 दिन पहले) खेत से पानी पूरी तरह निकाल दें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "कटाई की तैयारी करें, जब 80-85% बालियां सुनहरी पीली हो जाएं तब कटाई शुरू करें।",
        },
      ],
    },
  ],
  wheat: [
    {
      stageId: "crown_root",
      stageNameHi: "ताज जड़ अवस्था (CRI stage, 18-25 दिन)",
      stageNameEn: "Crown Root Initiation",
      minDas: 0,
      maxDas: 25,
      todayTaskHi: "गेहूं की सबसे महत्वपूर्ण पहली सिंचाई (CRI स्टेज पर 21 दिन) करें। सिंचाई के 2 दिन बाद यूरिया की पहली खुराक दें।",
      urgency: "high",
      checklist: [
        {
          category: "सिंचाई",
          icon: "💧",
          action: "बुवाई के 20-22 दिन बाद पहली हल्की सिंचाई अवश्य करें। इसे टालने पर कल्ले कम फूटते हैं।",
        },
        {
          category: "खाद",
          icon: "🌱",
          action: "सिंचाई के 2-3 दिन बाद जब पैर टिकने लगे तब यूरिया 40-45 kg/एकड़ टॉप ड्रेसिंग करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "गुल्ली डंडा (मंडूसी) के लिए पहली सिंचाई के बाद क्लोडिनाफॉप 15% WP @ 160 ग्राम/एकड़ का छिड़काव करें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "दीमक की समस्या वाले खेतों में क्लोरपायरीफॉस 20% EC @ 1 लीटर/एकड़ सिंचाई के पानी के साथ चलाएँ।",
        },
      ],
    },
    {
      stageId: "tillering_jointing",
      stageNameHi: "कल्ले फूटना व तना वृद्धि (26-55 दिन)",
      stageNameEn: "Tillering & Jointing",
      minDas: 26,
      maxDas: 55,
      todayTaskHi: "दूसरी सिंचाई (40-45 दिन) पर यूरिया की बची हुई खुराक दें और चौड़ी पत्ती के खरपतवारों को नियंत्रित करें।",
      urgency: "high",
      checklist: [
        {
          category: "खाद",
          icon: "🌱",
          action: "यूरिया 30-35 kg/एकड़ + सल्फर 90% दानेदार 3 kg/एकड़ दूसरी सिंचाई पर दें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "बुवाई के 40-45 दिन बाद कल्ले निकलते समय दूसरी सिंचाई करें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "पीला रतुआ (Yellow Rust) की पत्तियों पर पीली धारियां दिखें तो टिल्ट (प्रोपिकोनाजोल 25% EC) 200 ml/एकड़ स्प्रे करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "बथुआ व चौड़ी पत्ती के खरपतवार के लिए 2,4-D अमाइन साल्ट 58% SL @ 300 ml/एकड़ का स्प्रे करें।",
        },
      ],
    },
    {
      stageId: "booting_heading",
      stageNameHi: "गोभ व बाली निकलना (56-85 दिन)",
      stageNameEn: "Booting & Heading",
      minDas: 56,
      maxDas: 85,
      todayTaskHi: "गोभ अवस्था में हल्की सिंचाई करें और NPK 00:52:34 का स्प्रे करें ताकि बालियों की लंबाई व दाने बढ़ें।",
      urgency: "medium",
      checklist: [
        {
          category: "सिंचाई",
          icon: "💧",
          action: "गोभ अवस्था (60-65 दिन) में तीसरी सिंचाई करें। तेज हवा होने पर सिंचाई टालें ताकि फसल न गिरे।",
        },
        {
          category: "खाद",
          icon: "🌱",
          action: "बाली निकलते समय NPK 00:52:34 @ 1 kg + बोरॉन 20% @ 100 ग्राम प्रति एकड़ 150 लीटर पानी में स्प्रे करें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "माहू (चेपा) का प्रकोप होने पर थायमेथोक्सम 25% WG @ 80 ग्राम/एकड़ का छिड़काव करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "खेत से अवांछित पौधे (रोगाणुग्रस्त या विदेशी किस्म) हाथ से उखाड़कर बाहर निकालें।",
        },
      ],
    },
    {
      stageId: "grain_filling",
      stageNameHi: "दूधिया व दाना पकना (86-125 दिन)",
      stageNameEn: "Milking & Dough Stage",
      minDas: 86,
      maxDas: 125,
      todayTaskHi: "दाना भरते समय (85-90 दिन) हल्की सिंचाई करें। गर्मी से दानों को सिकुड़ने से बचाने हेतु 00:00:50 का स्प्रे करें।",
      urgency: "normal",
      checklist: [
        {
          category: "सिंचाई",
          icon: "💧",
          action: "दाना बनते समय आखिरी हल्की सिंचाई करें। शांत मौसम में शाम के समय पानी दें।",
        },
        {
          category: "खाद",
          icon: "🌱",
          action: "NPK 00:00:50 @ 1 kg/एकड़ स्प्रे करें ताकि दाने मोटे व चमकदार बनें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "करनाल बंट से बचाव के लिए टेबुकोनाजोल 25.9% EC @ 200 ml/एकड़ का स्प्रे करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "दाना 80% कड़ा होने पर सिंचाई बंद करें और रीपर/कंबाइन की व्यवस्था करें।",
        },
      ],
    },
  ],
  mustard: [
    {
      stageId: "early_veg",
      stageNameHi: "अंकुरण व विरलीकरण (0-25 दिन)",
      stageNameEn: "Emergence & Thinning",
      minDas: 0,
      maxDas: 25,
      todayTaskHi: "बुवाई के 15-20 दिन बाद पौधों का विरलीकरण (Thinning) करके पौधे से पौधे की दूरी 10-12 सेमी कर दें।",
      urgency: "high",
      checklist: [
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "कमज़ोर पौधों को उखाड़कर विरलीकरण करें ताकि मुख्य पौधे को पूरी धूप व खाद मिले।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "पहली सिंचाई बुवाई के 25-30 दिन बाद शाखाएं निकलते समय करें।",
        },
        {
          category: "खाद",
          icon: "🌱",
          action: "पहली सिंचाई के बाद यूरिया 30-35 kg + सल्फर 90% @ 3 kg/एकड़ दें (सरसों में सल्फर तेल बढ़ाता है)।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "आरा मक्खी (Sawfly) दिखने पर मैलाथियान 50% EC @ 400 ml/एकड़ स्प्रे करें।",
        },
      ],
    },
    {
      stageId: "flowering_pod",
      stageNameHi: "फूल व फली बनना (26-65 दिन)",
      stageNameEn: "Flowering & Pod Formation",
      minDas: 26,
      maxDas: 65,
      todayTaskHi: "फूल व फली बनते समय माहू (Aphid) का प्रकोप सबसे ज्यादा होता है। सुबह-शाम खेत में कीट की निगरानी करें।",
      urgency: "high",
      checklist: [
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "माहू दिखते ही इमिडाक्लोप्रिड 17.8% SL @ 60-70 ml या एसिटामिप्रिड 20% SP @ 60 ग्राम/एकड़ स्प्रे करें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "फली बनते समय (50-60 दिन) दूसरी सिंचाई करें। फूल खिलते समय तेज पानी न दें।",
        },
        {
          category: "खाद",
          icon: "🌱",
          action: "फूल आने पर बोरॉन 20% @ 1 ग्राम/लीटर पानी में स्प्रे करें ताकि फली पूरी भरे।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "सफेद रतुआ (White Rust) से बचाव हेतु मैंकोजेब 75% WP @ 500 ग्राम/एकड़ छिड़कें।",
        },
      ],
    },
  ],
  tomato: [
    {
      stageId: "transplant",
      stageNameHi: "रोपाई व बढ़वार (0-30 दिन)",
      stageNameEn: "Transplanting & Vegetative",
      minDas: 0,
      maxDas: 30,
      todayTaskHi: "रोपाई के 10-15 दिन बाद थाले बनाकर हल्की सिंचाई करें। 19:19:19 की ड्रेंचिंग या स्प्रे शुरू करें।",
      urgency: "high",
      checklist: [
        {
          category: "खाद",
          icon: "🌱",
          action: "19:19:19 @ 3-5 ग्राम/लीटर पानी में ड्रेंचिंग या फोलियर स्प्रे करें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "हल्की और नियमित सिंचाई करें, खेत में जलजमाव बिल्कुल न होने दें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "पत्ता मरोड़ (लीफ कर्ल वायरस) से बचाव हेतु सफेद मक्खी के लिए पेगासस (डायफेनथियूरॉन 50% WP) 250 ग्राम/एकड़ स्प्रे करें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "अवांछित शाखाओं की छंटाई (Pruning) करें और पौधों को सहारा (Staking) देने की तैयारी करें।",
        },
      ],
    },
    {
      stageId: "fruiting",
      stageNameHi: "फूल व फल विकास (31-80 दिन)",
      stageNameEn: "Flowering & Fruiting",
      minDas: 31,
      maxDas: 80,
      todayTaskHi: "फल छेदक (सुंडी) व अगेती झुलसा से बचाव रखें। फल का निचला हिस्सा काला (BER) न पड़े इसलिए कैल्शियम स्प्रे करें।",
      urgency: "high",
      checklist: [
        {
          category: "खाद",
          icon: "🌱",
          action: "कैल्शियम नाइट्रेट @ 5 ग्राम/लीटर + बोरॉन @ 1 ग्राम/लीटर स्प्रे करें।",
        },
        {
          category: "सुरक्षा",
          icon: "🛡️",
          action: "फल छेदक सुंडी के लिए कोराजन 60 ml या एप्लीगो (क्लोरांट्रानिलिप्रोल + लैम्ब्डा) 80 ml/एकड़ स्प्रे करें।",
        },
        {
          category: "सिंचाई",
          icon: "💧",
          action: "फल फटने से बचाने के लिए सिंचाई में कभी सूखा और कभी ज्यादा पानी का उतार-चढ़ाव न रखें।",
        },
        {
          category: "निराई / देखभाल",
          icon: "🌿",
          action: "झुलसा रोग से बचाव हेतु कॉपर ऑक्सीक्लोराइड 50% WP @ 500 ग्राम/एकड़ का स्प्रे करें।",
        },
      ],
    },
  ],
};

export const DEFAULT_STAGE_ADVISORY: CropStageAdvisory[] = [
  {
    stageId: "general_early",
    stageNameHi: "शुरुआती बढ़वार (0-30 दिन)",
    stageNameEn: "Early Vegetative",
    minDas: 0,
    maxDas: 30,
    todayTaskHi: "खेत में नमी की स्थिति देखें। जरूरत के अनुसार हल्की सिंचाई करें और खरपतवारों की निराई करें।",
    urgency: "high",
    checklist: [
      {
        category: "सिंचाई",
        icon: "💧",
        action: "खेत की मिट्टी में पर्याप्त नमी बनाए रखें। पानी का भराव न होने दें।",
      },
      {
        category: "खाद",
        icon: "🌱",
        action: "बुवाई पर DAP/SSP दें और 20-25 दिन पर यूरिया की पहली खुराक डालें।",
      },
      {
        category: "निराई / देखभाल",
        icon: "🌿",
        action: "शुरुआती 30 दिन में खरपतवार पौधों की खुराक छीन लेते हैं, हाथ से निराई-गुड़ाई करें।",
      },
      {
        category: "सुरक्षा",
        icon: "🛡️",
        action: "पत्तियों पर रस चूसक कीट या सुंडी के अंडों की जाँच करें।",
      },
    ],
  },
  {
    stageId: "general_mid",
    stageNameHi: "सक्रिय बढ़वार व फूल अवस्था (31-70 दिन)",
    stageNameEn: "Mid-Season & Flowering",
    minDas: 31,
    maxDas: 70,
    todayTaskHi: "फूल व फल बनते समय संतुलित खाद (NPK 19:19:19 या 00:52:34) दें और मुख्य कीटों पर नज़र रखें।",
    urgency: "medium",
    checklist: [
      {
        category: "सिंचाई",
        icon: "💧",
        action: "फूल व फल बनते समय पानी की कमी न होने दें, समय पर सिंचाई करें।",
      },
      {
        category: "खाद",
        icon: "🌱",
        action: "फूल आने पर सूक्ष्म पोषक (जिंक, बोरॉन) या 19:19:19 @ 1 kg/एकड़ स्प्रे करें।",
      },
      {
        category: "सुरक्षा",
        icon: "🛡️",
        action: "रोग या कीट दिखने पर सही कीटनाशक/फफूंदनाशक का अनुमोदित मात्रा में छिड़काव करें।",
      },
      {
        category: "निराई / देखभाल",
        icon: "🌿",
        action: "खेत में हवा व धूप का संचार ठीक रखें, गिरे या सड़े पौधे हटाएँ।",
      },
    ],
  },
  {
    stageId: "general_late",
    stageNameHi: "फल / दाना भराव व परिपक्वता (71+ दिन)",
    stageNameEn: "Maturity & Harvest",
    minDas: 71,
    maxDas: 999,
    todayTaskHi: "दानों या फलों में चमक व वजन बढ़ाने के लिए पोटाश (00:00:50) दें और कटाई की तैयारी करें।",
    urgency: "normal",
    checklist: [
      {
        category: "खाद",
        icon: "🌱",
        action: "दाने का आकार व वजन बढ़ाने के लिए 00:00:50 @ 1 kg/एकड़ का छिड़काव करें।",
      },
      {
        category: "सिंचाई",
        icon: "💧",
        action: "कटाई से 10-12 दिन पहले सिंचाई पूरी तरह बंद कर दें ताकि खेत सूख जाए।",
      },
      {
        category: "सुरक्षा",
        icon: "🛡️",
        action: "कटाई से 15 दिन पहले किसी भी जहरीले कीटनाशक का छिड़काव न करें।",
      },
      {
        category: "निराई / देखभाल",
        icon: "🌿",
        action: "फसल के 80-85% पकने पर कटाई व सुरक्षित भंडारण की तैयारी करें।",
      },
    ],
  },
];

const CROP_ALIASES: Record<string, string> = {
  rice: "paddy",
  dhaan: "paddy",
  dhan: "paddy",
  gehu: "wheat",
  gehun: "wheat",
  sarson: "mustard",
  tamatar: "tomato",
};

export function getStageAdvisory(cropSlug: string, das: number | null): CropStageAdvisory {
  const raw = cropSlug.toLowerCase().trim();
  const norm = CROP_ALIASES[raw] ?? raw;
  const list = CROP_STAGE_ADVISORIES[norm] ?? DEFAULT_STAGE_ADVISORY;
  if (das == null || !Number.isFinite(das) || das < 0) return list[0];
  const matched = list.find((s) => das >= s.minDas && das <= s.maxDas);
  return matched ?? list[list.length - 1];
}
