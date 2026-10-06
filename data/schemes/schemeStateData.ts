/**
 * State-specific scheme applicability, portal directory, eligibility exclusions,
 * and step-by-step application blueprints for Indian farmers.
 */

export interface StatePortalInfo {
  stateEn: string;
  stateHi: string;
  deptNameHi: string;
  portalName: string;
  portalUrl: string;
  helpline: string;
}

export const INDIAN_STATES_SCHEME_META: Record<string, StatePortalInfo> = {
  "Uttar Pradesh": {
    stateEn: "Uttar Pradesh",
    stateHi: "उत्तर प्रदेश",
    deptNameHi: "कृषि विभाग, उत्तर प्रदेश सरकार",
    portalName: "पारदर्शी किसान सेवा पोर्टल (UP Agriculture)",
    portalUrl: "https://upagriculture.com",
    helpline: "1800-180-1551 / 0522-2204555",
  },
  "Madhya Pradesh": {
    stateEn: "Madhya Pradesh",
    stateHi: "मध्य प्रदेश",
    deptNameHi: "किसान कल्याण एवं कृषि विकास विभाग, MP",
    portalName: "MP ई-कृषि अनुदान / सारा पोर्टल",
    portalUrl: "https://dbt.mpdage.org",
    helpline: "181 / 1800-180-1551",
  },
  Rajasthan: {
    stateEn: "Rajasthan",
    stateHi: "राजस्थान",
    deptNameHi: "कृषि एवं उद्यानिकी विभाग, राजस्थान सरकार",
    portalName: "राज किसान साथी पोर्टल (RajKisan)",
    portalUrl: "https://rajkisan.rajasthan.gov.in",
    helpline: "181 / 1800-180-1551",
  },
  Bihar: {
    stateEn: "Bihar",
    stateHi: "बिहार",
    deptNameHi: "प्रत्यक्ष लाभ अंतरण, कृषि विभाग, बिहार",
    portalName: "DBT एग्रीकल्चर बिहार",
    portalUrl: "https://dbtagriculture.bihar.gov.in",
    helpline: "1800-180-1551 / 0612-2233555",
  },
  Haryana: {
    stateEn: "Haryana",
    stateHi: "हरियाणा",
    deptNameHi: "कृषि एवं किसान कल्याण विभाग, हरियाणा",
    portalName: "मेरी फसल मेरा ब्योरा (MFMB)",
    portalUrl: "https://fasal.haryana.gov.in",
    helpline: "1800-180-2117 / 1800-180-1551",
  },
  Punjab: {
    stateEn: "Punjab",
    stateHi: "पंजाब",
    deptNameHi: "Department of Agriculture, Punjab",
    portalName: "पंजाब एग्री मशीनरी पोर्टल",
    portalUrl: "https://agrimachinerypb.com",
    helpline: "1800-180-1551",
  },
  Maharashtra: {
    stateEn: "Maharashtra",
    stateHi: "महाराष्ट्र",
    deptNameHi: "कृषी विभाग, महाराष्ट्र शासन",
    portalName: "महाडीबीटी शेतकरी योजना (MahaDBT)",
    portalUrl: "https://mahadbt.maharashtra.gov.in",
    helpline: "1800-120-8040 / 1800-180-1551",
  },
  Chhattisgarh: {
    stateEn: "Chhattisgarh",
    stateHi: "छत्तीसगढ़",
    deptNameHi: "कृषि विकास एवं किसान कल्याण विभाग, CG",
    portalName: "राजीव गांधी किसान न्याय पोर्टल",
    portalUrl: "https://kisan.cg.nic.in",
    helpline: "1800-180-1551",
  },
  Gujarat: {
    stateEn: "Gujarat",
    stateHi: "गुजरात",
    deptNameHi: "ખેતીવાડી ખાતું, ગુજરાત સરકાર",
    portalName: "आई-खेडूत पोर्टल (i-Khedut)",
    portalUrl: "https://ikhedut.gujarat.gov.in",
    helpline: "1800-180-1551",
  },
  Jharkhand: {
    stateEn: "Jharkhand",
    stateHi: "झारखंड",
    deptNameHi: "कृषि, पशुपालन एवं सहकारिता विभाग, झारखंड",
    portalName: "झारखंड कृषि पोर्टल",
    portalUrl: "https://krishi.jharkhand.gov.in",
    helpline: "1800-180-1551",
  },
  Uttarakhand: {
    stateEn: "Uttarakhand",
    stateHi: "उत्तराखंड",
    deptNameHi: "कृषि विभाग, उत्तराखंड सरकार",
    portalName: "उत्तराखंड कृषि पोर्टल",
    portalUrl: "https://agriculture.uk.gov.in",
    helpline: "1800-180-1551",
  },
  "West Bengal": {
    stateEn: "West Bengal",
    stateHi: "पश्चिम बंगाल",
    deptNameHi: "Department of Agriculture, West Bengal",
    portalName: "कृषक बंधु पोर्टल (Krishak Bandhu)",
    portalUrl: "https://krishakbandhu.wb.gov.in",
    helpline: "1800-180-1551",
  },
  Telangana: {
    stateEn: "Telangana",
    stateHi: "तेलंगाना",
    deptNameHi: "Agriculture Department, Telangana",
    portalName: "रायथु बंधु पोर्टल",
    portalUrl: "https://rythubandhu.telangana.gov.in",
    helpline: "1800-180-1551",
  },
  "Andhra Pradesh": {
    stateEn: "Andhra Pradesh",
    stateHi: "आंध्र प्रदेश",
    deptNameHi: "Agriculture & Farmers Welfare, AP",
    portalName: "YSR रयथु भरोसा पोर्टल",
    portalUrl: "https://ysrrythubharosa.ap.gov.in",
    helpline: "1800-180-1551",
  },
  Karnataka: {
    stateEn: "Karnataka",
    stateHi: "कर्नाटक",
    deptNameHi: "Department of Agriculture, Karnataka",
    portalName: "फ्रूट्स पोर्टल (FRUITS Karnataka)",
    portalUrl: "https://fruits.karnataka.gov.in",
    helpline: "1800-180-1551",
  },
  "Tamil Nadu": {
    stateEn: "Tamil Nadu",
    stateHi: "तमिलनाडु",
    deptNameHi: "Department of Agriculture, Tamil Nadu",
    portalName: "उझावन पोर्टल (Uzhavan App/Portal)",
    portalUrl: "https://tnhorticulture.tn.gov.in",
    helpline: "1800-180-1551",
  },
  Odisha: {
    stateEn: "Odisha",
    stateHi: "ओडिशा",
    deptNameHi: "Agriculture & Farmers' Empowerment, Odisha",
    portalName: "कालिया पोर्टल (KALIA Portal)",
    portalUrl: "https://kalia.odisha.gov.in",
    helpline: "1800-180-1551",
  },
  "Himachal Pradesh": {
    stateEn: "Himachal Pradesh",
    stateHi: "हिमाचल प्रदेश",
    deptNameHi: "कृषि विभाग, हिमाचल प्रदेश सरकार",
    portalName: "HP कृषि पोर्टल",
    portalUrl: "https://hpagriculture.com",
    helpline: "1800-180-1551",
  },
  Assam: {
    stateEn: "Assam",
    stateHi: "असम",
    deptNameHi: "Department of Agriculture, Assam",
    portalName: "असम कृषि पोर्टल",
    portalUrl: "https://diragri.assam.gov.in",
    helpline: "1800-180-1551",
  },
  "Jammu and Kashmir": {
    stateEn: "Jammu and Kashmir",
    stateHi: "जम्मू और कश्मीर",
    deptNameHi: "Department of Agriculture, J&K",
    portalName: "J&K किसान पोर्टल",
    portalUrl: "https://jkhorticulture.nic.in",
    helpline: "1800-180-1551",
  },
};

export interface SchemeStepGuide {
  step: number;
  titleHi: string;
  descHi: string;
  badge?: string;
}

