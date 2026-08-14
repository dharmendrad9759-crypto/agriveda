#!/usr/bin/env node
/**
 * Prepare capacitor-www for bundled/offline-first shell.
 * Copies public assets + offline emergency pack into capacitor-www/.
 *
 * Usage: CAPACITOR_USE_BUNDLED=true npm run cap:bundle
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const outDir = path.join(root, "capacitor-www");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
copyDir(publicDir, outDir);

const indexHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Agriveda</title>
  <link rel="manifest" href="/manifest.webmanifest" />
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #f0fdf4; color: #064e3b; }
    h1 { font-size: 1.25rem; }
    a, button { display: block; width: 100%; min-height: 52px; margin: 8px 0; padding: 14px; font-size: 1rem;
      font-weight: 700; border-radius: 12px; border: none; background: #059669; color: #fff; text-align: center;
      text-decoration: none; }
    .offline { background: #fff; border: 1px solid #a7f3d0; padding: 16px; border-radius: 16px; margin-top: 16px; }
  </style>
</head>
<body>
  <h1>Agriveda — ऑफ़लाइन पैक</h1>
  <p>इंटरनेट हो तो पूरा ऐप खुलेगा। बिना net — नीचे सेव जानकारी।</p>
  <a href="/offline/emergency.json">आपातकालीन नंबर</a>
  <button type="button" onclick="location.reload()">दोबारा खोलें</button>
  <div class="offline" id="emergency">लोड हो रहा है…</div>
  <script>
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
    fetch('/offline/emergency.json').then(r=>r.json()).then(d=>{
      const el=document.getElementById('emergency');
      el.innerHTML='<strong>'+d.titleHi+'</strong><ul>'+
        d.numbers.map(n=>'<li>'+n.nameHi+' — <a href="tel:'+n.number.replace(/[^0-9+]/g,'')+'">'+n.number+'</a></li>').join('')+
        '</ul>';
    }).catch(()=>{ document.getElementById('emergency').textContent='ऑफ़लाइन डेटा उपलब्ध नहीं'; });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), indexHtml, "utf8");
console.log("[cap:bundle-www] capacitor-www ready at", outDir);
