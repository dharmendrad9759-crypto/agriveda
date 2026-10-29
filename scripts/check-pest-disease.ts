import { PEST_DISEASE_DETAILS } from '../data/pest-disease-details';
import { PEST_DISEASE_DATA } from '../data/pest-disease';
import { chemBottleImageSrc } from '../lib/crops/chemBottleSvg';

console.log('Checking PEST_DISEASE_DETAILS...');
let count = 0;
let missing = 0;
const missingSet = new Set<string>();

for (const [id, detail] of Object.entries(PEST_DISEASE_DETAILS)) {
  for (const m of (detail as any).medicines || []) {
    count++;
    const tech = m.technical || m.name;
    const src = chemBottleImageSrc(tech);
    if (src.startsWith('data:image/svg+xml')) {
      missingSet.add(`detail ${id} -> "${tech}"`);
      missing++;
    }
  }
}

for (const [id, data] of Object.entries(PEST_DISEASE_DATA)) {
  for (const c of (data as any).chemicalControl || []) {
    count++;
    const tech = typeof c === 'string' ? c : (c.technical || c.name);
    const src = chemBottleImageSrc(tech);
    if (src.startsWith('data:image/svg+xml')) {
      missingSet.add(`pest-data ${id} -> "${tech}"`);
      missing++;
    }
  }
}

console.log(`Checked ${count} items, missing images: ${missingSet.size}`);
if (missingSet.size > 0) {
  console.log('Sample missing:', Array.from(missingSet).slice(0, 30));
}
