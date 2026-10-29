import { CHEM_BOTTLE_CATALOG } from '../data/chem-bottle-catalog';
import { REAL_BOTTLE_PHOTOS } from '../lib/crops/chemBottleSvg';

const catalogSlugs = new Set(CHEM_BOTTLE_CATALOG.map(c => c.slug));
console.log('Total entries in CHEM_BOTTLE_CATALOG:', CHEM_BOTTLE_CATALOG.length);

const missingFromCatalog: string[] = [];
for (const slug of Object.keys(REAL_BOTTLE_PHOTOS)) {
  if (!catalogSlugs.has(slug)) {
    missingFromCatalog.push(slug);
  }
}

console.log(`Slugs in REAL_BOTTLE_PHOTOS not in CHEM_BOTTLE_CATALOG: ${missingFromCatalog.length}`);
console.log('Sample missing from catalog:', missingFromCatalog.slice(0, 30));
