import { OTHER_CROP } from "@/data/ai-doctor-crops";

export type SymptomChip = {
  id: string;
  label: string;
  hi: string;
};

/** Shared chips used when crop is "other" or unknown. */
export const DEFAULT_SYMPTOM_CHIPS: SymptomChip[] = [
  { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
  { id: "spots", label: "Spots", hi: "धब्बे" },
  { id: "curling", label: "Curling", hi: "मुड़ना" },
  { id: "holes", label: "Holes", hi: "छेद" },
  { id: "wilting", label: "Wilting", hi: "मुरझाना" },
  { id: "stunted", label: "Stunted growth", hi: "कम वृद्धि" },
  { id: "leaf-burn", label: "Leaf burn", hi: "पत्ती जलना" },
];

const CROP_SYMPTOM_CHIPS: Record<string, SymptomChip[]> = {
  tomato: [
    { id: "leaf-curl", label: "Leaf curl", hi: "पत्ती मुड़ना" },
    { id: "yellow-veins", label: "Yellow veins", hi: "नसें पीली" },
    { id: "fruit-spots", label: "Fruit spots", hi: "फल पर धब्बे" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "whitefly", label: "Whitefly", hi: "सफ़ेद मक्खी" },
    { id: "blight", label: "Blight patches", hi: "झुलसा धब्बे" },
    { id: "blossom-end", label: "Blossom end rot", hi: "फल नीचे सड़ना" },
  ],
  paddy: [
    { id: "leaf-blast", label: "Leaf blast", hi: "पत्ती झुलसा" },
    { id: "brown-spot", label: "Brown spot", hi: "भूरे धब्बे" },
    { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
    { id: "neck-blast", label: "Neck blast", hi: "गर्दन झुलसा" },
    { id: "stem-borer", label: "Dead heart", hi: "तना छेदक" },
    { id: "sheath-blight", label: "Sheath blight", hi: "म्यान झुलसा" },
    { id: "hopper-burn", label: "Hopper burn", hi: "फुदका जलन" },
  ],
  soybean: [
    { id: "leaf-yellow", label: "Leaf yellowing", hi: "पत्ती पीली" },
    { id: "rust", label: "Rust pustules", hi: "रस्ट" },
    { id: "pod-spots", label: "Pod spots", hi: "फली धब्बे" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "defoliation", label: "Leaf eating", hi: "पत्ती खाना" },
    { id: "root-rot", label: "Root rot", hi: "जड़ सड़न" },
    { id: "mosaic", label: "Mosaic pattern", hi: "मोज़ेक" },
  ],
  moongfali: [
    { id: "leaf-spot", label: "Leaf spot", hi: "पत्ती धब्बे" },
    { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
    { id: "tikka", label: "Tikka disease", hi: "टिक्का" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "peg-rot", label: "Peg / pod rot", hi: "फली सड़ना" },
    { id: "rust", label: "Rust", hi: "रस्ट" },
    { id: "aphids", label: "Aphids", hi: "माहू" },
  ],
  maize: [
    { id: "leaf-blight", label: "Leaf blight", hi: "पत्ती झुलसा" },
    { id: "streaks", label: "Yellow streaks", hi: "पीली धारियाँ" },
    { id: "stem-borer", label: "Stem borer", hi: "तना छेदक" },
    { id: "cob-rot", label: "Cob rot", hi: "भुट्ठा सड़ना" },
    { id: "downy-mildew", label: "Downy mildew", hi: "मृदुरोमिल" },
    { id: "stunted", label: "Stunted plants", hi: "कम वृद्धि" },
    { id: "army-worm", label: "Leaf eating", hi: "पत्ती खाना" },
  ],
  chilli: [
    { id: "leaf-curl", label: "Leaf curl", hi: "पत्ती मुड़ना" },
    { id: "thrips", label: "Thrips damage", hi: "थ्रिप्स" },
    { id: "fruit-rot", label: "Fruit rot", hi: "फल सड़ना" },
    { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
    { id: "dieback", label: "Dieback", hi: "टहनी सूखना" },
    { id: "powdery", label: "Powdery mildew", hi: "चूर्णी फफूंद" },
    { id: "mites", label: "Mite attack", hi: "माइट" },
  ],
  cauliflower: [
    { id: "black-rot", label: "Black rot", hi: "काला सड़न" },
    { id: "soft-rot", label: "Head soft rot", hi: "फूल सड़ना" },
    { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
    { id: "diamondback", label: "Leaf holes", hi: "पत्ती छेद" },
    { id: "clubroot", label: "Stunted root", hi: "जड़ गांठ" },
    { id: "downy", label: "Downy mildew", hi: "मृदुरोमिल" },
    { id: "aphids", label: "Aphids", hi: "माहू" },
  ],
  cucumber: [
    { id: "downy", label: "Downy mildew", hi: "मृदुरोमिल" },
    { id: "powdery", label: "Powdery mildew", hi: "चूर्णी फफूंद" },
    { id: "mosaic", label: "Mosaic", hi: "मोज़ेक" },
    { id: "fruit-rot", label: "Fruit rot", hi: "फल सड़ना" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "leaf-spots", label: "Leaf spots", hi: "पत्ती धब्बे" },
    { id: "flies", label: "Fruit fly", hi: "फल मक्खी" },
  ],
  brinjal: [
    { id: "fruit-borer", label: "Fruit borer", hi: "फल छेदक" },
    { id: "shoot-borer", label: "Shoot wilting", hi: "तना मुरझाना" },
    { id: "leaf-spots", label: "Leaf spots", hi: "पत्ती धब्बे" },
    { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
    { id: "little-leaf", label: "Little leaf", hi: "छोटी पत्ती" },
    { id: "mites", label: "Mite attack", hi: "माइट" },
    { id: "wilting", label: "Bacterial wilt", hi: "बैक्टीरियल विल्ट" },
  ],
  sugarcane: [
    { id: "red-rot", label: "Red rot", hi: "लाल सड़न" },
    { id: "yellowing", label: "Yellow leaf", hi: "पीली पत्ती" },
    { id: "smut", label: "Smut whip", hi: "कंड / स्मट" },
    { id: "borer", label: "Stem borer", hi: "तना छेदक" },
    { id: "wilting", label: "Wilt", hi: "विल्ट" },
    { id: "grassy", label: "Grassy shoot", hi: "घासनुमा अंकुर" },
    { id: "leaf-scald", label: "Leaf scald", hi: "पत्ती जलन" },
  ],
  potato: [
    { id: "late-blight", label: "Late blight", hi: "पछेती झुलसा" },
    { id: "early-blight", label: "Early blight", hi: "अगेती झुलसा" },
    { id: "tuber-rot", label: "Tuber rot", hi: "कंद सड़ना" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "leaf-curl", label: "Leaf curl", hi: "पत्ती मुड़ना" },
    { id: "scab", label: "Scab on tuber", hi: "स्कैब" },
    { id: "aphids", label: "Aphids", hi: "माहू" },
  ],
  bajra: [
    { id: "downy", label: "Downy mildew", hi: "मृदुरोमिल" },
    { id: "ergot", label: "Ergot", hi: "अर्गट" },
    { id: "smut", label: "Smut", hi: "कंड" },
    { id: "rust", label: "Rust", hi: "रस्ट" },
    { id: "leaf-blast", label: "Leaf blast", hi: "पत्ती झुलसा" },
    { id: "stem-borer", label: "Stem borer", hi: "तना छेदक" },
    { id: "stunted", label: "Stunted growth", hi: "कम वृद्धि" },
  ],
  wheat: [
    { id: "rust", label: "Rust", hi: "रस्ट" },
    { id: "powdery", label: "Powdery mildew", hi: "चूर्णी फफूंद" },
    { id: "loose-smut", label: "Loose smut", hi: "ढीला कंड" },
    { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
    { id: "leaf-blight", label: "Leaf blight", hi: "पत्ती झुलसा" },
    { id: "aphids", label: "Aphids", hi: "माहू" },
    { id: "lodging", label: "Lodging", hi: "गिरना" },
  ],
  bhindi: [
    { id: "yellow-vein", label: "Yellow vein mosaic", hi: "पीली नस" },
    { id: "fruit-borer", label: "Fruit borer", hi: "फल छेदक" },
    { id: "leaf-hopper", label: "Leaf hopper", hi: "फुदका" },
    { id: "powdery", label: "Powdery mildew", hi: "चूर्णी फफूंद" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "spots", label: "Leaf spots", hi: "पत्ती धब्बे" },
    { id: "stunted", label: "Stunted growth", hi: "कम वृद्धि" },
  ],
  moong: [
    { id: "yellow-mosaic", label: "Yellow mosaic", hi: "पीला मोज़ेक" },
    { id: "leaf-spot", label: "Leaf spot", hi: "पत्ती धब्बे" },
    { id: "powdery", label: "Powdery mildew", hi: "चूर्णी फफूंद" },
    { id: "wilting", label: "Wilting", hi: "मुरझाना" },
    { id: "pod-borer", label: "Pod borer", hi: "फली छेदक" },
    { id: "aphids", label: "Aphids", hi: "माहू" },
    { id: "web-blight", label: "Web blight", hi: "जाला झुलसा" },
  ],
  [OTHER_CROP.slug]: DEFAULT_SYMPTOM_CHIPS,
};

/** Symptom chips for the selected AI Doctor crop. */
export function getSymptomChipsForCrop(cropSlug: string): SymptomChip[] {
  return CROP_SYMPTOM_CHIPS[cropSlug] ?? DEFAULT_SYMPTOM_CHIPS;
}

/** @deprecated Prefer getSymptomChipsForCrop */
export const SYMPTOM_CHIPS = DEFAULT_SYMPTOM_CHIPS;
