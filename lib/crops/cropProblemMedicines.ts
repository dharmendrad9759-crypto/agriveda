/**
 * Master Authoritative Curative Medicine Knowledge Base for Crop Problems
 * 29 Crops with Strict 1 ➔ 2 ➔ 3 Technical Progression Sequence:
 * Level 1: Initial / Traditional / Preventive
 * Level 2: Moderate / Broad Spectrum
 * Level 3: Advanced / Top Trial Performer (🔥 बेस्ट ट्रायल रिजल्ट)
 *
 * All Virus targets strictly blocked from Fungicides (Vector Insecticides + Viricide only).
 */

export interface CurativeMedicine {
  nameHi: string;
  technical: string; // English Technical Name + formulation
  dose: string;      // e.g. "1 ml/L (200 ml / acre in 200 L water)"
  brands: string[];  // e.g. ["Tilt (Syngenta)", "Bumper (Adama)"]
  safety?: string;
  level?: 1 | 2 | 3;
  levelLabelHi?: string;
  dosePerAcre?: string;
  isTopPerformer?: boolean;
  resistanceWarning?: string;
}

export const CROP_PROBLEM_MEDICINES: Record<string, Record<string, CurativeMedicine[]>> = {
  "tomato": {
    "damping-off": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
                "technical": "Copper Oxychloride 50% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Blitox 50 (Rallis)",
                      "Blue Copper"
                ],
                "safety": "जड़ों में धार से ड्रेंचिंग करें; किसी EC दवा के साथ न मिलाएँ।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)",
                      "Krilaxyl"
                ],
                "safety": "सिस्टेमिक व कॉन्टैक्ट का दोहरा असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "प्रोपेमोकार्ब 53.2% + फॉसेटिल-अल 31% SL (प्रिविक्यूर एनर्जी)",
                "technical": "Propamocarb 53.2% + Fosetyl-Al 31% SL",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Previcur Energy (Bayer)"
                ],
                "safety": "नर्सरी व जड़ गलन पर सबसे आधुनिक रिसर्च मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "leaf-miner": [
          {
                "nameHi": "प्रोफेनोफॉस 40% + साइपरमेथ्रिन 4% EC (रॉकेट)",
                "technical": "Profenofos 40% + Cypermethrin 4% EC",
                "dose": "1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)",
                "brands": [
                      "Roket (PI)",
                      "Polytrin"
                ],
                "safety": "शुरुआती स्तर पर उपयोगी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 मिली / एकड़",
                "resistanceWarning": "⚠️ पुराना रसायन — अधिक प्रकोप में ट्रांसलैमिनार दवा चुनें।"
          },
          {
                "nameHi": "एबामेक्टिन 1.9% EC (वर्टिमेक)",
                "technical": "Abamectin 1.9% EC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Vertimec (Syngenta)",
                      "Abacin"
                ],
                "safety": "ट्रांसलैमिनार क्रिया — पत्ती के अंदर घुसकर नागअली को मारती है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (ट्रांसलैमिनार)",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "सायंट्रानिलिप्रोल 10.26% OD (बेनेविया)",
                "technical": "Cyantraniliprole 10.26% OD",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Benevia (FMC)"
                ],
                "safety": "पत्ती सुरंगक व रस चूसक दोनों पर सर्वश्रेष्ठ आधुनिक ट्रायल परिणाम।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "whitefly": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP (मानिक/प्राइड)",
                "technical": "Acetamiprid 20% SP",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Manik (UPL)",
                      "Pride"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़",
                "resistanceWarning": "⚠️ पुराना रसायन — कई क्षेत्रों में सफेद मक्खी में प्रतिरोध देखा गया है।"
          },
          {
                "nameHi": "डायफेंथियूरॉन 50% WP (पेगासस/पोलो)",
                "technical": "Diafenthiuron 50% WP",
                "dose": "1 ग्राम / लीटर पानी (200 ग्राम प्रति एकड़)",
                "brands": [
                      "Pegasus (Syngenta)",
                      "Polo"
                ],
                "safety": "निम्फ और वयस्क दोनों को तेजी से नियंत्रित करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 ग्राम / एकड़"
          },
          {
                "nameHi": "एफिडोपाइरोपेन 50 g/L DC (सेफिना)",
                "technical": "Afidopyropen 50 g/L DC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Sefina (BASF)",
                      "Pyriproxyfen + Bifenthrin (250 ml)"
                ],
                "safety": "सफेद मक्खी पर दुनिया का सबसे आधुनिक कॉर्डोटोनल ऑर्गन मॉड्यूलेटर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "400 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "early-blight": [
          {
                "nameHi": "मैंकोजेब 75% WP (डाइथेन एम-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "2.5–3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)",
                      "Kavach (Chlorothalonil 400g)"
                ],
                "safety": "संपर्क फफूंदनाशक; बीमारी आने से पहले सुरक्षा चक्र बनाता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती / सुरक्षात्मक स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "सिस्टेमिक उपचार व सुरक्षा — धब्बों को तुरंत बढ़ने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन SC (मेरीवोन)",
                "technical": "Fluxapyroxad 250 g/L + Pyraclostrobin 250 g/L SC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Merivon (BASF)"
                ],
                "safety": "SDHI + स्ट्रोबिल्यूरिन का सबसे शक्तिशाली संयोजन; 21 दिन सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips": [
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)",
                      "Mahaveer"
                ],
                "safety": "सामान्य थ्रिप्स नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "थ्रिप्स व सुंडी दोनों का संपूर्ण सफाया; प्राकृतिक स्पाइनोसिन वर्ग।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "180 मिली / एकड़"
          },
          {
                "nameHi": "ब्रोफ्लैनिलाइड 300 g/L SC (एक्सपोनस)",
                "technical": "Broflanilide 300 g/L SC",
                "dose": "0.17 मिली / लीटर पानी (34 मिली प्रति एकड़)",
                "brands": [
                      "Exponus (BASF)"
                ],
                "safety": "रेजिस्टेंट थ्रिप्स पर भारत का सबसे नवीनतम व तीव्र असरदार टेक्निकल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "34 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "red-spider-mite": [
          {
                "nameHi": "प्रोपारगाइट 57% EC (ओमाइट)",
                "technical": "Propargite 57% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Omite (Dhanuka)"
                ],
                "safety": "वयस्क मकड़ी पर तुरंत नॉकडाउन असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "स्पिरोमीसिफेन 22.9% SC (ओबेरॉन)",
                "technical": "Spiromesifen 22.9% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Oberon (Bayer)"
                ],
                "safety": "अंडे, निम्फ और वयस्क तीनों अवस्थाओं का संपूर्ण नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "इटोक्साजोल 10% SC (बोर्नियो)",
                "technical": "Etoxazole 10% SC",
                "dose": "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)",
                "brands": [
                      "Borneo (Sumitomo)",
                      "Fenazaquin 10% EC (300 ml)"
                ],
                "safety": "माइट ग्रोथ रेगुलेटर — अंडों को फूटने से रोकता है, 20 दिन लंबा असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "160 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "leaf-curl": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL + नीम तेल 10,000 PPM",
                "technical": "Imidacloprid 17.8% SL + Neem Oil",
                "dose": "150 मिली इमिडाक्लोप्रिड + 300 मिली नीम तेल प्रति एकड़",
                "brands": [
                      "Confidor (Bayer) + Neem Gold"
                ],
                "safety": "शुरुआती वाहक नियंत्रण; फफूंदनाशक कभी न डालें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · वेक्टर नियंत्रण",
                "dosePerAcre": "150 ml + 300 ml नीम / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला) + सूक्ष्म पोषक तत्व",
                "technical": "Flonicamid 50% WG + Micronutrient Mix",
                "dose": "80 ग्राम उलाला + 200 ग्राम सूक्ष्म पोषक तत्व प्रति एकड़",
                "brands": [
                      "Ulala (UPL) + Chelated Micro"
                ],
                "safety": "सफेद मक्खी की सूंड को 30 मिनट में लकवाग्रस्त करता है; पौधा हरा-भरा होता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (वेक्टर ब्लॉक + पोषण)",
                "dosePerAcre": "80 g + 200 g / एकड़"
          },
          {
                "nameHi": "डायफेंथियूरॉन 47.8% SC + सीवीड अर्क / वाइरोबान",
                "technical": "Diafenthiuron 47.8% SC + Viricide/Seaweed Extract",
                "dose": "200 मिली पेगासस + 250 मिली सीवीड प्रति एकड़",
                "brands": [
                      "Pegasus SC + Sagarika/Viroban"
                ],
                "safety": "सफेद मक्खी का पूर्ण खात्मा + पौधे में रोग-प्रतिरोधक क्षमता (एंटी-वायरल इम्यूनिटी) जाग्रत।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 ml + 250 ml / एकड़",
                "isTopPerformer": true
          }
    ],
    "bacterial-spot-wilt": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP + स्ट्रेप्टोसाइक्लिन",
                "technical": "Copper Oxychloride 50% WP + Streptocycline",
                "dose": "500 ग्राम ब्लाइटॉक्स + 18 ग्राम स्ट्रेप्टोसाइक्लिन प्रति एकड़",
                "brands": [
                      "Blitox 50 + Streptocycline (Hindustan Antibiotics)"
                ],
                "safety": "पारंपरिक जीवाणुनाशक घोल।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 g + 18 g / एकड़"
          },
          {
                "nameHi": "कॉपर हाइड्रॉक्साइड 53.8% DF (कोसाइड) + कासुगामाइसिन 3% SL",
                "technical": "Copper Hydroxide 53.8% DF + Kasugamycin 3% SL",
                "dose": "350 ग्राम कोसाइड + 300 मिली कासु-बी प्रति एकड़",
                "brands": [
                      "Kocide (Corteva) + Kasu-B (Dhanuka)"
                ],
                "safety": "आधुनिक सूक्ष्म कॉपर आयन जो पौधों पर सुरक्षित और जीवाणु पर अधिक घातक हैं।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "350 g + 300 ml / एकड़"
          },
          {
                "nameHi": "कासुगामाइसिन 5% + कॉपर ऑक्सीक्लोराइड 45% WP (कोनिका)",
                "technical": "Kasugamycin 5% + Copper Oxychloride 45% WP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़)",
                "brands": [
                      "Conika (Dhanuka)"
                ],
                "safety": "सिस्टेमिक एंटीबायोटिक और सुरक्षात्मक कॉपर का पेटेंट प्री-मिक्स; बेस्ट ट्रायल रिजल्ट।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "fruit-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "Missile"
                ],
                "safety": "छोटी इल्लियों पर तुरंत असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लूबेंडियामाइड 39.35% SC (फेम)",
                "technical": "Flubendiamide 39.35% SC",
                "dose": "0.2 मिली / लीटर पानी (40 मिली प्रति एकड़)",
                "brands": [
                      "Fame (Bayer)"
                ],
                "safety": "बड़ी इल्लियों के मांसपेशियों को तुरंत शिथिल करके भोजन बंद कराती है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "40 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "21 दिन तक इल्लियों से अभेद्य सुरक्षा; फल बेदाग रहते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pinworm": [
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC (अवांट)",
                "technical": "Indoxacarb 14.5% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Avaunt (FMC)"
                ],
                "safety": "शुरुआती पिनवर्म इल्ली नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "पत्ती के अंदर व डंठल के छेदों में ट्रांसलैमिनार प्रवेश।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "180 मिली / एकड़"
          },
          {
                "nameHi": "सायंट्रानिलिप्रोल 10.26% OD (बेनेविया)",
                "technical": "Cyantraniliprole 10.26% OD",
                "dose": "1.2 मिली / लीटर पानी (240 मिली प्रति एकड़)",
                "brands": [
                      "Benevia (FMC)",
                      "Tetraniliprole 200 SC (Vayego - 100 ml)"
                ],
                "safety": "टूटा एब्सोलूटा पिनवर्म पर विश्वव्यापी गोल्ड स्टैंडर्ड टेक्निकल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "240 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "late-blight": [
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)",
                      "Moximate"
                ],
                "safety": "शुरुआती लक्षण या कोहरे में तुरंत स्प्रे करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "डाइमेथोमॉर्फ 50% WP + मेटीराम 70% WG",
                "technical": "Dimethomorph 50% WP + Metiram 70% WG",
                "dose": "200 ग्राम एक्रोबैट + 400 ग्राम पॉलीराम प्रति एकड़",
                "brands": [
                      "Acrobat (BASF) + Polyram"
                ],
                "safety": "ओओमाइसिटी कवक की कोशिका भित्ति को नष्ट करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 g + 400 g / एकड़"
          },
          {
                "nameHi": "एमिटोक्ट्राडिन + डाइमेथोमॉर्फ (ज़ैमप्रो)",
                "technical": "Ametoctradin + Dimethomorph",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Zampro (BASF)",
                      "Famoxadone + Cymoxanil (Equation Pro - 200 ml)"
                ],
                "safety": "पछेती झुलसा पर सबसे उन्नत और बारिश में न धुलने वाला कवकनाशी।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "paddy": {
    "foot-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़ — ड्रेंचिंग/स्प्रे)",
                "brands": [
                      "Bavistin (Crystal)",
                      "Derosal"
                ],
                "safety": "पौधों की जड़ों के पास पानी में स्प्रे करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "250 ग्राम / एकड़"
          },
          {
                "nameHi": "थियोफैनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)"
                ],
                "safety": "संवहनी ऊतकों में घुसकर कवक जाल को खत्म करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Orius"
                ],
                "safety": "बकाने रोग पर सबसे असरदार ट्रायजोल कवकनाशी।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "stem-borer": [
          {
                "nameHi": "कार्टाप हाइड्रोक्लोराइड 4% GR / 50% SP",
                "technical": "Cartap Hydrochloride 4% GR / 50% SP",
                "dose": "8 किग्रा दानेदार या 400 ग्राम स्प्रे प्रति एकड़",
                "brands": [
                      "Padan (Dhanuka)",
                      "Caldan"
                ],
                "safety": "जड़ों द्वारा अवशोषित होकर तने तक पहुंचता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "8 kg GR / 400 g SP प्रति एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 0.3% GR (रीजेंट)",
                "technical": "Fipronil 0.3% GR",
                "dose": "8–10 किग्रा प्रति एकड़ (खेत में खाद के साथ बुरकाव)",
                "brands": [
                      "Regent (Bayer)"
                ],
                "safety": "कल्ले फूटने के समय 2-3 सेमी खड़े पानी में डालें।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (दानेदार)",
                "dosePerAcre": "8–10 किग्रा / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "सफेद बाली (White Earhead) से 100% सुरक्षा; लंबे समय तक सुरक्षित।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "leaf-folder": [
          {
                "nameHi": "लैम्ब्डा-साइहेलोथ्रिन 5% EC (कराटे)",
                "technical": "Lambda-cyhalothrin 5% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Karate (Syngenta)"
                ],
                "safety": "शुरुआती इल्ली नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)"
                ],
                "safety": "पत्ती के अंदर छिपी इल्ली को तुरंत मारता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लूबेंडियामाइड 20% WG (ताकुमी)",
                "technical": "Flubendiamide 20% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Takumi (Tata Rallis)"
                ],
                "safety": "पत्ती लपेटक पर सर्वश्रेष्ठ नियंत्रण, पत्तियां तुरंत हरी हो जाती हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "sheath-blight": [
          {
                "nameHi": "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
                "technical": "Hexaconazole 5% SC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Contaf Plus (Tata Rallis)"
                ],
                "safety": "किफायती सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "थिफ्लूज़ामाइड 24% SC (पल्सर)",
                "technical": "Thifluzamide 24% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Pulsor (Indofil)"
                ],
                "safety": "शीथ ब्लाइट की कवक पर सटीक व विशिष्ट मारक क्षमता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (विशिष्ट फफूंदनाशक)",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया / नेटिवो)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़) या नेटिवो (120 g)",
                "brands": [
                      "Custodia (Adama)",
                      "Nativo (Bayer - 120 g)"
                ],
                "safety": "शीथ ब्लाइट, ब्लास्ट और चमक तीनों में नंबर-1 ट्रायल परफॉर्मर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "bph": [
          {
                "nameHi": "डाइनोटिफ्यूरान 20% SG (ओशीन)",
                "technical": "Dinotefuran 20% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Osheen (PI)"
                ],
                "safety": "सिस्टेमिक रस चूसक कीटनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "पाइमेट्रोज़िन 50% WG (चेस)",
                "technical": "Pymetrozine 50% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Chess (Syngenta)"
                ],
                "safety": "फुदकों की सूंड को स्थायी रूप से बंद कर देता है, भोजन बंद होने से मृत्यु।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "ट्राइफ्लूमेज़ोपाइरिम 10% SC (पेक्सलोन)",
                "technical": "Triflumezopyrim 10% SC",
                "dose": "0.47 मिली / लीटर पानी (94 मिली प्रति एकड़)",
                "brands": [
                      "Pexalon (Corteva)"
                ],
                "safety": "BPH/WBPH पर भारत का सबसे शक्तिशाली टेक्निकल; 25 दिन तक हॉपर बर्न से पूर्ण सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "94 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "blb": [
          {
                "nameHi": "कॉपर हाइड्रॉक्साइड 53.8% DF + स्ट्रेप्टोसाइक्लिन",
                "technical": "Copper Hydroxide 53.8% DF + Streptocycline",
                "dose": "कॉपर: 35–40 ग्राम + स्ट्रेप्टो: 1.5–2 ग्राम प्रति 15L टंकी (350 g + 18 g / एकड़)",
                "brands": [
                      "Kocide (Corteva) + Streptocycline (Bharat)"
                ],
                "safety": "जीवाणु संक्रमण को आगे बढ़ने से रोकता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 g + 18 g / एकड़"
          },
          {
                "nameHi": "कासुगामाइसिन 3% SL + कॉपर ऑक्सीक्लोराइड 50% WP",
                "technical": "Kasugamycin 3% SL + Copper Oxychloride 50% WP",
                "dose": "कासुगामाइसिन: 30–40 मिली + कॉपर: 35–40 ग्राम प्रति 15L टंकी (400 ml + 400 g / एकड़)",
                "brands": [
                      "Kasu-B (Dhanuka) + Blitox (Tata Rallis)"
                ],
                "safety": "सिस्टेमिक एंटीबायोटिक जो पौधे के संवहन तंत्र में पहुंचता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ml + 400 g / एकड़"
          },
          {
                "nameHi": "बिस्मर्थियाज़ोल 20% WP + स्ट्रेप्टोसाइक्लिन",
                "technical": "Bismerthiazol 20% WP + Streptocycline",
                "dose": "बिस्मर्थियाज़ोल: 25–30 ग्राम + स्ट्रेप्टोसाइक्लिन: 1.5–2 ग्राम प्रति 15L टंकी (300 g + 18 g / एकड़)",
                "brands": [
                      "Bismerthiazol 20% WP + Streptocycline (Bharat)"
                ],
                "safety": "BLB के जीवाणु पर विशिष्ट एंटी-बैक्टीरियल मारक क्षमता।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 g + 18 g / एकड़",
                "isTopPerformer": true
          }
    ],
    "blast": [
          {
                "nameHi": "ट्राइसाइक्लाज़ोल 75% WP (बीम)",
                "technical": "Tricyclazole 75% WP",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Beam (Corteva)"
                ],
                "safety": "धान ब्लास्ट का सबसे प्रसिद्ध और विश्वसनीय फफूंदनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "आइसोप्रोपियोलेन 40% EC (फ्यूजीवान)",
                "technical": "Isoprothiolane 40% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Fujione (Rallis)"
                ],
                "safety": "ब्लास्ट के साथ-साथ पौधों की जड़ों को मजबूत बनाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "पिकोक्सीस्ट्रोबिन 22.5% SC + ट्राइसाइक्लाज़ोल 75% WP (गैलीलियो + बीम)",
                "technical": "Picoxystrobin 22.5% SC + Tricyclazole 75% WP",
                "dose": "पिकोक्सी: 20 मिली + ट्राइसाइक्लाज़ोल: 10–12 ग्राम प्रति 15L टंकी (200 ml + 120 g / एकड़)",
                "brands": [
                      "Galileo (Corteva) + Beam (Corteva)"
                ],
                "safety": "स्ट्रोबिल्यूरिन + ट्राइसाइक्लाजोल का शक्तिशाली दोहरा प्रहार; गर्दन तोड़ ब्लास्ट से पूर्ण सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 ml + 120 g / एकड़",
                "isTopPerformer": true
          }
    ],
    "false-smut": [
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)"
                ],
                "safety": "बाली निकलने से ठीक पहले सुरक्षात्मक स्प्रे करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · सुरक्षात्मक स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "कॉपर हाइड्रॉक्साइड 53.8% DF (कोसाइड)",
                "technical": "Copper Hydroxide 53.8% DF",
                "dose": "1.75 ग्राम / लीटर पानी (350 ग्राम प्रति एकड़)",
                "brands": [
                      "Kocide (Corteva)"
                ],
                "safety": "कवक बीजाणुओं के अंकुरण को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "350 ग्राम / एकड़"
          },
          {
                "nameHi": "पिकोक्सीस्ट्रोबिन 7% + प्रोपिकोनाज़ोल 12% SC (गैलीलियो वे)",
                "technical": "Picoxystrobin 7% + Propiconazole 12% SC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Galileo Way (Corteva)"
                ],
                "safety": "हल्दी रोग और शीथ ब्लाइट दोनों पर भारत का नंबर-1 प्रूवन टेक्निकल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "400 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "gundhi-bug": [
          {
                "nameHi": "क्लोरपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Dursban",
                      "Tricel"
                ],
                "safety": "तेज गंध और तुरंत मारक क्षमता।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG + लैम्ब्डा-साइहेलोथ्रिन 5% EC",
                "technical": "Thiamethoxam 25% WG + Lambda-cyhalothrin 5% EC",
                "dose": "100 ग्राम थियामेथोक्साम + 200 मिली लैम्ब्डा प्रति एकड़",
                "brands": [
                      "Actara + Karate"
                ],
                "safety": "सिस्टेमिक रस चूसक और संपर्क सुंडी नाशक का मिश्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 g + 200 ml / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "माइक्रोकैप्सूल तकनीक; गंधी बग पर तुरंत नॉकडाउन और 15 दिन सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "soybean": {
    "stem-fly": [
          {
                "nameHi": "थियामेथोक्साम 25% WG",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "सिस्टेमिक कीटनाशक; तने के अंदर रस में फैलता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "वयस्क मक्खी और अंदर के मैगट दोनों पर दोहरा वार।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 मिली / एकड़"
          },
          {
                "nameHi": "बीटा-साइफ्लूथ्रिन 8.49% + इमिडाक्लोप्रिड 19.81% OD",
                "technical": "Beta-cyfluthrin 8.49% + Imidacloprid 19.81% OD",
                "dose": "0.7 मिली / लीटर पानी (140 मिली प्रति एकड़)",
                "brands": [
                      "Solomon (Bayer)"
                ],
                "safety": "OD फॉर्मूलेशन तेल आधारित जो पौधे में तेजी से अंदर समाहित होकर तना मक्खी को जड़ से खत्म करता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "140 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "charcoal-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)",
                      "Sixer"
                ],
                "safety": "जड़ों व तने पर सुरक्षात्मक फफूंदनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Orius"
                ],
                "safety": "गहरी सिस्टेमिक क्रिया; तने की संवहनी नलियों में कवक नष्ट।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)",
                      "EverGol Xtend"
                ],
                "safety": "तना सड़न व रतुआ दोनों पर संपूर्ण नियंत्रण; जड़ें मजबूत।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "girdle-beetle": [
          {
                "nameHi": "प्रोफेनोफॉस 50% EC",
                "technical": "Profenofos 50% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Curacron (Syngenta)",
                      "Carina"
                ],
                "safety": "ओविसाइडल (अंडा नाशक) क्रिया।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "थायक्लोप्रिड 21.7% SC",
                "technical": "Thiacloprid 21.7% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Alanto (Bayer)"
                ],
                "safety": "तने के अंदर छल्ले में बैठे ग्रब को खत्म करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 9.3% + लैम्ब्डा-साइहेलोथ्रिन 4.6% ZC",
                "technical": "Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Ampligo (Syngenta)"
                ],
                "safety": "चक्र भृंग और सेमिलूपर दोनों पर अचूक नॉकडाउन और लंबा असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP",
                "technical": "Acetamiprid 20% SP",
                "dose": "0.4 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Manik (UPL)",
                      "Pride"
                ],
                "safety": "शुरुआती सफेद मक्खी नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · वेक्टर नियंत्रण",
                "dosePerAcre": "80 ग्राम / एकड़"
          },
          {
                "nameHi": "बीटा-साइफ्लूथ्रिन + इमिडाक्लोप्रिड OD (सोलोमन)",
                "technical": "Beta-cyfluthrin 8.49% + Imidacloprid 19.81% OD",
                "dose": "0.7 मिली / लीटर पानी (140 मिली प्रति एकड़)",
                "brands": [
                      "Solomon (Bayer)"
                ],
                "safety": "सफेद मक्खी के वयस्क और निम्फ दोनों पर तीव्र प्रहार।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "140 मिली / एकड़"
          },
          {
                "nameHi": "पाइरीप्रॉक्सीफेन 5% + डायफेंथियूरॉन 25% SE (वनस्टेप)",
                "technical": "Pyriproxyfen 5% + Diafenthiuron 25% SE",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "OneStep (Adama)"
                ],
                "safety": "IGR + सिस्टेमिक किलर — अंडे, बच्चे और उड़ने वाली मक्खी का 100% खात्मा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "400 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "spodoptera-semilooper": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "Missile"
                ],
                "safety": "छोटी इल्लियों पर किफायती व तेज।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "इंडोक्साकार्ब 14.5% + एसिटामिप्रिड 7.7% SC",
                "technical": "Indoxacarb 14.5% + Acetamiprid 7.7% w/w SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Delegate / Ampligo Alternative"
                ],
                "safety": "इल्ली और रस चूसक दोनों पर एक साथ असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन / एक्सपोनस 25 ml)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़) या ब्रोफ्लैनिलाइड (25 ml)",
                "brands": [
                      "Coragen (FMC)",
                      "Exponus (BASF - 25 ml)"
                ],
                "safety": "बड़ी से बड़ी इल्ली का 2 घंटे में भोजन बंद; 20 दिन की पूर्ण सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pod-blight": [
          {
                "nameHi": "टेबुकोनाज़ोल 10% + सल्फर 65% WG (स्वाधीन)",
                "technical": "Tebuconazole 10% + Sulphur 65% WG",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Swadheen (Tata Rallis)",
                      "Harsh"
                ],
                "safety": "फफूंदनाशक के साथ सल्फर पोषण भी प्रदान करता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "पायराक्लोस्ट्रोबिन 20% WG (हेडलाइन)",
                "technical": "Pyraclostrobin 20% WG",
                "dose": "0.75 ग्राम / लीटर पानी (150 ग्राम प्रति एकड़)",
                "brands": [
                      "Headline (BASF)"
                ],
                "safety": "पौधों में हरियाली और रोग प्रतिरोधक क्षमता बढ़ाता है (AgCelence प्रभाव)।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन SC (प्रियाक्सर)",
                "technical": "Fluxapyroxad 167 g/L + Pyraclostrobin 333 g/L SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Priaxor (BASF)"
                ],
                "safety": "सोयाबीन फली झुलसा व रतुआ पर भारत का नंबर-1 प्रीमियम कवकनाशी।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "maize": {
    "stem-borer": [
          {
                "nameHi": "फिप्रोनिल 0.3% GR (रीजेंट)",
                "technical": "Fipronil 0.3% GR",
                "dose": "7-8 किग्रा प्रति एकड़ (हल्की नमी में खेत में डालें)",
                "brands": [
                      "Regent 0.3 GR (Bayer)",
                      "Mortar"
                ],
                "safety": "शुरुआती तना छेदक व भूमिगत कीटों से बचाव।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "7-8 किग्रा / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)",
                      "Cover"
                ],
                "safety": "पौधे की गोभ में स्प्रे करने पर तना छेदक की सुंडी तुरंत खाना बंद कर देती है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 0.4% GR (फर्टेरा)",
                "technical": "Chlorantraniliprole 0.4% GR",
                "dose": "4 किग्रा प्रति एकड़ (सीधे पोंगली/गोभ के अंदर डालें)",
                "brands": [
                      "Ferterra (FMC)"
                ],
                "safety": "गोभ में डालने पर 25 दिन तक तना छेदक से पूर्ण मुक्ति।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "4 किग्रा / एकड़ (पोंगली में)",
                "isTopPerformer": true
          }
    ],
    "shoot-fly": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)",
                      "Tatamida"
                ],
                "safety": "अंकुरण के तुरंत बाद तना मक्खी की रोकथाम हेतु।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "सिस्टेमिक व कॉन्टैक्ट क्रिया — तना मक्खी पर त्वरित नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 30% FS (क्रूजर) या सायंट्रानिलिप्रोल 19.8% + थायोमेथोक्सम 19.8% FS",
                "technical": "Thiamethoxam 30% FS / Cyantraniliprole 19.8% + Thiamethoxam 19.8% FS",
                "dose": "8 मिली प्रति किलो बीज (बीज उपचार) या 100 मिली प्रति एकड़ स्प्रे",
                "brands": [
                      "Cruiser (Syngenta)",
                      "Fortenza Duo"
                ],
                "safety": "बीज उपचार से शुरुआती 21 दिनों तक तना मक्खी का 100% सुरक्षा कवच।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "बीज उपचार / 100 मिली एकड़",
                "isTopPerformer": true
          }
    ],
    "shoot-fly-stem-borer": [
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 0.4% GR (फर्टेरा)",
                "technical": "Chlorantraniliprole 0.4% GR",
                "dose": "4 किग्रा प्रति एकड़ (सीधे पोंगली/गोभ के अंदर डालें)",
                "brands": [
                      "Ferterra (FMC)"
                ],
                "safety": "गोभ में डालने पर 25 दिन तक तना छेदक से पूर्ण मुक्ति।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "4 किग्रा / एकड़ (पोंगली में)",
                "isTopPerformer": true
          }
    ],
    "fall-armyworm": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG + नोवाल्यूरॉन 10% EC",
                "technical": "Emamectin Benzoate 5% SG + Novaluron 10% EC",
                "dose": "100 ग्राम इमामेक्टिन + 150 मिली नोवाल्यूरॉन प्रति एकड़",
                "brands": [
                      "Proclaim + Rimon"
                ],
                "safety": "छोटी इल्लियों और अंडों का नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 g + 150 ml / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 9.3% + लैम्ब्डा-साइहेलोथ्रिन 4.6% ZC (एम्पलिगो)",
                "technical": "Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Ampligo (Syngenta)"
                ],
                "safety": "फॉल आर्मीवर्म पर तीव्र मारक क्षमता और लंबी सुरक्षा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "बड़ी से बड़ी FAW इल्ली का संपूर्ण सफाया; भारत में फॉल आर्मीवर्म का सबसे विश्वसनीय मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "turcicum-blight": [
          {
                "nameHi": "मैंकोजेब 75% WP",
                "technical": "Mancozeb 75% WP",
                "dose": "2.5 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)",
                      "Indofil"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · सुरक्षात्मक स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)",
                      "Bumper"
                ],
                "safety": "सिस्टेमिक उपचार; धब्बों को तुरंत बढ़ने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "मक्का झुलसा पर दोहरा सिस्टेमिक नियंत्रण; पत्तियां अंत तक हरी रहती हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "post-flowering-stalk-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP",
                "technical": "Carbendazim 50% WP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़ — जड़ों के पास)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "तने के निचले हिस्से पर स्प्रे/ड्रेंचिंग करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "संवहनी नलियों में कवक फैलाव को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "तना सड़न से पौधे को गिरने (Lodging) से बचाता है; दाना पूरा भरता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "common-rust": [
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)",
                      "Bumper (Adama)"
                ],
                "safety": "रतुआ कवक पर तुरंत असरदार रोकथाम व उपचारात्मक क्रिया।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "दोहरी क्रिया — रतुआ और पत्ती झुलसा दोनों को एक साथ रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "पायराक्लोस्ट्रोबिन 20% WG (हेडलाइन)",
                "technical": "Pyraclostrobin 20% WG",
                "dose": "0.75-1 ग्राम / लीटर पानी (150 ग्राम प्रति एकड़)",
                "brands": [
                      "Headline (BASF)"
                ],
                "safety": "उत्कृष्ट फफूंदनाशक — पत्तियों को हरा-भरा रखता है और दाने का वजन बढ़ाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "groundnut": {
    "collar-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — जड़ों की तरफ)",
                "brands": [
                      "Saaf (UPL)",
                      "Sixer"
                ],
                "safety": "शुरुआती जड़ गलन पर स्प्रे।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "सिस्टेमिक क्रिया द्वारा कवक जाल को खत्म करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "थिफ्लूज़ामाइड 24% SC (पल्सर)",
                "technical": "Thifluzamide 24% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Pulsor (Indofil)"
                ],
                "safety": "मूंगफली के स्टेम रॉट (स्क्लेरोशियम) पर भारत का सबसे सटीक व शक्तिशाली फफूंदनाशक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "white-grub": [
          {
                "nameHi": "क्लोरपायरीफॉस 50% EC",
                "technical": "Chlorpyrifos 50% EC",
                "dose": "1 लीटर प्रति एकड़ (सिंचाई के पानी के साथ)",
                "brands": [
                      "Dursban 50",
                      "Tricel"
                ],
                "safety": "सिंचाई के पानी के साथ नाली में चलाएँ।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "1 लीटर / एकड़"
          },
          {
                "nameHi": "क्लोथियानिडिन 50% WDG (दंतोत्सु)",
                "technical": "Clothianidin 50% WDG",
                "dose": "120 ग्राम प्रति एकड़ (ड्रेंचिंग या खाद में मिलाकर)",
                "brands": [
                      "Dantotsu (Sumitomo)"
                ],
                "safety": "जड़ों द्वारा अवशोषित होकर सफेद लट को तुरंत लकवाग्रस्त करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG (लेसेन्टा)",
                "technical": "Fipronil 40% + Imidacloprid 40% WG",
                "dose": "150 ग्राम प्रति एकड़ (रेत में मिलाकर जड़ों में डालें)",
                "brands": [
                      "Lesenta (Bayer)"
                ],
                "safety": "सफेद लट और दीमक पर सबसे अचूक व प्रूवन टेक्निकल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips-jassid": [
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)"
                ],
                "safety": "थ्रिप्स और तेला पर प्रभावी संपर्क व सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "थ्रिप्स और सुंडी दोनों का संपूर्ण सफाया; पौधे तेजी से बढ़ते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "tikka-rust": [
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कोंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)",
                "brands": [
                      "Contaf (Tata Rallis)"
                ],
                "safety": "किफायती सिस्टेमिक टिक्का नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "टिक्का और रतुआ दोनों पर शक्तिशाली उपचारात्मक क्रिया।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़) या ओपेरा (300 ml)",
                "brands": [
                      "Nativo (Bayer)",
                      "Opera (BASF - 300 ml)"
                ],
                "safety": "मूंगफली के टिक्का व रतुआ पर भारत का सर्वश्रेष्ठ फफूंदनाशक; पत्ते अंत तक हरे रहते हैं और दाने मोटे बनते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "hairy-caterpillar": [
          {
                "nameHi": "क्विनालफॉस 25% EC",
                "technical": "Quinalphos 25% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Ekalux (Syngenta)",
                      "Flash"
                ],
                "safety": "रोमिल इल्लियों पर तेज संपर्क प्रभाव।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)"
                ],
                "safety": "इल्लियों के पेट में जाकर तुरंत भोजन बंद कराता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन / प्लेथोरा 250 ml)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़) या प्लेथोरा (250 ml)",
                "brands": [
                      "Coragen (FMC)",
                      "Plethora (Adama - 250 ml)"
                ],
                "safety": "बड़ी रोमिल इल्ली और स्पोडोप्टेरा दोनों का संपूर्ण सफाया।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "chilli": {
    "collar-rot-wilt": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
                "technical": "Copper Oxychloride 50% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — ड्रेंचिंग)",
                "brands": [
                      "Blitox 50 (Rallis)",
                      "Blue Copper"
                ],
                "safety": "जड़ों में धार से डालें; किसी EC कीटनाशक के साथ न मिलाएँ।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
                "technical": "Metalaxyl-M 4% + Mancozeb 64% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold MZ (Syngenta)"
                ],
                "safety": "जड़ों को स्वस्थ व सुरक्षित रखता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "उकठा व जड़ गलन पर सबसे शक्तिशाली आधुनिक सिस्टेमिक मिश्रण।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips": [
          {
                "nameHi": "फिप्रोनिल 80% WG (जम्प) या इमिडाक्लोप्रिड 70% WG",
                "technical": "Fipronil 80% WG",
                "dose": "40 ग्राम प्रति एकड़ (0.2 ग्राम प्रति लीटर पानी)",
                "brands": [
                      "Jump (Bayer)",
                      "Confidor 70 WG (40 g)"
                ],
                "safety": "शुरुआती थ्रिप्स नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "40 ग्राम / एकड़",
                "resistanceWarning": "⚠️ पुराना रसायन — काले थ्रिप्स (Black Thrips) पर कम असरदार; स्तर 2 या 3 चुनें।"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट) या बेनेविया (200 ml)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़) या बेनेविया (200 ml)",
                "brands": [
                      "Delegate (Corteva)",
                      "Benevia (FMC - 200 ml)"
                ],
                "safety": "फूलों के अंदर बैठे काले थ्रिप्स पर अचूक प्रहार।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (ब्लैक थ्रिप्स स्पेशलिस्ट)",
                "dosePerAcre": "180 मिली / एकड़"
          },
          {
                "nameHi": "ब्रोफ्लैनिलाइड 300 g/L SC (एक्सपोनस) या ग्रेसिया (160 ml)",
                "technical": "Broflanilide 300 g/L SC",
                "dose": "0.17 मिली / लीटर पानी (34 मिली प्रति एकड़) या फ्लक्सामेटामाइड (160 ml)",
                "brands": [
                      "Exponus (BASF)",
                      "Gracia (Godrej - 160 ml)"
                ],
                "safety": "भारत में रेजिस्टेंट ब्लैक थ्रिप्स पर नंबर-1 ट्रायल परफॉर्मर; 30 मिनट में खाना बंद।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "34 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "broad-mite": [
          {
                "nameHi": "फेनपायरोक्सिमेट 5% EC (मिटिगेट / सेडना)",
                "technical": "Fenpyroximate 5% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Mitigate (Dhanuka)",
                      "Sedna"
                ],
                "safety": "वयस्क मकड़ियों पर तुरंत नॉकडाउन।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "डायफेंथियूरॉन 47.8% SC (पेगासस) या ओबेरॉन (200 ml)",
                "technical": "Diafenthiuron 47.8% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़) या ओबेरॉन (200 ml)",
                "brands": [
                      "Pegasus SC (Syngenta)",
                      "Oberon (Bayer)"
                ],
                "safety": "मकड़ी और सफेद मक्खी दोनों पर एक साथ नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एबामेक्टिन 1.9% EC + हेक्सिथियाज़ॉक्स 5.45% EC",
                "technical": "Abamectin 1.9% EC + Hexythiazox 5.45% EC",
                "dose": "150 मिली एबामेक्टिन + 200 मिली हेक्सिथियाज़ॉक्स प्रति एकड़",
                "brands": [
                      "Vertimec + Maiden"
                ],
                "safety": "अंडे, निम्फ और वयस्क तीनों अवस्थाओं का 100% खात्मा; पत्ते तुरंत सीधे व चमकदार।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 ml + 200 ml / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-mildew": [
          {
                "nameHi": "वेटेबल सल्फर 80% WP या माइक्लोब्यूटानिल 10% WP",
                "technical": "Wettable Sulphur 80% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़) या माइक्लोब्यूटानिल (150 g)",
                "brands": [
                      "Sulfex (Excel)",
                      "Boon (Myclobutanil - 150 g)"
                ],
                "safety": "सुरक्षात्मक फफूंदनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "सिस्टेमिक उपचार — सफेद पाउडर को तुरंत सुखा देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन (मेरीवोन / नेटिवो 120 g)",
                "technical": "Fluxapyroxad + Pyraclostrobin SC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़) या नेटिवो (120 g)",
                "brands": [
                      "Merivon (BASF)",
                      "Nativo (Bayer - 120 g)"
                ],
                "safety": "चूर्णी फफूंद और फल सड़न दोनों पर सबसे प्रीमियम सुरक्षा; मिर्च में लाल चमक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "fruit-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "Missile"
                ],
                "safety": "शुरुआती इल्ली नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "नोवाल्यूरॉन 5.25% + इंडोक्साकार्ब 4.5% SC (प्लेथोरा)",
                "technical": "Novaluron 5.25% + Indoxacarb 4.5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Plethora (Adama)"
                ],
                "safety": "अंडे, छोटी इल्ली और बड़ी इल्ली तीनों पर असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन / फेम 50 ml)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़) या फ्लूबेंडियामाइड (50 ml)",
                "brands": [
                      "Coragen (FMC)",
                      "Fame (Bayer - 50 ml)"
                ],
                "safety": "मिर्च के फल छेदक पर 21 दिन की अटूट सुरक्षा; फल छेद-मुक्त रहते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "anthracnose-dieback": [
          {
                "nameHi": "प्रोपिनेब 70% WP (एंट्राकोल)",
                "technical": "Propineb 70% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Antracol (Bayer)"
                ],
                "safety": "जिंक युक्त सुरक्षात्मक कवकनाशी; पौधों को हरा रखता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "मिर्च की फल सड़न और डाई-बैक पर सबसे प्रूवन टेक्निकल।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटीराम 55% + पायराक्लोस्ट्रोबिन 5% WG (कैब्रियो टॉप)",
                "technical": "Metiram 55% + Pyraclostrobin 5% WG",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Cabrio Top (BASF)"
                ],
                "safety": "मिर्च को फफूंद से मुक्त कर लाल व चमकदार बनाता है; बाजार में उच्चतम भाव।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "600 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "capsicum": {
    "collar-rot-wilt": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
                "technical": "Copper Oxychloride 50% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — ड्रेंचिंग)",
                "brands": [
                      "Blitox 50 (Rallis)",
                      "Blue Copper"
                ],
                "safety": "जड़ों में धार से डालें; किसी EC कीटनाशक के साथ न मिलाएँ।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल-एम 4% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
                "technical": "Metalaxyl-M 4% + Mancozeb 64% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold MZ (Syngenta)"
                ],
                "safety": "जड़ों को स्वस्थ व सुरक्षित रखता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "उकठा व जड़ गलन पर सबसे शक्तिशाली आधुनिक सिस्टेमिक मिश्रण।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips": [
          {
                "nameHi": "फिप्रोनिल 80% WG (जम्प) या इमिडाक्लोप्रिड 70% WG",
                "technical": "Fipronil 80% WG",
                "dose": "40 ग्राम प्रति एकड़ (0.2 ग्राम प्रति लीटर पानी)",
                "brands": [
                      "Jump (Bayer)",
                      "Confidor 70 WG (40 g)"
                ],
                "safety": "शुरुआती थ्रिप्स नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "40 ग्राम / एकड़",
                "resistanceWarning": "⚠️ पुराना रसायन — काले थ्रिप्स (Black Thrips) पर कम असरदार; स्तर 2 या 3 चुनें।"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट) या बेनेविया (200 ml)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़) या बेनेविया (200 ml)",
                "brands": [
                      "Delegate (Corteva)",
                      "Benevia (FMC - 200 ml)"
                ],
                "safety": "फूलों के अंदर बैठे काले थ्रिप्स पर अचूक प्रहार।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (ब्लैक थ्रिप्स स्पेशलिस्ट)",
                "dosePerAcre": "180 मिली / एकड़"
          },
          {
                "nameHi": "ब्रोफ्लैनिलाइड 300 g/L SC (एक्सपोनस) या ग्रेसिया (160 ml)",
                "technical": "Broflanilide 300 g/L SC",
                "dose": "0.17 मिली / लीटर पानी (34 मिली प्रति एकड़) या फ्लक्सामेटामाइड (160 ml)",
                "brands": [
                      "Exponus (BASF)",
                      "Gracia (Godrej - 160 ml)"
                ],
                "safety": "भारत में रेजिस्टेंट ब्लैक थ्रिप्स पर नंबर-1 ट्रायल परफॉर्मर; 30 मिनट में खाना बंद।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "34 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "broad-mite": [
          {
                "nameHi": "फेनपायरोक्सिमेट 5% EC (मिटिगेट / सेडना)",
                "technical": "Fenpyroximate 5% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Mitigate (Dhanuka)",
                      "Sedna"
                ],
                "safety": "वयस्क मकड़ियों पर तुरंत नॉकडाउन।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "डायफेंथियूरॉन 47.8% SC (पेगासस) या ओबेरॉन (200 ml)",
                "technical": "Diafenthiuron 47.8% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़) या ओबेरॉन (200 ml)",
                "brands": [
                      "Pegasus SC (Syngenta)",
                      "Oberon (Bayer)"
                ],
                "safety": "मकड़ी और सफेद मक्खी दोनों पर एक साथ नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एबामेक्टिन 1.9% EC + हेक्सिथियाज़ॉक्स 5.45% EC",
                "technical": "Abamectin 1.9% EC + Hexythiazox 5.45% EC",
                "dose": "150 मिली एबामेक्टिन + 200 मिली हेक्सिथियाज़ॉक्स प्रति एकड़",
                "brands": [
                      "Vertimec + Maiden"
                ],
                "safety": "अंडे, निम्फ और वयस्क तीनों अवस्थाओं का 100% खात्मा; पत्ते तुरंत सीधे व चमकदार।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 ml + 200 ml / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-mildew": [
          {
                "nameHi": "वेटेबल सल्फर 80% WP या माइक्लोब्यूटानिल 10% WP",
                "technical": "Wettable Sulphur 80% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़) या माइक्लोब्यूटानिल (150 g)",
                "brands": [
                      "Sulfex (Excel)",
                      "Boon (Myclobutanil - 150 g)"
                ],
                "safety": "सुरक्षात्मक फफूंदनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "सिस्टेमिक उपचार — सफेद पाउडर को तुरंत सुखा देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन (मेरीवोन / नेटिवो 120 g)",
                "technical": "Fluxapyroxad + Pyraclostrobin SC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़) या नेटिवो (120 g)",
                "brands": [
                      "Merivon (BASF)",
                      "Nativo (Bayer - 120 g)"
                ],
                "safety": "चूर्णी फफूंद और फल सड़न दोनों पर सबसे प्रीमियम सुरक्षा; मिर्च में लाल चमक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "fruit-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "Missile"
                ],
                "safety": "शुरुआती इल्ली नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "नोवाल्यूरॉन 5.25% + इंडोक्साकार्ब 4.5% SC (प्लेथोरा)",
                "technical": "Novaluron 5.25% + Indoxacarb 4.5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Plethora (Adama)"
                ],
                "safety": "अंडे, छोटी इल्ली और बड़ी इल्ली तीनों पर असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन / फेम 50 ml)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़) या फ्लूबेंडियामाइड (50 ml)",
                "brands": [
                      "Coragen (FMC)",
                      "Fame (Bayer - 50 ml)"
                ],
                "safety": "मिर्च के फल छेदक पर 21 दिन की अटूट सुरक्षा; फल छेद-मुक्त रहते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "anthracnose-dieback": [
          {
                "nameHi": "प्रोपिनेब 70% WP (एंट्राकोल)",
                "technical": "Propineb 70% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Antracol (Bayer)"
                ],
                "safety": "जिंक युक्त सुरक्षात्मक कवकनाशी; पौधों को हरा रखता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "मिर्च की फल सड़न और डाई-बैक पर सबसे प्रूवन टेक्निकल।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटीराम 55% + पायराक्लोस्ट्रोबिन 5% WG (कैब्रियो टॉप)",
                "technical": "Metiram 55% + Pyraclostrobin 5% WG",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Cabrio Top (BASF)"
                ],
                "safety": "मिर्च को फफूंद से मुक्त कर लाल व चमकदार बनाता है; बाजार में उच्चतम भाव।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "600 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "cauliflower": {
    "damping-off-wirestem": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — ड्रेंचिंग)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "जड़ों में धार से डालें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)"
                ],
                "safety": "सिस्टेमिक क्रिया द्वारा तने की सड़न रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "वायरस्टेम व जड़ गलन पर सबसे असरदार आधुनिक सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "aphid": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP",
                "technical": "Acetamiprid 20% SP",
                "dose": "0.4 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Manik",
                      "Pride"
                ],
                "safety": "किफायती सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "80 ग्राम / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "पौधे में रस के साथ फैलकर माहू का खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला)",
                "technical": "Flonicamid 50% WG",
                "dose": "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)",
                "brands": [
                      "Ulala (UPL)"
                ],
                "safety": "माहू की सूंड को तुरंत बंद करता है; मित्र कीटों (मधुमक्खी/लेडीबर्ड) के लिए सुरक्षित।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "dbm": [
          {
                "nameHi": "कार्टाप हाइड्रोक्लोराइड 50% SP या इमामेक्टिन 5% SG",
                "technical": "Cartap Hydrochloride 50% SP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़) या इमामेक्टिन (100 g)",
                "brands": [
                      "Caldan (Dhanuka)",
                      "Proclaim (100 g)"
                ],
                "safety": "शुरुआती इल्ली नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 ग्राम / एकड़",
                "resistanceWarning": "⚠️ DBM में पुराने रसायनों के प्रति भारी प्रतिरोध है; मध्यम या उच्च स्तर चुनें।"
          },
          {
                "nameHi": "क्लोरफेनापायर 10% SC (इन्ट्रेपिड) या स्पिनोसैड 45% SC (ट्रेसर)",
                "technical": "Chlorfenapyr 10% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़) या स्पिनोसैड (75 ml)",
                "brands": [
                      "Intrepid (BASF)",
                      "Tracer (Corteva - 75 ml)"
                ],
                "safety": "रेजिस्टेंट DBM इल्ली के माइटोकॉन्ड्रिया को ब्लॉक करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "ब्रोफ्लैनिलाइड 300 g/L SC (एक्सपोनस) या ग्रेसिया (160 ml)",
                "technical": "Broflanilide 300 g/L SC",
                "dose": "0.17 मिली / लीटर पानी (34 मिली प्रति एकड़) या फ्लक्सामेटामाइड (160 ml)",
                "brands": [
                      "Exponus (BASF)",
                      "Gracia (Godrej - 160 ml)"
                ],
                "safety": "भारत में DBM पर सबसे घातक व आधुनिक मॉलिक्यूल; 100% नियंत्रण, फूल बिल्कुल सफेद व बेदाग।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "34 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "spodoptera-butterfly": [
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC (अवांट)",
                "technical": "Indoxacarb 14.5% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Avaunt (FMC)"
                ],
                "safety": "इल्ली के तंत्रिका तंत्र पर काम करता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "नोवाल्यूरॉन 5.25% + इमामेक्टिन बेंजोएट 0.9% SC",
                "technical": "Novaluron 5.25% + Emamectin Benzoate 0.9% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Barazide (Adama)"
                ],
                "safety": "केंचुल बदलने से रोकता है और पेट में जहर फैलाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "पत्ता गोभी और फूलगोभी में इल्लियों से 20 दिन की पूर्ण सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "black-rot": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP + स्ट्रेप्टोसाइक्लिन",
                "technical": "Copper Oxychloride 50% WP + Streptocycline",
                "dose": "500 ग्राम ब्लाइटॉक्स + 18 ग्राम स्ट्रेप्टोसाइक्लिन प्रति एकड़",
                "brands": [
                      "Blitox 50 + Streptocycline"
                ],
                "safety": "पारंपरिक जीवाणुनाशक घोल।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 g + 18 g / एकड़"
          },
          {
                "nameHi": "कॉपर हाइड्रॉक्साइड 53.8% DF (कोसाइड) + कासुगामाइसिन 3% SL",
                "technical": "Copper Hydroxide 53.8% DF + Kasugamycin 3% SL",
                "dose": "350 ग्राम कोसाइड + 300 मिली कासु-बी प्रति एकड़",
                "brands": [
                      "Kocide (Corteva) + Kasu-B"
                ],
                "safety": "जीवाणु के कोशिका विभाजन को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "350 g + 300 ml / एकड़"
          },
          {
                "nameHi": "कासुगामाइसिन 5% + कॉपर ऑक्सीक्लोराइड 45% WP (कोनिका)",
                "technical": "Kasugamycin 5% + Copper Oxychloride 45% WP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़)",
                "brands": [
                      "Conika (Dhanuka)"
                ],
                "safety": "काला सड़न पर भारत का सबसे असरदार पेटेंटेड कवक व जीवाणुनाशक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "alternaria-downy": [
          {
                "nameHi": "मैंकोजेब 75% WP (डाइथेन एम-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "2.5 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)"
                ],
                "safety": "डाउनी मिल्ड्यू और अल्टरनेरिया दोनों पर काम करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)"
                ],
                "safety": "गोभी के फूल को एकदम दूध जैसा सफेद और धब्बा-मुक्त रखता है; प्रीमियम भाव।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "cabbage": {
    "damping-off-wirestem": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — ड्रेंचिंग)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "जड़ों में धार से डालें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)"
                ],
                "safety": "सिस्टेमिक क्रिया द्वारा तने की सड़न रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "वायरस्टेम व जड़ गलन पर सबसे असरदार आधुनिक सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "aphid": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP",
                "technical": "Acetamiprid 20% SP",
                "dose": "0.4 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Manik",
                      "Pride"
                ],
                "safety": "किफायती सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "80 ग्राम / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "पौधे में रस के साथ फैलकर माहू का खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला)",
                "technical": "Flonicamid 50% WG",
                "dose": "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)",
                "brands": [
                      "Ulala (UPL)"
                ],
                "safety": "माहू की सूंड को तुरंत बंद करता है; मित्र कीटों (मधुमक्खी/लेडीबर्ड) के लिए सुरक्षित।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "dbm": [
          {
                "nameHi": "कार्टाप हाइड्रोक्लोराइड 50% SP या इमामेक्टिन 5% SG",
                "technical": "Cartap Hydrochloride 50% SP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़) या इमामेक्टिन (100 g)",
                "brands": [
                      "Caldan (Dhanuka)",
                      "Proclaim (100 g)"
                ],
                "safety": "शुरुआती इल्ली नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 ग्राम / एकड़",
                "resistanceWarning": "⚠️ DBM में पुराने रसायनों के प्रति भारी प्रतिरोध है; मध्यम या उच्च स्तर चुनें।"
          },
          {
                "nameHi": "क्लोरफेनापायर 10% SC (इन्ट्रेपिड) या स्पिनोसैड 45% SC (ट्रेसर)",
                "technical": "Chlorfenapyr 10% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़) या स्पिनोसैड (75 ml)",
                "brands": [
                      "Intrepid (BASF)",
                      "Tracer (Corteva - 75 ml)"
                ],
                "safety": "रेजिस्टेंट DBM इल्ली के माइटोकॉन्ड्रिया को ब्लॉक करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "ब्रोफ्लैनिलाइड 300 g/L SC (एक्सपोनस) या ग्रेसिया (160 ml)",
                "technical": "Broflanilide 300 g/L SC",
                "dose": "0.17 मिली / लीटर पानी (34 मिली प्रति एकड़) या फ्लक्सामेटामाइड (160 ml)",
                "brands": [
                      "Exponus (BASF)",
                      "Gracia (Godrej - 160 ml)"
                ],
                "safety": "भारत में DBM पर सबसे घातक व आधुनिक मॉलिक्यूल; 100% नियंत्रण, फूल बिल्कुल सफेद व बेदाग।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "34 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "spodoptera-butterfly": [
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC (अवांट)",
                "technical": "Indoxacarb 14.5% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Avaunt (FMC)"
                ],
                "safety": "इल्ली के तंत्रिका तंत्र पर काम करता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "नोवाल्यूरॉन 5.25% + इमामेक्टिन बेंजोएट 0.9% SC",
                "technical": "Novaluron 5.25% + Emamectin Benzoate 0.9% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Barazide (Adama)"
                ],
                "safety": "केंचुल बदलने से रोकता है और पेट में जहर फैलाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "पत्ता गोभी और फूलगोभी में इल्लियों से 20 दिन की पूर्ण सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "black-rot": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP + स्ट्रेप्टोसाइक्लिन",
                "technical": "Copper Oxychloride 50% WP + Streptocycline",
                "dose": "500 ग्राम ब्लाइटॉक्स + 18 ग्राम स्ट्रेप्टोसाइक्लिन प्रति एकड़",
                "brands": [
                      "Blitox 50 + Streptocycline"
                ],
                "safety": "पारंपरिक जीवाणुनाशक घोल।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 g + 18 g / एकड़"
          },
          {
                "nameHi": "कॉपर हाइड्रॉक्साइड 53.8% DF (कोसाइड) + कासुगामाइसिन 3% SL",
                "technical": "Copper Hydroxide 53.8% DF + Kasugamycin 3% SL",
                "dose": "350 ग्राम कोसाइड + 300 मिली कासु-बी प्रति एकड़",
                "brands": [
                      "Kocide (Corteva) + Kasu-B"
                ],
                "safety": "जीवाणु के कोशिका विभाजन को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "350 g + 300 ml / एकड़"
          },
          {
                "nameHi": "कासुगामाइसिन 5% + कॉपर ऑक्सीक्लोराइड 45% WP (कोनिका)",
                "technical": "Kasugamycin 5% + Copper Oxychloride 45% WP",
                "dose": "1.5 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़)",
                "brands": [
                      "Conika (Dhanuka)"
                ],
                "safety": "काला सड़न पर भारत का सबसे असरदार पेटेंटेड कवक व जीवाणुनाशक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "alternaria-downy": [
          {
                "nameHi": "मैंकोजेब 75% WP (डाइथेन एम-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "2.5 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)"
                ],
                "safety": "डाउनी मिल्ड्यू और अल्टरनेरिया दोनों पर काम करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)"
                ],
                "safety": "गोभी के फूल को एकदम दूध जैसा सफेद और धब्बा-मुक्त रखता है; प्रीमियम भाव।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "cucumber": {
    "red-pumpkin-beetle": [
          {
                "nameHi": "क्लोरपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Dursban",
                      "Tricel"
                ],
                "safety": "शुरुआती संपर्क नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "साइपरमेथ्रिन 25% EC या थियामेथोक्साम 25% WG",
                "technical": "Cypermethrin 25% EC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़) या अकतारा (80 g)",
                "brands": [
                      "Ustaad",
                      "Actara (80 g)"
                ],
                "safety": "तेज नॉकडाउन क्रिया।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "बीटा-साइफ्लूथ्रिन + इमिडाक्लोप्रिड OD (सोलोमन)",
                "technical": "Beta-cyfluthrin + Imidacloprid OD",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Solomon (Bayer)"
                ],
                "safety": "लाल भृंग और रस चूसक दोनों का संपूर्ण खात्मा; बेल तेजी से बढ़ती है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "leafminer-whitefly": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP",
                "technical": "Acetamiprid 20% SP",
                "dose": "0.4 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Manik",
                      "Pride"
                ],
                "safety": "रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "80 ग्राम / एकड़"
          },
          {
                "nameHi": "एबामेक्टिन 1.9% EC + थियामेथोक्साम 25% WG",
                "technical": "Abamectin 1.9% EC + Thiamethoxam 25% WG",
                "dose": "150 मिली एबामेक्टिन + 80 ग्राम थियामेथोक्साम प्रति एकड़",
                "brands": [
                      "Vertimec + Actara"
                ],
                "safety": "पत्ती सुरंगक और सफेद मक्खी दोनों पर दोहरा वार।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 ml + 80 g / एकड़"
          },
          {
                "nameHi": "सायंट्रानिलिप्रोल 10.26% OD (बेनेविया)",
                "technical": "Cyantraniliprole 10.26% OD",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Benevia (FMC)"
                ],
                "safety": "ककड़ी वर्गीय फसलों में नागअली और सफेद मक्खी पर सबसे आधुनिक ट्रायल परफॉर्मर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "downy-mildew": [
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)"
                ],
                "safety": "प्रारंभिक सुरक्षात्मक स्प्रे।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "डाइमेथोमॉर्फ 50% WP + मेटीराम 70% WG",
                "technical": "Dimethomorph 50% WP + Metiram 70% WG",
                "dose": "200 ग्राम एक्रोबैट + 400 ग्राम पॉलीराम प्रति एकड़",
                "brands": [
                      "Acrobat (BASF) + Polyram"
                ],
                "safety": "ओओमाइसिटी कवक की दीवार को तोड़ता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 g + 400 g / एकड़"
          },
          {
                "nameHi": "सायाज़ोफामाइड 34.5% SC (रानमैन) या ज़ैमप्रो (300 ml)",
                "technical": "Cyazofamid 34.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़) या एमिटोक्ट्राडिन+डाइमेथोमॉर्फ",
                "brands": [
                      "Ranman (Summit Agro)",
                      "Zampro (BASF - 300 ml)"
                ],
                "safety": "खीरे के डाउनी मिल्ड्यू पर दुनिया का सबसे शक्तिशाली फफूंदनाशक; बारिश में भी असरदार।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-mildew": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "1.25 ग्राम / लीटर पानी (250 ग्राम प्रति एकड़)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "शुरुआती सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "250 ग्राम / एकड़"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% SC (कोंटाफ प्लस)",
                "technical": "Hexaconazole 5% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Contaf Plus (Tata Rallis)"
                ],
                "safety": "सफेद पाउडर को तेजी से सुखाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़) या विवांडो (100 ml)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Vivando (BASF - 100 ml)"
                ],
                "safety": "पाउडरी मिल्ड्यू पर अचूक नियंत्रण और खीरे में हरी चमक; बेल अंत तक फलती है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "fruit-fly": [
          {
                "nameHi": "क्यू-ल्यूर ट्रैप (8/एकड़) + मैलाथियान 50% EC (गुड़ चारा)",
                "technical": "Cue-lure Trap + Malathion 50% EC Poison Bait",
                "dose": "8 ट्रैप/एकड़ + 300 मिली मैलाथियान व 500 ग्राम गुड़ का घोल मेड़ों पर छिड़कें",
                "brands": [
                      "Cue-lure Traps + Cythion"
                ],
                "safety": "नर मक्खियों को ट्रैप में पकड़ें और मादा को मीठे चारे से मारें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · ट्रैप व चारा स्तर",
                "dosePerAcre": "8 ट्रैप + 300 ml / एकड़"
          },
          {
                "nameHi": "डेल्टामेथ्रिन 2.8% EC या स्पिनोसैड 45% SC (ट्रेसर)",
                "technical": "Deltamethrin 2.8% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़) या स्पिनोसैड (75 ml)",
                "brands": [
                      "Decis (Bayer)",
                      "Tracer (Corteva - 75 ml)"
                ],
                "safety": "उड़ने वाली वयस्क मक्खियों पर तेज नॉकडाउन।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "सायंट्रानिलिप्रोल 10.26% OD (बेनेविया)",
                "technical": "Cyantraniliprole 10.26% OD",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Benevia (FMC)"
                ],
                "safety": "डंक मारने वाली मक्खी और अंदर के अंडों/मैगट का संपूर्ण सफाया; खीरे बिल्कुल सीधे व बेदाग।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "brinjal": {
    "jassid-little-leaf": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "120 मिली / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला)",
                "technical": "Flonicamid 50% WG",
                "dose": "0.4 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Ulala (UPL)"
                ],
                "safety": "रस चूसक कीटों की सूंड को तुरंत बंद करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 ग्राम / एकड़"
          },
          {
                "nameHi": "डायफेंथियूरॉन 50% WP + पाइरीप्रॉक्सीफेन 10% EC",
                "technical": "Diafenthiuron 50% WP + Pyriproxyfen 10% EC",
                "dose": "200 ग्राम डायफेंथियूरॉन + 200 मिली पाइरीप्रॉक्सीफेन प्रति एकड़",
                "brands": [
                      "Pegasus + Lano"
                ],
                "safety": "सफेद मक्खी, तेला और उनके अंडों का 100% खात्मा; लिटिल लीफ का फैलाव रुकता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 g + 200 ml / एकड़",
                "isTopPerformer": true
          }
    ],
    "shoot-fruit-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG + नीम तेल 10,000 PPM",
                "technical": "Emamectin Benzoate 5% SG + Neem Oil",
                "dose": "100 ग्राम इमामेक्टिन + 300 मिली नीम तेल प्रति एकड़",
                "brands": [
                      "Proclaim + Neem Gold"
                ],
                "safety": "शुरुआती कोपल अवस्था में असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 g + 300 ml / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन) या फेम (50 ml)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़) या फ्लूबेंडियामाइड (50 ml)",
                "brands": [
                      "Coragen (FMC)",
                      "Fame (Bayer - 50 ml)"
                ],
                "safety": "फल व तना छेदक पर 21 दिन की अटूट सुरक्षा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट) या एक्सपोनस (34 ml)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.9 मिली / लीटर पानी (180 मिली प्रति एकड़) या ब्रोफ्लैनिलाइड (34 ml)",
                "brands": [
                      "Delegate (Corteva)",
                      "Exponus (BASF - 34 ml)"
                ],
                "safety": "रेजिस्टेंट बैंगन फल छेदक पर भारत का सबसे नवीनतम व सर्वोच्च ट्रायल रिजल्ट; बैंगन 100% बेदाग।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "180 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "epilachna-beetle": [
          {
                "nameHi": "प्रोफेनोफॉस 50% EC",
                "technical": "Profenofos 50% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Curacron (Syngenta)",
                      "Carina"
                ],
                "safety": "संपर्क व पेट का विष।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "वयस्क भृंग और कांटेदार ग्रब दोनों पर तीव्र नॉकडाउन।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 मिली / एकड़"
          },
          {
                "nameHi": "नोवाल्यूरॉन 5.25% + इंडोक्साकार्ब 4.5% SC (प्लेथोरा)",
                "technical": "Novaluron 5.25% + Indoxacarb 4.5% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Plethora (Adama)"
                ],
                "safety": "हड्डा भृंग के अंडों को फूटने से रोकता है और वयस्क को खत्म करता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "red-spider-mite": [
          {
                "nameHi": "प्रोपारगाइट 57% EC (ओमाइट)",
                "technical": "Propargite 57% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Omite (Dhanuka)"
                ],
                "safety": "वयस्क मकड़ी पर तुरंत असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "स्पिरोमीसिफेन 22.9% SC (ओबेरॉन)",
                "technical": "Spiromesifen 22.9% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Oberon (Bayer)"
                ],
                "safety": "मकड़ी के सभी जीवन चरणों पर प्रभावी।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "इटोक्साजोल 10% SC (बोर्नियो)",
                "technical": "Etoxazole 10% SC",
                "dose": "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)",
                "brands": [
                      "Borneo (Sumitomo)"
                ],
                "safety": "अंडों को फूटने से रोकता है; 20 दिन का लंबा असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "160 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "phomopsis-blight": [
          {
                "nameHi": "मैंकोजेब 75% WP",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "सिस्टेमिक व संपर्क दोहरा असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "बैंगन फल सड़न पर सर्वश्रेष्ठ नियंत्रण; फल चमकदार व कड़े रहते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "sugarcane": {
    "termite-white-grub": [
          {
                "nameHi": "क्लोरपायरीफॉस 50% EC",
                "technical": "Chlorpyrifos 50% EC",
                "dose": "1 लीटर प्रति एकड़ (कूड़ में धार से या पानी के साथ)",
                "brands": [
                      "Dursban 50",
                      "Tricel"
                ],
                "safety": "दीमक पर तेज असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "1 लीटर / एकड़"
          },
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL + फिप्रोनिल 5% SC",
                "technical": "Imidacloprid 17.8% SL + Fipronil 5% SC",
                "dose": "250 मिली इमिडाक्लोप्रिड + 500 मिली फिप्रोनिल प्रति एकड़",
                "brands": [
                      "Confidor + Regent"
                ],
                "safety": "जड़ों को दीमक व लट से मुक्त रखता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 ml + 500 ml / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG (लेसेन्टा)",
                "technical": "Fipronil 40% + Imidacloprid 40% WG",
                "dose": "150–200 ग्राम प्रति एकड़ (बुवाई के समय कूड़ में डालें)",
                "brands": [
                      "Lesenta (Bayer)"
                ],
                "safety": "दीमक और सफेद लट दोनों का 100% खात्मा; अंकुरण 95%+ होता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150-200 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "early-shoot-borer": [
          {
                "nameHi": "कार्टाप हाइड्रोक्लोराइड 4% GR",
                "technical": "Cartap Hydrochloride 4% GR",
                "dose": "10 किग्रा प्रति एकड़ (कल्लों के पास डालकर मिट्टी चढ़ाएँ)",
                "brands": [
                      "Padan 4G (Dhanuka)"
                ],
                "safety": "कल्लों के समय जड़ों में डालें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "10 किग्रा / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 0.6% GR (फर्टेरा)",
                "technical": "Fipronil 0.6% GR",
                "dose": "5 किग्रा प्रति एकड़ (कल्लों के पास डालकर सिंचाई करें)",
                "brands": [
                      "Ferterra (FMC)"
                ],
                "safety": "कंसुआ के साथ-साथ कल्ले अधिक फूटते हैं।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "5 किग्रा / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "150 मिली प्रति एकड़ (400 लीटर पानी में जड़ों में धार से ड्रेंचिंग)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "गन्ने के कंसुआ पर भारत का नंबर-1 गोल्ड स्टैंडर्ड; 60 दिन तक बेजोड़ सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़ (ड्रेंचिंग)",
                "isTopPerformer": true
          }
    ],
    "top-borer": [
          {
                "nameHi": "कार्बोफ्यूरॉन 3% CG",
                "technical": "Carbofuran 3% CG",
                "dose": "12 किग्रा प्रति एकड़ (गोभ के पास डालें)",
                "brands": [
                      "Furadan"
                ],
                "safety": "पारंपरिक सिस्टेमिक दानेदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "12 किग्रा / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 0.4% GR (फर्टेरा)",
                "technical": "Chlorantraniliprole 0.4% GR",
                "dose": "6 किग्रा प्रति एकड़ (खेत में डालकर हल्की सिंचाई करें)",
                "brands": [
                      "Ferterra (FMC)"
                ],
                "safety": "जड़ों द्वारा अवशोषित होकर चोटी तक पहुंचता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "6 किग्रा / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "150 मिली प्रति एकड़ (जड़ों के पास ड्रेंचिंग)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "चोटी बेधक की तीसरी व चौथी पीढ़ी का पूर्ण खात्मा; गन्ने की लंबाई पूरी मिलती है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pokkah-boeng": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
                "technical": "Copper Oxychloride 50% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Blitox 50 (Rallis)"
                ],
                "safety": "चोटी पर फफूंद बीजाणुओं को नष्ट करता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "सिस्टेमिक उपचार व बाहरी सुरक्षा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)"
                ],
                "safety": "पोक्का बोइंग को तुरंत सुखाकर चोटी को सीधा खोलता है; गन्ना फिर से तेजी से बढ़ता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pyrilla-woolly-aphid": [
          {
                "nameHi": "क्लोरपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "2.5 मिली / लीटर पानी (500 मिली प्रति एकड़)",
                "brands": [
                      "Dursban",
                      "Tricel"
                ],
                "safety": "संपर्क नॉकडाउन असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "सिस्टेमिक रस चूसक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "पायरिला व वूली एफिड दोनों का 100% खात्मा; पत्तियां फिर से साफ व हरी।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "red-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — जड़ों में)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "जड़ों के पास ड्रेंचिंग करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "थियोफैनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)"
                ],
                "safety": "संवहनी नलियों में कवक फैलाव को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "स्वस्थ गन्नों को लाल सड़न के संक्रमण से बचाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "potato": {
    "black-scurf": [
          {
                "nameHi": "मैंकोजेब 75% WP (डाइथेन एम-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (घोल बनाकर कंद उपचार करें)",
                "brands": [
                      "Dithane M-45 (Corteva)"
                ],
                "safety": "पारंपरिक बीज कंद उपचार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "बीज उपचार"
          },
          {
                "nameHi": "पेनफ्लूफेन 22.43% FS (एमिस्टो प्राइम)",
                "technical": "Penflufen 22.43% FS",
                "dose": "80 मिली प्रति 1000 किग्रा बीज आलू (स्प्रे करके उपचारित करें)",
                "brands": [
                      "Emesto Prime (Bayer)"
                ],
                "safety": "काली पपड़ी पर भारत का सबसे आधुनिक बीज उपचार मॉलिक्यूल।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर (प्रीमियम बीज उपचार)",
                "dosePerAcre": "80 ml / 1000 kg बीज"
          },
          {
                "nameHi": "थिफ्लूज़ामाइड 24% SC (पल्सर)",
                "technical": "Thifluzamide 24% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़ — ड्रेंचिंग/स्प्रे)",
                "brands": [
                      "Pulsor (Indofil)"
                ],
                "safety": "खेत में काली पपड़ी और तना कैंकर का 100% सफाया; आलू एकदम साफ व चिकने।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "cutworm": [
          {
                "nameHi": "क्लोरपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "3 मिली / लीटर पानी (600 मिली प्रति एकड़ — शाम को तने के पास)",
                "brands": [
                      "Dursban",
                      "Tricel"
                ],
                "safety": "शाम को मिट्टी के ऊपर स्प्रे करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 मिली / एकड़"
          },
          {
                "nameHi": "लैम्ब्डा-साइहेलोथ्रिन 5% EC (कराटे)",
                "technical": "Lambda-cyhalothrin 5% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Karate (Syngenta)"
                ],
                "safety": "तेज संपर्क क्रिया से कटुआ सुंडी को तुरंत मारता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 9.3% + लैम्ब्डा-साइहेलोथ्रिन 4.6% ZC (एम्पलिगो)",
                "technical": "Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Ampligo (Syngenta)"
                ],
                "safety": "कटुआ कीट का रात में शत-प्रतिशत खात्मा; एक भी पौधा नहीं कटता।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "aphid-whitefly": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "120 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "सिस्टेमिक क्रिया द्वारा पत्तियों में रस के साथ फैलता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला) या डायफेंथियूरॉन 50% WP (200 g)",
                "technical": "Flonicamid 50% WG",
                "dose": "0.4 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़) या पेगासस (200 g)",
                "brands": [
                      "Ulala (UPL)",
                      "Pegasus (Syngenta - 200 g)"
                ],
                "safety": "आलू के माहू व सफेद मक्खी पर सबसे आधुनिक नियंत्रण; लीफ रोल वायरस का प्रसार तुरंत रुकता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "early-blight": [
          {
                "nameHi": "मैंकोजेब 75% WP (डाइथेन एम-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "प्रोपिनेब 70% WP (एंट्राकोल)",
                "technical": "Propineb 70% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Antracol (Bayer)"
                ],
                "safety": "जिंक युक्त कवकनाशी; पौधे हरे व मजबूत रहते हैं।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "अगेती झुलसा को तुरंत सुखाकर नई पत्तियों को स्वस्थ रखता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "late-blight": [
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)",
                      "Moximate"
                ],
                "safety": "कोहरे के मौसम में तुरंत पहला सुरक्षात्मक स्प्रे।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "डाइमेथोमॉर्फ 50% WP (एक्रोबैट) + मैंकोजेब 75% WP",
                "technical": "Dimethomorph 50% WP + Mancozeb 75% WP",
                "dose": "200 ग्राम एक्रोबैट + 500 ग्राम मैंकोजेब प्रति एकड़",
                "brands": [
                      "Acrobat (BASF) + Dithane M-45"
                ],
                "safety": "ओओमाइसिटी कवक की कोशिका दीवार को तोड़ता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 g + 500 g / एकड़"
          },
          {
                "nameHi": "मैंडीप्रोपामिड 23.4% SC (रिवस) या इक्वेशन प्रो (200 ml)",
                "technical": "Mandipropamid 23.4% SC",
                "dose": "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़) या फेमोक्साडोन+साइमोक्सानिल",
                "brands": [
                      "Revus (Syngenta)",
                      "Equation Pro (Corteva - 200 ml)"
                ],
                "safety": "पछेती झुलसा पर दुनिया का नंबर-1 कवकनाशी; मोमी परत पर चिपककर 15 दिन अभेद्य सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "160 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "bajra": {
    "shoot-fly-white-grub": [
          {
                "nameHi": "क्लोरपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "2.5 मिली / लीटर पानी (500 मिली प्रति एकड़)",
                "brands": [
                      "Dursban",
                      "Tricel"
                ],
                "safety": "जड़ों के पास स्प्रे करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 मिली / एकड़"
          },
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL + साइपरमेथ्रिन 25% EC",
                "technical": "Imidacloprid 17.8% SL + Cypermethrin 25% EC",
                "dose": "100 मिली इमिडाक्लोप्रिड + 150 मिली साइपरमेथ्रिन प्रति एकड़",
                "brands": [
                      "Confidor + Ustaad"
                ],
                "safety": "तना मक्खी पर तेज नॉकडाउन।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 ml + 150 ml / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "तना मक्खी और सफेद लट दोनों का संपूर्ण खात्मा; कल्ले अधिक फूटते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "downy-mildew-green-ear": [
          {
                "nameHi": "मैंकोजेब 75% WP",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)"
                ],
                "safety": "शुरुआती सुरक्षात्मक स्प्रे।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil MZ (Syngenta)"
                ],
                "safety": "सिस्टेमिक क्रिया द्वारा जोगिया रोग को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "हरित बाली रोग और पत्ती झुलसा दोनों पर पूर्ण नियंत्रण; सिट्टे स्वस्थ बनते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ergot-smut": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "बाली निकलते समय सुरक्षात्मक स्प्रे।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)",
                      "Bumper"
                ],
                "safety": "कवक बीजाणुओं के अंकुरण को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "अर्गट व कांगियारी पर सबसे प्रभावी उपचारात्मक फफूंदनाशक; दाने जहरीले नहीं बनते।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "wheat": {
    "termite-root-aphid": [
          {
                "nameHi": "क्लोरपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "1 लीटर प्रति एकड़ (सिंचाई के पानी में नाली से चलाएँ)",
                "brands": [
                      "Dursban",
                      "Tricel"
                ],
                "safety": "दीमक पर तेज असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "1 लीटर / एकड़"
          },
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "150 मिली प्रति एकड़ (जड़ों की तरफ स्प्रे)",
                "brands": [
                      "Confidor (Bayer)"
                ],
                "safety": "जड़ माहू का सिस्टेमिक खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG + फिप्रोनिल 5% SC",
                "technical": "Thiamethoxam 25% WG + Fipronil 5% SC",
                "dose": "100 ग्राम थियामेथोक्साम + 300 मिली फिप्रोनिल प्रति एकड़",
                "brands": [
                      "Actara + Regent"
                ],
                "safety": "दीमक और जड़ माहू दोनों का 100% खात्मा; जड़ों का शानदार विकास।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 g + 300 ml / एकड़",
                "isTopPerformer": true
          }
    ],
    "pink-stem-borer": [
          {
                "nameHi": "कार्टाप हाइड्रोक्लोराइड 4% GR",
                "technical": "Cartap Hydrochloride 4% GR",
                "dose": "8 किग्रा प्रति एकड़ (सिंचाई से पहले खेत में बिखेरें)",
                "brands": [
                      "Padan 4G (Dhanuka)"
                ],
                "safety": "जड़ों द्वारा अवशोषित होकर तने तक पहुंचता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "8 किग्रा / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 0.4% GR (फर्टेरा)",
                "technical": "Chlorantraniliprole 0.4% GR",
                "dose": "4 किग्रा प्रति एकड़",
                "brands": [
                      "Ferterra (FMC)"
                ],
                "safety": "तने के अंदर बैठी गुलाबी सुंडी को खत्म करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "4 किग्रा / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़ स्प्रे)",
                "brands": [
                      "Alika (Syngenta)"
                ],
                "safety": "गुलाबी तना छेदक और माहू दोनों पर अचूक वार; कल्ले स्वस्थ रहते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "yellow-rust": [
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)"
                ],
                "safety": "पीला रतुआ का सबसे लोकप्रिय व विश्वसनीय फफूंदनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "रतुआ को तुरंत सुखाकर झंडा पत्ती (Flag leaf) को सुरक्षित रखता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "पीला रतुआ पर 100% कंट्रोल; झंडा पत्ती अंत तक हरी, दाने मोटे व चमकदार।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "brown-rust": [
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)"
                ],
                "safety": "भूरा रतुआ की रोकथाम व सुरक्षा।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "भूरा रतुआ के दानों को तुरंत सुखाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "भूरा रतुआ पर संपूर्ण नियंत्रण; दाना सिकुड़ने से बचाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "yellow-brown-rust": [
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)"
                ],
                "safety": "पीला रतुआ का सबसे लोकप्रिय व विश्वसनीय फफूंदनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)"
                ],
                "safety": "रतुआ को तुरंत सुखाकर झंडा पत्ती (Flag leaf) को सुरक्षित रखता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "पीला व भूरा रतुआ दोनों पर 100% कंट्रोल; झंडा पत्ती अंत तक हरी, दाने मोटे व चमकदार।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-karnal-bunt": [
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कोंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)",
                "brands": [
                      "Contaf (Tata Rallis)"
                ],
                "safety": "चूर्णी फफूंद नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 मिली / एकड़"
          },
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)"
                ],
                "safety": "करनाल बंट और रतुआ दोनों को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "करनाल बंट, रतुआ और चूर्णी फफूंद तीनों पर पूर्ण सुरक्षा; दाने 100% साफ व भारी।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "earhead-aphid": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP",
                "technical": "Acetamiprid 20% SP",
                "dose": "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)",
                "brands": [
                      "Manik",
                      "Pride"
                ],
                "safety": "किफायती सिस्टेमिक माहू नाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "60 ग्राम / एकड़"
          },
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.4 ग्राम / लीटर पानी (50-80 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "बालियों में रस के साथ फैलकर माहू का तुरंत खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "50-80 ग्राम / एकड़"
          },
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)"
                ],
                "safety": "माहू का 100% नॉकडाउन; 15 दिन तक बालियों पर दोबारा माहू नहीं आता।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "onion": {
    "basal-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "जड़ों के पास ड्रेंचिंग करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "थियोफैनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)"
                ],
                "safety": "गुलाबी जड़ रोग और कंद सड़न पर उत्कृष्ट सिस्टेमिक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "जड़ों को स्वस्थ रखकर कंद का आकार और वजन 25% बढ़ाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips": [
          {
                "nameHi": "प्रोफेनोफॉस 40% + साइपरमेथ्रिन 4% EC (रॉकेट)",
                "technical": "Profenofos 40% + Cypermethrin 4% EC",
                "dose": "1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)",
                "brands": [
                      "Roket (PI)",
                      "Polytrin"
                ],
                "safety": "शुरुआती थ्रिप्स नियंत्रण (सिलिकॉन स्टिकर अवश्य मिलाएँ)।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 मिली / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG (लेसेन्टा)",
                "technical": "Fipronil 40% + Imidacloprid 40% WG",
                "dose": "60–80 ग्राम प्रति एकड़ (0.4 ग्राम / लीटर पानी)",
                "brands": [
                      "Lesenta (Bayer)"
                ],
                "safety": "पत्तियों के जोड़ में छिपे थ्रिप्स का सिस्टेमिक खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60-80 ग्राम / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट) या एक्सपोनस (30 ml)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़) या ब्रोफ्लैनिलाइड (30 ml)",
                "brands": [
                      "Delegate (Corteva)",
                      "Exponus (BASF - 30 ml)"
                ],
                "safety": "प्याज व लहसुन के थ्रिप्स पर भारत का सबसे सटीक व अचूक मॉलिक्यूल; चांदी जैसे दाग खत्म।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "purple-blotch": [
          {
                "nameHi": "मैंकोजेब 75% WP या प्रोपिनेब 70% WP (एंट्राकोल)",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)",
                      "Antracol (Bayer)"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "सिस्टेमिक क्रिया — बैंगनी धब्बों को तुरंत बढ़ने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो / कैब्रियो टॉप)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़) या कैब्रियो टॉप (500 g)",
                "brands": [
                      "Nativo (Bayer)",
                      "Cabrio Top (BASF - 500 g)"
                ],
                "safety": "बैंगनी धब्बा व स्टेमफिलियम झुलसा पर भारत का नंबर-1 कवकनाशी; पत्तियां हरी व कंद सुडौल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "downy-mildew-twister": [
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)"
                ],
                "safety": "प्रारंभिक डाउनी मिल्ड्यू नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)"
                ],
                "safety": "डाउनी मिल्ड्यू को फैलने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन + टेबुकोनाज़ोल (कस्टोडिया 250 ml) + GA नियंत्रक",
                "technical": "Azoxystrobin + Tebuconazole SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "ट्विस्टर रोग (जलेबी रोग) व डाउनी मिल्ड्यू पर दोहरा सिस्टेमिक नियंत्रण; गर्दन सीधी होती है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "garlic": {
    "basal-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "जड़ों के पास ड्रेंचिंग करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "थियोफैनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)"
                ],
                "safety": "गुलाबी जड़ रोग और कंद सड़न पर उत्कृष्ट सिस्टेमिक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "जड़ों को स्वस्थ रखकर कंद का आकार और वजन 25% बढ़ाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips": [
          {
                "nameHi": "प्रोफेनोफॉस 40% + साइपरमेथ्रिन 4% EC (रॉकेट)",
                "technical": "Profenofos 40% + Cypermethrin 4% EC",
                "dose": "1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)",
                "brands": [
                      "Roket (PI)",
                      "Polytrin"
                ],
                "safety": "शुरुआती थ्रिप्स नियंत्रण (सिलिकॉन स्टिकर अवश्य मिलाएँ)।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 मिली / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG (लेसेन्टा)",
                "technical": "Fipronil 40% + Imidacloprid 40% WG",
                "dose": "60–80 ग्राम प्रति एकड़ (0.4 ग्राम / लीटर पानी)",
                "brands": [
                      "Lesenta (Bayer)"
                ],
                "safety": "पत्तियों के जोड़ में छिपे थ्रिप्स का सिस्टेमिक खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60-80 ग्राम / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट) या एक्सपोनस (30 ml)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़) या ब्रोफ्लैनिलाइड (30 ml)",
                "brands": [
                      "Delegate (Corteva)",
                      "Exponus (BASF - 30 ml)"
                ],
                "safety": "प्याज व लहसुन के थ्रिप्स पर भारत का सबसे सटीक व अचूक मॉलिक्यूल; चांदी जैसे दाग खत्म।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "purple-blotch": [
          {
                "nameHi": "मैंकोजेब 75% WP या प्रोपिनेब 70% WP (एंट्राकोल)",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Dithane M-45 (Corteva)",
                      "Antracol (Bayer)"
                ],
                "safety": "सुरक्षात्मक संपर्क कवकनाशी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "सिस्टेमिक क्रिया — बैंगनी धब्बों को तुरंत बढ़ने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो / कैब्रियो टॉप)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़) या कैब्रियो टॉप (500 g)",
                "brands": [
                      "Nativo (Bayer)",
                      "Cabrio Top (BASF - 500 g)"
                ],
                "safety": "बैंगनी धब्बा व स्टेमफिलियम झुलसा पर भारत का नंबर-1 कवकनाशी; पत्तियां हरी व कंद सुडौल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "downy-mildew-twister": [
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)"
                ],
                "safety": "प्रारंभिक डाउनी मिल्ड्यू नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (करजेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)"
                ],
                "safety": "डाउनी मिल्ड्यू को फैलने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन + टेबुकोनाज़ोल (कस्टोडिया 250 ml) + GA नियंत्रक",
                "technical": "Azoxystrobin + Tebuconazole SC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "ट्विस्टर रोग (जलेबी रोग) व डाउनी मिल्ड्यू पर दोहरा सिस्टेमिक नियंत्रण; गर्दन सीधी होती है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "cotton": {
    "jassid-aphid": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL या थियामेथोक्साम 25% WG",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़) या अकतारा (80 g)",
                "brands": [
                      "Confidor (Bayer)",
                      "Actara (80 g)"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला)",
                "technical": "Flonicamid 50% WG",
                "dose": "0.3–0.4 ग्राम / लीटर पानी (60-80 ग्राम प्रति एकड़)",
                "brands": [
                      "Ulala (UPL)"
                ],
                "safety": "तेला व माहू की सूंड बंद कर देता है; पत्तियां तुरंत हरी हो जाती हैं।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60-80 ग्राम / एकड़"
          },
          {
                "nameHi": "डाइनोटिफ्यूरान 20% SG (ओशीन / टोकन)",
                "technical": "Dinotefuran 20% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Osheen (PI)",
                      "Token"
                ],
                "safety": "थर्ड जनरेशन नियोनिकोटिनॉइड; हॉपर बर्न से तुरंत राहत और 20 दिन की सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips": [
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)"
                ],
                "safety": "थ्रिप्स पर संपर्क व पेट क्रिया।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "थ्रिप्स पर अचूक प्रहार; पत्तियां तुरंत सीधी।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "फ्लक्सामेटामाइड 10% EC (ग्रेसिया)",
                "technical": "Fluxametamide 10% EC",
                "dose": "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)",
                "brands": [
                      "Gracia (Godrej)"
                ],
                "safety": "रेजिस्टेंट थ्रिप्स पर भारत का सबसे नवीनतम व तीव्र मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "160 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "whitefly": [
          {
                "nameHi": "डायफेंथियूरॉन 50% WP (पेगासस/पोलो)",
                "technical": "Diafenthiuron 50% WP",
                "dose": "1 ग्राम / लीटर पानी (200 ग्राम प्रति एकड़)",
                "brands": [
                      "Pegasus (Syngenta)",
                      "Polo"
                ],
                "safety": "वयस्क व निम्फ का नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "200 ग्राम / एकड़"
          },
          {
                "nameHi": "पाइरीप्रॉक्सीफेन 10% EC + डायफेंथियूरॉन 50% WP",
                "technical": "Pyriproxyfen 10% EC + Diafenthiuron 50% WP",
                "dose": "250 मिली पाइरीप्रॉक्सीफेन + 200 ग्राम डायफेंथियूरॉन प्रति एकड़",
                "brands": [
                      "Lano + Pegasus"
                ],
                "safety": "अंडे, बच्चे और वयस्क तीनों अवस्थाओं का संपूर्ण खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 ml + 200 g / एकड़"
          },
          {
                "nameHi": "एफिडोपाइरोपेन 50 g/L DC (सेफिना) या ओबेरॉन (200 ml)",
                "technical": "Afidopyropen 50 g/L DC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़) या स्पिरोमीसिफेन (200 ml)",
                "brands": [
                      "Sefina (BASF)",
                      "Oberon (Bayer - 200 ml)"
                ],
                "safety": "सफेद मक्खी पर दुनिया का सबसे आधुनिक व असरदार टेक्निकल; 20 दिन तक कपास बिल्कुल साफ।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "400 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "mealybug": [
          {
                "nameHi": "प्रोफेनोफॉस 50% EC",
                "technical": "Profenofos 50% EC",
                "dose": "2.5 मिली / लीटर पानी (500 मिली प्रति एकड़)",
                "brands": [
                      "Curacron (Syngenta)",
                      "Carina"
                ],
                "safety": "मोमी परत को गलाकर संपर्क से मारता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 मिली / एकड़"
          },
          {
                "nameHi": "बुप्रोफेज़िन 25% SC (एप्लाउड)",
                "technical": "Buprofezin 25% SC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Applaud (Rallis)"
                ],
                "safety": "कीट विकास अवरोधक (IGR) — केंचुल बदलने से रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "स्पिरोटेट्रामैट 150 OD (मोवेंटो एनर्जी)",
                "technical": "Spirotetramat 150 OD",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Movento Energy (Bayer)"
                ],
                "safety": "2-वे सिस्टेमिक — पौधे में ऊपर और नीचे दोनों तरफ बहकर छिपे मिलीबग को खत्म करता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pink-bollworm": [
          {
                "nameHi": "प्रोफेनोफॉस 40% + साइपरमेथ्रिन 4% EC (रॉकेट)",
                "technical": "Profenofos 40% + Cypermethrin 4% EC",
                "dose": "2 मिली / लीटर पानी (400 मिली प्रति एकड़)",
                "brands": [
                      "Roket (PI)",
                      "Polytrin"
                ],
                "safety": "अंडा नाशक व संपर्क क्रिया।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 मिली / एकड़"
          },
          {
                "nameHi": "फेनप्रोपैथ्रिन 10% EC (डैनिटोल) या डेल्टामेथ्रिन 10% EC",
                "technical": "Fenpropathrin 10% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़) या डेल्टामेथ्रिन (200 ml)",
                "brands": [
                      "Danitol (Sumitomo)",
                      "Decis (200 ml)"
                ],
                "safety": "गुलाबी सुंडी के पतंगों और छोटी इल्लियों पर तेज नॉकडाउन।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 9.3% + लैम्ब्डा-साइहेलोथ्रिन 4.6% ZC (एम्पलिगो)",
                "technical": "Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़) या इमामेक्टिन+ल्यूफेन्यूरॉन",
                "brands": [
                      "Ampligo (Syngenta)",
                      "Ampligo ZC"
                ],
                "safety": "गुलाबी सुंडी पर भारत का सबसे सटीक व शक्तिशाली मॉलिक्यूल; टिंडे 100% साफ व सफेद रुई।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "boll-rot-blight": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP + स्ट्रेप्टोसाइक्लिन",
                "technical": "Copper Oxychloride 50% WP + Streptocycline",
                "dose": "500 ग्राम ब्लाइटॉक्स + 18 ग्राम स्ट्रेप्टोसाइक्लिन प्रति एकड़",
                "brands": [
                      "Blitox 50 + Streptocycline"
                ],
                "safety": "जीवाणु झुलसा (Angular Leaf Spot) पर उपयोगी।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 g + 18 g / एकड़"
          },
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "दहिया रोग और टिंडा सड़न पर संपर्क व सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन SC (प्रियाक्सर / एमिस्टार टॉप)",
                "technical": "Fluxapyroxad 167 g/L + Pyraclostrobin 333 g/L SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़) या एमिस्टार टॉप (200 ml)",
                "brands": [
                      "Priaxor (BASF)",
                      "Amistar Top (Syngenta - 200 ml)"
                ],
                "safety": "कपास के दहिया रोग, पत्ती धब्बा और टिंडा सड़न पर भारत का सबसे प्रीमियम फफूंदनाशक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "moong": {
    "fusarium-wilt-root-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "जड़ों में धार से ड्रेंचिंग करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "थियोफैनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)"
                ],
                "safety": "दलहनी फसलों के उकठा पर बेहतरीन सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर / कस्टोडिया 250 ml)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Custodia (250 ml)"
                ],
                "safety": "जड़ गलन और उकठा पर सबसे शक्तिशाली सिस्टेमिक सुरक्षा; पौधे सूखने से बचते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv-whitefly": [
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "रस चूसक कीटों का शुरुआती नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · वेक्टर नियंत्रण",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "एसिटामिप्रिड 20% SP + नीम तेल 10000 PPM",
                "technical": "Acetamiprid 20% SP + Neem Oil",
                "dose": "80 ग्राम एसिटामिप्रिड + 300 मिली नीम तेल प्रति एकड़",
                "brands": [
                      "Manik + Neem Gold"
                ],
                "safety": "रासायनिक व जैविक का दोहरा सुरक्षा चक्र।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 g + 300 ml / एकड़"
          },
          {
                "nameHi": "पाइरीप्रॉक्सीफेन 10% + बाइफेंथ्रिन 10% EC या उलाला (60 g)",
                "technical": "Pyriproxyfen 10% + Bifenthrin 10% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़) या फ्लोनिकामिड (60 g)",
                "brands": [
                      "Lano (Sumitomo)",
                      "Ulala (UPL - 60 g)"
                ],
                "safety": "सफेद मक्खी के अंडों, बच्चों और वयस्कों का संपूर्ण सफाया; YMV वायरस का फैलाव तुरंत बंद।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "flower-thrips-aphid": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)"
                ],
                "safety": "फूलों के अंदर छिपे थ्रिप्स पर अचूक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "फूल झड़ने से रोकता है और शत-प्रतिशत फलियां बनती हैं; दलहनी फसलों का नंबर-1 मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pod-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "Missile"
                ],
                "safety": "छोटी इल्लियों पर तुरंत असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC (अवांट) या फेम (40 ml)",
                "technical": "Indoxacarb 14.5% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़) या फ्लूबेंडियामाइड (40 ml)",
                "brands": [
                      "Avaunt (FMC)",
                      "Fame (Bayer - 40 ml)"
                ],
                "safety": "बड़ी हेलिकोवर्पा इल्लियों का भोजन तुरंत बंद।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "चना, अरहर, मूंग में फली छेदक पर 21 दिन की अटूट सुरक्षा; दाने 100% साबुत।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-ascochyta": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "सुरक्षात्मक व सिस्टेमिक मिश्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कोंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Contaf (Tata Rallis)"
                ],
                "safety": "चूर्णी फफूंद को तेजी से सुखाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)"
                ],
                "safety": "चूर्णी फफूंद और एस्कोकाइटा झुलसा दोनों पर संपूर्ण नियंत्रण; फलियां बेदाग।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "urad": {
    "fusarium-wilt-root-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Bavistin (Crystal)"
                ],
                "safety": "जड़ों में धार से ड्रेंचिंग करें।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "थियोफैनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)"
                ],
                "safety": "दलहनी फसलों के उकठा पर बेहतरीन सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर / कस्टोडिया 250 ml)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Custodia (250 ml)"
                ],
                "safety": "जड़ गलन और उकठा पर सबसे शक्तिशाली सिस्टेमिक सुरक्षा; पौधे सूखने से बचते हैं।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv-whitefly": [
          {
                "nameHi": "थियामेथोक्साम 25% WG (अकतारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)"
                ],
                "safety": "रस चूसक कीटों का शुरुआती नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · वेक्टर नियंत्रण",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "एसिटामिप्रिड 20% SP + नीम तेल 10000 PPM",
                "technical": "Acetamiprid 20% SP + Neem Oil",
                "dose": "80 ग्राम एसिटामिप्रिड + 300 मिली नीम तेल प्रति एकड़",
                "brands": [
                      "Manik + Neem Gold"
                ],
                "safety": "रासायनिक व जैविक का दोहरा सुरक्षा चक्र।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 g + 300 ml / एकड़"
          },
          {
                "nameHi": "पाइरीप्रॉक्सीफेन 10% + बाइफेंथ्रिन 10% EC या उलाला (60 g)",
                "technical": "Pyriproxyfen 10% + Bifenthrin 10% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़) या फ्लोनिकामिड (60 g)",
                "brands": [
                      "Lano (Sumitomo)",
                      "Ulala (UPL - 60 g)"
                ],
                "safety": "सफेद मक्खी के अंडों, बच्चों और वयस्कों का संपूर्ण सफाया; YMV वायरस का फैलाव तुरंत बंद।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "flower-thrips-aphid": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)"
                ],
                "safety": "शुरुआती रस चूसक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़"
          },
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)"
                ],
                "safety": "फूलों के अंदर छिपे थ्रिप्स पर अचूक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "फूल झड़ने से रोकता है और शत-प्रतिशत फलियां बनती हैं; दलहनी फसलों का नंबर-1 मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pod-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "Missile"
                ],
                "safety": "छोटी इल्लियों पर तुरंत असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC (अवांट) या फेम (40 ml)",
                "technical": "Indoxacarb 14.5% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़) या फ्लूबेंडियामाइड (40 ml)",
                "brands": [
                      "Avaunt (FMC)",
                      "Fame (Bayer - 40 ml)"
                ],
                "safety": "बड़ी हेलिकोवर्पा इल्लियों का भोजन तुरंत बंद।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)"
                ],
                "safety": "चना, अरहर, मूंग में फली छेदक पर 21 दिन की अटूट सुरक्षा; दाने 100% साबुत।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-ascochyta": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)"
                ],
                "safety": "सुरक्षात्मक व सिस्टेमिक मिश्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कोंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Contaf (Tata Rallis)"
                ],
                "safety": "चूर्णी फफूंद को तेजी से सुखाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)"
                ],
                "safety": "चूर्णी फफूंद और एस्कोकाइटा झुलसा दोनों पर संपूर्ण नियंत्रण; फलियां बेदाग।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "arhar": {
    "fusarium-wilt-root-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Bavistin (Crystal)",
                      "Derosal"
                ],
                "safety": "जड़ों में ड्रेंचिंग करें; केवल मिट्टी के संपर्क में असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · पारंपरिक / शुरुआती",
                "dosePerAcre": "400 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "थायोफेनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "1.5-2 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)",
                      "Topsin-M"
                ],
                "safety": "जड़ों व तने दोनों पर तेज सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1-1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Tebusul"
                ],
                "safety": "उकठा व जड़ गलन पर सबसे गहरा सिस्टेमिक नियंत्रण।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv-whitefly": [
          {
                "nameHi": "थियामेथोक्सम 25% WG (एक्टारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)",
                      "Anant"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "100 ग्राम / एकड़",
                "resistanceWarning": "कई क्षेत्रों में सफेद मक्खी में प्रतिरोधक क्षमता देखी गई है।"
          },
          {
                "nameHi": "एसिटामिप्रिड 20% SP + नीम तेल",
                "technical": "Acetamiprid 20% SP (80 g) + Neem Oil (300 ml)",
                "dose": "0.4 ग्राम + 1.5 मिली / लीटर पानी",
                "brands": [
                      "Pride (Dhanuka)",
                      "Manik"
                ],
                "safety": "सफेद मक्खी के अंडों और प्रौढ़ों दोनों पर दोहरा असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 ग्राम + 300 मिली / एकड़"
          },
          {
                "nameHi": "पायरीप्रॉक्सीफेन 10% + बाइफेन्थ्रिन 10% EC",
                "technical": "Pyriproxyfen 10% + Bifenthrin 10% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Lano (Sumitomo)",
                      "Dhaakad"
                ],
                "safety": "सफेद मक्खी के अंडे, शिशु और उड़ने वाले कीड़ों का संपूर्ण सफाया।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "flower-thrips-aphid": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)",
                      "Tatamida"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़",
                "resistanceWarning": "लगातार छिड़काव से थ्रिप्स में प्रतिरोधक क्षमता।"
          },
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)",
                      "Mahaveer"
                ],
                "safety": "फूलों के अंदर छिपे थ्रिप्स पर बेहतरीन मारक क्षमता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)",
                      "Largo"
                ],
                "safety": "थ्रिप्स और माहू पर आधुनिक ग्रीन मॉलिक्यूल, तुरंत ड्रॉप डाउन असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pod-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "EM-1"
                ],
                "safety": "शुरुआती व मध्यम आकार की इल्लियों पर तेज असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती इल्ली स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC या फ्लूबेन्डियामाइड 39.35% SC",
                "technical": "Indoxacarb 14.5% SC (150 ml) या Flubendiamide 39.35% SC (40 ml)",
                "dose": "0.75 मिली / लीटर पानी",
                "brands": [
                      "Avaunt (FMC)",
                      "Fame (Bayer)"
                ],
                "safety": "बड़ी सुंडियों के भोजन को तुरंत बंद कर देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3-0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)",
                      "Cover"
                ],
                "safety": "फली छेदक पर 21 दिनों तक अटूट सुरक्षा कवच, बेस्ट फील्ड ट्रायल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-ascochyta": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)",
                      "Sixer"
                ],
                "safety": "सिस्टेमिक व कॉन्टैक्ट फंगीसाइड का संतुलित मिश्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "500 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Contaf Plus (Tata)",
                      "Sitara"
                ],
                "safety": "चूर्णी फफूंद पर गहरा आंतरिक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Godrej Custodia"
                ],
                "safety": "ब्रॉड स्पेक्ट्रम फंगीसाइड, पत्ती और फलियों को हरा-भरा और चमकदार रखता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "chana": {
    "fusarium-wilt-root-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Bavistin (Crystal)",
                      "Derosal"
                ],
                "safety": "जड़ों में ड्रेंचिंग करें; केवल मिट्टी के संपर्क में असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · पारंपरिक / शुरुआती",
                "dosePerAcre": "400 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "थायोफेनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "1.5-2 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)",
                      "Topsin-M"
                ],
                "safety": "जड़ों व तने दोनों पर तेज सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1-1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Tebusul"
                ],
                "safety": "उकठा व जड़ गलन पर सबसे गहरा सिस्टेमिक नियंत्रण।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv-whitefly": [
          {
                "nameHi": "थियामेथोक्सम 25% WG (एक्टारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)",
                      "Anant"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "100 ग्राम / एकड़",
                "resistanceWarning": "कई क्षेत्रों में सफेद मक्खी में प्रतिरोधक क्षमता देखी गई है।"
          },
          {
                "nameHi": "एसिटामिप्रिड 20% SP + नीम तेल",
                "technical": "Acetamiprid 20% SP (80 g) + Neem Oil (300 ml)",
                "dose": "0.4 ग्राम + 1.5 मिली / लीटर पानी",
                "brands": [
                      "Pride (Dhanuka)",
                      "Manik"
                ],
                "safety": "सफेद मक्खी के अंडों और प्रौढ़ों दोनों पर दोहरा असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 ग्राम + 300 मिली / एकड़"
          },
          {
                "nameHi": "पायरीप्रॉक्सीफेन 10% + बाइफेन्थ्रिन 10% EC",
                "technical": "Pyriproxyfen 10% + Bifenthrin 10% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Lano (Sumitomo)",
                      "Dhaakad"
                ],
                "safety": "सफेद मक्खी के अंडे, शिशु और उड़ने वाले कीड़ों का संपूर्ण सफाया।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "flower-thrips-aphid": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)",
                      "Tatamida"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़",
                "resistanceWarning": "लगातार छिड़काव से थ्रिप्स में प्रतिरोधक क्षमता।"
          },
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)",
                      "Mahaveer"
                ],
                "safety": "फूलों के अंदर छिपे थ्रिप्स पर बेहतरीन मारक क्षमता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)",
                      "Largo"
                ],
                "safety": "थ्रिप्स और माहू पर आधुनिक ग्रीन मॉलिक्यूल, तुरंत ड्रॉप डाउन असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pod-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "EM-1"
                ],
                "safety": "शुरुआती व मध्यम आकार की इल्लियों पर तेज असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती इल्ली स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC या फ्लूबेन्डियामाइड 39.35% SC",
                "technical": "Indoxacarb 14.5% SC (150 ml) या Flubendiamide 39.35% SC (40 ml)",
                "dose": "0.75 मिली / लीटर पानी",
                "brands": [
                      "Avaunt (FMC)",
                      "Fame (Bayer)"
                ],
                "safety": "बड़ी सुंडियों के भोजन को तुरंत बंद कर देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3-0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)",
                      "Cover"
                ],
                "safety": "फली छेदक पर 21 दिनों तक अटूट सुरक्षा कवच, बेस्ट फील्ड ट्रायल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-ascochyta": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)",
                      "Sixer"
                ],
                "safety": "सिस्टेमिक व कॉन्टैक्ट फंगीसाइड का संतुलित मिश्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "500 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Contaf Plus (Tata)",
                      "Sitara"
                ],
                "safety": "चूर्णी फफूंद पर गहरा आंतरिक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Godrej Custodia"
                ],
                "safety": "ब्रॉड स्पेक्ट्रम फंगीसाइड, पत्ती और फलियों को हरा-भरा और चमकदार रखता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "masoor": {
    "fusarium-wilt-root-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Bavistin (Crystal)",
                      "Derosal"
                ],
                "safety": "जड़ों में ड्रेंचिंग करें; केवल मिट्टी के संपर्क में असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · पारंपरिक / शुरुआती",
                "dosePerAcre": "400 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "थायोफेनेट मिथाइल 70% WP (रोको)",
                "technical": "Thiophanate Methyl 70% WP",
                "dose": "1.5-2 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Roko (Biostadt)",
                      "Topsin-M"
                ],
                "safety": "जड़ों व तने दोनों पर तेज सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1-1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Tebusul"
                ],
                "safety": "उकठा व जड़ गलन पर सबसे गहरा सिस्टेमिक नियंत्रण।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv-whitefly": [
          {
                "nameHi": "थियामेथोक्सम 25% WG (एक्टारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)",
                      "Anant"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर सिस्टेमिक नियंत्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "100 ग्राम / एकड़",
                "resistanceWarning": "कई क्षेत्रों में सफेद मक्खी में प्रतिरोधक क्षमता देखी गई है।"
          },
          {
                "nameHi": "एसिटामिप्रिड 20% SP + नीम तेल",
                "technical": "Acetamiprid 20% SP (80 g) + Neem Oil (300 ml)",
                "dose": "0.4 ग्राम + 1.5 मिली / लीटर पानी",
                "brands": [
                      "Pride (Dhanuka)",
                      "Manik"
                ],
                "safety": "सफेद मक्खी के अंडों और प्रौढ़ों दोनों पर दोहरा असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 ग्राम + 300 मिली / एकड़"
          },
          {
                "nameHi": "पायरीप्रॉक्सीफेन 10% + बाइफेन्थ्रिन 10% EC",
                "technical": "Pyriproxyfen 10% + Bifenthrin 10% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Lano (Sumitomo)",
                      "Dhaakad"
                ],
                "safety": "सफेद मक्खी के अंडे, शिशु और उड़ने वाले कीड़ों का संपूर्ण सफाया।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "flower-thrips-aphid": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Confidor (Bayer)",
                      "Tatamida"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 मिली / एकड़",
                "resistanceWarning": "लगातार छिड़काव से थ्रिप्स में प्रतिरोधक क्षमता।"
          },
          {
                "nameHi": "फिप्रोनिल 5% SC (रीजेंट)",
                "technical": "Fipronil 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Regent (BASF)",
                      "Mahaveer"
                ],
                "safety": "फूलों के अंदर छिपे थ्रिप्स पर बेहतरीन मारक क्षमता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)",
                      "Largo"
                ],
                "safety": "थ्रिप्स और माहू पर आधुनिक ग्रीन मॉलिक्यूल, तुरंत ड्रॉप डाउन असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "pod-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "EM-1"
                ],
                "safety": "शुरुआती व मध्यम आकार की इल्लियों पर तेज असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती इल्ली स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "इंडोक्साकार्ब 14.5% SC या फ्लूबेन्डियामाइड 39.35% SC",
                "technical": "Indoxacarb 14.5% SC (150 ml) या Flubendiamide 39.35% SC (40 ml)",
                "dose": "0.75 मिली / लीटर पानी",
                "brands": [
                      "Avaunt (FMC)",
                      "Fame (Bayer)"
                ],
                "safety": "बड़ी सुंडियों के भोजन को तुरंत बंद कर देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3-0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)",
                      "Cover"
                ],
                "safety": "फली छेदक पर 21 दिनों तक अटूट सुरक्षा कवच, बेस्ट फील्ड ट्रायल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-ascochyta": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)",
                      "Sixer"
                ],
                "safety": "सिस्टेमिक व कॉन्टैक्ट फंगीसाइड का संतुलित मिश्रण।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "500 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% EC (कंटाफ)",
                "technical": "Hexaconazole 5% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Contaf Plus (Tata)",
                      "Sitara"
                ],
                "safety": "चूर्णी फफूंद पर गहरा आंतरिक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Godrej Custodia"
                ],
                "safety": "ब्रॉड स्पेक्ट्रम फंगीसाइड, पत्ती और फलियों को हरा-भरा और चमकदार रखता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "mustard": {
    "painted-bug-sawfly": [
          {
                "nameHi": "क्विनालफॉस 25% EC (एकालक्स)",
                "technical": "Quinalphos 25% EC",
                "dose": "1.75 मिली / लीटर पानी (350 मिली प्रति एकड़)",
                "brands": [
                      "Ekalux (Syngenta)",
                      "Flash"
                ],
                "safety": "कॉन्टैक्ट व पेट का जहर, तुरंत नॉकडाउन असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "350 मिली / एकड़",
                "resistanceWarning": "पुरानी केमिस्ट्री; तेज धूप में असर घटता है।"
          },
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL + साइपरमेथ्रिन 25% EC",
                "technical": "Imidacloprid 17.8% SL (100 ml) + Cypermethrin 25% EC (100 ml)",
                "dose": "0.5 मिली + 0.5 मिली / लीटर पानी",
                "brands": [
                      "Confidor + Ustaad"
                ],
                "safety": "रस चूसक बग और पत्ती खाने वाली सुंडी दोनों पर दोहरा वार।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 मिली + 100 मिली / एकड़"
          },
          {
                "nameHi": "थियामेथोक्सम 12.6% + लैम्ब्डा-साइहेलोथ्रिन 9.5% ZC (अलिका)",
                "technical": "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Alika (Syngenta)",
                      "Ampligo"
                ],
                "safety": "सिस्टेमिक व कॉन्टैक्ट का सबसे आधुनिक ZC फॉर्मूलेशन, लंबा असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "white-rust-alternaria": [
          {
                "nameHi": "मैंकोजेब 75% WP (इंडोफिल M-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "2.5-3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Indofil M-45",
                      "Dithane M-45"
                ],
                "safety": "सुरक्षात्मक कॉन्टैक्ट फंगीसाइड, पत्तियों पर परत बनाता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · सुरक्षात्मक स्तर",
                "dosePerAcre": "600 ग्राम / एकड़",
                "resistanceWarning": "बारिश या तेज ओस में धुल जाता है।"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)",
                      "Krilaxyl"
                ],
                "safety": "सफेद रतुआ (Albugo) पर आंतरिक सिस्टेमिक मारक क्षमता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "सफेद रतुआ और अल्टरनेरिया दोनों का एक साथ संपूर्ण इलाज, पत्तियां अंत तक हरी।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "sclerotinia-rot": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Bavistin (Crystal)",
                      "Derosal"
                ],
                "safety": "पारंपरिक सिस्टेमिक दवा, शुरुआती फैलाव को रोकती है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "400 ग्राम / एकड़",
                "resistanceWarning": "स्क्लेरोटिनिया कवक में कार्बेन्डाजिम के प्रति सहनशीलता बढ़ी है।"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 25.9% EC (फॉलिकुर)",
                "technical": "Tebuconazole 25.9% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Folicur (Bayer)",
                      "Tebusul"
                ],
                "safety": "तने के अंदर गहराई तक प्रवेश कर कवक जाल को खत्म करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन + टेबुकोनाज़ोल (कस्टोडिया) या बोस्केलिड + पायराक्लोस्ट्रोबिन",
                "technical": "Azoxystrobin + Tebuconazole SC (250 ml) या Boscalid + Pyraclostrobin",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)",
                      "Signum (BASF)"
                ],
                "safety": "तना गलन पर आधुनिक रिसर्च फंगीसाइड, तने को टूटने से पूरी तरह बचाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "mustard-aphid": [
          {
                "nameHi": "डाइमेथोएट 30% EC (रोगोर)",
                "technical": "Dimethoate 30% EC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Rogor (FMC)",
                      "Tafgor"
                ],
                "safety": "तीव्र गंध वाला सिस्टेमिक व कॉन्टैक्ट कीटनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · पारंपरिक स्तर",
                "dosePerAcre": "300 मिली / एकड़",
                "resistanceWarning": "मधुमक्खियों के लिए अत्यधिक विषैला; लगातार इस्तेमाल से प्रतिरोध।"
          },
          {
                "nameHi": "थियामेथोक्सम 25% WG (एक्टारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.4-0.5 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)",
                      "Anant"
                ],
                "safety": "पौधे में तुरंत अवशोषित होकर माहू का रस चूसना रोक देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "80 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला) या पाइमेट्रोज़िन 50% WG (चेस)",
                "technical": "Flonicamid 50% WG (60 g) या Pymetrozine 50% WG (100 g)",
                "dose": "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)",
                "brands": [
                      "Ulala (UPL)",
                      "Chess (Syngenta)"
                ],
                "safety": "माहू के सुई जैसे मुंह को तुरंत पैरालाइज करता है, मित्र कीटों और मधुमक्खियों के लिए सुरक्षित।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "60 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "bhindi": {
    "damping-off": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP (बाविस्टिन)",
                "technical": "Carbendazim 50% WP",
                "dose": "1.5-2 ग्राम / लीटर पानी (300 ग्राम प्रति एकड़)",
                "brands": [
                      "Bavistin (Crystal)",
                      "Derosal"
                ],
                "safety": "जड़ों में ड्रेंचिंग करें; शुरुआती स्तर पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)",
                "dosePerAcre": "300 ग्राम / एकड़",
                "resistanceWarning": "लगातार इस्तेमाल से कवक में प्रतिरोध का जोखिम।"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Ridomil Gold (Syngenta)",
                      "Krilaxyl"
                ],
                "safety": "जड़ गलन और आद्र गलन पर दोहरी सुरक्षा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "पौध गलन व तना सड़न पर सबसे आधुनिक सुरक्षात्मक व उपचारात्मक फंगीसाइड।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "jassid-whitefly": [
          {
                "nameHi": "थियामेथोक्सम 25% WG (एक्टारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.4-0.5 ग्राम / लीटर पानी (80 ग्राम प्रति एकड़)",
                "brands": [
                      "Actara (Syngenta)",
                      "Anant"
                ],
                "safety": "शुरुआती रस चूसक कीटों पर सिस्टेमिक असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "80 ग्राम / एकड़",
                "resistanceWarning": "सफेद मक्खी में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "फ्लोनिकामिड 50% WG (उलाला)",
                "technical": "Flonicamid 50% WG",
                "dose": "0.3 ग्राम / लीटर पानी (60 ग्राम प्रति एकड़)",
                "brands": [
                      "Ulala (UPL)"
                ],
                "safety": "तेला व सफेद मक्खी का रस चूसना 30 मिनट में बंद कर देता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60 ग्राम / एकड़"
          },
          {
                "nameHi": "डायाफेन्थियूरॉन 50% WP (पेगासस) या एफिडोपायरोपेन 50 DC (सेफिना)",
                "technical": "Diafenthiuron 50% WP (200 g) या Afidopyropen 50 DC (400 ml)",
                "dose": "1 ग्राम / लीटर पानी (200 ग्राम प्रति एकड़)",
                "brands": [
                      "Pegasus (Syngenta)",
                      "Sefina (BASF)"
                ],
                "safety": "वयस्क सफेद मक्खी और तेला दोनों पर वाष्पशील व सिस्टेमिक मारक क्षमता।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "ymv": [
          {
                "nameHi": "एसिटामिप्रिड 20% SP + नीम तेल",
                "technical": "Acetamiprid 20% SP (80 g) + Neem Oil (300 ml)",
                "dose": "0.4 ग्राम + 1.5 मिली / लीटर पानी",
                "brands": [
                      "Pride (Dhanuka)",
                      "Manik"
                ],
                "safety": "सफेद मक्खी को भगाने और मारने का शुरुआती उपाय।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · वेक्टर नियंत्रण",
                "dosePerAcre": "80 ग्राम + 300 मिली / एकड़"
          },
          {
                "nameHi": "पायरीप्रॉक्सीफेन 10% + बाइफेन्थ्रिन 10% EC",
                "technical": "Pyriproxyfen 10% + Bifenthrin 10% EC",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Lano (Sumitomo)",
                      "Dhaakad"
                ],
                "safety": "सफेद मक्खी के अंडों, शिशुओं और उड़ने वाली मक्खी का खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "डायाफेन्थियूरॉन 47.8% SC + सीवीड / वायरस रोधक",
                "technical": "Diafenthiuron 47.8% SC (200 ml) + Seaweed / Viricide (250 ml)",
                "dose": "1 मिली + 1.25 मिली / लीटर पानी",
                "brands": [
                      "Pegasus SC",
                      "Viroban / Biovita"
                ],
                "safety": "वेक्टर सफेद मक्खी का तुरंत नॉकडाउन + पौधे की प्रतिरोधक क्षमता में वृद्धि।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली + 250 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "fruit-borer": [
          {
                "nameHi": "इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)",
                "technical": "Emamectin Benzoate 5% SG",
                "dose": "0.5 ग्राम / लीटर पानी (100 ग्राम प्रति एकड़)",
                "brands": [
                      "Proclaim (Syngenta)",
                      "EM-1"
                ],
                "safety": "शुरुआती फल छेदक इल्ली पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "100 ग्राम / एकड़"
          },
          {
                "nameHi": "क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.3-0.4 मिली / लीटर पानी (60 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)",
                      "Cover"
                ],
                "safety": "फल छेदक इल्ली पर 15-20 दिनों तक अचूक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट) या फ्लूबेन्डियामाइड 39.35% SC (फेम)",
                "technical": "Spinetoram 11.7% SC (150 ml) या Flubendiamide 39.35% SC (40 ml)",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)",
                      "Fame (Bayer)"
                ],
                "safety": "बड़ी से बड़ी इल्ली का तुरंत खात्मा, आधुनिक ग्रीन मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "150 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "red-spider-mite": [
          {
                "nameHi": "फेनाज़ाक्विन 10% EC (मैजिस्टर)",
                "technical": "Fenazaquin 10% EC",
                "dose": "1.5-2 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Magister (Dhanuka)"
                ],
                "safety": "कॉन्टैक्ट माइटिसाइड, शुरुआती मकड़ी पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "300 मिली / एकड़",
                "resistanceWarning": "मकड़ियों में जल्दी प्रतिरोध विकसित होता है।"
          },
          {
                "nameHi": "स्पाइरोमेसिफेन 22.9% SC (ओबेरॉन)",
                "technical": "Spiromesifen 22.9% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Oberon (Bayer)",
                      "Volt"
                ],
                "safety": "मकड़ी के अंडों और शिशुओं के लिपिड विकास को रोकता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एटोक्साज़ोल 10% SC (बोर्नियो)",
                "technical": "Etoxazole 10% SC",
                "dose": "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)",
                "brands": [
                      "Borneo (Sumitomo)"
                ],
                "safety": "मकड़ी के सभी अंडों को नष्ट करने वाला सबसे एडवांस्ड ओविसाइडल माइटिसाइड।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "160 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "powdery-mildew": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP (साफ)",
                "technical": "Carbendazim 12% + Mancozeb 63% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़)",
                "brands": [
                      "Saaf (UPL)",
                      "Sixer"
                ],
                "safety": "पारंपरिक फफूंदनाशक, शुरुआती धब्बों पर असरदार।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "500 ग्राम / एकड़",
                "resistanceWarning": "लगातार प्रयोग से कवक में प्रतिरोधक क्षमता का खतरा।"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% SC (कंटाफ)",
                "technical": "Hexaconazole 5% SC",
                "dose": "1.5 मिली / लीटर पानी (300 मिली प्रति एकड़)",
                "brands": [
                      "Contaf Plus (Tata)"
                ],
                "safety": "सफेद चूर्ण रोग पर गहरा आंतरिक सिस्टेमिक असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "चूर्ण रोग और पत्ती धब्बों का संपूर्ण निवारण, पत्तियों में लंबे समय तक चमक।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "ginger": {
    "shoot-borer": [
          {
                "nameHi": "क्लोरोपायरीफॉस 20% EC (डरसबैन)",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "2.5 मिली / लीटर पानी (500 मिली प्रति एकड़)",
                "brands": [
                      "Dursban (Corteva)",
                      "Tricel"
                ],
                "safety": "तेज गंध वाला कॉन्टैक्ट व वाष्पशील कीटनाशक।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · पारंपरिक स्तर",
                "dosePerAcre": "500 मिली / एकड़",
                "resistanceWarning": "पुरानी केमिस्ट्री; लगातार प्रयोग से बचें।"
          },
          {
                "nameHi": "लैम्ब्डा-साइहेलोथ्रिन 5% EC (कराटे) या फ्लूबेन्डियामाइड 39.35% SC",
                "technical": "Lambda-cyhalothrin 5% EC (250 ml) या Flubendiamide (50 ml)",
                "dose": "1.25 मिली / लीटर पानी",
                "brands": [
                      "Karate (Syngenta)",
                      "Fame (Bayer)"
                ],
                "safety": "तने के अंदर छिपी सुंडी पर तेज नॉकडाउन असर।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "क्लोरएंट्रानिलिप्रोल 18.5% SC (कोराजन)",
                "technical": "Chlorantraniliprole 18.5% SC",
                "dose": "0.4 मिली / लीटर पानी (80 मिली प्रति एकड़)",
                "brands": [
                      "Coragen (FMC)",
                      "Cover"
                ],
                "safety": "तने में प्रवेश करने वाली सुंडी पर 21 दिनों तक अटूट सुरक्षा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "rhizome-rot": [
          {
                "nameHi": "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
                "technical": "Copper Oxychloride 50% WP",
                "dose": "4 ग्राम / लीटर पानी (800 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Blitox (Rallis)",
                      "Blue Copper"
                ],
                "safety": "मिट्टी में कवक को मारने के लिए ड्रेंचिंग; किसी EC दवा के साथ न मिलाएं।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती ड्रेंचिंग",
                "dosePerAcre": "800 ग्राम / एकड़"
          },
          {
                "nameHi": "मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल गोल्ड)",
                "technical": "Metalaxyl 8% + Mancozeb 64% WP",
                "dose": "2.5 ग्राम / लीटर पानी (500 ग्राम प्रति एकड़ — जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Ridomil Gold (Syngenta)",
                      "Krilaxyl"
                ],
                "safety": "पायथियम (Pythium) कवक पर सबसे अचूक सिस्टेमिक ड्रेंचिंग।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "500 ग्राम / एकड़"
          },
          {
                "nameHi": "फेनामिडोन 10% + मैंकोजेब 50% WG (सेक्टिन) या फॉसेटिल-अल 80% WP (एलियेट)",
                "technical": "Fenamidone 10% + Mancozeb 50% WG (600 g) या Fosetyl-Al 80% WP (500 g)",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Sectin (Bayer)",
                      "Aliette (Bayer)"
                ],
                "safety": "प्रकंद सड़न पर आधुनिक रिसर्च फंगीसाइड, पौधे के दोनों संवहनी तंतुओं (Xylem व Phloem) में संचरित।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "600 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "bacterial-wilt": [
          {
                "nameHi": "कॉपर हाइड्रॉक्साइड 53.8% DF + स्ट्रेप्टोसाइक्लिन",
                "technical": "Copper Hydroxide 53.8% DF (400 g) + Streptocycline (24 g)",
                "dose": "2 ग्राम + 0.12 ग्राम / लीटर पानी (जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Kocide (Corteva) + Plantomycin"
                ],
                "safety": "जीवाणु नाशक और तांबा आधारित सुरक्षा कवच।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर (ड्रेंचिंग)",
                "dosePerAcre": "400 ग्राम + 24 ग्राम / एकड़"
          },
          {
                "nameHi": "कासुगामाइसिन 3% SL + कॉपर ऑक्सीक्लोराइड 50% WP",
                "technical": "Kasugamycin 3% SL (400 ml) + Copper Oxychloride (500 g)",
                "dose": "2 मिली + 2.5 ग्राम / लीटर पानी",
                "brands": [
                      "Kasu-B (Dhanuka) + Blitox"
                ],
                "safety": "एंटीबायोटिक व कॉपर का शक्तिशाली मिश्रण, जीवाणु की दीवार तोड़ता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "400 मिली + 500 ग्राम / एकड़"
          },
          {
                "nameHi": "कासुगामाइसिन 5% + कॉपर ऑक्सीक्लोराइड 45% WP + ब्लीचिंग पाउडर",
                "technical": "Kasugamycin 5% + Copper Oxychloride 45% WP (400 g) + Bleaching Powder (मिट्टी में नाली के पास)",
                "dose": "2 ग्राम / लीटर पानी (400 ग्राम प्रति एकड़)",
                "brands": [
                      "Kasu-Max (Dhanuka)"
                ],
                "safety": "जीवाणु उकठा पर सबसे उन्नत सिस्टेमिक एंटीबायोटिक कॉपर फॉर्मूलेशन।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "400 ग्राम / एकड़",
                "isTopPerformer": true
          }
    ],
    "leaf-spot": [
          {
                "nameHi": "मैंकोजेब 75% WP (इंडोफिल M-45)",
                "technical": "Mancozeb 75% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Indofil M-45"
                ],
                "safety": "कॉन्टैक्ट सुरक्षा, धब्बों के फैलाव को रोकता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · सुरक्षात्मक स्तर",
                "dosePerAcre": "600 ग्राम / एकड़",
                "resistanceWarning": "बारिश में जल्दी धुल जाता है।"
          },
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
                "technical": "Propiconazole 25% EC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Tilt (Syngenta)",
                      "Result"
                ],
                "safety": "पत्तियों के अंदर गहराई से धब्बों को सुखाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC (एमिस्टार टॉप)",
                "technical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dose": "1 मिली / लीटर पानी (200 मिली प्रति एकड़)",
                "brands": [
                      "Amistar Top (Syngenta)",
                      "Custodia"
                ],
                "safety": "पत्ती धब्बे का संपूर्ण इलाज, पत्तियों को अंत तक हरा और सक्रिय रखता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "200 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  },
  "mango": {
    "mango-hopper": [
          {
                "nameHi": "इमिडाक्लोप्रिड 17.8% SL (कॉन्फिडोर)",
                "technical": "Imidacloprid 17.8% SL",
                "dose": "0.4 मिली / लीटर पानी",
                "brands": [
                      "Confidor (Bayer)",
                      "Tatamida"
                ],
                "safety": "बौर पर हॉपर की शुरुआती रोकथाम।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "80 मिली / 200 लीटर पानी",
                "resistanceWarning": "लगातार इस्तेमाल से हॉपर में प्रतिरोध का खतरा।"
          },
          {
                "nameHi": "थियामेथोक्सम 25% WG (एक्टारा)",
                "technical": "Thiamethoxam 25% WG",
                "dose": "0.3 ग्राम / लीटर पानी",
                "brands": [
                      "Actara (Syngenta)",
                      "Anant"
                ],
                "safety": "रस चूसक भुनगे को तुरंत पैरालाइज करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "60 ग्राम / 200 लीटर पानी"
          },
          {
                "nameHi": "डिनोटिफ्यूरान 20% SG (ओशीन) या बुप्रोफेजिन 25% SC",
                "technical": "Dinotefuran 20% SG (0.4 g/L) या Buprofezin 25% SC (1.5 ml/L)",
                "dose": "0.4 ग्राम / लीटर पानी",
                "brands": [
                      "Oshin (PI Industries)",
                      "Applaud"
                ],
                "safety": "तीसरी पीढ़ी का नियोनिकोटिनोइड, हॉपर और उसके शिशुओं पर तुरंत ड्रॉप-डाउन असर।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 ग्राम / 200 लीटर पानी",
                "isTopPerformer": true
          }
    ],
    "powdery-mildew": [
          {
                "nameHi": "घुलनशील सल्फर 80% WP (सल्फेक्स)",
                "technical": "Wettable Sulphur 80% WP",
                "dose": "2 ग्राम / लीटर पानी",
                "brands": [
                      "Sulfex (Excel)",
                      "Thiovit"
                ],
                "safety": "सुरक्षात्मक फफूंदनाशक व सूक्ष्म पोषक तत्व सल्फर की आपूर्ति।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · सुरक्षात्मक स्तर",
                "dosePerAcre": "400 ग्राम / 200 लीटर पानी",
                "resistanceWarning": "35 डिग्री से अधिक तापमान पर फूल जलने का खतरा रहता है।"
          },
          {
                "nameHi": "हेक्साकोनाज़ोल 5% SC (कंटाफ)",
                "technical": "Hexaconazole 5% SC",
                "dose": "1.5 मिली / लीटर पानी",
                "brands": [
                      "Contaf Plus (Tata)"
                ],
                "safety": "बौर के डंठल के अंदर प्रवेश कर दहिया को पूरी तरह सुखाता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली / 200 लीटर पानी"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.5 ग्राम / लीटर पानी",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "दहिया रोग पर विश्व प्रसिद्ध फॉर्मूलेशन, बौर को झड़ने से बचाता है और फल सेटिंग बढ़ाता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 ग्राम / 200 लीटर पानी",
                "isTopPerformer": true
          }
    ],
    "anthracnose-fruit-fly": [
          {
                "nameHi": "कार्बेन्डाजिम 12% + मैंकोजेब 63% WP + मिथाइल यूजेनॉल ट्रैप",
                "technical": "Carbendazim 12% + Mancozeb 63% WP (2 g/L) + Methyl Eugenol Traps",
                "dose": "2 ग्राम / लीटर पानी + 8 ट्रैप / एकड़",
                "brands": [
                      "Saaf + Pheromone Traps"
                ],
                "safety": "शुरुआती काले धब्बों पर सुरक्षा और फल मक्खी नर कीटों की ट्रैपिंग।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "400 ग्राम + ट्रैप्स"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल + डेल्टामेथ्रिन 2.8% EC",
                "technical": "Azoxystrobin + Difenoconazole (1 ml/L) + Deltamethrin 2.8% EC (1 ml/L)",
                "dose": "1 मिली + 1 मिली / लीटर पानी",
                "brands": [
                      "Amistar Top + Decis"
                ],
                "safety": "काले धब्बे अंदर से साफ और वयस्क मक्खियों का नॉकडाउन।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "200 मिली + 200 मिली / 200 लीटर पानी"
          },
          {
                "nameHi": "पायराक्लोस्ट्रोबिन 20% WG (कैब्रियो) + स्पिनोसैड 45% SC (ट्रेसर)",
                "technical": "Pyraclostrobin 20% WG (0.5 g/L) + Spinosad 45% SC (0.3 ml/L)",
                "dose": "0.5 ग्राम + 0.3 मिली / लीटर पानी",
                "brands": [
                      "Cabrio Top (BASF) + Tracer (Corteva)"
                ],
                "safety": "फलों पर चमक व एन्थ्रेक्नोज का पूर्ण सफाया + फल मक्खी का प्राकृतिक सुरक्षित खात्मा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 ग्राम + 60 मिली / 200 लीटर पानी",
                "isTopPerformer": true
          }
    ]
  },
  "banana": {
    "panama-wilt": [
          {
                "nameHi": "कार्बेन्डाजिम 50% WP + कॉपर ऑक्सीक्लोराइड 50% WP",
                "technical": "Carbendazim 50% WP (2 g/L) + Copper Oxychloride (3 g/L)",
                "dose": "2 ग्राम + 3 ग्राम / लीटर पानी (जड़ों में ड्रेंचिंग)",
                "brands": [
                      "Bavistin + Blitox"
                ],
                "safety": "जड़ों में कवक व सड़ांध रोकने का पारंपरिक उपाय।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती ड्रेंचिंग",
                "dosePerAcre": "400 ग्राम + 600 ग्राम / एकड़",
                "resistanceWarning": "पनामा विल्ट रेस 4 पर साधारण फंगीसाइड का असर सीमित।"
          },
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC + स्ट्रेप्टोसाइक्लिन",
                "technical": "Propiconazole 25% EC (1.5 ml/L) + Streptocycline (0.1 g/L)",
                "dose": "1.5 मिली + 0.1 ग्राम / लीटर पानी",
                "brands": [
                      "Tilt (Syngenta) + Plantomycin"
                ],
                "safety": "फफूंद व जीवाणु सड़ांध दोनों पर सिस्टेमिक नियंत्रण।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 मिली + 20 ग्राम / एकड़"
          },
          {
                "nameHi": "एज़ोक्सीस्ट्रोबिन 11% + टेबुकोनाज़ोल 18.3% SC (कस्टोडिया)",
                "technical": "Azoxystrobin 11% + Tebuconazole 18.3% SC",
                "dose": "1.5 मिली / लीटर पानी (जड़ों व तने पर ड्रेंचिंग)",
                "brands": [
                      "Custodia (Adama)"
                ],
                "safety": "केले की संवहनी नलिकाओं में तेजी से फैलने वाले कवक को रोकता है।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "300 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "sigatoka": [
          {
                "nameHi": "प्रोपिकोनाज़ोल 25% EC + मिनरल ऑयल/स्टिकर",
                "technical": "Propiconazole 25% EC (200 ml/एकड़) + Mineral Oil / Sticker",
                "dose": "1 मिली / लीटर पानी + 1 मिली स्टिकर",
                "brands": [
                      "Tilt (Syngenta)",
                      "Result"
                ],
                "safety": "सिगाटोका के धब्बों को तुरंत रोकता है।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "200 मिली / एकड़",
                "resistanceWarning": "लगातार प्रोपिकोनाज़ोल छिड़कने से सिगाटोका कवक में प्रतिरोध देखा गया है।"
          },
          {
                "nameHi": "टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG (नेटिवो)",
                "technical": "Tebuconazole 50% + Trifloxystrobin 25% WG",
                "dose": "0.6 ग्राम / लीटर पानी (120 ग्राम प्रति एकड़)",
                "brands": [
                      "Nativo (Bayer)"
                ],
                "safety": "पत्तियों के दोनों तरफ सुरक्षित परत बनाता है और नए पत्तों को सुरक्षित रखता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "120 ग्राम / एकड़"
          },
          {
                "nameHi": "फ्लुक्सापाइरॉक्साड + पायराक्लोस्ट्रोबिन (प्रियाक्सर)",
                "technical": "Fluxapyroxad + Pyraclostrobin SC",
                "dose": "0.6 मिली / लीटर पानी (120 मिली प्रति एकड़)",
                "brands": [
                      "Priaxor (BASF)"
                ],
                "safety": "सिगाटोका पर सबसे एडवांस्ड SDHI मॉलिक्यूल, पत्तियां अंत तक हरी व घौद का अधिकतम वजन।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "120 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "scarring-beetle-thrips": [
          {
                "nameHi": "क्लोरोपायरीफॉस 20% EC",
                "technical": "Chlorpyrifos 20% EC",
                "dose": "2 मिली / लीटर पानी (घौद पर स्प्रे)",
                "brands": [
                      "Dursban (Corteva)",
                      "Tricel"
                ],
                "safety": "कमल निकलते समय प्रारंभिक स्प्रे।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्प्रे",
                "dosePerAcre": "400 मिली / 200 लीटर पानी"
          },
          {
                "nameHi": "एसीफेट 75% SP (असाटाफ)",
                "technical": "Acephate 75% SP",
                "dose": "1.5 ग्राम / लीटर पानी",
                "brands": [
                      "Asataf (Rallis)",
                      "Starthene"
                ],
                "safety": "फूलों और घौद के अंदर गहराई तक प्रवेश कर थ्रिप्स का खात्मा।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "300 ग्राम / 200 लीटर पानी"
          },
          {
                "nameHi": "स्पिनोसैड 45% SC (ट्रेसर) या स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinosad 45% SC (0.4 ml/L) या Spinetoram 11.7% SC (0.5 ml/L)",
                "dose": "0.4 मिली / लीटर पानी",
                "brands": [
                      "Tracer (Corteva)",
                      "Delegate"
                ],
                "safety": "केले के छिलके पर शून्य दाग, निर्यात गुणवत्ता के लिए सबसे सुरक्षित ग्रीन मॉलिक्यूल।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "80 मिली / 200 लीटर पानी",
                "isTopPerformer": true
          }
    ]
  },
  "grapes": {
    "downy-mildew": [
          {
                "nameHi": "साइमोक्सानिल 8% + मैंकोजेब 64% WP (कर्जेट)",
                "technical": "Cymoxanil 8% + Mancozeb 64% WP",
                "dose": "3 ग्राम / लीटर पानी (600 ग्राम प्रति एकड़)",
                "brands": [
                      "Curzate (Corteva)",
                      "Moximate"
                ],
                "safety": "सुरक्षात्मक और छिपे हुए कवक पर शुरुआती उपचारात्मक असर।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती रोकथाम",
                "dosePerAcre": "600 ग्राम / एकड़"
          },
          {
                "nameHi": "डाइमेथोमॉर्फ 50% WP + मेटिराम 70% WG",
                "technical": "Dimethomorph 50% WP (250 g) + Metiram 70% WG (500 g)",
                "dose": "1.25 ग्राम + 2.5 ग्राम / लीटर पानी",
                "brands": [
                      "Acrobat (BASF) + Polyram"
                ],
                "safety": "कवक की कोशिका भित्ति को तुरंत नष्ट करने वाला शक्तिशाली संयोजन।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 ग्राम + 500 ग्राम / एकड़"
          },
          {
                "nameHi": "मैंडीप्रोपामिड 23.4% SC",
                "technical": "Mandipropamid 23.4% SC",
                "dose": "0.8 मिली / लीटर पानी (160 मिली प्रति एकड़)",
                "brands": [
                      "Revus (Syngenta)"
                ],
                "safety": "डाउनी मिल्ड्यू पर विश्व स्तरीय अत्याधुनिक मॉलिक्यूल, बारिश में 1 घंटे बाद भी नहीं धुलता।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "160 मिली / एकड़",
                "isTopPerformer": true
          },
          {
                "nameHi": "अमिसुलब्रोम 17.7% SC",
                "technical": "Amisulbrom 17.7% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Leimay (Bharat Certis)"
                ],
                "safety": "कवक की सभी अवस्थाओं (स्पोर अंकुरण व जूस्पोर) पर अचूक क्रिया।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          }
    ],
    "powdery-mildew": [
          {
                "nameHi": "माइक्लोब्यूटानिल 10% WP",
                "technical": "Myclobutanil 10% WP",
                "dose": "0.75 ग्राम / लीटर पानी (150 ग्राम प्रति एकड़)",
                "brands": [
                      "Systhane (Corteva)",
                      "Boon"
                ],
                "safety": "प्रारंभिक चूर्णी फफूंद को रोकने वाला ट्रियाज़ोल।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · शुरुआती स्तर",
                "dosePerAcre": "150 ग्राम / एकड़",
                "resistanceWarning": "लगातार उपयोग से कवक में प्रतिरोध का खतरा।"
          },
          {
                "nameHi": "टेट्राकोनाज़ोल 3.8% EW",
                "technical": "Tetraconazole 3.8% EW",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Domark (Isagro)"
                ],
                "safety": "अंगूर की त्वचा पर सुरक्षित, दानों पर कोई सफेद दाग नहीं छोड़ता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "250 मिली / एकड़"
          },
          {
                "nameHi": "डिफेनोकोनाज़ोल 25% EC",
                "technical": "Difenoconazole 25% EC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Score (Syngenta)"
                ],
                "safety": "सिस्टेमिक क्रिया द्वारा अंदरूनी कवक को नष्ट करता है।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "100 मिली / एकड़"
          },
          {
                "nameHi": "मेट्राफेनोन 50% SC",
                "technical": "Metrafenone 50% SC",
                "dose": "0.5 मिली / लीटर पानी (100 मिली प्रति एकड़)",
                "brands": [
                      "Vivando (BASF)"
                ],
                "safety": "भुरी रोग पर अद्वितीय मोड ऑफ एक्शन, दानों की चमक व एक्सपोर्ट क्वालिटी सुनिश्चित।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "100 मिली / एकड़",
                "isTopPerformer": true
          }
    ],
    "thrips-mealybug": [
          {
                "nameHi": "फिप्रोनिल 80% WG + बुप्रोफेजिन 25% SC",
                "technical": "Fipronil 80% WG (40 g) + Buprofezin 25% SC (400 ml)",
                "dose": "0.2 ग्राम + 2 मिली / लीटर पानी",
                "brands": [
                      "Jump + Applaud"
                ],
                "safety": "थ्रिप्स पर तीव्र मारक क्षमता व मिलीबग के शिशुओं की रोकथाम।",
                "level": 1,
                "levelLabelHi": "स्तर 1 · दोहरा वार",
                "dosePerAcre": "40 ग्राम + 400 मिली / एकड़"
          },
          {
                "nameHi": "स्पिनेटोरम 11.7% SC (डेलिगेट)",
                "technical": "Spinetoram 11.7% SC",
                "dose": "0.75 मिली / लीटर पानी (150 मिली प्रति एकड़)",
                "brands": [
                      "Delegate (Corteva)"
                ],
                "safety": "थ्रिप्स पर दुनिया का सर्वश्रेष्ठ नॉकडाउन मॉलिक्यूल, दानों पर दाग नहीं पड़ने देता।",
                "level": 2,
                "levelLabelHi": "स्तर 2 · मध्यम स्तर",
                "dosePerAcre": "150 मिली / एकड़"
          },
          {
                "nameHi": "स्पाइरोटेट्रामैट 150 OD (मोवेन्टो) या सायंट्रानिलिप्रोल 10.26% OD (बेनेविया)",
                "technical": "Spirotetramat 150 OD (250 ml) या Cyantraniliprole 10.26% OD (200 ml)",
                "dose": "1.25 मिली / लीटर पानी (250 मिली प्रति एकड़)",
                "brands": [
                      "Movento (Bayer)",
                      "Benevia (FMC)"
                ],
                "safety": "दोनों दिशाओं में चलने वाला (Two-way systemic) आधुनिक कीटनाशक, गुच्छों के अंदर छिपे मिलीबग का संपूर्ण खात्मा।",
                "level": 3,
                "levelLabelHi": "स्तर 3 · उच्चतम स्तर / बेस्ट ट्रायल 🔥",
                "dosePerAcre": "250 मिली / एकड़",
                "isTopPerformer": true
          }
    ]
  }
};

