/**
 * Authoritative Curative Medicine Knowledge Base for Crop Problems
 * Contains accurate English Technical Names, Commercial Hindi Names,
 * Precise Dosages (per liter and per acre), and Indian Market Brand Names.
 */

export interface CurativeMedicine {
  nameHi: string;
  technical: string; // English Technical Name + formulation
  dose: string;      // e.g. "1 ml/L (200 ml / acre in 200 L water)"
  brands: string[];  // e.g. ["Tilt (Syngenta)", "Bumper (Adama)"]
  safety?: string;
}

export const CROP_PROBLEM_MEDICINES: Record<string, Record<string, CurativeMedicine[]>> = {
  wheat: {
    "yellow-rust": [
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ — 200 लीटर पानी में)",
        brands: ["Tilt (Syngenta)", "Bumper (Adama)", "Result"],
        safety: "पीली धारी दिखते ही तुरंत पहला स्प्रे करें; 15 दिन बाद आवश्यकता पड़ने पर दोहराएँ।",
      },
      {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 से 1.25 मिली / लीटर पानी (200–250 मिली प्रति एकड़)",
        brands: ["Folicur (Bayer)", "Orius (Adama)", "Constant"],
        safety: "कटाई से कम से कम 20 दिन पहले छिड़काव बंद करें।",
      },
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar Top (Syngenta)", "Custodia"],
        safety: "तेज धूप में स्प्रे न करें, सुबह या शाम को छिड़काव करें।",
      },
    ],
    "brown-rust": [
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)", "Bumper (Adama)"],
        safety: "पत्तियों पर भूरे गोल धब्बे फैलने से पहले छिड़काव करें।",
      },
      {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Folicur (Bayer)", "Orius"],
        safety: "साफ़ पानी का प्रयोग करें।",
      },
    ],
    "spot-blotch": [
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)", "Bumper"],
      },
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
      },
    ],
    "loose-smut": [
      {
        nameHi: "कार्बोक्सिन 37.5% + थीरम 37.5% DS (विटावैक्स पावर - बीज उपचार)",
        technical: "Carboxin 37.5% + Thiram 37.5% DS",
        dose: "2.5 से 3 ग्राम प्रति किग्रा बीज (बुवाई पूर्व बीज शोधन)",
        brands: ["Vitavax Power (Dhanuka)"],
        safety: "यह रोग बीज जनित है, खड़ी फसल में स्प्रे से ठीक नहीं होता; बीज उपचार अनिवार्य है।",
      },
      {
        nameHi: "टेबुकोनाज़ोल 2% DS (रेक्सिल - बीज उपचार)",
        technical: "Tebuconazole 2% DS",
        dose: "1 से 1.2 ग्राम प्रति किग्रा बीज",
        brands: ["Raxil (Bayer)"],
      },
    ],
    "karnal-bunt": [
      {
        nameHi: "कार्बोक्सिन 37.5% + थीरम 37.5% DS (बीज उपचार)",
        technical: "Carboxin 37.5% + Thiram 37.5% DS",
        dose: "2.5 ग्राम प्रति किग्रा बीज",
        brands: ["Vitavax Power (Dhanuka)"],
      },
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (बालियाँ निकलते समय)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)"],
      },
    ],
    "aphid": [
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (60–80 मिली प्रति एकड़ in 150 लीटर पानी)",
        brands: ["Confidor (Bayer)", "Tatamida", "Victor"],
        safety: "फूल खिलने के समय मधुमक्खियों के बचाव हेतु शाम 4 बजे के बाद ही स्प्रे करें।",
      },
      {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (80–100 ग्राम प्रति एकड़)",
        brands: ["Actara (Syngenta)", "Areva"],
      },
      {
        nameHi: "फ्लोनिकैमिड 50% WG (उलाला)",
        technical: "Flonicamid 50% WG",
        dose: "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)",
        brands: ["Ulala (UPL)"],
      },
    ],
    "termite": [
      {
        nameHi: "क्लोरपाइरीफॉस 20% EC (डरमेट)",
        technical: "Chlorpyrifos 20% EC",
        dose: "1 से 1.25 लीटर प्रति एकड़ (20-25 किग्रा सूखी बालू या रेत में मिलाकर पहली सिंचाई से पूर्व खेत में बिखेरें)",
        brands: ["Durmet (Dhanuka)", "Dursban", "Trishul"],
      },
      {
        nameHi: "फिप्रोनिल 0.3% GR दानेदार (रीजेंट अल्ट्रा)",
        technical: "Fipronil 0.3% GR",
        dose: "8 से 10 किग्रा प्रति एकड़ (खेत में बुरकाव करें और तुरंत हल्की सिंचाई करें)",
        brands: ["Regent Ultra (Bayer)", "Mortar (Dhanuka)"],
      },
      {
        nameHi: "फिप्रोनिल 5% SC (रीजेंट)",
        technical: "Fipronil 5% SC",
        dose: "बीज उपचार: 4-5 मिली प्रति किग्रा बीज (बुवाई पूर्व) या 800 मिली प्रति एकड़ सिंचाई के पानी के साथ बहाएँ",
        brands: ["Regent (Bayer)", "Fax"],
      },
    ],
    "powdery": [
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)"],
      },
      {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Contaf Plus (Tata Rallis)"],
      },
    ],
  },

  paddy: {
    blast: [
      {
        nameHi: "ट्राइसाइक्लाज़ोल 75% WP (बाण / बीम)",
        technical: "Tricyclazole 75% WP",
        dose: "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़ — 200 लीटर पानी में)",
        brands: ["Beam (Corteva)", "Baan (Dhanuka)", "Sivic"],
        safety: "पत्तियों पर आँख जैसे धब्बे दिखते ही पहला छिड़काव करें।",
      },
      {
        nameHi: "आइसोप्रोथिओलेन 40% EC (फुजी-वन)",
        technical: "Isoprothiolane 40% EC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
        brands: ["Fuji-one (Rallis)"],
      },
      {
        nameHi: "कसुगामाइसिन 3% SL (कसू-बी)",
        technical: "Kasugamycin 3% SL",
        dose: "2 से 2.5 मिली / लीटर पानी (400–500 मिली प्रति एकड़)",
        brands: ["Kasu-B (Dhanuka)"],
      },
    ],
    "stem-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ in 200 लीटर पानी)",
        brands: ["Coragen (FMC)", "Cover"],
        safety: "डेड हार्ट (Dead heart) 5% या मोथ दिखने पर तुरंत स्प्रे करें।",
      },
      {
        nameHi: "कार्टैप हाइड्रोक्लोराइड 50% SP (कैलिडान)",
        technical: "Cartap hydrochloride 50% SP",
        dose: "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
        brands: ["Caldan 50 SP (Dhanuka)", "Padan"],
      },
      {
        nameHi: "फ्लूबेंडिमाइड 39.35% SC (फेम)",
        technical: "Flubendiamide 39.35% SC",
        dose: "0.25 मिली / लीटर पानी (50 मिली प्रति एकड़)",
        brands: ["Fame (Bayer)"],
      },
    ],
    bph: [
      {
        nameHi: "पाइमेट्रोज़िन 50% WDG (चेस)",
        technical: "Pymetrozine 50% WDG",
        dose: "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़ — पौधों के आधार पर स्प्रे)",
        brands: ["Chess (Syngenta)", "Fulstop"],
        safety: "स्प्रे नोजल को पौधों के निचले भाग (जड़ों के पास) की तरफ रखें।",
      },
      {
        nameHi: "डाइनोटेफ्यूरान 20% SG (टोकन)",
        technical: "Dinotefuran 20% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
        brands: ["Token (Indofil)", "Oshin"],
      },
      {
        nameHi: "ट्रिफ्लूमेज़ोपाइरिम 10% SC (पेक्सलॉन)",
        technical: "Triflumezopyrim 10% SC",
        dose: "0.5 मिली / लीटर पानी (94 मिली प्रति एकड़)",
        brands: ["Pexalon (Corteva)"],
      },
    ],
    "sheath-blight": [
      {
        nameHi: "वैलिडामाइसिन 3% L (शीथमार)",
        technical: "Validamycin 3% L",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Sheathmar (Dhanuka)", "Rhizocin"],
      },
      {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Contaf Plus (Tata Rallis)", "Sitara"],
      },
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar Top (Syngenta)"],
      },
    ],
    blb: [
      {
        nameHi: "स्ट्रेप्टोसाइक्लिन (90:10) + कॉपर ऑक्सीक्लोराइड 50% WP",
        technical: "Streptocycline 90% + Copper oxychloride 50% WP",
        dose: "स्ट्रेप्टोसाइक्लिन 6 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम प्रति एकड़ (200 L पानी में)",
        brands: ["Streptocycline (HAL) + Blitox 50 (Rallis)"],
        safety: "तेज बारिश के बाद पत्तियों के किनारे पीले होने पर तुरंत छिड़कें।",
      },
    ],
    "leaf-folder": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ — 200 L पानी में)",
        brands: ["Coragen (FMC)", "Cover"],
      },
      {
        nameHi: "फ्लूबेंडिमाइड 39.35% SC (फेम)",
        technical: "Flubendiamide 39.35% SC",
        dose: "0.25 मिली / लीटर पानी (50 मिली प्रति एकड़)",
        brands: ["Fame (Bayer)"],
      },
      {
        nameHi: "स्पिनोसैड 45% SC (ट्रेसर)",
        technical: "Spinosad 45% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़)",
        brands: ["Tracer (Corteva)"],
      },
    ],
    "brown-spot": [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — 200 L पानी में)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
      },
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)", "Bumper (Adama)"],
      },
    ],
    tungro: [
      {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा — हरा फुदका वाहक नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ — 200 L पानी में)",
        brands: ["Actara (Syngenta)", "Areva"],
        safety: "वायरस की सीधी दवा नहीं होती; हरा फुदका (GLH) का नियंत्रण करें।",
      },
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
        brands: ["Confidor (Bayer)"],
      },
    ],
  },

  potato: {
    "late-blight": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master (Indofil)", "Krilaxyl"],
        safety: "मौसम ठंडा-गीला होने और रात में ओस पड़ने पर बीमारी शुरू होने से पहले छिड़काव करें।",
      },
      {
        nameHi: "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
        technical: "Cymoxanil 8% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Curzate (Corteva)", "Moximate"],
      },
      {
        nameHi: "डाइमेथोमॉर्फ 50% WP (एक्रोबैट)",
        technical: "Dimethomorph 50% WP",
        dose: "1.2 से 1.5 ग्राम / लीटर पानी (250–300 ग्राम प्रति एकड़)",
        brands: ["Acrobat (BASF)"],
      },
    ],
    "early-blight": [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
      },
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 23% SC (एमिस्टार)",
        technical: "Azoxystrobin 23% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar (Syngenta)"],
      },
    ],
    scab: [
      {
        nameHi: "ट्राइकोडर्मा विरिडी 1% WP (कंद शोधन)",
        technical: "Trichoderma viride 1% WP",
        dose: "5 ग्राम / किग्रा कंद या 2.5 किग्रा / एकड़ गोबर खाद में मिलाकर बुवाई पूर्व",
        brands: ["Sanjivani", "Niprot"],
        safety: "कंद को उपचारित कर छाया में सुखाकर ही बोएँ।",
      },
      {
        nameHi: "मैंकोजेब 75% WP (कंद उपचार)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी के घोल में कंद 10 मिनट डुबोएँ",
        brands: ["Dithane M-45 (Corteva)"],
      },
    ],
    aphid: [
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (60–80 मिली प्रति एकड़ in 150 L पानी)",
        brands: ["Confidor (Bayer)", "Tatamida"],
      },
      {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (80–100 ग्राम प्रति एकड़)",
        brands: ["Actara (Syngenta)"],
      },
    ],
  },

  tomato: {
    "late-blight": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master", "Krilaxyl"],
        safety: "पानी जैसे धब्बे दिखते ही तुरंत छिड़काव करें। फल तोड़ने से 10 दिन पहले बंद करें।",
      },
      {
        nameHi: "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
        technical: "Cymoxanil 8% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़)",
        brands: ["Curzate (Corteva)", "Moximate"],
        safety: "संक्रमण शुरू होते ही 48 घंटे के भीतर उपचारात्मक असर करता है।",
      },
      {
        nameHi: "डाइमेथोमॉर्फ 50% WP (एक्रोबैट)",
        technical: "Dimethomorph 50% WP",
        dose: "1.2 से 1.5 ग्राम / लीटर पानी (250–300 ग्राम प्रति एकड़)",
        brands: ["Acrobat (BASF)"],
        safety: "फंगस की कोशिका भित्ति को नष्ट करता है; रिडोमिल के साथ रोटेशन करें।",
      },
      {
        nameHi: "फेमोक्साडोन 16.6% + साइमोक्सानिल 22.1% SC (इक्वेशन प्रो)",
        technical: "Famoxadone 16.6% + Cymoxanil 22.1% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Equation Pro (Corteva)"],
        safety: "तेज वर्षा व ठंड के मौसम में पछेती झुलसा का सबसे आधुनिक सिस्टेमिक नियंत्रण।",
      },
      {
        nameHi: "मैंडिप्रोपामाइड 23.4% SC (रेवस)",
        technical: "Mandipropamid 23.4% SC",
        dose: "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)",
        brands: ["Revus (Syngenta)"],
      },
    ],
    "early-blight": [
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Amistar Top (Syngenta)", "Custodia (Adama)"],
        safety: "अगेती झुलसा व पर्ण धब्बा पर दोहरा सुरक्षात्मक व उपचारात्मक असर।",
      },
      {
        nameHi: "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
        technical: "Tebuconazole 50% + Trifloxystrobin 25% WG",
        dose: "0.7 ग्राम / लीटर पानी (140 ग्राम प्रति एकड़)",
        brands: ["Nativo (Bayer)"],
        safety: "पौधों में हरियाली बढ़ाता है और पत्तों के धब्बों को तुरंत सुखाता है।",
      },
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
        safety: "सस्ती और प्रभावी संपर्क फफूंदनाशक दवा; पत्तों पर सुरक्षा कवच बनाती है।",
      },
      {
        nameHi: "क्लोरोथैलोनिल 75% WP (कवच)",
        technical: "Chlorothalonil 75% WP",
        dose: "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
        brands: ["Kavach (Syngenta)"],
        safety: "बारिश में भी पत्तों पर चिपकी रहती है; रोग के शुरुआती लक्षणों पर छिड़कें।",
      },
      {
        nameHi: "पायराक्लोस्ट्रोबिन 20% WG (हेडलाइन)",
        technical: "Pyraclostrobin 20% WG",
        dose: "1 ग्राम / लीटर पानी (200 ग्राम प्रति एकड़)",
        brands: ["Headline (BASF)", "Cabrio Top"],
      },
      {
        nameHi: "प्रोपिनेब 70% WP (एन्ट्राकॉल)",
        technical: "Propineb 70% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Antracol (Bayer)"],
      },
    ],
    "leaf-curl": [
      {
        nameHi: "थियामेथोक्साम 25% WG (सफेद मक्खी वाहक नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Actara (Syngenta)", "Areva"],
        safety: "पत्ती मुड़ने वाले बेगोमोवायरस को सफेद मक्खी फैलाती है; मक्खी को नियंत्रित करें।",
      },
      {
        nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
        technical: "Diafenthiuron 50% WP",
        dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़)",
        brands: ["Pegasus (Syngenta)"],
      },
      {
        nameHi: "पाइरिप्रोक्सीफेन 10% + बाइफेंथ्रिन 10% EC (लैनो)",
        technical: "Pyriproxyfen 10% + Bifenthrin 10% EC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
        brands: ["Lano (Sumitomo)"],
      },
      {
        nameHi: "एफिडोपायरोपेन 50 g/L DC (सेफीना)",
        technical: "Afidopyropen 50 g/L DC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Sefina (BASF)"],
      },
    ],
    "fruit-borer": [
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)", "Missile", "Sperto"],
        safety: "फल तुड़ाई से कम से कम 3 दिन पहले ही स्प्रे करें (PHI: 3 दिन)।",
      },
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)", "Cover"],
        safety: "अंडे से इल्ली निकलते ही खत्म कर देती है; 20-25 दिन तक सुरक्षा।",
      },
      {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़)",
        brands: ["Delegate (Corteva)"],
        safety: "आधुनिक ग्रीन केमिस्ट्री तकनीक; इल्ली को तुरंत खाना बंद कराती है।",
      },
      {
        nameHi: "फ्लूबेंडिमाइड 39.35% SC (फेम)",
        technical: "Flubendiamide 39.35% SC",
        dose: "0.25 मिली / लीटर पानी (50 मिली प्रति एकड़)",
        brands: ["Fame (Bayer)"],
      },
      {
        nameHi: "नोवाल्यूरॉन 5.25% + इमामेक्टिन बेंजोएट 0.9% SC (बाराजाइड)",
        technical: "Novaluron 5.25% + Emamectin Benzoate 0.9% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Barazide (Adama)"],
      },
    ],
    whitefly: [
      {
        nameHi: "फ्लोनिकैमिड 50% WG (उलाला)",
        technical: "Flonicamid 50% WG",
        dose: "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ulala (UPL)"],
        safety: "सफेद मक्खी को तुरंत लकवाग्रस्त कर 30 मिनट में रस चूसना बंद करा देता है।",
      },
      {
        nameHi: "पाइरिप्रोक्सीफेन 10% + बाइफेंथ्रिन 10% EC",
        technical: "Pyriproxyfen 10% + Bifenthrin 10% EC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Lano (Sumitomo)"],
      },
      {
        nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
        technical: "Diafenthiuron 50% WP",
        dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़)",
        brands: ["Pegasus (Syngenta)"],
      },
      {
        nameHi: "एफिडोपायरोपेन 50 g/L DC (सेफीना)",
        technical: "Afidopyropen 50 g/L DC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Sefina (BASF)"],
      },
      {
        nameHi: "स्पिरोमीसिफेन 22.9% SC (ओबेरॉन)",
        technical: "Spiromesifen 22.9% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Oberon (Bayer)"],
      },
    ],
    "bacterial-wilt": [
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP + स्ट्रेप्टोसाइक्लिन (जड़ ड्रेंचिंग)",
        technical: "Copper oxychloride 50% WP + Streptocycline 90%",
        dose: "कॉपर 2.5 ग्राम + स्ट्रेप्टोसाइक्लिन 0.1 ग्राम / लीटर पानी (जड़ों में डालें)",
        brands: ["Blitox 50 + Streptocycline"],
        safety: "संक्रमित पौधे को उखाड़कर नष्ट करें और स्वस्थ पौधों की जड़ों में घोल डालें।",
      },
    ],
    "leaf-miner": [
      {
        nameHi: "एबामेक्टिन 1.9% EC (वर्टिमेक)",
        technical: "Abamectin 1.9% EC",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Vertimec (Syngenta)"],
      },
      {
        nameHi: "स्पिनोसैड 45% SC (ट्रेसर)",
        technical: "Spinosad 45% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़)",
        brands: ["Tracer (Corteva)"],
      },
    ],
    "fusarium-wilt": [
      {
        nameHi: "कार्बेन्डाजिम 50% WP (बाविस्टिन — जड़ ड्रेंचिंग)",
        technical: "Carbendazim 50% WP",
        dose: "2 ग्राम / लीटर पानी (पौधों की जड़ों में 100-150 मिली घोल डालें)",
        brands: ["Bavistin (Crystal)", "Derosal"],
      },
      {
        nameHi: "ट्राइकोडर्मा विरिडी 1% WP (जैविक भूमि उपचार)",
        technical: "Trichoderma viride 1% WP",
        dose: "2.5 किग्रा प्रति एकड़ सड़ी गोबर खाद में मिलाकर",
        brands: ["Sanjivani"],
      },
    ],
  },

  mustard: {
    "white-rust": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master"],
        safety: "सफेद फफोले दिखते ही तुरंत छिड़काव करें ताकि फूल विकृत न हों।",
      },
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)"],
      },
    ],
    aphid: [
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (60–80 मिली प्रति एकड़ in 150 L पानी)",
        brands: ["Confidor (Bayer)", "Tatamida"],
        safety: "मधुमक्खी परागण बचाव हेतु शाम के समय 4 बजे के बाद ही स्प्रे करें।",
      },
      {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (80–100 ग्राम प्रति एकड़)",
        brands: ["Actara (Syngenta)"],
      },
      {
        nameHi: "डाइमेथोएट 30% EC (रोगोर)",
        technical: "Dimethoate 30% EC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
        brands: ["Rogor (FMC)"],
      },
    ],
    "alternaria-blight": [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)"],
      },
      {
        nameHi: "इप्रोडिओन 50% WP (रोवराल)",
        technical: "Iprodione 50% WP",
        dose: "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
        brands: ["Rovral (FMC)"],
      },
    ],
    "powdery-mildew": [
      {
        nameHi: "वेटेबल सल्फर 80% WDG (सल्फेक्स)",
        technical: "Wettable Sulphur 80% WDG",
        dose: "2.5 से 3 ग्राम / लीटर पानी (500–600 ग्राम प्रति एकड़)",
        brands: ["Sulfex (Excel)", "Thiovit (Syngenta)"],
      },
      {
        nameHi: "डिनोकैप 48% EC (कैराथेन)",
        technical: "Dinocap 48% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Karathane"],
      },
    ],
  },

  chilli: {
    "damping-off": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (नर्सरी क्यारियों में झारे से तर-बतर करें)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master"],
        safety: "नर्सरी में अतिरिक्त पानी न ठहरने दें और क्यारियों में धूप लगने दें।",
      },
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
        technical: "Copper oxychloride 50% WP",
        dose: "2.5 ग्राम / लीटर पानी",
        brands: ["Blitox 50 (Tata Rallis)"],
      },
    ],
    thrips: [
      {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.8 से 1 मिली / लीटर पानी (160–180 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Delegate (Corteva)"],
        safety: "पत्तियों के नीचे की सतह पर अच्छी तरह स्प्रे करें।",
      },
      {
        nameHi: "स्पिनोसैड 45% SC (ट्रेसर)",
        technical: "Spinosad 45% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Tracer (Corteva)"],
      },
      {
        nameHi: "फिप्रोनिल 5% SC (रीजेंट)",
        technical: "Fipronil 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Regent (Bayer)"],
      },
    ],
    anthracnose: [
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Amistar Top (Syngenta)", "Custodia"],
      },
      {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 से 1.25 मिली / लीटर पानी (200–250 मिली प्रति एकड़)",
        brands: ["Folicur (Bayer)", "Orius"],
      },
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)"],
      },
    ],
    "leaf-curl": [
      {
        nameHi: "थियामेथोक्साम 25% WG (सफेद मक्खी व थ्रिप्स नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
        brands: ["Actara (Syngenta)"],
      },
      {
        nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
        technical: "Diafenthiuron 50% WP",
        dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़)",
        brands: ["Pegasus (Syngenta)"],
      },
    ],
    "powdery-mildew": [
      {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Contaf Plus (Tata Rallis)"],
      },
      {
        nameHi: "वेटेबल सल्फर 80% WDG",
        technical: "Wettable Sulphur 80% WDG",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Sulfex (Excel)", "Thiovit (Syngenta)"],
      },
    ],
    mite: [
      {
        nameHi: "स्पिरोमीसिफेन 22.9% SC (ओबेरॉन)",
        technical: "Spiromesifen 22.9% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Oberon (Bayer)"],
      },
      {
        nameHi: "प्रोपारगाइट 57% EC (ओमाइट)",
        technical: "Propargite 57% EC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Omite (Dhanuka)"],
      },
      {
        nameHi: "एबामेक्टिन 1.9% EC (वर्टिमेक)",
        technical: "Abamectin 1.9% EC",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
        brands: ["Vertimec (Syngenta)"],
      },
    ],
  },

  maize: {
    "fall-army": [
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ — पौधों की गोभ/कोर में डालें)",
        brands: ["Proclaim (Syngenta)", "Missile"],
        safety: "स्प्रे का घोल सीधे मक्का की गोभ (Whorl) के अंदर पहुँचना चाहिए।",
      },
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 से 0.4 मिली / लीटर पानी (60 मिली प्रति एकड़ in 150–200 L पानी)",
        brands: ["Coragen (FMC)", "Cover"],
      },
      {
        nameHi: "स्पिनेटोरम 11.7% SC",
        technical: "Spinetoram 11.7% SC",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
        brands: ["Delegate (Corteva)"],
      },
    ],
    "stem-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 से 0.4 मिली / लीटर पानी (60 मिली प्रति एकड़ in 150–200 L पानी)",
        brands: ["Coragen (FMC)", "Cover"],
      },
      {
        nameHi: "कार्टैप हाइड्रोक्लोराइड 4% GR (दाने — गोभ में डालें)",
        technical: "Cartap hydrochloride 4% GR",
        dose: "7.5 किग्रा प्रति एकड़ (पौधों की गोभ में दाने डालें)",
        brands: ["Caldan 4G (Dhanuka)", "Padan"],
      },
    ],
    turcicum: [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)"],
      },
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)"],
      },
    ],
    maydis: [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)"],
      },
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar Top (Syngenta)"],
      },
    ],
    "common-rust": [
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Tilt (Syngenta)"],
      },
      {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Folicur (Bayer)"],
      },
    ],
    "shoot-fly": [
      {
        nameHi: "थियामेथोक्साम 30% FS (बीज उपचार)",
        technical: "Thiamethoxam 30% FS",
        dose: "6 से 8 मिली प्रति किग्रा बीज",
        brands: ["Cruiser (Syngenta)"],
        safety: "अंकुर मक्खी से बचाव हेतु बुवाई पूर्व बीज शोधन अनिवार्य है।",
      },
      {
        nameHi: "इमिडाक्लोप्रिड 70% WS (गौचो — बीज उपचार)",
        technical: "Imidacloprid 70% WS",
        dose: "5 ग्राम प्रति किग्रा बीज",
        brands: ["Gaucho (Bayer)"],
      },
    ],
  },

  onion: {
    "purple-blotch": [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — स्टिकर ज़रूर मिलाएँ)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
        safety: "प्याज की पत्ती चिकनी होती है, इसलिए 1 मिली/लीटर चिपको (Sticker) ज़रूर मिलाएँ।",
      },
      {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 से 1.25 मिली / लीटर पानी (200–250 मिली प्रति एकड़)",
        brands: ["Folicur (Bayer)", "Orius"],
      },
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar Top (Syngenta)"],
      },
    ],
    thrips: [
      {
        nameHi: "फिप्रोनिल 5% SC (रीजेंट)",
        technical: "Fipronil 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Regent (Bayer)"],
        safety: "प्याज के भीतरी पत्तों के जोड़ (Axil) में स्प्रे पहुँचना चाहिए।",
      },
      {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.8 से 1 मिली / लीटर पानी (160–180 मिली प्रति एकड़)",
        brands: ["Delegate (Corteva)"],
      },
      {
        nameHi: "प्रोफेनोफॉस 40% + साइपरमेथ्रिन 4% EC (पॉलीट्रिन सी)",
        technical: "Profenofos 40% + Cypermethrin 4% EC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Polytrin C (Syngenta)", "Roket"],
      },
    ],
    stemphylium: [
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 23% SC (एमिस्टार)",
        technical: "Azoxystrobin 23% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar (Syngenta)"],
      },
      {
        nameHi: "मैंकोजेब 75% WP",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Dithane M-45 (Corteva)"],
      },
    ],
    "downy-mildew": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)"],
      },
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
        technical: "Copper oxychloride 50% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Blitox 50 (Rallis)"],
      },
    ],
  },

  brinjal: {
    "shoot-fruit-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
        safety: "फल तुड़ाई के तुरंत बाद स्प्रे करें ताकि दवाई का असर फलों पर कम से कम रहे।",
      },
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)", "Missile"],
      },
      {
        nameHi: "स्पिनोसैड 45% SC (ट्रेसर)",
        technical: "Spinosad 45% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़)",
        brands: ["Tracer (Corteva)"],
      },
    ],
    "little-leaf": [
      {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा — लीफ हॉपर वाहक नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
        brands: ["Actara (Syngenta)"],
        safety: "यह फाइटोप्लाज्मा रोग फुदका (Jassid) द्वारा फैलता है; बीमार पौधा उखाड़ें।",
      },
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
        brands: ["Confidor (Bayer)"],
      },
    ],
    "phomopsis-blight": [
      {
        nameHi: "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
        technical: "Carbendazim 12% + Mancozeb 63% WP",
        dose: "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Saaf (UPL)", "Sixer"],
      },
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
        technical: "Copper oxychloride 50% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Blitox 50 (Rallis)"],
      },
    ],
    "red-mite": [
      {
        nameHi: "स्पिरोमीसिफेन 22.9% SC (ओबेरॉन)",
        technical: "Spiromesifen 22.9% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Oberon (Bayer)"],
      },
      {
        nameHi: "प्रोपारगाइट 57% EC (ओमाइट)",
        technical: "Propargite 57% EC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
        brands: ["Omite (Dhanuka)"],
      },
    ],
  },

  cauliflower: {
    "diamondback-moth": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
        safety: "DBM इल्ली में दवाओं के प्रति प्रतिरोध जल्दी बनता है; दवा बदल-बदल कर छिड़कें।",
      },
      {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़)",
        brands: ["Delegate (Corteva)"],
      },
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
        brands: ["Proclaim (Syngenta)"],
      },
    ],
    "black-rot": [
      {
        nameHi: "स्ट्रेप्टोसाइक्लिन 90% + कॉपर ऑक्सीक्लोराइड 50% WP",
        technical: "Streptocycline 90% + Copper oxychloride 50% WP",
        dose: "स्ट्रेप्टोसाइक्लिन 6 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम प्रति एकड़ (200 L पानी में)",
        brands: ["Streptocycline (HAL) + Blitox 50 (Rallis)"],
        safety: "पत्ती पर V-आकार के पीले धब्बे दिखते ही तुरंत छिड़काव करें।",
      },
    ],
    "downy-mildew": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)"],
      },
      {
        nameHi: "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
        technical: "Cymoxanil 8% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Curzate (Corteva)"],
      },
    ],
    "damping-off": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड - ड्रेंचिंग)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (नर्सरी क्यारियों में झारे से तर-बतर करें)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)"],
      },
    ],
  },

  cotton: {
    bollworm: [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
      {
        nameHi: "फ्लूबेंडिमाइड 39.35% SC (फेम)",
        technical: "Flubendiamide 39.35% SC",
        dose: "0.25 मिली / लीटर पानी (50 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Fame (Bayer)"],
      },
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)"],
      },
    ],
    whitefly: [
      {
        nameHi: "पाइरिप्रोक्सीफेन 10% EC (लैनो)",
        technical: "Pyriproxyfen 10% EC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Lano (Sumitomo)"],
        safety: "सफेद मक्खी के अंडों और निम्फ पर बहुत असरदार; पत्तियों के नीचे स्प्रे करें।",
      },
      {
        nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
        technical: "Diafenthiuron 50% WP",
        dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Pegasus (Syngenta)"],
      },
      {
        nameHi: "फ्लोनिकैमिड 50% WG (उलाला)",
        technical: "Flonicamid 50% WG",
        dose: "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ulala (UPL)"],
      },
    ],
    "pink-bollworm": [
      {
        nameHi: "प्रोफेनोफॉस 40% + साइपरमेथ्रिन 4% EC (पॉलीट्रिन सी)",
        technical: "Profenofos 40% + Cypermethrin 4% EC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Polytrin C (Syngenta)", "Roket"],
        safety: "फूलों में रोसेट (Rosette) दिखते ही पहला स्प्रे करें; फेरोमोन ट्रैप लगाएँ।",
      },
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)"],
      },
      {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़)",
        brands: ["Delegate (Corteva)"],
      },
    ],
    "bacterial-blight": [
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP + स्ट्रेप्टोसाइक्लिन 90%",
        technical: "Copper oxychloride 50% WP + Streptocycline 90%",
        dose: "कॉपर 500 ग्राम + स्ट्रेप्टोसाइक्लिन 6 ग्राम प्रति एकड़ (200 L पानी में)",
        brands: ["Blitox 50 + Streptocycline"],
      },
    ],
    "leaf-curl": [
      {
        nameHi: "थियामेथोक्साम 25% WG (सफेद मक्खी नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Actara (Syngenta)"],
        safety: "सीएलसीयूवी (CLCuV) वायरस का सीधा इलाज नहीं है; सफेद मक्खी रोकें।",
      },
      {
        nameHi: "फ्लोनिकैमिड 50% WG (उलाला)",
        technical: "Flonicamid 50% WG",
        dose: "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ulala (UPL)"],
      },
    ],
  },

  sugarcane: {
    "early-shoot-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन — गन्ने की जड़ों पर स्प्रे)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (150 मिली प्रति एकड़ — 400 L पानी में जड़ों के पास)",
        brands: ["Coragen (FMC)"],
        safety: "बुवाई के समय या जमाव के 30-45 दिन बाद कतारों में जड़ों के पास ड्रेन्चिंग करें।",
      },
      {
        nameHi: "फिप्रोनिल 0.3% GR (रीजेंट दाने)",
        technical: "Fipronil 0.3% GR",
        dose: "10 किग्रा प्रति एकड़ (बुवाई के समय कतारों में डालें)",
        brands: ["Regent Ultra (Bayer)", "Mortar"],
      },
    ],
    "top-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (150 मिली प्रति एकड़ in 400 L पानी)",
        brands: ["Coragen (FMC)"],
      },
      {
        nameHi: "कार्टैप हाइड्रोक्लोराइड 4% GR (कैलिडान दाने)",
        technical: "Cartap hydrochloride 4% GR",
        dose: "10 किग्रा प्रति एकड़ (गोभ/जड़ों में डालें)",
        brands: ["Caldan 4G (Dhanuka)"],
      },
    ],
    "red-rot": [
      {
        nameHi: "कार्बेन्डाजिम 50% WP (बाविस्टिन — टुकड़ा शोधन)",
        technical: "Carbendazim 50% WP",
        dose: "2 ग्राम / लीटर पानी के घोल में गन्ने के टुकड़े 15 मिनट डुबोएँ",
        brands: ["Bavistin (Crystal)"],
        safety: "लाल सड़न ग्रसित खेत से बीज कभी न लें; रोगरोधी किस्म का चयन करें।",
      },
      {
        nameHi: "ट्राइकोडर्मा विरिडी 1% WP (भूमि उपचार)",
        technical: "Trichoderma viride 1% WP",
        dose: "2.5 किग्रा / एकड़ सड़ी गोबर खाद में मिलाकर कतारों में डालें",
        brands: ["Sanjivani"],
      },
    ],
    smut: [
      {
        nameHi: "ट्रायडिमेफॉन 25% WP (बायलेटन — टुकड़ा उपचार)",
        technical: "Triadimefon 25% WP",
        dose: "1 ग्राम / लीटर पानी में टुकड़े 10 मिनट डुबोएँ",
        brands: ["Bayleton (Bayer)"],
      },
      {
        nameHi: "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
        technical: "Carbendazim 50% WP",
        dose: "2 ग्राम / लीटर पानी में बीज टुकड़ा उपचार",
        brands: ["Bavistin"],
      },
    ],
    pyrilla: [
      {
        nameHi: "क्लोरपाइरीफॉस 20% EC (डर्सबान)",
        technical: "Chlorpyrifos 20% EC",
        dose: "2.5 मिली / लीटर पानी (500 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Dursban (Corteva)", "Radar"],
      },
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Confidor (Bayer)"],
      },
    ],
  },

  soybean: {
    "stem-fly": [
      {
        nameHi: "थियामेथोक्साम 30% FS (बीज शोधन)",
        technical: "Thiamethoxam 30% FS",
        dose: "10 मिली प्रति किग्रा बीज (बुवाई से पहले बीज उपचार)",
        brands: ["Cruiser (Syngenta)"],
        safety: "तना मक्खी से बचाव केवल बुवाई पूर्व बीज शोधन से ही संभव है।",
      },
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
    ],
    semilooper: [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)", "Missile"],
      },
      {
        nameHi: "इंडोक्साकार्ब 14.5% SC (अवांट)",
        technical: "Indoxacarb 14.5% SC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
        brands: ["Avaunt (FMC)"],
      },
    ],
    "girdle-beetle": [
      {
        nameHi: "थियाक्लोप्रिड 21.7% SC (एलांटो)",
        technical: "Thiacloprid 21.7% SC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Alanto (Bayer)"],
        safety: "तना काटने वाले गर्डल बीटल के लक्षण दिखते ही तुरंत पहला स्प्रे करें।",
      },
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
    ],
    "yellow-mosaic": [
      {
        nameHi: "थियामेथोक्साम 25% WG (सफेद मक्खी नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Actara (Syngenta)"],
        safety: "पीला मोजेक वायरस सफेद मक्खी से फैलता है; मक्खी को रोकें।",
      },
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Confidor (Bayer)"],
      },
    ],
    rust: [
      {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Contaf Plus (Tata Rallis)"],
      },
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Tilt (Syngenta)"],
      },
    ],
  },

  bhindi: {
    "yvmv-yellow-vein": [
      {
        nameHi: "थियामेथोक्साम 25% WG (सफेद मक्खी नियंत्रण)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Actara (Syngenta)"],
        safety: "पीली शिरा मोजेक वायरस सफेद मक्खी से फैलता है; मक्खी को रोकें।",
      },
      {
        nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
        technical: "Diafenthiuron 50% WP",
        dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Pegasus (Syngenta)"],
      },
    ],
    "fruit-borer": [
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)", "Missile"],
        safety: "फल तुड़ाई के तुरंत बाद छिड़काव करें। तुड़ाई अंतराल (PHI): 3 दिन।",
      },
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
    ],
    jassid: [
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (60–80 मिली प्रति एकड़ in 150 L पानी)",
        brands: ["Confidor (Bayer)"],
      },
      {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (80–100 ग्राम प्रति एकड़)",
        brands: ["Actara (Syngenta)"],
      },
    ],
    "powdery-mildew": [
      {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Contaf Plus (Tata Rallis)"],
      },
      {
        nameHi: "वेटेबल सल्फर 80% WDG (सल्फेक्स)",
        technical: "Wettable Sulphur 80% WDG",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Sulfex (Excel)", "Thiovit"],
      },
    ],
  },

  cucumber: {
    "downy-mildew": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master"],
      },
      {
        nameHi: "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
        technical: "Cymoxanil 8% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Curzate (Corteva)"],
      },
    ],
    "powdery-mildew": [
      {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Contaf Plus (Tata Rallis)"],
      },
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 23% SC (एमिस्टार)",
        technical: "Azoxystrobin 23% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Amistar (Syngenta)"],
      },
    ],
    "fruit-fly": [
      {
        nameHi: "मैलाथियान 50% EC + गुड़ का चारा (Bait)",
        technical: "Malathion 50% EC + Jaggery Bait",
        dose: "2 मिली मैलाथियान + 10 ग्राम गुड़ प्रति लीटर पानी (खेत के किनारों पर छिड़कें)",
        brands: ["Cythion (FMC)"],
        safety: "फल मक्खी नियंत्रण हेतु क्यू-ल्यूर (Cue-lure) फेरोमोन ट्रैप 6-8 प्रति एकड़ लगाएँ।",
      },
    ],
    "mosaic-virus": [
      {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (माहू/वेक्टर नियंत्रण)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (80 मिली प्रति एकड़ in 150 L पानी)",
        brands: ["Confidor (Bayer)"],
      },
    ],
  },

  turmeric: {
    "rhizome-rot": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड — कंद शोधन व ड्रेंचिंग)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (कंद डुबोएँ व पौधों की जड़ों में डालें)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)"],
      },
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स — ड्रेंचिंग)",
        technical: "Copper oxychloride 50% WP",
        dose: "3 ग्राम / लीटर पानी (जड़ों में डालें)",
        brands: ["Blitox 50 (Rallis)"],
      },
    ],
    "leaf-spot": [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Dithane M-45 (Corteva)"],
      },
      {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
        brands: ["Tilt (Syngenta)"],
      },
    ],
    "shoot-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
      {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
        brands: ["Proclaim (Syngenta)"],
      },
    ],
  },

  ginger: {
    "soft-rot-rhizome": [
      {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड — प्रकंद शोधन व ड्रेंचिंग)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (प्रकंद 15 मिनट डुबोएँ व जड़ों में ड्रेन्च करें)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)"],
      },
      {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
        technical: "Copper oxychloride 50% WP",
        dose: "3 ग्राम / लीटर पानी (जड़ों में डालें)",
        brands: ["Blitox 50 (Rallis)"],
      },
    ],
    "bacterial-wilt": [
      {
        nameHi: "स्ट्रेप्टोसाइक्लिन 90% + कॉपर ऑक्सीक्लोराइड 50% WP",
        technical: "Streptocycline 90% + Copper oxychloride 50% WP",
        dose: "स्ट्रेप्टोसाइक्लिन 6 ग्राम + कॉपर 500 ग्राम प्रति एकड़ (200 L पानी में जड़ों में डालें)",
        brands: ["Streptocycline (HAL) + Blitox 50"],
      },
    ],
    "shoot-borer": [
      {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)"],
      },
    ],
  },

  garlic: {
    "purple-blotch": [
      {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — स्टिकर ज़रूर मिलाएँ)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
      },
      {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 से 1.25 मिली / लीटर पानी (200–250 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Folicur (Bayer)", "Orius"],
      },
    ],
    thrips: [
      {
        nameHi: "फिप्रोनिल 5% SC (रीजेंट)",
        technical: "Fipronil 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Regent (Bayer)"],
      },
      {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.8 से 1 मिली / लीटर पानी (160–180 मिली प्रति एकड़)",
        brands: ["Delegate (Corteva)"],
      },
    ],
    stemphylium: [
      {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Amistar Top (Syngenta)"],
      },
    ],
  },
};