export interface SchemeDetailStateInfo {
  applicableStates: "all" | string[];
  windowStatus: "open" | "seasonal" | "quota" | "closed";
  applicationWindowHi: string;
  disbursementTypeHi: string;
  helplineNumber: string;
  ineligibilityHi: string[];
  quickQuiz: Array<{ questionHi: string; mustBeYes: boolean; failHintHi: string }>;
  onlineSteps: SchemeStepGuide[];
  offlineSteps: SchemeStepGuide[];
  stateSpecificNotes?: Record<string, string>;
}

export const SCHEME_STATE_DETAILS: Record<string, SchemeDetailStateInfo> = {
  "pm-kisan": {
    applicableStates: "all",
    windowStatus: "open",
    applicationWindowHi: "आवेदन 24×7 चालू है — कभी भी पंजीकरण कर सकते हैं",
    disbursementTypeHi: "DBT द्वारा सीधे आधार-लिंक्ड बैंक खाते में (₹2,000 की 3 किस्तों में)",
    helplineNumber: "155261 / 1800-115-526",
    ineligibilityHi: [
      "संविधानिक पदों (सांसद, विधायक, महापौर आदि) पर रहे व्यक्ति।",
      "केंद्र या राज्य सरकार के सेवारत या सेवानिवृत्त अधिकारी / कर्मचारी (मल्टी टास्किंग/ग्रुप-डी छोड़कर)।",
      "पिछले मूल्यांकन वर्ष में आयकर (Income Tax) का भुगतान करने वाले व्यक्ति।",
      "₹10,000 या अधिक की मासिक पेंशन प्राप्त करने वाले सेवानिवृत्त पेंशनभोगी।",
      "पंजीकृत पेशेवर जैसे डॉक्टर, इंजीनियर, वकील, चार्टर्ड अकाउंटेंट (CA) और वास्तुकार।",
      "संस्थागत भूमिधारक (कंपनियां, ट्रस्ट आदि के नाम दर्ज जमीन)।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके या आपके परिवार के नाम वैध कृषि भूमि की खतौनी दर्ज है?",
        mustBeYes: true,
        failHintHi: "PM-Kisan के लिए आवेदक के नाम पर खेती योग्य भूमि का भूलेख रिकॉर्ड होना अनिवार्य है।",
      },
      {
        questionHi: "क्या आपके बैंक खाते में आधार लिंक (Aadhaar Seeding / NPCI) है?",
        mustBeYes: true,
        failHintHi: "किस्त सीधे आधार-लिंक्ड बैंक खाते (Aadhaar NPCI) में भेजी जाती है। अपनी बैंक शाखा से आधार सीडिंग करवाएँ।",
      },
      {
        questionHi: "क्या परिवार में कोई सदस्य सरकारी नौकरी या आयकर (Income Tax) दाता नहीं है?",
        mustBeYes: true,
        failHintHi: "सरकारी नौकरी या आयकरदाता किसान परिवार PM-Kisan योजना के अंतर्गत अपात्र माने जाते हैं।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "आधिकारिक पोर्टल खोलें",
        descHi: "pmkisan.gov.in खोलें और 'Farmers Corner' में जाकर 'New Farmer Registration' पर क्लिक करें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "आधार व मोबाइल OTP सत्यापन",
        descHi: "Rural (ग्रामीण) या Urban (शहरी) किसान चुनें, आधार नंबर, मोबाइल नंबर और अपना राज्य चुनकर 'Send OTP' पर क्लिक करें।",
        badge: "e-KYC",
      },
      {
        step: 3,
        titleHi: "भूमि व बैंक विवरण भरें",
        descHi: "जिला, तहसील, गाँव, खतौनी खाता संख्या, खसरा संख्या, कुल रकबा (हेक्टेयर में) और बैंक IFSC कोड दर्ज करें।",
        badge: "दस्तावेज़",
      },
      {
        step: 4,
        titleHi: "आवेदन सबमिट करें व पक्की रसीद लें",
        descHi: "खतौनी की PDF कॉपी अपलोड करें और Save करें। अपना Registration Number (आवेदन क्रमांक) सुरक्षित नोट कर लें।",
        badge: "पूर्ण",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "कागज़ात तैयार करें",
        descHi: "आधार कार्ड, बैंक पासबुक और चालू वर्ष की खतौनी की साफ़ फोटोकॉपी साथ रखें।",
      },
      {
        step: 2,
        titleHi: "नजदीकी CSC केंद्र जाएँ",
        descHi: "गाँव के किसी भी जन सेवा केंद्र (CSC) पर संचालक को बताएं कि आपको PM-Kisan नया पंजीकरण कराना है।",
      },
      {
        step: 3,
        titleHi: "बायोमेट्रिक फिंगरप्रिंट e-KYC",
        descHi: "यदि आधार से मोबाइल लिंक नहीं है, तो CSC पर फिंगरप्रिंट (अंगूठा) लगाकर बायोमेट्रिक e-KYC पूरा करवाएँ।",
      },
      {
        step: 4,
        titleHi: "कंप्यूटराइज्ड रसीद प्राप्त करें",
        descHi: "आवेदन पूरा होने पर संचालक से पक्की कंप्यूटर रसीद (Acknowledgement Receipt) लें और स्थानीय लेखपाल/पटवारी से सत्यापन कराएं।",
      },
    ],
    stateSpecificNotes: {
      "Uttar Pradesh": "उत्तर प्रदेश के किसान upagriculture.com पर भी किसान पंजीकरण संख्या चेक कर सकते हैं।",
      "Madhya Pradesh": "MP के पात्र किसानों को राज्य की 'मुख्यमंत्री किसान कल्याण योजना' के ₹6,000 भी अतिरिक्त मिलते हैं।",
      Bihar: "बिहार के किसान dbtagriculture.bihar.gov.in पर अपना 13 अंकों का किसान पंजीकरण जोड़ सकते हैं।",
      Rajasthan: "राजस्थान के किसान ई-मित्र (E-Mitra) या राज किसान साथी पोर्टल के जरिए भी सहायता ले सकते हैं।",
    },
  },

  kcc: {
    applicableStates: "all",
    windowStatus: "open",
    applicationWindowHi: "वर्ष भर किसी भी कार्यदिवस पर बैंक शाखा या पोर्टल पर आवेदन खुला है",
    disbursementTypeHi: "सस्ता चक्रीय फसल ऋण (समय पर भुगतान पर मात्र 4% प्रभावी वार्षिक ब्याज)",
    helplineNumber: "1800-180-1551 (Kisan Call Centre)",
    ineligibilityHi: [
      "पूर्व में किसी अन्य बैंक के कृषि ऋण में जानबूझकर डिफॉल्टर (Willful Defaulter) घोषित आवेदक।",
      "विवादित या फर्जी भूलेख/खतौनी प्रस्तुत करने पर।",
      "बिना वैध पहचान प्रमाण पत्र वाले आवेदक।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके पास कृषि भूमि, पट्टेदारी या पशुपालन/मत्स्य पालन की गतिविधि है?",
        mustBeYes: true,
        failHintHi: "KCC का लाभ फसल उत्पादन, पशुपालन, डेयरी या मत्स्य पालन कार्यशील पूंजी के लिए दिया जाता है।",
      },
      {
        questionHi: "क्या आपका किसी बैंक में पहले से कोई एनपीए (NPA) या डिफॉल्ट ऋण नहीं है?",
        mustBeYes: true,
        failHintHi: "स्वच्छ क्रेडिट रिकॉर्ड वाले किसानों को बैंक बिना रुकावट 14 दिनों के अंदर KCC स्वीकृत करते हैं।",
      },
      {
        questionHi: "क्या आपके पास खतौनी और बैंक पासबुक मौजूद है?",
        mustBeYes: true,
        failHintHi: "ऋण सीमा तय करने के लिए भूमि का रकबा और बैंक पासबुक आवश्यक दस्तावेज़ हैं।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "JanSamarth या बैंक पोर्टल खोलें",
        descHi: "jansamarth.in पोर्टल पर जाएँ और 'Agri Kisan Credit Card' विकल्प चुनें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "पात्रता व लिमिट जांचें",
        descHi: "मोबाइल नंबर, आधार व खेती का रकबा दर्ज करें। सिस्टम आपकी अनुमानित KCC ऋण सीमा दिखाएगा।",
        badge: "कैलकुलेटर",
      },
      {
        step: 3,
        titleHi: "बैंक शाखा चुनें",
        descHi: "अपनी नजदीकी बैंक शाखा (जहाँ आपका बचत खाता है) का चयन करें और डिजिटल फॉर्म सबमिट करें।",
        badge: "शाखा चयन",
      },
      {
        step: 4,
        titleHi: "शाखा से KCC कार्ड लें",
        descHi: "शाखा द्वारा 14 दिनों में दस्तावेज़ जांच कर लिमिट स्वीकृत की जाएगी और KCC रुपे कार्ड जारी होगा।",
        badge: "कार्ड स्वीकृति",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "सरल KCC फॉर्म भरें",
        descHi: "अपनी नजदीकी बैंक शाखा (SBI, PNB, BoB, ग्रामीण बैंक या को-ऑपरेटिव बैंक) से 1 पेज का KCC फॉर्म लें।",
      },
      {
        step: 2,
        titleHi: "दस्तावेज़ संलग्न करें",
        descHi: "आधार कार्ड, खतौनी की नकल, 2 पासपोर्ट फोटो और नो-ड्यूज स्व-घोषणा पत्र संलग्न करें।",
      },
      {
        step: 3,
        titleHi: "शाखा प्रबंधक को जमा करें",
        descHi: "शाखा में फॉर्म जमा कर पक्की मुहर लगी पर्ची लें। ₹1.60 लाख तक के KCC के लिए कोई जमीन बंधक (Collateral) नहीं लगती।",
      },
      {
        step: 4,
        titleHi: "KCC कार्ड व ऋण निकासी",
        descHi: "बैंक से KCC RuPay कार्ड प्राप्त करें और ATM या खाद-बीज की दुकान पर स्वाइप कर सस्ते ब्याज पर उपयोग करें।",
      },
    ],
  },

  "pm-kusum": {
    applicableStates: "all",
    windowStatus: "quota",
    applicationWindowHi: "राज्य अक्षय ऊर्जा विभाग द्वारा समय-समय पर टोकन व कोटा जारी होता है",
    disbursementTypeHi: "60% तक भारी सरकारी सब्सिडी (30% केंद्र + 30% राज्य, किसान अंश केवल 10%)",
    helplineNumber: "1800-180-3333 / 1800-180-1551",
    ineligibilityHi: [
      "जिनके पास सिंचाई के लिए पानी का कोई स्रोत (बोरवेल, कुआं, तालाब, नहर) उपलब्ध न हो।",
      "पूर्व में सरकारी सब्सिडी पर सोलर पंप प्राप्त कर चुके आवेदक।",
      "गैर-कृषि भूमि वाले आवेदक।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके खेत पर बोरिंग, कुआं या जल स्रोत उपलब्ध है?",
        mustBeYes: true,
        failHintHi: "सोलर पंप लगाने के लिए खेत में चालू बोरिंग या पर्याप्त जल स्रोत होना अनिवार्य शर्त है।",
      },
      {
        questionHi: "क्या आप सोलर पंप का किसान अंश (10% से 40%) वहन करने के लिए तैयार हैं?",
        mustBeYes: true,
        failHintHi: "सरकार 60% सब्सिडी देती है, शेष राशि किसान स्वयं या बैंक लोन के माध्यम से जमा करते हैं।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "राज्य सोलर पोर्टल खोलें",
        descHi: "अपने राज्य के रिन्यूएबल पोर्टल (जैसे UPNEDA, RajKisan, HAREDA, MEDA) या pmkusum.mnre.gov.in पर जाएँ।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "सोलर पंप क्षमता चुनें",
        descHi: "जल स्तर के अनुसार 2 HP, 3 HP, 5 HP या 7.5 HP (Surface या Submersible) पंप का चयन करें।",
        badge: "पंप चयन",
      },
      {
        step: 3,
        titleHi: "टोकन बुकिंग व टोकन मनी",
        descHi: "खतौनी, आधार और बोरिंग गहराई का विवरण भरें और ऑनलाइन टोकन मनी (₹5,000) जमा करें।",
        badge: "टोकन",
      },
      {
        step: 4,
        titleHi: "साइट सत्यापन व इंस्टालेशन",
        descHi: "विभागीय टीम खेत का निरीक्षण करेगी, जिसके बाद अधिकृत कंपनी 15-30 दिनों में पंप लगाएगी।",
        badge: "इंस्टालेशन",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "जिला नेडा / कृषि कार्यालय संपर्क",
        descHi: "अपने जिले के मुख्य विकास अधिकारी (CDO) परिसर या नेडा (NEDA/RECL) कार्यालय जाएँ।",
      },
      {
        step: 2,
        titleHi: "कोटा व वेंडर सूची प्राप्त करें",
        descHi: "जिले में चल रहे सोलर पंप कोटे और सरकार द्वारा सूचीबद्ध वेंडर कंपनियों की सूची प्राप्त करें।",
      },
      {
        step: 3,
        titleHi: "हार्डकॉपी फॉर्म जमा करें",
        descHi: "आवेदन पत्र भरकर आधार, खतौनी और बोरिंग का प्रमाण पत्र कृषि उपनिदेशक कार्यालय में जमा करें।",
      },
    ],
  },

  smam: {
    applicableStates: "all",
    windowStatus: "quota",
    applicationWindowHi: "राज्य कृषि विभाग द्वारा सत्र अनुसार लॉटरी / पहले आओ पहले पाओ टोकन",
    disbursementTypeHi: "यंत्र की लागत पर 40% से 50% तक सीधा अनुदान (महिला/SC/ST को 50%)",
    helplineNumber: "1800-180-1551",
    ineligibilityHi: [
      "पिछले 3 से 5 वर्षों में उसी यंत्र पर सरकारी सब्सिडी ले चुके किसान।",
      "बिना कृषि भूमि रिकॉर्ड वाले आवेदक।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके नाम कृषि भूमि (खतौनी) दर्ज है?",
        mustBeYes: true,
        failHintHi: "कृषि यंत्र सब्सिडी के लिए आवेदक के नाम पर खेती योग्य जमीन होना जरूरी है।",
      },
      {
        questionHi: "क्या आप सरकार द्वारा अनुमोदित (Listed) डीलर से यंत्र खरीदने के इच्छुक हैं?",
        mustBeYes: true,
        failHintHi: "सब्सिडी केवल सरकार द्वारा अधिकृत व टेस्टेड कृषि यंत्र निर्माताओं के बिल पर मिलती है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "agrimachinery या राज्य पोर्टल खोलें",
        descHi: "agrimachinery.nic.in या राज्य कृषि यंत्र व मशीन पोर्टल (जैसे upagriculture.com / dbt.mpdage.org) खोलें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "यंत्र का चयन करें",
        descHi: "रोटावेटर, कल्टीवेटर, सीड ड्रिल, थ्रेशर, लेजर लेवलर आदि में से अपनी पसंद का यंत्र चुनें।",
        badge: "मशीन चयन",
      },
      {
        step: 3,
        titleHi: "टोकन जनरेट करें",
        descHi: "टोकन विंडो खुलते ही टोकन बुक करें और निर्धारित टोकन मनी ऑनलाइन या बैंक चालान से जमा करें।",
        badge: "टोकन",
      },
      {
        step: 4,
        titleHi: "यंत्र खरीद व बिल अपलोड",
        descHi: "स्वीकृति मिलने पर अधिकृत डीलर से मशीन खरीदें, बिल और मशीन के साथ फोटो पोर्टल पर अपलोड करें। सब्सिडी खाते में आएगी।",
        badge: "सब्सिडी",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "जिला कृषि अधिकारी से टोकन शेड्यूल पूछें",
        descHi: "जिला कृषि रक्षा इकाई या उपनिदेशक कृषि कार्यालय जाकर पूछें कि किस यंत्र का टोकन कब खुलेगा।",
      },
      {
        step: 2,
        titleHi: "जन सेवा केंद्र (CSC) से टोकन कटवाएं",
        descHi: "तय तारीख को सुबह ही CSC केंद्र जाकर अपने किसान पंजीकरण नंबर से टोकन लॉक करवाएँ।",
      },
    ],
  },

  pmfby: {
    applicableStates: "all",
    windowStatus: "seasonal",
    applicationWindowHi: "खरीफ सीजन: 31 जुलाई तक | रबी सीजन: 31 दिसंबर तक (कट-ऑफ तिथियां सख्त हैं)",
    disbursementTypeHi: "प्राकृतिक आपदा पर फसल क्षति का प्रत्यक्ष बैंक ट्रांसफर (DBT)",
    helplineNumber: "14447 (PMFBY राष्ट्रीय हेल्पलाइन) / 1800-180-1551",
    ineligibilityHi: [
      "अंतिम कट-ऑफ तिथि के बाद आवेदन करने वाले किसान।",
      "जिले की सरकारी लिस्ट से बाहर की फसल बोने पर।",
      "आपदा आने के 72 घंटे के बाद सूचना देने पर व्यक्तिगत क्लेम अस्वीकृत हो सकता है।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपने अपने जिले की सरकारी लिस्ट वाली मुख्य फसल (जैसे धान, गेहूँ, चना, सोयाबीन) बोई है?",
        mustBeYes: true,
        failHintHi: "PMFBY केवल सरकार द्वारा जिले में मान्य सरकारी लिस्ट वाली फसलों पर ही लागू होती है।",
      },
      {
        questionHi: "क्या आप बुवाई की कट-ऑफ तिथि से पहले बीमा आवेदन कर रहे हैं?",
        mustBeYes: true,
        failHintHi: "फसल बीमा की कट-ऑफ तिथि सख्त होती है, इसके बाद आवेदन स्वीकार नहीं होता।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "pmfby.gov.in खोलें",
        descHi: "प्रधानमंत्री फसल बीमा योजना पोर्टल (pmfby.gov.in) खोलें और 'Farmer Corner' पर जाएँ।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "राज्य, फसल और वर्ष चुनें",
        descHi: "अपना राज्य, जिला, वर्ष (2025/2026) और फसल का मौसम (Kharif/Rabi) चुनें।",
        badge: "मौसम चयन",
      },
      {
        step: 3,
        titleHi: "प्रीमियम भुगतान करें",
        descHi: "खतौनी, बुवाई प्रमाण पत्र अपलोड करें। खरीफ पर 2% और रबी पर केवल 1.5% किसान प्रीमियम ऑनलाइन भरें।",
        badge: "प्रीमियम",
      },
      {
        step: 4,
        titleHi: "बीमा पॉलिसी रसीद डाउनलोड करें",
        descHi: "सफलतापूर्वक भुगतान के बाद Policy Certificate डाउनलोड करें और सुरक्षित रखें।",
        badge: "पॉलिसी",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "बैंक शाखा या CSC केंद्र जाएँ",
        descHi: "जहाँ आपका बचत/KCC खाता है उस बैंक शाखा या नजदीकी CSC केंद्र जाएँ।",
      },
      {
        step: 2,
        titleHi: "बुवाई प्रमाण पत्र व खतौनी दें",
        descHi: "लेखपाल/ग्राम प्रधान द्वारा सत्यापित बुवाई घोषणा पत्र और खतौनी जमा करें।",
      },
      {
        step: 3,
        titleHi: "बीमा प्रीमियम कटवाएँ व रसीद लें",
        descHi: "प्रीमियम कटवाकर अधिकृत बीमा रसीद / पर्ची (Policy Ack slip) अवश्य लें।",
      },
      {
        step: 4,
        titleHi: "आपदा आने पर 72 घंटे में सूचना",
        descHi: "ओलावृष्टि, जलभराव या कीट रोग से नुकसान होने पर टोल-फ्री 14447 पर तुरंत कॉल करें।",
      },
    ],
  },

  "mp-cm-kisan": {
    applicableStates: ["Madhya Pradesh"],
    windowStatus: "open",
    applicationWindowHi: "मध्य प्रदेश के किसानों के लिए वर्ष भर सक्रिय",
    disbursementTypeHi: "MP सरकार द्वारा अतिरिक्त ₹6,000 प्रति वर्ष (PM-Kisan के साथ कुल ₹12,000)",
    helplineNumber: "181 (MP CM हेल्पलाइन) / 1800-180-1551",
    ineligibilityHi: [
      "मध्य प्रदेश के बाहर के निवासी किसान।",
      "जो किसान PM-Kisan योजना में पात्र नहीं हैं।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आप मध्य प्रदेश के मूल निवासी हैं और आपके पास MP में कृषि भूमि है?",
        mustBeYes: true,
        failHintHi: "यह योजना विशेष रूप से मध्य प्रदेश राज्य के किसानों के लिए है।",
      },
      {
        questionHi: "क्या आपका PM-Kisan सम्मान निधि में नाम पंजीकृत है?",
        mustBeYes: true,
        failHintHi: "MP मुख्यमंत्री किसान कल्याण योजना का लाभ उन्हीं किसानों को मिलता है जो PM-Kisan में सत्यापित हैं।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "सारा (SAARA) पोर्टल खोलें",
        descHi: "saara.mp.gov.in खोलें और 'मुख्यमंत्री किसान कल्याण योजना' टैब चुनें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "आधार / समग्र आईडी से स्थिति देखें",
        descHi: "अपना आधार नंबर या समग्र आईडी दर्ज करके जांचें कि आपका नाम पात्र सूची में जुड़ा है या नहीं।",
        badge: "सत्यापन",
      },
      {
        step: 3,
        titleHi: "पटवारी / तहसीलदार से सत्यापन",
        descHi: "यदि नाम नहीं है, तो अपने हल्का पटवारी के माध्यम से सारा पोर्टल पर नाम दर्ज करवाएँ।",
        badge: "स्वीकृति",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "हल्का पटवारी से संपर्क करें",
        descHi: "आधार कार्ड, समग्र आईडी, बैंक पासबुक और खतौनी लेकर अपने गाँव के पटवारी से मिलें।",
      },
      {
        step: 2,
        titleHi: "सारा पोर्टल पर सत्यापन",
        descHi: "पटवारी आपकी पात्रता जांचकर सारा पोर्टल पर रिपोर्ट अपलोड करेगा।",
      },
    ],
  },

  "rj-fencing": {
    applicableStates: ["Rajasthan"],
    windowStatus: "quota",
    applicationWindowHi: "राजस्थान कृषि विभाग द्वारा वित्तीय वर्ष अनुसार आवेदन चालू",
    disbursementTypeHi: "तारबंदी की लागत का 50% से 60% (अधिकतम ₹40,000 से ₹48,000 तक) अनुदान",
    helplineNumber: "181 (राजस्थान संपर्क) / 1800-180-1551",
    ineligibilityHi: [
      "राजस्थान के बाहर के किसान।",
      "व्यक्तिगत किसान के पास 1.5 हेक्टेयर से कम भूमि होना (समूह में 5 हेक्टेयर जरूरी)।",
      "पूर्व में तारबंदी अनुदान प्राप्त कर चुके आवेदक।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके पास राजस्थान में कम से कम 1.5 हेक्टेयर कृषि भूमि है (या 2-3 किसान समूह में 5 हेक्टेयर)?",
        mustBeYes: true,
        failHintHi: "व्यक्तिगत तारबंदी के लिए न्यूनतम 1.5 हेक्टेयर जमीन होना जरूरी है। छोटे किसान समूह बनाकर पात्र हो सकते हैं।",
      },
      {
        questionHi: "क्या आपके पास जन आधार कार्ड (Jan Aadhaar) बना हुआ है?",
        mustBeYes: true,
        failHintHi: "राजस्थान की सभी योजनाओं के लिए जन आधार कार्ड अनिवार्य है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "राज किसान साथी पोर्टल खोलें",
        descHi: "rajkisan.rajasthan.gov.in खोलें या RajKisan Suvidha App डाउनलोड करें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "जन आधार से लॉगिन",
        descHi: "जन आधार नंबर दर्ज करें, OTP सत्यापित करें और 'तारबंदी योजना' (Crop Protection) चुनें।",
        badge: "लॉगिन",
      },
      {
        step: 3,
        titleHi: "जमाबंदी व खेत नक्शा अपलोड",
        descHi: "नवीनतम जमाबंदी नकल और खेत का ट्रेस नक्शा अपलोड कर सबमिट करें।",
        badge: "दस्तावेज़",
      },
      {
        step: 4,
        titleHi: "प्रशासनिक स्वीकृति व काम",
        descHi: "कृषि पर्यवेक्षक के मौके पर मुआयने के बाद स्वीकृति मिलेगी। जालीदार तार लगाकर बिल पोर्टल पर अपलोड करें।",
        badge: "अनुदान",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "ई-मित्र (E-Mitra) केंद्र जाएँ",
        descHi: "जन आधार, जमाबंदी और बैंक पासबुक लेकर नजदीकी ई-मित्र पर जाएँ।",
      },
      {
        step: 2,
        titleHi: "कृषि पर्यवेक्षक से तस्दीक",
        descHi: "फॉर्म भरने के बाद अपने क्षेत्र के कृषि पर्यवेक्षक को सूचना दें ताकि वे भौतिक सत्यापन कर सकें।",
      },
    ],
  },
  "bihar-fasal-sahayata": {
    applicableStates: ["Bihar"],
    windowStatus: "seasonal",
    applicationWindowHi: "खरीफ व रबी बुवाई सीजन में पोर्टल पर आवेदन चालू रहता है",
    disbursementTypeHi: "सीधे DBT द्वारा बैंक खाते में (₹7,500 से ₹10,000 प्रति हेक्टेयर)",
    helplineNumber: "1800-1800-110",
    ineligibilityHi: [
      "बिहार राज्य के बाहर की जमीन पर यह सहायता लागू नहीं होती।",
      "जिनके बैंक खाते में आधार लिंक (Aadhaar Seeding / DBT) सक्रिय नहीं है।",
      "फसल कटनी प्रयोग में यदि पंचायत में नुकसान 20% से कम पाया जाता है।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपकी खेती की जमीन बिहार राज्य में स्थित है?",
        mustBeYes: true,
        failHintHi: "यह योजना केवल बिहार के भूखंडों के लिए संचालित है।",
      },
      {
        questionHi: "क्या आपका बैंक खाता आधार से लिंक (Aadhaar Seeded) है?",
        mustBeYes: true,
        failHintHi: "सरकारी सहायता सीधे आधार-लिंक्ड बैंक खाते में DBT द्वारा भेजी जाती है।",
      },
      {
        questionHi: "क्या आप रैयत (मालिक) या बटाईदार किसान के रूप में खेती कर रहे हैं?",
        mustBeYes: true,
        failHintHi: "रैयत और बटाईदार (गैर-रैयत) दोनों किसान इस योजना में पात्र हैं।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "सहकारिता पोर्टल खोलें",
        descHi: "pacsonline.bih.nic.in पोर्टल पर जाएँ और 'बिहार राज्य फसल सहायता योजना' चुनें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "किसान पंजीकरण दर्ज करें",
        descHi: "अपना 13 अंकों का डीबीटी किसान पंजीकरण नंबर दर्ज करें और आधार OTP से पुष्टि करें।",
        badge: "लॉगिन",
      },
      {
        step: 3,
        titleHi: "जमीन या बटाईदारी प्रमाण अपलोड",
        descHi: "रैयत किसान अपनी जमीन की चालू रसीद/LPC और बटाईदार किसान स्व-घोषणा पत्र अपलोड करें।",
        badge: "कागज़ात",
      },
      {
        step: 4,
        titleHi: "आवेदन सबमिट कर पर्ची लें",
        descHi: "फॉर्म सबमिट करें और पक्की कंप्यूटर रसीद सुरक्षित रखें। नुकसान घोषित होने पर पैसा सीधे खाते में आएगा।",
        badge: "पूर्ण",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "कागज़ात लेकर वसुधा केंद्र जाएँ",
        descHi: "आधार, बैंक पासबुक और जमीन रसीद या स्व-घोषणा पत्र लेकर नजदीकी वसुधा केंद्र / CSC पर जाएँ।",
      },
      {
        step: 2,
        titleHi: "प्रखंड सहकारिता पदाधिकारी से संपर्क",
        descHi: "आवेदन में कोई समस्या आने पर प्रखंड सहकारिता पदाधिकारी (BCCO) या किसान सलाहकार से मिलें।",
      },
    ],
  },
  "bihar-diesel-anudan": {
    applicableStates: ["Bihar"],
    windowStatus: "seasonal",
    applicationWindowHi: "कम बारिश या सूखे के दौरान सिंचाई सीजन में चालू रहता है",
    disbursementTypeHi: "₹75 प्रति लीटर डीजल सब्सिडी (₹750/एकड़) सीधे बैंक खाते में",
    helplineNumber: "1800-180-1551",
    ineligibilityHi: [
      "पेट्रोल पंप की बिना 13 अंकों के किसान रजिस्ट्रेशन नंबर वाली कच्ची रसीद मान्य नहीं होगी।",
      "बिजली से चलने वाले नलकूप से सिंचाई करने पर डीजल अनुदान नहीं मिलता।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आप डीजल पंपसेट से अपनी या बटाई की फसल की सिंचाई करते हैं?",
        mustBeYes: true,
        failHintHi: "यह योजना केवल डीजल पंपसेट से की जाने वाली सिंचाई के लिए है।",
      },
      {
        questionHi: "क्या आपके पास पेट्रोल पंप की 13 अंकों वाले रजिस्ट्रेशन नंबर की पक्की रसीद है?",
        mustBeYes: true,
        failHintHi: "पेट्रोल पंप की कंप्यूटराइज्ड रसीद पर आपका 13 अंकों का किसान नंबर छपा होना अनिवार्य है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "बिहार कृषि DBT पोर्टल खोलें",
        descHi: "dbtagriculture.bihar.gov.in पर जाएँ और 'डीजल अनुदान आवेदन' विकल्प चुनें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "किसान पंजीकरण व खेत का ब्योरा",
        descHi: "पंजीकरण संख्या डालें, सिंचित खेत का खेसरा नंबर, थाना नंबर और कुल रकबा भरें।",
        badge: "खेत विवरण",
      },
      {
        step: 3,
        titleHi: "डीजल रसीद व सत्यापन अपलोड",
        descHi: "पेट्रोल पंप की पक्की कंप्यूटराइज्ड रसीद और किसान समन्वयक का सत्यापन फॉर्म अपलोड करें।",
        badge: "रसीद",
      },
      {
        step: 4,
        titleHi: "सबमिट कर रसीद निकालें",
        descHi: "आवेदन सबमिट करें। कृषि समन्वयक के मौके पर मुआयने के बाद पैसा सीधे खाते में आ जाएगा।",
        badge: "खाते में पैसा",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "पेट्रोल पंप से पक्की रसीद लें",
        descHi: "डीजल खरीदते समय पेट्रोल पंप से 13 अंकों का किसान नंबर और पंप की मुहर वाली रसीद लें।",
      },
      {
        step: 2,
        titleHi: "किसान सलाहकार से सत्यापन",
        descHi: "अपने पंचायत के किसान सलाहकार या कृषि समन्वयक को खेत दिखाकर सिंचाई प्रमाण पत्र पर हस्ताक्षर कराएं।",
      },
    ],
  },
  "haryana-bhavantar": {
    applicableStates: ["Haryana"],
    windowStatus: "open",
    applicationWindowHi: "'मेरी फसल मेरा ब्यौरा' पोर्टल पर रजिस्ट्रेशन समय सीमा अनुसार",
    disbursementTypeHi: "मंडी भाव व संरक्षित सरकारी भाव का अंतर सीधे बैंक खाते में",
    helplineNumber: "1800-180-2117",
    ineligibilityHi: [
      "जिन्होंने 'मेरी फसल मेरा ब्यौरा' पोर्टल पर फसल का रजिस्ट्रेशन नहीं कराया।",
      "मंडी में बिना जे-फॉर्म (J-Form) के कच्ची पर्ची पर बेची गई फसल पर लाभ नहीं मिलता।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपने 'मेरी फसल मेरा ब्यौरा' (MFMB) पर अपनी फसल रजिस्टर की है?",
        mustBeYes: true,
        failHintHi: "भावांतर भरपाई का लाभ केवल मेरी फसल मेरा ब्यौरा पर पंजीकृत फसलों को ही मिलता है।",
      },
      {
        questionHi: "क्या आपकी फसल भावांतर योजना की 21 मान्य फसलों (सब्जी/फल/बाजरा) में शामिल है?",
        mustBeYes: true,
        failHintHi: "टमाटर, प्याज, आलू, फूलगोभी, गाजर, मटर व बाजरा जैसी 21 फसलें इसके अंतर्गत आती हैं।",
      },
      {
        questionHi: "क्या आपके पास हरियाणा का परिवार पहचान पत्र (PPP) है?",
        mustBeYes: true,
        failHintHi: "हरियाणा में सभी कृषि योजनाओं के लिए परिवार पहचान पत्र (PPP) अनिवार्य है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "मेरी फसल मेरा ब्यौरा खोलें",
        descHi: "fasal.haryana.gov.in खोलें और परिवार पहचान पत्र (PPP) से लॉगिन करें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "खेत व फसल दर्ज करें",
        descHi: "खेत का किला नंबर और बोई गई सब्जी/बाजरा फसल का रकबा दर्ज कर पंजीकरण पूरा करें।",
        badge: "पंजीकरण",
      },
      {
        step: 3,
        titleHi: "मंडी में जे-फॉर्म पर उपज बेचें",
        descHi: "फसल तैयार होने पर अधिकृत मंडी में बेचें और आढ़ती से पक्का जे-फॉर्म (J-Form) लें।",
        badge: "जे-फॉर्म",
      },
      {
        step: 4,
        titleHi: "भावांतर का अंतर स्वतः खाते में",
        descHi: "यदि मंडी भाव संरक्षित मूल्य से कम रहा, तो सरकार सीधे आपके बैंक खाते में अंतर का पैसा भेज देगी।",
        badge: "सीधे खाते में",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "अटल सेवा केंद्र (CSC) जाएँ",
        descHi: "परिवार पहचान पत्र और खेत की फर्द लेकर नजदीकी अटल सेवा केंद्र पर फसल दर्ज कराएं।",
      },
      {
        step: 2,
        titleHi: "मंडी सचिव कार्यालय से सहायता",
        descHi: "जे-फॉर्म कटने में किसी भी परेशानी पर संबंधित अनाज/सब्जी मंडी के सचिव से संपर्क करें।",
      },
    ],
  },
  "haryana-mera-pani": {
    applicableStates: ["Haryana"],
    windowStatus: "seasonal",
    applicationWindowHi: "धान रोपाई से पहले (मई से जुलाई) पंजीकरण चालू रहता है",
    disbursementTypeHi: "₹7,000 प्रति एकड़ (दो किस्तों में) सीधे बैंक खाते में",
    helplineNumber: "1800-180-2117",
    ineligibilityHi: [
      "जिस खेत में पिछले वर्ष धान नहीं बोया गया था, उस पर सहायता नहीं मिलेगी।",
      "यदि रजिस्ट्रेशन के बाद भी खेत में धान लगा दिया गया, तो सहायता रद्द हो जाएगी।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपने पिछले साल उस खेत में धान बोया था?",
        mustBeYes: true,
        failHintHi: "यह योजना उन्हीं खेतों के लिए है जहाँ पिछले वर्ष धान बोया गया था।",
      },
      {
        questionHi: "क्या इस बार धान छोड़कर मक्का, कपास, दालें या खाली खेत रख रहे हैं?",
        mustBeYes: true,
        failHintHi: "धान के स्थान पर वैकल्पिक फसलें लगाने या खेत खाली रखने पर ही ₹7,000/एकड़ मिलते हैं।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "मेरा पानी मेरी विरासत पोर्टल चुनें",
        descHi: "fasal.haryana.gov.in पर जाएँ और 'मेरा पानी मेरी विरासत' लिंक पर क्लिक करें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "खेत व वैकल्पिक फसल का ब्योरा",
        descHi: "पिछले साल के धान वाले खेत का किला नंबर और इस बार बोई जाने वाली फसल चुनें।",
        badge: "विवरण",
      },
      {
        step: 3,
        titleHi: "पटवारी व सैटेलाइट सत्यापन",
        descHi: "कृषि विभाग और पटवारी द्वारा सेटेलाइट व भौतिक मुआयना किया जाता है।",
        badge: "सत्यापन",
      },
      {
        step: 4,
        titleHi: "₹7,000 प्रति एकड़ प्रोत्साहन पाएं",
        descHi: "सत्यापन के बाद प्रोत्साहन राशि दो किस्तों में सीधे आपके बैंक खाते में जमा होगी।",
        badge: "खाते में पैसा",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "ब्लॉक कृषि अधिकारी कार्यालय जाएँ",
        descHi: "अपने ब्लॉक के खंड कृषि अधिकारी (BAO) से मिलकर वैकल्पिक फसल के बीज व सब्सिडी की जानकारी लें।",
      },
    ],
  },
  "mh-namo-shetkari": {
    applicableStates: ["Maharashtra"],
    windowStatus: "open",
    applicationWindowHi: "PM-KISAN के साथ स्वतः लागू — अलग से आवेदन की आवश्यकता नहीं",
    disbursementTypeHi: "₹2,000 की 3 किस्तें (कुल ₹6,000/वर्ष) अतिरिक्त सीधे बैंक खाते में",
    helplineNumber: "1800-120-8040",
    ineligibilityHi: [
      "जो किसान PM-KISAN में अपात्र हैं, उन्हें नमो शेतकरी का लाभ भी नहीं मिलता।",
      "बैंक खाते में आधार NPCI लिंक न होने पर किस्त रुक सकती है।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपको PM-KISAN योजना की किस्तें नियमित रूप से मिलती हैं?",
        mustBeYes: true,
        failHintHi: "नमो शेतकरी योजना का लाभ सीधे PM-KISAN पात्र किसानों को ही मिलता है।",
      },
      {
        questionHi: "क्या आपका 7/12 उतारा और आधार कार्ड बैंक खाते से लिंक है?",
        mustBeYes: true,
        failHintHi: "बैंक खाते में आधार NPCI सीडिंग होना अनिवार्य है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "MahaDBT पोर्टल खोलें",
        descHi: "mahadbt.maharashtra.gov.in पर जाएँ और 'शेतकरी योजना' सेक्शन खोलें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "नमो शेतकरी स्टेटस चेक करें",
        descHi: "अपना आधार नंबर डालकर नमो शेतकरी महासन्मान निधी भुगतान स्टेटस देखें।",
        badge: "स्टेटस",
      },
      {
        step: 3,
        titleHi: "किस्त सीधे खाते में पाएं",
        descHi: "PM-KISAN की किस्त आते ही महाराष्ट्र सरकार के ₹2,000 अतिरिक्त आपके खाते में स्वतः जमा होते हैं।",
        badge: "खाते में पैसा",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "तालुका कृषि अधिकारी से मिलें",
        descHi: "किस्त न आने पर अपने तालुका कृषि अधिकारी (TAO) कार्यालय या नजदीकी CSC केंद्र से आधार सीडिंग चेक कराएं।",
      },
    ],
  },
  "mh-magel-tyala-shettale": {
    applicableStates: ["Maharashtra"],
    windowStatus: "open",
    applicationWindowHi: "MahaDBT पोर्टल पर वर्षभर ऑनलाइन आवेदन चालू रहता है",
    disbursementTypeHi: "₹75,000 तक 100% सब्सिडी सीधे बैंक खाते में (दो किस्तों में)",
    helplineNumber: "1800-120-8040",
    ineligibilityHi: [
      "जिनके पास कम से कम 0.60 हेक्टेयर (लगभग 1.5 एकड़) जमीन नहीं है।",
      "जिन्होंने पहले किसी सरकारी योजना में शेततळे का लाभ ले रखा है।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके नाम पर कम से कम 1.5 एकड़ (0.60 हेक्टेयर) खेती की जमीन है?",
        mustBeYes: true,
        failHintHi: "खेत तालाब (शेततळे) के लिए न्यूनतम 0.60 हेक्टेयर जमीन का होना आवश्यक है।",
      },
      {
        questionHi: "क्या आपके खेत में बारिश का पानी संचित करने के लिए उपयुक्त स्थान है?",
        mustBeYes: true,
        failHintHi: "तालाब ऐसे स्थान पर होना चाहिए जहाँ बारिश का बहाव आसानी से तालाब में आ सके।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "MahaDBT पर किसान लॉगिन करें",
        descHi: "mahadbt.maharashtra.gov.in पर लॉगिन कर 'मागेल त्याला शेततळे' घटक चुनें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "7/12 व 8-अ विवरण भरें",
        descHi: "जमीन का गट नंबर और बैंक खाता विवरण अपलोड कर आवेदन सबमिट करें।",
        badge: "कागज़ात",
      },
      {
        step: 3,
        titleHi: "स्वीकृति पत्र (In-principle) लें",
        descHi: "कृषि सहायक के मौके पर मुआयने के बाद कार्य शुरू करने का प्रशासनिक पत्र मिलेगा।",
        badge: "स्वीकृति",
      },
      {
        step: 4,
        titleHi: "तालाब खुदवाकर सब्सिडी पाएं",
        descHi: "तालाब खुदाई कर प्लास्टिक लाइनिंग लगाएं और जियो-टैग्ड फोटो अपलोड कर ₹75,000 सब्सिडी पाएं।",
        badge: "सब्सिडी",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "तालुका कृषि अधिकारी कार्यालय जाएँ",
        descHi: "तहसील के तालुका कृषि अधिकारी (TAO) कार्यालय में जाकर शेततळे के आकार और प्लास्टिक लाइनिंग के नियम समझें।",
      },
    ],
  },
  "up-khet-talab": {
    applicableStates: ["Uttar Pradesh"],
    windowStatus: "quota",
    applicationWindowHi: "वर्ष में दो बार पोर्टल पर टोकन बुकिंग खुलती है (पहले आओ-पहले पाओ)",
    disbursementTypeHi: "50% सब्सिडी (₹52,500 से ₹1,05,000) तीन किस्तों में DBT द्वारा",
    helplineNumber: "1800-180-1551 / 0522-2204223",
    ineligibilityHi: [
      "जिनके पास तालाब के लिए पर्याप्त भूमि या खसरा-खतौनी नहीं है।",
      "टोकन बुकिंग के बाद तय समय में ₹1,000 जमानत राशि चालान से जमा न करने पर।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपका upagriculture.com पर किसान पंजीकरण बना हुआ है?",
        mustBeYes: true,
        failHintHi: "यूपी में टोकन बुकिंग के लिए पारदर्शी किसान सेवा पोर्टल पर पंजीकरण जरूरी है।",
      },
      {
        questionHi: "क्या आपके पास तालाब बनवाने के लिए कम से कम 1 बीघा जमीन उपलब्ध है?",
        mustBeYes: true,
        failHintHi: "छोटे तालाब के लिए कम से कम 22x20 मीटर की खुली जमीन होनी चाहिए।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "upagriculture.com पर टोकन बुक करें",
        descHi: "पारदर्शी किसान पोर्टल खोलें और 'खेत तालाब योजना' टोकन लिंक पर क्लिक करें।",
        badge: "टोकन",
      },
      {
        step: 2,
        titleHi: "तालाब का साइज चुनें",
        descHi: "छोटा तालाब (₹52,500 छूट) या मध्यम तालाब (₹1.05 लाख छूट) का चयन करें।",
        badge: "साइज",
      },
      {
        step: 3,
        titleHi: "चालान द्वारा जमानत राशि जमा करें",
        descHi: "जनरेट हुए चालान से यूनियन बैंक शाखा में ₹1,000 की सुरक्षा राशि जमा करें।",
        badge: "चालान",
      },
      {
        step: 4,
        titleHi: "तालाब खुदवाएं और सब्सिडी लें",
        descHi: "कार्य आदेश मिलने पर तालाब खुदवाएं। तीन किस्तों में सब्सिडी सीधे बैंक खाते में आएगी।",
        badge: "खाते में पैसा",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "उप कृषि निदेशक (भूमि संरक्षण) से संपर्क",
        descHi: "जिले के उप कृषि निदेशक (भूमि संरक्षण) कार्यालय में जाकर तकनीकी सलाह और डिजाइन नक्शा लें।",
      },
    ],
  },
  "up-gopalak": {
    applicableStates: ["Uttar Pradesh"],
    windowStatus: "open",
    applicationWindowHi: "मुख्य पशु चिकित्सा अधिकारी (CVO) कार्यालय में वर्षभर आवेदन चालू",
    disbursementTypeHi: "₹9 लाख तक बैंक लोन + ₹40,000/वर्ष ब्याज छूट (5 साल तक ₹2 लाख)",
    helplineNumber: "0522-2740263 / 1800-180-5141",
    ineligibilityHi: [
      "जिनके पास कम से कम 5 से 10 दुधारू पशु रखने के लिए पक्का या कच्चा शेड नहीं है।",
      "जो किसी बैंक में पहले से किसी ऋण में डिफॉल्टर घोषित हों।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके पास 5 से 10 गाय या भैंस रखने के लिए शेड और चारे की जगह है?",
        mustBeYes: true,
        failHintHi: "गोपालक योजना के तहत कम से कम 5 से 10 पशुओं की डेयरी शुरू करनी होती है।",
      },
      {
        questionHi: "क्या आप उन्नत नस्ल (साहीवाल, गिर, मुर्रा) की डेयरी चलाना चाहते हैं?",
        mustBeYes: true,
        failHintHi: "स्वदेशी दुधारू गायों और मुर्रा भैंसों पर यह योजना विशेष सहायता देती है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "गोपालक आवेदन पत्र डाउनलोड करें",
        descHi: "animalhusbandry.up.gov.in से गोपालक योजना का फॉर्म डाउनलोड कर प्रिंट लें।",
        badge: "फॉर्म",
      },
      {
        step: 2,
        titleHi: "पशु शेड व प्रोजेक्ट रिपोर्ट तैयार करें",
        descHi: "पशुओं की नस्ल, शेड का नक्शा और अनुमानित लागत का विवरण फॉर्म में भरें।",
        badge: "प्रोजेक्ट",
      },
      {
        step: 3,
        titleHi: "CVO कार्यालय में आवेदन जमा करें",
        descHi: "जिले के मुख्य पशु चिकित्सा अधिकारी (CVO) कार्यालय में फॉर्म जमा करें।",
        badge: "जमा करें",
      },
      {
        step: 4,
        titleHi: "बैंक लोन व ब्याज सब्सिडी पाएं",
        descHi: "चयन समिति से पास होकर बैंक से लोन मिलेगा और सरकार हर साल ₹40,000 ब्याज सब्सिडी देगी।",
        badge: "सब्सिडी",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "नजदीकी पशु चिकित्सालय के डॉक्टर से मिलें",
        descHi: "राजकीय पशु चिकित्सालय के डॉक्टर से पशु स्वास्थ्य प्रमाण पत्र और शेड का मुआयना करवाएं।",
      },
    ],
  },
  "rj-diggi-anudan": {
    applicableStates: ["Rajasthan"],
    windowStatus: "open",
    applicationWindowHi: "राजकिसान साथी पोर्टल पर चालू वित्तीय वर्ष में आवेदन स्वीकार्य",
    disbursementTypeHi: "लागत का 75% से 85% या अधिकतम ₹3,00,000 तक प्रत्यक्ष अनुदान",
    helplineNumber: "1800-180-1551 / 0141-2227849",
    ineligibilityHi: [
      "नहरी क्षेत्र में 0.5 हेक्टेयर या गैर-नहरी क्षेत्र में 1 हेक्टेयर से कम जमीन होने पर।",
      "प्रशासनिक स्वीकृति मिलने से पहले डिग्गी निर्माण शुरू करने पर अनुदान नहीं मिलेगा।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके पास नहरी क्षेत्र में कम से कम 2 बीघा या गैर-नहरी में 4 बीघा जमीन है?",
        mustBeYes: true,
        failHintHi: "डिग्गी अनुदान के लिए न्यूनतम भूमि की शर्त पूरी होना आवश्यक है।",
      },
      {
        questionHi: "क्या आपके पास राजस्थान का जन आधार कार्ड उपलब्ध है?",
        mustBeYes: true,
        failHintHi: "राजस्थान में सभी योजनाओं का आवेदन जन आधार कार्ड के माध्यम से ही होता है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "राजकिसान साथी पोर्टल खोलें",
        descHi: "rajkisan.rajasthan.gov.in पर जन आधार से लॉगिन करें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "डिग्गी व पाइपलाइन योजना चुनें",
        descHi: "कृषि विभाग की 'खेत डिग्गी / पाइपलाइन अनुदान' योजना का चयन करें।",
        badge: "चयन",
      },
      {
        step: 3,
        titleHi: "जमाबंदी व नक्शा अपलोड करें",
        descHi: "नवीनतम जमाबंदी नकल और खेत का नक्शा ट्रेस अपलोड कर आवेदन सबमिट करें।",
        badge: "कागज़ात",
      },
      {
        step: 4,
        titleHi: "प्रशासनिक स्वीकृति के बाद निर्माण",
        descHi: "स्वीकृति मिलने पर पक्की डिग्गी बनाएं। भौतिक सत्यापन के बाद ₹3 लाख तक अनुदान खाते में आएगा।",
        badge: "अनुदान",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "ई-मित्र (E-Mitra) पर जाएँ",
        descHi: "जन आधार कार्ड, जमाबंदी और बैंक पासबुक लेकर नजदीकी ई-मित्र पर ऑनलाइन आवेदन कराएं।",
      },
    ],
  },
  "punjab-crm-machinery": {
    applicableStates: ["Punjab"],
    windowStatus: "seasonal",
    applicationWindowHi: "धान कटाई से पहले (जुलाई से सितंबर) पोर्टल पर आवेदन चालू रहता है",
    disbursementTypeHi: "50% व्यक्तिगत (₹1.25 लाख तक) व 80% किसान समूह सब्सिडी",
    helplineNumber: "1800-180-1551 / 0172-2970605",
    ineligibilityHi: [
      "बिना टेस्ट-पास या गैर-पंजीकृत डीलर से मशीन खरीदने पर सब्सिडी नहीं मिलेगी।",
      "जिन किसानों के पास ट्रैक्टर की वैध आरसी (RC) नहीं है।",
    ],
    quickQuiz: [
      {
        questionHi: "क्या आपके या आपके परिवार के नाम पर ट्रैक्टर की आरसी (RC) है?",
        mustBeYes: true,
        failHintHi: "मशीनरी सब्सिडी के लिए ट्रैक्टर आरसी का होना अनिवार्य है।",
      },
      {
        questionHi: "क्या आप सुपर सीडर, हैप्पी सीडर, बेलर या मल्चर खरीदना चाहते हैं?",
        mustBeYes: true,
        failHintHi: "यह योजना पराली प्रबंधन की अधिकृत मशीनों पर सब्सिडी देती है।",
      },
    ],
    onlineSteps: [
      {
        step: 1,
        titleHi: "पंजाब एग्री मशीनरी पोर्टल खोलें",
        descHi: "agrimachinerypb.com पोर्टल खोलें और 'CRM मशीनरी सब्सिडी' पर क्लिक करें।",
        badge: "पोर्टल",
      },
      {
        step: 2,
        titleHi: "आधार व जमीन का ब्योरा दर्ज करें",
        descHi: "आधार नंबर, जमीन की फर्द और ट्रैक्टर आरसी दर्ज कर मनपसंद मशीन चुनें।",
        badge: "पंजीकरण",
      },
      {
        step: 3,
        titleHi: "अनुमोदन मिलने पर मशीन खरीदें",
        descHi: "स्वीकृति पत्र मिलने के बाद अधिकृत डीलर से मशीन खरीदें और बिल अपलोड करें।",
        badge: "खरीद",
      },
      {
        step: 4,
        titleHi: "सत्यापन के बाद सब्सिडी पाएं",
        descHi: "कृषि इंजीनियर द्वारा मशीन का भौतिक निरीक्षण होने पर सब्सिडी सीधे खाते में आएगी।",
        badge: "खाते में पैसा",
      },
    ],
    offlineSteps: [
      {
        step: 1,
        titleHi: "ब्लॉक कृषि अधिकारी (BDO/ADO) कार्यालय जाएँ",
        descHi: "अपने ब्लॉक के कृषि अधिकारी कार्यालय में जाकर अनुमोदित डीलरों व निर्माताओं की सूची प्राप्त करें।",
      },
    ],
  },
};

