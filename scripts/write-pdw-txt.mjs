import fs from "fs";

const j = JSON.parse(fs.readFileSync("scripts/_pdw-inventory-clean.json", "utf8"));
const lines = [];
lines.push("AgriVeda — सभी फसलें, रोग, कीट और खरपतवार");
lines.push("Copy-paste list (app data inventory)");
lines.push("");

let cropN = 0,
  pestN = 0,
  disN = 0,
  weedN = 0;

const crops = [...j.crops].sort((a, b) =>
  (a.nameHi || a.nameEn || "").localeCompare(b.nameHi || b.nameEn || "", "hi")
);

for (const c of crops) {
  cropN++;
  const pests = c.pests || [];
  const diseases = c.diseases || [];
  const weeds = c.weeds || [];
  lines.push("========================================");
  lines.push(`फसल: ${c.nameHi || ""} (${c.nameEn || ""}) [${c.slug}]`);
  lines.push("----------------------------------------");
  lines.push(`रोग (${diseases.length}):`);
  if (!diseases.length) lines.push("  (कोई डेटा नहीं)");
  diseases.forEach((x, i) => {
    disN++;
    lines.push(`  ${i + 1}. ${x.name}${x.scientificName ? " — " + x.scientificName : ""}`);
  });
  lines.push(`कीट (${pests.length}):`);
  if (!pests.length) lines.push("  (कोई डेटा नहीं)");
  pests.forEach((x, i) => {
    pestN++;
    lines.push(`  ${i + 1}. ${x.name}${x.scientificName ? " — " + x.scientificName : ""}`);
  });
  lines.push(`खरपतवार (${weeds.length}):`);
  if (!weeds.length) lines.push("  (कोई डेटा नहीं)");
  weeds.forEach((x, i) => {
    weedN++;
    lines.push(`  ${i + 1}. ${x.name}${x.scientificName ? " — " + x.scientificName : ""}`);
  });
  lines.push("");
}

lines.push("========================================");
lines.push(`कुल: फसल ${cropN} | रोग ${disN} | कीट ${pestN} | खरपतवार ${weedN}`);

if (j.catalogCropsWithNoPestDiseaseWeedData?.length) {
  lines.push("");
  lines.push("कैटलॉग फसलें जिन पर अलग PDW डेटा कम/नहीं:");
  for (const x of j.catalogCropsWithNoPestDiseaseWeedData) {
    lines.push(`  - ${typeof x === "string" ? x : x.slug || JSON.stringify(x)}`);
  }
}

const text = lines.join("\n");
fs.writeFileSync("CROPS_PESTS_DISEASES_WEEDS_LIST.txt", "\uFEFF" + text, "utf8");
console.log("OK", { cropN, disN, pestN, weedN });
