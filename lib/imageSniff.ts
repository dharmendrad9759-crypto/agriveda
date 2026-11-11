/** Detect image type from base64 payload magic bytes — never trust client MIME. */

const HEIC_BRANDS = new Set(["heic", "heix", "heif", "mif1"]);

export function sniffImageMime(base64: string): string | null {
  const sample = base64.replace(/^data:[^;]+;base64,/, "").slice(0, 64);
  let buf: Buffer;
  try {
    buf = Buffer.from(sample, "base64");
  } catch {
    return null;
  }
  if (buf.length < 12) return null;

  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "image/png";
  }
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12).toLowerCase();
    if (HEIC_BRANDS.has(brand)) return "image/heic";
  }
  return null;
}
