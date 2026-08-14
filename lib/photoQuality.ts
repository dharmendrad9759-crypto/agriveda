export interface PhotoQualityResult {
  ok: boolean;
  brightness: number;
  messageHi: string;
  messageEn: string;
}

/** Sample average luminance 0–255 from image file (client-side). */
export async function analyzePhotoBrightness(file: File): Promise<PhotoQualityResult> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-fail"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("decode-fail"));
    el.src = dataUrl;
  });

  const maxSide = 320;
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { ok: true, brightness: 128, messageHi: "", messageEn: "" };
  }
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  let sum = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  const brightness = sum / pixels;

  if (brightness < 55) {
    return {
      ok: false,
      brightness,
      messageHi:
        "फोटो बहुत अँधेरी है — फ्लैश/टॉर्च चालू करें या धूप में दोबारा फोटो लें।",
      messageEn: "Photo is too dark — turn on torch/flash or retake in daylight.",
    };
  }
  if (brightness > 230) {
    return {
      ok: false,
      brightness,
      messageHi: "फोटो बहुत चमकीली/धुंधली — छाया में या कोण बदलकर फोटो लें।",
      messageEn: "Photo is overexposed — try shade or a different angle.",
    };
  }

  return {
    ok: true,
    brightness,
    messageHi: "फोटो साफ लग रही है ✓",
    messageEn: "Photo looks clear ✓",
  };
}
