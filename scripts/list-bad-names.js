const fs = require("fs");
const s = fs.readFileSync("c:/Users/admin/krishi-app/data/crop-curative-problems.ts", "utf8");

// Extract all nameHi from prob("id", "nameHi", "nameEn"
const re = /prob\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g;
const bad = [];
let m;
while ((m = re.exec(s))) {
  const [, id, hi, en] = m;
  // Flag if Hindi name still looks like transliteration of English
  const looksBad =
    /ब्लाइट|मिलड्यू|आर्मीवर्म|कर्ल|डैम्पिंग|एन्थ्रेक्नोज|मेडिस|स्पॉट ब्लॉच|फ्लाई|कटवर्म|स्कैब|स्कर्फ|माइट|डाईबैक|मैलीबग|पायरिला|फ्यूजेरियम|स्टेम्फिलियम|फोमोप्सिस|मोज़ेक|Leaf|curl|Early|Late|Powdery|Downy/i.test(hi) ||
    /\([A-Z]{2,}\)/.test(hi) ||
    /Leaf curl|Early blight|Late blight/.test(hi);
  if (looksBad) bad.push({ id, hi, en });
}

console.log("bad count", bad.length);
for (const b of bad) console.log(JSON.stringify(b));

// featured
const feat = s.match(/nameHi:\s*"([^"]+)"/g);
console.log("featured", feat);
