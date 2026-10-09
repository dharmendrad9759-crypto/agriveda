/**
 * Crop Guide (Fasal Pustika) Data & Interfaces
 * 4 Core Stages: Shuruat (शुरुआत), Lagana (लगाना), Dekhbhal (देखभाल), Suraksha (सुरक्षा और कटाई)
 * Mapped to multi-batch active ingredients (FRAC / IRAC groups).
 */

export interface ChemicalControlItem {
  chemical_name: string;
  active_ingredient?: string;
  frac_irac_group?: string;
  dosage: string;
  volume: string;
  per_volume: string;
  waiting_period_days?: number;
  safety_note?: string;
}

export interface PestAndDiseaseItem {
  pest_id: string;
  pest_name: string;
  scientific_name?: string;
  category?: "pest" | "disease";
  identification_text: string;
  damage_nature: string;
  images: string[];
  organic_control: string;
  chemical_control: ChemicalControlItem[];
  etl_threshold?: string;
}

export interface CropStageItem {
  stage_id: "shuruat" | "lagana" | "dekhbhal" | "suraksha" | string;
  stage_name: string;
  stage_name_hi: string;
  stage_period?: string;
  summary?: string;
  parameters?: Record<string, string>;
  activities?: string[];
  advisories?: string[];
  pests_and_diseases?: PestAndDiseaseItem[];
}

export interface CropGuideData {
  crop_id: string;
  crop_slug: string;
  crop_name: string;
  crop_name_hi: string;
  crop_scientific_name?: string;
  cover_image?: string;
  stages: CropStageItem[];
}

