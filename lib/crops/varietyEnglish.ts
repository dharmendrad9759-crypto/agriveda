/** Market English for a Hindi variety name. Numbers and codes stay exact. */

const PHRASES: [string, string][] = [
  ["पूसा बासमती", "Pusa Basmati"],
  ["स्नोबॉल के", "Snowball K"],
  ["स्नोबॉल", "Snowball"],
  ["थॉम्पसन सीडलेस", "Thompson Seedless"],
  ["क्रिमसन सीडलेस", "Crimson Seedless"],
  ["शरद सीडलेस", "Sharad Seedless"],
  ["फ्लेम सीडलेस", "Flame Seedless"],
  ["तास-ए-गणेश", "Tas-A-Ganesh"],
  ["रियो डी जनेरियो", "Rio de Janeiro"],
  ["ग्रैंड नैने", "Grand Naine"],
  ["हापुस (अल्फांसो)", "Hapus (Alphonso)"],
  ["एग्रीफाउंड लाइट रेड", "Agrifound Light Red"],
  ["एग्रीफाउंड डार्क रेड", "Agrifound Dark Red"],
  ["भीमा डार्क रेड", "Bhima Dark Red"],
  ["यमुना सफेद", "Yamuna Safed"],
  ["ग्रीन एक्सप्रेस", "Green Express"],
  ["ग्रीन फ्लैश", "Green Flash"],
  ["गोल्डन एकड़", "Golden Acre"],
  ["वंडर बॉल", "Wonder Ball"],
  ["स्नो मिस्टीक", "Snow Mystic"],
  ["कैंडिड चार्म", "Candid Charm"],
  ["ईस्ट-वेस्ट", "East-West"],
  ["सिनजेंटा", "Syngenta"],
  ["सेमिनिस", "Seminis"],
  ["ननहेम्स", "Nunhems"],
  ["एडवांटा", "Advanta"],
  ["पायनियर", "Pioneer"],
  ["अराइज", "Arize"],
  ["प्रोएग्रो", "Proagro"],
  ["बायोसीड", "Bioseed"],
  ["श्रीराम", "Shriram"],
  ["महिको", "Mahyco"],
  ["कावेरी", "Kaveri"],
  ["वीएनआर", "VNR"],
  ["सुपर सोनाका", "Super Sonaka"],
  ["सुपर बॉस", "Super Boss"],
  ["इम्प्रूव्ड", "Improved"],
  ["बासमती", "Basmati"],
  ["गोल्ड", "Gold"],
  ["लाइट रेड", "Light Red"],
  ["डार्क रेड", "Dark Red"],
  ["सिंजेंटा", "Syngenta"],
  ["बीजी-2", "BG-II"],
  ["सब-1", "Sub-1"],
  ["टीओ-1057", "TO-1057"],
  ["एन-53", "N-53"],
  ["फुले", "Phule"],
  ["सबाउर", "Sabour"],
  ["स्वर्ण", "Swarna"],
  ["अर्का", "Arka"],
  ["कुफरी", "Kufri"],
  ["पूसा", "Pusa"],
  ["सुपर", "Super"],
  ["मैक्स", "MAXX"],
  ["भीमा", "Bhima"],
  ["लेडी रोसेटा", "Lady Rosetta"],
  ["सैंटाना", "Santana"],
  ["हिमनसोना", "Himsona"],
  ["फ्राइसोना", "Frysona"],
  ["चिप्सोना", "Chipsona"],
  ["हिमालिनी", "Himalini"],
  ["पुखराज", "Pukhraj"],
  ["जादू", "Jadoo"],
  ["तेजा", "Teja"],
  ["मेघा", "Megha"],
  ["बरखा", "Barkha"],
  ["गिरिजा", "Girija"],
  ["दीपाली", "Deepali"],
  ["मुक्ता", "Mukta"],
  ["कांति", "Kanti"],
  ["जिप्सी", "Gypsy"],
  ["कियान", "Kian"],
  ["हिल्टन", "Hilton"],
  ["डॉन", "Dawn"],
  ["मल्लिका", "Mallika"],
  ["दशहरी", "Dashehari"],
  ["लंगड़ा", "Langra"],
  ["चौसा", "Chausa"],
  ["बंबई", "Bombay"],
  ["ज़रदालू", "Zardalu"],
  ["सुंदरजा", "Sunderja"],
  ["रामकेला", "Ramkela"],
  ["सांभा महसूरी", "Samba Mahsuri"],
  ["सहभागी", "Sahbhagi"],
  ["राजेंद्र", "Rajendra"],
  ["नरेंद्र", "Narendra"],
  ["बिरसा", "Birsa"],
  ["इंदिरा", "Indira"],
  ["महिको", "Mahyco"],
  ["अभिनव", "Abhinav"],
  ["लक्ष्मी", "Lakshmi"],
  ["गंगा", "Ganga"],
  ["कृपा", "Kripa"],
  ["आम्रपाली", "Amrapali"],
  ["जी9", "G9"],
  ["धनवंतरी", "Dhanvantari"],
  ["संगम", "Sangam"],
  ["किमाया", "Kimaya"],
  ["चेतन", "Chetan"],
  ["विक्रम", "Vikram"],
  ["एज़ेड", "AZ"],
  ["माहिको", "Mahyco"],
  ["चना", "Chana"],
  ["मसूर", "Masoor"],
  ["उड़द", "Urad"],
  ["अरहर", "Arhar"],
  ["समाधान", "Samadhan"],
  ["वैष्णवी", "Vaishnavi"],
  ["गौतमी", "Gautami"],
  ["पीएसी", "PAC"],
  ["मरुति", "Maruti"],
  ["बहार", "Bahar"],
  ["डॉलर", "Dollar"],
  ["उन्नति", "Unnati"],
  ["प्रगति", "Pragati"],
  ["बायो", "Bio"],
  ["वरुणा", "Varuna"],
  ["कोरल", "Coral"],
  ["इंस्पिरेशन", "Inspiration"],
  ["बॉम्बी", "Bomby"],
  ["रवैया", "Ravaiya"],
  ["गुजरात", "Gujarat"],
  ["गार्लिक", "Garlic"],
  ["पर्पल", "Purple"],
  ["गोदावरी", "Godavari"],
  ["पर्लेट", "Perlette"],
  ["नदिया", "Nadia"],
  ["सुप्रभा", "Suprabha"],
  ["हिमगिरी", "Himgiri"],
  ["पंचगंगा", "Panchganga"],
  ["नरोया", "Naroya"],
  ["महामाया", "Mahamaya"],
  ["राजेश्वरी", "Rajeshwari"],
  ["इंद्रायणी", "Indrayani"],
  ["चावल", "Rice"],
  ["गेहूँ", "Wheat"],
  ["वंदना", "Vandana"],
  ["ईगल", "Eagle"],
  ["आजाद", "Azad"],
  ["पंजाब", "Punjab"],
  ["ललिमा", "Lalima"],
  ["ज्वाला", "Jwala"],
  ["प्रतिभा", "Pratibha"],
  ["श्यामली", "Shyamali"],
  ["क्रिस्पिनो", "Crispino"],
  ["प्रताप", "Pratap"],
  ["मक्का", "Maize"],
  ["छत्तीसगढ़", "Chhattisgarh"],
  ["उज्जवल", "Ujjwal"],
  ["करनाल", "Karnal"],
  ["सुफलाम", "Sufalam"],
  ["पीताम्बरी", "Pitambari"],
  ["अंबर", "Amber"],
  ["बचाटा", "Bachata"],
  ["ओंकार", "Omkar"],
  ["चिनिया", "Chinia"],
  ["अलपन", "Alpan"],
  ["वरदा", "Varada"],
  ["सुरभि", "Surabhi"],
  ["जाकी", "JAKI"],
  ["सरजू", "Sarjoo"],
  ["टमाटर", "Tomato"],
  ["सुहावन", "Suhavani"],
  ["मान्जरी", "Manjari"],
  ["मांजरी", "Manjari"],
];

