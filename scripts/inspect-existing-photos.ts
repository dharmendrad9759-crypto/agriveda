import { REAL_BOTTLE_PHOTOS } from '../lib/crops/chemBottleSvg';
import fs from 'fs';

const files = fs.readdirSync('public/images/chem/real');
console.log('Total files in public/images/chem/real:', files.length);

const keys = Object.keys(REAL_BOTTLE_PHOTOS);
console.log('Total keys in REAL_BOTTLE_PHOTOS:', keys.length);

const patterns = ['triflox', 'tebu', 'cyfluthrin', 'metiram', 'fluxa', 'chlorfenapyr', 'etoxazole', 'hexy', 'propamocarb', 'fenamidone', 'fenpropathrin', 'zampro', 'ametoctradin'];

for (const p of patterns) {
  const matchingFiles = files.filter(f => f.includes(p));
  const matchingKeys = keys.filter(k => k.includes(p));
  console.log(`Pattern [${p}]: files = [${matchingFiles.join(', ')}], keys = [${matchingKeys.join(', ')}]`);
}
