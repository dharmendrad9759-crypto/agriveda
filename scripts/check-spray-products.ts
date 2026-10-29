import { sprayProducts } from '../data/spray-products';
import { chemBottleImageSrc } from '../lib/crops/chemBottleSvg';

console.log('Checking sprayProducts...');
let missing = 0;
for (const p of sprayProducts) {
  const tech = p.activeIngredient || p.productName;
  const src = chemBottleImageSrc(tech);
  if (src.startsWith('data:image/svg+xml')) {
    console.log('SVG fallback in sprayProducts:', tech, 'productName:', p.productName);
    missing++;
  }
}
console.log('sprayProducts total:', sprayProducts.length, 'missing real photo:', missing);
