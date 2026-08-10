/**
 * One-shot patch: nutrient deficiency JSON authenticity fixes (ICAR/SAU-aligned).
 * Run: node scripts/patch-nutrient-authenticity.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "data/imports/agriveda-nutrient-deficiency-batch.json");
const j = JSON.parse(fs.readFileSync(file, "utf8"));

function nut(slug) {
  const n = j.nutrients.find((x) => x.slug === slug);
  if (!n) throw new Error("missing " + slug);
  return n;
}

function setFix(slug, fertilizerMatch, patch) {
  const n = nut(slug);
  const fix = n.howToFix.find((f) => f.fertilizer.includes(fertilizerMatch));
  if (!fix) throw new Error(`fix not found ${slug} / ${fertilizerMatch}`);
  Object.assign(fix, patch);
}

// Categories
nut("nitrogen").category = "प्राथमिक पोषक तत्व";
nut("phosphorus").category = "प्राथमिक पोषक तत्व";
nut("potassium").category = "प्राथमिक पोषक तत्व";
nut("calcium").category = "द्वितीयक पोषक तत्व";
nut("magnesium").category = "द्वितीयक पोषक तत्व";
nut("sulphur").category = "द्वितीयक पोषक तत्व";

// N — clarify elemental N vs urea product weight (ICAR cereal ~100–150 kg N/ha)
setFix("nitrogen", "Urea", {
  soilApplicationDose:
    "फसल PoP के अनुसार elemental N — अनाज आमतौर पर ~40–60 kg N/एकड़ (≈100–150 kg N/हे.) 2–3 भाग में। सुधारी top-dress: 25–45 kg यूरिया/एकड़ (मिट्टी नमी + फसल जाँच के बाद)",
  foliarSprayDose:
    "2% यूरिया = 20 g/L (~3–4 kg यूरिया in 150–200 L/एकड़) — केवल बचाव; प्राथमिक मिट्टी",
  precautions:
    "‘कुल N/एकड़’ को यूरिया किलो से न मिलाएँ (यूरिया 46% N)। सूखी/गर्म मिट्टी पर broadcast न करें। Foliar 2% से ऊपर न जाए। Crop PoP + मिट्टी परीक्षण अंतिम।",
});

// Ni — no farmer spray recipe
nut("nickel").howToFix = [
  {
    fertilizer: "सामान्य मिट्टी + कार्बनिक पदार्थ (किसान खेत में Ni खाद न डालें)",
    nutrientContent: "trace Ni",
    soilApplicationDose: "NA — भारतीय आम फसलों में Ni खाद की सिफारिश नहीं",
    foliarSprayDose: "NA — छिड़काव न करें (भारी धातु / खाद्य सुरक्षा)",
    fertigationDose: "NA",
    waterQuantity: "NA",
    bestCropStage: "केवल प्रयोगशाला पुष्टि + विशेषज्ञ सलाह पर",
    methodOfApplication: "कमी दुर्लभ; आमतौर पर कार्बनिक पदार्थ/मिट्टी पर्याप्त। प्रदूषण संदेह पर मिट्टी परीक्षण।",
    numberOfApplications: "NA",
    sprayInterval: "NA",
    expectedRecoveryTime: "NA",
    precautions:
      "Nickel Sulphate किसान स्प्रे/खाद के रूप में न दें। Heavy-metal contamination परीक्षण KVK/प्रयोगशाला से।",
  },
];

// Co — Rhizobium only for farmers
nut("cobalt").howToFix = [
  {
    fertilizer: "Rhizobium inoculant (मुख्य उपाय — दलहन)",
    nutrientContent: "N-fixing bacteria",
    soilApplicationDose: "बीज उपचार — पैकेट लेबल",
    foliarSprayDose: "NA",
    fertigationDose: "NA",
    waterQuantity: "slurry",
    bestCropStage: "बुआई के समय (मूंग/अरहर/सोया आदि)",
    methodOfApplication: "बीज उपचार; स्वस्थ नोड्यूलेशन ही लक्ष्य। CoSO4 किसान स्प्रे न करें।",
    numberOfApplications: "1",
    sprayInterval: "NA",
    expectedRecoveryTime: "season via better nodulation",
    precautions: "कवकनाशी के साथ एक साथ न मिलाएँ; गुणवत्ता inoculant लें। Co अलग से तभी जब KVK/मिट्टी रिपोर्ट कहे।",
  },
];

// B — Solubor soil gate + fertigation season total
setFix("boron", "Borax", {
  soilApplicationDose:
    "मिट्टी परीक्षण के बाद ही — crucifers/oilseeds पर अक्सर Borax ~4–5 kg/एकड़ basal; समान रूप से मिलाएँ (विषाक्तता आसान)",
  fertigationDose: "season total बहुत कम — लेबल/मिट्टी परीक्षण; हर drip cycle न दोहराएँ",
  precautions:
    "B की कमी और विष के बीच मार्जिन पतला। Soil test / SHC बिना भारी मिट्टी dose न दें। Borax गर्म पानी में घोलें।",
});
setFix("boron", "Solubor", {
  soilApplicationDose:
    "मिट्टी में तभी जब Soil Health Card/प्रयोगशाला elemental B बताए — Solubor ~20% B (Borax से तेज़); अक्सर किसान के लिए सिर्फ foliar सुरक्षित",
  foliarSprayDose: "0.1–0.2% (1–2 g/L) — पसंदीदा तरीका",
  fertigationDose: "लेबल; सीजन कुल elemental B सीमा में रखें",
  precautions: "अतिरिक्त B आसानी से विषैला — foliar प्राथमिक; मिट्टी dose soil-test gated।",
});

// Ca — groundnut gypsum ≈ 500 kg/ha
setFix("calcium", "Gypsum", {
  soilApplicationDose:
    "मूंगफली flowering/pegging: ~200 kg/एकड़ (≈500 kg/हे., ICAR/NFSM शैली); sodic सुधार: 200–400 kg/एकड़; अन्य फसलें राज्य PoP",
});

// Cu — fertigation caution
setFix("copper", "Copper Sulphate", {
  fertigationDose: "आमतौर पर न करें — मिट्टी 2–4 kg/एकड़ हर कुछ वर्षों में पर्याप्त; अगर drip तो लेबल season-total, हर split नहीं",
  precautions:
    "Cu आसानी से विषाक्त/जमा। Foliar में चूना मिलाएँ। हर सीजन भारी fertigation न करें। मिट्टी परीक्षण के बाद।",
});

// P — soften DAP foliar
setFix("phosphorus", "DAP", {
  foliarSprayDose:
    "प्राथमिक नहीं — burn/Zn विरोध जोखिम। जरूरी हो तो water-soluble MAP ~0.5% लेबल अनुसार; DAP 2% foliar सामान्य PoP नहीं",
});

// Fe prevention soil-test if array exists
{
  const fe = nut("iron");
  if (Array.isArray(fe.prevention) && !fe.prevention.some((p) => /मिट्टी|Soil Health|soil test/i.test(p))) {
    fe.prevention.unshift("मिट्टी / ऊतक परीक्षण या Soil Health Card के बाद ही Fe दर तय करें — क्षारीय मिट्टी में मिट्टी FeSO4 अक्सर फिक्स हो जाता है, foliar/EDDHA बेहतर।");
  }
}
{
  const mo = nut("molybdenum");
  if (Array.isArray(mo.prevention) && !mo.prevention.some((p) => /मिट्टी|Soil Health|soil test/i.test(p))) {
    mo.prevention.unshift("मिट्टी परीक्षण / pH जाँच के बाद ही Mo दें — खुराक ग्राम स्तर पर; अम्लीय मिट्टी में अक्सर पहले चूना।");
  }
}
{
  const zn = nut("zinc");
  if (Array.isArray(zn.prevention) && !zn.prevention.some((p) => /मिट्टी|Soil Health|soil test/i.test(p))) {
    zn.prevention.unshift("Soil Health Card पर Zn कम हो तभी मिट्टी ZnSO4 ~10 kg/एकड़ (≈25 kg/हे.) हर 2–3 सीजन — नहीं तो 0.5% foliar।");
  }
}

// FYM unit soft-fix if present on N page
for (const n of j.nutrients) {
  for (const f of n.howToFix || []) {
    if (/FYM|FYM|गोबर|Farmyard/i.test(f.fertilizer) && f.soilApplicationDose && /4-10 t\/acre|4–10 t\/acre/.test(f.soilApplicationDose)) {
      f.soilApplicationDose = f.soilApplicationDose.replace(
        /4-10 t\/acre|4–10 t\/acre/g,
        "2–4 t/एकड़ (≈5–10 t/हे. साधारण PoP; भारी खुराक मिट्टी क्षमता अनुसार)"
      );
    }
  }
  if (typeof n.category === "string") {
    n.category = n.category
      .replace(/पोषकन्यूट्रिएंट/g, "पोषक तत्व")
      .replace(/(तत्व\s*){2,}/g, "तत्व ")
      .trim();
  }
}

j.compiledAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
console.log("Patched", file);