/**
 * Returns state applicability details for any given scheme ID and selected state.
 */
export function getSchemeStateStatus(schemeId: string, selectedState: string) {
  const meta = SCHEME_STATE_DETAILS[schemeId];
  const stateMeta = INDIAN_STATES_SCHEME_META[selectedState];
  const stateNameHi = stateMeta?.stateHi || selectedState || "भारत";

  if (!meta) {
    return {
      isApplicableInState: true,
      isStateSpecific: false,
      stateBadgeHi: "राष्ट्रीय योजना",
      stateMessageHi: `${stateNameHi} सहित सभी राज्यों में लागू`,
      windowStatusTextHi: "सक्रिय",
      applicationModeHi: "ऑनलाइन व जन सेवा केंद्र (CSC)",
      portalName: "आधिकारिक सरकारी पोर्टल",
      portalUrl: "",
      helpline: "1800-180-1551",
    };
  }

  const isAllStates = meta.applicableStates === "all";
  const isApplicableInState =
    isAllStates ||
    (Array.isArray(meta.applicableStates) &&
      meta.applicableStates.some((s) => s.toLowerCase() === selectedState.toLowerCase()));

  const isStateSpecific = !isAllStates;

  let stateBadgeHi = "केंद्रीय योजना (सभी राज्य)";
  let stateMessageHi = `यह योजना ${stateNameHi} सहित सभी राज्यों के पात्र किसानों के लिए लागू है।`;

  if (isStateSpecific) {
    const applicableStateNames = Array.isArray(meta.applicableStates)
      ? meta.applicableStates
          .map((s) => INDIAN_STATES_SCHEME_META[s]?.stateHi || s)
          .join(", ")
      : "";

    if (isApplicableInState) {
      stateBadgeHi = `राज्य योजना (${stateNameHi})`;
      stateMessageHi = `✅ यह योजना विशेष रूप से आपके राज्य (${stateNameHi}) के किसानों के लिए संचालित है।`;
    } else {
      stateBadgeHi = `अन्य राज्य (${applicableStateNames})`;
      stateMessageHi = `⚠️ यह योजना विशेष रूप से ${applicableStateNames} राज्य के किसानों के लिए है। आपके राज्य (${stateNameHi}) में समान सहायता के लिए जिला कृषि/उद्यान विभाग या CSC से संपर्क करें।`;
    }
  }

  const windowStatusTextHi =
    meta.windowStatus === "open"
      ? "आवेदन चालू (Open)"
      : meta.windowStatus === "seasonal"
      ? "मौसमी विंडो अनुसार (Seasonal)"
      : meta.windowStatus === "quota"
      ? "टोकन / कोटा आधारित (Quota)"
      : "विभागीय सूचना अनुसार";

  return {
    isApplicableInState,
    isStateSpecific,
    stateBadgeHi,
    stateMessageHi,
    windowStatusTextHi,
    windowStatus: meta.windowStatus,
    applicationWindowHi: meta.applicationWindowHi,
    disbursementTypeHi: meta.disbursementTypeHi,
    helpline: meta.helplineNumber,
    statePortalName: stateMeta?.portalName || "",
    statePortalUrl: stateMeta?.portalUrl || "",
    deptNameHi: stateMeta?.deptNameHi || "",
    stateNote: meta.stateSpecificNotes?.[selectedState] || null,
  };
}
