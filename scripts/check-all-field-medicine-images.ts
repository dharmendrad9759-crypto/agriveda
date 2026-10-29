import { ALL_FIELD_MEDICINE } from '../data/field-medicine-all';
import { splitMedicineLine, parseMedicineItem } from '../lib/crops/medicineParser';
import { chemBottleImageSrc, hasRealBottlePhoto } from '../lib/crops/chemBottleSvg';

let totalItems = 0;
let realCount = 0;
let svgCount = 0;
const svgList: any[] = [];

for (const guide of ALL_FIELD_MEDICINE) {
  for (const tier of guide.tiers) {
    for (const line of tier.lines) {
      const parts = splitMedicineLine(line);
      for (const part of parts) {
        totalItems++;
        const parsed = parseMedicineItem(part, guide.type);
        if (parsed.isChemical) {
          const tech = parsed.technicalEn || parsed.technicalHi;
          const src = chemBottleImageSrc(tech);
          if (src.startsWith('data:image/svg+xml')) {
            svgCount++;
            svgList.push({ crop: guide.cropSlug, part, tech, slug: parsed.bottleSlug });
          } else {
            realCount++;
          }
        }
      }
    }
  }
}

console.log(`Total parsed items: ${totalItems}`);
console.log(`Real photos: ${realCount}`);
console.log(`SVG fallback count: ${svgCount}`);
if (svgCount > 0) {
  console.log('SVG Fallbacks found:', svgList);
}
