// @ts-check
/**
 * Master Crops Database - Part 3
 * Crops 21-29:
 * 21. arhar (Pigeon Pea)
 * 22. chana (Gram / Chickpea)
 * 23. masoor (Lentil)
 * 24. mustard (Sarson)
 * 25. bhindi (Okra)
 * 26. ginger (Adrak)
 * 27. mango (Aam)
 * 28. banana (Kela)
 * 29. grapes (Angoor)
 */

const pulsesProblems = [
  {
    id: 'fusarium-wilt-root-rot',
    nameHi: 'उकठा व जड़ गलन (Fusarium Wilt & Dry Root Rot)',
    nameEn: 'Fusarium Wilt & Dry Root Rot',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-fusarium-ciceri-2.jpg',
    stageHi: 'वानस्पतिक अवस्था (10-35 दिन)',
    stages: ['vegetative'],
    specialFactHi: 'पौधा ऊपर से नीचे तक पीला होकर सूख जाता है; जड़ को चीरने पर अंदर काली/भूरी लकीर दिखती है।',
    whatHi: 'फसल की शुरुआती अवस्था में जड़ गलन व पूरे पौधे का अचानक सूख जाना।',
    whyHi: ['जमीन में कवक (Fusarium/Rhizoctonia) की मौजूदगी', 'जलभराव या भारी मिट्टी'],
    cureOrganicHi: ['ट्राइकोडर्मा 5 ग्राम/लीटर पानी से जड़ों में ड्रेंचिंग करें'],
    cureChemicalHi: ['कार्बेन्डाजिम 50% WP (400 g जड़ों में ड्रेंचिंग)', 'थायोफेनेट मिथाइल 70% WP (500 g)'],
    whenToActHi: 'शुरुआती लक्षण दिखते ही जड़ों में ड्रेंचिंग करें',
    tipHi: 'हमेशा शाम के समय जड़ों के पास ड्रेंचिंग करें।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 50% WP (बाविस्टिन)',
        technical: 'Carbendazim 50% WP',
        dose: '2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)',
        brands: ['Bavistin (Crystal)', 'Derosal'],
        safety: 'जड़ों में ड्रेंचिंग करें; केवल मिट्टी के संपर्क में असरदार।',
        level: 1,
        levelLabelHi: 'स्तर 1 · पारंपरिक / शुरुआती',
        dosePerAcre: '400 ग्राम / एकड़',
        resistanceWarning: 'लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।'
      },
      {
        nameHi: 'थायोफेनेट मिथाइल 70% WP (रोको)',
        technical: 'Thiophanate Methyl 70% WP',
        dose: '1.5-2 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)',
        brands: ['Roko (Biostadt)', 'Topsin-M'],
        safety: 'जड़ों व तने दोनों पर तेज सिस्टेमिक असर।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '500 ग्राम / एकड़'
      },
      {
        nameHi: 'टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)',
        technical: 'Tebuconazole 25.9% EC',
        dose: '1-1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Folicur (Bayer)', 'Tebusul'],
        safety: 'उकठा व जड़ गलन पर सबसे गहरा सिस्टेमिक नियंत्रण।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '250 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'ymv-whitefly',
    nameHi: 'पीला मोज़ेक वायरस व सफेद मक्खी (YMV & Whitefly)',
    nameEn: 'Yellow Mosaic Virus & Whitefly',
    tagHi: 'वायरस व कीट',
    image: '/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg',
    stageHi: 'वानस्पतिक व फूल अवस्था (15-40 दिन)',
    stages: ['vegetative', 'flowering'],
    isVirus: true,
    specialFactHi: 'पत्तियां चमकदार पीली पड़ जाती हैं और फलियां नहीं लगतीं। (सफेद मक्खी रोकें — फंगीसाइड न डालें)',
    whatHi: 'सफेद मक्खी द्वारा फैलाया जाने वाला अत्यंत घातक वायरल रोग जिससे उपज शून्य हो सकती है।',
    whyHi: ['सफेद मक्खी (Bemisia tabaci) का प्रकोप', 'गर्म व सूखा मौसम'],
    cureOrganicHi: ['पीले चिपचिपे कार्ड (Yellow Sticky Traps) 15-20 प्रति एकड़ लगाएं', 'नीम तेल 10,000 PPM 3 मिली/लीटर'],
    cureChemicalHi: ['थियामेथोक्सम 25% WG (100 g)', 'पायरीप्रॉक्सीफेन + बाइफेन्थ्रिन (250 ml)'],
    whenToActHi: 'सफेद मक्खी दिखते ही तत्काल स्प्रे करें',
    tipHi: 'वायरस का कोई फंगीसाइड इलाज नहीं है, केवल सफेद मक्खी (वेक्टर) को मारकर ही फैलाव रुकता है।',
    meds: [
      {
        nameHi: 'थियामेथोक्सम 25% WG (एक्टारा)',
        technical: 'Thiamethoxam 25% WG',
        dose: '0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)',
        brands: ['Actara (Syngenta)', 'Anant'],
        safety: 'शुरुआती रस चूसक कीटों पर सिस्टेमिक नियंत्रण।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती रोकथाम',
        dosePerAcre: '100 ग्राम / एकड़',
        resistanceWarning: 'कई क्षेत्रों में सफेद मक्खी में प्रतिरोधक क्षमता देखी गई है।'
      },
      {
        nameHi: 'एसिटामिप्रिड 20% SP + नीम तेल',
        technical: 'Acetamiprid 20% SP (80 g) + Neem Oil (300 ml)',
        dose: '0.4 ग्राम + 1.5 मिली / लीटर पानी',
        brands: ['Pride (Dhanuka)', 'Manik'],
        safety: 'सफेद मक्खी के अंडों और प्रौढ़ों दोनों पर दोहरा असर।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '80 ग्राम + 300 मिली / एकड़'
      },
      {
        nameHi: 'पायरीप्रॉक्सीफेन 10% + बाइफेन्थ्रिन 10% EC',
        technical: 'Pyriproxyfen 10% + Bifenthrin 10% EC',
        dose: '1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Lano (Sumitomo)', 'Dhaakad'],
        safety: 'सफेद मक्खी के अंडे, शिशु और उड़ने वाले कीड़ों का संपूर्ण सफाया।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '250 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'flower-thrips-aphid',
    nameHi: 'फूल के थ्रिप्स व माहू (Flower Thrips & Aphids)',
    nameEn: 'Flower Thrips & Aphids',
    tagHi: 'कीट',
    image: '/images/pests/pest-scirtothrips-dorsalis-2.jpg',
    stageHi: 'फूल अवस्था (30-50 दिन)',
    stages: ['flowering'],
    specialFactHi: 'फूलों के अंदर घुसकर रस चूसते हैं जिससे फूल बिना फली बने झड़ जाते हैं।',
    whatHi: 'फूलों से रस चूसकर फलियों के बनने की प्रक्रिया को पूरी तरह नष्ट करने वाले बारीक कीट।',
    whyHi: ['फूल खिलते समय शुष्क मौसम', 'पास के खेतों से कीटों का स्थानांतरण'],
    cureOrganicHi: ['नीली चिपचिपी पट्टियां (Blue Sticky Traps) लगाएं', 'नीम तेल 3 मिली/लीटर'],
    cureChemicalHi: ['इमिडाक्लोप्रिड 17.8% SL (100 ml)', 'फिप्रोनिल 5% SC (300 ml)', 'स्पिनेटोरम 11.7% SC (120 ml)'],
    whenToActHi: 'फूल खिलने से ठीक पहले या शुरुआती फूल अवस्था में',
    tipHi: 'फूल झड़ने से रोकने के लिए सुबह के समय स्प्रे करें जब मधुमक्खियां कम सक्रिय हों।',
    meds: [
      {
        nameHi: 'इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)',
        technical: 'Imidacloprid 17.8% SL',
        dose: '0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)',
        brands: ['Confidor (Bayer)', 'Tatamida'],
        safety: 'शुरुआती रस चूसक कीटों पर असरदार।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '100 मिली / एकड़',
        resistanceWarning: 'लगातार छिड़काव से थ्रिप्स में प्रतिरोधक क्षमता।'
      },
      {
        nameHi: 'फिप्रोनिल 5% SC (रीजेंट)',
        technical: 'Fipronil 5% SC',
        dose: '1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)',
        brands: ['Regent (BASF)', 'Mahaveer'],
        safety: 'फूलों के अंदर छिपे थ्रिप्स पर बेहतरीन मारक क्षमता।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '300 मिली / एकड़'
      },
      {
        nameHi: 'स्पिनेटोरम 11.7% SC (डेलिगेट)',
        technical: 'Spinetoram 11.7% SC',
        dose: '0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)',
        brands: ['Delegate (Corteva)', 'Largo'],
        safety: 'थ्रिप्स और माहू पर आधुनिक ग्रीन मॉलिक्यूल, तुरंत ड्रॉप डाउन असर।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '120 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'pod-borer',
    nameHi: 'फली छेदक व जाले वाली इल्ली (Pod Borer - Helicoverpa & Maruca)',
    nameEn: 'Pod Borer (Helicoverpa & Maruca)',
    tagHi: 'कीट',
    image: '/images/pests/pest-helicoverpa-armigera-2.jpg',
    stageHi: 'फूल व फली अवस्था (40+ दिन)',
    stages: ['flowering', 'fruiting'],
    specialFactHi: 'Maruca फूलों और फलियों को रेशमी जाले से बांधकर खाती है; Helicoverpa फली में गोल छेद कर दाने खा जाती है।',
    whatHi: 'दलहनी फसलों की सबसे विनाशकारी सुंडी जो सीधे फलियों और दानों को चट कर जाती है।',
    whyHi: ['मौसम में नमी और बादल छाना', 'फूल व फली का अधिक बनना'],
    cureOrganicHi: ['फेरोमोन ट्रैप (Helilure) 5 प्रति एकड़ लगाएं', 'बैसिलस थुरिंजिएंसिस (BT) 2 ग्राम/लीटर'],
    cureChemicalHi: ['इमामेक्टिन बेंजोएट 5% SG (100 g)', 'कोराजन 18.5% SC (60 ml)'],
    whenToActHi: 'फूलों में जाले दिखते ही या 5% फलियों में छेद दिखने पर',
    tipHi: 'हमेशा शाम के समय स्प्रे करें जब इल्लियां बाहर निकलकर खाती हैं।',
    meds: [
      {
        nameHi: 'इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)',
        technical: 'Emamectin Benzoate 5% SG',
        dose: '0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)',
        brands: ['Proclaim (Syngenta)', 'EM-1'],
        safety: 'शुरुआती व मध्यम आकार की इल्लियों पर तेज असर।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती इल्ली स्तर',
        dosePerAcre: '100 ग्राम / एकड़'
      },
      {
        nameHi: 'इंडोक्साकार्ब 14.5% SC या फ्लूबेन्डियामाइड 39.35% SC',
        technical: 'Indoxacarb 14.5% SC (150 ml) या Flubendiamide 39.35% SC (40 ml)',
        dose: '0.75 मिली / लीटर पानी',
        brands: ['Avaunt (FMC)', 'Fame (Bayer)'],
        safety: 'बड़ी सुंडियों के भोजन को तुरंत बंद कर देता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '150 मिली / एकड़'
      },
      {
        nameHi: 'क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)',
        technical: 'Chlorantraniliprole 18.5% SC',
        dose: '0.3-0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)',
        brands: ['Coragen (FMC)', 'Cover'],
        safety: 'फली छेदक पर 21 दिनों तक अटूट सुरक्षा कवच, बेस्ट फील्ड ट्रायल।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '60 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'powdery-ascochyta',
    nameHi: 'चूर्णी फफूंद व एस्कोकाइटा झुलसा (Powdery Mildew & Ascochyta Blight)',
    nameEn: 'Powdery Mildew & Ascochyta Blight',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-podosphaera-xanthii-2.jpg',
    stageHi: 'फूल व फली अवस्था',
    stages: ['flowering', 'fruiting'],
    specialFactHi: 'पत्तियों पर सफेद पाउडर या तने व फलियों पर गोल भूरे धब्बे बनते हैं जिससे दाने सिकुड़ जाते हैं।',
    whatHi: 'सफेद पाउडर जैसी फफूंद व फलियों पर धब्बे जिससे दाने नहीं भरते।',
    whyHi: ['हवा में नमी और रात में ठंडक', 'घनी बुवाई'],
    cureOrganicHi: ['घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर छिड़कें'],
    cureChemicalHi: ['कार्बेन्डाजिम + मैंकोजेब (500 g)', 'हेक्साकोनाज़ोल 5% EC (300 ml)', 'कस्टोडिया / एमिस्टार टॉप (200 ml)'],
    whenToActHi: 'पत्तियों पर सफेद धब्बे दिखते ही',
    tipHi: 'फूल अवस्था में सल्फर की अत्यधिक मात्रा से बचें, लिक्विड फंगीसाइड सुरक्षित रहता है।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)',
        technical: 'Carbendazim 12% + Mancozeb 63% WP',
        dose: '2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)',
        brands: ['Saaf (UPL)', 'Sixer'],
        safety: 'सिस्टेमिक व कॉन्टैक्ट फंगीसाइड का संतुलित मिश्रण।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती रोकथाम',
        dosePerAcre: '500 ग्राम / एकड़',
        resistanceWarning: 'लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।'
      },
      {
        nameHi: 'हेक्साकोनाज़ोल 5% EC (कंटाफ)',
        technical: 'Hexaconazole 5% EC',
        dose: '1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)',
        brands: ['Contaf Plus (Tata)', 'Sitara'],
        safety: 'चूर्णी फफूंद पर गहरा आंतरिक नियंत्रण।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '300 मिली / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)',
        technical: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Amistar Top (Syngenta)', 'Godrej Custodia'],
        safety: 'ब्रॉड स्पेक्ट्रम फंगीसाइड, पत्ती और फलियों को हरा-भरा और चमकदार रखता है।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  }
];

const mustardProblems = [
  {
    id: 'painted-bug-sawfly',
    nameHi: 'चितकबरा कीट व आरा मक्खी (Painted Bug & Mustard Sawfly)',
    nameEn: 'Painted Bug & Mustard Sawfly',
    tagHi: 'कीट',
    image: '/images/pests/pest-bagrada-hilaris-2.jpg',
    stageHi: 'अंकुरण व वानस्पतिक (5-25 दिन)',
    stages: ['vegetative'],
    specialFactHi: 'काले-नारंगी धब्बेदार बग छोटे पौधों का रस चूसकर उन्हें सुखा देते हैं; आरा मक्खी की काली सुंडी पत्तियों में छेद करती है।',
    whatHi: 'सरसों के अंकुरण के तुरंत बाद आने वाले विनाशकारी कीट जो पूरी पौध को चट कर जाते हैं।',
    whyHi: ['बुवाई के समय तापमान 30-35 डिग्री रहना', 'खेत की मेड़ों पर खरपतवार'],
    cureOrganicHi: ['सुबह के समय कीड़ों को हाथ से पकड़कर नष्ट करें', 'नीम तेल 5 मिली/लीटर छिड़कें'],
    cureChemicalHi: ['क्विनालफॉस 25% EC (350 ml)', 'इमिडाक्लोप्रिड + साइपरमेथ्रिन (100+100 ml)', 'एम्पलीगो / अलिका (80 ml)'],
    whenToActHi: 'अंकुरण के 7-10 दिन बाद कीट दिखते ही',
    tipHi: 'सुबह जल्दी स्प्रे करें जब कीट सुस्त अवस्था में पत्तियों पर बैठे हों।',
    meds: [
      {
        nameHi: 'क्विनालफॉस 25% EC (एकालक्स)',
        technical: 'Quinalphos 25% EC',
        dose: '1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)',
        brands: ['Ekalux (Syngenta)', 'Flash'],
        safety: 'कॉन्टैक्ट व पेट का जहर, तुरंत नॉकडाउन असर।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '350 मिली / एकड़',
        resistanceWarning: 'पुरानी केमिस्ट्री; तेज धूप में असर घटता है।'
      },
      {
        nameHi: 'इमिडाक्लोप्रिड 17.8% SL + साइपरमेथ्रिन 25% EC',
        technical: 'Imidacloprid 17.8% SL (100 ml) + Cypermethrin 25% EC (100 ml)',
        dose: '0.5 मिली + 0.5 मिली / लीटर पानी',
        brands: ['Confidor + Ustaad'],
        safety: 'रस चूसक बग और पत्ती खाने वाली सुंडी दोनों पर दोहरा वार।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '100 मिली + 100 मिली / एकड़'
      },
      {
        nameHi: 'थियामेथोक्सम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)',
        technical: 'Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC',
        dose: '0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)',
        brands: ['Alika (Syngenta)', 'Ampligo'],
        safety: 'सिस्टेमिक व कॉन्टैक्ट का सबसे आधुनिक ZC फॉर्मूलेशन, लंबा असर।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '80 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'white-rust-alternaria',
    nameHi: 'सफेद रतुआ व अल्टरनेरिया झुलसा (White Rust & Alternaria Blight)',
    nameEn: 'White Rust & Alternaria Blight',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-albugo-candida-2.jpg',
    stageHi: 'वानस्पतिक व फूल अवस्था (35-65 दिन)',
    stages: ['vegetative', 'flowering'],
    specialFactHi: 'पत्तियों के नीचे सफेद चूने जैसे फफोले बनते हैं और ऊपरी फली की टहनी फूलकर मोटी व टेढ़ी (Staghead) हो जाती है।',
    whatHi: 'सरसों की पत्तियों पर सफेद फफोले व भूरे छल्लेदार धब्बे जिससे तना हिरण के सींग जैसा टेढ़ा हो जाता है।',
    whyHi: ['दिसंबर-जनवरी में घना कोहरा व ओस', 'तापमान 12-18 डिग्री सेल्सियस'],
    cureOrganicHi: ['खेत में जलभराव न होने दें', 'घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर'],
    cureChemicalHi: ['मैंकोजेब 75% WP (600 g)', 'रिडोमिल गोल्ड (500 g)', 'एमिस्टार टॉप (200 ml)'],
    whenToActHi: 'पत्तियों पर सफेद दाने या निचली पत्तियों पर धब्बे दिखते ही',
    tipHi: 'दिसंबर के अंतिम सप्ताह में पहला सुरक्षात्मक छिड़काव अवश्य करें।',
    meds: [
      {
        nameHi: 'मैंकोजेब 75% WP (इंडोफिल M-45)',
        technical: 'Mancozeb 75% WP',
        dose: '2.5-3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)',
        brands: ['Indofil M-45', 'Dithane M-45'],
        safety: 'सुरक्षात्मक कॉन्टैक्ट फंगीसाइड, पत्तियों पर परत बनाता है।',
        level: 1,
        levelLabelHi: 'स्तर 1 · सुरक्षात्मक स्तर',
        dosePerAcre: '600 ग्राम / एकड़',
        resistanceWarning: 'बारिश या तेज ओस में धुल जाता है।'
      },
      {
        nameHi: 'मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)',
        technical: 'Metalaxyl 8% + Mancozeb 64% WP',
        dose: '2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)',
        brands: ['Ridomil Gold (Syngenta)', 'Krilaxyl'],
        safety: 'सफेद रतुआ (Albugo) पर आंतरिक सिस्टेमिक मारक क्षमता।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '500 ग्राम / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)',
        technical: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Amistar Top (Syngenta)', 'Custodia'],
        safety: 'सफेद रतुआ और अल्टरनेरिया दोनों का एक साथ संपूर्ण इलाज, पत्तियां अंत तक हरी।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'sclerotinia-rot',
    nameHi: 'तना गलन / पोलियो रोग (Sclerotinia Stem Rot)',
    nameEn: 'Sclerotinia Stem Rot',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-sclerotinia-sclerotiorum.jpg',
    stageHi: 'फूल व फली अवस्था (50-80 दिन)',
    stages: ['flowering', 'fruiting'],
    specialFactHi: 'तने पर सफेद रुई जैसी फफूंद लगती है, तने के अंदर काले चूहे की मेंगनी जैसे दाने (Sclerotia) बनते हैं और पौधा बीच से टूटकर सूख जाता है।',
    whatHi: 'सरसों का तना बीच से सफेद होकर खोखला हो जाता है और तेज हवा में टूटकर गिर जाता है।',
    whyHi: ['सिंचाई के बाद खेत में ज्यादा दिन नमी रहना', 'घनी बुवाई व जमीन में फफूंद के अवशेष'],
    cureOrganicHi: ['खेत की गहरी जुताई करें', 'ट्राइकोडर्मा 1 किग्रा प्रति एकड़ गोबर खाद में मिलाकर दें'],
    cureChemicalHi: ['कार्बेन्डाजिम 50% WP (400 g)', 'टेबुकोनाज़ोल 25.9% EC (250 ml)', 'कस्टोडिया / कैब्रियो टॉप (250 ml)'],
    whenToActHi: 'तने पर सफेद धब्बे दिखने के तुरंत बाद',
    tipHi: 'स्प्रे का नोजल सीधे तने के निचले हिस्से की तरफ रखकर छिड़काव करें।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 50% WP (बाविस्टिन)',
        technical: 'Carbendazim 50% WP',
        dose: '2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)',
        brands: ['Bavistin (Crystal)', 'Derosal'],
        safety: 'पारंपरिक सिस्टेमिक दवा, शुरुआती फैलाव को रोकती है।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '400 ग्राम / एकड़',
        resistanceWarning: 'स्क्लेरोटिनिया कवक में कार्बेन्डाजिम के प्रति सहनशीलता बढ़ी है।'
      },
      {
        nameHi: 'टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)',
        technical: 'Tebuconazole 25.9% EC',
        dose: '1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Folicur (Bayer)', 'Tebusul'],
        safety: 'तने के अंदर गहराई तक प्रवेश कर कवक जाल को खत्म करता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '250 मिली / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन + टेबुकोनाज़ोल (कस्टोडिया) या बोस्केलिड + पायराक्लोस्ट्रोबिन',
        technical: 'Azoxystrobin + Tebuconazole SC (250 ml) या Boscalid + Pyraclostrobin',
        dose: '1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Custodia (Adama)', 'Signum (BASF)'],
        safety: 'तना गलन पर आधुनिक रिसर्च फंगीसाइड, तने को टूटने से पूरी तरह बचाता है।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '250 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'mustard-aphid',
    nameHi: 'चेपा / माहू (Mustard Aphid - सबसे मुख्य)',
    nameEn: 'Mustard Aphid',
    tagHi: 'कीट',
    image: '/images/pests/pest-lipaphis-erysimi-2.jpg',
    stageHi: 'फूल व फली अवस्था',
    stages: ['flowering', 'fruiting'],
    specialFactHi: 'फूलों की टहनियों और फलियों पर हरे-पीले माहू की मोटी परत जम जाती है जो सारा रस चूस लेती है।',
    whatHi: 'सरसों का सबसे घातक कीट, अनुकूल मौसम में 3-4 दिन में पूरी फसल की फलियों को सूखा देता है।',
    whyHi: ['बादल छाना और हवा में ठंडक', 'पछुआ हवा चलना'],
    cureOrganicHi: ['पीले चिपचिपे कार्ड 20 प्रति एकड़ लगाएं', 'नीम तेल 3-5 मिली/लीटर'],
    cureChemicalHi: ['डाइमेथोएट 30% EC (रोगोर - 300 ml)', 'थियामेथोक्सम 25% WG (80 g)', 'फ्लोनिकामिड 50% WG (उलाला - 60 g)'],
    whenToActHi: 'टहनी पर 10-15 माहू दिखते ही तुरंत पहला छिड़काव करें',
    tipHi: 'माहू का प्रजनन बहुत तेज होता है, देरी करने पर फलियों में दाने नहीं बनेंगे।',
    meds: [
      {
        nameHi: 'डाइमेथोएट 30% EC (रोगोर)',
        technical: 'Dimethoate 30% EC',
        dose: '1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)',
        brands: ['Rogor (FMC)', 'Tafgor'],
        safety: 'तीव्र गंध वाला सिस्टेमिक व कॉन्टैक्ट कीटनाशक।',
        level: 1,
        levelLabelHi: 'स्तर 1 · पारंपरिक स्तर',
        dosePerAcre: '300 मिली / एकड़',
        resistanceWarning: 'मधुमक्खियों के लिए अत्यधिक विषैला; लगातार इस्तेमाल से प्रतिरोध।'
      },
      {
        nameHi: 'थियामेथोक्सम 25% WG (एक्टारा)',
        technical: 'Thiamethoxam 25% WG',
        dose: '0.4-0.5 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)',
        brands: ['Actara (Syngenta)', 'Anant'],
        safety: 'पौधे में तुरंत अवशोषित होकर माहू का रस चूसना रोक देता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '80 ग्राम / एकड़'
      },
      {
        nameHi: 'फ्लोनिकामिड 50% WG (उलाला) या पाइमेट्रोज़िन 50% WG (चेस)',
        technical: 'Flonicamid 50% WG (60 g) या Pymetrozine 50% WG (100 g)',
        dose: '0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)',
        brands: ['Ulala (UPL)', 'Chess (Syngenta)'],
        safety: 'माहू के सुई जैसे मुंह को तुरंत पैरालाइज करता है, मित्र कीटों और मधुमक्खियों के लिए सुरक्षित।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '60 ग्राम / एकड़',
        isTopPerformer: true
      }
    ]
  }
];

const bhindiProblems = [
  {
    id: 'damping-off',
    nameHi: 'पौध गलन (Damping-off)',
    nameEn: 'Damping-off',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-damping-off-2.jpg',
    stageHi: 'अंकुरण व वानस्पतिक (5-25 दिन)',
    stages: ['vegetative'],
    specialFactHi: 'शुरुआती पौध की जड़ व तने का निचला हिस्सा गलकर पौधा गिर जाता है और सूख जाता है।',
    whatHi: 'बीज अंकुरण के बाद तने के निचले हिस्से का सड़ना और पौध का मर जाना।',
    whyHi: ['खेत में अधिक नमी या जलभराव', 'कवक ग्रसित बीज व मिट्टी'],
    cureOrganicHi: ['बीजोपचार ट्राइकोडर्मा 10 ग्राम/किग्रा बीज करें', 'खेत में पानी न भरने दें'],
    cureChemicalHi: ['कार्बेन्डाजिम 50% WP (300 g)', 'रिडोमिल गोल्ड (400 g)', 'कस्टोडिया (200 ml)'],
    whenToActHi: 'अंकुरण के बाद शुरुआती पौध में',
    tipHi: 'हमेशा शाम को जड़ों के पास ड्रेंचिंग करें।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 50% WP (बाविस्टिन)',
        technical: 'Carbendazim 50% WP',
        dose: '1.5-2 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़)',
        brands: ['Bavistin (Crystal)', 'Derosal'],
        safety: 'जड़ों में ड्रेंचिंग करें; शुरुआती स्तर पर असरदार।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)',
        dosePerAcre: '300 ग्राम / एकड़',
        resistanceWarning: 'लगातार इस्तेमाल से कवक में प्रतिरोध का जोखिम।'
      },
      {
        nameHi: 'मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)',
        technical: 'Metalaxyl 8% + Mancozeb 64% WP',
        dose: '2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)',
        brands: ['Ridomil Gold (Syngenta)', 'Krilaxyl'],
        safety: 'जड़ गलन और आद्र गलन पर दोहरी सुरक्षा।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '400 ग्राम / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)',
        technical: 'Azoxystrobin 11% + Tebuconazole 18.3% SC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Custodia (Adama)'],
        safety: 'पौध गलन व तना सड़न पर सबसे आधुनिक सुरक्षात्मक व उपचारात्मक फंगीसाइड।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'jassid-whitefly',
    nameHi: 'हरा तेला व सफेद मक्खी (Jassid & Whitefly)',
    nameEn: 'Jassid & Whitefly',
    tagHi: 'कीट',
    image: '/images/pests/pest-amrasca-biguttula-2.jpg',
    stageHi: 'वानस्पतिक व फूल अवस्था (15-45 दिन)',
    stages: ['vegetative', 'flowering'],
    specialFactHi: 'पत्ती के किनारे नीचे मुड़कर पीले पड़ते हैं और सफेद मक्खी वायरस फैलाती है।',
    whatHi: 'भिंडी के पत्तों का रस चूसने वाले कीट जिससे पत्ते कप जैसे उल्टे मुड़ जाते हैं (Hopper Burn)।',
    whyHi: ['गर्म व शुष्क मौसम', 'पास की फसलों से कीटों का प्रकोप'],
    cureOrganicHi: ['पीले चिपचिपे कार्ड 15-20 प्रति एकड़ लगाएं', 'नीम तेल 10,000 PPM 3 मिली/लीटर'],
    cureChemicalHi: ['थियामेथोक्सम 25% WG (80 g)', 'फ्लोनिकामिड 50% WG (उलाला - 60 g)', 'डायाफेन्थियूरॉन 50% WP (200 g)'],
    whenToActHi: 'पत्ती के नीचे 2-3 कीड़े दिखते ही',
    tipHi: 'पत्तियों के निचली सतह पर अच्छी तरह फुहारा पहुंचाएं।',
    meds: [
      {
        nameHi: 'थियामेथोक्सम 25% WG (एक्टारा)',
        technical: 'Thiamethoxam 25% WG',
        dose: '0.4-0.5 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)',
        brands: ['Actara (Syngenta)', 'Anant'],
        safety: 'शुरुआती रस चूसक कीटों पर सिस्टेमिक असर।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '80 ग्राम / एकड़',
        resistanceWarning: 'सफेद मक्खी में प्रतिरोधक क्षमता का खतरा।'
      },
      {
        nameHi: 'फ्लोनिकामिड 50% WG (उलाला)',
        technical: 'Flonicamid 50% WG',
        dose: '0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)',
        brands: ['Ulala (UPL)'],
        safety: 'तेला व सफेद मक्खी का रस चूसना 30 मिनट में बंद कर देता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '60 ग्राम / एकड़'
      },
      {
        nameHi: 'डायाफेन्थियूरॉन 50% WP (पेगासस) या एफिडोपायरोपेन 50 DC (सेफिना)',
        technical: 'Diafenthiuron 50% WP (200 g) या Afidopyropen 50 DC (400 ml)',
        dose: '1 ग्राम / लीटर पानी (200 ग्राम प्रति एकड़)',
        brands: ['Pegasus (Syngenta)', 'Sefina (BASF)'],
        safety: 'वयस्क सफेद मक्खी और तेला दोनों पर वाष्पशील व सिस्टेमिक मारक क्षमता।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 ग्राम / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'ymv',
    nameHi: 'पीली नस मोज़ेक वायरस (YVMV) व एनैशन लीफ कर्ल',
    nameEn: 'Yellow Vein Mosaic Virus (YVMV) & Enation Leaf Curl',
    tagHi: 'वायरस (सफेद मक्खी वेक्टर)',
    image: '/images/diseases/disease-bhendi-yvmv-2.jpg',
    stageHi: 'वानस्पतिक व फल अवस्था',
    stages: ['vegetative', 'fruiting'],
    isVirus: true,
    specialFactHi: 'पत्ती की सभी नसें पीली पड़ जाती हैं और फल पीले-कड़े हो जाते हैं। (केवल वेक्टर सफेद मक्खी मारें + वायरस रोधक, फंगीसाइड न डालें)',
    whatHi: 'सफेद मक्खी द्वारा फैलने वाला भिंडी का सबसे घातक वायरस, फल और पत्तियां पूरी पीली होकर कड़ी हो जाती हैं।',
    whyHi: ['सफेद मक्खी (Bemisia tabaci) द्वारा वायरस का संचार', 'संक्रमित पौधों को खेत में छोड़ना'],
    cureOrganicHi: ['रोगी पौधों को उखाड़कर तुरंत जमीन में गाड़ दें', 'पीले कार्ड लगाएं'],
    cureChemicalHi: ['एसिटामिप्रिड + नीम तेल', 'पायरीप्रॉक्सीफेन + बाइफेन्थ्रिन (250 ml)', 'डायाफेन्थियूरॉन 47.8% SC (200 ml) + सीवीड'],
    whenToActHi: 'खेत में एक भी पौधा पीला दिखते ही तत्काल वेक्टर को मारें',
    tipHi: 'वायरस पर किसी भी फफूंदनाशक का कोई असर नहीं होता, केवल सफेद मक्खी नियंत्रण और बायो-इम्यूनिटी ही बचाव है।',
    meds: [
      {
        nameHi: 'एसिटामिप्रिड 20% SP + नीम तेल',
        technical: 'Acetamiprid 20% SP (80 g) + Neem Oil (300 ml)',
        dose: '0.4 ग्राम + 1.5 मिली / लीटर पानी',
        brands: ['Pride (Dhanuka)', 'Manik'],
        safety: 'सफेद मक्खी को भगाने और मारने का शुरुआती उपाय।',
        level: 1,
        levelLabelHi: 'स्तर 1 · वेक्टर नियंत्रण',
        dosePerAcre: '80 ग्राम + 300 मिली / एकड़'
      },
      {
        nameHi: 'पायरीप्रॉक्सीफेन 10% + बाइफेन्थ्रिन 10% EC',
        technical: 'Pyriproxyfen 10% + Bifenthrin 10% EC',
        dose: '1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Lano (Sumitomo)', 'Dhaakad'],
        safety: 'सफेद मक्खी के अंडों, शिशुओं और उड़ने वाली मक्खी का खात्मा।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '250 मिली / एकड़'
      },
      {
        nameHi: 'डायाफेन्थियूरॉन 47.8% SC + सीवीड / वायरस रोधक',
        technical: 'Diafenthiuron 47.8% SC (200 ml) + Seaweed / Viricide (250 ml)',
        dose: '1 मिली + 1.25 मिली / लीटर पानी',
        brands: ['Pegasus SC', 'Viroban / Biovita'],
        safety: 'वेक्टर सफेद मक्खी का तुरंत नॉकडाउन + पौधे की प्रतिरोधक क्षमता में वृद्धि।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 मिली + 250 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'fruit-borer',
    nameHi: 'प्ररोह व फल छेदक (Shoot & Fruit Borer - Earias)',
    nameEn: 'Shoot & Fruit Borer (Earias)',
    tagHi: 'कीट',
    image: '/images/pests/pest-earias-vittella-2.jpg',
    stageHi: 'फल व तुड़ाई अवस्था (35+ दिन)',
    stages: ['fruiting'],
    specialFactHi: 'चित्तीदार सुंडी जो शुरुआती शाखाओं के सिरे सुखाती है और बाद में भिंडी में छेद कर उसे टेढ़ा कर देती है।',
    whatHi: 'भिंडी की मुख्य इल्ली जो तनों और फलों में छेद करके अंदर का गूदा खाती है और विष्ठा भर देती है।',
    whyHi: ['मौसम में गर्मी और नमी', 'तुड़ाई में देरी'],
    cureOrganicHi: ['फेरोमोन ट्रैप (Earias lure) 5 प्रति एकड़ लगाएं', 'नीम तेल 5 मिली/लीटर'],
    cureChemicalHi: ['इमामेक्टिन बेंजोएट 5% SG (100 g)', 'कोराजन 18.5% SC (60 ml)', 'स्पिनेटोरम 11.7% SC (150 ml)'],
    whenToActHi: 'शाखाओं के सिरे मुरझाते ही या फल में छेद दिखते ही',
    tipHi: 'स्प्रे करने के बाद PHI (प्रतीक्षा अवधि) का ध्यान रखें, तुड़ाई से 3 दिन पहले तक हैवी केमिकल न डालें।',
    meds: [
      {
        nameHi: 'इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)',
        technical: 'Emamectin Benzoate 5% SG',
        dose: '0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)',
        brands: ['Proclaim (Syngenta)', 'EM-1'],
        safety: 'शुरुआती फल छेदक इल्ली पर असरदार।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '100 ग्राम / एकड़'
      },
      {
        nameHi: 'क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)',
        technical: 'Chlorantraniliprole 18.5% SC',
        dose: '0.3-0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)',
        brands: ['Coragen (FMC)', 'Cover'],
        safety: 'फल छेदक इल्ली पर 15-20 दिनों तक अचूक नियंत्रण।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '60 मिली / एकड़'
      },
      {
        nameHi: 'स्पिनेटोरम 11.7% SC (डेलिगेट) या फ्लूबेन्डियामाइड 39.35% SC (फेम)',
        technical: 'Spinetoram 11.7% SC (150 ml) या Flubendiamide 39.35% SC (40 ml)',
        dose: '0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)',
        brands: ['Delegate (Corteva)', 'Fame (Bayer)'],
        safety: 'बड़ी से बड़ी इल्ली का तुरंत खात्मा, आधुनिक ग्रीन मॉलिक्यूल।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '150 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'red-spider-mite',
    nameHi: 'लाल मकड़ी (Red Spider Mite)',
    nameEn: 'Red Spider Mite',
    tagHi: 'माइट्स (मकड़ी)',
    image: '/images/pests/pest-tetranychus-urticae.jpg',
    stageHi: 'फल अवस्था',
    stages: ['fruiting'],
    specialFactHi: 'पत्तियों के नीचे बारीक लाल मकड़ी और जाले; पत्ती सफेद-भूरी होकर सूख जाती है।',
    whatHi: 'पत्तियों की निचली सतह से रस चूसने वाली अति सूक्ष्म मकड़ी जो जाले बना देती है।',
    whyHi: ['गर्म और सूखा मौसम (32°C से ऊपर)', 'खेत में धूल जमना'],
    cureOrganicHi: ['घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर', 'तेज धार से पानी का छिड़काव करें'],
    cureChemicalHi: ['फेनाज़ाक्विन 10% EC (300 ml)', 'स्पाइरोमेसिफेन 22.9% SC (ओबेरॉन - 200 ml)', 'एटोक्साज़ोल 10% SC (बोर्नियो - 160 ml)'],
    whenToActHi: 'पत्तियों की निचली सतह पर जाले दिखते ही',
    tipHi: 'साधारण कीटनाशक मकड़ी पर काम नहीं करते, इसके लिए केवल विशिष्ट माइटिसाइड ही इस्तेमाल करें।',
    meds: [
      {
        nameHi: 'फेनाज़ाक्विन 10% EC (मैजिस्टर)',
        technical: 'Fenazaquin 10% EC',
        dose: '1.5-2 मिली / लीटर पानी (300 मिली प्रति एकड़)',
        brands: ['Magister (Dhanuka)'],
        safety: 'कॉन्टैक्ट माइटिसाइड, शुरुआती मकड़ी पर असरदार।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '300 मिली / एकड़',
        resistanceWarning: 'मकड़ियों में जल्दी प्रतिरोध विकसित होता है।'
      },
      {
        nameHi: 'स्पाइरोमेसिफेन 22.9% SC (ओबेरॉन)',
        technical: 'Spiromesifen 22.9% SC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Oberon (Bayer)', 'Volt'],
        safety: 'मकड़ी के अंडों और शिशुओं के लिपिड विकास को रोकता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '200 मिली / एकड़'
      },
      {
        nameHi: 'एटोक्साज़ोल 10% SC (बोर्नियो)',
        technical: 'Etoxazole 10% SC',
        dose: '0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)',
        brands: ['Borneo (Sumitomo)'],
        safety: 'मकड़ी के सभी अंडों को नष्ट करने वाला सबसे एडवांस्ड ओविसाइडल माइटिसाइड।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '160 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'powdery-mildew',
    nameHi: 'सफेद चूर्ण रोग व सर्कोस्पोरा धब्बा (Powdery Mildew & Leaf Spot)',
    nameEn: 'Powdery Mildew & Cercospora Leaf Spot',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-podosphaera-xanthii-2.jpg',
    stageHi: 'फल अवस्था',
    stages: ['fruiting'],
    specialFactHi: 'पुरानी व बीच की पत्तियों पर सफेद चूर्ण की परत या धब्बे बनते हैं जिससे पत्ते सूखकर गिर जाते हैं।',
    whatHi: 'पत्तियों पर सफेद पाउडर जैसी फफूंद जमना जिससे प्रकाश संश्लेषण रुक जाता है।',
    whyHi: ['हवा में नमी और तापमान में उतार-चढ़ाव', 'फसल की परिपक्व अवस्था'],
    cureOrganicHi: ['घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर'],
    cureChemicalHi: ['साफ (500 g)', 'कंटाफ 5% SC (300 ml)', 'एमिस्टार टॉप (200 ml)'],
    whenToActHi: 'निचली पत्तियों पर सफेद पाउडर या धब्बे दिखते ही',
    tipHi: 'तुड़ाई के तुरंत बाद स्प्रे करें ताकि अगली तुड़ाई तक दवा का असर धुल जाए।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)',
        technical: 'Carbendazim 12% + Mancozeb 63% WP',
        dose: '2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)',
        brands: ['Saaf (UPL)', 'Sixer'],
        safety: 'पारंपरिक फफूंदनाशक, शुरुआती धब्बों पर असरदार।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती रोकथाम',
        dosePerAcre: '500 ग्राम / एकड़',
        resistanceWarning: 'लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।'
      },
      {
        nameHi: 'हेक्साकोनाज़ोल 5% SC (कंटाफ)',
        technical: 'Hexaconazole 5% SC',
        dose: '1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)',
        brands: ['Contaf Plus (Tata)'],
        safety: 'सफेद चूर्ण रोग पर गहरा आंतरिक सिस्टेमिक असर।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '300 मिली / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)',
        technical: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Amistar Top (Syngenta)', 'Custodia'],
        safety: 'चूर्ण रोग और पत्ती धब्बों का संपूर्ण निवारण, पत्तियों में लंबे समय तक चमक।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  }
];

const gingerProblems = [
  {
    id: 'shoot-borer',
    nameHi: 'प्ररोह छेदक सुंडी (Shoot Borer)',
    nameEn: 'Shoot Borer',
    tagHi: 'कीट',
    image: '/images/pests/pest-conogethes-punctiferalis.jpg',
    stageHi: 'वानस्पतिक अवस्था (40-90 दिन)',
    stages: ['vegetative'],
    specialFactHi: 'सुंडी तने के अंदर छेद करती है जिससे बीच की गोभ सूख जाती है (Dead Heart)।',
    whatHi: 'अदरक के तने के अंदर घुसकर खाने वाली इल्ली जिससे पौधा पीला होकर सूख जाता है।',
    whyHi: ['मानसून के बाद नमी और गर्मी', 'खेत के आसपास अरंडी या अन्य मेजबान पौधे'],
    cureOrganicHi: ['सूखे तनों को काटकर इल्ली सहित नष्ट करें', 'नीम तेल 3-5 मिली/लीटर'],
    cureChemicalHi: ['क्लोरोपायरीफॉस 20% EC (500 ml)', 'लैम्ब्डा-साइहेलोथ्रिन 5% EC (250 ml)', 'कोराजन 18.5% SC (80 ml)'],
    whenToActHi: 'गोभ सूखने के शुरुआती लक्षण दिखते ही',
    tipHi: 'छिड़काव के समय पत्तियों और तने के जोड़ (Axil) को अच्छी तरह भिगोएं।',
    meds: [
      {
        nameHi: 'क्लोरोपायरीफॉस 20% EC (डरसबैन)',
        technical: 'Chlorpyrifos 20% EC',
        dose: '2.5 मिली / लीटर पानी (500 मिली प्रति एकड़)',
        brands: ['Dursban (Corteva)', 'Tricel'],
        safety: 'तेज गंध वाला कॉन्टैक्ट व वाष्पशील कीटनाशक।',
        level: 1,
        levelLabelHi: 'स्तर 1 · पारंपरिक स्तर',
        dosePerAcre: '500 मिली / एकड़',
        resistanceWarning: 'पुरानी केमिस्ट्री; लगातार प्रयोग से बचें।'
      },
      {
        nameHi: 'लैम्ब्डा-साइहेलोथ्रिन 5% EC (कराटे) या फ्लूबेन्डियामाइड 39.35% SC',
        technical: 'Lambda-cyhalothrin 5% EC (250 ml) या Flubendiamide (50 ml)',
        dose: '1.25 मिली / लीटर पानी',
        brands: ['Karate (Syngenta)', 'Fame (Bayer)'],
        safety: 'तने के अंदर छिपी सुंडी पर तेज नॉकडाउन असर।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '250 मिली / एकड़'
      },
      {
        nameHi: 'क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)',
        technical: 'Chlorantraniliprole 18.5% SC',
        dose: '0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)',
        brands: ['Coragen (FMC)', 'Cover'],
        safety: 'तने में प्रवेश करने वाली सुंडी पर 21 दिनों तक अटूट सुरक्षा।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '80 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'rhizome-rot',
    nameHi: 'प्रकंद मृदु सड़न (Rhizome Soft Rot - Pythium)',
    nameEn: 'Rhizome Soft Rot (Pythium)',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-erwinia.jpg',
    stageHi: 'गांठ बनने की अवस्था (60-120 दिन)',
    stages: ['vegetative', 'fruiting'],
    specialFactHi: 'निचली पत्तियों के किनारे पीले होकर सूखते हैं और अदरक की गांठ पानी जैसी बदबूदार सड़ती है। (जड़ों में ड्रेंचिंग)',
    whatHi: 'अदरक की फसल का सबसे विनाशकारी रोग, गांठें अंदर से पानी की तरह सड़ जाती हैं।',
    whyHi: ['भारी बारिश में जलभराव व खराब जल निकासी', 'कवक ग्रसित बीज प्रकंद'],
    cureOrganicHi: ['खेत से पानी की तुरंत निकासी करें', 'ट्राइकोडर्मा 2 किग्रा प्रति एकड़ ड्रेंचिंग करें'],
    cureChemicalHi: ['कॉपर ऑक्सीक्लोराइड 50% WP (800 g)', 'रिडोमिल गोल्ड (500 g)', 'सेक्टिन 60% WG (600 g) या एलियेट (500 g)'],
    whenToActHi: 'पत्तियों के किनारे पीले पड़ते ही तत्काल ड्रेंचिंग करें',
    tipHi: 'इस रोग में पत्तियों पर स्प्रे काम नहीं करता, पौधों की जड़ों और गांठों पर धार से ड्रेंचिंग जरूरी है।',
    meds: [
      {
        nameHi: 'कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)',
        technical: 'Copper Oxychloride 50% WP',
        dose: '4 ग्राम / लीटर पानी (800 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)',
        brands: ['Blitox (Rallis)', 'Blue Copper'],
        safety: 'मिट्टी में कवक को मारने के लिए ड्रेंचिंग; किसी EC दवा के साथ न मिलाएं।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती ड्रेंचिंग',
        dosePerAcre: '800 ग्राम / एकड़'
      },
      {
        nameHi: 'मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)',
        technical: 'Metalaxyl 8% + Mancozeb 64% WP',
        dose: '2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)',
        brands: ['Ridomil Gold (Syngenta)', 'Krilaxyl'],
        safety: 'पायथियम (Pythium) कवक पर सबसे अचूक सिस्टेमिक ड्रेंचिंग।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '500 ग्राम / एकड़'
      },
      {
        nameHi: 'फेनामिडोन 10% + मैंकोजेब 50% WG (सेक्टिन) या फॉसेटिल-अल 80% WP (एलियेट)',
        technical: 'Fenamidone 10% + Mancozeb 50% WG (600 g) या Fosetyl-Al 80% WP (500 g)',
        dose: '3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)',
        brands: ['Sectin (Bayer)', 'Aliette (Bayer)'],
        safety: 'प्रकंद सड़न पर आधुनिक रिसर्च फंगीसाइड, पौधे के दोनों संवहनी तंतुओं (Xylem व Phloem) में संचरित।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '600 ग्राम / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'bacterial-wilt',
    nameHi: 'जीवाणु उकठा (Bacterial Wilt - Ralstonia)',
    nameEn: 'Bacterial Wilt (Ralstonia)',
    tagHi: 'जीवाणु (बैक्टीरिया)',
    image: '/images/diseases/disease-ralstonia-solanacearum-2.jpg',
    stageHi: 'गांठ अवस्था',
    stages: ['vegetative', 'fruiting'],
    specialFactHi: 'पत्तियां हरी रहते हुए नीचे की ओर मुड़कर अचानक मुरझा जाती हैं; तना दबाने पर दूधिया गंदा पानी निकलता है। (ड्रेंचिंग)',
    whatHi: 'बैक्टीरिया से होने वाला उकठा जिसमें पौधे हरे-भरे ही 24 घंटे में लटक जाते हैं और सड़ने लगते हैं।',
    whyHi: ['मिट्टी में राल्सटोनिया जीवाणु की मौजूदगी', 'उच्च तापमान और अत्यधिक आर्द्रता'],
    cureOrganicHi: ['खेत में चूना या ब्लीचिंग पाउडर 5-10 किग्रा नाली में डालें', 'संक्रमित पौधे निकालें'],
    cureChemicalHi: ['कॉपर हाइड्रॉक्साइड + स्ट्रेप्टोसाइक्लिन', 'कासुगामाइसिन + कॉपर ऑक्सीक्लोराइड', 'कासु-बी + ब्लीचिंग पाउडर'],
    whenToActHi: 'एक भी पौधा मुरझाया दिखते ही पूरे खेत में ड्रेंचिंग करें',
    tipHi: 'संक्रमित पौधों के आसपास की मिट्टी में ब्लीचिंग पाउडर डालने से जीवाणु आगे नहीं फैलता।',
    meds: [
      {
        nameHi: 'कॉपर हाइड्रॉक्साइड 53.8% DF + स्ट्रेप्टोसाइक्लिन',
        technical: 'Copper Hydroxide 53.8% DF (400 g) + Streptocycline (24 g)',
        dose: '2 ग्राम + 0.12 ग्राम / लीटर पानी (जड़ों में ड्रेंचिंग)',
        brands: ['Kocide (Corteva) + Plantomycin'],
        safety: 'जीवाणु नाशक और तांबा आधारित सुरक्षा कवच।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)',
        dosePerAcre: '400 ग्राम + 24 ग्राम / एकड़'
      },
      {
        nameHi: 'कासुगामाइसिन 3% SL + कॉपर ऑक्सीक्लोराइड 50% WP',
        technical: 'Kasugamycin 3% SL (400 ml) + Copper Oxychloride (500 g)',
        dose: '2 मिली + 2.5 ग्राम / लीटर पानी',
        brands: ['Kasu-B (Dhanuka) + Blitox'],
        safety: 'एंटीबायोटिक व कॉपर का शक्तिशाली मिश्रण, जीवाणु की दीवार तोड़ता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '400 मिली + 500 ग्राम / एकड़'
      },
      {
        nameHi: 'कासुगामाइसिन 5% + कॉपर ऑक्सीक्लोराइड 45% WP + ब्लीचिंग पाउडर',
        technical: 'Kasugamycin 5% + Copper Oxychloride 45% WP (400 g) + Bleaching Powder (मिट्टी में नाली के पास)',
        dose: '2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)',
        brands: ['Kasu-Max (Dhanuka)'],
        safety: 'जीवाणु उकठा पर सबसे उन्नत सिस्टेमिक एंटीबायोटिक कॉपर फॉर्मूलेशन।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '400 ग्राम / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'leaf-spot',
    nameHi: 'पत्ती धब्बा (Phyllosticta Leaf Spot)',
    nameEn: 'Phyllosticta Leaf Spot',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-cercospora-canescens-2.jpg',
    stageHi: 'वानस्पतिक व गांठ अवस्था',
    stages: ['vegetative', 'fruiting'],
    specialFactHi: 'पत्तियों पर सफेद-भूरे कागज जैसे धब्बे जिनके बीच में काले बारीक बिंदु होते हैं।',
    whatHi: 'पत्तियों पर सूखने वाले धब्बे जिससे पत्ती का हरा भाग खत्म हो जाता है और अदरक का आकार छोटा रह जाता है।',
    whyHi: ['बारिश के मौसम में लगातार बादल और आर्द्रता'],
    cureOrganicHi: ['खेत को खरपतवार मुक्त रखें', 'नीम अर्क का छिड़काव'],
    cureChemicalHi: ['मैंकोजेब 75% WP (600 g)', 'प्रोपिकोनाज़ोल 25% EC (200 ml)', 'एमिस्टार टॉप (200 ml)'],
    whenToActHi: 'पत्तियों पर छोटे धब्बे दिखते ही',
    tipHi: 'छिड़काव में स्टिकर (स्प्रेडर) अवश्य मिलाएं ताकि बारिश में दवा धुले नहीं।',
    meds: [
      {
        nameHi: 'मैंकोजेब 75% WP (इंडोफिल M-45)',
        technical: 'Mancozeb 75% WP',
        dose: '3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)',
        brands: ['Indofil M-45'],
        safety: 'कॉन्टैक्ट सुरक्षा, धब्बों के फैलाव को रोकता है।',
        level: 1,
        levelLabelHi: 'स्तर 1 · सुरक्षात्मक स्तर',
        dosePerAcre: '600 ग्राम / एकड़',
        resistanceWarning: 'बारिश में जल्दी धुल जाता है।'
      },
      {
        nameHi: 'प्रोपिकोनाज़ोल 25% EC (टिल्ट)',
        technical: 'Propiconazole 25% EC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Tilt (Syngenta)', 'Result'],
        safety: 'पत्तियों के अंदर गहराई से धब्बों को सुखाता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '200 मिली / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)',
        technical: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dose: '1 मिली / लीटर पानी (200 मिली प्रति एकड़)',
        brands: ['Amistar Top (Syngenta)', 'Custodia'],
        safety: 'पत्ती धब्बे का संपूर्ण इलाज, पत्तियों को अंत तक हरा और सक्रिय रखता है।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '200 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  }
];

const mangoProblems = [
  {
    id: 'mango-hopper',
    nameHi: 'भुनगा / हॉपर (Mango Hopper)',
    nameEn: 'Mango Hopper',
    tagHi: 'कीट',
    image: '/images/pests/pest-idioscopus-clypealis.jpg',
    stageHi: 'आम - बौर अवस्था (Flowering)',
    stages: ['flowering'],
    specialFactHi: 'बौर और कोमल पत्तियों का रस चूसते हैं, चलने पर "चट-चट" की आवाज आती है और बौर पर काला चिपचिपा पदार्थ जम जाता है। (प्रति लीटर पानी)',
    whatHi: 'आम के बौर का सबसे मुख्य शत्रु कीट, जो सारा रस चूसकर बौर को सुखा देता है और फल नहीं बनने देता।',
    whyHi: ['फरवरी-मार्च में बौर आने के समय उमस व गर्मी', 'पेड़ के अंदर घनी टहनियां'],
    cureOrganicHi: ['पेड़ की सूखी व घनी टहनियों की छंटाई करें', 'नीम तेल 3 मिली/लीटर छिड़कें'],
    cureChemicalHi: ['इमिडाक्लोप्रिड 17.8% SL (0.4 ml/L)', 'थियामेथोक्सम 25% WG (0.3 g/L)', 'डिनोटिफ्यूरान 20% SG (0.4 g/L)'],
    whenToActHi: 'बौर निकलने के शुरुआती समय या फूल खिलने से पहले',
    tipHi: 'फूल पूरी तरह खिलने के बाद जब मधुमक्खियां आएं तो कीटनाशक का भारी छिड़काव न करें।',
    meds: [
      {
        nameHi: 'इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)',
        technical: 'Imidacloprid 17.8% SL',
        dose: '0.4 मिली / लीटर पानी',
        brands: ['Confidor (Bayer)', 'Tatamida'],
        safety: 'बौर पर हॉपर की शुरुआती रोकथाम।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '80 मिली / 200 लीटर पानी',
        resistanceWarning: 'लगातार इस्तेमाल से हॉपर में प्रतिरोध का खतरा।'
      },
      {
        nameHi: 'थियामेथोक्सम 25% WG (एक्टारा)',
        technical: 'Thiamethoxam 25% WG',
        dose: '0.3 ग्राम / लीटर पानी',
        brands: ['Actara (Syngenta)', 'Anant'],
        safety: 'रस चूसक भुनगे को तुरंत पैरालाइज करता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '60 ग्राम / 200 लीटर पानी'
      },
      {
        nameHi: 'डिनोटिफ्यूरान 20% SG (ओशीन) या बुप्रोफेजिन 25% SC',
        technical: 'Dinotefuran 20% SG (0.4 g/L) या Buprofezin 25% SC (1.5 ml/L)',
        dose: '0.4 ग्राम / लीटर पानी',
        brands: ['Oshin (PI Industries)', 'Applaud'],
        safety: 'तीसरी पीढ़ी का नियोनिकोटिनोइड, हॉपर और उसके शिशुओं पर तुरंत ड्रॉप-डाउन असर।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '80 ग्राम / 200 लीटर पानी',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'powdery-mildew',
    nameHi: 'खर्रा / दहिया रोग (Powdery Mildew)',
    nameEn: 'Powdery Mildew',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-oidium-mangiferae-2.jpg',
    stageHi: 'आम - बौर अवस्था',
    stages: ['flowering'],
    specialFactHi: 'बौर के डंठल और छोटे फलों पर सफेद पाउडर जमता है जिससे सारा बौर झड़ जाता है। (प्रति लीटर पानी)',
    whatHi: 'बौर और छोटी अमिया पर सफेद चूर्ण की परत जमना जिससे बौर काला पड़कर गिर जाता है।',
    whyHi: ['रात में ठंडक और दिन में तेज धूप (तापमान में अंतर)', 'हवा में नमी'],
    cureOrganicHi: ['घुलनशील सल्फर 80% WP 2 ग्राम/लीटर छिड़कें'],
    cureChemicalHi: ['घुलनशील सल्फर (2 g/L)', 'हेक्साकोनाज़ोल 5% SC (1.5 ml/L)', 'नेटिवो 75% WG (0.5 g/L)'],
    whenToActHi: 'बौर पर हल्का सफेद पाउडर दिखते ही',
    tipHi: 'दहिया रोग के लिए पहला सुरक्षात्मक स्प्रे बौर खिलने से पहले ही कर लें।',
    meds: [
      {
        nameHi: 'घुलनशील सल्फर 80% WP (सल्फेक्स)',
        technical: 'Wettable Sulphur 80% WP',
        dose: '2 ग्राम / लीटर पानी',
        brands: ['Sulfex (Excel)', 'Thiovit'],
        safety: 'सुरक्षात्मक फफूंदनाशक व सूक्ष्म पोषक तत्व सल्फर की आपूर्ति।',
        level: 1,
        levelLabelHi: 'स्तर 1 · सुरक्षात्मक स्तर',
        dosePerAcre: '400 ग्राम / 200 लीटर पानी',
        resistanceWarning: '35 डिग्री से अधिक तापमान पर फूल जलने का खतरा रहता है।'
      },
      {
        nameHi: 'हेक्साकोनाज़ोल 5% SC (कंटाफ)',
        technical: 'Hexaconazole 5% SC',
        dose: '1.5 मिली / लीटर पानी',
        brands: ['Contaf Plus (Tata)'],
        safety: 'बौर के डंठल के अंदर प्रवेश कर दहिया को पूरी तरह सुखाता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '300 मिली / 200 लीटर पानी'
      },
      {
        nameHi: 'टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)',
        technical: 'Tebuconazole 50% + Trifloxystrobin 25% WG',
        dose: '0.5 ग्राम / लीटर पानी',
        brands: ['Nativo (Bayer)'],
        safety: 'दहिया रोग पर विश्व प्रसिद्ध फॉर्मूलेशन, बौर को झड़ने से बचाता है और फल सेटिंग बढ़ाता है।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '100 ग्राम / 200 लीटर पानी',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'anthracnose-fruit-fly',
    nameHi: 'एन्थ्रेक्नोज व फल मक्खी (Anthracnose & Fruit Fly)',
    nameEn: 'Anthracnose & Fruit Fly',
    tagHi: 'फफूंद व कीट',
    image: '/images/diseases/disease-colletotrichum-gloeosporioides-2.jpg',
    stageHi: 'आम - फल अवस्था',
    stages: ['fruiting'],
    specialFactHi: 'आम पर काले धब्बे और पकते समय फल मक्खी के डंक से अंदर इल्लियां पड़ना।',
    whatHi: 'फलों पर काले धब्बे पड़ना और फल मक्खी द्वारा डंक मारने से आम का अंदर से सड़ना।',
    whyHi: ['मानसून की बारिश और उमस', 'फल मक्खी (Bactrocera dorsalis) का प्रकोप'],
    cureOrganicHi: ['मिथाइल यूजेनॉल ट्रैप (Fruit Fly Trap) 8-10 प्रति एकड़ लगाएं', 'गिरे फलों को जमीन में गाड़ें'],
    cureChemicalHi: ['कार्बेन्डाजिम + मैंकोजेब (2 g/L)', 'एमिस्टार टॉप + डेल्टामेथ्रिन', 'पायराक्लोस्ट्रोबिन + स्पिनोसैड'],
    whenToActHi: 'फल मटर के दाने से बड़ा होते ही व पकने के 30 दिन पहले',
    tipHi: 'फल मक्खी के लिए कीटनाशक का अंधाधुंध छिड़काव न करें, फेरोमोन ट्रैप सबसे असरदार समाधान है।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 12% + मैंकोजेब 63% WP + मिथाइल यूजेनॉल ट्रैप',
        technical: 'Carbendazim 12% + Mancozeb 63% WP (2 g/L) + Methyl Eugenol Traps',
        dose: '2 ग्राम / लीटर पानी + 8 ट्रैप / एकड़',
        brands: ['Saaf + Pheromone Traps'],
        safety: 'शुरुआती काले धब्बों पर सुरक्षा और फल मक्खी नर कीटों की ट्रैपिंग।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती रोकथाम',
        dosePerAcre: '400 ग्राम + ट्रैप्स'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल + डेल्टामेथ्रिन 2.8% EC',
        technical: 'Azoxystrobin + Difenoconazole (1 ml/L) + Deltamethrin 2.8% EC (1 ml/L)',
        dose: '1 मिली + 1 मिली / लीटर पानी',
        brands: ['Amistar Top + Decis'],
        safety: 'काले धब्बे अंदर से साफ और वयस्क मक्खियों का नॉकडाउन।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '200 मिली + 200 मिली / 200 लीटर पानी'
      },
      {
        nameHi: 'पायराक्लोस्ट्रोबिन 20% WG (कैब्रियो) + स्पिनोसैड 45% SC (ट्रेसर)',
        technical: 'Pyraclostrobin 20% WG (0.5 g/L) + Spinosad 45% SC (0.3 ml/L)',
        dose: '0.5 ग्राम + 0.3 मिली / लीटर पानी',
        brands: ['Cabrio Top (BASF) + Tracer (Corteva)'],
        safety: 'फलों पर चमक व एन्थ्रेक्नोज का पूर्ण सफाया + फल मक्खी का प्राकृतिक सुरक्षित खात्मा।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '100 ग्राम + 60 मिली / 200 लीटर पानी',
        isTopPerformer: true
      }
    ]
  }
];

const bananaProblems = [
  {
    id: 'panama-wilt',
    nameHi: 'पनामा उकठा व इरविनिया सड़न (Panama Wilt & Head Rot)',
    nameEn: 'Panama Wilt & Head Rot',
    tagHi: 'फफूंद व जीवाणु',
    image: '/images/diseases/disease-fusarium-cubense-2.jpg',
    stageHi: 'केला - वानस्पतिक अवस्था',
    stages: ['vegetative'],
    specialFactHi: 'पुरानी पत्तियां किनारे से पीली होकर डंठल से टूटकर लटक जाती हैं, तना नीचे से सड़ता है। (जड़ों में ड्रेंचिंग)',
    whatHi: 'केले का सबसे घातक विल्ट रोग जिसमें पत्तियां नीचे लटककर सूख जाती हैं और तना चीरने पर लाल-भूरे निशान दिखते हैं।',
    whyHi: ['फ्यूजेरियम कवक (Fusarium oxysporum f. sp. cubense) की उपस्थिति', 'जलभराव व खराब ड्रेनेज'],
    cureOrganicHi: ['रोग ग्रसित पौधों को चूना डालकर नष्ट करें', 'ट्राइकोडर्मा 2 किग्रा/एकड़ गोबर खाद में दें'],
    cureChemicalHi: ['कार्बेन्डाजिम + कॉपर ऑक्सीक्लोराइड', 'प्रोपिकोनाज़ोल + स्ट्रेप्टोसाइक्लिन', 'कस्टोडिया (1.5 ml/L)'],
    whenToActHi: 'निचली पत्तियों के लटकते ही तुरंत ड्रेंचिंग करें',
    tipHi: 'केले के तने के चारों ओर 1-2 फीट के घेरे में 3-5 लीटर घोल डालकर ड्रेंचिंग करें।',
    meds: [
      {
        nameHi: 'कार्बेन्डाजिम 50% WP + कॉपर ऑक्सीक्लोराइड 50% WP',
        technical: 'Carbendazim 50% WP (2 g/L) + Copper Oxychloride (3 g/L)',
        dose: '2 ग्राम + 3 ग्राम / लीटर पानी (जड़ों में ड्रेंचिंग)',
        brands: ['Bavistin + Blitox'],
        safety: 'जड़ों में कवक व सड़ांध रोकने का पारंपरिक उपाय।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती ड्रेंचिंग',
        dosePerAcre: '400 ग्राम + 600 ग्राम / एकड़',
        resistanceWarning: 'पनामा विल्ट रेस 4 पर साधारण फंगीसाइड का असर सीमित।'
      },
      {
        nameHi: 'प्रोपिकोनाज़ोल 25% EC + स्ट्रेप्टोसाइक्लिन',
        technical: 'Propiconazole 25% EC (1.5 ml/L) + Streptocycline (0.1 g/L)',
        dose: '1.5 मिली + 0.1 ग्राम / लीटर पानी',
        brands: ['Tilt (Syngenta) + Plantomycin'],
        safety: 'फफूंद व जीवाणु सड़ांध दोनों पर सिस्टेमिक नियंत्रण।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '300 मिली + 20 ग्राम / एकड़'
      },
      {
        nameHi: 'एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)',
        technical: 'Azoxystrobin 11% + Tebuconazole 18.3% SC',
        dose: '1.5 मिली / लीटर पानी (जड़ों व तने पर ड्रेंचिंग)',
        brands: ['Custodia (Adama)'],
        safety: 'केले की संवहनी नलिकाओं में तेजी से फैलने वाले कवक को रोकता है।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '300 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'sigatoka',
    nameHi: 'सिगाटोका पत्ती धब्बा (Sigatoka Leaf Spot)',
    nameEn: 'Sigatoka Leaf Spot',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-mycosphaerella-musicola.jpg',
    stageHi: 'केला - वानस्पतिक व घौद अवस्था',
    stages: ['vegetative', 'fruiting'],
    specialFactHi: 'पत्तियों के किनारों पर पीले-भूरे व काले लंबे धब्बे बनते हैं जिससे पत्ते सूख जाते हैं और घौद का वजन घट जाता है।',
    whatHi: 'केले की पत्तियों का सबसे आम फंगल रोग, पत्तियां जलने जैसी दिखती हैं और घौद छोटी रह जाती है।',
    whyHi: ['बरसात के मौसम में अत्यधिक आर्द्रता (90%+)', 'घने रोपे गए बाग'],
    cureOrganicHi: ['सूखी व पीली पत्तियों को काटकर तुरंत खेत से बाहर करें', 'खनिज तेल (Mineral oil) 10 ml/L'],
    cureChemicalHi: ['प्रोपिकोनाज़ोल 25% EC (200 ml) + स्टिकर', 'नेटिवो 75% WG (120 g)', 'प्रियाक्सर (120 ml)'],
    whenToActHi: 'पत्तियों पर सिगार जैसी पीली-भूरी धारियां दिखते ही',
    tipHi: 'छिड़काव में मिनरल ऑयल या सिलिकॉन स्टिकर अवश्य मिलाएं, पत्तियों पर मोम जैसी परत होती है।',
    meds: [
      {
        nameHi: 'प्रोपिकोनाज़ोल 25% EC + मिनरल ऑयल/स्टिकर',
        technical: 'Propiconazole 25% EC (200 ml/एकड़) + Mineral Oil / Sticker',
        dose: '1 मिली / लीटर पानी + 1 मिली स्टिकर',
        brands: ['Tilt (Syngenta)', 'Result'],
        safety: 'सिगाटोका के धब्बों को तुरंत रोकता है।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती रोकथाम',
        dosePerAcre: '200 मिली / एकड़',
        resistanceWarning: 'लगातार प्रोपिकोनाज़ोल छिड़कने से सिगाटोका कवक में प्रतिरोध देखा गया है।'
      },
      {
        nameHi: 'टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)',
        technical: 'Tebuconazole 50% + Trifloxystrobin 25% WG',
        dose: '0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)',
        brands: ['Nativo (Bayer)'],
        safety: 'पत्तियों के दोनों तरफ सुरक्षित परत बनाता है और नए पत्तों को सुरक्षित रखता है।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '120 ग्राम / एकड़'
      },
      {
        nameHi: 'फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन (प्रियाक्सर)',
        technical: 'Fluxapyroxad + Pyraclostrobin SC',
        dose: '0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)',
        brands: ['Priaxor (BASF)'],
        safety: 'सिगाटोका पर सबसे एडवांस्ड SDHI मॉलिक्यूल, पत्तियां अंत तक हरी व घौद का अधिकतम वजन।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '120 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'scarring-beetle-thrips',
    nameHi: 'छिलके का भृंग व थ्रिप्स (Scarring Beetle & Rust Thrips)',
    nameEn: 'Scarring Beetle & Rust Thrips',
    tagHi: 'कीट',
    image: '/images/pests/pest-chaetanaphothrips-signipennis.jpg',
    stageHi: 'केला - कमल/घौद निकलते समय',
    stages: ['fruiting'],
    specialFactHi: 'नए निकलते केले के छिलके को खुरच देते हैं जिससे केले पर काले चेचक जैसे दाग और जंग जैसे निशान पड़ जाते हैं।',
    whatHi: 'केले के छिलके पर भद्दे काले धब्बे और जंग जैसे निशान बनाने वाले कीट, जिससे बाजार भाव आधा हो जाता है।',
    whyHi: ['कमल (Flower bunch) निकलते समय कीटों का फूलों में छिपना', 'घौद को न ढकना'],
    cureOrganicHi: ['घौद निकलते ही नीले प्लास्टिक बैग (Bunch Sleeves) से ढकें', 'नीम तेल 3 मिली/लीटर'],
    cureChemicalHi: ['क्लोरोपायरीफॉस 20% EC (2 ml/L)', 'एसीफेट 75% SP (1.5 g/L)', 'स्पिनोसैड 45% SC (0.4 ml/L)'],
    whenToActHi: 'कमल खिलने और फलियां मुड़ने की अवस्था में घौद पर सीधा स्प्रे करें',
    tipHi: 'छिड़काव के 3-5 दिन बाद घौद को छेददार पॉलीथिन बैग से ढक देने पर 100% दाग मुक्त केला तैयार होता है।',
    meds: [
      {
        nameHi: 'क्लोरोपायरीफॉस 20% EC',
        technical: 'Chlorpyrifos 20% EC',
        dose: '2 मिली / लीटर पानी (घौद पर स्प्रे)',
        brands: ['Dursban (Corteva)', 'Tricel'],
        safety: 'कमल निकलते समय प्रारंभिक स्प्रे।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्प्रे',
        dosePerAcre: '400 मिली / 200 लीटर पानी'
      },
      {
        nameHi: 'एसीफेट 75% SP (असाटाफ)',
        technical: 'Acephate 75% SP',
        dose: '1.5 ग्राम / लीटर पानी',
        brands: ['Asataf (Rallis)', 'Starthene'],
        safety: 'फूलों और घौद के अंदर गहराई तक प्रवेश कर थ्रिप्स का खात्मा।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '300 ग्राम / 200 लीटर पानी'
      },
      {
        nameHi: 'स्पिनोसैड 45% SC (ट्रेसर) या स्पिनेटोरम 11.7% SC (डेलिगेट)',
        technical: 'Spinosad 45% SC (0.4 ml/L) या Spinetoram 11.7% SC (0.5 ml/L)',
        dose: '0.4 मिली / लीटर पानी',
        brands: ['Tracer (Corteva)', 'Delegate'],
        safety: 'केले के छिलके पर शून्य दाग, निर्यात गुणवत्ता के लिए सबसे सुरक्षित ग्रीन मॉलिक्यूल।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '80 मिली / 200 लीटर पानी',
        isTopPerformer: true
      }
    ]
  }
];

const grapesProblems = [
  {
    id: 'downy-mildew',
    nameHi: 'डाउनी मिल्ड्यू (Downy Mildew - केवड़ा रोग)',
    nameEn: 'Downy Mildew',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-plasmopara-viticola-2.jpg',
    stageHi: 'अंगूर - नई कोपल व फूल अवस्था',
    stages: ['vegetative', 'flowering'],
    specialFactHi: 'पत्तियों पर तेल जैसे पीले धब्बे (Oil spots) और फूल के गुच्छों पर सफेद फफूंद लगने से गुच्छे सूख जाते हैं।',
    whatHi: 'अंगूर का सबसे विनाशकारी रोग जो 48 घंटे में फूल के पूरे गुच्छों को सुखाकर नष्ट कर सकता है।',
    whyHi: ['छंटाई के बाद बारिश या रात में 90%+ आर्द्रता', 'तापमान 18-24°C'],
    cureOrganicHi: ['कैनोपी हवादार रखें', 'बोर्डो मिश्रण 0.5-1% या कॉपर फंगीसाइड का सुरक्षात्मक छिड़काव'],
    cureChemicalHi: ['साइमोक्सानिल + मैंकोजेब (600 g)', 'डाइमेथोमॉर्फ + मेटिराम (250+500 g)', 'मैंडीप्रोपामिड 23.4% SC (रेवस - 160 ml)'],
    whenToActHi: 'पत्ती पर तेल जैसे पारदर्शी धब्बे दिखते ही या बारिश की संभावना पर',
    tipHi: 'डाउनी मिल्ड्यू में हमेशा सुरक्षात्मक स्प्रे ही काम करता है, देर होने पर गुच्छे गिर जाते हैं।',
    meds: [
      {
        nameHi: 'साइमोक्सानिल 8% + मैंकोजेब 64% WP (कर्जेट)',
        technical: 'Cymoxanil 8% + Mancozeb 64% WP',
        dose: '3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)',
        brands: ['Curzate (Corteva)', 'Moximate'],
        safety: 'सुरक्षात्मक और छिपे हुए कवक पर शुरुआती उपचारात्मक असर।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती रोकथाम',
        dosePerAcre: '600 ग्राम / एकड़'
      },
      {
        nameHi: 'डाइमेथोमॉर्फ 50% WP + मेटिराम 70% WG',
        technical: 'Dimethomorph 50% WP (250 g) + Metiram 70% WG (500 g)',
        dose: '1.25 ग्राम + 2.5 ग्राम / लीटर पानी',
        brands: ['Acrobat (BASF) + Polyram'],
        safety: 'कवक की कोशिका भित्ति को तुरंत नष्ट करने वाला शक्तिशाली संयोजन।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '250 ग्राम + 500 ग्राम / एकड़'
      },
      {
        nameHi: 'मैंडीप्रोपामिड 23.4% SC (रेवस) या अमिसुलब्रोम 17.7% SC',
        technical: 'Mandipropamid 23.4% SC (160 ml) या Amisulbrom (150 ml)',
        dose: '0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)',
        brands: ['Revus (Syngenta)', 'Amistar'],
        safety: 'डाउनी मिल्ड्यू पर विश्व स्तरीय अत्याधुनिक मॉलिक्यूल, बारिश में 1 घंटे बाद भी नहीं धुलता।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '160 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'powdery-mildew',
    nameHi: 'चूर्णी फफूंद (Powdery Mildew - भुरी रोग)',
    nameEn: 'Powdery Mildew',
    tagHi: 'फफूंद',
    image: '/images/diseases/disease-uncinula-necator-2.jpg',
    stageHi: 'अंगूर - फूल व बेरी अवस्था',
    stages: ['flowering', 'fruiting'],
    specialFactHi: 'अंगूर के दानों (Berries) पर सफेद-राख जैसी परत जमती है जिससे दाने काले पड़कर फट जाते हैं (Cracking)।',
    whatHi: 'अंगूर के दानों और पत्तियों पर सफेद राख जैसी फफूंद जमना जिससे फल फट जाते हैं और सड़ जाते हैं।',
    whyHi: ['गर्म और शुष्क मौसम (25-32°C)', 'हवा में मध्यम नमी और छाया'],
    cureOrganicHi: ['घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर', 'कैनोपी में धूप का उचित आवागमन'],
    cureChemicalHi: ['माइक्लोब्यूटानिल 10% WP (150 g)', 'टेट्राकोनाज़ोल 3.8% EW (डोमार्क - 250 ml)', 'मेट्राफेनोन 50% SC (विवांडो - 100 ml)'],
    whenToActHi: 'बेरी सेटिंग के तुरंत बाद जब दाने मटर के आकार के हों',
    tipHi: 'अंगूर के दानों पर सफेद पाउडर दिखने से पहले ही बेरी अवस्था में सिस्टेमिक स्प्रे आवश्यक है।',
    meds: [
      {
        nameHi: 'माइक्लोब्यूटानिल 10% WP (सिस्टेन)',
        technical: 'Myclobutanil 10% WP',
        dose: '0.75 ग्राम / लीटर पानी (150 ग्राम प्रति एकड़)',
        brands: ['Systhane (Corteva)', 'Boon'],
        safety: 'प्रारंभिक चूर्णी फफूंद को रोकने वाला ट्रियाज़ोल।',
        level: 1,
        levelLabelHi: 'स्तर 1 · शुरुआती स्तर',
        dosePerAcre: '150 ग्राम / एकड़',
        resistanceWarning: 'लगातार उपयोग से कवक में प्रतिरोध का खतरा।'
      },
      {
        nameHi: 'टेट्राकोनाज़ोल 3.8% EW (डोमार्क) या डिफेनोकोनाज़ोल 25% EC (स्कोर)',
        technical: 'Tetraconazole 3.8% EW (250 ml) या Difenoconazole 25% EC (100 ml)',
        dose: '1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Domark (Isagro)', 'Score (Syngenta)'],
        safety: 'अंगूर की त्वचा पर सुरक्षित, दानों पर कोई सफेद दाग नहीं छोड़ता।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '250 मिली / एकड़'
      },
      {
        nameHi: 'मेट्राफेनोन 50% SC (विवांडो) या फ्लुक्सापाइरॉक्साड + डिफेनोकोनाज़ोल',
        technical: 'Metrafenone 50% SC (100 ml) या Fluxapyroxad + Difenoconazole',
        dose: '0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)',
        brands: ['Vivando (BASF)'],
        safety: 'भुरी रोग पर अद्वितीय मोड ऑफ एक्शन, दानों की चमक व एक्सपोर्ट क्वालिटी सुनिश्चित।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '100 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  },
  {
    id: 'thrips-mealybug',
    nameHi: 'थ्रिप्स व मिलीबग (Thrips & Mealybug)',
    nameEn: 'Thrips & Mealybug',
    tagHi: 'कीट',
    image: '/images/pests/pest-scirtothrips-dorsalis-2.jpg',
    stageHi: 'अंगूर - कोपल व बेरी अवस्था',
    stages: ['vegetative', 'fruiting'],
    specialFactHi: 'थ्रिप्स से अंगूर के दानों पर खुरदरे भूरे निशान पड़ते हैं; मिलीबग गुच्छों के अंदर घुसकर उन्हें चिपचिपा और काला कर देता है।',
    whatHi: 'अंगूर की गुणवत्ता खराब करने वाले कीट, जिससे अंगूर खुरदरे, काले और चिपचिपे हो जाते हैं।',
    whyHi: ['सूखा व गर्म मौसम', 'तने की पुरानी छाल में मिलीबग का छिपना'],
    cureOrganicHi: ['तने पर स्टिकी बैंड लगाएं ताकि मिलीबग ऊपर न चढ़े', 'क्रिप्टोलेमस लेडीबर्ड भृंग छोड़ें'],
    cureChemicalHi: ['फिप्रोनिल 80% WG + बुप्रोफेजिन (40 g + 400 ml)', 'स्पिनेटोरम 11.7% SC (150 ml)', 'मोवेन्टो एनर्जी (250 ml)'],
    whenToActHi: 'फूल खिलने से पहले व बेरी विकास के समय',
    tipHi: 'मिलीबग के लिए स्प्रे का दबाव अधिक रखें ताकि दवा छाल के अंदर तक पहुंचे।',
    meds: [
      {
        nameHi: 'फिप्रोनिल 80% WG + बुप्रोफेजिन 25% SC',
        technical: 'Fipronil 80% WG (40 g) + Buprofezin 25% SC (400 ml)',
        dose: '0.2 ग्राम + 2 मिली / लीटर पानी',
        brands: ['Jump + Applaud'],
        safety: 'थ्रिप्स पर तीव्र मारक क्षमता व मिलीबग के शिशुओं की रोकथाम।',
        level: 1,
        levelLabelHi: 'स्तर 1 · दोहरा वार',
        dosePerAcre: '40 ग्राम + 400 मिली / एकड़'
      },
      {
        nameHi: 'स्पिनेटोरम 11.7% SC (डेलिगेट)',
        technical: 'Spinetoram 11.7% SC',
        dose: '0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)',
        brands: ['Delegate (Corteva)'],
        safety: 'थ्रिप्स पर दुनिया का सर्वश्रेष्ठ नॉकडाउन मॉलिक्यूल, दानों पर दाग नहीं पड़ने देता।',
        level: 2,
        levelLabelHi: 'स्तर 2 · मध्यम स्तर',
        dosePerAcre: '150 मिली / एकड़'
      },
      {
        nameHi: 'स्पाइरोटेट्रामैट 150 OD (मोवेन्टो) या सायंट्रानिलिप्रोल 10.26% OD (बेनेविया)',
        technical: 'Spirotetramat 150 OD (250 ml) या Cyantraniliprole 10.26% OD (200 ml)',
        dose: '1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)',
        brands: ['Movento (Bayer)', 'Benevia (FMC)'],
        safety: 'दोनों दिशाओं में चलने वाला (Two-way systemic) आधुनिक कीटनाशक, गुच्छों के अंदर छिपे मिलीबग का संपूर्ण खात्मा।',
        level: 3,
        levelLabelHi: 'स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥',
        dosePerAcre: '250 मिली / एकड़',
        isTopPerformer: true
      }
    ]
  }
];

const part3Crops = [
  // 21. Arhar
  {
    slug: 'arhar',
    nameHi: 'अरहर (तुअर)',
    nameEn: 'Pigeon Pea (Arhar)',
    emoji: '🫘',
    image: '/images/crops/arhar.jpg',
    problems: pulsesProblems
  },
  // 22. Chana
  {
    slug: 'chana',
    nameHi: 'चना',
    nameEn: 'Chickpea (Chana)',
    emoji: '🫘',
    image: '/images/crops/chana.jpg',
    problems: pulsesProblems
  },
  // 23. Masoor
  {
    slug: 'masoor',
    nameHi: 'मसूर',
    nameEn: 'Lentil (Masoor)',
    emoji: '🫘',
    image: '/images/crops/masoor.jpg',
    problems: pulsesProblems
  },
  // 24. Mustard
  {
    slug: 'mustard',
    nameHi: 'सरसों',
    nameEn: 'Mustard',
    emoji: '🌼',
    image: '/images/crops/mustard.jpg',
    problems: mustardProblems
  },
  // 25. Bhindi
  {
    slug: 'bhindi',
    nameHi: 'भिंडी',
    nameEn: 'Okra (Bhindi)',
    emoji: '🟢',
    image: '/images/crops/bhindi.jpg',
    problems: bhindiProblems
  },
  // 26. Ginger
  {
    slug: 'ginger',
    nameHi: 'अदरक',
    nameEn: 'Ginger',
    emoji: '🫚',
    image: '/images/crops/ginger.jpg',
    problems: gingerProblems
  },
  // 27. Mango
  {
    slug: 'mango',
    nameHi: 'आम',
    nameEn: 'Mango',
    emoji: '🥭',
    image: '/images/crops/mango.jpg',
    problems: mangoProblems
  },
  // 28. Banana
  {
    slug: 'banana',
    nameHi: 'केला',
    nameEn: 'Banana',
    emoji: '🍌',
    image: '/images/crops/banana.jpg',
    problems: bananaProblems
  },
  // 29. Grapes
  {
    slug: 'grapes',
    nameHi: 'अंगूर',
    nameEn: 'Grapes',
    emoji: '🍇',
    image: '/images/crops/grapes.jpg',
    problems: grapesProblems
  }
];

module.exports = part3Crops;
