"use client";

import { useMemo, useState } from "react";
import type { CurativeMedicine } from "@/lib/crops/cropProblemMedicines";
import { getShopBrandExamples } from "@/lib/crops/cropProblemMedicines";
import { formulationHint, isLikelyPremix, checkShopSwap, type HubKind } from "@/lib/crops/intelligenceHub";
import { parseFarmerDose } from "@/lib/crops/tankDose";
import { scaleAdvisoryLine } from "@/lib/field-advisor/scaleAdvice";
import { Mic, X } from "lucide-react";
import { ADVICE_DISCLAIMER_HI } from "@/lib/crops/safetyCopy";
import { speakFarmerText } from "@/lib/speech/farmerVoice";
import ShareStrip from "@/components/share/ShareStrip";
import AppLink from "@/components/ui/AppLink";

export default function ShopCounterCard({
  open,
  onClose,
  cropHi,
  problemHi,
  cropSlug,
  problemId,
  medicine,
  problemKind,
  lastMoaGroups,
  tankLitres,
  fieldAcres = null,
  fieldLabel = "",
}: {
  open: boolean;
  onClose: () => void;
  cropHi: string;
  problemHi: string;
  cropSlug: string;
  problemId: string;
  medicine: CurativeMedicine;
  problemKind: HubKind;
  lastMoaGroups?: string[];
  tankLitres: number;
  fieldAcres?: number | null;
  fieldLabel?: string;
}) {
  const [swapText, setSwapText] = useState("");
  const parsed = parseFarmerDose(medicine.dose, { tankLitres, technical: medicine.technical });
  const form = formulationHint(medicine.technical);
  const premix = isLikelyPremix(medicine.technical);
  const fieldDose = scaleAdvisoryLine(
    parsed.acreDose || medicine.dosePerAcre || medicine.dose,
    fieldAcres
  );
  const brands = useMemo(() => {
    const fromMed = medicine.brands.filter(Boolean);
    if (fromMed.length > 0) return fromMed.slice(0, 3);
    return getShopBrandExamples(cropSlug, problemId, medicine.technical);
  }, [medicine.brands, medicine.technical, cropSlug, problemId]);
  const verdict = useMemo(
    () =>
      checkShopSwap({
        offeredText: swapText,
        recommended: [{ ...medicine, brands }],
        lastMoaGroups,
        problemKind,
      }),
    [swapText, medicine, brands, lastMoaGroups, problemKind]
  );

  if (!open) return null;

  const tone =
    verdict.tone === "green"
      ? "bg-emerald-600 text-white"
      : verdict.tone === "yellow"
        ? "bg-amber-500 text-amber-950"
        : verdict.tone === "red"
          ? "bg-rose-600 text-white"
          : "bg-slate-200 text-slate-800";

  return (
    <div className="fixed inset-0 z-[80] flex items-stretch justify-center bg-black/70 p-3">
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white text-[#052e1c]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
          aria-label="बंद करें"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex min-h-0 flex-1 flex-col justify-center px-5 py-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">दुकानदार को दिखाएँ</p>
          <p className="mt-1 text-[13px] font-bold text-slate-500">
            {cropHi} · {problemHi}
          </p>
          <p className="mt-4 font-mono text-[28px] font-black leading-tight tracking-tight text-slate-950">
            {medicine.technical}
          </p>
          {medicine.nameHi ? (
            <p className="mt-2 text-[18px] font-black leading-snug text-emerald-900">{medicine.nameHi}</p>
          ) : null}
          <p className="mt-4 text-[15px] font-black text-slate-800">किसी भी कंपनी का यही साल्ट</p>
          {brands.length > 0 ? (
            <p className="mt-1 text-[14px] font-bold text-slate-600">उदाहरण: {brands.join(" · ")}</p>
          ) : null}
          <p className="mt-4 text-[13px] font-bold text-slate-500">
            {fieldLabel ? `आपके ${fieldLabel} के लिए` : "प्रति एकड़"}
          </p>
          <p className="text-[26px] font-black text-amber-800">{fieldDose}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => speakFarmerText(`${medicine.technical}. ${fieldDose}`, true)}
              className="h-11 rounded-xl bg-emerald-800 text-[14px] font-bold text-white"
            >
              सुनो
            </button>
            <AppLink
              href={`/khata?item=${encodeURIComponent(medicine.technical)}`}
              className="flex h-11 items-center justify-center rounded-xl border border-emerald-800 text-[14px] font-bold text-emerald-900"
            >
              खर्च में डालो
            </AppLink>
          </div>
          {form ? (
            <p className="mt-5 rounded-2xl bg-rose-50 px-3 py-2 text-[15px] font-black text-rose-800">
              {premix ? "यह मिक्स दवा है — " : ""}
              {form} ही चाहिए
              {form === "SG" ? " — EC मत देना, दानेदार SG लो" : ""}
            </p>
          ) : null}
        </div>
        <div className="border-t border-slate-100 px-4 py-3">
          <p className="text-[12px] font-black text-slate-800">दुकानदार कोई और दवा दे रहा है?</p>
          <div className="mt-1.5 flex gap-2">
            <input
              value={swapText}
              onChange={(e) => setSwapText(e.target.value)}
              placeholder="साल्ट बोलें या लिखें"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base font-semibold outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white"
              aria-label="साल्ट बोलें"
              onClick={() => {
                type Heard = { results: Array<Array<{ transcript?: string }>> };
                type Rec = { lang: string; start: () => void; onresult: ((ev: Heard) => void) | null };
                const host = window as unknown as {
                  SpeechRecognition?: new () => Rec;
                  webkitSpeechRecognition?: new () => Rec;
                };
                const SR = host.SpeechRecognition || host.webkitSpeechRecognition;
                if (!SR) return;
                const rec = new SR();
                rec.lang = "hi-IN";
                rec.onresult = (ev) => {
                  const said = ev.results[0]?.[0]?.transcript;
                  if (said) setSwapText(said);
                };
                rec.start();
              }}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
          {swapText.trim().length >= 3 ? (
            <p className={`mt-2 rounded-xl px-3 py-2 text-[13px] font-black ${tone}`}>{verdict.messageHi}</p>
          ) : null}
          <p className="mt-2 text-[11px] font-semibold leading-snug text-slate-500">{ADVICE_DISCLAIMER_HI}</p>
          <ShareStrip
            text={`${cropHi} · ${problemHi}\n${medicine.technical}\n${fieldDose}\nकिसी भी कंपनी का यही साल्ट`}
            onDownload={() => {
              void shareSlipPng({
                technical: medicine.technical,
                nameHi: medicine.nameHi,
                acre: fieldDose,
                tank: parsed.tankDose,
                cropHi,
                problemHi,
                fieldLine: fieldLabel ? `${fieldLabel}: ${fieldDose}` : fieldDose,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export async function shareSlipPng(opts: {
  technical: string;
  nameHi: string;
  acre: string;
  tank: string;
  cropHi: string;
  problemHi: string;
  fieldLine?: string;
}): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#052e1c";
  ctx.fillRect(0, 0, 720, 900);
  ctx.fillStyle = "#ecfdf5";
  ctx.fillRect(24, 24, 672, 852);
  ctx.fillStyle = "#047857";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("Agriveda दवा पर्ची", 48, 80);
  ctx.fillStyle = "#134e4a";
  ctx.font = "22px sans-serif";
  ctx.fillText(`${opts.cropHi} · ${opts.problemHi}`.slice(0, 42), 48, 130);
  ctx.fillStyle = "#052e1c";
  ctx.font = "bold 36px monospace";
  wrapText(ctx, opts.technical, 48, 220, 620, 44);
  ctx.font = "bold 28px sans-serif";
  ctx.fillText(opts.nameHi.slice(0, 40), 48, 380);
  ctx.fillStyle = "#92400e";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText(`खेत: ${(opts.fieldLine || opts.acre)}`.slice(0, 36), 48, 460);
  ctx.fillText(`टंकी: ${opts.tank}`.slice(0, 34), 48, 520);
  ctx.fillStyle = "#334155";
  ctx.font = "22px sans-serif";
  ctx.fillText("किसी भी कंपनी का यही साल्ट", 48, 590);
  ctx.fillStyle = "#9f1239";
  ctx.font = "20px sans-serif";
  wrapText(ctx, ADVICE_DISCLAIMER_HI, 48, 650, 620, 28);
  ctx.fillStyle = "#047857";
  ctx.fillText("ऐप: agriveda.in", 48, 820);
  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const file = new File([blob], "agriveda-parchi.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        void navigator.share({ files: [file], title: "Agriveda पर्ची" }).finally(() => resolve());
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agriveda-parchi.png";
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > max) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}
