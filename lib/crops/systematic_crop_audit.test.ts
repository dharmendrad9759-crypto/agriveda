import { describe, it, expect } from "vitest";
import { ALL_FIELD_MEDICINE } from "@/data/field-medicine-all";
import { splitMedicineLine, parseMedicineItem } from "@/lib/crops/medicineParser";
import { chemBottleImageSrc } from "@/lib/crops/chemBottleSvg";

describe("Systematic Crop Audit across all crops, pests and diseases", () => {
  it("audits all field medicine guides for agronomic and packaging correctness", () => {
    let totalLinesChecked = 0;
    let totalItemsParsed = 0;
    const errors: string[] = [];
    const trapsFound: string[] = [];

    for (const guide of ALL_FIELD_MEDICINE) {
      for (const tier of guide.tiers) {
        for (const line of tier.lines) {
          totalLinesChecked++;
          const parts = splitMedicineLine(line);
          for (const part of parts) {
            totalItemsParsed++;
            const parsed = parseMedicineItem(part, guide.type);

            // 1. Trap / Cultural / Mechanical check
            const isMechanicalOrTrapText =
              /(?:फेरोमोन|चिपचिपे\s*ट्रैप|स्टीकी\s*ट्रैप|लाइट\s*ट्रैप|ल्यूसिल्यूर|हेलिल्यूर|स्पोडोल्यूर|टूटा\s*ल्यूर|क्यू-ल्यूर|डीबीएम|scirpolure|pectino-lure|अल्काथीन|पॉलीथीन\s*शीट|ग्रीस\s*बैंड|तने\s*पर\s*बैंड|स्यूडोस्टेम|bird perch)/i.test(
                part
              );
            const hasExplicitChemicalSpray =
              /\b(?:EC|SC|SP|WP|WG|WDG|FS|OD|ZC)\b/i.test(part) && /@|\/लीटर|प्रति\s*लीटर/i.test(part);

            if (isMechanicalOrTrapText && !hasExplicitChemicalSpray) {
              if (parsed.isChemical) {
                errors.push(
                  `[TRAP AS CHEM] Crop: ${guide.cropSlug}, Keys: ${guide.keys.join("/")}, Part: "${part}" -> Parsed as chemical: ${parsed.technicalEn} (slug: ${parsed.bottleSlug})`
                );
              } else if (parsed.kind === "trap") {
                trapsFound.push(`${guide.cropSlug}: ${parsed.technicalHi} (${parsed.trap?.trapType}) -> img: ${parsed.trap?.imageSrc}`);
              }
            }

            // 2. DP (Dust) and GR (Granules) Soil Application vs Spray Tank Check
            const isSoilDustOrGranule =
              /\b(?:DP|GR|CG|10G|4G|3G)\b|डस्ट|दानेदार|प्रति\s*पेड़/i.test(part) &&
              !/स्प्रे|spray|घोल\s*का\s*छिड़काव|घोलकर\s*स्प्रे|ड्रेंचिंग|drench/i.test(part);

            if (isSoilDustOrGranule && parsed.isChemical) {
              if (
                parsed.farmerDose.perTank.includes("प्रति 16L पंप") &&
                !parsed.farmerDose.perTank.includes("लागू नहीं")
              ) {
                errors.push(
                  `[SOIL DUST/GR IN SPRAY PUMP] Crop: ${guide.cropSlug}, Keys: ${guide.keys.join("/")}, Part: "${part}" -> Absurd perTank: "${parsed.farmerDose.perTank}"`
                );
              }
            }

            // 3. Foliar dosage absurdity check: no foliar spray in pump should be > 25 g/L or > 25 ml/L
            if (parsed.isChemical && parsed.farmerDose.perLiter) {
              const numMatch = parsed.farmerDose.perLiter.match(/^(\d+(?:\.\d+)?)\s*(?:ग्राम|मिली)/i);
              if (numMatch) {
                const val = parseFloat(numMatch[1]);
                const isSpecialNonFoliar =
                  parsed.farmerDose.perTank.includes("लागू नहीं") ||
                  parsed.farmerDose.perLiter.includes("लागू नहीं") ||
                  parsed.farmerDose.perLiter.includes("लेप") ||
                  parsed.farmerDose.perLiter.includes("इंजेक्शन") ||
                  parsed.farmerDose.perLiter.includes("एकड़");
                if (val > 25 && !isSpecialNonFoliar) {
                  errors.push(
                    `[ABSURD FOLIAR DOSE] Crop: ${guide.cropSlug}, Keys: ${guide.keys.join("/")}, Part: "${part}" -> Absurd perLiter: "${parsed.farmerDose.perLiter}"`
                  );
                }
              }
            }
          }
        }
      }
    }

    console.log(`Audit completed: checked ${totalLinesChecked} lines across all crops (${totalItemsParsed} parsed items).`);
    console.log(`Verified ${trapsFound.length} mechanical / IPM / barrier traps correctly parsed without chemical bottles! Sample:`, trapsFound.slice(0, 10));

    if (errors.length > 0) {
      console.error(`Found ${errors.length} agronomic issues:\n` + errors.join("\n"));
    }
    expect(errors).toEqual([]);
  });
});