// Aliases for seamless crop resolution
const ALIASES: Record<string, string> = {
  tur: "arhar",
  pigeonpea: "arhar",
  gram: "chana",
  chickpea: "chana",
  rice: "paddy",
  dhan: "paddy",
  dhaan: "paddy",
  corn: "maize",
  makka: "maize",
  okra: "bhindi",
  eggplant: "brinjal",
  peanut: "groundnut",
  moongfali: "groundnut",
  pulses: "moong",
};

const PROBLEM_ALIASES: Record<string, Record<string, string>> = {
  maize: {
    rust: "common-rust",
    "common-rust": "common-rust",
    "shoot-fly": "shoot-fly",
    "stem-fly": "shoot-fly",
    "stem-borer": "stem-borer",
    "pink-borer": "stem-borer",
    "shoot-fly-stem-borer": "stem-borer",
    "fall-army-worm": "fall-armyworm",
    faw: "fall-armyworm",
    "stalk-rot": "post-flowering-stalk-rot",
    blight: "turcicum-blight",
  },
};

for (const [alias, target] of Object.entries(ALIASES)) {
  if (CROP_PROBLEM_MEDICINES[target] && !CROP_PROBLEM_MEDICINES[alias]) {
    CROP_PROBLEM_MEDICINES[alias] = CROP_PROBLEM_MEDICINES[target];
  }
}

