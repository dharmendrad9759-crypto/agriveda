/**
 * Field Doctor weed + herbicide guides — source-of-truth farmer dataset.
 * Preserve doses, timings, brands, weed names, and field warnings.
 */

export type WeedLeafCategory = "grass" | "broadleaf" | "sedge" | "parasitic" | "shrub";

export type WeedIdEntry = {
  localHi: string;
  scientific?: string;
  category: WeedLeafCategory;
};

export type HerbicideOption = {
  /** pre | early_post | post | directed | combo */
  applicationType: "pre" | "early_post" | "post" | "directed" | "combo";
  timingHi: string;
  technical: string;
  brands?: string[];
  doseHi: string;
  waterHi?: string;
  nozzleHi?: string;
  weedStageHi?: string;
  targetsHi?: string[];
  fieldConditionHi?: string;
  adjuvantHi?: string;
  warningHi?: string;
  noteHi?: string;
};

export type FieldDoctorTip = {
  titleHi: string;
  pointsHi: string[];
};

export type CropWeedFieldGuide = {
  criticalPeriodHi: string;
  criticalNoteHi?: string;
  weeds: WeedIdEntry[];
  preEmergence: HerbicideOption[];
  postEmergence: HerbicideOption[];
  fieldDoctorTips: FieldDoctorTip[];
  /** Global principles shown once (mulch, nozzle, water volume…) */
  principlesHi?: string[];
};

export const WEED_GLOBAL_PRINCIPLES_HI: string[] = [
  "खरपतवार 2 से 4 पत्ती का हो तब स्प्रे सबसे अच्छा लगता है। 6–8 पत्ती पर सिर्फ ऊपर जल सकता है।",
  "खेत में पैर धंसने जैसी अच्छी नमी हो — सूखी जमीन पर स्प्रे कम असर करता है, फसल पर झटका भी लग सकता है।",
  "नोजल: Flat Fan या कट नोजल लगाओ। गोल Cone नोजल से दवा उड़कर फसल पर गिर सकती है।",
  "पानी: कम से कम 150 लीटर प्रति एकड़ (लगभग 15 टंकी × 10 लीटर)। 5–6 टंकी में पूरा स्प्रे अधूरा असर।",
];

export const WEED_FIELD_GUIDE_ALIASES: Record<string, string> = {
  rice: "paddy",
  dhaan: "paddy",
  groundnut: "moongfali",
  mungfali: "moongfali",
  arhar: "pulses",
  tur: "pulses",
  pigeonpea: "pulses",
  okra: "bhindi",
  eggplant: "brinjal",
  baingan: "brinjal",
  gram: "chana",
  chickpea: "chana",
  lentil: "masoor",
  pearl_millet: "bajra",
  sugar_cane: "sugarcane",
};

