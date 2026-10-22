/**
 * Crop Guide (Fasal Pustika) Data & Interfaces
 * 4 Core Stages: Shuruat (शुरुआत), Lagana (लगाना), Dekhbhal (देखभाल), Suraksha (सुरक्षा और कटाई)
 * Mapped to multi-batch active ingredients (FRAC / IRAC groups).
 */

import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";

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

export const PADDY_CROP_GUIDE: CropGuideData = {
  crop_id: "CR_PADDY_001",
  crop_slug: "paddy",
  crop_name: "Paddy",
  crop_name_hi: "धान",
  crop_scientific_name: "Oryza sativa",
  cover_image: "/images/crops/paddy.jpg",
  stages: [
    {
      stage_id: "shuruat",
      stage_name: "Shuruat (Nursery & Seed Treatment)",
      stage_name_hi: "1. शुरुआत (बीज शोधन व नर्सरी)",
      stage_period: "दिन 0–25 (बीज उपचार व पौध तैयार करना)",
      summary: "उन्नत बीजों का नमक पानी से चयन, फफूंदनाशक व जीवाणु शोधन और 20-25 दिन में स्वस्थ पौध तैयार करना।",
      parameters: {
        "बीज दर (Seed Rate)": "15-20 किग्रा/एकड़ (संकर) या 25 किग्रा (देसी)",
        "नर्सरी क्षेत्रफल": "1 एकड़ रोपाई हेतु 1/10 एकड़ (400 वर्ग मीटर)",
        "तापमान (Temperature)": "25°C - 35°C (आदर्श अंकुरण)",
        "बीज शोधन": "कार्बेंडाजिम + मेंकोजेब @ 2 ग्राम/किग्रा बीज"
      },
      activities: [
        "10% नमक के घोल में बीज डालकर हल्के व तैरते बीजों को अलग करें, फिर साफ पानी से 2 बार धोएं।",
        "कार्बेंडाजिम 2g/kg या ट्राइकोडर्मा 5g/kg से बीज उपचार कर 24 घंटे गीली बोरी में अंकुरित करें।",
        "नर्सरी में 10 दिन पर जिंक सल्फेट 0.5% का स्प्रे करें ताकि खैरा रोग से बचाव रहे।"
      ],
      advisories: [
        "नर्सरी में जलभराव न होने दें; शाम को हल्का पानी दें और सुबह अतिरिक्त पानी निकालें।",
        "पौध रोपाई से 5 दिन पहले नर्सरी में कार्बोफ्यूरान 3G या फिप्रोनिल 0.3G दानेदार डालें।"
      ]
    },
    {
      stage_id: "lagana",
      stage_name: "Lagana (Field Prep & Transplanting)",
      stage_name_hi: "2. लगाना (खेत तैयारी व रोपाई)",
      stage_period: "दिन 25–40 (रोपाई से 15 दिन तक)",
      summary: "खेत की पडलिंग (लेव लगाना), कतार में 20x15 सेमी पर 2-3 पौध रोपाई और बेसल उर्वरक प्रबंधन।",
      parameters: {
        "पौध उम्र (Age)": "21–25 दिन की स्वस्थ हरी पौध",
        "पौध दूरी": "20 सेमी कतार से कतार, 15 सेमी पौध से पौध",
        "पौध प्रति हिल": "2 से 3 स्वस्थ पौधे प्रति स्थान",
        "बेसल खाद (Basal)": "DAP 50 kg + MOP 20 kg + Zinc Sulphate (21%) 10 kg/एकड़"
      },
      activities: [
        "खेत में पानी भरकर 2 बार कल्टीवेटर व पाटा चलाकर अच्छी तरह लेव (Puddling) लगाएं।",
        "रोपाई 2–3 सेमी की उथली गहराई पर करें; गहरी रोपाई से कल्ले कम फूटते हैं।",
        "रोपाई के 3 दिन के अंदर खरपतवार नियंत्रण हेतु प्रेटिलाक्लोर 50 EC @ 500 मिली/एकड़ रेत में मिलाकर छिड़कें।"
      ],
      advisories: [
        "रोपाई के पहले हफ्ते खेत में 2-3 सेमी स्थिर पानी रखें ताकि जड़ें जल्दी पकड़ें।",
        "जिंक सल्फेट को कभी भी डीएपी (फॉस्फोरस) के साथ मिलाकर न डालें, 3 दिन का अंतर रखें।"
      ]
    },
    {
      stage_id: "dekhbhal",
      stage_name: "Dekhbhal (Tillering & Nutrition)",
      stage_name_hi: "3. देखभाल (कल्ले फूटना व यूरिया टॉप-ड्रेसिंग)",
      stage_period: "दिन 40–80 (कल्ले फूटने से गाभा अवस्था)",
      summary: "उचित जल स्तर (3-5 सेमी), 20-25 दिन पर पहली यूरिया टॉप ड्रेसिंग और कल्ले बढ़ाने हेतु सूक्ष्म पोषक तत्व।",
      parameters: {
        "पहली टॉप ड्रेसिंग": "रोपाई के 20-25 दिन: यूरिया 35 किग्रा/एकड़",
        "दूसरी टॉप ड्रेसिंग": "रोपाई के 40-45 दिन (गाभा पूर्व): यूरिया 35 किग्रा/एकड़",
        "जल प्रबंधन": "कल्ले फूटते समय 3-5 सेमी पानी, दाना पकते समय नमी",
        "एनपीके फोलियर": "19:19:19 @ 1 किग्रा/एकड़ (30 दिन पर)"
      },
      activities: [
        "रोपाई के 20-25 दिन पर खेत से अतिरिक्त पानी निकालकर यूरिया की पहली खुराक दें।",
        "खेत में खैरा रोग (पत्तियां कत्थई/पीली) दिखने पर चिलेटेड जिंक @ 1 ग्राम/लीटर का स्प्रे करें।",
        "गाभा अवस्था (Panicle Initiation) पर पानी की कमी बिल्कुल न होने दें।"
      ],
      advisories: [
        "फूल आने की अवस्था (Flowering) पर किसी भी दवा का तेज दोपहर में छिड़काव न करें।",
        "खेत में लगातार पानी न भरे रहने दें, बीच-बीच में 1-2 दिन हवा लगने दें (AWD विधि)।"
      ]
    },
    {
      stage_id: "suraksha",
      stage_name: "Suraksha (Pest & Disease Control)",
      stage_name_hi: "4. सुरक्षा और कटाई (कीट, रोग नियंत्रण व कटाई)",
      stage_period: "दिन 80–135 (फूल, दाना भराव व कटाई)",
      summary: "तना छेदक, पत्ता लपेटक, बीपीएच (भूरा फुदका) और ब्लास्ट रोग का वैज्ञानिक रासायनिक नियंत्रण।",
      parameters: {
        "कटाई का सही समय": "बाली के 80-85% दाने सुनहरे पीले पड़ जाने पर",
        "कटाई पूर्व जल निकासी": "कटाई से 10-12 दिन पहले खेत का पानी निकाल दें",
        "दाना नमी": "भंडारण हेतु दानों में नमी 12-14% होनी चाहिए"
      },
      activities: [
        "खेत में तना छेदक के पतंगे या सूखी गोभ (Dead Heart) दिखने पर तुरंत अनुशंसित कीटनाशक डालें।",
        "भूरा फुदका (BPH) के लिए पौधों के तने के निचले हिस्से में पानी की सतह के पास निगरानी करें।",
        "बाली निकलने पर ब्लास्ट या शीथ ब्लाइट से बचाव हेतु सुरक्षात्मक फफूंदनाशक स्प्रे करें।"
      ],
      advisories: [
        "कीटनाशक छिड़कते समय नोजल को पौधों के तने की तरफ रखें ताकि फुदका नियंत्रित हो।",
        "कटाई के बाद पराली न जलाएं, पूसा डीकंपोजर डालकर खेत में जुताई कर दें।"
      ],
      pests_and_diseases: [
        {
          pest_id: "paddy_stem_borer",
          pest_name: "तना छेदक (Yellow Stem Borer)",
          scientific_name: "Scirpophaga incertulas",
          category: "pest",
          identification_text: "सफेद या पीला पतंगा, फसल में बीच की गोभ सूख जाना (Dead heart) और बाली निकलने पर सफेद बाली (White earhead) दिखना।",
          damage_nature: "इल्ली तने के अंदर घुसकर ऊतकों को खाती है जिससे तना खोखला हो जाता है और दाना नहीं बनता।",
          images: ["/images/crops/paddy.jpg"],
          organic_control: "प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाएं। ट्राइकोग्रामा जैपोनिकम परजीवी ततैया के 50,000 अंडे/एकड़ छोड़ें।",
          etl_threshold: "5% सूखी गोभ (Dead Heart) या 1 पतंगा प्रति वर्ग मीटर दिखने पर",
          chemical_control: [
            {
              chemical_name: "Chlorantraniliprole 18.5% SC (Coragen / Voliam Flexi)",
              active_ingredient: "Chlorantraniliprole 18.5% SC",
              frac_irac_group: "IRAC 28 (Ryanodine Receptor Modulator)",
              dosage: "60 मिली",
              volume: "प्रति एकड़ (150-200 लीटर पानी)",
              per_volume: "0.4 मिली/लीटर",
              waiting_period_days: 14,
              safety_note: "लंबे समय (21-25 दिन) तक तना छेदक व पत्ता लपेटक दोनों पर असरदार।"
            },
            {
              chemical_name: "Cartap Hydrochloride 50% SP (Caldan / Padan)",
              active_ingredient: "Cartap Hydrochloride 50% SP",
              frac_irac_group: "IRAC 14 (Nicotinic Acetylcholine Receptor Channel Blocker)",
              dosage: "400 ग्राम",
              volume: "प्रति एकड़ (200 लीटर पानी)",
              per_volume: "2 ग्राम/लीटर",
              waiting_period_days: 15,
              safety_note: "सिस्टमिक व संपर्क दोनों क्रिया से तुरंत कीड़ों को मारता है।"
            },
            {
              chemical_name: "Fipronil 0.3% GR (Regent Granules)",
              active_ingredient: "Fipronil 0.3% GR",
              frac_irac_group: "IRAC 2B (GABA-gated Chloride Channel Blocker)",
              dosage: "7.5–10 किग्रा",
              volume: "प्रति एकड़ (खेत में बखेरें)",
              per_volume: "सीधे खेत में डालें",
              waiting_period_days: 21,
              safety_note: "रोपाई के 15-25 दिन पर खेत में 2-3 सेमी पानी होने पर रेत के साथ बखेरें।"
            }
          ]
        },
        {
          pest_id: "paddy_bph",
          pest_name: "भूरा फुदका (Brown Plant Hopper - BPH)",
          scientific_name: "Nilaparvata lugens",
          category: "pest",
          identification_text: "पौधों के तने पर पानी की सतह के पास छोटे भूरे रंग के फुदके, पौधों का सूखकर जलने जैसा (Hopper Burn) हो जाना।",
          damage_nature: "हजारों की संख्या में रस चूसते हैं जिससे पूरा खेत बीच-बीच में गोल चक्करों में सूखा दिखाई देता है।",
          images: ["/images/crops/paddy.jpg"],
          organic_control: "खेत से पानी निकाल दें (Dry alternate wetting)। नीम का तेल (Azadirachtin 10000 ppm) @ 2 मिली/लीटर छिड़कें।",
          etl_threshold: "5-10 फुदके प्रति हिल (पौधे का गुच्छा) दिखने पर",
          chemical_control: [
            {
              chemical_name: "Triflumezopyrim 106 SC (Pexalon)",
              active_ingredient: "Triflumezopyrim 106 SC",
              frac_irac_group: "IRAC 4E (Nicotinic Acetylcholine Receptor Allosteric Modulator)",
              dosage: "94 मिली",
              volume: "प्रति एकड़ (200-250 लीटर पानी)",
              per_volume: "0.5 मिली/लीटर",
              waiting_period_days: 14,
              safety_note: "फुदके पर तुरंत नॉकडाउन असर और 20 दिन की लंबी सुरक्षा। स्प्रे नोजल तने की तरफ रखें।"
            },
            {
              chemical_name: "Pymetrozine 50% WG (Chess / Osheen)",
              active_ingredient: "Pymetrozine 50% WG",
              frac_irac_group: "IRAC 9B (Chordotonal Organ TRPV Channel Modulator)",
              dosage: "120 ग्राम",
              volume: "प्रति एकड़ (200 लीटर पानी)",
              per_volume: "0.6 ग्राम/लीटर",
              waiting_period_days: 12,
              safety_note: "फुदके का सूंड सुन्न कर देता है जिससे वह रस नहीं चूस पाता।"
            }
          ]
        },
        {
          pest_id: "paddy_blast",
          pest_name: "ब्लास्ट / झोंका रोग (Rice Blast)",
          scientific_name: "Pyricularia oryzae",
          category: "disease",
          identification_text: "पत्तियों पर आंख या नाव के आकार के बीच में भूरे व किनारे कत्थई धब्बे। बाली की गर्दन काली पड़ना (Neck Blast)।",
          damage_nature: "गर्दन टूटने से बाली सूख जाती है और दाने काले व खोखले रह जाते हैं।",
          images: ["/images/crops/paddy.jpg"],
          organic_control: "नाइट्रोजन (यूरिया) का अत्यधिक उपयोग रोकें। स्यूडोमोनास फ्लोरेसेंस @ 5 ग्राम/लीटर का स्प्रे करें।",
          etl_threshold: "पत्ती पर 1-2 आंखनुमा धब्बे या मौसम में ठंड व बादल दिखने पर",
          chemical_control: [
            {
              chemical_name: "Tricyclazole 75% WP (Baan / Beam)",
              active_ingredient: "Tricyclazole 75% WP",
              frac_irac_group: "FRAC 16.1 (Melanin Biosynthesis Inhibitor)",
              dosage: "120–150 ग्राम",
              volume: "प्रति एकड़ (150-200 लीटर पानी)",
              per_volume: "0.75 ग्राम/लीटर",
              waiting_period_days: 15,
              safety_note: "ब्लास्ट (झोंका) रोग के लिए सबसे अचूक दवा। बाली निकलते समय सुरक्षात्मक स्प्रे करें।"
            },
            {
              chemical_name: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
              active_ingredient: "Azoxystrobin + Difenoconazole",
              frac_irac_group: "FRAC 11 + FRAC 3 (Dual Action Systemic)",
              dosage: "200 मिली",
              volume: "प्रति एकड़ (200 लीटर पानी)",
              per_volume: "1 मिली/लीटर",
              waiting_period_days: 10,
              safety_note: "ब्लास्ट और शीथ ब्लाइट दोनों रोगों को एक साथ रोकता है।"
            }
          ]
        }
      ]
    }
  ]
};