function sanitizeCurative(med: CurativeMedicine): CurativeMedicine {
  const cleanHi = (med.nameHi || med.technical || "")
    .replace(/\s*\([^)]*\)/g, " ")
    .replace(/\s*या\s+[A-Za-z0-9\u0900-\u097F\-]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    ...med,
    nameHi: cleanHi || med.technical,
    brands: [], // Strictly zero commercial brand names or company names
  };
}

export function getCurativeMedicines(
  cropSlug: string,
  problemId: string,
  rawLines?: string[]
): CurativeMedicine[] {
  const norm = cropSlug.trim().toLowerCase();
  const mappedSlug = ALIASES[norm] || norm;
  const normProb = problemId.trim().toLowerCase();
  const targetProblemId = PROBLEM_ALIASES[mappedSlug]?.[normProb] || normProb;

  const mapped =
    CROP_PROBLEM_MEDICINES[mappedSlug]?.[targetProblemId] ||
    CROP_PROBLEM_MEDICINES[cropSlug]?.[targetProblemId] ||
    CROP_PROBLEM_MEDICINES[mappedSlug]?.[problemId] ||
    CROP_PROBLEM_MEDICINES[cropSlug]?.[problemId];

  if (mapped && mapped.length > 0) {
    return mapped.map(sanitizeCurative);
  }

  if (!rawLines || rawLines.length === 0) return [];
  return rawLines.slice(0, 3).map((line, i) => {
    const raw = line.split("—")[0]?.trim() || line;
    return sanitizeCurative({
      nameHi: raw,
      technical: i === 0 ? "Standard Technical Formulation" : "Complementary Technical",
      dose: "अनुशंसित डोज़: 1.5–2 ग्राम/मिली प्रति लीटर पानी (लेबल अनुसार)",
      brands: [],
      level: (i + 1) as 1 | 2 | 3,
      levelLabelHi: `स्तर ${i + 1}`,
    });
  });
}


