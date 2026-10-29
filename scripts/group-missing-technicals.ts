import { ALL_FIELD_MEDICINE } from '../data/field-medicine-all';
import { splitMedicineLine, parseMedicineItem } from '../lib/crops/medicineParser';
import { RAW_CROP_PROBLEM_CROPS } from '../data/crop-curative-problems';
import { getCurativeMedicines } from '../lib/crops/cropProblemMedicines';
import { sprayProducts } from '../data/spray-products';
import { MODERN_TECHNICALS } from '../data/modern-technicals';
import { chemBottleImageSrc } from '../lib/crops/chemBottleSvg';
import { lookupChemBottle } from '../lib/crops/chemBottle';

const missingRaw = new Set<string>();

function check(rawTech: string) {
  if (!rawTech || typeof rawTech !== 'string') return;
  const cleaned = rawTech.trim();
  if (!cleaned) return;
  if (/trap|ल्योर|ट्रैप|चिपचिपे|पॉलीथीन/i.test(cleaned)) return;
  const src = chemBottleImageSrc(cleaned);
  if (src.startsWith('data:image/svg+xml')) {
    missingRaw.add(cleaned);
  }
}

for (const crop of RAW_CROP_PROBLEM_CROPS) {
  for (const prob of crop.problems) {
    const meds = getCurativeMedicines(crop.slug, prob.id, prob.cureChemicalHi);
    for (const m of meds) {
      const techs = m.technical.includes('+') ? m.technical.split('+').map(s => s.trim()) : [m.technical];
      for (const t of techs) check(t);
    }
  }
}

for (const p of sprayProducts) {
  check(p.activeIngredient);
  check(p.productName);
}

for (const m of MODERN_TECHNICALS) {
  check(`${m.name} ${m.formulation}`);
  check(m.name);
}

console.log('Total raw missing strings:', missingRaw.size);

// Normalize to base slug
function toSlug(s: string) {
  return s.toLowerCase()
    .replace(/\b(\d+(?:\.\d+)?%|\d+\s*(?:g\/l|sc|ec|sl|wg|wp|wdg|ew|od|dc|fs))\b/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const baseGroups = new Map<string, string[]>();
for (const s of missingRaw) {
  const slug = toSlug(s);
  if (!baseGroups.has(slug)) baseGroups.set(slug, []);
  baseGroups.get(slug)!.push(s);
}

console.log('Unique base technicals:', baseGroups.size);
for (const [base, items] of baseGroups.entries()) {
  console.log(`${base}:`, items);
}
