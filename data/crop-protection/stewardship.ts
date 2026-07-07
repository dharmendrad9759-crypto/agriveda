/** Global stewardship notes from Agriveda Crop Protection Master Guide */

export const STEWARDSHIP_NOTES = [
  "Kabhi bhi same FRAC group (fungicide) ya IRAC group (insecticide) lagatar 2 baar se zyada mat chalao — resistance se bachne ke liye rotate karein.",
  "Waxy/hairy patti wali faslon (gobhi, tori, kheera) par hamesha sticker/spreader @ 0.5 ml/L milayein.",
  "Bordeaux/lime jaisi alkaline cheezon ko zyada tar insecticide/EC ke saath mat milayein jab tak label na kahe.",
  "Sabziyon mein PHI strictly follow karein — harvest ke paas Azadirachtin, Spinosad, Emamectin, Bacillus prefer karein.",
  "Viral bimari (leaf curl, mosaic, YVMV) ka koi chemical ilaj nahi — vector (whitefly/thrips/aphid) control + infected paudhe ukhad kar fenk dein.",
  "Spray diary rakhein har khet ke liye — Spray Rotation module isi se kaam karta hai.",
  "Neeche ki dose ICAR/SAU/CIB&RC label ke hisaab se hain — bechne se pehle apne rajya KVK se verify karein.",
];

export const DOSE_CONVENTIONS = [
  "/acre = product per acre (~200 L spray volume/acre sabzi, 150-200 L kharif fasal)",
  "1 knapsack pump = 15 L",
  "DAS/DAT = buwai / ropai ke din",
  "Early = halki lag (5-10% paude/patti)",
  "Advanced = tezi se fail raha (>10-25%) ya favourable weather",
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