export const TOMATO_CROP_GUIDE: CropGuideData = {
  crop_id: "CR_TOMATO_001",
  crop_slug: "tomato",
  crop_name: "Tomato",
  crop_name_hi: "टमाटर",
  crop_scientific_name: "Solanum lycopersicum",
  cover_image: "/images/crops/tomato.jpg",
  stages: [
    {
      stage_id: "shuruat",
      stage_name: "Shuruat (Nursery & Seed Treatment)",
      stage_name_hi: "1. शुरुआत (बीज चयन व नर्सरी)",
      stage_period: "दिन 0–25 (बीज बुवाई से नर्सरी)",
      summary: "उन्नत संकर किस्मों का चयन, बीज शोधन और उठी हुई क्यारियों (Raised Beds) पर नर्सरी तैयार करना।",
      parameters: {
        "तापमान (Temperature)": "20°C - 26°C (अंकुरण हेतु आदर्श)",
        "बीज दर (Seed Rate)": "100-150 ग्राम/एकड़ (संकर बीज)",
        "मिट्टी का pH (Soil pH)": "6.0 - 7.0 (दोमट/बलुई दोमट)",
        "क्यारी की ऊंचाई": "15 सेमी उठी हुई क्यारी (डैम्पिंग-ऑफ बचाव)"
      },
      activities: [
        "ट्राइकोडर्मा विरिडी @ 5-10 ग्राम/किग्रा बीज या थायरम + कार्बेन्डाजिम @ 2 ग्राम/किग्रा से बीज उपचार करें।",
        "नर्सरी क्यारी में सड़ी गोबर खाद व 40-50 मेश की नायलॉन नेट से कीट-रोधी ढकना (सफेद मक्खी बचाव)।",
        "रोपाई से 5–7 दिन पहले सिंचाई कम करके पौधों को हार्डन (Harden) करें।"
      ],
      advisories: [
        "डैम्पिंग-ऑफ (आर्द्र गलन) से बचाव के लिए नर्सरी में जलभराव कभी न होने दें।",
        "नर्सरी अवस्था से ही पीले चिपचिपे ट्रैप लगाकर सफेद मक्खी की निगरानी रखें।"
      ]
    },
    {
      stage_id: "lagana",
      stage_name: "Lagana (Transplanting & Field Preparation)",
      stage_name_hi: "2. लगाना (खेत तैयारी व रोपाई)",
      stage_period: "दिन 25–40 (DAT 0–15)",
      summary: "गहरी जुताई, बेसल उर्वरक प्रबंधन, मल्चिंग और 25-30 दिन पुरानी स्वस्थ पौध की रोपाई।",
      parameters: {
        "पौध की उम्र (Age)": "25–30 दिन (4-5 सच्ची पत्तियां)",
        "पौध से पौध दूरी": "45–60 सेमी",
        "कतार से कतार दूरी": "75–90 सेमी (स्टेकिंग हेतु 90-120 सेमी)",
        "बेसल खाद (Basal)": "DAP 50 kg + MOP 30 kg + ZnSO₄ 10 kg/एकड़"
      },
      activities: [
        "खेत की 2-3 गहरी जुताई कर 8-10 टन अच्छी सड़ी गोबर की खाद मिलाएं।",
        "रोपाई शाम के समय (4 बजे के बाद) करें ताकि पौधे धूप के तनाव से बचें।",
        "रोपाई के तुरंत बाद हल्की सिंचाई करें और 3-4 दिन तक पर्याप्त नमी बनाए रखें।"
      ],
      advisories: [
        "सिल्वर-ब्लैक प्लास्टिक मल्चिंग (25-30 माइक्रोन) से खरपतवार और नमी की हानि 80% कम होती है।",
        "रोपाई के 15वें दिन से बांस या तार द्वारा सहारा (Staking) देने की योजना शुरू करें।"
      ]
    },
    {
      stage_id: "dekhbhal",
      stage_name: "Dekhbhal (Nourishment & Growth)",
      stage_name_hi: "3. देखभाल (पोषण, सिंचाई व बढ़वार)",
      stage_period: "दिन 40–80 (DAT 15–55)",
      summary: "संतुलित नाइट्रोजन व पोटाश टॉप-ड्रेसिंग, नियमित ड्रिप सिंचाई और सूक्ष्म पोषक तत्व छिड़काव।",
      parameters: {
        "सिंचाई अंतराल (Irrigation)": "हर 4-6 दिन पर (मिट्टी की नमी अनुसार)",
        "नाइट्रोजन टॉप-ड्रेस": "यूरिया 30-35 kg/एकड़ (DAT 20 व DAT 45)",
        "कैल्शियम-बोरॉन स्प्रे": "फूल आने के समय (BER रोग रोकथाम हेतु)",
        "स्टेकिंग (सहारा)": "निचली 15-20 सेमी की साइड शाखाएं (Suckers) हटाएं"
      },
      activities: [
        "फूल आने की अवस्था में खेत में कभी भी जल-तनाव (Moisture stress) न आने दें।",
        "ब्लॉसम एंड रॉट (फल का नीचे से काला पड़ना) रोकने हेतु कैल्शियम नाइट्रेट 0.5% + बोरॉन 0.2% का फोलियर स्प्रे करें।",
        "हल्की निराई-गुड़ाई कर जड़ों पर मिट्टी चढ़ाएं और खरपतवार नष्ट करें।"
      ],
      advisories: [
        "अधिक नाइट्रोजन देने से वानस्पतिक वृद्धि अत्यधिक होती है और फूल झड़ने लगते हैं।",
        "ड्रिप सिंचाई से पानी और उर्वरक (Fertigation) दोनों की 40% तक बचत होती है।"
      ]
    },
    {
      stage_id: "suraksha",
      stage_name: "Suraksha aur Katai (Crop Protection & Harvest)",
      stage_name_hi: "4. सुरक्षा और कटाई (कीट, रोग व तुड़ाई)",
      stage_period: "दिन 80–150+ (फूल, फल भराव व तुड़ाई)",
      summary: "सफेद मक्खी, फल छेदक इल्ली, झुलसा रोग की वैज्ञानिक रोकथाम (FRAC/IRAC रोटेशन) और समय पर तुड़ाई।",
      parameters: {
        "तुड़ाई चक्र (Harvesting)": "हर 3-4 दिन में (सुबह या शाम के समय)",
        "अनुमानित उपज": "250-350 क्विंटल/एकड़ (उन्नत संकर)",
        "PHI (प्रतीक्षा अवधि)": "स्प्रे और तुड़ाई के बीच दवा के लेबल अनुसार अंतर रखें",
        "ग्रेडिंग": "रंग व आकार के आधार पर छंटाई कर क्रेट्स में पैक करें"
      },
      activities: [
        "प्रभावित फलों व पत्तियों को तोड़कर खेत से बाहर गड्ढे में दबाएं।",
        "कीटों में दवा के प्रति प्रतिरोध (Resistance) रोकने के लिए एक ही समूह की दवा बार-बार न दोहराएं।",
        "मंडी की दूरी के अनुसार फल की परिपक्वता (Breaker / Pink / Full Red) अवस्था में तुड़ाई करें।"
      ],
      advisories: [
        "सफेद मक्खी ToLCV लीफ कर्ल वायरस की मुख्य संवाहक है, अतः इसे शुरुआती अवस्था में ही रोकें।",
        "फल छेदक इल्ली के लिए फेरोमोन ट्रैप 4-5 प्रति एकड़ लगाएं।"
      ],
      pests_and_diseases: [
        {
          pest_id: "pest_whitefly",
          pest_name: "सफेद मक्खी (Whitefly / Ras Chusak Keet)",
          scientific_name: "Bemisia tabaci",
          category: "pest",
          identification_text: "पत्तियों के निचले भाग में 1-1.5 मिमी लंबे, सफेद पंखों वाले छोटे पतंगे झुंड में बैठते हैं। पौधे को हिलाने पर सफेद बादलों की तरह उड़ते हैं। यह ToLCV (टमाटर पर्ण कुंचन / लीफ कर्ल वायरस) का मुख्य वाहक कीट है।",
          damage_nature: "वयस्क व शिशु पत्तियों से रस चूसते हैं जिससे पत्तियां सिकुड़कर प्यालेनुमा ऊपर मुड़ जाती हैं। कीट मीठा चिपचिपा मल छोड़ते हैं जिस पर काली फफूंद (Sooty Mold) छा जाती है और प्रकाश संश्लेषण रुक जाता है।",
          images: [
            "/images/jobs/job-pest.jpg",
            "/images/crops/tomato.jpg"
          ],
          organic_control: "नीम का तेल (Azadirachtin 1500–5000 ppm) @ 2.5–3 मिली/लीटर पानी में घोलकर छिड़कें। खेत में 8–10 पीले चिपचिपे ट्रैप (Yellow Sticky Traps) प्रति एकड़ लगाएं। प्राकृतिक मित्र कीट जैसे लेडीबर्ड बीटल व सिरफिड मक्खी को बढ़ावा दें।",
          etl_threshold: "5-8 मक्खियां प्रति पत्ती या खेत में वायरस की शुरुआती सुगबुगाहट",
          chemical_control: [
            {
              chemical_name: "Flonicamid 50% WG (Ulala)",
              active_ingredient: "Flonicamid",
              frac_irac_group: "IRAC 29 (Chordotonal Organ Modulator)",
              dosage: "0.3–0.4 ग्राम",
              volume: "1 लीटर पानी (60–80 ग्राम/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 3,
              safety_note: "पत्तियों की निचली सतह पर पूरी तरह पहुंचे ऐसी नोजल से स्प्रे करें।"
            },
            {
              chemical_name: "Diafenthiuron 50% WP (Pegasus)",
              active_ingredient: "Diafenthiuron",
              frac_irac_group: "IRAC 12A (Mitochondrial ATP Synthase Inhibitor)",
              dosage: "1.25 ग्राम",
              volume: "1 लीटर पानी (250 ग्राम/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 5,
              safety_note: "तेज़ दोपहर या 35°C से अधिक तापमान पर छिड़काव न करें।"
            },
            {
              chemical_name: "Pyriproxyfen 10% EC (Lano)",
              active_ingredient: "Pyriproxyfen",
              frac_irac_group: "IRAC 7C (Juvenile Hormone Mimics)",
              dosage: "1.5–2.0 मिली",
              volume: "1 लीटर पानी (300 मिली/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 5,
              safety_note: "अंडे व निम्फ अवस्था को समाप्त करने के लिए सर्वोत्तम।"
            }
          ]
        },
        {
          pest_id: "pest_fruit_borer",
          pest_name: "फल छेदक इल्ली (Fruit Borer / Helicoverpa)",
          scientific_name: "Helicoverpa armigera",
          category: "pest",
          identification_text: "हल्के भूरे से हरे रंग की इल्लियां जिनके शरीर पर धारियां होती हैं। रात में सक्रिय रहने वाले पतंगे पत्तियों व फूलों पर अकेले-अकेले हल्के पीले अंडे देते हैं।",
          damage_nature: "शुरुआत में छोटी इल्ली कोमल पत्तियां व कलियां खाती है। बाद में फल में गोल छेद बनाकर आधा शरीर अंदर घुसाकर गूदा खाती है, जिससे फल सड़कर गिर जाता है। एक इल्ली 4-6 फलों को खराब करती है।",
          images: [
            "/images/jobs/job-crops-hero.jpg",
            "/images/crops/tomato.jpg"
          ],
          organic_control: "हेलिकोवर्पा फेरोमोन ट्रैप (Helilure) 4-5 प्रति एकड़ लगाएं। HaNPV (250 LE) @ 1.5 मिली/लीटर या बैसिलस थुरिंजिएंसिस (Bt) @ 2 ग्राम/लीटर का शाम को छिड़काव। गेंदे के फूल की इंटरक्रॉपिंग (Trap Crop) करें।",
          etl_threshold: "1 इल्ली प्रति पौधा या 5% फल क्षति दिखने पर",
          chemical_control: [
            {
              chemical_name: "Chlorantraniliprole 18.5% SC (Coragen)",
              active_ingredient: "Chlorantraniliprole",
              frac_irac_group: "IRAC 28 (Ryanodine Receptor Modulator)",
              dosage: "0.3–0.4 मिली",
              volume: "1 लीटर पानी (60 मिली/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 3,
              safety_note: "लंबे समय तक सुरक्षा देता है। फूल व छोटे फल बनते ही पहला स्प्रे लें।"
            },
            {
              chemical_name: "Emamectin Benzoate 5% SG (Proclaim)",
              active_ingredient: "Emamectin Benzoate",
              frac_irac_group: "IRAC 6 (Glutamate-gated Chloride Channel Allosteric Modulator)",
              dosage: "0.4–0.5 ग्राम",
              volume: "1 लीटर पानी (80–100 ग्राम/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 3,
              safety_note: "शाम के समय छिड़काव करें जब इल्ली सक्रिय हो।"
            },
            {
              chemical_name: "Flubendiamide 39.35% SC (Fame)",
              active_ingredient: "Flubendiamide",
              frac_irac_group: "IRAC 28 (Ryanodine Receptor Modulator)",
              dosage: "0.2–0.25 मिली",
              volume: "1 लीटर पानी (40–50 मिली/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 5,
              safety_note: "लगातार IRAC 28 न दोहराएं, Emamectin या Indoxacarb से रोटेट करें।"
            }
          ]
        },
        {
          pest_id: "disease_blight",
          pest_name: "अगेती व पछेती झुलसा (Early & Late Blight)",
          scientific_name: "Alternaria solani / Phytophthora infestans",
          category: "disease",
          identification_text: "अगेती झुलसा में निचली पत्तियों पर गोल संकेन्द्री छल्ले (Target Board spots) बनते हैं। पछेती झुलसा में पत्तियों के किनारों पर पानी से भीगे हुए भूरे-काले धब्बे और निचली सतह पर सफेद फफूंद दिखती है।",
          damage_nature: "धब्बे तेजी से फैलकर पूरी पत्ती और तने को जला देते हैं। पौधे झुलसकर सूख जाते हैं और फलों पर गहरे धंसे हुए कत्थई-काले धब्बे पड़कर फल सड़ जाते हैं।",
          images: [
            "/images/jobs/job-fertilizer.jpg",
            "/images/crops/tomato.jpg"
          ],
          organic_control: "ट्राइकोडर्मा हार्जिएनम (Trichoderma harzianum) @ 5 ग्राम/लीटर पानी का फोलियर स्प्रे। रोगग्रस्त पत्तियों व डंठलों को तोड़कर खेत से दूर जलाएं। पौधों पर ऊपर से पानी छिड़कने (Overhead sprinkling) से बचें।",
          etl_threshold: "मौसम में बादल, नमी >80% और पत्ती पर पहला धब्बा दिखते ही",
          chemical_control: [
            {
              chemical_name: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
              active_ingredient: "Azoxystrobin + Difenoconazole",
              frac_irac_group: "FRAC 11 + FRAC 3 (QoI + DMI Dual Action)",
              dosage: "1 मिली",
              volume: "1 लीटर पानी (200 मिली/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 5,
              safety_note: "अगेती व पछेती दोनों झुलसा पर उत्कृष्ट सिस्टमिक असर।"
            },
            {
              chemical_name: "Metalaxyl-M 4% + Mancozeb 64% WP (Ridomil Gold MZ 68 WP)",
              active_ingredient: "Metalaxyl-M 4% + Mancozeb 64% WP",
              frac_irac_group: "FRAC 4 + FRAC M3 (PA-fungicide + Multi-site)",
              dosage: "2.5 ग्राम",
              volume: "1 लीटर पानी (500 ग्राम/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 7,
              safety_note: "पछेती झुलसा के शुरुआती लक्षण पर तुरंत छिड़काव करें।"
            },
            {
              chemical_name: "Copper Oxychloride 50% WP (Blitox)",
              active_ingredient: "Copper Oxychloride",
              frac_irac_group: "FRAC M1 (Inorganic Multi-site Contact)",
              dosage: "2.5–3.0 ग्राम",
              volume: "1 लीटर पानी (500–600 ग्राम/एकड़)",
              per_volume: "1 लीटर पानी",
              waiting_period_days: 3,
              safety_note: "सुरक्षात्मक (Preventive) संपर्क फफूंदनाशक के रूप में सर्वोत्तम।"
            }
          ]
        }
      ]
    }
  ]
};

export function getCropGuideBySlug(slug: string): CropGuideData {
  if (slug === "tomato") {
    return TOMATO_CROP_GUIDE;
  }
  // Generic fallback built with structure
  return {
    ...TOMATO_CROP_GUIDE,
    crop_id: `CR_${slug.toUpperCase()}_001`,
    crop_slug: slug,
    crop_name: slug.charAt(0).toUpperCase() + slug.slice(1),
    crop_name_hi: slug,
  };
}
