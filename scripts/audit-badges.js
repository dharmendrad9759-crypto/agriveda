const fs = require('fs');
const path = require('path');

function findChips(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (!['.next', 'node_modules', '.git'].includes(f.name)) findChips(full);
    } else if (f.name.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.match(/<span[^>]*>(.*?)<\/span>/g);
      if (matches) {
        matches.forEach(m => {
          const text = m.replace(/<[^>]+>/g, '').trim();
          if (text && (
            text.includes('तकनीकी') ||
            text.includes('सटीक') ||
            text.includes('टैंक') ||
            text.includes('फॉर्मूलेशन') ||
            text.includes('असली') ||
            text.includes('Technical') ||
            text.includes('Generic') ||
            text.includes('शुद्ध')
          )) {
            console.log(full + ' -> ' + text);
          }
        });
      }
    }
  }
}

console.log('--- Checking components & app for leftover badges ---');
findChips('./components');
findChips('./app');
