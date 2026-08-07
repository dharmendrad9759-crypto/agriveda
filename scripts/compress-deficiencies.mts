/**
 * In-place JPEG compress for public/images/deficiencies (and nested symptoms/).
 * Target: max width 1280, mozjpeg q=72, strip metadata.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve("public/images/deficiencies");
const MAX_W = 1280;
const QUALITY = 72;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.jpe?g$/i.test(name)) out.push(p);
  }
  return out;
}

async function compressOne(file: string) {
  const before = fs.statSync(file).size;
  const buf = await sharp(file)
    .rotate()
    .resize({ width: MAX_W, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  if (buf.length >= before) {
    return { file, before, after: before, saved: false };
  }
  const tmp = `${file}.tmp.jpg`;
  fs.writeFileSync(tmp, buf);
  try {
    fs.renameSync(tmp, file);
  } catch {
    // Windows sometimes locks; replace via unlink + rename
    try {
      fs.unlinkSync(file);
    } catch {
      /* ignore */
    }
    fs.renameSync(tmp, file);
  }
  return { file, before, after: buf.length, saved: true };
}

async function main() {
  const files = walk(ROOT);
  console.log("files", files.length);
  let savedBytes = 0;
  let n = 0;
  let failed = 0;
  for (const f of files) {
    try {
      const r = await compressOne(f);
      if (r.saved) savedBytes += r.before - r.after;
    } catch (e) {
      failed++;
      console.error("fail", path.basename(f), (e as Error).message);
    }
    n++;
    if (n % 50 === 0 || n === files.length) {
      console.log(
        `progress ${n}/${files.length} savedMB=${(savedBytes / 1e6).toFixed(1)} fail=${failed}`
      );
    }
  }
  console.log("done savedMB", (savedBytes / 1e6).toFixed(1), "fail", failed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
