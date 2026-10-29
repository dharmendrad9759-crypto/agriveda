import fs from 'fs';

const extraMappings: Record<string, string> = {
  "micronutrient-mix": "/images/chem/real/micronutrient-mixture.jpg",
  "seaweed-viricide-250-ml": "/images/chem/real/seaweed-amino-acids.jpg",
  "seaweed-viricide": "/images/chem/real/seaweed-amino-acids.jpg",
  "metiram-70-wg-500-g": "/images/chem/real/metiram-70-wg.jpg",
  "profenophos": "/images/chem/real/profenofos-50-ec.jpg",
  "profenophos-50-ec": "/images/chem/real/profenofos-50-ec.jpg",
  "seaweed-amino-acids-biostimulant": "/images/chem/real/seaweed-amino-acids.jpg",
  "cue-lure-trap": "/images/traps/fruit-fly-trap.jpg",
  "methyl-eugenol-traps": "/images/traps/fruit-fly-trap.jpg",
  "methyl-eugenol-trap": "/images/traps/fruit-fly-trap.jpg",
};

const svgPath = 'lib/crops/chemBottleSvg.ts';
let svgContent = fs.readFileSync(svgPath, 'utf8');

const marker = 'export const REAL_BOTTLE_PHOTOS: Record<string, string> = {';
const endMarker = '};\n\nexport const STATIC_SVG_BOTTLES';

const startIdx = svgContent.indexOf(marker);
const endIdx = svgContent.indexOf(endMarker, startIdx);

const currentObjText = svgContent.substring(startIdx + marker.length, endIdx);
const lines = currentObjText.split('\n');

const currentMap: Record<string, string> = {};
for (const line of lines) {
  const match = line.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
  if (match) {
    currentMap[match[1]] = match[2];
  }
}

for (const [k, v] of Object.entries(extraMappings)) {
  currentMap[k] = v;
}

const sortedEntries = Object.entries(currentMap).sort(([a], [b]) => a.localeCompare(b));
const formattedEntries = sortedEntries.map(([k, v]) => `  "${k}": "${v}",`).join('\n');

const newSvgContent =
  svgContent.substring(0, startIdx + marker.length) +
  '\n' +
  formattedEntries +
  '\n' +
  svgContent.substring(endIdx);

fs.writeFileSync(svgPath, newSvgContent, 'utf8');
console.log('Added extra mappings to lib/crops/chemBottleSvg.ts');
