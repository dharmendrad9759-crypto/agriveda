import fs from 'fs';
import path from 'path';

// Load new mappings
const newMappings = JSON.parse(fs.readFileSync('scripts/new-bottle-mappings.json', 'utf8'));

// 1. Update lib/crops/chemBottleSvg.ts
const svgPath = 'lib/crops/chemBottleSvg.ts';
let svgContent = fs.readFileSync(svgPath, 'utf8');

// Parse existing REAL_BOTTLE_PHOTOS
const marker = 'export const REAL_BOTTLE_PHOTOS: Record<string, string> = {';
const endMarker = '};\n\nexport const STATIC_SVG_BOTTLES';

const startIdx = svgContent.indexOf(marker);
const endIdx = svgContent.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find REAL_BOTTLE_PHOTOS bounds in chemBottleSvg.ts');
}

const currentObjText = svgContent.substring(startIdx + marker.length, endIdx);
const lines = currentObjText.split('\n');

const currentMap: Record<string, string> = {};
for (const line of lines) {
  const match = line.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
  if (match) {
    currentMap[match[1]] = match[2];
  }
}

console.log(`Current REAL_BOTTLE_PHOTOS entries: ${Object.keys(currentMap).length}`);

// Merge new mappings
for (const [k, v] of Object.entries(newMappings)) {
  currentMap[k] = v as string;
}

console.log(`Merged REAL_BOTTLE_PHOTOS entries: ${Object.keys(currentMap).length}`);

// Reformat cleanly
const sortedEntries = Object.entries(currentMap).sort(([a], [b]) => a.localeCompare(b));
const formattedEntries = sortedEntries.map(([k, v]) => `  "${k}": "${v}",`).join('\n');

const newSvgContent =
  svgContent.substring(0, startIdx + marker.length) +
  '\n' +
  formattedEntries +
  '\n' +
  svgContent.substring(endIdx);

fs.writeFileSync(svgPath, newSvgContent, 'utf8');
console.log('Successfully updated lib/crops/chemBottleSvg.ts');
