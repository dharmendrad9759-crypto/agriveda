import { RAW_CROP_PROBLEM_CROPS } from '../data/crop-curative-problems';
import { getCurativeMedicines } from '../lib/crops/cropProblemMedicines';
import { chemBottleImageSrc } from '../lib/crops/chemBottleSvg';

console.log('Checking RAW_CROP_PROBLEM_CROPS...');
let missing = 0;
let total = 0;
const missingSet = new Set<string>();

for (const crop of RAW_CROP_PROBLEM_CROPS) {
  for (const prob of crop.problems) {
    const meds = getCurativeMedicines(crop.slug, prob.id, prob.cureChemicalHi);
    for (const m of meds) {
      total++;
      const techs = m.technical.includes('+') ? m.technical.split('+').map(s => s.trim()) : [m.technical];
      for (const t of techs) {
        const src = chemBottleImageSrc(t);
        if (src.startsWith('data:image/svg+xml')) {
          missingSet.add(`${crop.slug} -> ${prob.id} -> "${t}"`);
          missing++;
        }
      }
    }
  }
}

console.log(`Curative problems checked: ${total}, missing images: ${missingSet.size}`);
if (missingSet.size > 0) {
  console.log('Missing items:', Array.from(missingSet));
}
