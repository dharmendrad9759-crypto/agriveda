"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import ProblemFlowShell, { MockCard, MockTab } from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblem } from "@/data/crop-curative-problems";
import { getCurativeMedicines } from "@/lib/crops/cropProblemMedicines";
import { useToast } from "@/components/ui/Toast";
import { readStorage, writeStorage } from "@/lib/storage";
import { Check, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

type InfoTab = "symptoms" | "cause" | "damage" | "prevention";
type CureTab = "chemical" | "organic" | "prevention";

const SAVED_KEY = "agriveda-saved-crop-solutions";

/** पूरा, सरल वाक्य — किसान समझे और काम करे */
function toFarmerLine(raw: string, kind: "see" | "do" | "warn" = "do"): string {
  let s = raw.replace(/[.]+$/g, "").replace(/\s+/g, " ").trim();
  if (!s) return "";

  // Known short phrases → full clear lines
  const exact: [RegExp, string][] = [
    [/^(साफ|स्वस्थ|प्रमाणित)\s*बीज$/i, "साफ बीज का प्रयोग करें"],
    [/^संतुलित\s*खाद$/i, "संतुलित खाद का प्रयोग करें"],
    [/^ज्यादा\s*(यूरिया|N|नाइट्रोजन)\s*न\s*दें$/i, "ज़्यादा यूरिया एक साथ न डालें"],
    [/^ज्यादा\s*(यूरिया|N|नाइट्रोजन)$/i, "ज़्यादा यूरिया डालने से बढ़ता है"],
    [/^हवा\s*दें$/i, "पौधों में हवा आने दें"],
    [/^घनत्व\s*नियंत्रण$/i, "पौधे बहुत पास-पास न लगाएँ"],
    [/^भीड़\s*कम$/i, "पौधे बहुत पास-पास न लगाएँ"],
    [/^खेत\s*साफ$/i, "खेत साफ रखें"],
    [/^खरपतवार\s*साफ$/i, "खरपतवार साफ रखें"],
    [/^निगरानी$/i, "खेत में नियमित जाँच करें"],
    [/^देखभाल$/i, "खेत में नियमित जाँच करें"],
    [/छोटे?\s*फल\s*छेद/i, "छोटे फलों में छेद होना"],
    [/फूल\s*पर\s*अंडे/i, "फूल पर अंडे दिखना"],
    [/पहले\s*धब्बे/i, "पहले धब्बे दिखते ही इलाज शुरू करें"],
    [/धब्बे\s*(फैलते|दिखते)/i, "धब्बे फैलने लगे तो तुरंत स्प्रे करें"],
    [/संख्या\s*बढ़ते/i, "कीड़े बढ़ जाएँ तो तुरंत इलाज करें"],
    [/देर\s*से\s*(इलाज|स्प्रे)/i, "देर से स्प्रे करोगे तो ज़्यादा नुकसान होगा"],
    [/फल\s*में\s*छेद/i, "फल में छेद होना"],
    [/अंदर\s*इल्ली/i, "अंदर कीड़ा होना"],
    [/फल\s*सड़/i, "फल सड़ना शुरू होना"],
    [/^हाथ\s*से(\s*इल्ली)?$/i, "हाथ से कीड़े निकालें"],
    [/^संक्रमित\s*उखाड़ें$/i, "बीमार पौधे उखाड़कर अलग करें"],
    [/^संक्रमित\s*फल.*/i, "बीमार फल तोड़कर हटाएँ"],
    [/^संक्रमित\s*पत्ती.*/i, "बीमार पत्तियाँ हटाएँ"],
    [/^संक्रमित\s*तना.*/i, "बीमार हिस्सा काटकर हटाएँ"],
    [/^प्रतिरोधी\s*किस्म$/i, "मज़बूत / सही किस्म का बीज लगाएँ"],
    [/^फसल\s*चक्र$/i, "फसल चक्र अपनाएँ (Crop Rotation)"],
    [/^जल\s*निकासी$/i, "खेत में पानी न ठहराएँ (Drainage)"],
    [/^बीज\s*उपचार$/i, "बुवाई से पहले बीज उपचार करें (Seed Treatment)"],
    [/^ट्राइकोडर्मा.*/i, "ट्राइकोडर्मा का प्रयोग करें (Trichoderma) — स्थानीय सलाह से"],
    [/^नीम.*/i, "नीम आधारित छिड़काव करें (Neem Oil) — बोतल देखकर"],
    [/^Bt\s*—.*/i, "Bt दवा का प्रयोग करें (Bacillus thuringiensis)"],
    [/^पीला\s*जाल$/i, "पीला चिपचिपा जाल लगाएँ (Yellow Sticky Trap)"],
    [/^नीला\s*जाल$/i, "नीला जाल लगाएँ (Blue Sticky Trap)"],
    [/^फेरोमोन.*/i, "फेरोमोन ट्रैप लगाएँ (Pheromone Trap)"],
    [/^लेबल\s*अनुसार$/i, "बोतल के लेबल के अनुसार डालें"],
  ];

  for (const [re, out] of exact) {
    if (re.test(s)) return out;
  }

  // Soft word swaps (keep full meaning)
  s = s
    .replace(/संक्रमित/g, "बीमार")
    .replace(/प्रतिरोधी किस्म/g, "मज़बूत किस्म")
    .replace(/ज्यादा N\b/gi, "ज़्यादा यूरिया")
    .replace(/ज्यादा नाइट्रोजन/gi, "ज़्यादा यूरिया")
    .replace(/\s+पर$/u, "")
    .replace(/\s+होते ही$/u, "")
    .trim();

  // If still a bare noun-ish tip, make it an action sentence
  if (kind === "do" && s.length <= 22 && !/[।.!]|करें|करो|दें|न |है|होना|लग|डाल|लगाएँ|रखें/.test(s)) {
    if (/बीज/.test(s)) return `${s} का प्रयोग करें`;
    if (/खाद|उर्वरक|यूरिया/.test(s)) return `${s} का प्रयोग सही मात्रा में करें`;
    if (/पानी|सिंचाई/.test(s)) return `${s} नियंत्रित रखें`;
    return `${s} — ध्यान रखें`;
  }

  if (kind === "warn" && !/नुकसान|कम|बढ़/.test(s)) {
    return `${s} — देर से स्प्रे करोगे तो ज़्यादा नुकसान होगा`;
  }

  return s;
}

function splitLines(text: string, max = 3, kind: "see" | "do" | "warn" = "do"): string[] {
  return text
    .split(/[—–;।|/]+/)
    .map((x) => toFarmerLine(x.trim(), kind))
    .filter((x) => x.length > 1)
    .slice(0, max);
}

function parseChemLines(lines: string[]) {
  return lines.slice(0, 3).map((line, i) => {
    const name = line.split("—")[0]?.split("/")[0]?.trim() || line;
    const technical =
      name.match(/[A-Za-z][A-Za-z\s-]{2,}/)?.[0]?.trim() ||
      (i === 0 ? "Imidacloprid" : i === 1 ? "Spinosad" : "Mancozeb");
    return { name, technical, note: "बोतल के लेबल के अनुसार डालें" };
  });
}

function MiniPoints({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 rounded-xl bg-[#F3FBF6] px-3 py-2.5 text-[13px] font-semibold leading-snug text-[#1A3326]"
        >
          <span aria-hidden className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CropProblemDetailClient({
  cropSlug,
  problemId,
}: {
  cropSlug: string;
  problemId: string;
}) {
  const found = getCropProblem(cropSlug, problemId);
  if (!found) notFound();
  const { crop, problem: p } = found;
  const { showToast } = useToast();

  const [infoTab, setInfoTab] = useState<InfoTab>("symptoms");
  const [cureTab, setCureTab] = useState<CureTab>("chemical");
  const [saved, setSaved] = useState(false);
  const chemItems = useMemo(
    () => getCurativeMedicines(cropSlug, problemId, p.cureChemicalHi),
    [cropSlug, problemId, p.cureChemicalHi]
  );
  const shortName = p.nameHi.split("(")[0].trim();

  const infoPoints = useMemo(() => {
    if (infoTab === "symptoms") {
      return [
        ...splitLines(p.whatHi, 3, "see"),
        `अवस्था: ${p.stageHi}`,
      ].slice(0, 4);
    }
    if (infoTab === "cause") {
      return p.whyHi.map((w) => toFarmerLine(w, "see")).filter(Boolean).slice(0, 3);
    }
    if (infoTab === "damage") {
      return [
        ...splitLines(p.whenToActHi, 1, "do").map((x) =>
          x.includes("इलाज") || x.includes("स्प्रे") ? x : `${x} — तुरंत ध्यान दें`
        ),
        ...splitLines(p.tipHi, 1, "do"),
        "देर से स्प्रे करोगे तो ज़्यादा नुकसान होगा",
      ].slice(0, 3);
    }
    // रोकथाम
    return [...p.cureOrganicHi.slice(0, 2), p.tipHi]
      .map((x) => toFarmerLine(x, "do"))
      .filter(Boolean)
      .slice(0, 3);
  }, [infoTab, p]);

  const organicPoints = useMemo(
    () => p.cureOrganicHi.map((x) => toFarmerLine(x, "do")).filter(Boolean).slice(0, 4),
    [p.cureOrganicHi]
  );

  const preventPoints = useMemo(
    () =>
      [p.tipHi, ...p.cureOrganicHi.slice(0, 2), "देर से स्प्रे करोगे तो ज़्यादा नुकसान होगा"]
        .map((x) => toFarmerLine(x, "do"))
        .filter(Boolean)
        .slice(0, 4),
    [p.tipHi, p.cureOrganicHi]
  );

  const saveSolution = () => {
    const prev = readStorage<{ id: string; title: string; at: string }[]>(SAVED_KEY, []);
    const id = `${crop.slug}:${p.id}`;
    writeStorage(
      SAVED_KEY,
      [
        { id, title: `${crop.nameHi} · ${p.nameHi}`, at: new Date().toISOString() },
        ...prev.filter((x) => x.id !== id),
      ].slice(0, 30)
    );
    setSaved(true);
    showToast("समाधान सेव हो गया", "success");
  };

  const shareSolution = async () => {
    const text = `${crop.nameHi} — ${shortName}\n${infoPoints.slice(0, 2).join("\n")}\n\nAgriveda`;
    try {
      if (navigator.share) await navigator.share({ title: shortName, text });
      else {
        await navigator.clipboard.writeText(text);
        showToast("कॉपी हो गया", "success");
      }
    } catch {
      /* cancel */
    }
  };

  const symptomsList = useMemo(() => {
    return [
      ...splitLines(p.whatHi, 4, "see"),
      `अवस्था: ${p.stageHi}`,
    ].filter(Boolean);
  }, [p.whatHi, p.stageHi]);

  const causesList = useMemo(() => {
    return p.whyHi.map((w) => toFarmerLine(w, "see")).filter(Boolean);
  }, [p.whyHi]);

  const timingList = useMemo(() => {
    return [
      ...splitLines(p.whenToActHi, 2, "do").map((x) =>
        x.includes("इलाज") || x.includes("स्प्रे") ? x : `${x} — तुरंत ध्यान दें`
      ),
      ...splitLines(p.tipHi, 1, "do"),
      "देर से स्प्रे करने पर नुकसान कई गुना बढ़ सकता है",
    ].filter(Boolean);
  }, [p.whenToActHi, p.tipHi]);

  const shareToWhatsApp = () => {
    const chemText = chemItems
      .map(
        (c, i) =>
          `• विकल्प ${i + 1}: ${c.nameHi}\n  - टेक्निकल: ${c.technical}\n  - डोज़: ${c.dose}${c.brands?.length ? `\n  - बाज़ार ब्रांड: ${c.brands.join(", ")}` : ""}`
      )
      .join("\n\n");
    const text = `🌾 *फसल समस्या समाधान — AgriVeda*\n\n*फसल:* ${crop.nameHi}\n*रोग/कीट:* ${shortName}\n\n*लक्षण:*\n${symptomsList.slice(0, 2).map((s) => `• ${s}`).join("\n")}\n\n*दुकानदार पर्ची (अनुशंसित दवा व सही डोज़):*\n${chemText}\n\n_AgriVeda किसान ऐप से प्राप्त_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <ProblemFlowShell title={shortName} step={saved ? 5 : 4} backHref={`/crop-problems/${crop.slug}`}>
      <div className="space-y-3.5 pb-6">
        {/* Photo Header */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#D8E8DE] bg-white shadow-sm">
          <Image src={p.image} alt={shortName} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3.5 pb-3 pt-10">
            <div>
              <p className="text-[17px] font-black text-white leading-tight drop-shadow-sm">{shortName}</p>
              <p className="text-[11px] font-semibold text-white/80">{p.nameEn}</p>
            </div>
            <span className="rounded-lg bg-emerald-700/90 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm backdrop-blur-xs">
              {crop.nameHi} · {p.tagHi}
            </span>
          </div>
        </div>

        {/* 1. लक्षण व पहचान */}
        <MockCard className="!p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              1
            </span>
            <h2 className="text-sm font-black text-[#0B3D28]">खेत में कैसे पहचानें (लक्षण)</h2>
          </div>
          <MiniPoints items={symptomsList} />
        </MockCard>

        {/* 2. कारण व कब दवा डालें */}
        <MockCard className="!p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-600/10 text-amber-800 dark:text-amber-300 text-xs font-bold">
              2
            </span>
            <h2 className="text-sm font-black text-[#0B3D28]">कारण व नुकसान का समय</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                रोग फैलने का कारण:
              </p>
              <MiniPoints items={causesList} />
            </div>
            <div className="pt-2 border-t border-[#D8E8DE]">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                तुरंत कदम उठाएँ:
              </p>
              <MiniPoints items={timingList} />
            </div>
          </div>
        </MockCard>

        {/* 3. रासायनिक दवा व सही खुराक */}
        <MockCard className="!border-[#A7D8B8] !bg-[#F3FBF6] !p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
              3
            </span>
            <h2 className="text-sm font-black text-[#0B5C3B]">रासायनिक दवा व सही मात्रा (Chemical)</h2>
          </div>
          <p className="text-[11px] font-medium text-[#3D6B54] mb-3">
            नीचे दी गई प्रमाणित दवाओं में से किसी एक का प्रयोग करें:
          </p>

          <div className="space-y-3">
            {chemItems.map((c, i) => (
              <div
                key={`${c.technical}-${i}`}
                className="rounded-2xl border border-[#D8E8DE] bg-white p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  <ChemBottleThumb technical={c.technical} size="sm" className="rounded-xl shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[9.5px] font-black text-emerald-800 border border-emerald-200">
                      विकल्प {i + 1} · अनुशंसित
                    </span>
                    <h3 className="text-[14px] font-black text-[#0B3D28] leading-tight mt-1">{c.nameHi}</h3>
                    {/* English Technical Name in bold clear badge */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">टेक्निकल नाम:</span>
                      <span className="rounded-md bg-emerald-100/90 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-black text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                        {c.technical}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accurate Dosage Box */}
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <span>⚡ अनुशंसित डोज़ (मात्रा):</span>
                  </div>
                  <div className="mt-0.5 text-[12.5px] font-extrabold text-amber-950 dark:text-amber-100 leading-snug">
                    {c.dose}
                  </div>
                </div>

                {/* Market Brands */}
                {c.brands && c.brands.length > 0 && (
                  <p className="text-[11px] text-[#3D6B54] font-medium leading-tight">
                    <span className="font-extrabold text-[#0B3D28]">बाज़ार में प्रसिद्ध ब्रांड: </span>
                    {c.brands.join(" · ")}
                  </p>
                )}

                {/* Safety / Note */}
                {c.safety && (
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-400 font-medium">
                    💡 {c.safety}
                  </p>
                )}
              </div>
            ))}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-2.5 text-[11px] font-bold text-amber-900 dark:text-amber-200">
              ⚠️ हमेशा साफ़ पानी (150–200 लीटर/एकड़) का प्रयोग करें। तेज धूप में छिड़काव न करें।
            </div>
          </div>
        </MockCard>

        {/* 4. जैविक व देसी उपाय */}
        {organicPoints.length > 0 && (
          <MockCard className="!p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600/10 text-teal-800 dark:text-teal-300 text-xs font-bold">
                4
              </span>
              <h2 className="text-sm font-black text-[#0B3D28]">जैविक व देसी उपाय (Organic)</h2>
            </div>
            <MiniPoints items={organicPoints} />
          </MockCard>
        )}

        {/* 5. आगे के लिए बचाव */}
        {preventPoints.length > 0 && (
          <MockCard className="!p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-600/10 text-sky-800 dark:text-sky-300 text-xs font-bold">
                5
              </span>
              <h2 className="text-sm font-black text-[#0B3D28]">आगे के लिए रोकथाम व सुझाव</h2>
            </div>
            <MiniPoints items={preventPoints} />
          </MockCard>
        )}

        {/* Action Card */}
        <MockCard className="!p-4 text-center shadow-md">
          {saved ? (
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-xs">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              <p className="text-[14px] font-black text-[#0B5C3B]">समाधान सुरक्षित हो गया ✓</p>
            </div>
          ) : (
            <p className="mb-3 text-xs font-extrabold text-[#3D6B54]">दवा दुकानदार को भेजें या सहेजें</p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-xs sm:text-[13px] font-black text-white shadow-md active:scale-95"
            >
              <span>दुकानदार को भेजें (WhatsApp)</span>
            </button>
            <button
              type="button"
              onClick={saveSolution}
              className="flex min-h-[46px] items-center justify-center rounded-xl border-2 border-[#0B5C3B] bg-white text-xs sm:text-[13px] font-black text-[#0B5C3B] active:scale-95"
            >
              {saved ? "सहेजा गया ✓" : "सहेजें (Save)"}
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <AppLink
              href="/ai-doctor"
              className="flex min-h-[42px] items-center justify-center rounded-xl bg-[#E8F5EE] text-xs font-black text-[#0B5C3B] active:scale-95"
            >
              📷 AI फोटो से जाँच
            </AppLink>
            <AppLink
              href={`/crop-problems/${crop.slug}`}
              className="flex min-h-[42px] items-center justify-center rounded-xl border border-[#C5DDD0] text-xs font-black text-[#0B3D28] active:scale-95"
            >
              ← और समस्याएँ देखें
            </AppLink>
          </div>
        </MockCard>
      </div>
    </ProblemFlowShell>
  );
}
