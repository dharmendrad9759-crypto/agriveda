import { ALL_FIELD_MEDICINE } from '../data/field-medicine-all';
import { splitMedicineLine, parseMedicineItem } from '../lib/crops/medicineParser';
import { RAW_CROP_PROBLEM_CROPS } from '../data/crop-curative-problems';
import { getCurativeMedicines } from '../lib/crops/cropProblemMedicines';
import { sprayProducts } from '../data/spray-products';
import { MODERN_TECHNICALS } from '../data/modern-technicals';
import { chemBottleImageSrc, hasRealBottlePhoto } from '../lib/crops/chemBottleSvg';
import { lookupChemBottle } from '../lib/crops/chemBottle';

const missingMap = new Map<string, { occurrences: string[]; sample: string }>();

function check(rawTech: string, source: string) {
  if (!rawTech || typeof rawTech !== 'string') return;
  const cleaned = rawTech.trim();
  if (!cleaned) return;

  // Filter out traps or purely mechanical/organic notes if they are already handled
  if (/trap|ल्योर|ट्रैप|चिपचिपे|पॉलीथीन/i.test(cleaned)) return;

  const src = chemBottleImageSrc(cleaned);
  if (src.startsWith('data:image/svg+xml')) {
    const key = cleaned.toLowerCase();
    if (!missingMap.has(key)) {
      missingMap.set(key, { occurrences: [source], sample: cleaned });
    } else {
      missingMap.get(key)!.occurrences.push(source);
    }
  }
}

// 1. ALL_FIELD_MEDICINE
for (const guide of ALL_FIELD_MEDICINE) {
  for (const tier of guide.tiers) {
    for (const line of tier.lines) {
      const parts = splitMedicineLine(line);
      for (const part of parts) {
        const parsed = parseMedicineItem(part, guide.type);
        if (parsed.isChemical) {
          const tech = parsed.technicalEn || parsed.technicalHi;
          check(tech, `field-medicine:${guide.cropSlug}`);
        }
      }
    }
  }
}

// 2. CROP_CURATIVE_PROBLEMS
for (const crop of RAW_CROP_PROBLEM_CROPS) {
  for (const prob of crop.problems) {
    const meds = getCurativeMedicines(crop.slug, prob.id, prob.cureChemicalHi);
    for (const m of meds) {
      const techs = m.technical.includes('+') ? m.technical.split('+').map(s => s.trim()) : [m.technical];
      for (const t of techs) {
        check(t, `curative:${crop.slug}:${prob.id}`);
      }
    }
  }
}

// 3. sprayProducts
for (const p of sprayProducts) {
  check(p.activeIngredient, `sprayProduct:${p.id}:${p.productName}`);
}

// 4. MODERN_TECHNICALS
for (const m of MODERN_TECHNICALS) {
  check(`${m.name} ${m.formulation}`, `modern-technical:${m.name}`);
  check(m.name, `modern-technical:${m.name}`);
}

console.log(`\n=== TOTAL DISTINCT TECHNICALS MISSING REAL PHOTOS: ${missingMap.size} ===\n`);

const entries = Array.from(missingMap.entries()).sort((a, b) => b[1].occurrences.length - a[1].occurrences.length);

for (const [key, val] of entries) {
  console.log(`- "${val.sample}" (occurrences: ${val.occurrences.length}) -> e.g. ${val.occurrences[0]}`);
}
