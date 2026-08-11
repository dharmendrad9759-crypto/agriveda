/** Small JPEG data-URL thumbs for AI Doctor history (survive reload; fit localStorage). */

const MAX_SIDE = 240;
const QUALITY = 0.72;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("thumb-decode-failed"));
    el.src = src;
  });
}

function canvasToJpegDataUrl(img: HTMLImageElement): string | null {
  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", QUALITY);
}

/** Persistable thumb from File (preferred). */
export async function fileToHistoryThumb(file: File): Promise<string> {
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("read-failed"));
      reader.readAsDataURL(file);
    });
    const img = await loadImage(dataUrl);
    return canvasToJpegDataUrl(img) ?? dataUrl;
  } catch {
    return "";
  }
}

/** Persistable thumb from preview src (data: kept, blob: rasterized). */
export async function srcToHistoryThumb(src: string | null | undefined): Promise<string> {
  if (!src) return "";
  if (src.startsWith("data:image/")) {
    try {
      const img = await loadImage(src);
      return canvasToJpegDataUrl(img) ?? src;
    } catch {
      return src.length < 180_000 ? src : "";
    }
  }
  if (!src.startsWith("blob:")) return "";
  try {
    const img = await loadImage(src);
    return canvasToJpegDataUrl(img) ?? "";
  } catch {
    return "";
  }
}
