// data/crops.ts
import { Crop } from "@/types/crop";

export const cropsData: Crop[] = [
  {
    slug: "tomato",
    name: "टमाटर (Tomato)",
    scientificName: "Solanum lycopersicum",
    category: "Vegetables",
    image: "/images/crops/tomato.jpg",
    overview: "टमाटर भारत की एक अत्यंत महत्वपूर्ण और मुनाफे वाली सब्जी फसल है, जिसे सही हाइब्रिड बीजों और सटीक फर्टिगेशन से बम्पर पैदावार में बदला जा सकता है।",
    climate: "21°C से 24°C का तापमान इसकी वृद्धि के लिए सबसे उत्तम है। अत्यधिक पाला या भारी जलभराव इसे नुकसान पहुँचाता है।",
    soil: "अच्छे जल निकास वाली बलुई दोमट (Sandy Loam) या गहरी कन्हार मिट्टी जिसका pH 6.0 से 7.0 हो।",
    seedRate: "हाइब्रिड बीजों के लिए 40 से 50 ग्राम प्रति एकड़ (प्रो-ट्रे नर्सरी विधि द्वारा)।",
    spacing: "बेड से बेड: 3.5 से 4 फीट, पौधे से पौधा: 1.5 फीट (ज़िग-ज़ैग रोपाई)।",
    durationDays: "140 - 160 दिन",
    basalDose: [
      { name: "Single Super Phosphate (SSP)", dosage: "100 किलो (2 बैग)" },
      { name: "DAP", dosage: "30 किलो" },
      { name: "MOP (पोटाश)", dosage: "25 किलो" },
      { name: "Zinc Sulphate (33%)", dosage: "5 किलो" },
      { name: "Regent (Fipronil 0.3% GR)", dosage: "5 किलो (दीमक और जमीन के कीड़ों के लिए)" }
    ],
    stageWiseSchedule: [
      {
        stageName: "वानस्पतिक विकास (रोपाई से 10-30 दिन)",
        durationDays: "20 दिन",
        description: "इस अवस्था में पौधे की जड़ों का विकास और नई शाखाएं (Vegetative Growth) बढ़ाना मुख्य लक्ष्य होता है।",
        fertilizers: [
          { name: "NPK 19:19:19", dosage: "2 किलो प्रति एकड़", frequency: "हर 3 दिन में ड्रिप से" },
          { name: "Humic Acid 98%", dosage: "500 ग्राम", frequency: "रोपाई के 5वें दिन एक बार" }
        ],
        sprays: [
          {
            target: "शुरुआती रसचूसक कीट (थ्रिप्स और हरा मच्छर)",
            chemicals: ["Thiamethoxam 25% WG (Actara)"],
            dosage: "100 ग्राम प्रति एकड़"
          }
        ]
      },
      {
        stageName: "फूल आने की अवस्था (35-50 दिन)",
        durationDays: "15 दिन",
        description: "मादा फूलों की संख्या बढ़ाना और फूलों को झड़ने से बचाना सबसे जरूरी है।",
        fertilizers: [
          { name: "NPK 12:61:00 (MAP)", dosage: "2.5 किलो प्रति एकड़", frequency: "हफ्ते में दो बार" }
        ],
        sprays: [
          {
            target: "फूल झड़ने से रोकना और रसचूसक कीट नियंत्रण",
            chemicals: ["Alpha Naphthyl Acetic Acid (Planofix)", "Cyantraniliprole (Benevia)"],
            dosage: "प्लानोफिक्स: 4 मिली प्रति 15 लीटर, बेनेविया: 360 मिली/एकड़"
          }
        ]
      },
      {
        stageName: "फल विकास एवं तुड़ाई अवस्था (55 दिन से अंत तक)",
        durationDays: "लगातार",
        description: "टमाटर का साइज बढ़ाने, फल फटने से रोकने और कड़कपन (चमक) लाने के लिए हैवी खुराक।",
        fertilizers: [
          { name: "Calcium Nitrate", dosage: "3 किलो प्रति एकड़", frequency: "हर 5 दिन में (अकेले दें)" },
          { name: "Boron 20%", dosage: "250 ग्राम", frequency: "कैल्शियम के साथ मिलाकर ड्रिप से" },
          { name: "NPK 0:0:50 (SOP)", dosage: "2 किलो प्रति एकड़", frequency: "फलों के भराव के समय" }
        ],
        sprays: [
          {
            target: "फल छेदक इल्ली और अगेती/पछेती झुलसा रोग (Blastic & Fruit borer)",
            chemicals: ["Chlorantraniliprole (Coragen)", "Azoxystrobin + Difenoconazole (Amistar Top)"],
            dosage: "कोराजन: 60 मिली, एमिस्टार顶: 200 मिली प्रति एकड़"
          }
        ]
      }
    ],
    pests: [
      {
        id: "tomat-thrips",
        name: "थ्रिप्स (Thrips)",
        scientificName: "Thrips tabaci",
        symptoms: ["पत्तियां ऊपर की तरफ मुड़कर नाव जैसी हो जाती हैं", "पौधे की ग्रोथ रुक जाती है"],
        severity: "high",
        controlChemicals: [
          { technical: "Spinetoram 11.7% SC", brandExample: "Delegate", dosage: "180 मिली/एकड़" }
        ],
        images: []
      }
    ],
    diseases: [
      {
        id: "early-blight",
        name: "अगेती झुलसा (Early Blight)",
        scientificName: "Alternaria solani",
        symptoms: ["नीचे की पत्तियों पर बैल की आंख जैसे गोल छल्लेदार धब्बे बनना", "फल सड़कर गिरना"],
        severity: "high",
        controlChemicals: [
          { technical: "Tebuconazole 50% + Trifloxystrobin 25% WG", brandExample: "Nativo", dosage: "120 ग्राम/एकड़" }
        ],
        images: []
      }
    ],
    deficiencies: [],
    estimatedYield: "250 - 350 क्विंटल प्रति एकड़",
    marketInfo: "सर्दियों के अंत और शुरुआती गर्मियों में मंडियों में इसकी भारी मांग रहती है।"
  },
  {
    slug: "paddy",
    name: "धान (Paddy)",
    scientificName: "Oryza sativa",
    category: "Cereals",
    image: "/images/crops/paddy.jpg",
    overview: "धान भारत की सबसे मुख्य खाद्यान्न फसल है। छत्तीसगढ़ और उत्तर प्रदेश के मैदानी इलाकों में इसकी खेती बड़े पैमाने पर की जाती है। बासमती और हाइब्रिड किस्मों का सही पोषण प्रबंधन ही रिकॉर्ड तोड़ उपज की चाबी है।",
    climate: "22°C से 32°C का उच्च तापमान और प्रचुर मात्रा में धूप। फसल के जीवनकाल में अच्छी वर्षा या सुनिश्चित सिंचाई अनिवार्य है।",
    soil: "भारी मटियार या कन्हार मिट्टी (Clay Soil) जो पानी को लंबे समय तक रोक कर रख सके, जिसका pH 5.5 से 6.5 के बीच हो।",
    seedRate: "हाइब्रिड धान के लिए 6 किलो प्रति एकड़ और बासमती के लिए 8 से 10 किलो प्रति एकड़ (नर्सरी विधि)।",
    spacing: "कतार से कतार: 20 सेंटीमीटर, पौधे से पौधा: 15 सेंटीमीटर (रोपाई के समय)।",
    durationDays: "120 - 135 दिन",
    basalDose: [
      { name: "DAP (Diammonium Phosphate)", dosage: "40 किलो" },
      { name: "MOP (Murate of Potash)", dosage: "20 किलो" },
      { name: "Zinc Sulphate (21%)", dosage: "10 किलो (खैरा रोग से बचाव के लिए सबसे जरूरी)" }
    ],
    stageWiseSchedule: [
      {
        stageName: "प्रारंभिक कल्ले फूटने की अवस्था (रोपाई से 15-30 दिन)",
        durationDays: "15 दिन",
        description: "इस समय धान में अधिक से अधिक कल्ले (Tillering) निकलना बहुत जरूरी है, जिससे आगे चलकर बालियां ज्यादा बनेंगी।",
        fertilizers: [
          { name: "Urea (नाइट्रोजन)", dosage: "30 किलो प्रति एकड़", frequency: "रोपाई के 20 दिन बाद पहली टॉप ड्रेसिंग" },
          { name: "Saganika / Gold Biostimulant", dosage: "4 किलो", frequency: "यूरिया के साथ मिलाकर फेंकें" }
        ],
        sprays: [
          {
            target: "तना छेदक (Stem Borer) और लीफ फोल्डर इल्ली",
            chemicals: ["Cartap Hydrochloride 4G या Chlorantraniliprole 0.4% GR"],
            dosage: "4 किलो प्रति एकड़ (बालू रेत में मिलाकर जमीन में डालें)"
          }
        ]
      },
      {
        stageName: "गभोट या बालियां निकलने से ठीक पहले (60-75 दिन)",
        durationDays: "15 दिन",
        description: "इस समय तने के अंदर बालियां बन रही होती हैं। इस समय पौधों को पोटाश और बोरॉन की सख्त जरूरत होती है ताकि दानों का भराव पूरा हो।",
        fertilizers: [
          { name: "MOP (पोटाश - दूसरी खुराक)", dosage: "15 किलो प्रति एकड़", frequency: "जमीन में छिड़काव विधि द्वारा" }
        ],
        sprays: [
          {
            target: "बालियों की चमक बढ़ाना और फंगस (शीथ ब्लाइट) नियंत्रण",
            chemicals: ["NPK 0:52:34", "Hexaconazole 5% EC (Contaf)"],
            dosage: "NPK: 1 किलो, कोंटाफ: 200 मिली प्रति 200 लीटर पानी में मिलाकर स्प्रे"
          }
        ]
      }
    ],
    pests: [
      {
        id: "stem-borer",
        name: "तना छेदक (Stem Borer)",
        scientificName: "Scirpophaga incertulas",
        symptoms: ["शुरुआती अवस्था में बीच की पत्ती सूख जाती है जिसे 'Dead Heart' कहते हैं", "बाद में बालियां सफेद और खाली निकलती हैं जिन्हें 'White Head' कहा जाता है"],
        severity: "high",
        controlChemicals: [
          { technical: "Chlorantraniliprole 18.5% SC", brandExample: "Coragen", dosage: "60 मिली प्रति एकड़" }
        ],
        images: []
      }
    ],
    diseases: [
      {
        id: "khaira-disease",
        name: "खैरा रोग (Zinc Deficiency Disease)",
        symptoms: ["पत्तियों पर हल्के पीले रंग के धब्बे बनते हैं जो बाद में कत्थई/भूरे रंग के हो जाते हैं", "पौधों की ग्रोथ पूरी तरह रुक जाती है"],
        severity: "medium",
        controlChemicals: [
          { technical: "Zinc Sulphate 21%", dosage: "10 किलो प्रति एकड़ बेसल डोज में या 0.5% का स्प्रे" }
        ],
        images: []
      }
    ],
    deficiencies: [],
    estimatedYield: "22 - 28 क्विंटल प्रति एकड़ (किस्म के आधार पर)",
    marketInfo: "अक्टूबर से दिसंबर के बीच मंडियों में धान की भारी आवक होती है, जहाँ न्यूनतम समर्थन मूल्य (MSP) या बासमती के बेहतरीन प्रीमियम भाव मिलते हैं।"
  }
];