const LETTERS: [string, string][] = [
  ["डब्ल्यू", "W"],
  ["एच", "H"],
  ["आई", "I"],
  ["पी", "P"],
  ["बी", "B"],
  ["डी", "D"],
  ["टी", "T"],
  ["सी", "C"],
  ["जी", "G"],
  ["के", "K"],
  ["एल", "L"],
  ["एफ", "F"],
  ["वी", "V"],
  ["एम", "M"],
  ["एन", "N"],
  ["एस", "S"],
  ["आर", "R"],
  ["यू", "U"],
  ["जे", "J"],
  ["ओ", "O"],
  ["ए", "A"],
];

const CONS: Record<string, string> = {
  क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ng",
  च: "ch", छ: "chh", ज: "j", झ: "jh", ञ: "ny",
  ट: "t", ठ: "th", ड: "d", ढ: "dh", ण: "n",
  त: "t", थ: "th", द: "d", ध: "dh", न: "n",
  प: "p", फ: "f", ब: "b", भ: "bh", म: "m",
  य: "y", र: "r", ल: "l", व: "v",
  श: "sh", ष: "sh", स: "s", ह: "h",
  ळ: "l",
};

const MATRA: Record<string, string> = {
  "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u",
  "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ृ": "ri",
  "ॅ": "e", "ॉ": "o",
};

