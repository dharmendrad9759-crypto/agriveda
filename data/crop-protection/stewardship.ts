/** Global stewardship notes from Agriveda Crop Protection Master Guide */

export const STEWARDSHIP_NOTES = [
  "कभी भी same FRAC group (fungicide) या IRAC group (insecticide) लगातार 2 बार से ज़्यादा मत चलाएँ — resistance से बचने के लिए rotate करें।",
  "Waxy/hairy पत्ती वाली फ़सलों (गोभी, तोरी, खीरा) पर हमेशा sticker/spreader @ 0.5 ml/L मिलाएँ।",
  "Bordeaux/lime जैसी alkaline चीज़ों को ज़्यादातर insecticide/EC के साथ मत मिलाएँ जब तक label न कहे।",
  "सब्ज़ियों में PHI strictly follow करें — harvest के पास Azadirachtin, Spinosad, Emamectin, Bacillus prefer करें।",
  "Viral बीमारी (leaf curl, mosaic, YVMV) का कोई chemical इलाज नहीं — vector (whitefly/thrips/aphid) control + infected पौधे उखाड़ कर फेंक दें।",
  "Spray diary रखें हर खेत के लिए — Spray Rotation module इसी से काम करता है।",
  "नीचे की dose ICAR/SAU/CIB&RC label के हिसाब से हैं — बेचने से पहले अपने राज्य KVK से verify करें।",
];

export const DOSE_CONVENTIONS = [
  "/acre = product per acre (~200 L spray volume/acre सब्ज़ी, 150-200 L kharif फ़सल)",
  "1 knapsack pump = 15 L",
  "DAS/DAT = बुवाई / रोपाई के दिन",
  "Early = हल्की लग (5-10% पौधे/पत्ती)",
  "Advanced = तेज़ी से फैल रहा (>10-25%) या favourable weather",
];

export const CROP_PROTECTION_GROUPS = [
  {
    id: "cereals",
    label: "Cereals",
    labelHi: "अनाज — धान, गेहूँ, मक्का, बाजरा",
    cropSlugs: ["paddy", "wheat", "maize", "bajra"],
  },
  {
    id: "oilseeds",
    label: "Oilseeds & Pulses",
    labelHi: "तिलहन और दाल — सोयाबीन, मूंगफली",
    cropSlugs: ["soybean", "moongfali", "mustard", "moong", "pulses"],
  },
  {
    id: "cash",
    label: "Cash Crops",
    labelHi: "नकदी फसल — कपास, गन्ना",
    cropSlugs: ["cotton", "sugarcane"],
  },
  {
    id: "solanaceous",
    label: "Solanaceous",
    labelHi: "सोलनेसी — टमाटर, बैंगन, मिर्च, आलू",
    cropSlugs: ["tomato", "brinjal", "chilli", "potato"],
  },
  {
    id: "cole",
    label: "Cole & Alliums",
    labelHi: "गोभी परिवार और प्याज",
    cropSlugs: ["cauliflower", "onion"],
  },
  {
    id: "cucurbits",
    label: "Cucurbits & Okra",
    labelHi: "लौकी-कद्दू-खीरा और भिंडी",
    cropSlugs: ["cucumber", "bhindi"],
  },
] as const;