export const WHEAT_CROP_GUIDE: CropGuideData = {
  crop_id: "CR_WHEAT_001",
  crop_slug: "wheat",
  crop_name: "Wheat",
  crop_name_hi: "गेहूँ",
  crop_scientific_name: "Triticum aestivum",
  cover_image: "/images/crops/wheat.jpg",
  stages: [
    {
      stage_id: "shuruat",
      stage_name: "Shuruat (Seed Selection & Treatment)",
      stage_name_hi: "1. शुरुआत (बीज चयन व उपचार)",
      stage_period: "दिन 0–10 (बुवाई पूर्व तैयारी)",
      summary: "उन्नत सिंचित किस्मों (DBW 187, HD 2967) का चयन, फफूंद व दीमक से बीज शोधन।",
      parameters: {
        "बीज दर (Seed Rate)": "40-45 किग्रा/एकड़ (समय पर बुवाई)",
        "कतार दूरी": "20 सेमी कतार से कतार",
        "बुवाई गहराई": "4–5 सेमी (अधिक गहरी बुवाई न करें)",
        "बीज उपचार": "कार्बेन्डाजिम + मेंकोजेब @ 2.5 ग्राम + क्लोरपायरीफॉस @ 4 मिली/किग्रा"
      },
      activities: [
        "स्वस्थ प्रमाणित बीज का प्रयोग करें, कंडुआ रोग से बचाव हेतु बीटावैक्स 2g/kg से शोधन करें।",
        "दीमक प्रभावित क्षेत्रों में थायमेथॉक्सम 70 WS @ 2g/kg बीज से उपचार अवश्य करें।"
      ],
      advisories: [
        "बुवाई के समय मिट्टी में पर्याप्त ओट (नमी) होनी चाहिए ताकि एकसार जमाव हो।"
      ]
    },
    {
      stage_id: "lagana",
      stage_name: "Lagana (Sowing & Basal Fertilizer)",
      stage_name_hi: "2. लगाना (बुवाई व बेसल खाद)",
      stage_period: "दिन 0–21 (अंकुरण व शुरुआती बढ़वार)",
      summary: "सीडड्रिल से बुवाई, संतुलित बेसल उर्वरक और दीमक रोकथाम।",
      parameters: {
        "बेसल खाद (Basal)": "DAP 55 kg + MOP 20 kg + Urea 20 kg/एकड़",
        "जिंक सल्फेट (33%)": "7 किग्रा/एकड़ (आखिरी जुताई पर)"
      },
      activities: [
        "सीड-कम-फर्टिलाइजर ड्रिल से बुवाई करें जिससे खाद बीज से 2-3 सेमी नीचे पड़े।",
        "बुवाई के तुरंत बाद पलेवा या नमी का ध्यान रखें।"
      ],
      advisories: [
        "गेहूं की बुवाई 15 नवंबर से 25 नवंबर के मध्य पूरी कर लें, देर होने पर पैदावार घटती है।"
      ]
    },
    {
      stage_id: "dekhbhal",
      stage_name: "Dekhbhal (CRI Stage & Tillering)",
      stage_name_hi: "3. देखभाल (CRI पहली सिंचाई व कल्ले)",
      stage_period: "दिन 21–60 (शिखर जड़ से गाभा अवस्था)",
      summary: "21 दिन पर सबसे महत्वपूर्ण ताज जड़ (CRI) सिंचाई, खरपतवार नियंत्रण व यूरिया टॉप-ड्रेसिंग।",
      parameters: {
        "पहली सिंचाई (CRI)": "बुवाई के 20–22 दिन बाद (सबसे क्रांतिक अवस्था)",
        "पहली टॉप ड्रेसिंग": "CRI सिंचाई के बाद ओट आने पर: यूरिया 45 किग्रा/एकड़",
        "खरपतवार नियंत्रण": "30-35 दिन पर क्लोडिनाफॉप 15 WP (घास) या 2,4-D (चौड़ी पत्ती)"
      },
      activities: [
        "21 दिन वाली सिंचाई कभी न छोड़ें, यह नहीं देने पर कल्ले नहीं फूटते।",
        "गुल्ली डंडा (मंडूसी) की रोकथाम हेतु क्लोडिनाफॉप 15% WP @ 160g/एकड़ 150L पानी में स्प्रे करें।"
      ],
      advisories: [
        "हल्की सिंचाई करें, खेत में पानी खड़ा न रहने दें।"
      ]
    },
    {
      stage_id: "suraksha",
      stage_name: "Suraksha (Rust & Aphid Control)",
      stage_name_hi: "4. सुरक्षा और कटाई (पीला रतुआ, माहू व कटाई)",
      stage_period: "दिन 60–125 (फूल, दाना भराव व कटाई)",
      summary: "पीला रतुआ (Yellow Rust) और माहू (Aphid) से सुरक्षा एवं समय पर कटाई।",
      parameters: {
        "कटाई का सही समय": "दाना कड़ा होने व बालियां सुनहरी पीली होने पर",
        "दाना नमी": "भंडारण हेतु 10-12% नमी"
      },
      activities: [
        "जनवरी-फरवरी में पत्तियों पर पीला पाउडर दिखने पर तुरंत रतुआ रोधी स्प्रे करें।",
        "दूधिया व दाना भराव अवस्था पर खेत में पर्याप्त नमी रखें।"
      ],
      advisories: [
        "पछुआ हवा चलने पर सिंचाई बंद रखें ताकि फसल न गिरे।"
      ],
      pests_and_diseases: [
        {
          pest_id: "wheat_yellow_rust",
          pest_name: "पीला रतुआ (Yellow Rust / Stripe Rust)",
          scientific_name: "Puccinia striiformis",
          category: "disease",
          identification_text: "पत्तियों की ऊपरी सतह पर हल्दी जैसा चमकीला पीला पाउडर धारियों में दिखना, छूने पर उंगली पीली होना।",
          damage_nature: "पत्तियों का हरापन नष्ट होता है जिससे प्रकाश संश्लेषण रुक जाता है और दाने सिकुड़ जाते हैं।",
          images: ["/images/crops/wheat.jpg"],
          organic_control: "प्रतिरोधी किस्में (DBW 187, DBW 222) लगाएं। गौमूत्र + हींग का घोल सुरक्षात्मक रूप से छिड़कें।",
          etl_threshold: "खेत में पहली बार पीला पाउडर का लक्षण दिखते ही",
          chemical_control: [
            {
              chemical_name: "Propiconazole 25% EC (Tilt / Bumper)",
              active_ingredient: "Propiconazole 25% EC",
              frac_irac_group: "FRAC 3 (DMI-Fungicide / Triazole)",
              dosage: "200 मिली",
              volume: "प्रति एकड़ (200 लीटर पानी)",
              per_volume: "1 मिली/लीटर",
              waiting_period_days: 20,
              safety_note: "पीला रतुआ आते ही तुरंत पूरे खेत में स्प्रे करें, 15 दिन बाद आवश्यकतानुसार दोहराएं।"
            },
            {
              chemical_name: "Tebuconazole 25.9% EC (Folicur)",
              active_ingredient: "Tebuconazole 25.9% EC",
              frac_irac_group: "FRAC 3 (Triazole Systemic)",
              dosage: "200 मिली",
              volume: "प्रति एकड़ (200 लीटर पानी)",
              per_volume: "1 मिली/लीटर",
              waiting_period_days: 18,
              safety_note: "रतुआ और करनाल बंट दोनों पर उत्कृष्ट सुरक्षात्मक व उपचारात्मक असर।"
            }
          ]
        },
        {
          pest_id: "wheat_aphid",
          pest_name: "माहू / चेपा (Wheat Aphid)",
          scientific_name: "Rhopalosiphum padi",
          category: "pest",
          identification_text: "बालियों और पत्तियों पर चिपके हुए छोटे हरे-काले कीड़े, चिपचिपा लसदार पदार्थ छोड़ना।",
          damage_nature: "बालियों से रस चूसते हैं जिससे दाना कमजोर और हल्का बनता है।",
          images: ["/images/crops/wheat.jpg"],
          organic_control: "नीम का तेल @ 3 मिली/लीटर पानी का स्प्रे। पीले चिपचिपे ट्रैप (Yellow Sticky Trap) लगाएं।",
          etl_threshold: "5-10 माहू प्रति बाली दिखने पर",
          chemical_control: [
            {
              chemical_name: "Thiamethoxam 25% WG (Actara)",
              active_ingredient: "Thiamethoxam 25% WG",
              frac_irac_group: "IRAC 4A (Neonicotinoid)",
              dosage: "40–50 ग्राम",
              volume: "प्रति एकड़ (150-200 लीटर पानी)",
              per_volume: "0.25 ग्राम/लीटर",
              waiting_period_days: 14,
              safety_note: "सिस्टमिक कीटनाशक, पौधे के अंदर पहुंचकर माहू का तुरंत खात्मा करता है।"
            }
          ]
        }
      ]
    }
  ]
};

