// @ts-check
const fs = require('fs');
const path = require('path');

const p1 = require('./master-crops-part1.js');
const p1b = require('./master-crops-part1b.js');
const p2 = require('./master-crops-part2.js');
const p3 = require('./master-crops-part3.js');

const imageFixMap = {
  '/images/pests/pest-liriomyza-sativae-2.jpg': '/images/pests/pest-liriomyza-trifolii-2.jpg',
  '/images/pests/pest-frankliniella-occidentalis-2.jpg': '/images/pests/pest-thrips-palmi.jpg',
  '/images/pests/pest-tetranychus-urticae-2.jpg': '/images/pests/pest-tetranychus-urticae.jpg',
  '/images/diseases/disease-tomato-leaf-curl-virus-2.jpg': '/images/diseases/disease-tomato-leaf-curl-photoreal.jpg',
  '/images/pests/pest-tuta-absoluta-2.jpg': '/images/pests/pest-tomato-tuta-absoluta-photoreal.jpg',
  '/images/diseases/disease-fusarium-fujikuroi-2.jpg': '/images/diseases/disease-fusarium-fujikuroi.jpg',
  '/images/diseases/disease-fusarium-verticillioides-2.jpg': '/images/diseases/disease-fusarium-moniliforme.jpg',
  '/images/pests/pest-spilosoma-obliqua.jpg': '/images/pests/pest-spodoptera-litura-2.jpg',
  '/images/pests/pest-brevicoryne-brassicae-2.jpg': '/images/pests/pest-myzus-persicae-2.jpg',
  '/images/pests/pest-henosepilachna-vigintioctopunctata-2.jpg': '/images/pests/pest-henosepilachna-2.jpg',
  '/images/pests/pest-rhopalosiphum-padi.jpg': '/images/pests/pest-rhopalosiphum-maidis.jpg'
};

const allRawCrops = [...p1, ...p1b, ...p2, ...p3];

// Fix images and ensure virus flag is set properly
allRawCrops.forEach(crop => {
  crop.problems.forEach(p => {
    if (imageFixMap[p.image]) {
      p.image = imageFixMap[p.image];
    }
    // Automatically set isVirus for viral problems
    if (
      p.id.includes('ymv') ||
      p.id.includes('yvmv') ||
      p.id.includes('leaf-curl') ||
      p.id.includes('mosaic') ||
      p.tagHi.includes('वायरस') ||
      p.nameHi.includes('वायरस') ||
      p.nameHi.includes('मोज़ेक')
    ) {
      p.isVirus = true;
    }
  });
});

console.log(`Loaded ${allRawCrops.length} crops from parts 1, 1b, 2, 3.`);

// 1. Generate data/crop-curative-problems.ts
function generateCurativeProblemsFile() {
  const fileHeader = `/**
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
`;

  // Strip meds from CropProblemItem before exporting to keep crop-curative-problems clean
  const strippedCrops = allRawCrops.map(crop => ({
    slug: crop.slug,
    nameHi: crop.nameHi,
    nameEn: crop.nameEn,
    emoji: crop.emoji,
    image: crop.image,
    problems: crop.problems.map(p => ({
      id: p.id,
      nameHi: p.nameHi,
      nameEn: p.nameEn,
      tagHi: p.tagHi,
      image: p.image,
      stageHi: p.stageHi,
      stages: p.stages,
      specialFactHi: p.specialFactHi,
      isVirus: p.isVirus,
      whatHi: p.whatHi,
      whyHi: p.whyHi,
      cureOrganicHi: p.cureOrganicHi,
      cureChemicalHi: p.cureChemicalHi,
      whenToActHi: p.whenToActHi,
      tipHi: p.tipHi,
    }))
  }));

  const rawCropsCode = `export const RAW_CROP_PROBLEM_CROPS: CropProblemCrop[] = ${JSON.stringify(strippedCrops, null, 2)};\n`;

  const enrichmentCode = `
function inferProblemTagHi(meta: CropIdentificationProblemMeta): string {
  if (meta.type === "pest") return "कीट";
  const s = \`\${meta.problemSlug} \${meta.nameEn} \${meta.nameHi}\`.toLowerCase();
  if (/bacterial|xanthomonas|ralstonia|erwinia|जीवाणु/i.test(s)) return "जीवाणु";
  if (/virus|mosaic|curl|बंशी|वायरस/i.test(s)) return "वायरस";
  return "फफूंद";
}

function defaultChemicalsForProblem(meta: CropIdentificationProblemMeta): string[] {
  const s = \`\${meta.problemSlug} \${meta.nameEn} \${meta.nameHi}\`.toLowerCase();
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
      \`\${p.id} \${p.nameHi} \${p.nameEn}\`
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
      const shortHi = meta.nameHi.replace(/\\s*\\([^)]+\\)\\s*$/, "").trim();
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
`;

  const fullContent = fileHeader + "\n" + rawCropsCode + "\n" + enrichmentCode;
  fs.writeFileSync(path.join(__dirname, '../data/crop-curative-problems.ts'), fullContent, 'utf8');
  console.log('Successfully wrote data/crop-curative-problems.ts!');
}

