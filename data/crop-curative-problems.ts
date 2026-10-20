/**
 * Master 29-Crop Agricultural Database — Agronomic & Curative Problems.
 * Authentic field library photos from disk.
 * Explicit stage-tagging ('vegetative' | 'flowering' | 'fruiting').
 * Strict virus vector identification & agronomic safety flags.
 */

import {
  getAllCropIdentificationProblems,
  getCropIdentificationImage,
  type CropIdentificationProblemMeta,
} from "@/lib/pests/cropIdentificationImages";

export type GrowthStage = "vegetative" | "flowering" | "fruiting";

export type CropProblemItem = {
  id: string;
  nameHi: string;
  nameEn: string;
  tagHi: string;
  image: string;
  stageHi: string;
  stages?: GrowthStage[];
  specialFactHi?: string;
  isVirus?: boolean;
  whatHi: string;
  whyHi: string[];
  cureOrganicHi: string[];
  cureChemicalHi: string[];
  whenToActHi: string;
  tipHi: string;
};

export type CropProblemCrop = {
  slug: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  image: string;
  problems: CropProblemItem[];
};

export const RAW_CROP_PROBLEM_CROPS: CropProblemCrop[] = [
  {
    "slug": "tomato",
    "nameHi": "टमाटर",
    "nameEn": "Tomato",
    "emoji": "🍅",
    "image": "/images/crops/tomato.jpg",
    "problems": [
      {
        "id": "damping-off",
        "nameHi": "पौध गलन (Damping-off)",
        "nameEn": "Damping-off",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-damping-off-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (1-30 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "ज़मीन के पास से तना पतला होकर सड़ता है और पौध गिर जाती है। (जड़ों में ड्रेंचिंग करें)",
        "whatHi": "नर्सरी व रोपाई के शुरुआती दिनों में तने का सड़ना व पौध गिरना।",
        "whyHi": [
          "अत्यधिक नमी व जलभराव",
          "घनी नर्सरी बुवाई"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा वीरिडी 5 ग्राम/लीटर जड़ों में डालें",
          "हवादार नर्सरी रखें"
        ],
        "cureChemicalHi": [
          "कॉपर ऑक्सीक्लोराइड 50% WP (500 g)",
          "रिडोमिल गोल्ड (400 g)"
        ],
        "whenToActHi": "पौध अंकुरण और रोपाई के तुरंत बाद",
        "tipHi": "हमेशा शाम को जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "leaf-miner",
        "nameHi": "पत्ती सुरंगक (Leaf Miner - नागअली)",
        "nameEn": "Leaf Miner",
        "tagHi": "कीट",
        "image": "/images/pests/pest-liriomyza-trifolii-2.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों के अंदर सांप जैसी सफेद टेढ़ी-मेढ़ी लकीरें बन जाती हैं।",
        "whatHi": "कीट की सुंडी पत्ती के हरे हिस्से को अंदर से खाती है जिससे पत्ती सूख जाती है।",
        "whyHi": [
          "गर्म व शुष्क मौसम",
          "कम उम्र के कोमल पौधे"
        ],
        "cureOrganicHi": [
          "नीम का तेल 10,000 PPM (2-3 मिली/लीटर)",
          "पीले चिपचिपे कार्ड"
        ],
        "cureChemicalHi": [
          "एबामेक्टिन 1.9% EC",
          "बेनेविया 10.26% OD"
        ],
        "whenToActHi": "पहली टेढ़ी-मेढ़ी लकीर दिखते ही",
        "tipHi": "पत्ती के अंदर दवा पहुँचाने के लिए सिस्टेमिक या ट्रांसलैमिनार दवा चुनें।"
      },
      {
        "id": "whitefly",
        "nameHi": "सफेद मक्खी (Whitefly)",
        "nameEn": "Whitefly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-bemisia-tabaci-2.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तों के नीचे छोटे सफेद कीड़े जो हिलाने पर उड़ते हैं; यह पत्ता मरोड़ वायरस फैलाती है।",
        "whatHi": "रस चूसकर पौधों को कमजोर करती है और लीफ कर्ल वायरस की मुख्य संवाहक है।",
        "whyHi": [
          "गर्म व सूखा मौसम",
          "अत्यधिक नाइट्रोजन खाद"
        ],
        "cureOrganicHi": [
          "पीले स्टिकी ट्रैप (15-20 प्रति एकड़)",
          "नीम तेल 10000 PPM"
        ],
        "cureChemicalHi": [
          "डायफेंथियूरॉन 50% WP",
          "सेफिना 50 DC"
        ],
        "whenToActHi": "प्रति पत्ती 2-3 मक्खियाँ दिखते ही",
        "tipHi": "स्प्रे हमेशा पत्तियों के निचले भाग पर करें।"
      },
      {
        "id": "early-blight",
        "nameHi": "अगेती झुलसा (Early Blight)",
        "nameEn": "Early Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-alternaria-solani-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "नीचे की पत्तियों पर गोल छल्ले (निशाने के बोर्ड) जैसे भूरे-काले धब्बे।",
        "whatHi": "अल्टरनेरिया कवक से निचली पत्तियों पर संकेंद्री वलय बनना और पत्तियां पीली होकर सूखना।",
        "whyHi": [
          "गर्म दिन और नम रातें",
          "घनी फसल"
        ],
        "cureOrganicHi": [
          "खेत से निचली संक्रमित पत्तियां हटाएँ",
          "ट्राइकोडर्मा स्प्रे"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "मेरीवोन 100 ml"
        ],
        "whenToActHi": "पहला छल्लेदार धब्बा दिखते ही",
        "tipHi": "स्प्रे में सिलिकॉन स्टिकर अवश्य मिलाएँ।"
      },
      {
        "id": "thrips",
        "nameHi": "थ्रिप्स (Thrips)",
        "nameEn": "Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-thrips-palmi.jpg",
        "stageHi": "फूल अवस्था (30-50 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "पत्तियों को खुरचकर रस चूसते हैं, फूल सूखकर झड़ जाते हैं और बड नेक्रोसिस वायरस फैलता है।",
        "whatHi": "फूलों व कोमल पत्तियों में रस चूसना, पत्तियां नाव की तरह ऊपर मुड़ना।",
        "whyHi": [
          "गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "नीले चिपचिपे कार्ड (Blue sticky traps)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "स्पिनेटोरम 11.7% SC",
          "एक्सपोनस 34 ml"
        ],
        "whenToActHi": "फूलों में सूक्ष्म कीड़े रेंगते दिखते ही",
        "tipHi": "स्प्रे सुबह या शाम के समय फूलों के अंदर तक पहुँचाएँ।"
      },
      {
        "id": "red-spider-mite",
        "nameHi": "लाल मकड़ी (Red Spider Mite)",
        "nameEn": "Red Spider Mite",
        "tagHi": "कीट",
        "image": "/images/pests/pest-tetranychus-urticae.jpg",
        "stageHi": "फूल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के नीचे बारीक जाले और लाल सूक्ष्म दानें; पत्ती पीली व भूसी जैसी हो जाती है।",
        "whatHi": "मकड़ी पत्तियों की निचली सतह से हरित लवक चूस लेती है।",
        "whyHi": [
          "गर्म व शुष्क मौसम",
          "धूल-मिट्टी"
        ],
        "cureOrganicHi": [
          "तेज धार पानी का छिड़काव",
          "सल्फर 80% WDG"
        ],
        "cureChemicalHi": [
          "ओबेरॉन 200 ml",
          "बोर्नियो 160 ml"
        ],
        "whenToActHi": "पत्तियों पर जाले या भूरापन दिखते ही",
        "tipHi": "सादे कीटनाशक से मकड़ी बढ़ती है; केवल माइटनाशक (Acaricide) ही डालें।"
      },
      {
        "id": "leaf-curl",
        "nameHi": "पत्ता मरोड़ वायरस (Leaf Curl - ToLCV)",
        "nameEn": "Tomato Leaf Curl Virus",
        "tagHi": "वायरस",
        "image": "/images/diseases/disease-tomato-leaf-curl-photoreal.jpg",
        "stageHi": "फूल अवस्था",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "ऊपर की पत्तियां सिकुड़कर कप जैसी छोटी व पीली हो जाती हैं, पौधा बौना रह जाता है। (फफूंदनाशक काम नहीं करता; सफेद मक्खी रोकें + पौधे की इम्यूनिटी बढ़ाएँ)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला वायरस जिससे पौधा रुक जाता है और फल नहीं बनते।",
        "whyHi": [
          "सफेद मक्खी का अनियंत्रित प्रकोप",
          "संक्रमित पौध"
        ],
        "cureOrganicHi": [
          "संक्रमित पौधों को उखाड़कर जमीन में दबाएँ",
          "नीम तेल + पीला ट्रैप"
        ],
        "cureChemicalHi": [
          "उलाला 80g + माइक्रो न्यूट्रिएंट 200g",
          "पेगासस 200ml + सीवीड 250ml"
        ],
        "whenToActHi": "पहली मुड़ी पत्ती या सफेद मक्खी दिखते ही",
        "tipHi": "याद रखें: कोई भी फफूंदनाशक वायरस को ठीक नहीं कर सकता। केवल सफेद मक्खी मारें और टॉनिक दें।"
      },
      {
        "id": "bacterial-spot-wilt",
        "nameHi": "जीवाणु धब्बा व उकठा (Bacterial Spot & Wilt)",
        "nameEn": "Bacterial Spot & Wilt",
        "tagHi": "जीवाणु",
        "image": "/images/diseases/disease-ralstonia-solanacearum-2.jpg",
        "stageHi": "फूल व फल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों व फलों पर खुरदरे काले धब्बे; उकठा में हरा पौधा अचानक मुरझा जाता है।",
        "whatHi": "जीवाणु जनित रोग जो संवहनी नलियों को बंद कर देता है और फल पर काले पपड़ीदार धब्बे बनाता है।",
        "whyHi": [
          "वर्षा के छींटे",
          "जलभराव व उच्च आर्द्रता"
        ],
        "cureOrganicHi": [
          "स्यूडोमोनास फ्लोरेसेंस ड्रेंचिंग",
          "रोगग्रस्त पौधे हटाएँ"
        ],
        "cureChemicalHi": [
          "कोसाइड 53.8% DF + कासुगामाइसिन",
          "कोनिका 300 g"
        ],
        "whenToActHi": "पत्तियों पर काले तैलीय बिंदु दिखते ही",
        "tipHi": "जीवाणु रोग में कॉपर + एंटीबायोटिक का मिश्रण सबसे असरदार है।"
      },
      {
        "id": "fruit-borer",
        "nameHi": "फल छेदक (Fruit Borer - Helicoverpa)",
        "nameEn": "Fruit Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फल अवस्था (50+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "इल्ली टमाटर में गोल छेद करके आधा शरीर अंदर डालकर खाती है।",
        "whatHi": "हेलिकोवर्पा इल्ली फलों को खाकर सड़ा देती है और भारी उपज नुकसान करती है।",
        "whyHi": [
          "फूल व फल का समय",
          "रात में पतंगों का उड़ना"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Helilure 5/एकड़)",
          "NPV वायरस स्प्रे"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "फेम 40 ml"
        ],
        "whenToActHi": "फलों पर पहले छेद या इल्ली का अंडा दिखते ही",
        "tipHi": "दवा बदलते रहें ताकि इल्लियों में सहनशीलता न आए।"
      },
      {
        "id": "pinworm",
        "nameHi": "पिनवर्म (Pinworm - Tuta absoluta)",
        "nameEn": "Tomato Pinworm",
        "tagHi": "कीट",
        "image": "/images/pests/pest-tomato-tuta-absoluta-photoreal.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों में सफेद झिल्लीदार धब्बे और टमाटर के डंठल के पास सुई जैसे बारीक छेद।",
        "whatHi": "टूटा एब्सोलूटा कीट जो पत्तियों की दोनों परतों के बीच और डंठल में घुसकर टमाटर सड़ा देता है।",
        "whyHi": [
          "गर्म व आर्द्र मौसम",
          "लगातार सोलेनेसी फसल"
        ],
        "cureOrganicHi": [
          "टूटा फेरोमोन ट्रैप (10-12/एकड़)",
          "प्रकाश प्रपंच"
        ],
        "cureChemicalHi": [
          "बेनेविया 240 ml",
          "बायेगो 100 ml"
        ],
        "whenToActHi": "पत्ती पर पारदर्शी खिड़की या डंठल के पास छेद दिखते ही",
        "tipHi": "साधारण कीटनाशक अंदर नहीं पहुँचते; ओवी-लार्वासाइडल दवा चुनें।"
      },
      {
        "id": "late-blight",
        "nameHi": "पछेती झुलसा (Late Blight)",
        "nameEn": "Late Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-phytophthora-infestans-2.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "पत्तियों और तने पर पानी से भीगे हुए काले धब्बे; ठंड व कोहरे में 3 दिन में खेत झुलस जाता है।",
        "whatHi": "फाइटोफ्थोरा कवक से पत्तियां व तने काले पड़कर गलना और दुर्गंध आना।",
        "whyHi": [
          "बादल छाए रहना, कोहरा व 85%+ नमी"
        ],
        "cureOrganicHi": [
          "संक्रमित टहनियां काटकर जलाएँ",
          "हवा का आवागमन रखें"
        ],
        "cureChemicalHi": [
          "ज़ैमप्रो 300 ml",
          "इक्वेशन प्रो 200 ml"
        ],
        "whenToActHi": "कोहरे का मौसम शुरू होते ही या पहला गीला धब्बा दिखते ही",
        "tipHi": "देरी न करें; पछेती झुलसा 48 घंटे में पूरा खेत नष्ट कर सकता है।"
      }
    ]
  },
  {
    "slug": "paddy",
    "nameHi": "धान",
    "nameEn": "Paddy / Rice",
    "emoji": "🌾",
    "image": "/images/crops/paddy.jpg",
    "problems": [
      {
        "id": "foot-rot",
        "nameHi": "बकाने / झंडा रोग (Foot Rot / Bakanae)",
        "nameEn": "Foot Rot / Bakanae",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-fujikuroi.jpg",
        "stageHi": "वानस्पतिक अवस्था (1-35 DAT)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "कुछ पौधे सामान्य से दोगुने लंबे, पतले और पीले होकर सूख जाते हैं, निचली गांठों से जड़ें निकलती हैं।",
        "whatHi": "फ्यूजेरियम फुजिकुरोई कवक से पौधों की अत्यधिक असामान्य लंबाई और सूखना।",
        "whyHi": [
          "संक्रमित बीज",
          "नर्सरी में अधिक तापमान"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा से बीज/जड़ शोधन"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम 50% WP (250 g)",
          "फॉलिकुर 250 ml"
        ],
        "whenToActHi": "रोपाई के 15-20 दिन बाद झंडा पौधा दिखते ही",
        "tipHi": "बीमार पौधे को खेत से जड़ सहित उखाड़कर नष्ट करें।"
      },
      {
        "id": "stem-borer",
        "nameHi": "तना छेदक (Stem Borer)",
        "nameEn": "Yellow Stem Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirpophaga-incertulas-2.jpg",
        "stageHi": "वानस्पतिक व गाभा अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "कल्लों के समय बीच की गोभ सूखती है (Dead Heart) और बाली के समय सफेद खाली बाली (White Ear) निकलती है।",
        "whatHi": "पीला तना छेदक सुंडी तने के अंदर घुसकर संवहन तंत्र काट देती है।",
        "whyHi": [
          "अत्यधिक यूरिया",
          "रात का तापमान 25-30°C"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Scirpo-lure 5/एकड़)",
          "ट्राइकोग्रामा कार्ड"
        ],
        "cureChemicalHi": [
          "फर्टेरा 4 kg दानेदार",
          "कोराजन 60 ml"
        ],
        "whenToActHi": "खेत में पतंगे उड़ते दिखते ही या 5% सूखी गोभ पर",
        "tipHi": "बाली निकलने के बाद दवा तने के अंदर नहीं पहुँचती; गाभा अवस्था में ही स्प्रे करें।"
      },
      {
        "id": "leaf-folder",
        "nameHi": "पत्ती लपेटक (Leaf Folder)",
        "nameEn": "Rice Leaf Folder",
        "tagHi": "कीट",
        "image": "/images/pests/pest-cnaphalocrocis-medinalis-2.jpg",
        "stageHi": "वानस्पतिक व गाभा अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "इल्ली पत्ती के दोनों किनारों को लार से चिपकाकर नली बनाती है और अंदर से हरापन खुरचकर खा जाती है।",
        "whatHi": "पत्तियां सफेद झिल्लीदार पट्टियों जैसी दिखने लगती हैं।",
        "whyHi": [
          "बादल युक्त मौसम",
          "घना रोपण"
        ],
        "cureOrganicHi": [
          "खेत में रस्सी फेरना",
          "नीम तेल 10000 PPM"
        ],
        "cureChemicalHi": [
          "ताकुमी 100 g",
          "कोराजन 60 ml"
        ],
        "whenToActHi": "10% मुड़ी पत्तियां दिखते ही",
        "tipHi": "हमेशा बारीक फुहार वाला नोजल प्रयोग करें।"
      },
      {
        "id": "sheath-blight",
        "nameHi": "शीथ ब्लाइट (Sheath Blight)",
        "nameEn": "Sheath Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-rhizoctonia-solani-2.jpg",
        "stageHi": "गाभा व बाली अवस्था (35-65 DAT)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पानी की सतह के ऊपर तने पर सांप की केंचुली जैसे हरे-भूरे धब्बे बनते हैं।",
        "whatHi": "राइजोक्टोनिया कवक तने के खोल को सड़ा देता है, पौधा कमजोर होकर गिर जाता है।",
        "whyHi": [
          "उच्च आर्द्रता (85%+)",
          "अधिक नाइट्रोजन खाद व घना फैलाव"
        ],
        "cureOrganicHi": [
          "खेत का पानी 2 दिन निकालें",
          "ट्राइकोडर्मा"
        ],
        "cureChemicalHi": [
          "पल्सर 150 ml",
          "कस्टोडिया / नेटिवो 120 g"
        ],
        "whenToActHi": "तने पर पहला केंचुली जैसा धब्बा दिखते ही",
        "tipHi": "स्प्रे की नोजल पौधों के निचले तने की ओर रखें।"
      },
      {
        "id": "bph",
        "nameHi": "भूरा व सफेद फुदका / तेला (BPH & WBPH)",
        "nameEn": "Brown Plant Hopper (BPH)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-nilaparvata-lugens-2.jpg",
        "stageHi": "गाभा व बाली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पौधों की जड़ों के पास पानी की सतह पर बैठकर रस चूसते हैं, खेत में गोल चकत्तों में फसल जल जाती है (Hopper Burn)।",
        "whatHi": "लाखों की संख्या में तने से रस चूसकर धान को सुखा देना।",
        "whyHi": [
          "लगातार खेत में गहरा पानी खड़े रहना",
          "घनी रोपाई"
        ],
        "cureOrganicHi": [
          "खेत की मेड़ें खोलकर हवा लगने दें",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "चेस 120 g",
          "पेक्सलोन 94 ml"
        ],
        "whenToActHi": "प्रति हिल (मुट्ठी) 5-10 फुदके दिखते ही",
        "tipHi": "स्प्रे सीधे तने के आधार (जड़ों के पास) पर करें, ऊपर पत्तों पर नहीं।"
      },
      {
        "id": "blb",
        "nameHi": "जीवाणु पत्ती झुलसा (Bacterial Leaf Blight - BLB)",
        "nameEn": "Bacterial Leaf Blight (BLB)",
        "tagHi": "जीवाणु",
        "image": "/images/diseases/disease-xanthomonas-oryzae-2.jpg",
        "stageHi": "गाभा व बाली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्ती की नोक और दोनों किनारों से लहरदार पीली-सफेद धारियां नीचे की ओर बढ़ती हैं। (यूरिया तुरंत रोकें)",
        "whatHi": "जैंथोमोनास जीवाणु से पत्तियों का किनारों से सूखना।",
        "whyHi": [
          "तेज हवा के साथ बारिश (तूफान)",
          "अत्यधिक यूरिया"
        ],
        "cureOrganicHi": [
          "यूरिया तुरंत बंद करें",
          "पोटाश 15 kg/एकड़ डालें"
        ],
        "cureChemicalHi": [
          "कोसाइड 350 g + स्ट्रेप्टोसाइक्लिन 18 g",
          "बिस्मर्थियाजोल 300 g"
        ],
        "whenToActHi": "पत्ती पर पहली लहरदार पीली धारी दिखते ही",
        "tipHi": "खेत का पानी निकालकर नया पानी भरें।"
      },
      {
        "id": "blast",
        "nameHi": "पत्ती व गर्दन तोड़ ब्लास्ट (Leaf & Neck Blast)",
        "nameEn": "Rice Blast",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-magnaporthe-oryzae-2.jpg",
        "stageHi": "गाभा व बाली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर आंख के आकार के धब्बे; बाली निकलने पर बाली की गर्दन काली पड़कर टूट जाती है।",
        "whatHi": "मैग्नापोर्थे कवक से पत्तियों पर नाव जैसे धब्बे और गर्दन टूटकर बाली सूखना।",
        "whyHi": [
          "रात का तापमान 20-24°C",
          "ओस और 90%+ नमी"
        ],
        "cureOrganicHi": [
          "संतुलित उर्वरक",
          "प्रतिरोधी किस्म"
        ],
        "cureChemicalHi": [
          "ट्राइसाइक्लाजोल 75% WP",
          "पिकोक्सीस्ट्रोबिन + ट्राइसाइक्लाजोल"
        ],
        "whenToActHi": "पत्ती पर आंख जैसा धब्बा दिखते ही या 5% बाली निकलने पर",
        "tipHi": "गर्दन तोड़ ब्लास्ट से बचाव हेतु बाली निकलते समय सुरक्षात्मक स्प्रे अनिवार्य है।"
      },
      {
        "id": "false-smut",
        "nameHi": "हल्दी रोग / कंडुआ (False Smut)",
        "nameEn": "False Smut",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-ustilaginoidea-virens.jpg",
        "stageHi": "दूधिया व दाना अवस्था (65+ DAT)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "बाली के दानों पर पीले-नारंगी या काले मखमली गोले बन जाते हैं। (बाली 10% निकलते समय स्प्रे करें)",
        "whatHi": "कवक दानों को पाउडर से भरे हल्दी जैसे थक्कों में बदल देता है।",
        "whyHi": [
          "बाली निकलते समय बारिश और उच्च नमी"
        ],
        "cureOrganicHi": [
          "खेत से हल्दी के गोले सावधानी से पॉलीथिन में तोड़ें"
        ],
        "cureChemicalHi": [
          "टिल्ट 200 ml",
          "गैलीलियो वे 400 ml"
        ],
        "whenToActHi": "गाभा अवस्था में जब बाली 5-10% बाहर आ रही हो",
        "tipHi": "हल्दी रोग दिखने के बाद दवा असर नहीं करती; केवल गाभा अवस्था में ही बचाव संभव है।"
      },
      {
        "id": "gundhi-bug",
        "nameHi": "गंधी बग (Gundhi Bug)",
        "nameEn": "Rice Gundhi Bug",
        "tagHi": "कीट",
        "image": "/images/pests/pest-leptocorisa-oratorius.jpg",
        "stageHi": "दूधिया अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "लंबे टांगों वाला बदबूदार कीड़ा जो कच्चे दानों का दूध चूस लेता है, जिससे दाने खाली और काले रह जाते हैं।",
        "whatHi": "दूधिया दानों से रस चूसकर धान की बाली को थोथा और बदरंग बना देना।",
        "whyHi": [
          "मेड़ों पर घास-फूस होना",
          "सुबह-शाम सक्रिय"
        ],
        "cureOrganicHi": [
          "मेड़ों को साफ रखें",
          "प्रकाश प्रपंच"
        ],
        "cureChemicalHi": [
          "अलिका 80 ml",
          "क्लोरपायरीफॉस 400 ml"
        ],
        "whenToActHi": "बाली में 1-2 गंधी बग दिखते ही",
        "tipHi": "छिड़काव सुबह जल्दी या शाम के समय करें जब कीड़े बाली पर बैठे हों।"
      }
    ]
  },
  {
    "slug": "soybean",
    "nameHi": "सोयाबीन",
    "nameEn": "Soybean",
    "emoji": "🫘",
    "image": "/images/crops/soybean.jpg",
    "problems": [
      {
        "id": "stem-fly",
        "nameHi": "तना मक्खी (Stem Fly)",
        "nameEn": "Soybean Stem Fly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-melanagromyza-obtusa.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-30 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "मैगट तने के अंदर सुरंग बनाता है, चीरने पर अंदर लाल रंग का खोखला रास्ता दिखता है; शुरुआती पत्तियां सूखती हैं।",
        "whatHi": "तना मक्खी की सुंडी तने को अंदर से खोखला कर देती है।",
        "whyHi": [
          "बुवाई के शुरुआती 2-4 हफ्ते",
          "गर्म तापमान"
        ],
        "cureOrganicHi": [
          "नीम खली का उपयोग",
          "शुरुआती निगरानी"
        ],
        "cureChemicalHi": [
          "अलिका 80 ml",
          "सोलोमन 140 ml"
        ],
        "whenToActHi": "बुवाई के 10-15 दिन बाद पहली पत्ती मुरझाते ही",
        "tipHi": "बीज उपचार (थियामेथोक्साम 30 FS) अवश्य करें।"
      },
      {
        "id": "charcoal-rot",
        "nameHi": "जड़ व तना सड़न (Charcoal / Rhizoctonia Rot)",
        "nameEn": "Charcoal & Stem Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-rhizoctonia-bataticola-2.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "ज़मीन की सतह के पास तना काला-भूरा होकर सड़ जाता है और छिलका उतरने लगता है।",
        "whatHi": "राइजोक्टोनिया व मैक्रोफोमिना कवक से तने व जड़ों का सड़ना।",
        "whyHi": [
          "सूखे के बाद अचानक भारी बारिश",
          "उच्च तापमान"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 1 kg प्रति एकड़ गोबर खाद में मिलाकर दें"
        ],
        "cureChemicalHi": [
          "टेबुकोनाज़ोल 250 ml",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "तने का निचला हिस्सा भूरा होते ही",
        "tipHi": "पौधों के आधार की तरफ स्प्रे करें।"
      },
      {
        "id": "girdle-beetle",
        "nameHi": "चक्र भृंग (Girdle Beetle)",
        "nameEn": "Girdle Beetle",
        "tagHi": "कीट",
        "image": "/images/pests/pest-oberea-brevis-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (25-45 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "यह कीट तने या डंठल पर दो समानांतर गोल छल्ले (Rings) काट देता है, जिससे ऊपर के 3 पत्ते मुरझाकर लटक जाते हैं।",
        "whatHi": "भृंग तने पर दो रिंग काटकर बीच में अंडा देता है; ऊपर का भाग सूख जाता है।",
        "whyHi": [
          "बुवाई के 30-40 दिन बाद",
          "जुलाई-अगस्त के बादल"
        ],
        "cureOrganicHi": [
          "छल्ले कटे हिस्से को तुरंत हाथ से तोड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "एम्पलिगो 100 ml",
          "एलांटो 250 ml"
        ],
        "whenToActHi": "खेत में पहला रिंग कटते या लटके पत्ते दिखते ही",
        "tipHi": "अंडा फूटने से पहले 3 दिन के अंदर स्प्रे कर दें।"
      },
      {
        "id": "ymv",
        "nameHi": "पीला मोज़ेक वायरस (YMV)",
        "nameEn": "Yellow Mosaic Virus",
        "tagHi": "वायरस",
        "image": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर पीले-हरे चकत्ते पड़ते हैं। (यह वायरस है, फफूंदनाशक न डालें; केवल सफेद मक्खी रोकें!)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला वायरस जिससे प्रकाश संश्लेषण रुक जाता है और फलियां नहीं बनतीं।",
        "whyHi": [
          "सफेद मक्खी का अनियंत्रित फैलाव"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे कार्ड",
          "संक्रमित पौधे उखाड़ें"
        ],
        "cureChemicalHi": [
          "सोलोमन 140 ml",
          "वनस्टेप 400 ml"
        ],
        "whenToActHi": "पहली पीली चित्तीदार पत्ती दिखते ही",
        "tipHi": "वायरस के लिए कोई फफूंदनाशक काम नहीं करता; सफेद मक्खी का तुरंत सफाया करें।"
      },
      {
        "id": "spodoptera-semilooper",
        "nameHi": "तंबाकू इल्ली व हरी सेमिलूपर (Spodoptera & Semilooper)",
        "nameEn": "Tobacco Caterpillar & Semilooper",
        "tagHi": "कीट",
        "image": "/images/pests/pest-spodoptera-litura-2.jpg",
        "stageHi": "फूल व फली अवस्था (40-70 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों को खाकर छलनी (जालीदार) कर देती हैं और बाद में फलियों को काटती हैं।",
        "whatHi": "इल्लियों का झुंड में पत्तियों की हरियाली चाट जाना और फलियों में छेद करना।",
        "whyHi": [
          "फूल आते समय नम व गर्म मौसम"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (स्पोडोल्यूर)",
          "हाथ से पत्ती तोड़कर अंडों को नष्ट करें"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "एक्सपोनस 25 ml"
        ],
        "whenToActHi": "पत्तियों पर जालीदार छलनी दिखते ही",
        "tipHi": "छिड़काव शाम के समय करें जब इल्लियां बाहर निकलकर चरती हैं।"
      },
      {
        "id": "pod-blight",
        "nameHi": "एन्थ्रेक्नोज / फली झुलसा (Pod Blight & Purple Seed Stain)",
        "nameEn": "Anthracnose / Pod Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-cercospora-sojina-2.jpg",
        "stageHi": "फली अवस्था (50-75 दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "फलियों और तने पर काले-भूरे धब्बे बनते हैं और दाने बैंगनी व सिकुड़े हुए निकलते हैं।",
        "whatHi": "कोलेटोट्राइकम कवक से फलियों पर धब्बे पड़ना और दानों की गुणवत्ता नष्ट होना।",
        "whyHi": [
          "लगातार बारिश और 85%+ नमी"
        ],
        "cureOrganicHi": [
          "खेत में जल निकास दुरुस्त रखें"
        ],
        "cureChemicalHi": [
          "प्रियाक्सर 120 ml",
          "हेडलाइन 150 g"
        ],
        "whenToActHi": "फली बनते समय काले धब्बे दिखते ही",
        "tipHi": "फली अवस्था में फफूंदनाशक का छिड़काव दानों को चमकदार और वजनदार बनाता है।"
      }
    ]
  },
  {
    "slug": "maize",
    "nameHi": "मक्का",
    "nameEn": "Maize / Corn",
    "emoji": "🌽",
    "image": "/images/crops/maize.jpg",
    "problems": [
      {
        "id": "shoot-fly-stem-borer",
        "nameHi": "तना मक्खी व तना छेदक (Shoot Fly & Pink Borer)",
        "nameEn": "Shoot Fly & Pink Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-atherigona-approximata-2.jpg",
        "stageHi": "अंकुरण व वानस्पतिक (5-25 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "छोटे पौधों की बीच की गोभ सूख जाती है (Dead Heart) और पत्तों पर सीधी लाइन में गोल छेद दिखते हैं।",
        "whatHi": "सुंडी पौधे के दिल (गोभ) को काट देती है जिससे पौधा झाड़ीनुमा हो जाता है।",
        "whyHi": [
          "देर से बुवाई",
          "गर्म तापमान"
        ],
        "cureOrganicHi": [
          "समय पर अगेती बुवाई",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "फर्टेरा 4 kg पोंगली में",
          "अलिका 80 ml"
        ],
        "whenToActHi": "अंकुरण के 7-10 दिन बाद पहली सूखी गोभ पर",
        "tipHi": "दवा का स्प्रे या दाने सीधे मक्के की पोंगली (Whorl) के अंदर डालें।"
      },
      {
        "id": "fall-armyworm",
        "nameHi": "फॉल आर्मीवर्म (Fall Armyworm - FAW)",
        "nameEn": "Fall Armyworm (FAW)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-spodoptera-frugiperda-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (15-45 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पोंगली के अंदर लकड़ी के बुरादे जैसी बीट और सिर पर उल्टे 'Y' निशान वाली आक्रामक इल्ली।",
        "whatHi": "आक्रामक विदेशी कीट जो मक्के के पत्तों और भुट्टे को पूरी तरह चट कर जाता है।",
        "whyHi": [
          "मक्के की सघन खेती",
          "अनुकूल गर्म मौसम"
        ],
        "cureOrganicHi": [
          "पोंगली में रेत या सूखी राख डालना",
          "फेरोमोन ट्रैप"
        ],
        "cureChemicalHi": [
          "एम्पलिगो 100 ml",
          "डेलिगेट 100 ml"
        ],
        "whenToActHi": "पत्तियों पर खुरचने के निशान या बुरादा दिखते ही",
        "tipHi": "स्प्रे नोजल को सीधे पोंगली के ऊपर रखकर धार से छिड़कें।"
      },
      {
        "id": "turcicum-blight",
        "nameHi": "पत्ती झुलसा (Turcicum & Maydis Leaf Blight)",
        "nameEn": "Turcicum & Maydis Leaf Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-exserohilum-turcicum-2.jpg",
        "stageHi": "वानस्पतिक व झंडा अवस्था (30-55 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों पर लंबे सिगार (नाव) के आकार के भूरे-राख जैसे धब्बे बनते हैं।",
        "whatHi": "कवक पत्तियों को सुखा देता है जिससे प्रकाश संश्लेषण रुक जाता है।",
        "whyHi": [
          "नम व ठंडा मौसम",
          "घना रोपण"
        ],
        "cureOrganicHi": [
          "खेत साफ रखें",
          "प्रतिरोधी संकर बीज"
        ],
        "cureChemicalHi": [
          "टिल्ट 200 ml",
          "एमिस्टार टॉप 200 ml"
        ],
        "whenToActHi": "पत्ती पर नाव जैसा पहला धब्बा दिखते ही",
        "tipHi": "निचली पत्तियों से धब्बे ऊपर बढ़ने से पहले स्प्रे करें।"
      },
      {
        "id": "post-flowering-stalk-rot",
        "nameHi": "तना सड़न (Post-Flowering Stalk Rot)",
        "nameEn": "Post-Flowering Stalk Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-moniliforme.jpg",
        "stageHi": "भुट्टा बनने की अवस्था (50+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "दाना भरते समय तना नीचे की गांठ से अंदर से सड़कर खोखला हो जाता है और पौधा गिर जाता है।",
        "whatHi": "फ्यूजेरियम व मैक्रोफोमिना कवक से तने के भीतरी गूदे का सड़ना।",
        "whyHi": [
          "दाना भरते समय पानी की कमी (सूखा तनाव)",
          "अत्यधिक नाइट्रोजन"
        ],
        "cureOrganicHi": [
          "दाना भरते समय खेत में नमी बनाए रखें"
        ],
        "cureChemicalHi": [
          "टेबुकोनाज़ोल 250 ml",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "फूल व भुट्टा आने के समय",
        "tipHi": "जड़ों के पास तने के निचले हिस्से पर स्प्रे करें।"
      }
    ]
  },
  {
    "slug": "groundnut",
    "nameHi": "मूंगफली",
    "nameEn": "Groundnut / Peanut",
    "emoji": "🥜",
    "image": "/images/crops/groundnut.jpg",
    "problems": [
      {
        "id": "collar-rot",
        "nameHi": "कॉलर रॉट / जड़ गलन (Collar Rot & Stem Rot)",
        "nameEn": "Collar Rot & Stem Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-sclerotium-rolfsii-2.jpg",
        "stageHi": "अंकुरण व वानस्पतिक (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "ज़मीन के पास तने पर काली फफूंद (असपरजिलस) या सफेद सरसों के दाने जैसी फफूंद (स्क्लेरोशियम) लगती है।",
        "whatHi": "तने का आधार सड़कर पौधा सूख जाता है।",
        "whyHi": [
          "गर्म व आर्द्र मिट्टी",
          "अधिक गहराई पर बुवाई"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 2 kg प्रति एकड़ गोबर खाद में मिलाकर दें"
        ],
        "cureChemicalHi": [
          "पल्सर 150 ml",
          "टेबुकोनाज़ोल 250 ml"
        ],
        "whenToActHi": "बुवाई के 15-20 दिन बाद पौधे सूखते दिखते ही",
        "tipHi": "स्प्रे की धार सीधे पौधों के तने के आधार पर रखें।"
      },
      {
        "id": "white-grub",
        "nameHi": "सफेद लट / गोजा लट (White Grub)",
        "nameEn": "White Grub",
        "tagHi": "कीट",
        "image": "/images/pests/pest-holotrichia-consanguinea.jpg",
        "stageHi": "वानस्पतिक व पेगिंग (20-60 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "मिट्टी में अंग्रेजी के 'C' आकार का सफेद मोटा कीड़ा जो जड़ें काट देता है; पौधे कतार में सूखते हैं।",
        "whatHi": "सफेद लट मिट्टी के अंदर मूंगफली की मुख्य जड़ काट देती है।",
        "whyHi": [
          "रेतीली मिट्टी",
          "मानसून की पहली बारिश के बाद भृंगों का अंडा देना"
        ],
        "cureOrganicHi": [
          "प्रकाश प्रपंच द्वारा भृंग पकड़ें",
          "बिवेरिया बेसियाना"
        ],
        "cureChemicalHi": [
          "दंतोत्सु 120 g",
          "लेसेन्टा 150 g"
        ],
        "whenToActHi": "जुलाई-अगस्त में पौधे कतार में सूखते दिखते ही",
        "tipHi": "दवा सिंचाई के पानी के साथ या रेत में मिलाकर जड़ों में डालें।"
      },
      {
        "id": "thrips-jassid",
        "nameHi": "रस चूसक थ्रिप्स व तेला (Thrips & Jassids)",
        "nameEn": "Thrips & Jassids",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों के किनारे पीले पड़ते हैं (V-आकार का पीलापन - Hopperburn) और बड नेक्रोसिस वायरस फैलता है।",
        "whatHi": "रस चूसकर पत्तियों को सिकोड़ना और वायरस फैलाना।",
        "whyHi": [
          "गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "पीले व नीले स्टिकी कार्ड",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "डेलिगेट 150 ml",
          "रीजेंट 300 ml"
        ],
        "whenToActHi": "पत्तियों पर पीलापन या थ्रिप्स दिखते ही",
        "tipHi": "पत्ती के दोनों तरफ स्प्रे लगना चाहिए।"
      },
      {
        "id": "tikka-rust",
        "nameHi": "टिक्का रोग और रतुआ (Tikka Leaf Spot & Rust)",
        "nameEn": "Tikka Leaf Spot & Rust",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-cercospora-arachidicola-2.jpg",
        "stageHi": "पेगिंग व फली अवस्था (40-80 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर गहरे काले गोल धब्बे जिनके चारों ओर पीला घेरा होता है, और नीचे जंग जैसे नारंगी दाने।",
        "whatHi": "सर्कॉस्पोरा कवक से टिक्का धब्बे पड़ना और पत्तियां समय से पहले झड़ जाना।",
        "whyHi": [
          "लगातार बादल और 80%+ नमी"
        ],
        "cureOrganicHi": [
          "खेत साफ रखें",
          "ट्राइकोडर्मा"
        ],
        "cureChemicalHi": [
          "नेटिवो 120 g",
          "ओपेरा 300 ml"
        ],
        "whenToActHi": "पत्तियों पर पहला काला धब्बा दिखते ही",
        "tipHi": "पत्तियां झड़ने से मूंगफली में दाने छोटे रह जाते हैं; समय पर स्प्रे आवश्यक है।"
      },
      {
        "id": "hairy-caterpillar",
        "nameHi": "बिहार रोमिल इल्ली व तंबाकू इल्ली (Hairy Caterpillar & Spodoptera)",
        "nameEn": "Hairy Caterpillar & Spodoptera",
        "tagHi": "कीट",
        "image": "/images/pests/pest-spodoptera-litura-2.jpg",
        "stageHi": "फली अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "झुंड में आकर पत्तों की हरियाली चाट जाती हैं, सिर्फ नसें बचती हैं।",
        "whatHi": "रोमिल इल्लियां पूरे खेत को कुछ ही दिनों में कंकाल बना देती हैं।",
        "whyHi": [
          "अगस्त-सितंबर में भारी प्रजनन"
        ],
        "cureOrganicHi": [
          "अंडों के गुच्छे वाली पत्तियों को तोड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "प्लेथोरा 250 ml"
        ],
        "whenToActHi": "इल्लियों का पहला झुंड दिखते ही",
        "tipHi": "शुरुआत में इल्लियां एक ही पौधे पर झुंड में होती हैं, तभी नष्ट कर दें।"
      }
    ]
  },
  {
    "slug": "chilli",
    "nameHi": "मिर्च",
    "nameEn": "Chilli",
    "emoji": "🌶️",
    "image": "/images/crops/chilli.jpg",
    "problems": [
      {
        "id": "collar-rot-wilt",
        "nameHi": "तना गलन व उकठा (Collar Rot & Fusarium Wilt)",
        "nameEn": "Collar Rot & Fusarium Wilt",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "तना जमीन के पास से भूरा होकर गलता है या पूरा पौधा अचानक मुरझा जाता है। (जड़ों में ड्रेंचिंग)",
        "whatHi": "फ्यूजेरियम व पिथियम कवक से तने व जड़ों का सड़ना और पौधों का सूखना।",
        "whyHi": [
          "जलभराव व भारी मिट्टी",
          "उच्च आर्द्रता"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा वीरिडी ड्रेंचिंग",
          "जल निकासी व्यवस्था"
        ],
        "cureChemicalHi": [
          "कॉपर ऑक्सीक्लोराइड 500 g",
          "रिडोमिल गोल्ड 400 g"
        ],
        "whenToActHi": "रोपाई के बाद पहला मुरझाया पौधा दिखते ही",
        "tipHi": "हमेशा शाम को जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "thrips",
        "nameHi": "सामान्य व काला थ्रिप्स (Scirtothrips & Black Thrips)",
        "nameEn": "Chilli Thrips & Black Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियां नाव की तरह ऊपर की ओर (Upward Curling) मुड़ती हैं; फूलों के अंदर काले कीड़े घुसकर फूल गिरा देते हैं।",
        "whatHi": "थ्रिप्स पत्तियों और फूलों को खुरचकर रस चूसते हैं जिससे मिर्च का पौधा रुक जाता है।",
        "whyHi": [
          "गर्म व सूखा मौसम",
          "नमी की कमी"
        ],
        "cureOrganicHi": [
          "नीले चिपचिपे ट्रैप (20 प्रति एकड़)",
          "नीम तेल 10000 PPM"
        ],
        "cureChemicalHi": [
          "डेलिगेट 180 ml",
          "एक्सपोनस 34 ml"
        ],
        "whenToActHi": "पत्ती ऊपर की ओर मुड़ते ही या फूल में कीड़ा दिखते ही",
        "tipHi": "काला थ्रिप्स फूलों के अंदर रहता है; प्रेशर नोजल से फूलों को अच्छी तरह भिगोएँ।"
      },
      {
        "id": "broad-mite",
        "nameHi": "पीली मकड़ी (Yellow / Broad Mite)",
        "nameEn": "Chilli Broad Mite",
        "tagHi": "कीट",
        "image": "/images/pests/pest-polyphagotarsonemus-latus.jpg",
        "stageHi": "फूल अवस्था (35-60 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "पत्तियां उल्टी नाव की तरह नीचे की ओर (Downward Curling) मुड़ती हैं, डंठल लंबा होता है और पत्ती के नीचे तांबे जैसी चमक आती है।",
        "whatHi": "पीली मकड़ी पत्तियों के नीचे से रस चूसकर उन्हें उल्टा मोड़ देती है (उल्टी नाव)।",
        "whyHi": [
          "उमस भरा गर्म मौसम"
        ],
        "cureOrganicHi": [
          "सल्फर 80% WDG 3 g/L",
          "तेज पानी की फुहार"
        ],
        "cureChemicalHi": [
          "ओबेरॉन 200 ml",
          "एबामेक्टिन + हेक्सिथियाजॉक्स"
        ],
        "whenToActHi": "पत्तियां नीचे की ओर मुड़ते ही",
        "tipHi": "थ्रिप्स में पत्ती ऊपर मुड़ती है, मकड़ी में नीचे मुड़ती है; सही पहचान कर दवा डालें।"
      },
      {
        "id": "powdery-mildew",
        "nameHi": "चूर्णी फफूंद (Powdery Mildew)",
        "nameEn": "Chilli Powdery Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के निचले हिस्से पर सफेद आटे जैसा पाउडर जमता है और पत्तियां पीली होकर झड़ जाती हैं।",
        "whatHi": "लेवेइलूला कवक से पत्तियों की निचली सतह पर सफेद पाउडर बनना।",
        "whyHi": [
          "सूखा मौसम और रात में ठंडी नमी"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG",
          "हवादार खेत"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "मेरीवोन 100 ml"
        ],
        "whenToActHi": "पत्ती के नीचे सफेद पाउडर दिखते ही",
        "tipHi": "मिर्च में चूर्णी फफूंद हमेशा पत्ती के नीचे से शुरू होती है, नीचे स्प्रे करें।"
      },
      {
        "id": "fruit-borer",
        "nameHi": "फल छेदक इल्ली (Fruit Borer - Spodoptera / Helicoverpa)",
        "nameEn": "Chilli Fruit Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फल अवस्था (50+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "मिर्च व शिमला मिर्च में डंठल के पास छेद करके अंदर घुस जाती है और फल का रंग सफेद पड़कर सड़ जाता है।",
        "whatHi": "इल्ली मिर्च के अंदर के बीज और गूदा खाकर फल को अंदर से सड़ा देती है।",
        "whyHi": [
          "फल बनते समय अनुकूल तापमान"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "फेम 50 ml"
        ],
        "whenToActHi": "मिर्च पर पहला छेद या इल्ली का अंडा दिखते ही",
        "tipHi": "फल तुड़ाई के बाद ही स्प्रे करें; PHI दिनों का ध्यान रखें।"
      },
      {
        "id": "anthracnose-dieback",
        "nameHi": "फल सड़न व डाई-बैक (Anthracnose / Fruit Rot)",
        "nameEn": "Anthracnose & Dieback",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-colletotrichum-gloeosporioides-2.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "मिर्च पर गोल धंसे हुए काले दाग पड़ते हैं और टहनियां ऊपर से नीचे की ओर सूखती हैं।",
        "whatHi": "कोलेटोट्राइकम कवक से पकी मिर्च सड़ना और टहनियों का डाई-बैक होकर सूखना।",
        "whyHi": [
          "वर्षा के बाद उमस व 80%+ नमी"
        ],
        "cureOrganicHi": [
          "सूखी टहनियों को 2 इंच नीचे से काटकर जलाएँ"
        ],
        "cureChemicalHi": [
          "नेटिवो 120 g",
          "कैब्रियो टॉप 600 g"
        ],
        "whenToActHi": "मिर्च पर पहला काला धंसा हुआ दाग दिखते ही",
        "tipHi": "डाई-बैक दिखते ही तुरंत फफूंदनाशक का छिड़काव करें।"
      }
    ]
  },
  {
    "slug": "capsicum",
    "nameHi": "शिमला मिर्च",
    "nameEn": "Capsicum / Bell Pepper",
    "emoji": "🫑",
    "image": "/images/crops/capsicum.jpg",
    "problems": [
      {
        "id": "collar-rot-wilt",
        "nameHi": "तना गलन व उकठा (Collar Rot & Fusarium Wilt)",
        "nameEn": "Collar Rot & Fusarium Wilt",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "तना जमीन के पास से भूरा होकर गलता है या पूरा पौधा अचानक मुरझा जाता है। (जड़ों में ड्रेंचिंग)",
        "whatHi": "फ्यूजेरियम व पिथियम कवक से तने व जड़ों का सड़ना और पौधों का सूखना।",
        "whyHi": [
          "जलभराव व भारी मिट्टी",
          "उच्च आर्द्रता"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा वीरिडी ड्रेंचिंग",
          "जल निकासी व्यवस्था"
        ],
        "cureChemicalHi": [
          "कॉपर ऑक्सीक्लोराइड 500 g",
          "रिडोमिल गोल्ड 400 g"
        ],
        "whenToActHi": "रोपाई के बाद पहला मुरझाया पौधा दिखते ही",
        "tipHi": "हमेशा शाम को जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "thrips",
        "nameHi": "सामान्य व काला थ्रिप्स (Scirtothrips & Black Thrips)",
        "nameEn": "Chilli Thrips & Black Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियां नाव की तरह ऊपर की ओर (Upward Curling) मुड़ती हैं; फूलों के अंदर काले कीड़े घुसकर फूल गिरा देते हैं।",
        "whatHi": "थ्रिप्स पत्तियों और फूलों को खुरचकर रस चूसते हैं जिससे मिर्च का पौधा रुक जाता है।",
        "whyHi": [
          "गर्म व सूखा मौसम",
          "नमी की कमी"
        ],
        "cureOrganicHi": [
          "नीले चिपचिपे ट्रैप (20 प्रति एकड़)",
          "नीम तेल 10000 PPM"
        ],
        "cureChemicalHi": [
          "डेलिगेट 180 ml",
          "एक्सपोनस 34 ml"
        ],
        "whenToActHi": "पत्ती ऊपर की ओर मुड़ते ही या फूल में कीड़ा दिखते ही",
        "tipHi": "काला थ्रिप्स फूलों के अंदर रहता है; प्रेशर नोजल से फूलों को अच्छी तरह भिगोएँ।"
      },
      {
        "id": "broad-mite",
        "nameHi": "पीली मकड़ी (Yellow / Broad Mite)",
        "nameEn": "Chilli Broad Mite",
        "tagHi": "कीट",
        "image": "/images/pests/pest-polyphagotarsonemus-latus.jpg",
        "stageHi": "फूल अवस्था (35-60 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "पत्तियां उल्टी नाव की तरह नीचे की ओर (Downward Curling) मुड़ती हैं, डंठल लंबा होता है और पत्ती के नीचे तांबे जैसी चमक आती है।",
        "whatHi": "पीली मकड़ी पत्तियों के नीचे से रस चूसकर उन्हें उल्टा मोड़ देती है (उल्टी नाव)।",
        "whyHi": [
          "उमस भरा गर्म मौसम"
        ],
        "cureOrganicHi": [
          "सल्फर 80% WDG 3 g/L",
          "तेज पानी की फुहार"
        ],
        "cureChemicalHi": [
          "ओबेरॉन 200 ml",
          "एबामेक्टिन + हेक्सिथियाजॉक्स"
        ],
        "whenToActHi": "पत्तियां नीचे की ओर मुड़ते ही",
        "tipHi": "थ्रिप्स में पत्ती ऊपर मुड़ती है, मकड़ी में नीचे मुड़ती है; सही पहचान कर दवा डालें।"
      },
      {
        "id": "powdery-mildew",
        "nameHi": "चूर्णी फफूंद (Powdery Mildew)",
        "nameEn": "Chilli Powdery Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के निचले हिस्से पर सफेद आटे जैसा पाउडर जमता है और पत्तियां पीली होकर झड़ जाती हैं।",
        "whatHi": "लेवेइलूला कवक से पत्तियों की निचली सतह पर सफेद पाउडर बनना।",
        "whyHi": [
          "सूखा मौसम और रात में ठंडी नमी"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG",
          "हवादार खेत"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "मेरीवोन 100 ml"
        ],
        "whenToActHi": "पत्ती के नीचे सफेद पाउडर दिखते ही",
        "tipHi": "मिर्च में चूर्णी फफूंद हमेशा पत्ती के नीचे से शुरू होती है, नीचे स्प्रे करें।"
      },
      {
        "id": "fruit-borer",
        "nameHi": "फल छेदक इल्ली (Fruit Borer - Spodoptera / Helicoverpa)",
        "nameEn": "Chilli Fruit Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फल अवस्था (50+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "मिर्च व शिमला मिर्च में डंठल के पास छेद करके अंदर घुस जाती है और फल का रंग सफेद पड़कर सड़ जाता है।",
        "whatHi": "इल्ली मिर्च के अंदर के बीज और गूदा खाकर फल को अंदर से सड़ा देती है।",
        "whyHi": [
          "फल बनते समय अनुकूल तापमान"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "फेम 50 ml"
        ],
        "whenToActHi": "मिर्च पर पहला छेद या इल्ली का अंडा दिखते ही",
        "tipHi": "फल तुड़ाई के बाद ही स्प्रे करें; PHI दिनों का ध्यान रखें।"
      },
      {
        "id": "anthracnose-dieback",
        "nameHi": "फल सड़न व डाई-बैक (Anthracnose / Fruit Rot)",
        "nameEn": "Anthracnose & Dieback",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-colletotrichum-gloeosporioides-2.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "मिर्च पर गोल धंसे हुए काले दाग पड़ते हैं और टहनियां ऊपर से नीचे की ओर सूखती हैं।",
        "whatHi": "कोलेटोट्राइकम कवक से पकी मिर्च सड़ना और टहनियों का डाई-बैक होकर सूखना।",
        "whyHi": [
          "वर्षा के बाद उमस व 80%+ नमी"
        ],
        "cureOrganicHi": [
          "सूखी टहनियों को 2 इंच नीचे से काटकर जलाएँ"
        ],
        "cureChemicalHi": [
          "नेटिवो 120 g",
          "कैब्रियो टॉप 600 g"
        ],
        "whenToActHi": "मिर्च पर पहला काला धंसा हुआ दाग दिखते ही",
        "tipHi": "डाई-बैक दिखते ही तुरंत फफूंदनाशक का छिड़काव करें।"
      }
    ]
  },
  {
    "slug": "cauliflower",
    "nameHi": "फूलगोभी",
    "nameEn": "Cauliflower",
    "emoji": "🥬",
    "image": "/images/crops/cauliflower.jpg",
    "problems": [
      {
        "id": "damping-off-wirestem",
        "nameHi": "तना गलन व वायरस्टेम (Damping-off & Wirestem)",
        "nameEn": "Damping-off & Wirestem",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-damping-off-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (1-30 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौध का निचला तना तार जैसा पतला, सख्त और काला पड़ जाता है।",
        "isVirus": true,
        "whatHi": "राइजोक्टोनिया व पिथियम कवक से गोभी की पौध का तना तार जैसा पतला होकर गलना।",
        "whyHi": [
          "भारी नमी",
          "घनी पौध"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा वीरिडी ड्रेंचिंग"
        ],
        "cureChemicalHi": [
          "रिडोमिल गोल्ड 400 g",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "नर्सरी व रोपाई के शुरुआती 20 दिन",
        "tipHi": "जड़ों में ड्रेंचिंग करें।"
      },
      {
        "id": "aphid",
        "nameHi": "माहू / चेपा (Cabbage Aphid)",
        "nameEn": "Cabbage Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-myzus-persicae-2.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों की निचली सतह और बीच की गोभ में हरे-भूरे चिपचिपे कीड़ों का गुच्छा।",
        "whatHi": "माहू रस चूसकर पत्तियों को सिकोड़ देता है और चिपचिपा मैल छोड़ता है।",
        "whyHi": [
          "ठंड और बादल युक्त मौसम"
        ],
        "cureOrganicHi": [
          "नीम तेल 10000 PPM",
          "पीले ट्रैप"
        ],
        "cureChemicalHi": [
          "उलाला 60 g",
          "थियामेथोक्साम 100 g"
        ],
        "whenToActHi": "पत्ती के नीचे पहला माहू का गुच्छा दिखते ही",
        "tipHi": "गोभी की गोभ के अंदर तक फुहार पहुँचनी चाहिए।"
      },
      {
        "id": "dbm",
        "nameHi": "डायमंड बैक मोथ (DBM - हीरक पृष्ठ पतंगा)",
        "nameEn": "Diamondback Moth (DBM)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-plutella-xylostella-2.jpg",
        "stageHi": "फूल / बंधा अवस्था (30-65 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "छोटी हरी इल्ली जो पत्तियों में जाली बनाती है और फूल के अंदर घुसकर उसे गंदा कर देती है।",
        "whatHi": "DBM इल्ली गोभी के पत्तों को छलनी कर फूल को बदरंग कर देती है; इसमें कीटनाशकों के प्रति भारी प्रतिरोध होता है।",
        "whyHi": [
          "लगातार गोभी वर्गीय फसलों की खेती"
        ],
        "cureOrganicHi": [
          "सरसों की ट्रैप क्रॉप (Trap crop) लगाएँ",
          "BT स्प्रे"
        ],
        "cureChemicalHi": [
          "एक्सपोनस 34 ml",
          "ग्रेसिया 160 ml"
        ],
        "whenToActHi": "पत्ती पर पहली छोटी हरी इल्ली या छेद दिखते ही",
        "tipHi": "DBM पर सादा कीटनाशक काम नहीं करता; केवल आधुनिक विशिष्ट मॉलिक्यूल ही काम करते हैं।"
      },
      {
        "id": "spodoptera-butterfly",
        "nameHi": "तंबाकू इल्ली व गोभी की तितली (Spodoptera & Cabbage Butterfly)",
        "nameEn": "Cabbage Butterfly & Spodoptera",
        "tagHi": "कीट",
        "image": "/images/pests/pest-pieris-brassicae-2.jpg",
        "stageHi": "फूल / बंधा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "बड़ी इल्लियां जो पत्ता गोभी के सिर (Head) में बड़े छेद कर देती हैं और फूल को गंदा कर देती हैं।",
        "whatHi": "हरी व चित्तीदार बड़ी इल्लियों का गोभी के मुख्य हिस्से को खाना।",
        "whyHi": [
          "तितलियों का अंड-निक्षेपण"
        ],
        "cureOrganicHi": [
          "पीली तितली के अंडों वाले पत्ते तोड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "नोवाल्यूरॉन + इमामेक्टिन 300 ml"
        ],
        "whenToActHi": "पत्तियों पर बड़ी इल्ली दिखते ही",
        "tipHi": "स्प्रे में सिलिकॉन चिपको अनिवार्य है क्योंकि गोभी के पत्ते मोमी होते हैं।"
      },
      {
        "id": "black-rot",
        "nameHi": "काला सड़न (Black Rot - जीवाणु जनित)",
        "nameEn": "Black Rot (Xanthomonas)",
        "tagHi": "जीवाणु",
        "image": "/images/diseases/disease-xanthomonas-campestris-2.jpg",
        "stageHi": "फूल / बंधा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्ती के किनारों से अंग्रेजी के 'V' आकार का पीलापन अंदर की तरफ बढ़ता है और नसें काली पड़ जाती हैं।",
        "whatHi": "जैंथोमोनास जीवाणु से पत्तियों की नसें काली पड़ना और बदबूदार सड़न होना।",
        "whyHi": [
          "गर्म व आर्द्र मौसम",
          "संक्रमित बीज"
        ],
        "cureOrganicHi": [
          "खेत में जल निकास रखें",
          "संक्रमित पौधे हटाएँ"
        ],
        "cureChemicalHi": [
          "कोनिका 300 g",
          "कोसाइड 350 g + कासुगामाइसिन"
        ],
        "whenToActHi": "पत्ती के किनारे पर पहला V-आकार का पीलापन दिखते ही",
        "tipHi": "जीवाणु रोग में साधारण फफूंदनाशक काम नहीं करता; कॉपर + एंटीबायोटिक ही डालें।"
      },
      {
        "id": "alternaria-downy",
        "nameHi": "अल्टरनेरिया काला धब्बा व डाउनी मिल्ड्यू",
        "nameEn": "Alternaria Leaf Spot & Downy Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-alternaria-brassicae-2.jpg",
        "stageHi": "फूल / बंधा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों और गोभी के सफेद फूल पर भूरे-काले धब्बे पड़ते हैं जिससे बाजार भाव गिर जाता है।",
        "whatHi": "अल्टरनेरिया व पेरिनोस्पोरा कवक से फूल पर काले धब्बे और पत्तियां पीली होना।",
        "whyHi": [
          "सर्दियों की बारिश और ओस"
        ],
        "cureOrganicHi": [
          "फूल पर सीधी धूप लगने दें"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "करजेट 500 g"
        ],
        "whenToActHi": "पत्ती या फूल पर पहला धब्बा दिखते ही",
        "tipHi": "फूल पर धब्बे न पड़ें इसलिए फूल बनते ही सुरक्षात्मक स्प्रे करें।"
      }
    ]
  },
  {
    "slug": "cabbage",
    "nameHi": "पत्ता गोभी",
    "nameEn": "Cabbage",
    "emoji": "🥬",
    "image": "/images/crops/cabbage.jpg",
    "problems": [
      {
        "id": "damping-off-wirestem",
        "nameHi": "तना गलन व वायरस्टेम (Damping-off & Wirestem)",
        "nameEn": "Damping-off & Wirestem",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-damping-off-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (1-30 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौध का निचला तना तार जैसा पतला, सख्त और काला पड़ जाता है।",
        "isVirus": true,
        "whatHi": "राइजोक्टोनिया व पिथियम कवक से गोभी की पौध का तना तार जैसा पतला होकर गलना।",
        "whyHi": [
          "भारी नमी",
          "घनी पौध"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा वीरिडी ड्रेंचिंग"
        ],
        "cureChemicalHi": [
          "रिडोमिल गोल्ड 400 g",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "नर्सरी व रोपाई के शुरुआती 20 दिन",
        "tipHi": "जड़ों में ड्रेंचिंग करें।"
      },
      {
        "id": "aphid",
        "nameHi": "माहू / चेपा (Cabbage Aphid)",
        "nameEn": "Cabbage Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-myzus-persicae-2.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों की निचली सतह और बीच की गोभ में हरे-भूरे चिपचिपे कीड़ों का गुच्छा।",
        "whatHi": "माहू रस चूसकर पत्तियों को सिकोड़ देता है और चिपचिपा मैल छोड़ता है।",
        "whyHi": [
          "ठंड और बादल युक्त मौसम"
        ],
        "cureOrganicHi": [
          "नीम तेल 10000 PPM",
          "पीले ट्रैप"
        ],
        "cureChemicalHi": [
          "उलाला 60 g",
          "थियामेथोक्साम 100 g"
        ],
        "whenToActHi": "पत्ती के नीचे पहला माहू का गुच्छा दिखते ही",
        "tipHi": "गोभी की गोभ के अंदर तक फुहार पहुँचनी चाहिए।"
      },
      {
        "id": "dbm",
        "nameHi": "डायमंड बैक मोथ (DBM - हीरक पृष्ठ पतंगा)",
        "nameEn": "Diamondback Moth (DBM)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-plutella-xylostella-2.jpg",
        "stageHi": "फूल / बंधा अवस्था (30-65 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "छोटी हरी इल्ली जो पत्तियों में जाली बनाती है और फूल के अंदर घुसकर उसे गंदा कर देती है।",
        "whatHi": "DBM इल्ली गोभी के पत्तों को छलनी कर फूल को बदरंग कर देती है; इसमें कीटनाशकों के प्रति भारी प्रतिरोध होता है।",
        "whyHi": [
          "लगातार गोभी वर्गीय फसलों की खेती"
        ],
        "cureOrganicHi": [
          "सरसों की ट्रैप क्रॉप (Trap crop) लगाएँ",
          "BT स्प्रे"
        ],
        "cureChemicalHi": [
          "एक्सपोनस 34 ml",
          "ग्रेसिया 160 ml"
        ],
        "whenToActHi": "पत्ती पर पहली छोटी हरी इल्ली या छेद दिखते ही",
        "tipHi": "DBM पर सादा कीटनाशक काम नहीं करता; केवल आधुनिक विशिष्ट मॉलिक्यूल ही काम करते हैं।"
      },
      {
        "id": "spodoptera-butterfly",
        "nameHi": "तंबाकू इल्ली व गोभी की तितली (Spodoptera & Cabbage Butterfly)",
        "nameEn": "Cabbage Butterfly & Spodoptera",
        "tagHi": "कीट",
        "image": "/images/pests/pest-pieris-brassicae-2.jpg",
        "stageHi": "फूल / बंधा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "बड़ी इल्लियां जो पत्ता गोभी के सिर (Head) में बड़े छेद कर देती हैं और फूल को गंदा कर देती हैं।",
        "whatHi": "हरी व चित्तीदार बड़ी इल्लियों का गोभी के मुख्य हिस्से को खाना।",
        "whyHi": [
          "तितलियों का अंड-निक्षेपण"
        ],
        "cureOrganicHi": [
          "पीली तितली के अंडों वाले पत्ते तोड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "नोवाल्यूरॉन + इमामेक्टिन 300 ml"
        ],
        "whenToActHi": "पत्तियों पर बड़ी इल्ली दिखते ही",
        "tipHi": "स्प्रे में सिलिकॉन चिपको अनिवार्य है क्योंकि गोभी के पत्ते मोमी होते हैं।"
      },
      {
        "id": "black-rot",
        "nameHi": "काला सड़न (Black Rot - जीवाणु जनित)",
        "nameEn": "Black Rot (Xanthomonas)",
        "tagHi": "जीवाणु",
        "image": "/images/diseases/disease-xanthomonas-campestris-2.jpg",
        "stageHi": "फूल / बंधा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्ती के किनारों से अंग्रेजी के 'V' आकार का पीलापन अंदर की तरफ बढ़ता है और नसें काली पड़ जाती हैं।",
        "whatHi": "जैंथोमोनास जीवाणु से पत्तियों की नसें काली पड़ना और बदबूदार सड़न होना।",
        "whyHi": [
          "गर्म व आर्द्र मौसम",
          "संक्रमित बीज"
        ],
        "cureOrganicHi": [
          "खेत में जल निकास रखें",
          "संक्रमित पौधे हटाएँ"
        ],
        "cureChemicalHi": [
          "कोनिका 300 g",
          "कोसाइड 350 g + कासुगामाइसिन"
        ],
        "whenToActHi": "पत्ती के किनारे पर पहला V-आकार का पीलापन दिखते ही",
        "tipHi": "जीवाणु रोग में साधारण फफूंदनाशक काम नहीं करता; कॉपर + एंटीबायोटिक ही डालें।"
      },
      {
        "id": "alternaria-downy",
        "nameHi": "अल्टरनेरिया काला धब्बा व डाउनी मिल्ड्यू",
        "nameEn": "Alternaria Leaf Spot & Downy Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-alternaria-brassicae-2.jpg",
        "stageHi": "फूल / बंधा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों और गोभी के सफेद फूल पर भूरे-काले धब्बे पड़ते हैं जिससे बाजार भाव गिर जाता है।",
        "whatHi": "अल्टरनेरिया व पेरिनोस्पोरा कवक से फूल पर काले धब्बे और पत्तियां पीली होना।",
        "whyHi": [
          "सर्दियों की बारिश और ओस"
        ],
        "cureOrganicHi": [
          "फूल पर सीधी धूप लगने दें"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "करजेट 500 g"
        ],
        "whenToActHi": "पत्ती या फूल पर पहला धब्बा दिखते ही",
        "tipHi": "फूल पर धब्बे न पड़ें इसलिए फूल बनते ही सुरक्षात्मक स्प्रे करें।"
      }
    ]
  },
  {
    "slug": "cucumber",
    "nameHi": "खीरा",
    "nameEn": "Cucumber",
    "emoji": "🥒",
    "image": "/images/crops/cucumber.jpg",
    "problems": [
      {
        "id": "red-pumpkin-beetle",
        "nameHi": "लाल कद्दू भृंग (Red Pumpkin Beetle)",
        "nameEn": "Red Pumpkin Beetle",
        "tagHi": "कीट",
        "image": "/images/pests/pest-aulacophora-foveicollis-2.jpg",
        "stageHi": "अंकुरण व बेल अवस्था (1-25 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "नारंगी-लाल रंग का चमकदार कीड़ा जो शुरुआती 2-4 पत्तियों को खाकर छलनी कर देता है।",
        "whatHi": "भृंग कोमल पत्तियों को तेजी से खाकर पौधे की बढ़वार रोक देता है।",
        "whyHi": [
          "अंकुरण के तुरंत बाद शुष्क मौसम"
        ],
        "cureOrganicHi": [
          "सुबह पत्तियों पर लकड़ी की राख छिड़कना"
        ],
        "cureChemicalHi": [
          "सोलोमन 120 ml",
          "साइपरमेथ्रिन 150 ml"
        ],
        "whenToActHi": "पहली 2-4 पत्तियों पर लाल कीड़ा दिखते ही",
        "tipHi": "सुबह के समय जब कीड़े सुस्त हों, तभी छिड़काव करें।"
      },
      {
        "id": "leafminer-whitefly",
        "nameHi": "पत्ती सुरंगक व सफेद मक्खी (Leaf Miner & Whitefly)",
        "nameEn": "Leaf Miner & Whitefly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-liriomyza-trifolii-2.jpg",
        "stageHi": "बेल व फूल अवस्था (20-45 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों पर सफेद लकीरें और पीला मोज़ेक वायरस (पीले धब्बे)।",
        "whatHi": "नागअली पत्तियों को सुखाती है और सफेद मक्खी वायरस फैलाती है।",
        "whyHi": [
          "गर्म मौसम"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे ट्रैप",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "बेनेविया 200 ml",
          "एबामेक्टिन + थियामेथोक्साम"
        ],
        "whenToActHi": "पहली सफेद लकीर दिखते ही",
        "tipHi": "ट्रांसलैमिनार सिस्टेमिक दवा ही चुनें।"
      },
      {
        "id": "downy-mildew",
        "nameHi": "डाउनी मिल्ड्यू (Downy Mildew - मृदु रोमिल आसिता)",
        "nameEn": "Cucurbit Downy Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-pseudoperonospora-cubensis-2.jpg",
        "stageHi": "फूल व फल अवस्था (30-60 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्ती के ऊपरी हिस्से पर पीले चौकोर धब्बे (नसों से घिरे हुए) और नीचे बैंगनी फफूंद।",
        "whatHi": "स्यूडोपेरोनोस्पोरा कवक से पत्तियां सूखकर जल जाती हैं और बेल खत्म हो जाती है।",
        "whyHi": [
          "रात में ठंड और ओस",
          "बादल युक्त मौसम"
        ],
        "cureOrganicHi": [
          "खेत में हवा का आवागमन रखें"
        ],
        "cureChemicalHi": [
          "ज़ैमप्रो 300 ml",
          "रानमैन 60 ml"
        ],
        "whenToActHi": "पत्ती पर पहला चौकोर पीला धब्बा दिखते ही",
        "tipHi": "पत्तियों के निचले हिस्से को अच्छी तरह भिगोएँ जहाँ फफूंद पनपती है।"
      },
      {
        "id": "powdery-mildew",
        "nameHi": "पाउडरी मिल्ड्यू (Powdery Mildew)",
        "nameEn": "Cucurbit Powdery Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों और बेल पर सफेद पाउडर की परत। (खीरे में सल्फर अधिक मात्रा में डालने से पत्ती जलती है)",
        "whatHi": "पोडोस्फेरा कवक से पत्तियों पर सफेद आटे जैसी परत जमना।",
        "whyHi": [
          "सूखा मौसम और रात में नमी"
        ],
        "cureOrganicHi": [
          "छाछ/मट्ठा स्प्रे"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "विवांडो 100 ml"
        ],
        "whenToActHi": "पत्ती पर सफेद धब्बा दिखते ही",
        "tipHi": "खीरे में कभी तेज धूप में सल्फर न डालें, फसल जल सकती है।"
      },
      {
        "id": "fruit-fly",
        "nameHi": "फल मक्खी (Fruit Fly - Bactrocera)",
        "nameEn": "Cucurbit Fruit Fly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-bactrocera-cucurbitae.jpg",
        "stageHi": "फल अवस्था (35+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "मादा मक्खी छोटे खीरे में डंक मारती है, वहां से भूरा गोंद निकलता है और खीरा अंदर से कीड़े पड़ने से टेढ़ा होकर सड़ जाता है।",
        "whatHi": "फल मक्खी के मैगट खीरे के गूदे को सड़ा देते हैं।",
        "whyHi": [
          "फल बनते समय गर्म व नम मौसम"
        ],
        "cureOrganicHi": [
          "क्यू-ल्यूर फेरोमोन ट्रैप (8 प्रति एकड़ अनिवार्य)"
        ],
        "cureChemicalHi": [
          "बेनेविया 200 ml",
          "स्पिनोसैड 75 ml"
        ],
        "whenToActHi": "फूल से फल बनते ही या फल पर गोंद की बूंद दिखते ही",
        "tipHi": "केवल स्प्रे से फल मक्खी नहीं रुकती; फेरोमोन ट्रैप लगाना 100% अनिवार्य है।"
      }
    ]
  },
  {
    "slug": "brinjal",
    "nameHi": "बैंगन",
    "nameEn": "Brinjal / Eggplant",
    "emoji": "🍆",
    "image": "/images/crops/brinjal.jpg",
    "problems": [
      {
        "id": "jassid-little-leaf",
        "nameHi": "हरा तेला, सफेद मक्खी व छोटी पत्ती रोग (Little Leaf)",
        "nameEn": "Jassid, Whitefly & Little Leaf",
        "tagHi": "कीट",
        "image": "/images/pests/pest-amrasca-biguttula-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (15-40 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "रस चूसक कीटों से पत्तियां पीली पड़ती हैं और माइकोप्लाज्मा से पत्तियां एकदम छोटी व झाड़ी जैसी हो जाती हैं।",
        "whatHi": "तेला व सफेद मक्खी रस चूसकर लिटिल लीफ रोग फैलाते हैं जिससे पौधा फलना बंद हो जाता है।",
        "whyHi": [
          "गर्म व शुष्क मौसम"
        ],
        "cureOrganicHi": [
          "पीले स्टिकी कार्ड (15/एकड़)",
          "संक्रमित झाड़ीनुमा पौधे उखाड़ें"
        ],
        "cureChemicalHi": [
          "उलाला 80 g",
          "पेगासस 200 g"
        ],
        "whenToActHi": "पत्ती के किनारे मुड़ते ही या सफेद मक्खी दिखते ही",
        "tipHi": "लिटिल लीफ माइकोप्लाज्मा से होता है जिसे रस चूसक कीट फैलाते हैं; कीड़ों को तुरंत रोकें।"
      },
      {
        "id": "shoot-fruit-borer",
        "nameHi": "तना एवं फल छेदक (Shoot & Fruit Borer - Leucinodes)",
        "nameEn": "Shoot & Fruit Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-leucinodes-orbonalis-2.jpg",
        "stageHi": "वानस्पतिक व फल अवस्था (25+ दिन)",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "शुरू में ऊपर की कोपल में घुसता है जिससे कोपल मुरझाकर झुक जाती है; बाद में बैंगन के अंदर घुसकर उसे काना कर देता है।",
        "whatHi": "ल्यूसिनोड्स इल्ली बैंगन की सबसे विनाशकारी शत्रु है, फल के अंदर मल भरकर सड़ा देती है।",
        "whyHi": [
          "साल भर लगातार बैंगन की खेती"
        ],
        "cureOrganicHi": [
          "मुरझाई कोपलों को 2 इंच नीचे से तोड़कर नष्ट करें",
          "ल्यूसि-ल्यूर फेरोमोन ट्रैप (10/एकड़)"
        ],
        "cureChemicalHi": [
          "कोराजन 80 ml",
          "डेलिगेट 180 ml / एक्सपोनस 34 ml"
        ],
        "whenToActHi": "पहली मुरझाई कोपल या फल पर छेद दिखते ही",
        "tipHi": "हर तुड़ाई के बाद मुरझाई टहनी तोड़ें और दवा बदलकर स्प्रे करें।"
      },
      {
        "id": "epilachna-beetle",
        "nameHi": "हड्डा भृंग (Epilachna / Hadda Beetle)",
        "nameEn": "Hadda / Epilachna Beetle",
        "tagHi": "कीट",
        "image": "/images/pests/pest-henosepilachna-2.jpg",
        "stageHi": "वानस्पतिक व फल अवस्था",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "तांबे के रंग का गोल कीड़ा जिस पर काले धब्बे होते हैं; यह पत्तियों को खुरचकर जाली जैसी बना देता है।",
        "whatHi": "भृंग व उसके कांटेदार पीले बच्चे पत्तियों की हरियाली खुरचकर जालीदार छलनी बना देते हैं।",
        "whyHi": [
          "गर्म व आर्द्र मौसम"
        ],
        "cureOrganicHi": [
          "पीले अंडों के गुच्छों को हाथ से मसलें"
        ],
        "cureChemicalHi": [
          "प्लेथोरा 250 ml",
          "अलिका 80 ml"
        ],
        "whenToActHi": "पत्ती पर पहली जाली खुरची दिखते ही",
        "tipHi": "पत्तियों के निचले भाग में कीड़े छुपते हैं, नीचे स्प्रे करें।"
      },
      {
        "id": "red-spider-mite",
        "nameHi": "लाल मकड़ी (Red Spider Mite)",
        "nameEn": "Brinjal Red Spider Mite",
        "tagHi": "कीट",
        "image": "/images/pests/pest-tetranychus-urticae.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के नीचे जाले और पत्तियां सफेद-पीली हो जाती हैं।",
        "whatHi": "लाखों सूक्ष्म मकड़ियां रस चूसकर पत्तियों को भूसा बना देती हैं।",
        "whyHi": [
          "गर्म व शुष्क मौसम"
        ],
        "cureOrganicHi": [
          "तेज धार पानी का छिड़काव",
          "घुलनशील सल्फर"
        ],
        "cureChemicalHi": [
          "ओबेरॉन 200 ml",
          "बोर्नियो 160 ml"
        ],
        "whenToActHi": "पत्तियों पर जाले दिखते ही",
        "tipHi": "केवल माइटनाशक ही डालें; सादे कीटनाशक से मकड़ी बढ़ जाती है।"
      },
      {
        "id": "phomopsis-blight",
        "nameHi": "फोमोप्सिस झुलसा / फल सड़न (Phomopsis Blight)",
        "nameEn": "Phomopsis Blight & Fruit Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-phomopsis-vexans-2.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर भूरे धब्बे और बैंगन के फल पर धंसे हुए पीले-भूरे सड़े हुए छल्ले बनते हैं।",
        "whatHi": "फोमोप्सिस कवक से फल सड़कर मुलायम हो जाता है और गिर जाता है।",
        "whyHi": [
          "वर्षा के बाद उच्च आर्द्रता"
        ],
        "cureOrganicHi": [
          "रोगग्रस्त फल तोड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "नेटिवो 120 g",
          "साफ 500 g"
        ],
        "whenToActHi": "फल पर पहला धंसा हुआ छल्ला दिखते ही",
        "tipHi": "फल अवस्था में सुरक्षात्मक कवकनाशी स्प्रे करें।"
      }
    ]
  },
  {
    "slug": "sugarcane",
    "nameHi": "गन्ना",
    "nameEn": "Sugarcane",
    "emoji": "🎋",
    "image": "/images/crops/sugarcane.jpg",
    "problems": [
      {
        "id": "termite-white-grub",
        "nameHi": "दीमक व सफेद लट (Termite & White Grub)",
        "nameEn": "Termite & White Grub",
        "tagHi": "कीट",
        "image": "/images/pests/pest-odontotermes-obesus.jpg",
        "stageHi": "अंकुरण व कल्ले (1-60 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "बोए गए गन्ने के टुकड़ों (Setts) और जड़ों को मिट्टी के अंदर खा जाते हैं। (सिंचाई या ड्रेंचिंग)",
        "whatHi": "दीमक व गोजा लट गन्ने की आंखें और जड़ें खाकर अंकुरण खत्म कर देते हैं।",
        "whyHi": [
          "कच्ची गोबर खाद डालना",
          "रेतीली मिट्टी"
        ],
        "cureOrganicHi": [
          "पक्की सड़ी गोबर खाद प्रयोग करें",
          "मेटाराइजियम"
        ],
        "cureChemicalHi": [
          "लेसेन्टा 150-200 g",
          "क्लोरपायरीफॉस 1 L"
        ],
        "whenToActHi": "बुवाई के समय टुकड़ों पर या कल्ले फूटते समय",
        "tipHi": "बुवाई के समय गूल (कूड़) में सीधे धार से दवा डालें।"
      },
      {
        "id": "early-shoot-borer",
        "nameHi": "अगेती तना छेदक (Early Shoot Borer - कंसुआ)",
        "nameEn": "Early Shoot Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-chilo-infuscatellus.jpg",
        "stageHi": "कल्ले अवस्था (20-60 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "गर्मी के दिनों (अप्रैल-मई) में गन्ने की बीच की गोभ सूख जाती है जिसे खींचने पर वह आसानी से निकल आती है और उसमें से बदबू आती है।",
        "whatHi": "कंसुआ की सुंडी जमीन के बराबर से तने में छेद करके अंदर का भाग खा जाती है।",
        "whyHi": [
          "तेज गर्मी व सूखा मौसम (अप्रैल-जून)"
        ],
        "cureOrganicHi": [
          "मिट्टी चढ़ाना (Earthing up)",
          "ट्राइकोग्रामा कार्ड"
        ],
        "cureChemicalHi": [
          "कोराजन 150 ml ड्रेंचिंग",
          "फर्टेरा 5 kg"
        ],
        "whenToActHi": "बुवाई के 35-45 दिन बाद पहली सूखी गोभ दिखते ही",
        "tipHi": "कोराजन का छिड़काव 400 लीटर पानी में नोजल का कैप खोलकर सीधे गन्ने की जड़/कल्लों पर धार से करें।"
      },
      {
        "id": "top-borer",
        "nameHi": "चोटी बेधक (Top Borer)",
        "nameEn": "Sugarcane Top Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirpophaga-excerptalis-2.jpg",
        "stageHi": "बढ़वार अवस्था (60-150 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "गोभ की पत्तियों पर गोली के छेद जैसी आड़ी लाइन (Shot holes) दिखती है और ऊपरी हिस्सा झाड़ू जैसा (Bunchy top) बन जाता है।",
        "whatHi": "सुंडी पत्ती की मध्य शिरा से घुसकर गन्ने की चोटी को मार देती है; गन्ने की बढ़वार रुक जाती है।",
        "whyHi": [
          "जुलाई-अगस्त की मानसूनी बारिश"
        ],
        "cureOrganicHi": [
          "अंडों के गुच्छे तोड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "कोराजन 150 ml",
          "फर्टेरा 6 kg"
        ],
        "whenToActHi": "पत्ती पर पहली गोली जैसी छेद की कतार दिखते ही",
        "tipHi": "जुलाई के पहले हफ्ते में उपचार कर लेने से बंची टॉप नहीं बनता।"
      },
      {
        "id": "pokkah-boeng",
        "nameHi": "पोक्का बोइंग (Pokkah Boeng)",
        "nameEn": "Pokkah Boeng",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-moniliforme.jpg",
        "stageHi": "बढ़वार अवस्था (मानसून)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "ऊपरी पत्तियां मुड़कर आपस में उलझ जाती हैं, पत्तियों का आधार पीला-सफेद होकर सड़ता है।",
        "whatHi": "फ्यूजेरियम कवक से गन्ने की चोटी मुड़कर सिकुड़ जाना और बढ़वार रुक जाना।",
        "whyHi": [
          "मानसून में तेज बारिश और बादल"
        ],
        "cureOrganicHi": [
          "खेत में जल निकास दुरुस्त करें"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 250 ml",
          "साफ 500 g"
        ],
        "whenToActHi": "चोटी की पत्तियां मुड़ते या सफेद होते ही",
        "tipHi": "बारिश के दिनों में फफूंदनाशक का छिड़काव चोटी की तरफ करें।"
      },
      {
        "id": "pyrilla-woolly-aphid",
        "nameHi": "पायरिला व वूली एफिड (Pyrilla & Woolly Aphid)",
        "nameEn": "Sugarcane Pyrilla & Woolly Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-pyrilla-perpusilla-2.jpg",
        "stageHi": "गन्ना अवस्था (120+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के नीचे चोंच वाले भूरे फुदके या सफेद रुई जैसे माहू जो रस चूसकर पत्तियों को काला (Sooty mould) कर देते हैं।",
        "whatHi": "रस चूसकर गन्ने में शर्करा (रिकवरी) कम कर देते हैं और पत्तियां काली पड़ जाती हैं।",
        "whyHi": [
          "अत्यधिक नाइट्रोजन खाद",
          "घना गन्ना"
        ],
        "cureOrganicHi": [
          "इपिरिकैनिया मित्र कीट का संरक्षण"
        ],
        "cureChemicalHi": [
          "अलिका 100 ml",
          "थियामेथोक्साम 120 g"
        ],
        "whenToActHi": "पत्ती के नीचे भूरे फुदके या सफेद जाले दिखते ही",
        "tipHi": "पत्तियों की निचली सतह पर अच्छी तरह स्प्रे करें।"
      },
      {
        "id": "red-rot",
        "nameHi": "लाल सड़न (Red Rot - गन्ने का कैंसर)",
        "nameEn": "Sugarcane Red Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-colletotrichum-falcatum.jpg",
        "stageHi": "गन्ना अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "तीसरी-चौथी पत्ती सूखती है; गन्ना फाड़ने पर अंदर लाल गूदा व सफेद आड़ी पट्टियां दिखती हैं और सिरके जैसी बदबू आती है। (रोकथाम हेतु ड्रेंचिंग)",
        "whatHi": "कोलेटोट्राइकम कवक गन्ने को अंदर से सड़ा देता है जिससे पूरा थान सूख जाता है।",
        "whyHi": [
          "संक्रमित बीज सेट",
          "जलभराव"
        ],
        "cureOrganicHi": [
          "संक्रमित थान को जड़ सहित उखाड़कर जलाएँ और गड्ढे में ब्लीचिंग पाउडर डालें"
        ],
        "cureChemicalHi": [
          "कस्टोडिया 300 ml",
          "रोको 500 g"
        ],
        "whenToActHi": "बीमारी की शुरुआत में आस-पास के पौधों पर रोकथाम हेतु",
        "tipHi": "लाल सड़न का गन्ना खेत में न छोड़ें; बीज हमेशा शोधित करके ही बोएँ।"
      }
    ]
  },
  {
    "slug": "potato",
    "nameHi": "आलू",
    "nameEn": "Potato",
    "emoji": "🥔",
    "image": "/images/crops/potato.jpg",
    "problems": [
      {
        "id": "black-scurf",
        "nameHi": "काली पपड़ी व तना कैंकर (Black Scurf - Rhizoctonia)",
        "nameEn": "Black Scurf & Stem Canker",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-rhizoctonia-solani-2.jpg",
        "stageHi": "बुवाई व अंकुरण (0-25 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "अंकुरित कल्ले जमीन के अंदर काले पड़कर सड़ते हैं और बाद में आलू के ऊपर काले तारकोल जैसे दाने चिपके मिलते हैं। (बीज उपचार/ड्रेंचिंग)",
        "whatHi": "राइजोक्टोनिया कवक आलू के कंदों पर काली पपड़ी बना देता है जिससे बाजार भाव नहीं मिलता।",
        "whyHi": [
          "संक्रमित बीज आलू",
          "ठंडी व गीली मिट्टी"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा से कंद उपचार"
        ],
        "cureChemicalHi": [
          "एमिस्टो प्राइम 80 ml (बीज उपचार)",
          "पल्सर 150 ml"
        ],
        "whenToActHi": "बुवाई से पहले कंद उपचार या अंकुरण के समय",
        "tipHi": "बीज आलू को हमेशा उपचारित करके ही बोएँ।"
      },
      {
        "id": "cutworm",
        "nameHi": "कटुआ कीट (Cutworm - Agrotis)",
        "nameEn": "Potato Cutworm",
        "tagHi": "कीट",
        "image": "/images/pests/pest-agrotis-ipsilon-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (20-40 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "रात में मिट्टी से निकलकर छोटे पौधों के तने को जमीन के बराबर से काट देता है। (शाम को जड़ों में स्प्रे)",
        "whatHi": "काली सुंडी दिन में मिट्टी में छुपती है और रात में पौधों को काटकर गिरा देती है।",
        "whyHi": [
          "सर्दियों की शुरुआत",
          "खेत में ढेले होना"
        ],
        "cureOrganicHi": [
          "खेत में पक्षी बैठने की खूंटियां लगाएँ",
          "शाम को निगरानी"
        ],
        "cureChemicalHi": [
          "एम्पलिगो 100 ml",
          "क्लोरपायरीफॉस 600 ml"
        ],
        "whenToActHi": "पहला पौधा कटा हुआ दिखते ही",
        "tipHi": "कटुआ कीट रात में निकलता है; छिड़काव हमेशा सूरज ढलने के बाद शाम को करें।"
      },
      {
        "id": "aphid-whitefly",
        "nameHi": "माहू, हरा तेला व सफेद मक्खी (Aphid, Jassid, Whitefly)",
        "nameEn": "Aphid, Jassid & Whitefly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-myzus-persicae-2.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों का रस चूसकर उन्हें मोड़ देते हैं (Leaf Roll Virus) और पत्तियों के किनारे जला देते हैं (Hopper burn)।",
        "whatHi": "रस चूसक कीट आलू में लीफ रोल वायरस फैलाते हैं जिससे बीज आलू खराब हो जाता है।",
        "whyHi": [
          "दिसंबर-जनवरी का कोहरा व नमी"
        ],
        "cureOrganicHi": [
          "पीले स्टिकी ट्रैप (20/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "उलाला 80 g",
          "पेगासस 200 g"
        ],
        "whenToActHi": "पत्ती के नीचे पहला माहू या सफेद मक्खी दिखते ही",
        "tipHi": "बीज आलू उत्पादकों के लिए एफिड नियंत्रण अत्यंत अनिवार्य है।"
      },
      {
        "id": "early-blight",
        "nameHi": "अगेती झुलसा (Early Blight)",
        "nameEn": "Potato Early Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-alternaria-solani-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (30-45 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "नीचे की पत्तियों पर गोल छल्लेदार भूरे धब्बे।",
        "whatHi": "अल्टरनेरिया कवक से निचली पत्तियों पर संकेंद्री गोल छल्ले बनना।",
        "whyHi": [
          "गर्म दिन और ठंडी नम रातें"
        ],
        "cureOrganicHi": [
          "संक्रमित पत्तियां हटाएँ"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "एंट्राकोल 600 g"
        ],
        "whenToActHi": "निचली पत्तियों पर पहला गोल छल्ला दिखते ही",
        "tipHi": "पछेती झुलसा आने से पहले अगेती झुलसा की रोकथाम कर लें।"
      },
      {
        "id": "late-blight",
        "nameHi": "पछेती झुलसा (Late Blight - सबसे खतरनाक)",
        "nameEn": "Potato Late Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-phytophthora-infestans-2.jpg",
        "stageHi": "कंद बनते व फूलते समय (45-75 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के किनारों पर काले पानी भरे धब्बे और नीचे सफेद फफूंद; पूरा खेत कुछ ही दिनों में जल जाता है।",
        "whatHi": "फाइटोफ्थोरा कवक से आलू का सबसे घातक रोग जो 48 घंटे में खेत जला देता है।",
        "whyHi": [
          "बादल छाए रहना, कोहरा व 85%+ नमी"
        ],
        "cureOrganicHi": [
          "खेत में पानी न भरने दें"
        ],
        "cureChemicalHi": [
          "रिवस 160 ml",
          "इक्वेशन प्रो 200 ml"
        ],
        "whenToActHi": "कोहरे का मौसम शुरू होते ही या पहला पानी भरा धब्बा दिखते ही",
        "tipHi": "पछेती झुलसा में 1 दिन की देरी भी भारी पड़ सकती है; मौसम बदलते ही तुरंत स्प्रे करें।"
      }
    ]
  },
  {
    "slug": "bajra",
    "nameHi": "बाजरा",
    "nameEn": "Pearl Millet",
    "emoji": "🌾",
    "image": "/images/crops/bajra.jpg",
    "problems": [
      {
        "id": "shoot-fly-white-grub",
        "nameHi": "तना मक्खी व सफेद लट (Shoot Fly & White Grub)",
        "nameEn": "Bajra Shoot Fly & White Grub",
        "tagHi": "कीट",
        "image": "/images/pests/pest-atherigona-approximata-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "शुरुआती अवस्था में बीच की गोभ सूखती है और सफेद लट जड़ काटती है।",
        "whatHi": "कीट छोटे पौधों को सुखा देते हैं जिससे खेत में खाली चकत्ते बन जाते हैं।",
        "whyHi": [
          "देर से बुवाई",
          "रेतीली मिट्टी"
        ],
        "cureOrganicHi": [
          "समय पर अगेती बुवाई",
          "नीम खली"
        ],
        "cureChemicalHi": [
          "अलिका 80 ml",
          "क्लोरपायरीफॉस 500 ml"
        ],
        "whenToActHi": "बुवाई के 10-15 दिन बाद सूखी गोभ दिखते ही",
        "tipHi": "बीज उपचार करके ही बुवाई करें।"
      },
      {
        "id": "downy-mildew-green-ear",
        "nameHi": "जोगिया / हरित बाली रोग (Downy Mildew / Green Ear)",
        "nameEn": "Green Ear / Downy Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-sclerospora-graminicola.jpg",
        "stageHi": "वानस्पतिक अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियां पीली पड़ती हैं और बाद में सिट्टे (बाली) में दानों की जगह हरी पत्तियों जैसी झाड़ू निकल आती है।",
        "whatHi": "स्क्लेरोस्पोरा कवक बाली के दानों को पत्ती जैसी झाड़ू में बदल देता है; दाने बिल्कुल नहीं बनते।",
        "whyHi": [
          "संक्रमित बीज",
          "आर्द्र गर्म मौसम"
        ],
        "cureOrganicHi": [
          "रोगी पौधों को उखाड़कर नष्ट करें"
        ],
        "cureChemicalHi": [
          "रिडोमिल गोल्ड 500 g",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "पत्तियों पर पीली धारियां दिखते ही",
        "tipHi": "प्रतिरोधी संकर बीज का चयन करें।"
      },
      {
        "id": "ergot-smut",
        "nameHi": "अर्गट (चेपा रोग) व कांगियारी (Ergot & Smut)",
        "nameEn": "Bajra Ergot & Smut",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-claviceps-fusiformis.jpg",
        "stageHi": "बाली व दाना अवस्था (45+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "बाली से गुलाबी-भूरा चिपचिपा रस टपकता है जो बाद में काले जहरीले दानों में बदल जाता है।",
        "whatHi": "क्लैविसेप्स कवक दानों को काले जहरीले स्क्लेरोशिया में बदल देता है जो पशुओं व इंसानों के लिए हानिकारक है।",
        "whyHi": [
          "फूल आते समय बारिश और 85%+ नमी"
        ],
        "cureOrganicHi": [
          "नमक के 20% घोल में बीज तैराकर अर्गट निकालें"
        ],
        "cureChemicalHi": [
          "टिल्ट 200 ml",
          "फॉलिकुर 200 ml"
        ],
        "whenToActHi": "बाली निकलते समय फूल खिलने से ठीक पहले",
        "tipHi": "बाली पर चिपचिपा रस आने से पहले ही स्प्रे करना आवश्यक है।"
      }
    ]
  },
  {
    "slug": "wheat",
    "nameHi": "गेहूं",
    "nameEn": "Wheat",
    "emoji": "🌾",
    "image": "/images/crops/wheat.jpg",
    "problems": [
      {
        "id": "termite-root-aphid",
        "nameHi": "दीमक व जड़ माहू (Termite & Root Aphid)",
        "nameEn": "Termite & Root Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-odontotermes-obesus.jpg",
        "stageHi": "अंकुरण व कल्ले अवस्था (15-40 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "जड़ों के पास हरे-सफेद सूक्ष्म कीड़े या दीमक चिपके होते हैं, जिससे पौधा पीला होकर सूखता है।",
        "whatHi": "दीमक व जड़ माहू जड़ों का रस चूसकर कल्ले फूटने से रोकते हैं।",
        "whyHi": [
          "हल्की रेतीली मिट्टी",
          "कच्ची गोबर खाद"
        ],
        "cureOrganicHi": [
          "खेत में पर्याप्त नमी रखें"
        ],
        "cureChemicalHi": [
          "क्लोरपायरीफॉस 1 L सिंचाई में",
          "थियामेथोक्साम + फिप्रोनिल"
        ],
        "whenToActHi": "पहला सूखा पौधा दिखते ही",
        "tipHi": "सिंचाई के पानी के साथ नाली में चलाएँ।"
      },
      {
        "id": "pink-stem-borer",
        "nameHi": "गुलाबी तना छेदक (Pink Stem Borer)",
        "nameEn": "Pink Stem Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-sesamia-inferens.jpg",
        "stageHi": "कल्ले अवस्था (25-45 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "मुख्य कल्ले की बीच की पत्ती पीली होकर सूख जाती है, अंदर गुलाबी रंग की सुंडी मिलती है। (धान के बाद वाले खेतों में अधिक)",
        "whatHi": "सेसेमिया सुंडी तने के अंदर घुसकर कल्ले को सुखा देती है।",
        "whyHi": [
          "धान-गेहूं फसल चक्र",
          "खेत में धान के अवशेष"
        ],
        "cureOrganicHi": [
          "धान के ठूंठ अच्छी तरह जोतें"
        ],
        "cureChemicalHi": [
          "फर्टेरा 4 kg",
          "अलिका 100 ml"
        ],
        "whenToActHi": "खेत में पहली सूखी गोभ दिखते ही",
        "tipHi": "पहली सिंचाई के समय दानेदार दवा बिखेरें।"
      },
      {
        "id": "yellow-brown-rust",
        "nameHi": "पीला व भूरा रतुआ (Yellow & Brown Rust)",
        "nameEn": "Yellow & Brown Rust",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-puccinia-striiformis-2.jpg",
        "stageHi": "गभोट व झंडा पत्ती अवस्था (45-70 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सीधी लाइनों में पीला पाउडर (हल्दी जैसा) जमता है जो हाथ पर लग जाता है।",
        "whatHi": "पक्सीनिया कवक से पत्तियों पर पीली धारियां पड़ना और भोजन बनना बंद होना।",
        "whyHi": [
          "सर्दियों की बारिश, कोहरा व ठंडी हवाएं (जनवरी-फरवरी)"
        ],
        "cureOrganicHi": [
          "रोगरोधी किस्म (HD-2967, HD-3086, DBW-187 आदि)"
        ],
        "cureChemicalHi": [
          "टिल्ट 200 ml",
          "नेटिवो 120 g"
        ],
        "whenToActHi": "पत्ती पर पहली पीली हल्दी जैसी धारी दिखते ही",
        "tipHi": "पीला रतुआ हवा से फैलता है; लक्षण दिखते ही बिना देरी के तुरंत स्प्रे करें।"
      },
      {
        "id": "powdery-karnal-bunt",
        "nameHi": "चूर्णी फफूंद व करनाल बंट (Powdery Mildew & Karnal Bunt)",
        "nameEn": "Powdery Mildew & Karnal Bunt",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-tilletia-indica.jpg",
        "stageHi": "गभोट व बाली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद पाउडर; करनाल बंट में बाली के कुछ दाने काले पाउडर (मछली जैसी बदबू) में बदल जाते हैं।",
        "whatHi": "कवक दानों को काले सड़े पाउडर में बदल देता है जिससे आटे की गुणवत्ता खराब होती है।",
        "whyHi": [
          "बाली निकलते समय बादल और हल्की बारिश"
        ],
        "cureOrganicHi": [
          "प्रमाणित स्वस्थ बीज ही बोएँ"
        ],
        "cureChemicalHi": [
          "कस्टोडिया 250 ml",
          "टिल्ट 200 ml"
        ],
        "whenToActHi": "बाली निकलने के समय (फरवरी-मार्च)",
        "tipHi": "बाली निकलते समय एक सुरक्षात्मक स्प्रे करनाल बंट से पूरी तरह बचाता है।"
      },
      {
        "id": "earhead-aphid",
        "nameHi": "बाली का चेपा / माहू (Earhead Aphid)",
        "nameEn": "Wheat Earhead Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-rhopalosiphum-maidis.jpg",
        "stageHi": "बाली व दूधिया अवस्था (70+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "हरी बालियों पर काले-हरे माहू चिपक कर दानों का रस चूसते हैं जिससे दाने सिकुड़ जाते हैं।",
        "whatHi": "माहू बालियों से दूधिया रस चूसकर उपज 20-30% घटा देता है।",
        "whyHi": [
          "फरवरी-मार्च में तापमान बढ़ना"
        ],
        "cureOrganicHi": [
          "लेडीबर्ड बीटल का संरक्षण",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "थियामेथोक्साम 80 g",
          "एसिटामिप्रिड 60 g"
        ],
        "whenToActHi": "प्रति बाली 5-10 माहू दिखते ही",
        "tipHi": "दूधिया अवस्था में समय पर माहू मारने से दाना पूरा और भारी बनता है।"
      }
    ]
  },
  {
    "slug": "onion",
    "nameHi": "प्याज",
    "nameEn": "Onion",
    "emoji": "🧅",
    "image": "/images/crops/onion.jpg",
    "problems": [
      {
        "id": "basal-rot",
        "nameHi": "जड़ गलन व गुलाबी जड़ रोग (Basal Rot & Pink Root)",
        "nameEn": "Basal Rot & Pink Root",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-sclerotium-cepivorum.jpg",
        "stageHi": "वानस्पतिक अवस्था (15-40 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "ऊपर से पत्तियों की नोक पीली पड़ती है और नीचे जड़ें गुलाबी-भूरी होकर गल जाती हैं। (सिंचाई/ड्रेंचिंग)",
        "whatHi": "फ्यूजेरियम व पिथियम कवक से प्याज-लहसुन के कंद के नीचे की जड़ों का सड़ना।",
        "whyHi": [
          "जलभराव व उच्च मिट्टी तापमान"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा ड्रेंचिंग",
          "फसल चक्र"
        ],
        "cureChemicalHi": [
          "रोको 500 g",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "पत्तियों की नोक पीली होते ही",
        "tipHi": "सिंचाई के पानी के साथ या ड्रिप से ड्रेंचिंग करें।"
      },
      {
        "id": "thrips",
        "nameHi": "थ्रिप्स (Onion Thrips - सबसे मुख्य कीट)",
        "nameEn": "Onion Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-thrips-tabaci-2.jpg",
        "stageHi": "वानस्पतिक व कंद अवस्था (30-75 दिन)",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "दो पत्तियों के जोड़ (गर्दन) के बीच छुपकर पत्ती को खुरचते हैं, जिससे पत्तियों पर चांदी जैसे सफेद दाग पड़ जाते हैं और पत्ती मुड़ने लगती है।",
        "whatHi": "थ्रिप्स प्याज-लहसुन की पत्तियों का रस चूसकर कंद बनने की प्रक्रिया रोक देते हैं।",
        "whyHi": [
          "शुष्क व गर्म मौसम (फरवरी-अप्रैल)"
        ],
        "cureOrganicHi": [
          "नीले स्टिकी ट्रैप (20/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "डेलिगेट 150 ml",
          "एक्सपोनस 30 ml"
        ],
        "whenToActHi": "पत्ती के जोड़ में बारीक पीले-भूरे कीड़े दिखते ही",
        "tipHi": "प्याज की पत्तियां मोमी और खड़ी होती हैं; सिलिकॉन चिपको (Sticker) मिलाना 100% अनिवार्य है।"
      },
      {
        "id": "purple-blotch",
        "nameHi": "बैंगनी धब्बा व झुलसा (Purple Blotch & Stemphylium Blight)",
        "nameEn": "Purple Blotch & Stemphylium Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-alternaria-porri-2.jpg",
        "stageHi": "कंद बनते समय (45-80 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर धंसे हुए सफेद धब्बे जिनका बीच का हिस्सा बैंगनी-भूरा हो जाता है और पत्तियां ऊपर से सूखने लगती हैं।",
        "whatHi": "अल्टरनेरिया पोरी कवक से पत्तियां ऊपर से नीचे की ओर सूखना और कंद छोटा रह जाना।",
        "whyHi": [
          "सर्दियों की बारिश और 85%+ नमी"
        ],
        "cureOrganicHi": [
          "खेत साफ रखें",
          "संतुलित पोटाश"
        ],
        "cureChemicalHi": [
          "नेटिवो 120 g",
          "एमिस्टार टॉप 200 ml"
        ],
        "whenToActHi": "पत्ती पर पहला बैंगनी धब्बा दिखते ही",
        "tipHi": "कंद बनने के समय यह बीमारी 50% तक पैदावार घटा देती है; तुरंत उपचार करें।"
      },
      {
        "id": "downy-mildew-twister",
        "nameHi": "मृदु रोमिल आसिता व तना मुड़ना (Downy Mildew & Twister Disease)",
        "nameEn": "Downy Mildew & Twister Disease",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-peronospora-destructor-2.jpg",
        "stageHi": "कंद अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "नमी में पत्तियों पर बैंगनी-सफेद रोएं दिखते हैं और प्याज की गर्दन लंबी होकर जलेबी की तरह घूम जाती है (Twister)।",
        "whatHi": "पेरोनोस्पोरा व कोलेटोट्राइकम कवक से पत्तियों का मुड़ना और कंद न बनना।",
        "whyHi": [
          "बादल छाए रहना, कोहरा व उच्च आर्द्रता"
        ],
        "cureOrganicHi": [
          "खेत में जल जमाव न होने दें"
        ],
        "cureChemicalHi": [
          "कस्टोडिया 250 ml",
          "करजेट 500 g"
        ],
        "whenToActHi": "पत्ती पर रोएं या गर्दन मुड़ते दिखते ही",
        "tipHi": "ट्विस्टर रोग में कवकनाशी के साथ जिबरेलिक एसिड नियंत्रक का प्रयोग करें।"
      }
    ]
  },
  {
    "slug": "garlic",
    "nameHi": "लहसुन",
    "nameEn": "Garlic",
    "emoji": "🧄",
    "image": "/images/crops/garlic.jpg",
    "problems": [
      {
        "id": "basal-rot",
        "nameHi": "जड़ गलन व गुलाबी जड़ रोग (Basal Rot & Pink Root)",
        "nameEn": "Basal Rot & Pink Root",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-sclerotium-cepivorum.jpg",
        "stageHi": "वानस्पतिक अवस्था (15-40 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "ऊपर से पत्तियों की नोक पीली पड़ती है और नीचे जड़ें गुलाबी-भूरी होकर गल जाती हैं। (सिंचाई/ड्रेंचिंग)",
        "whatHi": "फ्यूजेरियम व पिथियम कवक से प्याज-लहसुन के कंद के नीचे की जड़ों का सड़ना।",
        "whyHi": [
          "जलभराव व उच्च मिट्टी तापमान"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा ड्रेंचिंग",
          "फसल चक्र"
        ],
        "cureChemicalHi": [
          "रोको 500 g",
          "कस्टोडिया 250 ml"
        ],
        "whenToActHi": "पत्तियों की नोक पीली होते ही",
        "tipHi": "सिंचाई के पानी के साथ या ड्रिप से ड्रेंचिंग करें।"
      },
      {
        "id": "thrips",
        "nameHi": "थ्रिप्स (Onion Thrips - सबसे मुख्य कीट)",
        "nameEn": "Onion Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-thrips-tabaci-2.jpg",
        "stageHi": "वानस्पतिक व कंद अवस्था (30-75 दिन)",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "दो पत्तियों के जोड़ (गर्दन) के बीच छुपकर पत्ती को खुरचते हैं, जिससे पत्तियों पर चांदी जैसे सफेद दाग पड़ जाते हैं और पत्ती मुड़ने लगती है।",
        "whatHi": "थ्रिप्स प्याज-लहसुन की पत्तियों का रस चूसकर कंद बनने की प्रक्रिया रोक देते हैं।",
        "whyHi": [
          "शुष्क व गर्म मौसम (फरवरी-अप्रैल)"
        ],
        "cureOrganicHi": [
          "नीले स्टिकी ट्रैप (20/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "डेलिगेट 150 ml",
          "एक्सपोनस 30 ml"
        ],
        "whenToActHi": "पत्ती के जोड़ में बारीक पीले-भूरे कीड़े दिखते ही",
        "tipHi": "प्याज की पत्तियां मोमी और खड़ी होती हैं; सिलिकॉन चिपको (Sticker) मिलाना 100% अनिवार्य है।"
      },
      {
        "id": "purple-blotch",
        "nameHi": "बैंगनी धब्बा व झुलसा (Purple Blotch & Stemphylium Blight)",
        "nameEn": "Purple Blotch & Stemphylium Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-alternaria-porri-2.jpg",
        "stageHi": "कंद बनते समय (45-80 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर धंसे हुए सफेद धब्बे जिनका बीच का हिस्सा बैंगनी-भूरा हो जाता है और पत्तियां ऊपर से सूखने लगती हैं।",
        "whatHi": "अल्टरनेरिया पोरी कवक से पत्तियां ऊपर से नीचे की ओर सूखना और कंद छोटा रह जाना।",
        "whyHi": [
          "सर्दियों की बारिश और 85%+ नमी"
        ],
        "cureOrganicHi": [
          "खेत साफ रखें",
          "संतुलित पोटाश"
        ],
        "cureChemicalHi": [
          "नेटिवो 120 g",
          "एमिस्टार टॉप 200 ml"
        ],
        "whenToActHi": "पत्ती पर पहला बैंगनी धब्बा दिखते ही",
        "tipHi": "कंद बनने के समय यह बीमारी 50% तक पैदावार घटा देती है; तुरंत उपचार करें।"
      },
      {
        "id": "downy-mildew-twister",
        "nameHi": "मृदु रोमिल आसिता व तना मुड़ना (Downy Mildew & Twister Disease)",
        "nameEn": "Downy Mildew & Twister Disease",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-peronospora-destructor-2.jpg",
        "stageHi": "कंद अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "नमी में पत्तियों पर बैंगनी-सफेद रोएं दिखते हैं और प्याज की गर्दन लंबी होकर जलेबी की तरह घूम जाती है (Twister)।",
        "whatHi": "पेरोनोस्पोरा व कोलेटोट्राइकम कवक से पत्तियों का मुड़ना और कंद न बनना।",
        "whyHi": [
          "बादल छाए रहना, कोहरा व उच्च आर्द्रता"
        ],
        "cureOrganicHi": [
          "खेत में जल जमाव न होने दें"
        ],
        "cureChemicalHi": [
          "कस्टोडिया 250 ml",
          "करजेट 500 g"
        ],
        "whenToActHi": "पत्ती पर रोएं या गर्दन मुड़ते दिखते ही",
        "tipHi": "ट्विस्टर रोग में कवकनाशी के साथ जिबरेलिक एसिड नियंत्रक का प्रयोग करें।"
      }
    ]
  },
  {
    "slug": "cotton",
    "nameHi": "कपास",
    "nameEn": "Cotton",
    "emoji": "☁️",
    "image": "/images/crops/cotton.jpg",
    "problems": [
      {
        "id": "jassid-aphid",
        "nameHi": "हरा तेला व माहू (Jassid & Aphid)",
        "nameEn": "Cotton Jassid & Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-amrasca-biguttula-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (15-45 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पत्तियों के किनारे नीचे की ओर मुड़कर पहले पीले और फिर ईंट जैसे लाल (Hopper burn) हो जाते हैं।",
        "whatHi": "तेला रस चूसकर पत्ती के किनारों को जला देता है; बढ़वार रुक जाती है।",
        "whyHi": [
          "गर्म व शुष्क मौसम"
        ],
        "cureOrganicHi": [
          "पीले ट्रैप (15/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "उलाला 60-80 g",
          "ओशीन 100 g"
        ],
        "whenToActHi": "पत्ती के किनारे मुड़ते ही या प्रति पत्ती 2 तेला दिखते ही",
        "tipHi": "पत्ती की निचली सतह पर स्प्रे करें।"
      },
      {
        "id": "thrips",
        "nameHi": "थ्रिप्स (Thrips)",
        "nameEn": "Cotton Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-thrips-tabaci-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (30-60 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्ती के नीचे चांदी जैसी चमक आती है और पत्तियां कड़क होकर फटने लगती हैं।",
        "whatHi": "थ्रिप्स पत्तियों को खुरचकर रस चूसते हैं जिससे पत्तियां नाव जैसी मुड़कर कड़क हो जाती हैं।",
        "whyHi": [
          "सूखा मौसम और बारिश में देरी"
        ],
        "cureOrganicHi": [
          "नीले स्टिकी ट्रैप (20/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "डेलिगेट 150 ml",
          "ग्रेसिया 160 ml"
        ],
        "whenToActHi": "पत्ती के नीचे चांदी जैसी चमक दिखते ही",
        "tipHi": "समय पर थ्रिप्स न रोकने से कोपलें सूख जाती हैं।"
      },
      {
        "id": "whitefly",
        "nameHi": "सफेद मक्खी (Whitefly)",
        "nameEn": "Cotton Whitefly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-bemisia-tabaci-2.jpg",
        "stageHi": "फूल व पुड़िया अवस्था (45-85 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के नीचे सफेद मक्खियां व पीले निम्फ; शहद जैसा चिपचिपा पदार्थ निकलने से पत्तियां काली पड़ जाती हैं।",
        "whatHi": "सफेद मक्खी रस चूसकर पत्तियों को काला (Sooty Mould) कर देती है और CLCuV वायरस फैलाती है।",
        "whyHi": [
          "गर्म व उमस भरा मौसम",
          "कम बारिश"
        ],
        "cureOrganicHi": [
          "पीले ट्रैप (20/एकड़)",
          "नीम तेल 10000 PPM"
        ],
        "cureChemicalHi": [
          "सेफिना 400 ml",
          "पेगासस + लानो"
        ],
        "whenToActHi": "प्रति पत्ती 6-8 मक्खियां या निम्फ दिखते ही",
        "tipHi": "वयस्क के साथ निम्फ (बच्चों) को मारना सबसे जरूरी है; IGR दवा मिलाएँ।"
      },
      {
        "id": "mealybug",
        "nameHi": "मिलीबग (Mealybug)",
        "nameEn": "Cotton Mealybug",
        "tagHi": "कीट",
        "image": "/images/pests/pest-phenacoccus-solenopsis.jpg",
        "stageHi": "फूल व टिंडा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "तने और टहनियों पर सफेद रुई की परत वाले कीड़े चिपके रहते हैं, जिन पर चींटियां चलती हैं।",
        "whatHi": "मिलीबग तने और टिंडों का रस चूसकर पौधे को सुखा देता है।",
        "whyHi": [
          "सूखा मौसम",
          "मेड़ों पर खरपतवार (कांग्रेस घास)"
        ],
        "cureOrganicHi": [
          "मेड़ों से खरपतवार नष्ट करें",
          "तने पर ग्रीस पट्टी लगाएँ"
        ],
        "cureChemicalHi": [
          "मोवेंटो एनर्जी 250 ml",
          "एप्लाउड 400 ml"
        ],
        "whenToActHi": "तने पर पहला सफेद गुच्छा दिखते ही",
        "tipHi": "मोमी परत को भेदने के लिए तेज प्रेशर से नोजल चलाएँ और सिलिकॉन स्टिकर मिलाएँ।"
      },
      {
        "id": "pink-bollworm",
        "nameHi": "गुलाबी सुंडी (Pink Bollworm - PBW)",
        "nameEn": "Pink Bollworm (PBW)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-pectinophora-gossypiella-2.jpg",
        "stageHi": "फूल व टिंडा अवस्था (55+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "फूल गुलाब की कली (Rosette) जैसे बंद रह जाते हैं; सुंडी टिंडे के अंदर बीज व रुई खाकर उसे सड़ा देती है।",
        "whatHi": "गुलाबी सुंडी टिंडे के अंदर घुसकर रुई को बदरंग व सड़ा देती है; बाहर से छेद बंद हो जाता है।",
        "whyHi": [
          "फूल व टिंडे बनते समय",
          "बीटी कपास में प्रतिरोध"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Pectino-lure 8/एकड़ अनिवार्य)",
          "रोसेट फूल तोड़ें"
        ],
        "cureChemicalHi": [
          "एम्पलिगो 100 ml",
          "डैनिटोल 300 ml"
        ],
        "whenToActHi": "प्रति ट्रैप 8 पतंगे/रात या 5% रोसेट फूल दिखते ही",
        "tipHi": "फूल खिलते ही पहला स्प्रे अनिवार्य है; टिंडे में घुसने के बाद सुंडी नहीं मरती।"
      },
      {
        "id": "boll-rot-blight",
        "nameHi": "जीवाणु झुलसा, दहिया रोग व टिंडा सड़न",
        "nameEn": "Angular Leaf Spot, Grey Mildew & Boll Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-xanthomonas-citri-pv-malvacearum.jpg",
        "stageHi": "फूल व टिंडा अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर कोणीय काले धब्बे या नीचे सफेद दही जैसे धब्बे (दहिया); बारिश में टिंडे काले होकर सड़ते हैं।",
        "whatHi": "बैक्टीरियल ब्लाइट और ग्रे मिल्ड्यू से पत्तियां झड़ना और टिंडे सड़ना।",
        "whyHi": [
          "लगातार बारिश और 85%+ नमी"
        ],
        "cureOrganicHi": [
          "खेत में हवा का आवागमन रखें"
        ],
        "cureChemicalHi": [
          "प्रियाक्सर 120 ml",
          "एमिस्टार टॉप 200 ml"
        ],
        "whenToActHi": "पत्ती पर कोणीय काले धब्बे या सफेद दही जैसे रोएं दिखते ही",
        "tipHi": "दहिया रोग में पत्ती के नीचे स्प्रे करें।"
      }
    ]
  },
  {
    "slug": "moong",
    "nameHi": "मूंग",
    "nameEn": "Moong / Green Gram",
    "emoji": "🫘",
    "image": "/images/crops/moong.jpg",
    "problems": [
      {
        "id": "fusarium-wilt-root-rot",
        "nameHi": "उकठा व जड़ गलन (Fusarium Wilt & Dry Root Rot)",
        "nameEn": "Fusarium Wilt & Dry Root Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौधा ऊपर से नीचे तक पीला होकर सूख जाता है; जड़ को चीरने पर अंदर काली/भूरी लकीर दिखती है। (चना, अरहर, मसूर में प्रमुख)",
        "whatHi": "फ्यूजेरियम कवक से संवहनी नलियां बंद होना और पौधे का सूखना।",
        "whyHi": [
          "गर्म मिट्टी व असंतुलित नमी"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 2 kg प्रति एकड़ गोबर खाद में मिलाकर दें"
        ],
        "cureChemicalHi": [
          "टेबुकोनाज़ोल 250 ml",
          "रोको 500 g"
        ],
        "whenToActHi": "खेत में पहला सूखा पौधा दिखते ही",
        "tipHi": "जड़ों के पास ड्रेंचिंग करें; दोपहर में मुरझाने वाले पौधों को तुरंत उखाड़ें।"
      },
      {
        "id": "ymv-whitefly",
        "nameHi": "पीला मोज़ेक वायरस व सफेद मक्खी (YMV & Whitefly)",
        "nameEn": "Yellow Mosaic Virus (YMV)",
        "tagHi": "वायरस",
        "image": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (15-40 दिन)",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियां चमकदार पीली पड़ जाती हैं और फलियां नहीं लगतीं। (मूंग और उड़द में सबसे प्रमुख; फफूंदनाशक न डालें, सफेद मक्खी रोकें!)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला वायरस जिससे पूरा पौधा पीला पड़ जाता है।",
        "whyHi": [
          "सफेद मक्खी का अनियंत्रित प्रकोप"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे ट्रैप (15-20/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "पाइरिप्रोक्सीफेन + बाइफेंथ्रिन 250 ml",
          "उलाला 60 g"
        ],
        "whenToActHi": "पहली पीली पत्ती या सफेद मक्खी दिखते ही",
        "tipHi": "वायरस फैलने से पहले सफेद मक्खी को 100% नियंत्रित करना ही एकमात्र उपाय है।"
      },
      {
        "id": "flower-thrips-aphid",
        "nameHi": "फूल के थ्रिप्स व माहू (Flower Thrips & Aphids)",
        "nameEn": "Flower Thrips & Aphids",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "फूल अवस्था (30-50 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "फूलों के अंदर घुसकर रस चूसते हैं जिससे मूंग, उड़द व अरहर के फूल बिना फली बने झड़ जाते हैं।",
        "whatHi": "थ्रिप्स फूलों को सुखा देते हैं जिससे फलियां नहीं बनतीं।",
        "whyHi": [
          "फूल आते समय गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "नीले ट्रैप",
          "नीम तेल स्प्रे"
        ],
        "cureChemicalHi": [
          "डेलिगेट 120 ml",
          "रीजेंट 300 ml"
        ],
        "whenToActHi": "फूलों में सूक्ष्म कीड़े दिखते ही",
        "tipHi": "फूल खिलने के समय सुबह या शाम को छिड़काव करें ताकि परागण पर असर न पड़े।"
      },
      {
        "id": "pod-borer",
        "nameHi": "फली छेदक व जाले वाली इल्ली (Pod Borer - Helicoverpa & Maruca)",
        "nameEn": "Pod Borer (Helicoverpa & Maruca)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फूल व फली अवस्था (40+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "Maruca फूलों और फलियों को रेशमी जाले से बांधकर अंदर से खाती है; Helicoverpa फली में गोल छेद कर दाने खा जाती है।",
        "whatHi": "इल्लियां फलियों के दाने चट कर जाती हैं जिससे भारी नुकसान होता है।",
        "whyHi": [
          "फली बनते समय अनुकूल मौसम"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (5/एकड़)",
          "NPV स्प्रे"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "फेम 40 ml"
        ],
        "whenToActHi": "पहला जाला या फली पर छेद दिखते ही",
        "tipHi": "मारूका जाले के अंदर छुपती है; तेज प्रेशर से छिड़काव करें।"
      },
      {
        "id": "powdery-ascochyta",
        "nameHi": "चूर्णी फफूंद व एस्कोकाइटा झुलसा (Powdery Mildew & Ascochyta Blight)",
        "nameEn": "Powdery Mildew & Ascochyta Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद पाउडर या तने व फलियों पर गोल भूरे धब्बे।",
        "whatHi": "कवक पत्तियों को सफेद पाउडर से ढक देता है और फलियों पर काले धब्बे बनाता है।",
        "whyHi": [
          "सर्दियों की शुष्क रातें और दिन की धूप"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर",
          "हवादार फसल"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "कोंटाफ 300 ml"
        ],
        "whenToActHi": "पत्ती पर पहला सफेद पाउडर या धब्बा दिखते ही",
        "tipHi": "पत्तियों के दोनों तरफ छिड़काव करें।"
      }
    ]
  },
  {
    "slug": "urad",
    "nameHi": "उड़द",
    "nameEn": "Urad / Black Gram",
    "emoji": "🫘",
    "image": "/images/crops/urad.jpg",
    "problems": [
      {
        "id": "fusarium-wilt-root-rot",
        "nameHi": "उकठा व जड़ गलन (Fusarium Wilt & Dry Root Rot)",
        "nameEn": "Fusarium Wilt & Dry Root Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौधा ऊपर से नीचे तक पीला होकर सूख जाता है; जड़ को चीरने पर अंदर काली/भूरी लकीर दिखती है। (चना, अरहर, मसूर में प्रमुख)",
        "whatHi": "फ्यूजेरियम कवक से संवहनी नलियां बंद होना और पौधे का सूखना।",
        "whyHi": [
          "गर्म मिट्टी व असंतुलित नमी"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 2 kg प्रति एकड़ गोबर खाद में मिलाकर दें"
        ],
        "cureChemicalHi": [
          "टेबुकोनाज़ोल 250 ml",
          "रोको 500 g"
        ],
        "whenToActHi": "खेत में पहला सूखा पौधा दिखते ही",
        "tipHi": "जड़ों के पास ड्रेंचिंग करें; दोपहर में मुरझाने वाले पौधों को तुरंत उखाड़ें।"
      },
      {
        "id": "ymv-whitefly",
        "nameHi": "पीला मोज़ेक वायरस व सफेद मक्खी (YMV & Whitefly)",
        "nameEn": "Yellow Mosaic Virus (YMV)",
        "tagHi": "वायरस",
        "image": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (15-40 दिन)",
        "stages": [
          "vegetative",
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियां चमकदार पीली पड़ जाती हैं और फलियां नहीं लगतीं। (मूंग और उड़द में सबसे प्रमुख; फफूंदनाशक न डालें, सफेद मक्खी रोकें!)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला वायरस जिससे पूरा पौधा पीला पड़ जाता है।",
        "whyHi": [
          "सफेद मक्खी का अनियंत्रित प्रकोप"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे ट्रैप (15-20/एकड़)",
          "नीम तेल"
        ],
        "cureChemicalHi": [
          "पाइरिप्रोक्सीफेन + बाइफेंथ्रिन 250 ml",
          "उलाला 60 g"
        ],
        "whenToActHi": "पहली पीली पत्ती या सफेद मक्खी दिखते ही",
        "tipHi": "वायरस फैलने से पहले सफेद मक्खी को 100% नियंत्रित करना ही एकमात्र उपाय है।"
      },
      {
        "id": "flower-thrips-aphid",
        "nameHi": "फूल के थ्रिप्स व माहू (Flower Thrips & Aphids)",
        "nameEn": "Flower Thrips & Aphids",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "फूल अवस्था (30-50 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "फूलों के अंदर घुसकर रस चूसते हैं जिससे मूंग, उड़द व अरहर के फूल बिना फली बने झड़ जाते हैं।",
        "whatHi": "थ्रिप्स फूलों को सुखा देते हैं जिससे फलियां नहीं बनतीं।",
        "whyHi": [
          "फूल आते समय गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "नीले ट्रैप",
          "नीम तेल स्प्रे"
        ],
        "cureChemicalHi": [
          "डेलिगेट 120 ml",
          "रीजेंट 300 ml"
        ],
        "whenToActHi": "फूलों में सूक्ष्म कीड़े दिखते ही",
        "tipHi": "फूल खिलने के समय सुबह या शाम को छिड़काव करें ताकि परागण पर असर न पड़े।"
      },
      {
        "id": "pod-borer",
        "nameHi": "फली छेदक व जाले वाली इल्ली (Pod Borer - Helicoverpa & Maruca)",
        "nameEn": "Pod Borer (Helicoverpa & Maruca)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फूल व फली अवस्था (40+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "Maruca फूलों और फलियों को रेशमी जाले से बांधकर अंदर से खाती है; Helicoverpa फली में गोल छेद कर दाने खा जाती है।",
        "whatHi": "इल्लियां फलियों के दाने चट कर जाती हैं जिससे भारी नुकसान होता है।",
        "whyHi": [
          "फली बनते समय अनुकूल मौसम"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (5/एकड़)",
          "NPV स्प्रे"
        ],
        "cureChemicalHi": [
          "कोराजन 60 ml",
          "फेम 40 ml"
        ],
        "whenToActHi": "पहला जाला या फली पर छेद दिखते ही",
        "tipHi": "मारूका जाले के अंदर छुपती है; तेज प्रेशर से छिड़काव करें।"
      },
      {
        "id": "powdery-ascochyta",
        "nameHi": "चूर्णी फफूंद व एस्कोकाइटा झुलसा (Powdery Mildew & Ascochyta Blight)",
        "nameEn": "Powdery Mildew & Ascochyta Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद पाउडर या तने व फलियों पर गोल भूरे धब्बे।",
        "whatHi": "कवक पत्तियों को सफेद पाउडर से ढक देता है और फलियों पर काले धब्बे बनाता है।",
        "whyHi": [
          "सर्दियों की शुष्क रातें और दिन की धूप"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर",
          "हवादार फसल"
        ],
        "cureChemicalHi": [
          "एमिस्टार टॉप 200 ml",
          "कोंटाफ 300 ml"
        ],
        "whenToActHi": "पत्ती पर पहला सफेद पाउडर या धब्बा दिखते ही",
        "tipHi": "पत्तियों के दोनों तरफ छिड़काव करें।"
      }
    ]
  },
  {
    "slug": "arhar",
    "nameHi": "अरहर (तुअर)",
    "nameEn": "Pigeon Pea (Arhar)",
    "emoji": "🫘",
    "image": "/images/crops/arhar.jpg",
    "problems": [
      {
        "id": "fusarium-wilt-root-rot",
        "nameHi": "उकठा व जड़ गलन (Fusarium Wilt & Dry Root Rot)",
        "nameEn": "Fusarium Wilt & Dry Root Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौधा ऊपर से नीचे तक पीला होकर सूख जाता है; जड़ को चीरने पर अंदर काली/भूरी लकीर दिखती है।",
        "whatHi": "फसल की शुरुआती अवस्था में जड़ गलन व पूरे पौधे का अचानक सूख जाना।",
        "whyHi": [
          "जमीन में कवक (Fusarium/Rhizoctonia) की मौजूदगी",
          "जलभराव या भारी मिट्टी"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 5 ग्राम/लीटर पानी से जड़ों में ड्रेंचिंग करें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम 50% WP (400 g जड़ों में ड्रेंचिंग)",
          "थायोफेनेट मिथाइल 70% WP (500 g)"
        ],
        "whenToActHi": "शुरुआती लक्षण दिखते ही जड़ों में ड्रेंचिंग करें",
        "tipHi": "हमेशा शाम के समय जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "ymv-whitefly",
        "nameHi": "पीला मोज़ेक वायरस व सफेद मक्खी (YMV & Whitefly)",
        "nameEn": "Yellow Mosaic Virus & Whitefly",
        "tagHi": "वायरस व कीट",
        "image": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (15-40 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियां चमकदार पीली पड़ जाती हैं और फलियां नहीं लगतीं। (सफेद मक्खी रोकें — फंगीसाइड न डालें)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला अत्यंत घातक वायरल रोग जिससे उपज शून्य हो सकती है।",
        "whyHi": [
          "सफेद मक्खी (Bemisia tabaci) का प्रकोप",
          "गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे कार्ड (Yellow Sticky Traps) 15-20 प्रति एकड़ लगाएं",
          "नीम तेल 10,000 PPM 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "थियामेथोक्सम 25% WG (100 g)",
          "पायरीप्रॉक्सीफेन + बाइफेन्थ्रिन (250 ml)"
        ],
        "whenToActHi": "सफेद मक्खी दिखते ही तत्काल स्प्रे करें",
        "tipHi": "वायरस का कोई फंगीसाइड इलाज नहीं है, केवल सफेद मक्खी (वेक्टर) को मारकर ही फैलाव रुकता है।"
      },
      {
        "id": "flower-thrips-aphid",
        "nameHi": "फूल के थ्रिप्स व माहू (Flower Thrips & Aphids)",
        "nameEn": "Flower Thrips & Aphids",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "फूल अवस्था (30-50 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "फूलों के अंदर घुसकर रस चूसते हैं जिससे फूल बिना फली बने झड़ जाते हैं।",
        "whatHi": "फूलों से रस चूसकर फलियों के बनने की प्रक्रिया को पूरी तरह नष्ट करने वाले बारीक कीट।",
        "whyHi": [
          "फूल खिलते समय शुष्क मौसम",
          "पास के खेतों से कीटों का स्थानांतरण"
        ],
        "cureOrganicHi": [
          "नीली चिपचिपी पट्टियां (Blue Sticky Traps) लगाएं",
          "नीम तेल 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "इमिडाक्लोप्रिड 17.8% SL (100 ml)",
          "फिप्रोनिल 5% SC (300 ml)",
          "स्पिनेटोरम 11.7% SC (120 ml)"
        ],
        "whenToActHi": "फूल खिलने से ठीक पहले या शुरुआती फूल अवस्था में",
        "tipHi": "फूल झड़ने से रोकने के लिए सुबह के समय स्प्रे करें जब मधुमक्खियां कम सक्रिय हों।"
      },
      {
        "id": "pod-borer",
        "nameHi": "फली छेदक व जाले वाली इल्ली (Pod Borer - Helicoverpa & Maruca)",
        "nameEn": "Pod Borer (Helicoverpa & Maruca)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फूल व फली अवस्था (40+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "Maruca फूलों और फलियों को रेशमी जाले से बांधकर खाती है; Helicoverpa फली में गोल छेद कर दाने खा जाती है।",
        "whatHi": "दलहनी फसलों की सबसे विनाशकारी सुंडी जो सीधे फलियों और दानों को चट कर जाती है।",
        "whyHi": [
          "मौसम में नमी और बादल छाना",
          "फूल व फली का अधिक बनना"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Helilure) 5 प्रति एकड़ लगाएं",
          "बैसिलस थुरिंजिएंसिस (BT) 2 ग्राम/लीटर"
        ],
        "cureChemicalHi": [
          "इमामेक्टिन बेंजोएट 5% SG (100 g)",
          "कोराजन 18.5% SC (60 ml)"
        ],
        "whenToActHi": "फूलों में जाले दिखते ही या 5% फलियों में छेद दिखने पर",
        "tipHi": "हमेशा शाम के समय स्प्रे करें जब इल्लियां बाहर निकलकर खाती हैं।"
      },
      {
        "id": "powdery-ascochyta",
        "nameHi": "चूर्णी फफूंद व एस्कोकाइटा झुलसा (Powdery Mildew & Ascochyta Blight)",
        "nameEn": "Powdery Mildew & Ascochyta Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद पाउडर या तने व फलियों पर गोल भूरे धब्बे बनते हैं जिससे दाने सिकुड़ जाते हैं।",
        "whatHi": "सफेद पाउडर जैसी फफूंद व फलियों पर धब्बे जिससे दाने नहीं भरते।",
        "whyHi": [
          "हवा में नमी और रात में ठंडक",
          "घनी बुवाई"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर छिड़कें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम + मैंकोजेब (500 g)",
          "हेक्साकोनाज़ोल 5% EC (300 ml)",
          "कस्टोडिया / एमिस्टार टॉप (200 ml)"
        ],
        "whenToActHi": "पत्तियों पर सफेद धब्बे दिखते ही",
        "tipHi": "फूल अवस्था में सल्फर की अत्यधिक मात्रा से बचें, लिक्विड फंगीसाइड सुरक्षित रहता है।"
      }
    ]
  },
  {
    "slug": "chana",
    "nameHi": "चना",
    "nameEn": "Chickpea (Chana)",
    "emoji": "🫘",
    "image": "/images/crops/chana.jpg",
    "problems": [
      {
        "id": "fusarium-wilt-root-rot",
        "nameHi": "उकठा व जड़ गलन (Fusarium Wilt & Dry Root Rot)",
        "nameEn": "Fusarium Wilt & Dry Root Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौधा ऊपर से नीचे तक पीला होकर सूख जाता है; जड़ को चीरने पर अंदर काली/भूरी लकीर दिखती है।",
        "whatHi": "फसल की शुरुआती अवस्था में जड़ गलन व पूरे पौधे का अचानक सूख जाना।",
        "whyHi": [
          "जमीन में कवक (Fusarium/Rhizoctonia) की मौजूदगी",
          "जलभराव या भारी मिट्टी"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 5 ग्राम/लीटर पानी से जड़ों में ड्रेंचिंग करें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम 50% WP (400 g जड़ों में ड्रेंचिंग)",
          "थायोफेनेट मिथाइल 70% WP (500 g)"
        ],
        "whenToActHi": "शुरुआती लक्षण दिखते ही जड़ों में ड्रेंचिंग करें",
        "tipHi": "हमेशा शाम के समय जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "ymv-whitefly",
        "nameHi": "पीला मोज़ेक वायरस व सफेद मक्खी (YMV & Whitefly)",
        "nameEn": "Yellow Mosaic Virus & Whitefly",
        "tagHi": "वायरस व कीट",
        "image": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (15-40 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियां चमकदार पीली पड़ जाती हैं और फलियां नहीं लगतीं। (सफेद मक्खी रोकें — फंगीसाइड न डालें)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला अत्यंत घातक वायरल रोग जिससे उपज शून्य हो सकती है।",
        "whyHi": [
          "सफेद मक्खी (Bemisia tabaci) का प्रकोप",
          "गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे कार्ड (Yellow Sticky Traps) 15-20 प्रति एकड़ लगाएं",
          "नीम तेल 10,000 PPM 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "थियामेथोक्सम 25% WG (100 g)",
          "पायरीप्रॉक्सीफेन + बाइफेन्थ्रिन (250 ml)"
        ],
        "whenToActHi": "सफेद मक्खी दिखते ही तत्काल स्प्रे करें",
        "tipHi": "वायरस का कोई फंगीसाइड इलाज नहीं है, केवल सफेद मक्खी (वेक्टर) को मारकर ही फैलाव रुकता है।"
      },
      {
        "id": "flower-thrips-aphid",
        "nameHi": "फूल के थ्रिप्स व माहू (Flower Thrips & Aphids)",
        "nameEn": "Flower Thrips & Aphids",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "फूल अवस्था (30-50 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "फूलों के अंदर घुसकर रस चूसते हैं जिससे फूल बिना फली बने झड़ जाते हैं।",
        "whatHi": "फूलों से रस चूसकर फलियों के बनने की प्रक्रिया को पूरी तरह नष्ट करने वाले बारीक कीट।",
        "whyHi": [
          "फूल खिलते समय शुष्क मौसम",
          "पास के खेतों से कीटों का स्थानांतरण"
        ],
        "cureOrganicHi": [
          "नीली चिपचिपी पट्टियां (Blue Sticky Traps) लगाएं",
          "नीम तेल 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "इमिडाक्लोप्रिड 17.8% SL (100 ml)",
          "फिप्रोनिल 5% SC (300 ml)",
          "स्पिनेटोरम 11.7% SC (120 ml)"
        ],
        "whenToActHi": "फूल खिलने से ठीक पहले या शुरुआती फूल अवस्था में",
        "tipHi": "फूल झड़ने से रोकने के लिए सुबह के समय स्प्रे करें जब मधुमक्खियां कम सक्रिय हों।"
      },
      {
        "id": "pod-borer",
        "nameHi": "फली छेदक व जाले वाली इल्ली (Pod Borer - Helicoverpa & Maruca)",
        "nameEn": "Pod Borer (Helicoverpa & Maruca)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फूल व फली अवस्था (40+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "Maruca फूलों और फलियों को रेशमी जाले से बांधकर खाती है; Helicoverpa फली में गोल छेद कर दाने खा जाती है।",
        "whatHi": "दलहनी फसलों की सबसे विनाशकारी सुंडी जो सीधे फलियों और दानों को चट कर जाती है।",
        "whyHi": [
          "मौसम में नमी और बादल छाना",
          "फूल व फली का अधिक बनना"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Helilure) 5 प्रति एकड़ लगाएं",
          "बैसिलस थुरिंजिएंसिस (BT) 2 ग्राम/लीटर"
        ],
        "cureChemicalHi": [
          "इमामेक्टिन बेंजोएट 5% SG (100 g)",
          "कोराजन 18.5% SC (60 ml)"
        ],
        "whenToActHi": "फूलों में जाले दिखते ही या 5% फलियों में छेद दिखने पर",
        "tipHi": "हमेशा शाम के समय स्प्रे करें जब इल्लियां बाहर निकलकर खाती हैं।"
      },
      {
        "id": "powdery-ascochyta",
        "nameHi": "चूर्णी फफूंद व एस्कोकाइटा झुलसा (Powdery Mildew & Ascochyta Blight)",
        "nameEn": "Powdery Mildew & Ascochyta Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद पाउडर या तने व फलियों पर गोल भूरे धब्बे बनते हैं जिससे दाने सिकुड़ जाते हैं।",
        "whatHi": "सफेद पाउडर जैसी फफूंद व फलियों पर धब्बे जिससे दाने नहीं भरते।",
        "whyHi": [
          "हवा में नमी और रात में ठंडक",
          "घनी बुवाई"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर छिड़कें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम + मैंकोजेब (500 g)",
          "हेक्साकोनाज़ोल 5% EC (300 ml)",
          "कस्टोडिया / एमिस्टार टॉप (200 ml)"
        ],
        "whenToActHi": "पत्तियों पर सफेद धब्बे दिखते ही",
        "tipHi": "फूल अवस्था में सल्फर की अत्यधिक मात्रा से बचें, लिक्विड फंगीसाइड सुरक्षित रहता है।"
      }
    ]
  },
  {
    "slug": "masoor",
    "nameHi": "मसूर",
    "nameEn": "Lentil (Masoor)",
    "emoji": "🫘",
    "image": "/images/crops/masoor.jpg",
    "problems": [
      {
        "id": "fusarium-wilt-root-rot",
        "nameHi": "उकठा व जड़ गलन (Fusarium Wilt & Dry Root Rot)",
        "nameEn": "Fusarium Wilt & Dry Root Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-fusarium-ciceri-2.jpg",
        "stageHi": "वानस्पतिक अवस्था (10-35 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पौधा ऊपर से नीचे तक पीला होकर सूख जाता है; जड़ को चीरने पर अंदर काली/भूरी लकीर दिखती है।",
        "whatHi": "फसल की शुरुआती अवस्था में जड़ गलन व पूरे पौधे का अचानक सूख जाना।",
        "whyHi": [
          "जमीन में कवक (Fusarium/Rhizoctonia) की मौजूदगी",
          "जलभराव या भारी मिट्टी"
        ],
        "cureOrganicHi": [
          "ट्राइकोडर्मा 5 ग्राम/लीटर पानी से जड़ों में ड्रेंचिंग करें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम 50% WP (400 g जड़ों में ड्रेंचिंग)",
          "थायोफेनेट मिथाइल 70% WP (500 g)"
        ],
        "whenToActHi": "शुरुआती लक्षण दिखते ही जड़ों में ड्रेंचिंग करें",
        "tipHi": "हमेशा शाम के समय जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "ymv-whitefly",
        "nameHi": "पीला मोज़ेक वायरस व सफेद मक्खी (YMV & Whitefly)",
        "nameEn": "Yellow Mosaic Virus & Whitefly",
        "tagHi": "वायरस व कीट",
        "image": "/images/diseases/disease-mungbean-yellow-mosaic-virus-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (15-40 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियां चमकदार पीली पड़ जाती हैं और फलियां नहीं लगतीं। (सफेद मक्खी रोकें — फंगीसाइड न डालें)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलाया जाने वाला अत्यंत घातक वायरल रोग जिससे उपज शून्य हो सकती है।",
        "whyHi": [
          "सफेद मक्खी (Bemisia tabaci) का प्रकोप",
          "गर्म व सूखा मौसम"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे कार्ड (Yellow Sticky Traps) 15-20 प्रति एकड़ लगाएं",
          "नीम तेल 10,000 PPM 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "थियामेथोक्सम 25% WG (100 g)",
          "पायरीप्रॉक्सीफेन + बाइफेन्थ्रिन (250 ml)"
        ],
        "whenToActHi": "सफेद मक्खी दिखते ही तत्काल स्प्रे करें",
        "tipHi": "वायरस का कोई फंगीसाइड इलाज नहीं है, केवल सफेद मक्खी (वेक्टर) को मारकर ही फैलाव रुकता है।"
      },
      {
        "id": "flower-thrips-aphid",
        "nameHi": "फूल के थ्रिप्स व माहू (Flower Thrips & Aphids)",
        "nameEn": "Flower Thrips & Aphids",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "फूल अवस्था (30-50 दिन)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "फूलों के अंदर घुसकर रस चूसते हैं जिससे फूल बिना फली बने झड़ जाते हैं।",
        "whatHi": "फूलों से रस चूसकर फलियों के बनने की प्रक्रिया को पूरी तरह नष्ट करने वाले बारीक कीट।",
        "whyHi": [
          "फूल खिलते समय शुष्क मौसम",
          "पास के खेतों से कीटों का स्थानांतरण"
        ],
        "cureOrganicHi": [
          "नीली चिपचिपी पट्टियां (Blue Sticky Traps) लगाएं",
          "नीम तेल 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "इमिडाक्लोप्रिड 17.8% SL (100 ml)",
          "फिप्रोनिल 5% SC (300 ml)",
          "स्पिनेटोरम 11.7% SC (120 ml)"
        ],
        "whenToActHi": "फूल खिलने से ठीक पहले या शुरुआती फूल अवस्था में",
        "tipHi": "फूल झड़ने से रोकने के लिए सुबह के समय स्प्रे करें जब मधुमक्खियां कम सक्रिय हों।"
      },
      {
        "id": "pod-borer",
        "nameHi": "फली छेदक व जाले वाली इल्ली (Pod Borer - Helicoverpa & Maruca)",
        "nameEn": "Pod Borer (Helicoverpa & Maruca)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-helicoverpa-armigera-2.jpg",
        "stageHi": "फूल व फली अवस्था (40+ दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "Maruca फूलों और फलियों को रेशमी जाले से बांधकर खाती है; Helicoverpa फली में गोल छेद कर दाने खा जाती है।",
        "whatHi": "दलहनी फसलों की सबसे विनाशकारी सुंडी जो सीधे फलियों और दानों को चट कर जाती है।",
        "whyHi": [
          "मौसम में नमी और बादल छाना",
          "फूल व फली का अधिक बनना"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Helilure) 5 प्रति एकड़ लगाएं",
          "बैसिलस थुरिंजिएंसिस (BT) 2 ग्राम/लीटर"
        ],
        "cureChemicalHi": [
          "इमामेक्टिन बेंजोएट 5% SG (100 g)",
          "कोराजन 18.5% SC (60 ml)"
        ],
        "whenToActHi": "फूलों में जाले दिखते ही या 5% फलियों में छेद दिखने पर",
        "tipHi": "हमेशा शाम के समय स्प्रे करें जब इल्लियां बाहर निकलकर खाती हैं।"
      },
      {
        "id": "powdery-ascochyta",
        "nameHi": "चूर्णी फफूंद व एस्कोकाइटा झुलसा (Powdery Mildew & Ascochyta Blight)",
        "nameEn": "Powdery Mildew & Ascochyta Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद पाउडर या तने व फलियों पर गोल भूरे धब्बे बनते हैं जिससे दाने सिकुड़ जाते हैं।",
        "whatHi": "सफेद पाउडर जैसी फफूंद व फलियों पर धब्बे जिससे दाने नहीं भरते।",
        "whyHi": [
          "हवा में नमी और रात में ठंडक",
          "घनी बुवाई"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर छिड़कें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम + मैंकोजेब (500 g)",
          "हेक्साकोनाज़ोल 5% EC (300 ml)",
          "कस्टोडिया / एमिस्टार टॉप (200 ml)"
        ],
        "whenToActHi": "पत्तियों पर सफेद धब्बे दिखते ही",
        "tipHi": "फूल अवस्था में सल्फर की अत्यधिक मात्रा से बचें, लिक्विड फंगीसाइड सुरक्षित रहता है।"
      }
    ]
  },
  {
    "slug": "mustard",
    "nameHi": "सरसों",
    "nameEn": "Mustard",
    "emoji": "🌼",
    "image": "/images/crops/mustard.jpg",
    "problems": [
      {
        "id": "painted-bug-sawfly",
        "nameHi": "चितकबरा कीट व आरा मक्खी (Painted Bug & Mustard Sawfly)",
        "nameEn": "Painted Bug & Mustard Sawfly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-bagrada-hilaris-2.jpg",
        "stageHi": "अंकुरण व वानस्पतिक (5-25 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "काले-नारंगी धब्बेदार बग छोटे पौधों का रस चूसकर उन्हें सुखा देते हैं; आरा मक्खी की काली सुंडी पत्तियों में छेद करती है।",
        "whatHi": "सरसों के अंकुरण के तुरंत बाद आने वाले विनाशकारी कीट जो पूरी पौध को चट कर जाते हैं।",
        "whyHi": [
          "बुवाई के समय तापमान 30-35 डिग्री रहना",
          "खेत की मेड़ों पर खरपतवार"
        ],
        "cureOrganicHi": [
          "सुबह के समय कीड़ों को हाथ से पकड़कर नष्ट करें",
          "नीम तेल 5 मिली/लीटर छिड़कें"
        ],
        "cureChemicalHi": [
          "क्विनालफॉस 25% EC (350 ml)",
          "इमिडाक्लोप्रिड + साइपरमेथ्रिन (100+100 ml)",
          "एम्पलीगो / अलिका (80 ml)"
        ],
        "whenToActHi": "अंकुरण के 7-10 दिन बाद कीट दिखते ही",
        "tipHi": "सुबह जल्दी स्प्रे करें जब कीट सुस्त अवस्था में पत्तियों पर बैठे हों।"
      },
      {
        "id": "white-rust-alternaria",
        "nameHi": "सफेद रतुआ व अल्टरनेरिया झुलसा (White Rust & Alternaria Blight)",
        "nameEn": "White Rust & Alternaria Blight",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-albugo-candida-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (35-65 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों के नीचे सफेद चूने जैसे फफोले बनते हैं और ऊपरी फली की टहनी फूलकर मोटी व टेढ़ी (Staghead) हो जाती है।",
        "whatHi": "सरसों की पत्तियों पर सफेद फफोले व भूरे छल्लेदार धब्बे जिससे तना हिरण के सींग जैसा टेढ़ा हो जाता है।",
        "whyHi": [
          "दिसंबर-जनवरी में घना कोहरा व ओस",
          "तापमान 12-18 डिग्री सेल्सियस"
        ],
        "cureOrganicHi": [
          "खेत में जलभराव न होने दें",
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर"
        ],
        "cureChemicalHi": [
          "मैंकोजेब 75% WP (600 g)",
          "रिडोमिल गोल्ड (500 g)",
          "एमिस्टार टॉप (200 ml)"
        ],
        "whenToActHi": "पत्तियों पर सफेद दाने या निचली पत्तियों पर धब्बे दिखते ही",
        "tipHi": "दिसंबर के अंतिम सप्ताह में पहला सुरक्षात्मक छिड़काव अवश्य करें।"
      },
      {
        "id": "sclerotinia-rot",
        "nameHi": "तना गलन / पोलियो रोग (Sclerotinia Stem Rot)",
        "nameEn": "Sclerotinia Stem Rot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-sclerotinia-sclerotiorum.jpg",
        "stageHi": "फूल व फली अवस्था (50-80 दिन)",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "तने पर सफेद रुई जैसी फफूंद लगती है, तने के अंदर काले चूहे की मेंगनी जैसे दाने (Sclerotia) बनते हैं और पौधा बीच से टूटकर सूख जाता है।",
        "whatHi": "सरसों का तना बीच से सफेद होकर खोखला हो जाता है और तेज हवा में टूटकर गिर जाता है।",
        "whyHi": [
          "सिंचाई के बाद खेत में ज्यादा दिन नमी रहना",
          "घनी बुवाई व जमीन में फफूंद के अवशेष"
        ],
        "cureOrganicHi": [
          "खेत की गहरी जुताई करें",
          "ट्राइकोडर्मा 1 किग्रा प्रति एकड़ गोबर खाद में मिलाकर दें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम 50% WP (400 g)",
          "टेबुकोनाज़ोल 25.9% EC (250 ml)",
          "कस्टोडिया / कैब्रियो टॉप (250 ml)"
        ],
        "whenToActHi": "तने पर सफेद धब्बे दिखने के तुरंत बाद",
        "tipHi": "स्प्रे का नोजल सीधे तने के निचले हिस्से की तरफ रखकर छिड़काव करें।"
      },
      {
        "id": "mustard-aphid",
        "nameHi": "चेपा / माहू (Mustard Aphid - सबसे मुख्य)",
        "nameEn": "Mustard Aphid",
        "tagHi": "कीट",
        "image": "/images/pests/pest-lipaphis-erysimi-2.jpg",
        "stageHi": "फूल व फली अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "फूलों की टहनियों और फलियों पर हरे-पीले माहू की मोटी परत जम जाती है जो सारा रस चूस लेती है।",
        "whatHi": "सरसों का सबसे घातक कीट, अनुकूल मौसम में 3-4 दिन में पूरी फसल की फलियों को सूखा देता है।",
        "whyHi": [
          "बादल छाना और हवा में ठंडक",
          "पछुआ हवा चलना"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे कार्ड 20 प्रति एकड़ लगाएं",
          "नीम तेल 3-5 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "डाइमेथोएट 30% EC (रोगोर - 300 ml)",
          "थियामेथोक्सम 25% WG (80 g)",
          "फ्लोनिकामिड 50% WG (उलाला - 60 g)"
        ],
        "whenToActHi": "टहनी पर 10-15 माहू दिखते ही तुरंत पहला छिड़काव करें",
        "tipHi": "माहू का प्रजनन बहुत तेज होता है, देरी करने पर फलियों में दाने नहीं बनेंगे।"
      }
    ]
  },
  {
    "slug": "bhindi",
    "nameHi": "भिंडी",
    "nameEn": "Okra (Bhindi)",
    "emoji": "🟢",
    "image": "/images/crops/bhindi.jpg",
    "problems": [
      {
        "id": "damping-off",
        "nameHi": "पौध गलन (Damping-off)",
        "nameEn": "Damping-off",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-damping-off-2.jpg",
        "stageHi": "अंकुरण व वानस्पतिक (5-25 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "शुरुआती पौध की जड़ व तने का निचला हिस्सा गलकर पौधा गिर जाता है और सूख जाता है।",
        "whatHi": "बीज अंकुरण के बाद तने के निचले हिस्से का सड़ना और पौध का मर जाना।",
        "whyHi": [
          "खेत में अधिक नमी या जलभराव",
          "कवक ग्रसित बीज व मिट्टी"
        ],
        "cureOrganicHi": [
          "बीजोपचार ट्राइकोडर्मा 10 ग्राम/किग्रा बीज करें",
          "खेत में पानी न भरने दें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम 50% WP (300 g)",
          "रिडोमिल गोल्ड (400 g)",
          "कस्टोडिया (200 ml)"
        ],
        "whenToActHi": "अंकुरण के बाद शुरुआती पौध में",
        "tipHi": "हमेशा शाम को जड़ों के पास ड्रेंचिंग करें।"
      },
      {
        "id": "jassid-whitefly",
        "nameHi": "हरा तेला व सफेद मक्खी (Jassid & Whitefly)",
        "nameEn": "Jassid & Whitefly",
        "tagHi": "कीट",
        "image": "/images/pests/pest-amrasca-biguttula-2.jpg",
        "stageHi": "वानस्पतिक व फूल अवस्था (15-45 दिन)",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्ती के किनारे नीचे मुड़कर पीले पड़ते हैं और सफेद मक्खी वायरस फैलाती है।",
        "whatHi": "भिंडी के पत्तों का रस चूसने वाले कीट जिससे पत्ते कप जैसे उल्टे मुड़ जाते हैं (Hopper Burn)।",
        "whyHi": [
          "गर्म व शुष्क मौसम",
          "पास की फसलों से कीटों का प्रकोप"
        ],
        "cureOrganicHi": [
          "पीले चिपचिपे कार्ड 15-20 प्रति एकड़ लगाएं",
          "नीम तेल 10,000 PPM 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "थियामेथोक्सम 25% WG (80 g)",
          "फ्लोनिकामिड 50% WG (उलाला - 60 g)",
          "डायाफेन्थियूरॉन 50% WP (200 g)"
        ],
        "whenToActHi": "पत्ती के नीचे 2-3 कीड़े दिखते ही",
        "tipHi": "पत्तियों के निचली सतह पर अच्छी तरह फुहारा पहुंचाएं।"
      },
      {
        "id": "ymv",
        "nameHi": "पीली नस मोज़ेक वायरस (YVMV) व एनैशन लीफ कर्ल",
        "nameEn": "Yellow Vein Mosaic Virus (YVMV) & Enation Leaf Curl",
        "tagHi": "वायरस (सफेद मक्खी वेक्टर)",
        "image": "/images/diseases/disease-bhendi-yvmv-2.jpg",
        "stageHi": "वानस्पतिक व फल अवस्था",
        "stages": [
          "vegetative",
          "fruiting"
        ],
        "specialFactHi": "पत्ती की सभी नसें पीली पड़ जाती हैं और फल पीले-कड़े हो जाते हैं। (केवल वेक्टर सफेद मक्खी मारें + वायरस रोधक, फंगीसाइड न डालें)",
        "isVirus": true,
        "whatHi": "सफेद मक्खी द्वारा फैलने वाला भिंडी का सबसे घातक वायरस, फल और पत्तियां पूरी पीली होकर कड़ी हो जाती हैं।",
        "whyHi": [
          "सफेद मक्खी (Bemisia tabaci) द्वारा वायरस का संचार",
          "संक्रमित पौधों को खेत में छोड़ना"
        ],
        "cureOrganicHi": [
          "रोगी पौधों को उखाड़कर तुरंत जमीन में गाड़ दें",
          "पीले कार्ड लगाएं"
        ],
        "cureChemicalHi": [
          "एसिटामिप्रिड + नीम तेल",
          "पायरीप्रॉक्सीफेन + बाइफेन्थ्रिन (250 ml)",
          "डायाफेन्थियूरॉन 47.8% SC (200 ml) + सीवीड"
        ],
        "whenToActHi": "खेत में एक भी पौधा पीला दिखते ही तत्काल वेक्टर को मारें",
        "tipHi": "वायरस पर किसी भी फफूंदनाशक का कोई असर नहीं होता, केवल सफेद मक्खी नियंत्रण और बायो-इम्यूनिटी ही बचाव है।"
      },
      {
        "id": "fruit-borer",
        "nameHi": "प्ररोह व फल छेदक (Shoot & Fruit Borer - Earias)",
        "nameEn": "Shoot & Fruit Borer (Earias)",
        "tagHi": "कीट",
        "image": "/images/pests/pest-earias-vittella-2.jpg",
        "stageHi": "फल व तुड़ाई अवस्था (35+ दिन)",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "चित्तीदार सुंडी जो शुरुआती शाखाओं के सिरे सुखाती है और बाद में भिंडी में छेद कर उसे टेढ़ा कर देती है।",
        "whatHi": "भिंडी की मुख्य इल्ली जो तनों और फलों में छेद करके अंदर का गूदा खाती है और विष्ठा भर देती है।",
        "whyHi": [
          "मौसम में गर्मी और नमी",
          "तुड़ाई में देरी"
        ],
        "cureOrganicHi": [
          "फेरोमोन ट्रैप (Earias lure) 5 प्रति एकड़ लगाएं",
          "नीम तेल 5 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "इमामेक्टिन बेंजोएट 5% SG (100 g)",
          "कोराजन 18.5% SC (60 ml)",
          "स्पिनेटोरम 11.7% SC (150 ml)"
        ],
        "whenToActHi": "शाखाओं के सिरे मुरझाते ही या फल में छेद दिखते ही",
        "tipHi": "स्प्रे करने के बाद PHI (प्रतीक्षा अवधि) का ध्यान रखें, तुड़ाई से 3 दिन पहले तक हैवी केमिकल न डालें।"
      },
      {
        "id": "red-spider-mite",
        "nameHi": "लाल मकड़ी (Red Spider Mite)",
        "nameEn": "Red Spider Mite",
        "tagHi": "माइट्स (मकड़ी)",
        "image": "/images/pests/pest-tetranychus-urticae.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के नीचे बारीक लाल मकड़ी और जाले; पत्ती सफेद-भूरी होकर सूख जाती है।",
        "whatHi": "पत्तियों की निचली सतह से रस चूसने वाली अति सूक्ष्म मकड़ी जो जाले बना देती है।",
        "whyHi": [
          "गर्म और सूखा मौसम (32°C से ऊपर)",
          "खेत में धूल जमना"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर",
          "तेज धार से पानी का छिड़काव करें"
        ],
        "cureChemicalHi": [
          "फेनाज़ाक्विन 10% EC (300 ml)",
          "स्पाइरोमेसिफेन 22.9% SC (ओबेरॉन - 200 ml)",
          "एटोक्साज़ोल 10% SC (बोर्नियो - 160 ml)"
        ],
        "whenToActHi": "पत्तियों की निचली सतह पर जाले दिखते ही",
        "tipHi": "साधारण कीटनाशक मकड़ी पर काम नहीं करते, इसके लिए केवल विशिष्ट माइटिसाइड ही इस्तेमाल करें।"
      },
      {
        "id": "powdery-mildew",
        "nameHi": "सफेद चूर्ण रोग व सर्कोस्पोरा धब्बा (Powdery Mildew & Leaf Spot)",
        "nameEn": "Powdery Mildew & Cercospora Leaf Spot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-podosphaera-xanthii-2.jpg",
        "stageHi": "फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "पुरानी व बीच की पत्तियों पर सफेद चूर्ण की परत या धब्बे बनते हैं जिससे पत्ते सूखकर गिर जाते हैं।",
        "whatHi": "पत्तियों पर सफेद पाउडर जैसी फफूंद जमना जिससे प्रकाश संश्लेषण रुक जाता है।",
        "whyHi": [
          "हवा में नमी और तापमान में उतार-चढ़ाव",
          "फसल की परिपक्व अवस्था"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर"
        ],
        "cureChemicalHi": [
          "साफ (500 g)",
          "कंटाफ 5% SC (300 ml)",
          "एमिस्टार टॉप (200 ml)"
        ],
        "whenToActHi": "निचली पत्तियों पर सफेद पाउडर या धब्बे दिखते ही",
        "tipHi": "तुड़ाई के तुरंत बाद स्प्रे करें ताकि अगली तुड़ाई तक दवा का असर धुल जाए।"
      }
    ]
  },
  {
    "slug": "ginger",
    "nameHi": "अदरक",
    "nameEn": "Ginger",
    "emoji": "🫚",
    "image": "/images/crops/ginger.jpg",
    "problems": [
      {
        "id": "shoot-borer",
        "nameHi": "प्ररोह छेदक सुंडी (Shoot Borer)",
        "nameEn": "Shoot Borer",
        "tagHi": "कीट",
        "image": "/images/pests/pest-conogethes-punctiferalis.jpg",
        "stageHi": "वानस्पतिक अवस्था (40-90 दिन)",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "सुंडी तने के अंदर छेद करती है जिससे बीच की गोभ सूख जाती है (Dead Heart)।",
        "whatHi": "अदरक के तने के अंदर घुसकर खाने वाली इल्ली जिससे पौधा पीला होकर सूख जाता है।",
        "whyHi": [
          "मानसून के बाद नमी और गर्मी",
          "खेत के आसपास अरंडी या अन्य मेजबान पौधे"
        ],
        "cureOrganicHi": [
          "सूखे तनों को काटकर इल्ली सहित नष्ट करें",
          "नीम तेल 3-5 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "क्लोरोपायरीफॉस 20% EC (500 ml)",
          "लैम्ब्डा-साइहेलोथ्रिन 5% EC (250 ml)",
          "कोराजन 18.5% SC (80 ml)"
        ],
        "whenToActHi": "गोभ सूखने के शुरुआती लक्षण दिखते ही",
        "tipHi": "छिड़काव के समय पत्तियों और तने के जोड़ (Axil) को अच्छी तरह भिगोएं।"
      },
      {
        "id": "rhizome-rot",
        "nameHi": "प्रकंद मृदु सड़न (Rhizome Soft Rot - Pythium)",
        "nameEn": "Rhizome Soft Rot (Pythium)",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-erwinia.jpg",
        "stageHi": "गांठ बनने की अवस्था (60-120 दिन)",
        "stages": [
          "vegetative",
          "fruiting"
        ],
        "specialFactHi": "निचली पत्तियों के किनारे पीले होकर सूखते हैं और अदरक की गांठ पानी जैसी बदबूदार सड़ती है। (जड़ों में ड्रेंचिंग)",
        "whatHi": "अदरक की फसल का सबसे विनाशकारी रोग, गांठें अंदर से पानी की तरह सड़ जाती हैं।",
        "whyHi": [
          "भारी बारिश में जलभराव व खराब जल निकासी",
          "कवक ग्रसित बीज प्रकंद"
        ],
        "cureOrganicHi": [
          "खेत से पानी की तुरंत निकासी करें",
          "ट्राइकोडर्मा 2 किग्रा प्रति एकड़ ड्रेंचिंग करें"
        ],
        "cureChemicalHi": [
          "कॉपर ऑक्सीक्लोराइड 50% WP (800 g)",
          "रिडोमिल गोल्ड (500 g)",
          "सेक्टिन 60% WG (600 g) या एलियेट (500 g)"
        ],
        "whenToActHi": "पत्तियों के किनारे पीले पड़ते ही तत्काल ड्रेंचिंग करें",
        "tipHi": "इस रोग में पत्तियों पर स्प्रे काम नहीं करता, पौधों की जड़ों और गांठों पर धार से ड्रेंचिंग जरूरी है।"
      },
      {
        "id": "bacterial-wilt",
        "nameHi": "जीवाणु उकठा (Bacterial Wilt - Ralstonia)",
        "nameEn": "Bacterial Wilt (Ralstonia)",
        "tagHi": "जीवाणु (बैक्टीरिया)",
        "image": "/images/diseases/disease-ralstonia-solanacearum-2.jpg",
        "stageHi": "गांठ अवस्था",
        "stages": [
          "vegetative",
          "fruiting"
        ],
        "specialFactHi": "पत्तियां हरी रहते हुए नीचे की ओर मुड़कर अचानक मुरझा जाती हैं; तना दबाने पर दूधिया गंदा पानी निकलता है। (ड्रेंचिंग)",
        "whatHi": "बैक्टीरिया से होने वाला उकठा जिसमें पौधे हरे-भरे ही 24 घंटे में लटक जाते हैं और सड़ने लगते हैं।",
        "whyHi": [
          "मिट्टी में राल्सटोनिया जीवाणु की मौजूदगी",
          "उच्च तापमान और अत्यधिक आर्द्रता"
        ],
        "cureOrganicHi": [
          "खेत में चूना या ब्लीचिंग पाउडर 5-10 किग्रा नाली में डालें",
          "संक्रमित पौधे निकालें"
        ],
        "cureChemicalHi": [
          "कॉपर हाइड्रॉक्साइड + स्ट्रेप्टोसाइक्लिन",
          "कासुगामाइसिन + कॉपर ऑक्सीक्लोराइड",
          "कासु-बी + ब्लीचिंग पाउडर"
        ],
        "whenToActHi": "एक भी पौधा मुरझाया दिखते ही पूरे खेत में ड्रेंचिंग करें",
        "tipHi": "संक्रमित पौधों के आसपास की मिट्टी में ब्लीचिंग पाउडर डालने से जीवाणु आगे नहीं फैलता।"
      },
      {
        "id": "leaf-spot",
        "nameHi": "पत्ती धब्बा (Phyllosticta Leaf Spot)",
        "nameEn": "Phyllosticta Leaf Spot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-cercospora-canescens-2.jpg",
        "stageHi": "वानस्पतिक व गांठ अवस्था",
        "stages": [
          "vegetative",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों पर सफेद-भूरे कागज जैसे धब्बे जिनके बीच में काले बारीक बिंदु होते हैं।",
        "whatHi": "पत्तियों पर सूखने वाले धब्बे जिससे पत्ती का हरा भाग खत्म हो जाता है और अदरक का आकार छोटा रह जाता है।",
        "whyHi": [
          "बारिश के मौसम में लगातार बादल और आर्द्रता"
        ],
        "cureOrganicHi": [
          "खेत को खरपतवार मुक्त रखें",
          "नीम अर्क का छिड़काव"
        ],
        "cureChemicalHi": [
          "मैंकोजेब 75% WP (600 g)",
          "प्रोपिकोनाज़ोल 25% EC (200 ml)",
          "एमिस्टार टॉप (200 ml)"
        ],
        "whenToActHi": "पत्तियों पर छोटे धब्बे दिखते ही",
        "tipHi": "छिड़काव में स्टिकर (स्प्रेडर) अवश्य मिलाएं ताकि बारिश में दवा धुले नहीं।"
      }
    ]
  },
  {
    "slug": "mango",
    "nameHi": "आम",
    "nameEn": "Mango",
    "emoji": "🥭",
    "image": "/images/crops/mango.jpg",
    "problems": [
      {
        "id": "mango-hopper",
        "nameHi": "भुनगा / हॉपर (Mango Hopper)",
        "nameEn": "Mango Hopper",
        "tagHi": "कीट",
        "image": "/images/pests/pest-idioscopus-clypealis.jpg",
        "stageHi": "आम - बौर अवस्था (Flowering)",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "बौर और कोमल पत्तियों का रस चूसते हैं, चलने पर \"चट-चट\" की आवाज आती है और बौर पर काला चिपचिपा पदार्थ जम जाता है। (प्रति लीटर पानी)",
        "whatHi": "आम के बौर का सबसे मुख्य शत्रु कीट, जो सारा रस चूसकर बौर को सुखा देता है और फल नहीं बनने देता।",
        "whyHi": [
          "फरवरी-मार्च में बौर आने के समय उमस व गर्मी",
          "पेड़ के अंदर घनी टहनियां"
        ],
        "cureOrganicHi": [
          "पेड़ की सूखी व घनी टहनियों की छंटाई करें",
          "नीम तेल 3 मिली/लीटर छिड़कें"
        ],
        "cureChemicalHi": [
          "इमिडाक्लोप्रिड 17.8% SL (0.4 ml/L)",
          "थियामेथोक्सम 25% WG (0.3 g/L)",
          "डिनोटिफ्यूरान 20% SG (0.4 g/L)"
        ],
        "whenToActHi": "बौर निकलने के शुरुआती समय या फूल खिलने से पहले",
        "tipHi": "फूल पूरी तरह खिलने के बाद जब मधुमक्खियां आएं तो कीटनाशक का भारी छिड़काव न करें।"
      },
      {
        "id": "powdery-mildew",
        "nameHi": "खर्रा / दहिया रोग (Powdery Mildew)",
        "nameEn": "Powdery Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-oidium-mangiferae-2.jpg",
        "stageHi": "आम - बौर अवस्था",
        "stages": [
          "flowering"
        ],
        "specialFactHi": "बौर के डंठल और छोटे फलों पर सफेद पाउडर जमता है जिससे सारा बौर झड़ जाता है। (प्रति लीटर पानी)",
        "whatHi": "बौर और छोटी अमिया पर सफेद चूर्ण की परत जमना जिससे बौर काला पड़कर गिर जाता है।",
        "whyHi": [
          "रात में ठंडक और दिन में तेज धूप (तापमान में अंतर)",
          "हवा में नमी"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WP 2 ग्राम/लीटर छिड़कें"
        ],
        "cureChemicalHi": [
          "घुलनशील सल्फर (2 g/L)",
          "हेक्साकोनाज़ोल 5% SC (1.5 ml/L)",
          "नेटिवो 75% WG (0.5 g/L)"
        ],
        "whenToActHi": "बौर पर हल्का सफेद पाउडर दिखते ही",
        "tipHi": "दहिया रोग के लिए पहला सुरक्षात्मक स्प्रे बौर खिलने से पहले ही कर लें।"
      },
      {
        "id": "anthracnose-fruit-fly",
        "nameHi": "एन्थ्रेक्नोज व फल मक्खी (Anthracnose & Fruit Fly)",
        "nameEn": "Anthracnose & Fruit Fly",
        "tagHi": "फफूंद व कीट",
        "image": "/images/diseases/disease-colletotrichum-gloeosporioides-2.jpg",
        "stageHi": "आम - फल अवस्था",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "आम पर काले धब्बे और पकते समय फल मक्खी के डंक से अंदर इल्लियां पड़ना।",
        "whatHi": "फलों पर काले धब्बे पड़ना और फल मक्खी द्वारा डंक मारने से आम का अंदर से सड़ना।",
        "whyHi": [
          "मानसून की बारिश और उमस",
          "फल मक्खी (Bactrocera dorsalis) का प्रकोप"
        ],
        "cureOrganicHi": [
          "मिथाइल यूजेनॉल ट्रैप (Fruit Fly Trap) 8-10 प्रति एकड़ लगाएं",
          "गिरे फलों को जमीन में गाड़ें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम + मैंकोजेब (2 g/L)",
          "एमिस्टार टॉप + डेल्टामेथ्रिन",
          "पायराक्लोस्ट्रोबिन + स्पिनोसैड"
        ],
        "whenToActHi": "फल मटर के दाने से बड़ा होते ही व पकने के 30 दिन पहले",
        "tipHi": "फल मक्खी के लिए कीटनाशक का अंधाधुंध छिड़काव न करें, फेरोमोन ट्रैप सबसे असरदार समाधान है।"
      }
    ]
  },
  {
    "slug": "banana",
    "nameHi": "केला",
    "nameEn": "Banana",
    "emoji": "🍌",
    "image": "/images/crops/banana.jpg",
    "problems": [
      {
        "id": "panama-wilt",
        "nameHi": "पनामा उकठा व इरविनिया सड़न (Panama Wilt & Head Rot)",
        "nameEn": "Panama Wilt & Head Rot",
        "tagHi": "फफूंद व जीवाणु",
        "image": "/images/diseases/disease-fusarium-cubense-2.jpg",
        "stageHi": "केला - वानस्पतिक अवस्था",
        "stages": [
          "vegetative"
        ],
        "specialFactHi": "पुरानी पत्तियां किनारे से पीली होकर डंठल से टूटकर लटक जाती हैं, तना नीचे से सड़ता है। (जड़ों में ड्रेंचिंग)",
        "whatHi": "केले का सबसे घातक विल्ट रोग जिसमें पत्तियां नीचे लटककर सूख जाती हैं और तना चीरने पर लाल-भूरे निशान दिखते हैं।",
        "whyHi": [
          "फ्यूजेरियम कवक (Fusarium oxysporum f. sp. cubense) की उपस्थिति",
          "जलभराव व खराब ड्रेनेज"
        ],
        "cureOrganicHi": [
          "रोग ग्रसित पौधों को चूना डालकर नष्ट करें",
          "ट्राइकोडर्मा 2 किग्रा/एकड़ गोबर खाद में दें"
        ],
        "cureChemicalHi": [
          "कार्बेन्डाजिम + कॉपर ऑक्सीक्लोराइड",
          "प्रोपिकोनाज़ोल + स्ट्रेप्टोसाइक्लिन",
          "कस्टोडिया (1.5 ml/L)"
        ],
        "whenToActHi": "निचली पत्तियों के लटकते ही तुरंत ड्रेंचिंग करें",
        "tipHi": "केले के तने के चारों ओर 1-2 फीट के घेरे में 3-5 लीटर घोल डालकर ड्रेंचिंग करें।"
      },
      {
        "id": "sigatoka",
        "nameHi": "सिगाटोका पत्ती धब्बा (Sigatoka Leaf Spot)",
        "nameEn": "Sigatoka Leaf Spot",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-mycosphaerella-musicola.jpg",
        "stageHi": "केला - वानस्पतिक व घौद अवस्था",
        "stages": [
          "vegetative",
          "fruiting"
        ],
        "specialFactHi": "पत्तियों के किनारों पर पीले-भूरे व काले लंबे धब्बे बनते हैं जिससे पत्ते सूख जाते हैं और घौद का वजन घट जाता है।",
        "whatHi": "केले की पत्तियों का सबसे आम फंगल रोग, पत्तियां जलने जैसी दिखती हैं और घौद छोटी रह जाती है।",
        "whyHi": [
          "बरसात के मौसम में अत्यधिक आर्द्रता (90%+)",
          "घने रोपे गए बाग"
        ],
        "cureOrganicHi": [
          "सूखी व पीली पत्तियों को काटकर तुरंत खेत से बाहर करें",
          "खनिज तेल (Mineral oil) 10 ml/L"
        ],
        "cureChemicalHi": [
          "प्रोपिकोनाज़ोल 25% EC (200 ml) + स्टिकर",
          "नेटिवो 75% WG (120 g)",
          "प्रियाक्सर (120 ml)"
        ],
        "whenToActHi": "पत्तियों पर सिगार जैसी पीली-भूरी धारियां दिखते ही",
        "tipHi": "छिड़काव में मिनरल ऑयल या सिलिकॉन स्टिकर अवश्य मिलाएं, पत्तियों पर मोम जैसी परत होती है।"
      },
      {
        "id": "scarring-beetle-thrips",
        "nameHi": "छिलके का भृंग व थ्रिप्स (Scarring Beetle & Rust Thrips)",
        "nameEn": "Scarring Beetle & Rust Thrips",
        "tagHi": "कीट",
        "image": "/images/pests/pest-chaetanaphothrips-signipennis.jpg",
        "stageHi": "केला - कमल/घौद निकलते समय",
        "stages": [
          "fruiting"
        ],
        "specialFactHi": "नए निकलते केले के छिलके को खुरच देते हैं जिससे केले पर काले चेचक जैसे दाग और जंग जैसे निशान पड़ जाते हैं।",
        "whatHi": "केले के छिलके पर भद्दे काले धब्बे और जंग जैसे निशान बनाने वाले कीट, जिससे बाजार भाव आधा हो जाता है।",
        "whyHi": [
          "कमल (Flower bunch) निकलते समय कीटों का फूलों में छिपना",
          "घौद को न ढकना"
        ],
        "cureOrganicHi": [
          "घौद निकलते ही नीले प्लास्टिक बैग (Bunch Sleeves) से ढकें",
          "नीम तेल 3 मिली/लीटर"
        ],
        "cureChemicalHi": [
          "क्लोरोपायरीफॉस 20% EC (2 ml/L)",
          "एसीफेट 75% SP (1.5 g/L)",
          "स्पिनोसैड 45% SC (0.4 ml/L)"
        ],
        "whenToActHi": "कमल खिलने और फलियां मुड़ने की अवस्था में घौद पर सीधा स्प्रे करें",
        "tipHi": "छिड़काव के 3-5 दिन बाद घौद को छेददार पॉलीथिन बैग से ढक देने पर 100% दाग मुक्त केला तैयार होता है।"
      }
    ]
  },
  {
    "slug": "grapes",
    "nameHi": "अंगूर",
    "nameEn": "Grapes",
    "emoji": "🍇",
    "image": "/images/crops/grapes.jpg",
    "problems": [
      {
        "id": "downy-mildew",
        "nameHi": "डाउनी मिल्ड्यू (Downy Mildew - केवड़ा रोग)",
        "nameEn": "Downy Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-plasmopara-viticola-2.jpg",
        "stageHi": "अंगूर - नई कोपल व फूल अवस्था",
        "stages": [
          "vegetative",
          "flowering"
        ],
        "specialFactHi": "पत्तियों पर तेल जैसे पीले धब्बे (Oil spots) और फूल के गुच्छों पर सफेद फफूंद लगने से गुच्छे सूख जाते हैं।",
        "whatHi": "अंगूर का सबसे विनाशकारी रोग जो 48 घंटे में फूल के पूरे गुच्छों को सुखाकर नष्ट कर सकता है।",
        "whyHi": [
          "छंटाई के बाद बारिश या रात में 90%+ आर्द्रता",
          "तापमान 18-24°C"
        ],
        "cureOrganicHi": [
          "कैनोपी हवादार रखें",
          "बोर्डो मिश्रण 0.5-1% या कॉपर फंगीसाइड का सुरक्षात्मक छिड़काव"
        ],
        "cureChemicalHi": [
          "साइमोक्सानिल + मैंकोजेब (600 g)",
          "डाइमेथोमॉर्फ + मेटिराम (250+500 g)",
          "मैंडीप्रोपामिड 23.4% SC (रेवस - 160 ml)"
        ],
        "whenToActHi": "पत्ती पर तेल जैसे पारदर्शी धब्बे दिखते ही या बारिश की संभावना पर",
        "tipHi": "डाउनी मिल्ड्यू में हमेशा सुरक्षात्मक स्प्रे ही काम करता है, देर होने पर गुच्छे गिर जाते हैं।"
      },
      {
        "id": "powdery-mildew",
        "nameHi": "चूर्णी फफूंद (Powdery Mildew - भुरी रोग)",
        "nameEn": "Powdery Mildew",
        "tagHi": "फफूंद",
        "image": "/images/diseases/disease-uncinula-necator-2.jpg",
        "stageHi": "अंगूर - फूल व बेरी अवस्था",
        "stages": [
          "flowering",
          "fruiting"
        ],
        "specialFactHi": "अंगूर के दानों (Berries) पर सफेद-राख जैसी परत जमती है जिससे दाने काले पड़कर फट जाते हैं (Cracking)।",
        "whatHi": "अंगूर के दानों और पत्तियों पर सफेद राख जैसी फफूंद जमना जिससे फल फट जाते हैं और सड़ जाते हैं।",
        "whyHi": [
          "गर्म और शुष्क मौसम (25-32°C)",
          "हवा में मध्यम नमी और छाया"
        ],
        "cureOrganicHi": [
          "घुलनशील सल्फर 80% WDG 2 ग्राम/लीटर",
          "कैनोपी में धूप का उचित आवागमन"
        ],
        "cureChemicalHi": [
          "माइक्लोब्यूटानिल 10% WP (150 g)",
          "टेट्राकोनाज़ोल 3.8% EW (डोमार्क - 250 ml)",
          "मेट्राफेनोन 50% SC (विवांडो - 100 ml)"
        ],
        "whenToActHi": "बेरी सेटिंग के तुरंत बाद जब दाने मटर के आकार के हों",
        "tipHi": "अंगूर के दानों पर सफेद पाउडर दिखने से पहले ही बेरी अवस्था में सिस्टेमिक स्प्रे आवश्यक है।"
      },
      {
        "id": "thrips-mealybug",
        "nameHi": "थ्रिप्स व मिलीबग (Thrips & Mealybug)",
        "nameEn": "Thrips & Mealybug",
        "tagHi": "कीट",
        "image": "/images/pests/pest-scirtothrips-dorsalis-2.jpg",
        "stageHi": "अंगूर - कोपल व बेरी अवस्था",
        "stages": [
          "vegetative",
          "fruiting"
        ],
        "specialFactHi": "थ्रिप्स से अंगूर के दानों पर खुरदरे भूरे निशान पड़ते हैं; मिलीबग गुच्छों के अंदर घुसकर उन्हें चिपचिपा और काला कर देता है।",
        "whatHi": "अंगूर की गुणवत्ता खराब करने वाले कीट, जिससे अंगूर खुरदरे, काले और चिपचिपे हो जाते हैं।",
        "whyHi": [
          "सूखा व गर्म मौसम",
          "तने की पुरानी छाल में मिलीबग का छिपना"
        ],
        "cureOrganicHi": [
          "तने पर स्टिकी बैंड लगाएं ताकि मिलीबग ऊपर न चढ़े",
          "क्रिप्टोलेमस लेडीबर्ड भृंग छोड़ें"
        ],
        "cureChemicalHi": [
          "फिप्रोनिल 80% WG + बुप्रोफेजिन (40 g + 400 ml)",
          "स्पिनेटोरम 11.7% SC (150 ml)",
          "मोवेन्टो एनर्जी (250 ml)"
        ],
        "whenToActHi": "फूल खिलने से पहले व बेरी विकास के समय",
        "tipHi": "मिलीबग के लिए स्प्रे का दबाव अधिक रखें ताकि दवा छाल के अंदर तक पहुंचे।"
      }
    ]
  }
];


function inferProblemTagHi(meta: CropIdentificationProblemMeta): string {
  if (meta.type === "pest") return "कीट";
  const s = `${meta.problemSlug} ${meta.nameEn} ${meta.nameHi}`.toLowerCase();
  if (/bacterial|xanthomonas|ralstonia|erwinia|जीवाणु/i.test(s)) return "जीवाणु";
  if (/virus|mosaic|curl|बंशी|वायरस/i.test(s)) return "वायरस";
  return "फफूंद";
}

function defaultChemicalsForProblem(meta: CropIdentificationProblemMeta): string[] {
  const s = `${meta.problemSlug} ${meta.nameEn} ${meta.nameHi}`.toLowerCase();
  if (meta.type === "pest") {
    if (/borer|caterpillar|bollworm|spodoptera|heliothis|इल्ली|सुंडी/i.test(s)) {
      return [
        "इमामेक्टिन बेंजोएट 5% SG — लेबल अनुसार",
        "क्लोरएंट्रानिलिप्रोल 18.5% SC — लेबल अनुसार",
      ];
    }
    if (/whitefly|aphid|jassid|thrips|hopper|चूसक|तेला|माहू/i.test(s)) {
      return [
        "थियामेथोक्सम 25% WG / एसिटामिप्रिड 20% SP — लेबल अनुसार",
        "डायफेन्थियूरॉन 50% WP — लेबल अनुसार",
      ];
    }
    if (/mite|मकड़ी/i.test(s)) {
      return [
        "स्पाइरोमेसिफेन 22.9% SC — लेबल अनुसार",
        "घुलनशील गंधक (सल्फर) 80% WDG — लेबल अनुसार",
      ];
    }
    return [
      "इमिडाक्लोप्रिड 17.8% SL — लेबल अनुसार",
      "लैम्ब्डा साइहेलोथ्रिन 5% EC — लेबल अनुसार",
    ];
  }
  if (/mildew|blight|leaf spot|धब्बा|झुलसा/i.test(s)) {
    return [
      "एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC — लेबल अनुसार",
      "मैंकोज़ेब 75% WP / कॉपर ऑक्सीक्लोराइड 50% WP — लेबल अनुसार",
    ];
  }
  if (/wilt|rot|scurf|smut|bunt/i.test(s)) {
    return [
      "कार्बेन्डाजिम / टेबुकोनाज़ोल — लेबल अनुसार",
      "ट्राइकोडर्मा + कॉपर — लेबल अनुसार",
    ];
  }
  return [
    "प्रोपिकोनाज़ोल / टेबुकोनाज़ोल — लेबल अनुसार",
    "मैंकोज़ेब / एज़ोक्सीस्ट्रोबिन — लेबल अनुसार",
  ];
}

function enrichCropProblemCrop(crop: CropProblemCrop): CropProblemCrop {
  // Safe image upgrade: Preserve authentic disk images, only fallback if empty
  const upgradedProblems = crop.problems.map((p) => {
    if (p.image && p.image.length > 5) return p;
    const webp = getCropIdentificationImage(
      crop.slug,
      `${p.id} ${p.nameHi} ${p.nameEn}`
    );
    return webp ? { ...p, image: webp } : p;
  });

  if (upgradedProblems.length === 0) {
    const usedSlugs = new Set<string>();
    const extraProblems = getAllCropIdentificationProblems(crop.slug);

    for (const meta of extraProblems) {
      if (
        usedSlugs.has(meta.problemSlug) ||
        meta.pairedSlugs?.some((sib) => usedSlugs.has(sib))
      ) {
        continue;
      }
      usedSlugs.add(meta.problemSlug);

      const id = meta.problemSlug.replace(/_/g, "-");
      const shortHi = meta.nameHi.replace(/\s*\([^)]+\)\s*$/, "").trim();
      upgradedProblems.push({
        id,
        nameHi: shortHi,
        nameEn: meta.nameEn,
        tagHi: inferProblemTagHi(meta),
        image: meta.imageUrl,
        stageHi: meta.stageHi,
        stages: ["vegetative", "flowering", "fruiting"],
        whatHi: meta.symptomHi,
        whyHi: [
          meta.type === "pest"
            ? "अनुकूल गर्म-आर्द्र मौसम और खेत के पास वैकल्पिक पोषी खरपतवार"
            : "उच्च नमी, मौसम में उतार-चढ़ाव और संवेदनशील किस्म",
          "समय पर शुरुआती निगरानी न होना",
        ],
        cureOrganicHi: [
          "खेत और मेड़ों को खरपतवार मुक्त रखें",
          meta.type === "pest" ? "नीम तेल 10,000 PPM या फेरोमोन/पीला ट्रैप लगाएँ" : "ट्राइकोडर्मा एवं बीज उपचार अपनाएँ",
        ],
        cureChemicalHi: defaultChemicalsForProblem(meta),
        whenToActHi: "शुरुआती लक्षण या ETL दिखते ही",
        tipHi: "सुबह या शाम को साफ़ पानी के साथ छिड़काव करें।",
      });
    }
  }

  return {
    ...crop,
    problems: upgradedProblems,
  };
}

export const CROP_PROBLEM_CROPS: CropProblemCrop[] =
  RAW_CROP_PROBLEM_CROPS.map(enrichCropProblemCrop);

const CROP_PROBLEM_ALIASES: Record<string, string> = {
  tur: "arhar",
  pigeonpea: "arhar",
  gram: "chana",
  chickpea: "chana",
  pulses: "moong",
  moongfali: "groundnut",
  peanut: "groundnut",
  rice: "paddy",
  okra: "bhindi",
  eggplant: "brinjal",
};

export function getCropProblemCrop(slug: string): CropProblemCrop | undefined {
  const norm = slug.trim().toLowerCase();
  const mapped = CROP_PROBLEM_ALIASES[norm] ?? norm;
  return CROP_PROBLEM_CROPS.find((c) => c.slug === mapped || c.slug === norm);
}

export function getCropProblem(
  cropSlug: string,
  problemId: string
): { crop: CropProblemCrop; problem: CropProblemItem } | undefined {
  const crop = getCropProblemCrop(cropSlug);
  if (!crop) return undefined;
  const problem = crop.problems.find((p) => p.id === problemId);
  if (!problem) return undefined;
  return { crop, problem };
}

/** Home card previews */
export type HomeFeaturedProblem = {
  slug: string;
  nameHi: string;
  nameEn: string;
  cropSlug: string;
  problemId: string;
};

export const HOME_FEATURED_PROBLEMS: HomeFeaturedProblem[] = [
  { slug: "leaf-curl", nameHi: "पत्ती मुड़ना", nameEn: "Leaf curl", cropSlug: "tomato", problemId: "leaf-curl" },
  { slug: "yellow-leaf", nameHi: "पीली पत्ती", nameEn: "Yellow leaf", cropSlug: "cauliflower", problemId: "downy" },
  { slug: "whitefly", nameHi: "सफेद मक्खी", nameEn: "Whitefly", cropSlug: "cotton", problemId: "whitefly" },
  { slug: "blight", nameHi: "झुलसा", nameEn: "Blight", cropSlug: "potato", problemId: "late-blight" },
  { slug: "fruit-rot", nameHi: "फल सड़ना", nameEn: "Fruit rot", cropSlug: "chilli", problemId: "anthracnose" },
];

export const HOME_CARD_PROBLEMS = HOME_FEATURED_PROBLEMS;