export function getCropGuideBySlug(slug: string): CropGuideData {
  const s = slug.toLowerCase();
  if (s === "tomato") {
    return TOMATO_CROP_GUIDE;
  }
  if (s === "paddy" || s === "rice") {
    return PADDY_CROP_GUIDE;
  }
  if (s === "wheat") {
    return WHEAT_CROP_GUIDE;
  }

  // Dynamic builder for other crops (Soybean, Cotton, Maize, Chilli, Potato, etc.)
  const crop = cropCatalog.find((c) => c.slug === s);
  const cropName = crop?.name ?? s.charAt(0).toUpperCase() + s.slice(1);
  const cropNameHi = crop?.nameHi ?? cropName;
  const threatData = getCropPestDisease(s);
  const coverImg = `/images/crops/${s}.jpg`;

  const pestsList: PestAndDiseaseItem[] = [];

  // Add real pests from threat database
  if (threatData?.pests && threatData.pests.length > 0) {
    threatData.pests.slice(0, 3).forEach((p) => {
      pestsList.push({
        pest_id: `${s}_pest_${p.id}`,
        pest_name: `${p.name}`,
        scientific_name: p.scientificName,
        category: "pest",
        identification_text: `${p.name} के प्रकोप से पत्तियों व तने पर क्षति दिखती है।`,
        damage_nature: "फसल के ऊतकों को नुकसान पहुंचाता है जिससे उपज में कमी आती है।",
        images: [coverImg],
        organic_control: "नीम का तेल (10000 ppm) @ 2-3 मिली/लीटर पानी का छिड़काव करें। फेरोमोन ट्रैप लगाएं।",
        etl_threshold: "खेत में कीड़ों का शुरुआती संक्रमण दिखते ही",
        chemical_control: [
          {
            chemical_name: p.control || "Chlorantraniliprole 18.5% SC (कोराजन)",
            dosage: "60 मिली",
            volume: "प्रति एकड़ (150-200 लीटर पानी)",
            per_volume: "0.4 मिली/लीटर",
            waiting_period_days: 14,
            safety_note: "सटीक मात्रा में साफ पानी के साथ शाम के समय छिड़काव करें।"
          }
        ]
      });
    });
  }

  // Add real diseases from threat database
  if (threatData?.diseases && threatData.diseases.length > 0) {
    threatData.diseases.slice(0, 2).forEach((d) => {
      pestsList.push({
        pest_id: `${s}_dis_${d.id}`,
        pest_name: `${d.name}`,
        scientific_name: d.pathogen,
        category: "disease",
        identification_text: `${d.name} के शुरुआती धब्बे पत्तियों या तनों पर दिखाई देते हैं।`,
        damage_nature: "पौधों का हरापन कम होता है और दाना भराव प्रभावित होता है।",
        images: [coverImg],
        organic_control: "ट्राइकोडर्मा विरिडी @ 5 ग्राम/लीटर का पर्णीय छिड़काव करें। जलभराव रोकें।",
        etl_threshold: "पत्तियों पर पहला रोग लक्षण दिखने पर",
        chemical_control: [
          {
            chemical_name: d.control || "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (अमिस्टार टॉप)",
            dosage: "200 मिली",
            volume: "प्रति एकड़ (200 लीटर पानी)",
            per_volume: "1 मिली/लीटर",
            waiting_period_days: 10,
            safety_note: "रोग के लक्षण दिखते ही सुरक्षात्मक स्प्रे करें।"
          }
        ]
      });
    });
  }

  // Fallback if no specific pests found
  if (pestsList.length === 0) {
    pestsList.push({
      pest_id: `${s}_curative_protection`,
      pest_name: `${cropNameHi} कीट व इल्ली नियंत्रण`,
      category: "pest",
      identification_text: `${cropNameHi} में रस चूसक कीट व इल्ली का प्रकोप।`,
      damage_nature: "पत्तियों का रस चूसना व कोमल शाखाओं को काटना।",
      images: [coverImg],
      organic_control: "नीम का तेल @ 3 मिली/लीटर का छिड़काव।",
      chemical_control: [
        {
          chemical_name: "Chlorantraniliprole 18.5% SC (Coragen)",
          dosage: "60 मिली",
          volume: "प्रति एकड़ (150-200 लीटर पानी)",
          per_volume: "0.4 मिली/लीटर",
          waiting_period_days: 14,
          safety_note: "कीट नियंत्रण हेतु प्रमाणित दवा।"
        }
      ]
    });
  }

  return {
    crop_id: `CR_${s.toUpperCase()}_001`,
    crop_slug: s,
    crop_name: cropName,
    crop_name_hi: cropNameHi,
    crop_scientific_name: "",
    cover_image: coverImg,
    stages: [
      {
        stage_id: "shuruat",
        stage_name: "Shuruat (Seed Selection & Treatment)",
        stage_name_hi: "1. शुरुआत (बीज चयन व उपचार)",
        stage_period: "दिन 0–20 (बुवाई पूर्व तैयारी)",
        summary: `उन्नत किस्मों का चयन, बीज शोधन एवं ${cropNameHi} की बुवाई पूर्व तैयारी।`,
        parameters: {
          "बीज दर (Seed Rate)": "अनुशंसित मानक मात्रा",
          "बीज उपचार": "फफूंदनाशक @ 2g/kg से शोधन",
          "बुवाई का सही समय": "मौसम अनुसार"
        },
        activities: [
          "प्रमाणित बीज का उपयोग करें और फफूंदनाशक से बीज शोधन अवश्य करें।",
          "खेत की 2-3 गहरी जुताई कर पर्याप्त गोबर की खाद मिलाएं।"
        ],
        advisories: [
          "बुवाई के समय खेत में पर्याप्त नमी का होना अनिवार्य है।"
        ]
      },
      {
        stage_id: "lagana",
        stage_name: "Lagana (Sowing & Basal Fertilizer)",
        stage_name_hi: "2. लगाना (बुवाई व बेसल खाद)",
        stage_period: "दिन 20–40 (बुवाई व अंकुरण)",
        summary: `कतारों में बुवाई, उचित दूरी और ${cropNameHi} हेतु संतुलित बेसल उर्वरक प्रबंधन।`,
        parameters: {
          "कतार दूरी": "मानक दूरी",
          "बेसल खाद": "DAP + MOP + Zinc"
        },
        activities: [
          "सीड ड्रिल से उचित दूरी और गहराई पर बुवाई करें।",
          "बेसल खाद को बीज से 2-3 सेमी नीचे डालें।"
        ],
        advisories: [
          "खरपतवार नियंत्रण हेतु बुवाई के 48 घंटे में प्री-इमर्जेंस दवा का छिड़काव करें।"
        ]
      },
      {
        stage_id: "dekhbhal",
        stage_name: "Dekhbhal (Growth & Nutrition)",
        stage_name_hi: "3. देखभाल (सिंचाई व पोषण)",
        stage_period: "दिन 40–80 (वानस्पतिक बढ़वार)",
        summary: `${cropNameHi} में समय पर सिंचाई, निराई-गुड़ाई एवं टॉप ड्रेसिंग खाद प्रबंधन।`,
        parameters: {
          "सिंचाई की आवश्यकता": "आवश्यकतानुसार",
          "क्रांतिक अवस्थाएं": "फूल व दाना भराव"
        },
        activities: [
          "क्रांतिक अवस्थाओं पर सिंचाई में देरी न करें।",
          "कल्ले/शाखाएं फूटते समय यूरिया की पहली टॉप ड्रेसिंग दें।"
        ],
        advisories: [
          "अत्यधिक जलभराव से बचें और खेत में जलनिकासी की उचित व्यवस्था रखें।"
        ]
      },
      {
        stage_id: "suraksha",
        stage_name: "Suraksha (Pest & Disease Control)",
        stage_name_hi: "4. सुरक्षा और कटाई (कीट, रोग नियंत्रण व कटाई)",
        stage_period: "दिन 80–130 (फूल, फल/दाना भराव व कटाई)",
        summary: `${cropNameHi} के कीट-रोगों का समय पर रासायनिक व जैविक नियंत्रण और कटाई।`,
        parameters: {
          "कटाई का समय": "80-85% दाने/फल पकने पर",
          "भंडारण नमी": "10-12% सुरक्षित नमी"
        },
        activities: [
          "फसल में कीट या रोग का प्रकोप दिखते ही तुरंत अनुशंसित दवा का स्प्रे करें।",
          "कटाई से 10-15 दिन पहले सिंचाई बंद कर दें।"
        ],
        advisories: [
          "कीटनाशक छिड़कते समय सुरक्षात्मक मास्क और दस्तानों का प्रयोग करें।"
        ],
        pests_and_diseases: pestsList
      }
    ]
  };
}