// 2. Generate lib/crops/cropProblemMedicines.ts
function generateMedicinesFile() {
  const fileHeader = `/**
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
`;

  const medEntries = [];

  for (const crop of allRawCrops) {
    const probEntries = [];
    for (const p of crop.problems) {
      if (p.meds && p.meds.length > 0) {
        probEntries.push(`    ${JSON.stringify(p.id)}: ${JSON.stringify(p.meds, null, 6).replace(/\n/g, '\n    ')}`);
      }
    }
    medEntries.push(`  ${JSON.stringify(crop.slug)}: {\n${probEntries.join(',\n')}\n  }`);
  }

  // Also include aliases in medicines map so lookups by "tur", "rice", "okra", etc. succeed
  const aliasEntries = [
    `  "tur": CROP_PROBLEM_MEDICINES["arhar"] || {}`,
    `  "pigeonpea": CROP_PROBLEM_MEDICINES["arhar"] || {}`,
    `  "gram": CROP_PROBLEM_MEDICINES["chana"] || {}`,
    `  "chickpea": CROP_PROBLEM_MEDICINES["chana"] || {}`,
    `  "rice": CROP_PROBLEM_MEDICINES["paddy"] || {}`,
    `  "okra": CROP_PROBLEM_MEDICINES["bhindi"] || {}`,
    `  "eggplant": CROP_PROBLEM_MEDICINES["brinjal"] || {}`,
    `  "peanut": CROP_PROBLEM_MEDICINES["groundnut"] || {}`,
    `  "moongfali": CROP_PROBLEM_MEDICINES["groundnut"] || {}`,
  ];

  const fileFooter = `};\n\n// Aliases for seamless crop resolution\nconst ALIASES: Record<string, string> = {
  tur: "arhar",
  pigeonpea: "arhar",
  gram: "chana",
  chickpea: "chana",
  rice: "paddy",
  okra: "bhindi",
  eggplant: "brinjal",
  peanut: "groundnut",
  moongfali: "groundnut",
  pulses: "moong",
};

for (const [alias, target] of Object.entries(ALIASES)) {
  if (CROP_PROBLEM_MEDICINES[target] && !CROP_PROBLEM_MEDICINES[alias]) {
    CROP_PROBLEM_MEDICINES[alias] = CROP_PROBLEM_MEDICINES[target];
  }
}

export function getCurativeMedicines(
  cropSlug: string,
  problemId: string,
  rawLines?: string[]
): CurativeMedicine[] {
  const norm = cropSlug.trim().toLowerCase();
  const mappedSlug = ALIASES[norm] || norm;
  const mapped = CROP_PROBLEM_MEDICINES[mappedSlug]?.[problemId] || CROP_PROBLEM_MEDICINES[cropSlug]?.[problemId];
  if (mapped && mapped.length > 0) return mapped;

  if (!rawLines || rawLines.length === 0) return [];
  return rawLines.slice(0, 3).map((line, i) => {
    const raw = line.split("—")[0]?.trim() || line;
    return {
      nameHi: raw,
      technical: i === 0 ? "Standard Technical Formulation" : "Complementary Technical",
      dose: "अनुशंसित डोज़: 1.5–2 ग्राम/मिली प्रति लीटर पानी (लेबल अनुसार)",
      brands: ["प्रमाणित कृषि सेवा केंद्र से संपर्क करें"],
      level: (i + 1) as 1 | 2 | 3,
      levelLabelHi: \`स्तर \${i + 1}\`,
    };
  });
}
`;

  const fullContent = fileHeader + medEntries.join(',\n') + '\n' + fileFooter;
  fs.writeFileSync(path.join(__dirname, '../lib/crops/cropProblemMedicines.ts'), fullContent, 'utf8');
  console.log('Successfully wrote lib/crops/cropProblemMedicines.ts!');
}

generateCurativeProblemsFile();
generateMedicinesFile();