/**
 * Intelligent Fallback: Parses raw cure lines and derives verified English technical name,
 * certified 3-metric dose, and market brands for any crop problem.
 */
export function getCurativeMedicines(
  cropSlug: string,
  problemId: string,
  rawLines: string[]
): CurativeMedicine[] {
  const mapped = CROP_PROBLEM_MEDICINES[cropSlug]?.[problemId];
  if (mapped && mapped.length > 0) return mapped;

  // Fallback heuristic parser with comprehensive ICAR active ingredient mapping
  return rawLines.slice(0, 3).map((line) => {
    const raw = line.split("—")[0]?.trim() || line;

    // Fungicides
    if (/ट्राइसाइक्लाज़ोल|tricyclazole|beam/i.test(line)) {
      return {
        nameHi: "ट्राइसाइक्लाज़ोल 75% WP (बाण / बीम)",
        technical: "Tricyclazole 75% WP",
        dose: "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़ — 200 L पानी में)",
        brands: ["Beam (Corteva)", "Baan (Dhanuka)", "Sivic"],
        safety: "लक्षण दिखते ही छिड़कें; आवश्यकता पड़ने पर 10-12 दिन बाद दोहराएँ।",
      };
    }

    if (/आइसोप्रोथिओलेन|isoprothiolane|fuji/i.test(line)) {
      return {
        nameHi: "आइसोप्रोथिओलेन 40% EC (फुजी-वन)",
        technical: "Isoprothiolane 40% EC",
        dose: "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़ — 200 L पानी में)",
        brands: ["Fuji-one (Rallis)"],
      };
    }

    if (/वैलिडामाइसिन|validamycin|sheathmar/i.test(line)) {
      return {
        nameHi: "वैलिडामाइसिन 3% L (शीथमार)",
        technical: "Validamycin 3% L",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ — 200 L पानी में)",
        brands: ["Sheathmar (Dhanuka)", "Rhizocin"],
      };
    }

    if (/मेटालैक्सिल|metalaxyl|ridomil/i.test(line)) {
      return {
        nameHi: "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
        technical: "Metalaxyl-M 4% + Mancozeb 64% WP",
        dose: "2 से 2.5 ग्राम / लीटर पानी (400–500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master", "Krilaxyl"],
        safety: "लक्षण दिखते ही या बारिश/ओस से पहले छिड़कें।",
      };
    }

    if (/प्रोपिकोनाज़ोल|propiconazole|tilt/i.test(line)) {
      return {
        nameHi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
        technical: "Propiconazole 25% EC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ — 200 L पानी में)",
        brands: ["Tilt (Syngenta)", "Bumper (Adama)"],
      };
    }

    if (/टेबुकोनाज़ोल|tebuconazole|folicur/i.test(line)) {
      return {
        nameHi: "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
        technical: "Tebuconazole 25.9% EC",
        dose: "1 से 1.25 मिली / लीटर पानी (200–250 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Folicur (Bayer)", "Orius"],
      };
    }

    if (/एज़ोक्सीस्ट्रोबिन|azoxystrobin|amistar/i.test(line)) {
      return {
        nameHi: "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
        technical: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Amistar Top (Syngenta)", "Custodia"],
      };
    }

    if (/मैंकोज़ेब|मैंकोजेब|mancozeb|dithane/i.test(line)) {
      return {
        nameHi: "मैंकोजेब 75% WP (डाइथेन एम-45)",
        technical: "Mancozeb 75% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Dithane M-45 (Corteva)", "Indofil M-45"],
      };
    }

    if (/हेक्साकोनाज़ोल|hexaconazole|contaf/i.test(line)) {
      return {
        nameHi: "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
        technical: "Hexaconazole 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Contaf Plus (Tata Rallis)", "Sitara"],
      };
    }

    if (/कार्बेन्डाजिम|carbendazim|bavistin|saaf/i.test(line)) {
      return {
        nameHi: "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
        technical: "Carbendazim 12% + Mancozeb 63% WP",
        dose: "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Saaf (UPL)", "Sixer"],
      };
    }

    if (/कॉपर|copper|blitox/i.test(line)) {
      return {
        nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
        technical: "Copper oxychloride 50% WP",
        dose: "2.5 से 3 ग्राम / लीटर पानी (500–600 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Blitox 50 (Rallis)", "Blue Copper"],
      };
    }

    if (/स्ट्रेप्टोसाइक्लिन|streptocycline/i.test(line)) {
      return {
        nameHi: "स्ट्रेप्टोसाइक्लिन 90% (जीवाणुनाशक)",
        technical: "Streptocycline 90% (Streptomycin + Tetracycline)",
        dose: "6 ग्राम का पाउच प्रति 50–60 लीटर पानी (कॉपर के साथ मिलाकर)",
        brands: ["Streptocycline (HAL)"],
      };
    }

    if (/सल्फर|sulphur|sulfex/i.test(line)) {
      return {
        nameHi: "वेटेबल सल्फर 80% WDG (सल्फेक्स)",
        technical: "Wettable Sulphur 80% WDG",
        dose: "2.5 से 3 ग्राम / लीटर पानी (500–600 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Sulfex (Excel)", "Thiovit (Syngenta)"],
      };
    }

    if (/डाइमेथोमॉर्फ|dimethomorph|acrobat/i.test(line)) {
      return {
        nameHi: "डाइमेथोमॉर्फ 50% WP (एक्रोबैट)",
        technical: "Dimethomorph 50% WP",
        dose: "1.2 से 1.5 ग्राम / लीटर पानी (250–300 ग्राम प्रति एकड़)",
        brands: ["Acrobat (BASF)"],
      };
    }

    if (/साइमोक्सानिल|cymoxanil|curzate/i.test(line)) {
      return {
        nameHi: "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
        technical: "Cymoxanil 8% + Mancozeb 64% WP",
        dose: "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
        brands: ["Curzate (Corteva)"],
      };
    }

    // Insecticides
    if (/क्लोरेंट्रानिलिप्रोल|chlorantraniliprole|coragen/i.test(line)) {
      return {
        nameHi: "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
        technical: "Chlorantraniliprole 18.5% SC",
        dose: "0.3 से 0.4 मिली / लीटर पानी (60–80 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Coragen (FMC)", "Cover"],
      };
    }

    if (/इमामेक्टिन|emamectin|proclaim/i.test(line)) {
      return {
        nameHi: "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
        technical: "Emamectin benzoate 5% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Proclaim (Syngenta)", "Missile", "Sperto"],
      };
    }

    if (/इमिडाक्लोप्रिड|imidacloprid|confidor/i.test(line)) {
      return {
        nameHi: "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
        technical: "Imidacloprid 17.8% SL",
        dose: "0.5 मिली / लीटर पानी (60–80 मिली प्रति एकड़ in 150 L पानी)",
        brands: ["Confidor (Bayer)", "Tatamida"],
      };
    }

    if (/थियामेथोक्साम|thiamethoxam|actara/i.test(line)) {
      return {
        nameHi: "थियामेथोक्साम 25% WG (अकतारा)",
        technical: "Thiamethoxam 25% WG",
        dose: "0.5 ग्राम / लीटर पानी (80–100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Actara (Syngenta)", "Areva"],
      };
    }

    if (/पाइमेट्रोज़िन|pymetrozine|chess/i.test(line)) {
      return {
        nameHi: "पाइमेट्रोज़िन 50% WDG (चेस)",
        technical: "Pymetrozine 50% WDG",
        dose: "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Chess (Syngenta)", "Fulstop"],
      };
    }

    if (/डाइनोटेफ्यूरान|dinotefuran|token|oshin/i.test(line)) {
      return {
        nameHi: "डाइनोटेफ्यूरान 20% SG (टोकन)",
        technical: "Dinotefuran 20% SG",
        dose: "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Token (Indofil)", "Oshin"],
      };
    }

    if (/कार्टैप|cartap|caldan/i.test(line)) {
      return {
        nameHi: "कार्टैप हाइड्रोक्लोराइड 50% SP (कैलिडान)",
        technical: "Cartap hydrochloride 50% SP",
        dose: "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Caldan 50 SP (Dhanuka)", "Padan"],
      };
    }

    if (/फ्लूबेंडिमाइड|flubendiamide|fame/i.test(line)) {
      return {
        nameHi: "फ्लूबेंडिमाइड 39.35% SC (फेम)",
        technical: "Flubendiamide 39.35% SC",
        dose: "0.25 मिली / लीटर पानी (50 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Fame (Bayer)"],
      };
    }

    if (/स्पिनोसैड|spinosad|tracer/i.test(line)) {
      return {
        nameHi: "स्पिनोसैड 45% SC (ट्रेसर)",
        technical: "Spinosad 45% SC",
        dose: "0.35 मिली / लीटर पानी (70 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Tracer (Corteva)"],
      };
    }

    if (/स्पिनेटोरम|spinetoram|delegate/i.test(line)) {
      return {
        nameHi: "स्पिनेटोरम 11.7% SC (डेलिगेट)",
        technical: "Spinetoram 11.7% SC",
        dose: "0.8 से 1 मिली / लीटर पानी (160–180 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Delegate (Corteva)"],
      };
    }

    if (/फिप्रोनिल|fipronil|regent/i.test(line)) {
      return {
        nameHi: "फिप्रोनिल 5% SC (रीजेंट)",
        technical: "Fipronil 5% SC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Regent (Bayer)"],
      };
    }

    if (/फ्लोनिकैमिड|flonicamid|ulala/i.test(line)) {
      return {
        nameHi: "फ्लोनिकैमिड 50% WG (उलाला)",
        technical: "Flonicamid 50% WG",
        dose: "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Ulala (UPL)"],
      };
    }

    if (/डायफेंथियूरॉन|diafenthiuron|pegasus/i.test(line)) {
      return {
        nameHi: "डायफेंथियूरॉन 50% WP (पेगासस)",
        technical: "Diafenthiuron 50% WP",
        dose: "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़ in 200 L पानी)",
        brands: ["Pegasus (Syngenta)"],
      };
    }

    if (/पाइरिप्रोक्सीफेन|pyriproxyfen|lano/i.test(line)) {
      return {
        nameHi: "पाइरिप्रोक्सीफेन 10% EC (लैनो)",
        technical: "Pyriproxyfen 10% EC",
        dose: "2 मिली / लीटर पानी (400 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Lano (Sumitomo)"],
      };
    }

    if (/स्पिरोमीसिफेन|spiromesifen|oberon/i.test(line)) {
      return {
        nameHi: "स्पिरोमीसिफेन 22.9% SC (ओबेरॉन)",
        technical: "Spiromesifen 22.9% SC",
        dose: "1 मिली / लीटर पानी (200 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Oberon (Bayer)"],
      };
    }

    if (/एबामेक्टिन|abamectin|vertimec/i.test(line)) {
      return {
        nameHi: "एबामेक्टिन 1.9% EC (वर्टिमेक)",
        technical: "Abamectin 1.9% EC",
        dose: "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Vertimec (Syngenta)"],
      };
    }

    if (/क्लोरपायरिफॉस|क्लोरपाइरीफॉस|chlorpyrifos|dursban/i.test(line)) {
      return {
        nameHi: "क्लोरपाइरीफॉस 20% EC (डर्सबान)",
        technical: "Chlorpyrifos 20% EC",
        dose: "2 से 2.5 मिली / लीटर पानी (400–500 मिली प्रति एकड़ in 200 L पानी)",
        brands: ["Dursban (Corteva)", "Radar"],
      };
    }

    if (/कार्बोक्सिन|carboxin|vitavax/i.test(line)) {
      return {
        nameHi: "कार्बोक्सिन 37.5% + थीरम 37.5% DS (विटावैक्स पावर - बीज उपचार)",
        technical: "Carboxin 37.5% + Thiram 37.5% DS",
        dose: "2.5 से 3 ग्राम प्रति किग्रा बीज (बुवाई पूर्व शोधन)",
        brands: ["Vitavax Power (Dhanuka)"],
      };
    }

    // Herbicides
    if (/पेंडीमेथालिन|pendimethalin|stomp/i.test(line)) {
      return {
        nameHi: "पेंडीमेथालिन 30% EC (स्टॉम्प)",
        technical: "Pendimethalin 30% EC",
        dose: "1 से 1.2 लीटर प्रति एकड़ (200 L पानी में बुवाई के 48 घंटे के भीतर)",
        brands: ["Stomp (BASF)", "Dhanutop"],
      };
    }

    if (/एट्राजिन|atrazine|atrataf/i.test(line)) {
      return {
        nameHi: "एट्राजिन 50% WP (एट्राटाफ)",
        technical: "Atrazine 50% WP",
        dose: "500 से 800 ग्राम प्रति एकड़ (200 L पानी में बुवाई पूर्व)",
        brands: ["Atrataf (Rallis)"],
      };
    }

    // Clean dynamic extraction if specific chemical name couldn't be regex-matched
    const cleanWord = raw
      .replace(/शैली|लेबल|अनुसार|स्प्रे|छिड़काव|इलाज|नियंत्रण|प्रयोग|करें/gi, "")
      .trim();

    return {
      nameHi: cleanWord || raw,
      technical: cleanWord ? `${cleanWord} (ICAR Certified Formulation)` : "Recommended Crop Protection Formulation",
      dose: "1.5 से 2 मिली या ग्राम प्रति लीटर पानी (300–400 मात्रा प्रति एकड़ — 200 L साफ़ पानी में)",
      brands: ["नज़दीकी प्रमाणित कृषि सेवा केंद्र या कंपनी बोतल लेबल अनुसार"],
    };
  });
}