const VOWEL: Record<string, string> = {
  अ: "a", आ: "a", इ: "i", ई: "i", उ: "u", ऊ: "u",
  ए: "e", ऐ: "ai", ओ: "o", औ: "au", ऋ: "ri",
};

function title(word: string) {
  if (!word) return word;
  if (/^[A-Z0-9-]{2,}$/.test(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function acronym(word: string): string | null {
  let i = 0;
  let out = "";
  while (i < word.length) {
    const hit = LETTERS.find(([hi]) => word.startsWith(hi, i));
    if (!hit) return null;
    out += hit[1];
    i += hit[0].length;
  }
  return out.length >= 2 ? out : null;
}

function letterToken(word: string): string | null {
  const hit = LETTERS.find(([hi]) => hi === word);
  return hit ? hit[1] : null;
}

function coCode(word: string): string | null {
  if (!word.startsWith("को") || word.length <= 2) return null;
  const rest = word.slice(2);
  let i = 0;
  let out = "";
  while (i < rest.length) {
    const hit = LETTERS.find(([hi]) => rest.startsWith(hi, i));
    if (!hit) return null;
    out += hit[1];
    i += hit[0].length;
  }
  return out ? `Co${out}` : null;
}

function transliterate(word: string) {
  const code = acronym(word);
  if (code) return code;
  const single = letterToken(word);
  if (single) return single;
  const co = coCode(word);
  if (co) return co;
  if (word === "को") return "Co";
  let out = "";
  let explicit = false;
  const chars = [...word];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (ch === "्") {
      out = out.replace(/a$/, "");
      explicit = true;
      continue;
    }
    if (ch === "ं" || ch === "ँ") {
      out += "n";
      continue;
    }
    if (ch === "़") {
      if (out.endsWith("j")) out = `${out.slice(0, -1)}z`;
      else if (out.endsWith("d")) out = `${out.slice(0, -1)}r`;
      continue;
    }
    if (MATRA[ch]) {
      out = out.replace(/a$/, "") + MATRA[ch];
      explicit = true;
      continue;
    }
    if (VOWEL[ch]) {
      out += VOWEL[ch];
      explicit = true;
      continue;
    }
    if (CONS[ch]) {
      out += `${CONS[ch]}a`;
      explicit = false;
    }
  }
  if (!explicit) out = out.replace(/a$/, "");
  return title(out);
}

export function varietyEnglishName(hindi: string): string {
  let text = ` ${hindi} `;
  const phrases = [...PHRASES].sort((a, b) => b[0].length - a[0].length);
  for (const [hi, en] of phrases) text = text.split(hi).join(` ${en} `);
  const parts = text.split(/(\s+|[()\/+,.]|\d[\d.–-]*)/u);
  const rendered = parts
    .map((part) => {
      if (/[^\u0900-\u097F]/.test(part) || part.trim() === "") return part;
      return transliterate(part);
    })
    .join("");
  return rendered
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+([),])/g, "$1")
    .replace(/([(])\s+/g, "$1")
    .replace(/\s+-\s+/g, "-")
    .replace(/\bK (\d)/g, "K-$1")
    .trim();
}

const HYBRID_CROPS = new Set([
  "paddy",
  "wheat",
  "maize",
  "bajra",
  "mustard",
  "cotton",
  "tomato",
  "chilli",
  "capsicum",
  "brinjal",
  "bhindi",
  "cauliflower",
  "cabbage",
  "cucumber",
]);

export function varietyLooksHybrid(cropSlug: string, shop: boolean) {
  return shop && HYBRID_CROPS.has(cropSlug);
}
