import { writeFileSync } from "fs";
import { allNutrientDeficiencies } from "../lib/nutrients/nutrientDeficiencyBridge.ts";
import { toFarmerNutrientView } from "../lib/nutrients/farmerNutrientView.ts";
import { buildCropScope } from "../lib/nutrients/nutrientCropContext.ts";
import { cropLabelToImageSlug } from "../lib/nutrients/deficiencyImages.ts";

const MAIN = [
  "nitrogen",
  "phosphorus",
  "potassium",
  "calcium",
  "magnesium",
  "sulphur",
  "iron",
  "zinc",
  "manganese",
  "copper",
  "boron",
  "molybdenum",
];

const CROPS = process.argv.slice(2);
if (!CROPS.length) {
  console.error("Usage: tsx scripts/dump-symptom-gen.mts Wheat Tomato ...");
  process.exit(1);
}

const CROP_EN: Record<string, string> = {
  Paddy: "rice/paddy plant in flooded field",
  Soybean: "soybean plant",
  Maize: "maize/corn plant",
  Chilli: "chilli pepper plant",
  Groundnut: "groundnut/peanut plant",
  Wheat: "wheat plant in field",
  Tomato: "tomato plant",
  Potato: "potato plant",
  Cotton: "cotton plant",
  Onion: "onion plant",
  Brinjal: "brinjal/eggplant plant",
  Cauliflower: "cauliflower plant",
  Cucumber: "cucumber plant",
  Bajra: "pearl millet / bajra plant",
  Sugarcane: "sugarcane plant",
};

const EN_SYMPTOM_HINT: Record<string, string[]> = {
  nitrogen: [
    "overall pale yellowish-green weak growth",
    "older lower leaves yellow first, plant short and weak",
    "few tillers or branches, sparse canopy",
  ],
  phosphorus: [
    "dark dirty-green stunted seedlings, poor early growth",
    "dwarf stunted plant",
    "older leaves purple or reddish purple",
  ],
  potassium: [
    "leaf margins burning brown on older leaves",
    "yellow then brown scorched leaf edges",
    "weak stems lodging tendency, poor fill",
  ],
  calcium: [
    "new leaves deformed, growing tip damage",
    "young leaves curled or distorted",
    "blossom end / tip disorders where relevant",
  ],
  magnesium: [
    "older leaves yellow between veins",
    "interveinal chlorosis veins stay green",
    "older leaves clearly green veins yellow blade",
  ],
  sulphur: [
    "upper young leaves pale yellow",
    "yellowing starts on youngest top leaves",
    "pale yellow short plants",
  ],
  iron: [
    "youngest leaves bright yellow veins green",
    "new leaf shining pale yellow chlorosis",
    "young yellow older still green",
  ],
  zinc: [
    "small crowded leaves shortened internodes",
    "very small leaves short internodes rosette",
    "new leaves yellow longitudinal stripes",
  ],
  manganese: [
    "young leaves mottled yellow gray speckles",
    "new leaves spotted chlorotic flecks",
    "young pale blotchy leaves wet soil look",
  ],
  copper: [
    "young leaf tips twisted dying dieback",
    "new leaves pale bluish twisted tips",
    "shoot tip necrotic and twisted",
  ],
  boron: [
    "deformed growing tip flower/fruit set problems",
    "flowers drop poor fruit setting",
    "cracked hollow fruits or dead tip",
  ],
  molybdenum: [
    "older leaves mottled pale yellow-green",
    "pale mottled older leaves like nitrogen hunger",
    "poor nodulation look on legumes if applicable",
  ],
};

const rows = [];
for (const crop of CROPS) {
  const cropSlug = cropLabelToImageSlug(crop);
  if (!cropSlug) {
    console.error("Unknown crop", crop);
    continue;
  }
  const cropEn = CROP_EN[crop] ?? `${crop} plant`;
  for (const slug of MAIN) {
    const n = allNutrientDeficiencies.find((d) => d.slug === slug)!;
    const f = toFarmerNutrientView(n);
    const scope = buildCropScope(n, f, crop);
    scope.symptoms.slice(0, 3).forEach((s, slot) => {
      const filename = `${cropSlug}-${slug}-s${slot}.jpg`;
      const hint = EN_SYMPTOM_HINT[slug]?.[slot] ?? s.description;
      const prompt = `Photorealistic close-up educational agronomy photo of a ${cropEn} clearly showing nutrient deficiency symptom: ${hint}. Match this farmer description: "${s.description}". Focus on the described leaf/fruit pattern. Natural daylight, sharp detail, no text, no watermark, no labels.`;
      rows.push({
        filename,
        crop,
        cropSlug,
        nutrient: slug,
        slot,
        title: s.title,
        description: s.description,
        prompt,
      });
    });
  }
}

const out = `tmp-symptom-gen-${CROPS.join("-").toLowerCase()}.json`;
writeFileSync(out, JSON.stringify(rows, null, 2), "utf8");
console.log(out, rows.length);
