import { ALL_CROPS } from '../data/crops';
import { PEST_DISEASE_DATA } from '../data/pest-disease';
import { PEST_DISEASE_DETAILS } from '../data/pest-disease-details';
import { CROP_CURATIVE_PROBLEMS } from '../data/crop-curative-problems';
import { hasRealBottlePhoto, chemBottleImageSrc } from '../lib/crops/chemBottleSvg';
import { parseFarmerMedicines } from '../lib/crops/medicineParser';

console.log('Checking all data sources for real bottle photos...');

const missing = new Set<string>();
let totalChecked = 0;

// 1. ALL_CROPS fieldMedicines
for (const crop of ALL_CROPS) {
  for (const m of crop.fieldMedicines || []) {
    const parsed = parseFarmerMedicines(m);
    for (const item of parsed) {
      totalChecked++;
      const tech = item.technicalEn || item.technicalHi || item.raw;
      if (!hasRealBottlePhoto(tech)) {
        missing.add(`Crop fieldMedicine: ${crop.id} -> ${tech} (raw: ${item.raw})`);
      }
    }
  }
}

// 2. CROP_CURATIVE_PROBLEMS
if (typeof CROP_CURATIVE_PROBLEMS !== 'undefined') {
  for (const [cropId, probs] of Object.entries(CROP_CURATIVE_PROBLEMS || {})) {
    for (const prob of (probs as any) || []) {
      for (const chem of prob.chemicalControl || prob.sprayLines || prob.medicines || []) {
        totalChecked++;
        const tech = typeof chem === 'string' ? chem : (chem.technical || chem.name);
        if (!hasRealBottlePhoto(tech)) {
          missing.add(`CROP_CURATIVE_PROBLEMS: ${cropId} -> ${tech}`);
        }
      }
    }
  }
}

// 3. PEST_DISEASE_DATA
if (typeof PEST_DISEASE_DATA !== 'undefined') {
  for (const [threatId, item] of Object.entries(PEST_DISEASE_DATA || {})) {
    for (const chem of (item as any).chemicalControl || (item as any).chemicals || []) {
      totalChecked++;
      const tech = typeof chem === 'string' ? chem : (chem.technical || chem.name);
      if (!hasRealBottlePhoto(tech)) {
        missing.add(`PEST_DISEASE_DATA: ${threatId} -> ${tech}`);
      }
    }
  }
}

// 4. PEST_DISEASE_DETAILS
if (typeof PEST_DISEASE_DETAILS !== 'undefined') {
  for (const [threatId, item] of Object.entries(PEST_DISEASE_DETAILS || {})) {
    for (const chem of (item as any).chemicalControl || (item as any).chemicals || (item as any).medicines || []) {
      totalChecked++;
      const tech = typeof chem === 'string' ? chem : (chem.technical || chem.name);
      if (!hasRealBottlePhoto(tech)) {
        missing.add(`PEST_DISEASE_DETAILS: ${threatId} -> ${tech}`);
      }
    }
  }
}

console.log('Total checked items:', totalChecked);
console.log('Missing count:', missing.size);
if (missing.size > 0) {
  console.log('Missing items (first 40):', Array.from(missing).slice(0, 40));
}
