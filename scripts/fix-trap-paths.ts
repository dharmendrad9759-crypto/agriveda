import fs from 'fs';

const filePath = 'lib/crops/chemBottleSvg.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/"\/images\/traps\/fruit-fly-trap\.jpg"/g, '"/images/chem/real/pheromone-trap.jpg"');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed trap paths in chemBottleSvg.ts');