/** Field Doctor weed guides — all 27 crops from master prompt */
export const WEED_FIELD_GUIDES: Record<string, CropWeedFieldGuide> = {
  wheat: {
    criticalPeriodHi: "बुवाई के 30 से 45 दिन",
    criticalNoteHi: "पहली सिंचाई के तुरंत बाद",
    weeds: [
      { localHi: "गुल्ली डंडा / मंडूसी / कनकौआ", category: "grass", scientific: "Phalaris minor" },
      { localHi: "जंगली जई", category: "grass", scientific: "Avena fatua" },
      { localHi: "बथुआ", category: "broadleaf", scientific: "Chenopodium album" },
      { localHi: "कृष्णनील", category: "broadleaf", scientific: "Anagallis arvensis" },
      { localHi: "हिरनखुरी", category: "broadleaf", scientific: "Convolvulus arvensis" },
      { localHi: "चटरी-मटरी", category: "broadleaf", scientific: "Vicia sativa" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 0–3 दिन · 48–72 घंटे के भीतर", technical: "Pyroxasulfone 85% WG", brands: ["Shaked","Momiji","Awkira"], doseHi: "60 ग्राम प्रति एकड़", waterHi: "150–200 लीटर पानी", targetsHi: ["गुल्ली डंडा", "बथुआ"], fieldConditionHi: "पलेवा में अच्छी नमी हो", noteHi: "जहाँ Clodinafop या Sulfosulfuron का असर कम हो गया हो, वहाँ अच्छा विकल्प" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "पहली सिंचाई के बाद · गुल्ली 2–3 पत्ती", technical: "Clodinafop-propargyl 15% WP", brands: ["Topik","Point"], doseHi: "160 ग्राम प्रति एकड़", targetsHi: ["गुल्ली डंडा","जंगली जई"] },
      { applicationType: "post", timingHi: "पहली सिंचाई के बाद · गुल्ली 2–3 पत्ती", technical: "Pinoxaden 5.1% EC", brands: ["Axial","Axel"], doseHi: "350–400 मिली प्रति एकड़", targetsHi: ["गुल्ली डंडा","जंगली जई"] },
      { applicationType: "post", timingHi: "बुवाई के 32–35 दिन बाद", technical: "Metsulfuron-methyl 20% WP", brands: ["Algrip"], doseHi: "8 ग्राम प्रति एकड़", targetsHi: ["बथुआ","हिरनखुरी","कृष्णनील"] },
      { applicationType: "post", timingHi: "बुवाई के 32–35 दिन बाद", technical: "2,4-D Amine Salt 58% SL", doseHi: "400 मिली प्रति एकड़", targetsHi: ["बथुआ","हिरनखुरी","कृष्णनील"] },
      { applicationType: "combo", timingHi: "घास और चौड़ी पत्ती दोनों के लिए", technical: "Sulfosulfuron 75% + Metsulfuron-methyl 5% WG", brands: ["Total","Leader Plus"], doseHi: "16 ग्राम प्रति एकड़", waterHi: "150 लीटर पानी", targetsHi: ["गुल्ली डंडा","जंगली जई","बथुआ","हिरनखुरी"], adjuvantHi: "गोंद / surfactant पैक के साथ मिलाएँ" },
    ],
    fieldDoctorTips: [
      { titleHi: "2,4-D की सावधानी", pointsHi: ["गेहूं के पास सरसों, मटर, आलू या चना हो तो हवा चलते समय 2,4-D मत डालो", "2,4-D पड़ोसी फसल पर उड़ सकती है — पत्ते मुड़ जाते हैं"] },
      { titleHi: "कट नोजल से स्प्रे करो", pointsHi: ["दवा और यूरिया एक नली से मिलाकर फेंकने से गुल्ली डंडा नहीं मरता", "कट नोजल से लाइन बनाकर जमीन पर स्प्रे करो"] },
    ],
  },
  paddy: {
    criticalPeriodHi: "रोपाई वाली: रोपाई के 15–45 दिन · सीधी बुवाई: 10–35 दिन",
    weeds: [
      { localHi: "सांवा / सावां", category: "grass", scientific: "Echinochloa crus-galli / E. colona" },
      { localHi: "मकरा घास", category: "grass" },
      { localHi: "छोटा मोथा / चपटा मोथा", category: "sedge", scientific: "Cyperus iria / C. difformis" },
      { localHi: "जलकुंभी", category: "broadleaf" },
      { localHi: "मिर्ची घास", category: "broadleaf" },
      { localHi: "Sphenoclea", category: "broadleaf" },
      { localHi: "ब्राह्मी", category: "broadleaf" },
      { localHi: "अमोनिया", category: "broadleaf" },
    ],
    preEmergence: [
      {
        applicationType: "pre",
        timingHi: "रोपाई के तुरंत बाद · 0–3 दिन",
        technical: "Pretilachlor 50% EC",
        brands: ["Rifit", "Eraze"],
        doseHi: "500 मिली प्रति एकड़",
        targetsHi: ["सांवा", "चौड़ी पत्ती वाले खरपतवार के बीज"],
        fieldConditionHi: "2–3 सेमी स्थिर पानी रखो · 48 घंटे तक पानी सूखने न दो · 20–25 किलो सूखी रेत में मिलाकर छिटकें या स्प्रे करो",
      },
    ],
    postEmergence: [
      {
        applicationType: "early_post",
        timingHi: "रोपाई के 15–22 दिन बाद",
        technical: "Bispyribac-sodium 10% SC",
        brands: ["Nominee Gold", "Taarak"],
        doseHi: "80–100 मिली प्रति एकड़",
        waterHi: "120–150 लीटर पानी",
        nozzleHi: "कट नोजल",
        targetsHi: ["सांवा घास", "2–4 पत्ती की अवस्था", "कुछ चौड़ी पत्ती वाले खरपतवार"],
      },
      {
        applicationType: "post",
        timingHi: "20–25 दिन",
        technical: "Metsulfuron-methyl 10% + Chlorimuron-ethyl 10% WP",
        brands: ["Almix"],
        doseHi: "8 ग्राम प्रति एकड़",
        adjuvantHi: "Surfactant के साथ मिलाएँ",
        targetsHi: ["सभी प्रकार के मोथा", "चौड़ी पत्ती वाले खरपतवार"],
      },
    ],
    fieldDoctorTips: [
      {
        titleHi: "Nominee Gold की आम गलती",
        pointsHi: [
          "भरे पानी में Nominee Gold मत डालो — पहले पानी निकालो",
          "भरे पानी में डालोगे तो दवा धुल जाती है और घास अच्छी तरह नहीं मरती",
          "स्प्रे से 24 घंटे पहले खेत का पानी पूरी तरह निकाल दो",
          "केवल कीचड़ और नमी रहनी चाहिए",
          "स्प्रे करो, फिर 48 घंटे बाद दोबारा 2 इंच पानी भर दो",
        ],
      },
      {
        titleHi: "दूसरी दवा साथ न मिलाओ",
        pointsHi: [
          "Nominee Gold के साथ Zinc sulfate या कीटनाशक मिलाकर टंकी मत बनाओ",
          "मिला दोगे तो धान पीला पड़ सकता है",
        ],
      },
    ],
  },
  maize: {
    criticalPeriodHi: "बुवाई के 15 से 40 दिन",
    weeds: [
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "Dactyloctenium*", category: "grass" },
      { localHi: "दूब", category: "grass" },
      { localHi: "Cynodon*", category: "grass" },
      { localHi: "पत्थरचट्टा / सांठी", category: "broadleaf" },
      { localHi: "Trianthema portulacastrum*", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "Amaranthus viridis*", category: "broadleaf" },
      { localHi: "नागरमोथा", category: "sedge" },
    ],
    preEmergence: [
      {
        applicationType: "pre",
        timingHi: "बुवाई के 0–2 दिन",
        technical: "Atrazine 50% WP",
        brands: ["Atrataf", "Dhanuzine"],
        doseHi: "500–800 ग्राम प्रति एकड़ (हल्की मिट्टी 500 g · भारी 800 g)",
        waterHi: "150–200 लीटर पानी",
        targetsHi: ["सांठी", "जंगली चौलाई", "मौसमी घास का जमाव"],
      },
    ],
    postEmergence: [
      {
        applicationType: "post",
        timingHi: "15–22 दिन · खरपतवार 2–4 पत्ती",
        technical: "Tembotrione 34.4% SC",
        brands: ["Laudis"],
        doseHi: "115 मिली प्रति एकड़",
        waterHi: "150 लीटर प्रति एकड़",
        adjuvantHi: "400 मिली Vegimax (surfactant)",
        targetsHi: ["सांठी", "मकड़ा", "सांवा", "जंगली चौलाई"],
      },
      {
        applicationType: "post",
        timingHi: "15–22 दिन · खरपतवार 2–4 पत्ती",
        technical: "Topramezone 33.6% SC",
        brands: ["Tynzer"],
        doseHi: "30 मिली प्रति एकड़",
        waterHi: "150 लीटर प्रति एकड़",
        adjuvantHi: "Flux / MSO Outright",
        targetsHi: ["सांठी", "मकड़ा", "सांवा", "जंगली चौलाई"],
      },
    ],
    fieldDoctorTips: [
      {
        titleHi: "खरपतवार सफेद क्यों दिखते हैं",
        pointsHi: [
          "Tynzer या Laudis डालने के लगभग 48 घंटे बाद खरपतवार बर्फ जैसे सफेद दिख सकते हैं",
          "6–8 दिन में खरपतवार सूख जाते हैं",
          "घबराओ मत — मक्का पर नुकसान नहीं होता",
        ],
      },
      {
        titleHi: "मक्का के साथ दलहन हो तो",
        pointsHi: [
          "मक्का में उड़द, मूंग या कोई दलहन बोई हो तो Atrazine, Laudis या Tynzer कभी मत डालो",
          "दलहन पूरी तरह जल सकती है",
          "तब सिर्फ Pendimethalin उगने से पहले डालो",
        ],
      },
    ],
  },
  bajra: {
    criticalPeriodHi: "बुवाई के 15 से 30 दिन",
    weeds: [
      { localHi: "सांठी / बिषखपरा", category: "broadleaf" },
      { localHi: "Trianthema*", category: "broadleaf" },
      { localHi: "चौलाई", category: "broadleaf" },
      { localHi: "लटजीरा", category: "broadleaf" },
      { localHi: "कास", category: "broadleaf" },
      { localHi: "मोथा", category: "broadleaf" },
    ],
    preEmergence: [
      {
        applicationType: "pre",
        timingHi: "0–2 दिन",
        technical: "Atrazine 50% WP",
        brands: ["Atrataf"],
        doseHi: "250–350 ग्राम प्रति एकड़ (मक्का से आधी खुराक)",
        warningHi: "रेतीली जमीन में 300 ग्राम से अधिक मत डालो — बाजरा अंकुरण के बाद सूख सकता है",
      },
    ],
    postEmergence: [
      {
        applicationType: "post",
        timingHi: "20–25 दिन",
        technical: "2,4-D Amine Salt 58% SL",
        doseHi: "250–300 मिली प्रति एकड़",
        targetsHi: ["केवल चौड़ी पत्ती: सांठी", "चौलाई"],
      },
    ],
    fieldDoctorTips: [
      {
        titleHi: "कल्टीवेटर से गुड़ाई बेहतर",
        pointsHi: [
          "बाजरा खरपतवार की दवाओं के प्रति बहुत नाजुक है",
          "ज्यादातर किसान 18–20 दिन पर बैल या ट्रैक्टर कल्टीवेटर (कसोला) चलाते हैं — खरपतवार निकलते हैं, जड़ों में हवा लगती है, कल्ले लगभग दोगुने हो सकते हैं",
        ],
      },
    ],
  },
  sugarcane: {
    criticalPeriodHi: "बुवाई के 30 से 90 दिन",
    criticalNoteHi: "गन्ने की बढ़वार धीमी होती है · पत्तियाँ फैलने में लगभग 3 महीने लगते हैं",
    weeds: [
      { localHi: "नागरमोथा", category: "sedge", scientific: "Cyperus rotundus" },
      { localHi: "दूब", category: "grass" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "कुंदरू / लतर वाली बेलें", category: "broadleaf" },
      { localHi: "मकोई", category: "broadleaf" },
      { localHi: "बरियारा", category: "broadleaf" },
    ],
    preEmergence: [
      {
        applicationType: "pre",
        timingHi: "बुवाई के तुरंत बाद · 0 से 3 दिन",
        technical: "Metribuzin 70% WP",
        brands: ["Sencor", "Tata Metri"],
        doseHi: "400 ग्राम प्रति एकड़",
      },
      {
        applicationType: "pre",
        timingHi: "बुवाई के तुरंत बाद · 0 से 3 दिन",
        technical: "Atrazine 50% WP",
        doseHi: "1.0 से 1.25 किग्रा प्रति एकड़",
        waterHi: "200 लीटर पानी प्रति एकड़",
      },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "25 से 45 दिन · मोथा 3–4 पत्ती · अच्छी नमी हो", technical: "Halosulfuron-methyl 75% WG", brands: ["Sempra"], doseHi: "36 ग्राम प्रति एकड़", waterHi: "150 लीटर पानी", nozzleHi: "Flat Fan nozzle", noteHi: "मोथा की जमीन के नीचे की गाँठों को सुखा देती है", targetsHi: ["नागरमोथा"] },
      { applicationType: "post", timingHi: "चौड़ी पत्ती और लतर / बेलें", technical: "2,4-D Amine Salt 58% SL", doseHi: "800 मिली प्रति एकड़", waterHi: "150–200 लीटर पानी", targetsHi: ["चौड़ी पत्ती वाले खरपतवार", "लतर / बेल वाली घास"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "सूखी पत्ती की मल्च",
        pointsHi: [
          "गन्ने की दो लाइनों के बीच सूखी पत्ती बिछा दो",
          "खरपतवार को धूप नहीं मिलती — बिना दवा के लगभग 80% तक खरपतवार दब सकते हैं",
          "एक रुपये की दवा डाले बिना भी खरपतवार का दबाव कम हो सकता है",
        ],
      },
      {
        titleHi: "Sempra कैसे काम करती है",
        pointsHi: [
          "Sempra डालने के 10–12 दिन बाद मोथा पीला पड़ना शुरू हो सकता है",
          "घबराओ मत — दवा धीरे-धीरे गाँठ को अंदर से सड़ाती है",
        ],
      },
    ],
  },
  cotton: {
    criticalPeriodHi: "बुवाई के 15 से 60 दिन",
    weeds: [
      { localHi: "मकड़ा", category: "grass" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "दूब घास", category: "grass" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "Trianthema*", category: "broadleaf" },
      { localHi: "फूलिया", category: "broadleaf" },
      { localHi: "Digera arvensis*", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "कंधी", category: "broadleaf" },
    ],
    preEmergence: [
      {
        applicationType: "pre",
        timingHi: "बुवाई के 24–48 घंटे के अंदर",
        technical: "Pendimethalin 38.7% CS",
        brands: ["Stomp Xtra"],
        doseHi: "700 मिली प्रति एकड़",
        waterHi: "150–200 लीटर पानी",
        noteHi: "CS — धूप में उड़ता नहीं · लगभग 30 दिन नई घास रोकता है",
      },
    ],
    postEmergence: [
      {
        applicationType: "early_post",
        timingHi: "20–30 दिन",
        technical: "Pyrithiobac-sodium 10% EC",
        brands: ["Hitweed", "Godrej"],
        doseHi: "250–300 मिली प्रति एकड़",
        waterHi: "150 लीटर पानी",
        targetsHi: ["सांठी", "फूलिया", "चौड़ी पत्ती वाले खरपतवार"],
      },
      {
        applicationType: "post",
        timingHi: "20–30 दिन · केवल घास",
        technical: "Quizalofop-ethyl 5% EC",
        brands: ["Targa Super"],
        doseHi: "350–400 मिली प्रति एकड़",
        targetsHi: ["घास / संकरी पत्ती"],
      },
      {
        applicationType: "post",
        timingHi: "20–30 दिन · केवल घास",
        technical: "Propaquizafop 10% EC",
        brands: ["Agil"],
        doseHi: "250–300 मिली प्रति एकड़",
        targetsHi: ["केवल घास"],
      },
      {
        applicationType: "combo",
        timingHi: "घास और चौड़ी पत्ती एक साथ",
        technical: "Pyrithiobac-sodium 6% + Quizalofop-p-ethyl 4% MEC",
        brands: ["Hitweed Maxx"],
        doseHi: "500 मिली प्रति एकड़",
        targetsHi: ["घास", "चौड़ी पत्ती"],
      },
      {
        applicationType: "directed",
        timingHi: "45 दिन के बाद · ढक्कन लगाकर कतारों के बीच",
        technical: "Paraquat dichloride 24% SL",
        brands: ["Gramoxone"],
        doseHi: "500 मिली प्रति एकड़",
        warningHi: "एक बूंद भी हरे तने या पत्ती पर न पड़े",
      },
    ],
    fieldDoctorTips: [
      {
        titleHi: "2,4-D और राउंडअप से सावधान",
        pointsHi: [
          "कपास 2,4-D के प्रति बहुत नाजुक है",
          "500 मीटर दूर स्प्रे होने पर भी हवा के साथ उड़कर कपास के पत्ते मुड़ सकते हैं",
          "लक्षण: पत्ते तोता-पंखी जैसे मुड़ जाते हैं",
        ],
      },
      {
        titleHi: "ढक्कन लगाकर निर्देशित स्प्रे",
        pointsHi: [
          "जब कपास 45 दिन से ऊपर हो जाए, कतारों के बीच ढक्कन लगाकर Paraquat (Gramoxone) 500 मिली प्रति एकड़ डालो",
          "दवा की एक बूंद भी कपास के हरे तने या हरी पत्ती पर नहीं पड़नी चाहिए",
        ],
      },
    ],
  },
  potato: {
    criticalPeriodHi: "बुवाई के 15 से 40 दिन",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "जंगली पालक", category: "broadleaf" },
      { localHi: "मकोई", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "दूब", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद · 0 से 3 दिन", technical: "Pendimethalin 30% EC", brands: ["Stomp"], doseHi: "1.2 लीटर प्रति एकड़", fieldConditionHi: "मेड़ों पर नमी में स्प्रे करो" },
    ],
    postEmergence: [
      { applicationType: "early_post", timingHi: "5 से 10% आलू निकलने पर", technical: "Metribuzin 70% WP", brands: ["Sencor", "Tata Metri"], doseHi: "हल्की/रेतीली: 150–200 ग्राम प्रति एकड़ · भारी/चिकनी: 250–300 ग्राम प्रति एकड़", waterHi: "150–200 लीटर पानी", fieldConditionHi: "मेड़ों पर नमी में स्प्रे", targetsHi: ["बथुआ", "चौड़ी पत्ती वाले खरपतवार", "छोटी घास"], noteHi: "नामोनिशान मिटा देता है" },
      { applicationType: "post", timingHi: "25 से 35 दिन · केवल घास", technical: "Quizalofop-p-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350 मिली प्रति एकड़", targetsHi: ["घास वाले खरपतवार"], noteHi: "केवल घास मरेगी · आलू पर पूरी तरह सुरक्षित" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "Sencor — किस्म की सावधानी",
        pointsHi: [
          "कुछ किस्में जैसे Kufri Chandramukhi और Kufri Jyoti में Metribuzin की तेज खुराक से पत्तियाँ जल सकती हैं",
          "रेतीली जमीन में 150–200 ग्राम से अधिक कभी मत रखो",
        ],
      },
      {
        titleHi: "मिट्टी चढ़ाना और खरपतवार",
        pointsHi: [
          "आलू में 25–30 दिन पर मिट्टी चढ़ाई जाती है",
          "इससे खरपतवार वैसे ही दब जाते हैं",
          "दवा का मुख्य काम बुवाई से लेकर मिट्टी चढ़ाने तक के लगभग 25 दिनों में मेड़ों को खरपतवार-मुक्त रखना है",
        ],
      },
    ],
  },
  chana: {
    criticalPeriodHi: "बुवाई के 30 से 60 दिन",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf", scientific: "Chenopodium" },
      { localHi: "प्याजी / जंगली प्याज", category: "broadleaf", scientific: "Asphodelus tenuifolius" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "चटरी-मटरी", category: "broadleaf", scientific: "Vicia" },
      { localHi: "पोहिला / कंटीली", category: "broadleaf" },
      { localHi: "गुल्ली डंडा", category: "grass", scientific: "Phalaris minor" },
      { localHi: "जंगली जई", category: "grass" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 0 से 3 दिन में", technical: "Pendimethalin 38.7% CS", brands: ["Stomp Xtra"], doseHi: "700 मिली प्रति एकड़", waterHi: "150–200 लीटर पानी प्रति एकड़", targetsHi: ["बथुआ", "प्याजी", "कंटीली", "मौसमी घासों के बीजों का जमाव"], noteHi: "इनका जमाव पूरी तरह रोकता है" },
      { applicationType: "pre", timingHi: "बुवाई के 0 से 3 दिन में", technical: "Pendimethalin 30% EC", brands: ["Stomp", "Dhanutop"], doseHi: "1.0 से 1.2 लीटर प्रति एकड़", waterHi: "150–200 लीटर पानी प्रति एकड़", targetsHi: ["बथुआ", "प्याजी", "कंटीली"] },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "बुवाई के 25 से 35 दिन पर", technical: "Quizalofop-p-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350–400 मिली प्रति एकड़", targetsHi: ["घास", "जंगली जई", "गुल्ली डंडा"], noteHi: "चने की फसल पर पूरी तरह सुरक्षित" },
      { applicationType: "post", timingHi: "बुवाई के 25 से 35 दिन पर", technical: "Propaquizafop 10% EC", brands: ["Agil"], doseHi: "250–300 मिली प्रति एकड़", targetsHi: ["केवल संकरी पत्ती — घास", "जंगली जई", "गुल्ली डंडा"], noteHi: "चने की फसल पर पूरी तरह सुरक्षित" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "चौड़ी पत्ती की दवा — सावधानी",
        pointsHi: [
          "खड़ी चने की फसल में बथुआ या प्याजी के लिए चौड़ी पत्ती वाली दवा डालने में बहुत सावधानी रखो",
          "खड़ी फसल में चौड़ी पत्ती वाले खरपतवार के लिए सुरक्षित उगने-के-बाद वाली दवा उपलब्ध नहीं",
          "गलती: दुकानदार सोयाबीन वाला Pursuit (Imazethapyr) चना में दे देते हैं — चना पीला पड़कर बैठ सकता है",
        ],
      },
      {
        titleHi: "प्याजी / जंगली प्याज",
        pointsHi: [
          "खास समस्या राजस्थान, हरियाणा, मध्य प्रदेश में",
          "मुख्य उपाय: 1) बुवाई के तुरंत बाद Pendimethalin 2) पहली सिंचाई से पहले खुरपी से हाथ से निराई",
        ],
      },
    ],
  },
  pulses: {
    criticalPeriodHi: "बुवाई के 15 से 50 दिन",
    criticalNoteHi: "शुरुआती 2 महीने अरहर की बढ़वार बहुत धीमी होती है",
    weeds: [
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "दूब", category: "grass" },
      { localHi: "सांठी / पत्थरचट्टा", category: "broadleaf", scientific: "Trianthema" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "कनकौआ", category: "broadleaf", scientific: "Commelina" },
      { localHi: "नागरमोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 0 से 2 दिन", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़", waterHi: "150–200 लीटर पानी" },
    ],
    postEmergence: [
      { applicationType: "early_post", timingHi: "15 से 25 दिन · खरपतवार 2–4 पत्ती", technical: "Imazethapyr 10% SL", brands: ["Pursuit", "Lurit"], doseHi: "300 से 350 मिली प्रति एकड़", waterHi: "150 लीटर", nozzleHi: "Cut nozzle", targetsHi: ["सांठी", "जंगली चौलाई", "छोटी घास", "मोथा की ऊपरी बढ़वार"] },
      { applicationType: "combo", timingHi: "घास और चौड़ी पत्ती एक साथ", technical: "Propaquizafop 2.5% + Imazethapyr 3.75% ME", brands: ["Shaked", "Iris"], doseHi: "800 मिली प्रति एकड़", waterHi: "150 लीटर पानी" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "Pursuit के बाद हल्का पीलापन",
        pointsHi: [
          "Imazethapyr / Pursuit स्प्रे के बाद 5 से 7 दिन तक हल्का पीलापन आ सकता है · बढ़वार थोड़ी रुक सकती है",
          "घबराओ मत — 8–10 दिन बाद फसल फिर तेजी से हरी होकर बढ़ सकती है",
        ],
      },
    ],
  },
  moong: {
    criticalPeriodHi: "बुवाई के 15 से 30 दिन",
    weeds: [
      { localHi: "सांठी / पत्थरचट्टा", category: "broadleaf", scientific: "Trianthema" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "मकड़ा घास", category: "grass" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 0 से 48 घंटे", technical: "Pendimethalin 30% EC", doseHi: "1.0 लीटर प्रति एकड़", fieldConditionHi: "खेत में पलेवा की भरपूर नमी हो" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "15 से 20 दिन", technical: "Imazethapyr 10% SL", brands: ["Pursuit"], doseHi: "300 मिली प्रति एकड़" },
      { applicationType: "combo", timingHi: "15 से 20 दिन · घास और चौड़ी पत्ती", technical: "Fomesafen 11.1% + Quizalofop-ethyl 5.5% EC", brands: ["Patela"], doseHi: "400 मिली प्रति एकड़", waterHi: "150 लीटर पानी प्रति एकड़", targetsHi: ["सांठी", "चौलाई", "घासों का पूरा सफाया"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "22 दिन की लक्ष्मण रेखा — जायद मूंग",
        pointsHi: [
          "जायद / गर्मी मूंग में फसल लगभग 60–65 दिन की होती है",
          "22 दिन के बाद खरपतवार की दवा मत डालो",
          "25 दिन के बाद स्प्रे करोगे तो दवा के झटके से फूल आने में 10–12 दिन देरी हो सकती है · फसल मानसून की चपेट में आ सकती है",
        ],
      },
    ],
  },
  urad: {
    criticalPeriodHi: "बुवाई के 15 से 30 दिन",
    weeds: [
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "कनकौआ", category: "broadleaf", scientific: "Commelina" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "combo", timingHi: "15 से 20 दिन · घास और चौड़ी पत्ती", technical: "Propaquizafop 2.5% + Imazethapyr 3.75% ME", brands: ["Shaked"], doseHi: "800 मिली प्रति एकड़" },
      { applicationType: "post", timingHi: "15 से 20 दिन · केवल घास", technical: "Quizalofop-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350 मिली प्रति एकड़" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "स्प्रे शाम को करो",
        pointsHi: [
          "शाम के समय डालो — तेज धूप या दोपहर का समय मत चुनो",
          "दोपहर की 40°C धूप में स्प्रे करने से उड़द की पत्तियाँ किनारों से जल सकती हैं",
        ],
      },
    ],
  },
  masoor: {
    criticalPeriodHi: "बुवाई के 30 से 50 दिन",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "प्याजी", category: "broadleaf" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "चटरी-मटरी", category: "broadleaf" },
      { localHi: "गुल्ली डंडा", category: "grass" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 0 से 2 दिन", technical: "Pendimethalin 30% EC", brands: ["Stomp"], doseHi: "1.0 लीटर प्रति एकड़", waterHi: "150 लीटर पानी" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "25 से 30 दिन · केवल संकरी पत्ती / घास", technical: "Quizalofop-p-ethyl 5% EC", doseHi: "300 मिली प्रति एकड़", targetsHi: ["केवल संकरी पत्ती / घास"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "मसूर — चने से भी अधिक नाजुक",
        pointsHi: [
          "खड़ी मसूर में बथुआ या प्याजी जैसे चौड़ी पत्ती वाले खरपतवार के लिए सुरक्षित दवा उपलब्ध नहीं",
          "खरपतवार ज्यादा हो तो 30 दिन पर खुरपी से हाथ से निराई — यही एकमात्र अचूक और सुरक्षित तरीका है",
        ],
      },
    ],
  },
  soybean: {
    criticalPeriodHi: "बुवाई के 15 से 45 दिन",
    weeds: [
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "कनकौआ / केना", category: "broadleaf", scientific: "Commelina benghalensis" },
      { localHi: "हजारदाना", category: "broadleaf" },
      { localHi: "छोटी दूधी", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "दीनानाथ घास", category: "grass" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद · 0 से 48 घंटे", technical: "Diclosulam 84% WDG", brands: ["Strongarm"], doseHi: "12.4 ग्राम प्रति एकड़", waterHi: "150 लीटर पानी", targetsHi: ["कनकौआ / केना", "सांठी"], noteHi: "उगने से पहले रोकता है — सोयाबीन के लिए भरोसेमंद विकल्प" },
    ],
    postEmergence: [
      { applicationType: "combo", timingHi: "बुवाई के 15 से 22 दिन · खरपतवार 2–4 पत्ती", technical: "Fomesafen 11.1% + Quizalofop-ethyl 5.5% EC", brands: ["Patela", "Saket"], doseHi: "400 मिली प्रति एकड़", waterHi: "150 लीटर" },
      { applicationType: "combo", timingHi: "बुवाई के 15 से 22 दिन · खरपतवार 2–4 पत्ती", technical: "Sodium acifluorfen 16.5% + Clodinafop-propargyl 8% EC", brands: ["Iris", "Fateh", "Vesta"], doseHi: "400 मिली प्रति एकड़" },
      { applicationType: "post", timingHi: "बुवाई के 15 से 22 दिन · खरपतवार 2–4 पत्ती", technical: "Imazethapyr 10% SL", brands: ["Pursuit"], doseHi: "350–400 मिली प्रति एकड़" },
      { applicationType: "post", timingHi: "केवल कनकौआ / केना की समस्या हो", technical: "Chlorimuron-ethyl 25% WP", brands: ["Cloben"], doseHi: "15 ग्राम प्रति एकड़", adjuvantHi: "Surfactant के साथ मिलाएँ", targetsHi: ["कनकौआ", "केना"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "20 दिन की लक्ष्मण रेखा",
        pointsHi: [
          "खरपतवार की दवा सबसे अच्छा बुवाई के 15 से 20 दिन के बीच डालो",
          "25 दिन के बाद सोयाबीन की पत्तियाँ खेत ढक लेती हैं · दवा नीचे खरपतवार तक नहीं पहुँचती · घास का नियंत्रण कम हो जाता है",
        ],
      },
      {
        titleHi: "कनकौआ / केना",
        pointsHi: [
          "कनकौआ 4 पत्ती से बड़ा हो जाए तो आम दवा का असर घट सकता है",
          "विकल्प: Strongarm (उगने से पहले), Patela",
        ],
      },
    ],
  },
  mustard: {
    criticalPeriodHi: "बुवाई के 20 से 40 दिन",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "सेन्जी", category: "broadleaf", scientific: "Melilotus" },
      { localHi: "प्याजी", category: "broadleaf" },
      { localHi: "पोहिला", category: "broadleaf" },
      { localHi: "ओरोबंकी / आज्ञा / रुखड़ी / मूंज", category: "parasitic", scientific: "Orobanche" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद", technical: "Pendimethalin 30% EC", brands: ["Stomp"], doseHi: "1.0 लीटर प्रति एकड़", waterHi: "150 लीटर पानी" },
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद", technical: "Oxadiargyl 6% EC", brands: ["Raft"], doseHi: "90 से 100 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "20 से 25 दिन · केवल घास", technical: "Quizalofop-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350 मिली प्रति एकड़", targetsHi: ["केवल घास"] },
      { applicationType: "post", timingHi: "पहला स्प्रे · बुवाई के 50–55 दिन · फूल आने से ठीक पहले", technical: "Glyphosate 41% SL", doseHi: "20 से 25 मिली प्रति एकड़", waterHi: "150 लीटर पानी", noteHi: "ओरोबंकी के लिए बहुत कम खुराक वाली विधि", warningHi: "खुराक एक बूंद भी ज्यादा न हो — ज्यादा खुराक से सरसों जल सकती है · यह कम खुराक ओरोबंकी की गाँठों को जड़ क्षेत्र में सुखाने के लिए है" },
      { applicationType: "post", timingHi: "दूसरा स्प्रे · बुवाई के 70–75 दिन", technical: "Glyphosate 41% SL", doseHi: "40 से 50 मिली प्रति एकड़", noteHi: "ओरोबंकी कम खुराक — दूसरा स्प्रे", warningHi: "खुराक एक बूंद भी ज्यादा नहीं होनी चाहिए" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "खड़ी सरसों में बथुआ",
        pointsHi: [
          "खड़ी सरसों में बथुआ के लिए चौड़ी पत्ती वाली दवा सुरक्षित नहीं",
          "2,4-D या Algrip से सरसों पूरी तरह खत्म हो सकती है",
          "बचाव: बुवाई के तुरंत बाद Pendimethalin डालो",
        ],
      },
    ],
  },
  moongfali: {
    criticalPeriodHi: "बुवाई के 20 से 45 दिन",
    weeds: [
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़" },
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद", technical: "Oxyfluorfen 23.5% EC", brands: ["Goal"], doseHi: "150 से 200 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "early_post", timingHi: "18 से 25 दिन", technical: "Propaquizafop 2.5% + Imazethapyr 3.75% ME", brands: ["Shaked"], doseHi: "800 मिली प्रति एकड़" },
      { applicationType: "early_post", timingHi: "18 से 25 दिन", technical: "Imazethapyr 10% SL", brands: ["Pursuit"], doseHi: "300 से 350 मिली प्रति एकड़", waterHi: "150 लीटर पानी प्रति एकड़" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "सूइयाँ जमीन में जाएँ तब स्प्रे बंद",
        pointsHi: [
          "35–40 दिन के बाद · पीले फूल झड़ें · सूइयाँ जमीन में जाएँ",
          "खेत में कोई स्प्रे मत करो · खुरपी मत चलाओ",
          "दवा का असर या पैरों की हलचल सूइयाँ तोड़ सकती है — फलियाँ नहीं बन सकतीं",
        ],
      },
    ],
  },
  tomato: {
    criticalPeriodHi: "रोपाई के 0 से 40 दिन",
    criticalNoteHi: "खासकर पहले 6 हफ्ते बहुत जरूरी हैं",
    weeds: [
      { localHi: "सांठी / पत्थरचट्टा", category: "broadleaf", scientific: "Trianthema portulacastrum" },
      { localHi: "जंगली चौलाई", category: "broadleaf", scientific: "Amaranthus spp." },
      { localHi: "मकोई", category: "broadleaf", scientific: "Solanum nigrum" },
      { localHi: "सांवा", category: "grass", scientific: "Echinochloa spp." },
      { localHi: "मकड़ा घास", category: "grass", scientific: "Dactyloctenium aegyptium" },
      { localHi: "नागरमोथा", category: "sedge", scientific: "Cyperus spp." },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "रोपाई से पहले · या रोपाई के 2–3 दिन बाद · 48 घंटे के भीतर", technical: "Pendimethalin 38.7% CS", brands: ["Stomp Xtra"], doseHi: "700 मिली प्रति एकड़", waterHi: "150–200 लीटर प्रति एकड़", fieldConditionHi: "खेत तैयार · मेड़ बनाओ · रोपाई से ठीक पहले स्प्रे करो · या 48 घंटे के भीतर" },
      { applicationType: "pre", timingHi: "रोपाई से पहले · या रोपाई के 2–3 दिन बाद", technical: "Pendimethalin 30% EC", brands: ["Stomp"], doseHi: "1.0 से 1.2 लीटर प्रति एकड़", waterHi: "150–200 लीटर प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "early_post", timingHi: "रोपाई के 15–20 दिन बाद", technical: "Metribuzin 70% WP", brands: ["Sencor","Tata Metri"], doseHi: "100 से 120 ग्राम प्रति एकड़", waterHi: "150 लीटर पानी", targetsHi: ["सांठी","चौलाई","छोटी घास"], fieldConditionHi: "पौधे की जड़ अच्छी तरह जम चुकी हो", warningHi: "अगर टमाटर का पौधा कमजोर या पीला हो — Sencor बिल्कुल मत डालो", noteHi: "खरपतवार को जलाकर खत्म करता है" },
      { applicationType: "post", timingHi: "25 से 35 दिन", technical: "Quizalofop-p-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350–400 मिली प्रति एकड़", targetsHi: ["केवल घास / संकरी पत्ती"], noteHi: "टमाटर पर पूरी तरह सुरक्षित · घास को जड़ से सुखा देता है" },
      { applicationType: "post", timingHi: "25 से 35 दिन", technical: "Propaquizafop 10% EC", brands: ["Agil"], doseHi: "250–300 मिली प्रति एकड़", targetsHi: ["केवल घास / संकरी पत्ती"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "मकोई",
        pointsHi: [
          "मकोई टमाटर-बैंगन परिवार का खरपतवार है",
          "ऐसी दवा नहीं जो मकोई मारे और टमाटर बचे — इसलिए हाथ से उखाड़ो",
          "मजदूर लगाकर खेत से मकोई निकालना ही सही उपाय है",
        ],
      },
      {
        titleHi: "फूल आने के बाद दवा न डालो",
        pointsHi: [
          "रोपाई के 40 दिन बाद फूल या छोटे फल आ जाएँ तो कोई खरपतवार की दवा मत डालो",
          "सावधान: फल टेढ़े-मेढ़े हो सकते हैं",
        ],
      },
    ],
  },
  chilli: {
    criticalPeriodHi: "रोपाई के 15 से 45 दिन",
    weeds: [
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "फूलिया", category: "broadleaf", scientific: "Digera" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "रोपाई से पहले · या तुरंत बाद · 0 से 3 दिन", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़" },
      { applicationType: "pre", timingHi: "रोपाई से 2 दिन पहले · मेड़ों पर स्प्रे", technical: "Oxyfluorfen 23.5% EC", brands: ["Goal", "Oxygold"], doseHi: "150 से 180 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "20 से 30 दिन · केवल घास", technical: "Fenoxaprop-p-ethyl 9.3% EC", brands: ["Whip Super"], doseHi: "250–300 मिली प्रति एकड़", targetsHi: ["घास / संकरी पत्ती वाले खरपतवार"] },
      { applicationType: "post", timingHi: "20 से 30 दिन · केवल घास", technical: "Quizalofop-p-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350–400 मिली प्रति एकड़", targetsHi: ["घास / संकरी पत्ती वाले खरपतवार"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "खड़ी मिर्च में चौड़ी पत्ती की दवा",
        pointsHi: [
          "खड़ी मिर्च में चौड़ी पत्ती वाली दवा को पत्तियों पर सीधे मत डालो",
          "दवा से मिर्च के पत्ते मुड़ सकते हैं — किसान इसे मरोड़िया या थ्रिप्स समझ सकता है",
          "असल में यह दवा से फसल जलना है",
        ],
      },
    ],
  },
  brinjal: {
    criticalPeriodHi: "रोपाई के 15 से 45 दिन",
    weeds: [
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "चौलाई", category: "broadleaf" },
      { localHi: "मकोई", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "दूब घास", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "रोपाई से पहले", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़", fieldConditionHi: "मेड़ों पर अच्छी नमी हो" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "घास नियंत्रण · खड़ी फसल में", technical: "Propaquizafop 10% EC", brands: ["Agil"], doseHi: "250–300 मिली प्रति एकड़", waterHi: "150 लीटर", targetsHi: ["घास वाले खरपतवार"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "कुदाल / मशीन से निराई",
        pointsHi: [
          "बैंगन की कतारों के बीच लगभग 3 फीट दूरी होती है",
          "30–35 दिन पर पौधे मजबूत हो जाएँ तो पावर वीडर, मिनी रोटावेटर या बैलों से गुड़ाई करो — दवा से ज्यादा असरदार",
          "फायदा: जड़ों में हवा लगती है · फसल की बढ़वार अच्छी · फल का आकार बढ़ता है",
        ],
      },
    ],
  },
  cauliflower: {
    criticalPeriodHi: "रोपाई के 15 से 40 दिन",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "रोपाई से पहले", technical: "Pendimethalin 30% EC", doseHi: "1.0 लीटर प्रति एकड़" },
      { applicationType: "pre", timingHi: "खेत तैयार · स्प्रे · 24 घंटे बाद रोपाई", technical: "Oxyfluorfen 23.5% EC", brands: ["Goal"], doseHi: "120 से 150 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "20 से 25 दिन · केवल घास", technical: "Quizalofop-p-ethyl 5% EC", doseHi: "350 मिली प्रति एकड़", targetsHi: ["घास वाले खरपतवार"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "फूल गोभी बनते समय स्प्रे बंद",
        pointsHi: [
          "40 दिन के बाद अंदर सफेद फूल गोभी का सिर बनना शुरू हो जाए तो कोई खरपतवार की दवा मत डालो",
          "दवा की गंध या बूँदों से सिर पीला या धब्बेदार हो सकता है — बाजार में भाव गिर जाता है",
        ],
      },
    ],
  },
  bhindi: {
    criticalPeriodHi: "बुवाई के 15 से 35 दिन",
    weeds: [
      { localHi: "सांठी / पत्थरचट्टा", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 24 से 48 घंटे में", technical: "Pendimethalin 38.7% CS", brands: ["Stomp Xtra"], doseHi: "700 मिली प्रति एकड़", waterHi: "150–200 लीटर पानी", noteHi: "भिंडी में उगने से पहले की दवा बहुत बड़ा काम करती है — भिंडी और खरपतवार लगभग एक साथ उगते हैं" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "18 से 25 दिन · केवल घास", technical: "Propaquizafop 10% EC", brands: ["Agil"], doseHi: "250–300 मिली प्रति एकड़" },
      { applicationType: "post", timingHi: "18 से 25 दिन · केवल घास", technical: "Quizalofop-ethyl 5% EC", brands: ["Targa Super"], doseHi: "350 मिली प्रति एकड़" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "चौड़ी पत्ती — खुरपी ही सुरक्षित",
        pointsHi: [
          "सांठी या चौलाई उग आएँ तो 20–22 दिन · पहली सिंचाई से ठीक पहले खुरपी से हाथ से निराई करो",
          "चौड़ी पत्ती वाली दवा से भिंडी का मुख्य तना कठोर या छोटा रह सकता है",
        ],
      },
    ],
  },
  cucumber: {
    criticalPeriodHi: "बुवाई के 15 से 35 दिन",
    weeds: [
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "चौलाई", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "क्यारियों की नालियों में · नमी में · बहुत कम खुराक", technical: "Pendimethalin 30% EC", doseHi: "600 से 700 मिली प्रति एकड़", fieldConditionHi: "बीज 2–3 सेमी गहराई पर हो", warningHi: "खीरा-ककड़ी परिवार दवा से जलने के प्रति बहुत नाजुक है — दवा का खतरा कम रखो" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "केवल घास पर · बेल पर सीधा स्प्रे मत करो", technical: "Quizalofop-p-ethyl 5% EC", doseHi: "300 मिली प्रति एकड़", fieldConditionHi: "केवल घास पर डालो", warningHi: "खीरे की बेल पर सीधा स्प्रे मत करो" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "सबसे अच्छा उपाय — मल्च",
        pointsHi: [
          "खीरे में खड़ी फसल में दवा का खतरा कम रखना ही बेहतर है",
          "क्यारी पर 25 माइक्रोन प्लास्टिक मल्च बिछाओ",
          "फायदा: खरपतवार लगभग खत्म · पानी आधा लगता है · फल मिट्टी से नहीं लगते / नहीं सड़ते · फल सीधा और चमकदार",
        ],
      },
    ],
  },
  onion: {
    criticalPeriodHi: "रोपाई के 15 से 60 दिन",
    criticalNoteHi: "पत्तियाँ सीधी और पतली होती हैं — खरपतवार को ज्यादा धूप मिलती है · खरपतवार तेजी से हावी हो सकते हैं",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "सेन्जी", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा", category: "grass" },
      { localHi: "दूब", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "रोपाई से पहले · या रोपाई के 0–3 दिन", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़" },
      { applicationType: "pre", timingHi: "रोपाई से पहले · या रोपाई के 0–3 दिन", technical: "Oxyfluorfen 23.5% EC", brands: ["Goal", "Oxygold"], doseHi: "150 से 180 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "early_post", timingHi: "रोपाई के 20 से 30 दिन बाद · खरपतवार 2–3 पत्ती", technical: "Propaquizafop 5% + Oxyfluorfen 12% w/w EC", brands: ["Dekel", "Shaked Onion"], doseHi: "350 से 400 मिली प्रति एकड़", waterHi: "150 लीटर पानी", nozzleHi: "Flat Fan", targetsHi: ["घास और चौड़ी पत्ती"] },
      { applicationType: "combo", timingHi: "किसान अक्सर टंकी में मिलाकर डालते हैं", technical: "Oxyfluorfen 23.5% EC + Quizalofop 5% EC", brands: ["Goal", "Targa Super"], doseHi: "Oxyfluorfen 100 मिली + Quizalofop 350 मिली प्रति एकड़", noteHi: "किसान अपनी टंकी में मिलाकर बनाते हैं — खेत में दर्ज तरीका" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "ओस / बारिश के बाद स्प्रे न करो",
        pointsHi: [
          "सुबह ओस या बारिश के तुरंत बाद स्प्रे मत करो",
          "प्याज की पत्तियों पर प्राकृतिक चिकनाई होती है — ओस में स्प्रे से दवा अंदर घुस जाती है · पत्तियाँ जलकर सफेद हो जाती हैं",
          "स्प्रे दोपहर 12 बजे के बाद करो · पत्तियाँ पूरी तरह सूख जाएँ",
        ],
      },
      {
        titleHi: "गाँठ बनते समय Goal मत डालो",
        pointsHi: [
          "60 दिन के बाद प्याज नीचे गाँठ बनाना शुरू करे तो Oxyfluorfen / Goal का स्प्रे मत करो",
        ],
      },
    ],
  },
  garlic: {
    criticalPeriodHi: "बुवाई के 15 से 60 दिन",
    weeds: [
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "प्याजी", category: "broadleaf" },
      { localHi: "कृष्णनील", category: "broadleaf" },
      { localHi: "चौलाई", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के 48 घंटे के भीतर", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़" },
    ],
    postEmergence: [
      { applicationType: "post", timingHi: "25 से 35 दिन", technical: "Propaquizafop 5% + Oxyfluorfen 12% EC", brands: ["Dekel"], doseHi: "350–400 मिली प्रति एकड़" },
      { applicationType: "combo", timingHi: "25 से 35 दिन · टंकी में मिलाकर", technical: "Oxyfluorfen 23.5% EC + Quizalofop-ethyl", brands: ["Goal", "Targa Super"], doseHi: "Oxyfluorfen 100 मिली + Quizalofop 350 मिली प्रति एकड़" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "लंबी फसल — 55–60 दिन पर हाथ से निराई",
        pointsHi: [
          "लहसुन लगभग 5 महीने की लंबी फसल है",
          "25–30 दिन पर दवा हो चुकी हो तो 55–60 दिन पर खाद के साथ हल्की हाथ से निराई जरूर करवाओ",
          "फायदा: मिट्टी ढीली होती है · लहसुन की कलियाँ मोटी बनती हैं",
        ],
      },
    ],
  },
  ginger: {
    criticalPeriodHi: "बुवाई के 30 से 90 दिन",
    criticalNoteHi: "जमीन से बाहर निकलने में लगभग 30–40 दिन लग सकते हैं",
    weeds: [
      { localHi: "कनकौआ", category: "broadleaf", scientific: "Commelina" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "मोथा", category: "sedge" },
      { localHi: "बारहमासी घासें", category: "grass" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद · मल्च बिछाने से पहले", technical: "Atrazine 50% WP", brands: ["Atrataf"], doseHi: "500 ग्राम प्रति एकड़" },
      { applicationType: "pre", timingHi: "बुवाई के तुरंत बाद · मल्च से पहले", technical: "Pendimethalin 30% EC", doseHi: "1.0 लीटर प्रति एकड़", waterHi: "200 लीटर पानी" },
    ],
    postEmergence: [
      { applicationType: "early_post", timingHi: "20 से 25 दिन · घास निकली हो · अदरक अभी बाहर न आया हो", technical: "Paraquat dichloride 24% SL", brands: ["Gramoxone"], doseHi: "500 मिली प्रति एकड़", noteHi: "ऊपर की सारी घास जला देता है — नीचे अदरक की गाँठ को नुकसान नहीं" },
      { applicationType: "post", timingHi: "अदरक निकलने के बाद · केवल घास", technical: "Quizalofop-p-ethyl 5% EC", brands: ["Targa Super"], doseHi: "400 मिली प्रति एकड़", targetsHi: ["केवल घास वाले खरपतवार"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "पत्तों / पुआल की मल्च",
        pointsHi: [
          "बुवाई के तुरंत बाद 4–5 टन प्रति एकड़ हरी पत्तियाँ या पुआल बिछाओ",
          "मल्च धूप को खरपतवार के छोटे पौधों तक पहुँचने से रोकती है · खरपतवार दबाती है · गाँठ सड़ने से बचाव",
          "लगभग 80% खरपतवार दब सकते हैं",
        ],
      },
    ],
  },
  mango: {
    criticalPeriodHi: "नए पेड़ (1–4 साल): थाला सालभर खरपतवार-मुक्त रखो · पुराने पेड़ (5+): सितंबर–अक्टूबर मानसून के बाद + दिसंबर–जनवरी बौर से पहले",
    weeds: [
      { localHi: "दूब घास", category: "grass", scientific: "Cynodon dactylon" },
      { localHi: "कास", category: "grass", scientific: "Saccharum spontaneum" },
      { localHi: "नागरमोथा", category: "sedge" },
      { localHi: "गाजर घास / कांग्रेस घास", category: "shrub", scientific: "Parthenium" },
      { localHi: "लेंटाना / झुरमुट", category: "shrub", scientific: "Lantana camara" },
      { localHi: "लटजीरा / चिरचिटा", category: "shrub", scientific: "Achyranthes" },
      { localHi: "मकोई", category: "broadleaf" },
    ],
    preEmergence: [],
    postEmergence: [
      { applicationType: "directed", timingHi: "जड़ तक जाने वाली · थाले / कतारों के बीच निर्देशित · खरपतवार हरा 4–6 इंच", technical: "Glyphosate 41% SL", brands: ["Roundup", "Glycel"], doseHi: "1.0 से 1.25 लीटर प्रति एकड़ (या 10–12 मिली प्रति लीटर पानी)", targetsHi: ["दूब", "कास", "मोथा", "गाजर घास"], fieldConditionHi: "सूखी/धूल भरी पत्तियों पर असर नहीं · जड़ से सड़ाकर खत्म करता है", noteHi: "जिद्दी / साल-भर वाले खरपतवार" },
      { applicationType: "directed", timingHi: "जड़ तक जाने वाली · दानेदार", technical: "Glyphosate 71% SG", doseHi: "100 ग्राम पाउच प्रति 15-लीटर टंकी", targetsHi: ["साल-भर वाले खरपतवार"], noteHi: "Ammonium salt दानेदार फॉर्मूलेशन" },
      { applicationType: "directed", timingHi: "छूने वाली · कट नोजल · ऊपर की पत्तियाँ जलाना", technical: "Paraquat dichloride 24% SL", brands: ["Gramoxone"], doseHi: "500 से 600 मिली प्रति एकड़", waterHi: "150 लीटर पानी", nozzleHi: "Cut nozzle", noteHi: "लगभग 24 घंटे में खरपतवार जलकर सूख जाता है · जड़ों को नुकसान नहीं" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "नए आम के पेड़ पर Glyphosate खतरा",
        pointsHi: [
          "1–3 साल के आम का मुख्य तना हरा और कोमल होता है",
          "Glyphosate थोड़ी-सी भी हरे तने पर लगे तो जड़ तक पहुँच जाती है — 15–20 दिन में पूरा पेड़ सूख सकता है",
        ],
      },
      {
        titleHi: "नए पेड़ के थाले की सुरक्षित सफाई",
        pointsHi: [
          "तना के चारों तरफ 3 फीट थाला खरपतवार-मुक्त रखो",
          "खुरपी से हाथ से निराई · धान की पराली की मल्च · सूखे पत्तों की मल्च",
        ],
      },
      {
        titleHi: "बौर खिलते समय स्प्रे बंद (फरवरी–मार्च)",
        pointsHi: [
          "आम में बौर खिला हो — कोई भी खरपतवार की दवा मत डालो",
          "दवा की गंध से मधुमक्खी और मक्खी जैसे परागण वाले कीट भाग सकते हैं → परागण और फल लगना कम हो जाता है",
        ],
      },
    ],
  },
  banana: {
    criticalPeriodHi: "रोपाई के पहले 4 से 5 महीने (0 से 150 दिन)",
    criticalNoteHi: "उथली जड़ें ऊपरी 15–20 सेमी में होती हैं — लगभग 40% खाद और पानी खरपतवार चुरा लेते हैं",
    weeds: [
      { localHi: "सांवा", category: "grass" },
      { localHi: "मकड़ा घास", category: "grass" },
      { localHi: "दूब", category: "grass" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "कनकौआ", category: "broadleaf", scientific: "Commelina" },
      { localHi: "जंगली चौलाई", category: "broadleaf" },
      { localHi: "बिषखपरा", category: "broadleaf" },
      { localHi: "नागरमोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "रोपाई के तुरंत बाद · 0 से 3 दिन", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़" },
      { applicationType: "pre", timingHi: "रोपाई के तुरंत बाद · 0 से 3 दिन · नम मिट्टी · खुली जमीन", technical: "Diuron 80% WP", brands: ["Karmex"], doseHi: "400 से 500 ग्राम प्रति एकड़", fieldConditionHi: "खेत में नमी · रोपाई के बाद खुली जमीन पर स्प्रे" },
    ],
    postEmergence: [
      { applicationType: "directed", timingHi: "30 से 90 दिन · कतारों के बीच · ढक्कन लगाकर", technical: "Glufosinate-ammonium 13.5% SL", brands: ["Basta", "Sweep"], doseHi: "750 से 1000 मिली प्रति एकड़", waterHi: "150 लीटर पानी", fieldConditionHi: "सुरक्षा ढक्कन लगाओ — Glyphosate से लगभग 10 गुना सुरक्षित · जमीन के नीचे की जड़ों को नुकसान नहीं" },
      { applicationType: "post", timingHi: "केवल घास · चुनिंदा दवा", technical: "Quizalofop-p-ethyl 5% EC", brands: ["Targa Super"], doseHi: "400 मिली प्रति एकड़", noteHi: "गलती से केले की पत्तियों पर बूँद गिरे तो भी फसल सुरक्षित" },
    ],
    fieldDoctorTips: [
      {
        titleHi: "केले में Glyphosate मत डालो",
        pointsHi: [
          "केले में Glyphosate / Roundup कभी मत लगाओ",
          "तना पानी से भरा होता है — Glyphosate निचले तने, पुत्तियों से जड़ तक पहुँच जाती है",
          "लक्षण: नई पत्तियाँ फीते जैसी पतली/मुड़ी · दिल सड़ना · पत्ती टेढ़ी · घार नहीं निकलना",
        ],
      },
      {
        titleHi: "जीवित मल्च (लोबिया / सनई)",
        pointsHi: [
          "दो कतारों के बीच रोपाई के तुरंत बाद लोबिया / चवला / सनई बोओ",
          "लगभग 45 दिन: लोबिया खेत ढक लेती है · खरपतवार दबते हैं",
          "लगभग 50 दिन: लोबिया काटकर वहीं बिछा दो — खरपतवार दबना · हरी खाद · मिट्टी ढकना · सस्ता उपाय",
        ],
      },
    ],
  },
  grapes: {
    criticalPeriodHi: "अक्टूबर छंटाई से जनवरी बेरियों के विकास तक",
    criticalNoteHi: "खरपतवार से नमी बढ़ती है → केवड़ा / डाउनी मिल्ड्यू · थ्रिप्स का हमला लगभग 3 गुना",
    weeds: [
      { localHi: "दूब घास", category: "grass" },
      { localHi: "सांवा", category: "grass" },
      { localHi: "सांठी", category: "broadleaf" },
      { localHi: "बथुआ", category: "broadleaf" },
      { localHi: "गाजर घास", category: "shrub" },
      { localHi: "नागरमोथा", category: "sedge" },
    ],
    preEmergence: [
      { applicationType: "pre", timingHi: "छंटाई के तुरंत बाद · अक्टूबर", technical: "Oxyfluorfen 23.5% EC", brands: ["Goal"], doseHi: "150 से 200 मिली प्रति एकड़", fieldConditionHi: "मंडप / तारों के नीचे की जमीन" },
      { applicationType: "pre", timingHi: "छंटाई के तुरंत बाद", technical: "Pendimethalin 38.7% CS", doseHi: "700 मिली प्रति एकड़", fieldConditionHi: "अंगूर मंडप / तारों के नीचे" },
    ],
    postEmergence: [
      { applicationType: "directed", timingHi: "कतारों के बीच · ढक्कन लगाकर निर्देशित स्प्रे", technical: "Glufosinate-ammonium 13.5% SL", brands: ["Basta"], doseHi: "800 से 1000 मिली प्रति एकड़", waterHi: "150 लीटर", targetsHi: ["मौसमी घास", "चौड़ी पत्ती वाले खरपतवार"] },
      { applicationType: "post", timingHi: "संकरी पत्ती / घास", technical: "Quizalofop-p-ethyl 5% EC", doseHi: "350 मिली प्रति एकड़", targetsHi: ["संकरी पत्ती वाले खरपतवार / घास"] },
    ],
    fieldDoctorTips: [
      {
        titleHi: "अंगूर के पास 2,4-D खतरा",
        pointsHi: [
          "अंगूर बहुत नाजुक है — 1 किलोमीटर दूर 2,4-D की भाप उड़कर भी पत्तियाँ पंखे जैसी हो सकती हैं · बेल को नुकसान",
          "2 साल तक फल आना प्रभावित हो सकता है",
          "अलर्ट: अंगूर के पास कभी मत डालो",
        ],
      },
      {
        titleHi: "छंटाई के घाव पर दवा न डालो",
        pointsHi: [
          "छंटाई के बाद तने पर ताज़ा कट / खुले घाव होते हैं — कोई जड़ तक जाने वाली खरपतवार की दवा मत डालो",
          "दवा घावों से अंदर जा सकती है · बेल सूख सकती है",
        ],
      },
    ],
  },
};

export function getCropWeedFieldGuide(slug: string): CropWeedFieldGuide | null {
  const key =
    WEED_FIELD_GUIDE_ALIASES[slug.trim().toLowerCase()] ?? slug.trim().toLowerCase();
  return WEED_FIELD_GUIDES[key] ?? null;
}

export function weedCategoryLabelHi(cat: WeedLeafCategory): string {
  switch (cat) {
    case "grass":
      return "संकरी पत्ती (घास)";
    case "broadleaf":
      return "चौड़ी पत्ती";
    case "sedge":
      return "मोथा";
    case "parasitic":
      return "परजीवी खरपतवार";
    case "shrub":
      return "झाड़ी / आक्रामक";
    default:
      return "खरपतवार";
  }
}
