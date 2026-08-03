/** Post-process Hindi nutrient batch: fix symbols, product names, common mistranslations. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/imports/agriveda-nutrient-deficiency-batch.json");

const REPLACEMENTS = [
  // Nutrient symbols (Devanagari -> Latin)
  [/\bबोरॉन\b/g, "B"],
  [/\bबोरोन\b/g, "B"],
  [/\bनाइट्रोजन\b/g, "N"],
  [/\bफास्फोरस\b/g, "P"],
  [/\bपोटेशियम\b/g, "K"],
  [/\bकैल्शियम\b/g, "Ca"],
  [/\bमैग्नीशियम\b/g, "Mg"],
  [/\bसल्फर\b/g, "S"],
  [/\bलोहा\b/g, "Fe"],
  [/\bजिंक\b/g, "Zn"],
  [/\bतांबा\b/g, "Cu"],
  [/\bमैंगनीज\b/g, "Mn"],
  [/\bमॉलिब्डेनम\b/g, "Mo"],
  [/\bक्लोरीन\b/g, "Cl"],
  [/\bकोबाल्ट\b/g, "Co"],
  [/\bनिकल\b/g, "Ni"],
  [/\bसिलिकॉन\b/g, "Si"],
  // Standalone बी as boron (not in Hindi words)
  [/(?<=[\s,.(—-]|^)बी(?=[\s,.)/—-]|$)/g, "B"],
  // Product names
  [/\bborax\b/gi, "Borax"],
  [/\burea\b/gi, "Urea"],
  [/\bgypsum\b/gi, "Gypsum"],
  [/\bsolubor\b/gi, "Solubor"],
  [/\bfoliar\b/gi, "Foliar"],
  [/\bbasal\b/gi, "Basal"],
  [/\bfertigation\b/gi, "Fertigation"],
  [/\btop-dress\b/gi, "top-dress"],
  [/\btop dress\b/gi, "top-dress"],
  // Common mistranslations
  [/दही/g, "गोभी"], // cauliflower curd, not yogurt
  [/दीक्षा/g, "शुरुआत"],
  [/नामी/g, "नमी"],
  [/भुगतान करें/g, "छिड़काव करें"],
  [/भुगतान/g, "छिड़काव"],
  [/चिड़काव/g, "छिड़काव"],
  [/chhidkav/gi, "छिड़काव"],
  [/sinchai/gi, "पानी देना"],
  [/sichai/gi, "पानी देना"],
  [/matti/gi, "मिट्टी"],
  [/khaad/gi, "खाद"],
  [/pattiyan/gi, "पत्तियाँ"],
  [/patti/gi, "पत्ती"],
  [/phal/gi, "फल"],
  [/fasal/gi, "फसल"],
  [/karein/gi, "करें"],
  [/dein/gi, "दें"],
  [/kyun/gi, "क्यों"],
  [/kaise/gi, "कैसे"],
  [/haan/gi, "हाँ"],
  [/nahi/gi, "नहीं"],
  [/zyada/gi, "ज़्यादा"],
  // Category fixes
  [/सूक्ष्म पोषक तत्वों की/g, "सूक्ष्म पोषक तत्व"],
  [/प्राथमिक मैक्रो/g, "प्राथमिक बड़ा पोषक"],
  [/द्वितीयक पोषक/g, "द्वितीयक पोषक तत्व"],
  [/boran/gi, "B"],
  [/बोरान/g, "B"],
  [/एन\b/g, "N"],
  [/deen\b/gi, "दिन"],
  [/din\b/gi, "दिन"],
  [/फराक/g, "फर्क"],
  [/अछि/g, "अच्छी"],
  [/लीये/g, "लिए"],
  [/\u091b\u093f\u0921\u0915\u0947\u0928/g, "छिड़काव"],
  [/कैल्शियम नाइट्रेट/g, "Calcium Nitrate"],
  [/कैल्शियम नाइटrate/gi, "Calcium Nitrate"],
  [/टॉप-ड्रेस/g, "top-dress"],
  [/स्प्रे/g, "Foliar spray"],
  [/Bेटिड/g, "Boronated"],
  [/B-गरीब/g, "B की कमी वाली"],
  [/B-अपटेक/g, "B अवशोषण"],
  [/B-कमी/g, "B की कमी"],
  [/निम्न बी\b/g, "निम्न B"],
  [/= निम्न B/g, "= निम्न B"],
  // Simplify formal words
  [/पौधों/g, "पौध"],
  [/पौधे/g, "पौध"],
  [/कृषक/g, "किसान"],
  [/कृषकों/g, "किसान"],
  [/मृदा/g, "मिट्टी"],
  [/सिंचाई/g, "पानी देना"],
  [/सिंचन/g, "पानी"],
];

function fixString(s) {
  if (typeof s !== "string") return s;
  let out = s;
  for (const [re, rep] of REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  return out;
}

function walk(node) {
  if (typeof node === "string") return fixString(node);
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (["slug", "symbol", "name", "fertilizer", "nutrientContent", "crop",
           "soilApplicationDose", "foliarSprayDose", "fertigationDose",
           "waterQuantity", "numberOfApplications", "sprayInterval",
           "expectedRecoveryTime", "formsTakenUp", "references", "sourceDocuments",
           "exportVersion", "compiledAt"].includes(k)) {
        out[k] = v;
      } else {
        out[k] = walk(v);
      }
    }
    return out;
  }
  return node;
}

const data = walk(JSON.parse(fs.readFileSync(FILE, "utf8")));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
JSON.parse(fs.readFileSync(FILE, "utf8"));
console.log("Post-process done. JSON.parse OK");
