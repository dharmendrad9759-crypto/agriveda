"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import ProblemFlowShell, { MockCard } from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblem } from "@/data/crop-curative-problems";
import { getCleanHindiTitle } from "@/components/crop-problems/CropProblemGalleryClient";
import { getCurativeMedicines } from "@/lib/crops/cropProblemMedicines";
import { cleanTechnicalName } from "@/data/mix-advisor/mix-plans";
import { parseFarmerDose } from "@/lib/crops/tankDose";
import { speakFarmerText, stopFarmerSpeech } from "@/lib/speech/farmerVoice";
import { useToast } from "@/components/ui/Toast";
import { readStorage, writeStorage } from "@/lib/storage";
import {
  Check,
  VolumeX,
  Share2,
  FlaskConical,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CropDoctorSparkleIcon } from "@/components/brand/icons";
import { notFound } from "next/navigation";
import ThreatPhotoGallery from "@/components/crops/ThreatPhotoGallery";

const SAVED_KEY = "agriveda-saved-crop-solutions";

/** पूरा, सरल वाक्य — किसान समझे और काम करे */
function toFarmerLine(raw: string, kind: "see" | "do" | "warn" = "do"): string {
  let s = raw.replace(/[.]+$/g, "").replace(/\s+/g, " ").trim();
  if (!s) return "";

  const exact: [RegExp, string][] = [
    [/^(साफ|स्वस्थ|प्रमाणित)\s*बीज$/i, "साफ और प्रमाणित बीज का प्रयोग करें"],
    [/^संतुलित\s*खाद$/i, "संतुलित खाद (NPK) का प्रयोग करें"],
    [/^ज्यादा\s*(यूरिया|N|नाइट्रोजन)\s*न\s*दें$/i, "ज़्यादा यूरिया एक साथ न डालें, इससे बीमारी बढ़ती है"],
    [/^ज्यादा\s*(यूरिया|N|नाइट्रोजन)$/i, "ज़्यादा यूरिया डालने से पौधों में बीमारी बढ़ती है"],
    [/^हवा\s*दें$/i, "पौधों में धूप और हवा आने दें"],
    [/^घनत्व\s*नियंत्रण$/i, "पौधे बहुत पास-पास न लगाएँ"],
    [/^भीड़\s*कम$/i, "पौधे बहुत पास-पास न लगाएँ"],
    [/^खेत\s*साफ$/i, "खेत को खरपतवार मुक्त और साफ रखें"],
    [/^खरपतवार\s*साफ$/i, "खेत में खरपतवार साफ रखें"],
    [/^निगरानी$/i, "खेत में नियमित जाँच करें"],
    [/^देखभाल$/i, "खेत में नियमित जाँच करें"],
    [/छोटे?\s*फल\s*छेद/i, "छोटे फलों में छेद दिखना"],
    [/फूल\s*पर\s*अंडे/i, "फूलों और पत्तियों पर कीट के अंडे दिखना"],
    [/पहले\s*धब्बे/i, "पहले धब्बे दिखते ही तुरंत स्प्रे करें"],
    [/धब्बे\s*(फैलते|दिखते)/i, "धब्बे फैलने लगें तो तुरंत दवा का छिड़काव करें"],
    [/संख्या\s*बढ़ते/i, "कीड़ों की संख्या बढ़ते ही तुरंत उपचार करें"],
    [/देर\s*से\s*(इलाज|स्प्रे)/i, "देर से स्प्रे करने पर फसल को भारी नुकसान हो सकता है"],
    [/फल\s*में\s*छेद/i, "फलों में सुंडी के छेद होना"],
    [/अंदर\s*इल्ली/i, "तने या फल के अंदर इल्ली होना"],
    [/फल\s*सड़/i, "फल सड़ना शुरू होना"],
    [/^हाथ\s*से(\s*इल्ली)?$/i, "हाथ से कीड़े या इल्ली बीनकर नष्ट करें"],
    [/^संक्रमित\s*उखाड़ें$/i, "बीमार पौधे उखाड़कर खेत से दूर नष्ट करें"],
    [/^संक्रमित\s*फल.*/i, "बीमार फल तोड़कर खेत से दूर फेंकें"],
    [/^संक्रमित\s*पत्ती.*/i, "बीमार पत्तियाँ तोड़कर हटाएँ"],
    [/^संक्रमित\s*तना.*/i, "बीमार हिस्सा काटकर अलग करें"],
    [/^प्रतिरोधी\s*किस्म$/i, "रोग-रोधी मज़बूत किस्म का बीज लगाएँ"],
    [/^फसल\s*चक्र$/i, "फसल चक्र अपनाएँ (Crop Rotation)"],
    [/^जल\s*निकासी$/i, "खेत में जल-निकासी की अच्छी व्यवस्था रखें"],
    [/^बीज\s*उपचार$/i, "बुवाई से पहले बीज उपचार (Seed Treatment) ज़रूर करें"],
    [/^ट्राइकोडर्मा.*/i, "ट्राइकोडर्मा 5–10 ग्राम प्रति किलो बीज उपचार या गोबर खाद में मिलाकर डालें"],
    [/^नीम.*/i, "नीम तेल (Neem Oil 10,000 PPM) 2–3 मिली प्रति लीटर पानी में मिलाकर स्प्रे करें"],
    [/^Bt\s*—.*/i, "Bt जैव कीटनाशक (Bacillus thuringiensis) 2 ग्राम प्रति लीटर पानी का प्रयोग करें"],
    [/^पीला\s*जाल$/i, "पीला चिपचिपा जाल लगाएँ (Yellow Sticky Trap - 6–8 प्रति एकड़)"],
    [/^नीला\s*जाल$/i, "नीला चिपचिपा जाल लगाएँ (Blue Sticky Trap - थ्रिप्स हेतु)"],
    [/^फेरोमोन.*/i, "फेरोमोन ट्रैप लगाएँ (Pheromone Trap - 4–5 प्रति एकड़)"],
    [/^लेबल\s*अनुसार$/i, "बोतल पर लिखे लेबल के अनुसार सही नाप डालें"],
  ];

  for (const [re, out] of exact) {
    if (re.test(s)) return out;
  }

  s = s
    .replace(/संक्रमित/g, "बीमार")
    .replace(/प्रतिरोधी किस्म/g, "मज़बूत किस्म")
    .replace(/ज्यादा N\b/gi, "ज़्यादा यूरिया")
    .replace(/ज्यादा नाइट्रोजन/gi, "ज़्यादा यूरिया")
    .replace(/\s+पर$/u, "")
    .replace(/\s+होते ही$/u, "")
    .trim();

  if (kind === "do" && s.length <= 25 && !/[।.!]|करें|करो|दें|न |है|होना|लग|डाल|लगाएँ|रखें/.test(s)) {
    if (/बीज/.test(s)) return `${s} का प्रयोग करें`;
    if (/खाद|उर्वरक|यूरिया/.test(s)) return `${s} का प्रयोग संतुलित मात्रा में करें`;
    if (/पानी|सिंचाई/.test(s)) return `${s} नियंत्रित रखें`;
    return `${s} — इस बात का पूरा ध्यान रखें`;
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

function MiniPoints({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item, idx) => (
        <li
          key={`${item}-${idx}`}
          className="flex items-start gap-2 rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-[12px] font-semibold leading-snug text-emerald-950 dark:text-emerald-100"
        >
          <span aria-hidden className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const SINGLE_COMBO_FORMULATIONS = [
  "alika",
  "amistar top",
  "galileo way",
  "nativo",
  "ridomil gold",
  "roket",
  "ampligo",
  "merivon",
  "custodia",
  "lancer gold",
  "lesenta",
  "thiamethoxam 12.6% + lambda",
  "azoxystrobin 18.2% + difenoconazole",
  "picoxystrobin 7% + propiconazole 12%",
  "tebuconazole 50% + trifloxystrobin 25%",
  "metalaxyl 8% + mancozeb 64%",
  "profenofos 40% + cypermethrin 4%",
  "chlorantraniliprole 9.3% + lambda",
  "fluxapyroxad + pyraclostrobin",
  "azoxystrobin 11% + tebuconazole 18.3%",
  "fipronil 40% + imidacloprid 40%",
  "acephate 50% + imidacloprid 1.8%",
  "pyriproxyfen 10% + bifenthrin 10%",
];

function isTankMix(tech: string): boolean {
  if (!tech.includes("+")) return false;
  const lower = tech.toLowerCase();
  for (const s of SINGLE_COMBO_FORMULATIONS) {
    if (lower.includes(s)) return false;
  }
  return true;
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

  const [saved, setSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState<Record<number, boolean>>({ 0: true });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    symptoms: false,
    causes: false,
    organic: false,
    precautions: false,
  });

  const toggleOption = (idx: number) => {
    setExpandedOptions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Stop voice when unmounting
  useEffect(() => {
    return () => {
      stopFarmerSpeech();
    };
  }, []);

  const chemItems = useMemo(
    () => getCurativeMedicines(cropSlug, problemId, p.cureChemicalHi),
    [cropSlug, problemId, p.cureChemicalHi]
  );
  const shortName = getCleanHindiTitle(p.nameHi);

  // Primary doctor medicine info
  const primaryChem = chemItems[0];
  const primaryDose = useMemo(
    () => (primaryChem ? parseFarmerDose(primaryChem.dose) : null),
    [primaryChem]
  );

  // Spoken voice script in warm, authentic human agronomist Hindi
  const doctorVoiceScript = useMemo(() => {
    const chemName = primaryChem ? primaryChem.technical : "अनुशंसित दवा";
    const action = primaryDose ? primaryDose.voiceActionLine : "दवा को सही मात्रा में डालें।";

    return `राम-राम किसान भाई! ${crop.nameHi} में ${shortName} की समस्या के लिए डॉक्टर की मुख्य सलाह सुनें। इसके लिए सबसे असरदार दवा ${chemName} है। ${action} तीन से चार दिन में इसका पूरा असर दिखेगा और समस्या पर पूरा नियंत्रण हो जाएगा।`;
  }, [crop.nameHi, shortName, primaryChem, primaryDose]);

  const toggleDoctorAudio = () => {
    if (isPlayingAudio) {
      stopFarmerSpeech();
      setIsPlayingAudio(false);
    } else {
      const ok = speakFarmerText(doctorVoiceScript, true, () => {
        setIsPlayingAudio(false);
      });
      if (ok) {
        setIsPlayingAudio(true);
      } else {
        showToast("ऑडियो लोड नहीं हो सका", "info");
      }
    }
  };

  const symptomsList = useMemo(() => {
    return [
      ...splitLines(p.whatHi, 3, "see"),
      `फसल अवस्था: ${p.stageHi}`,
    ].filter(Boolean);
  }, [p.whatHi, p.stageHi]);

  const causesList = useMemo(() => {
    const lines = p.whyHi.map((w) => toFarmerLine(w, "see")).filter(Boolean);
    return lines.length > 0 ? lines.slice(0, 3) : ["मौसम में अधिक नमी और तापमान में बदलाव", "खेत में हवा व धूप का कम पहुँचना"];
  }, [p.whyHi]);

  const timingList = useMemo(() => {
    return [
      ...splitLines(p.whenToActHi, 2, "do").map((x) =>
        x.includes("इलाज") || x.includes("स्प्रे") ? x : `${x} — तुरंत ध्यान दें`
      ),
      p.tipHi ? toFarmerLine(p.tipHi, "do") : "",
      "देर से स्प्रे करने पर फसल को नुकसान कई गुना बढ़ सकता है",
    ].filter(Boolean).slice(0, 3);
  }, [p.whenToActHi, p.tipHi]);

  const organicPoints = useMemo(() => p.cureOrganicHi.map((x) => toFarmerLine(x, "do")).filter(Boolean).slice(0, 3), [p.cureOrganicHi]);

  const saveSolution = () => {
    const prev = readStorage<{ id: string; title: string; at: string }[]>(SAVED_KEY, []);
    const id = `${crop.slug}:${p.id}`;
    writeStorage(
      SAVED_KEY,
      [
        { id, title: `${crop.nameHi} · ${shortName}`, at: new Date().toISOString() },
        ...prev.filter((x) => x.id !== id),
      ].slice(0, 30)
    );
    setSaved(true);
    showToast("समाधान सुरक्षित हो गया ✓", "success");
  };

  const shareToWhatsApp = () => {
    const chemListText = chemItems
      .map((c, i) => {
        const d = parseFarmerDose(c.dose);
        return `*विकल्प ${i + 1}: ${c.technical}*\n  • तकनीकी नाम: ${cleanTechnicalName(c.nameHi || c.technical)}\n  • ${d.pill1.label}: ${d.pill1.value}\n  • ${d.pill2.label}: ${d.pill2.value}\n  • ${d.pill3.label}: ${d.pill3.value}\n  • सलाह: खाद-बीज दुकान पर केवल यह टेक्निकल नाम बताएं।`;
      })
      .join("\n\n");

    const specialInstructions = primaryDose?.useSticker
      ? "• 5 मिली सिलिकॉन स्टीकर (चिपको) प्रति टंकी ज़रूर मिलाएँ।\n• साफ़ पानी (150–200L/एकड़) का प्रयोग करें।"
      : `• ${primaryDose?.doctorTip || "दवा को बताई गई विधि अनुसार खेत में डालें।"}`;

    const text = `🌾 *AgriVeda — फसल डॉक्टर पर्ची (Prescription)*\n\n*फसल:* ${crop.nameHi}\n*रोग/कीट:* ${shortName}\n\n*अनुशंसित दवा व सही मात्रा (दुकानदार को दिखाएं):*\n${chemListText}\n\n*विशेष डॉक्टर निर्देश:*\n${specialInstructions}\n• 3–4 दिन में पूरा असर दिखेगा।\n\n_AgriVeda किसान सहायता ऐप से सत्यापित_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <ProblemFlowShell title={shortName} step={saved ? 5 : 4} backHref={`/crop-problems/${crop.slug}`}>
      <div className="space-y-4 pb-8">
        {/* Authentic Multi-Photo Field Gallery */}
        <ThreatPhotoGallery
          primaryImage={p.image}
          title={shortName}
          subtitle={p.nameEn}
          cropLabel={crop.nameHi}
          tagLabel={p.tagHi}
          hi={true}
        />

        {/* 🔊 Top Doctor Audio Note (Authentic Human Agronomist Voice) */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-3.5 text-white shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30">
                <CropDoctorSparkleIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-black uppercase tracking-wider text-emerald-400">
                    👨‍⚕️ डॉ. कृषि विशेषज्ञ वॉइस नोट
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-300">
                  सुने: सही दवा, 15L टंकी डोज़ और सटीक छिड़काव विधि
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleDoctorAudio}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-black transition active:scale-95 shadow-md ${
                isPlayingAudio
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  <span>रोकें</span>
                </>
              ) : (
                <span>सुनो 🔊</span>
              )}
            </button>
          </div>

          {/* Soundwave animation when playing */}
          {isPlayingAudio && (
            <div className="mt-2.5 flex items-center gap-1 border-t border-emerald-500/20 pt-2 text-[10.5px] font-bold text-emerald-300">
              <span className="inline-block h-2 w-1 animate-bounce rounded bg-emerald-400" />
              <span className="inline-block h-3.5 w-1 animate-bounce rounded bg-emerald-400 [animation-delay:0.15s]" />
              <span className="inline-block h-2 w-1 animate-bounce rounded bg-emerald-400 [animation-delay:0.3s]" />
              <span className="ml-1.5">डॉक्टर बोल रहे हैं... ध्यान से सुनें</span>
            </div>
          )}
        </div>

        {/* 🌟 1. PRIORITY #1: डॉक्टर की अनुशंसित दवा व सही डोज़ (Chemical & Tank Dose First) */}
        <MockCard className="!border-emerald-500/35 !bg-gradient-to-b !from-emerald-50/60 !to-white dark:!from-slate-900 dark:!to-slate-900/95 !p-3 sm:!p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-700 text-white text-[11px] font-black shadow-xs">
                1
              </span>
              <div>
                <h2 className="text-[13.5px] font-black text-emerald-950 dark:text-emerald-100">
                  डॉक्टर की अनुशंसित दवा व सही डोज़ (Treatment)
                </h2>
              </div>
            </div>
            <span className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[9px] font-black text-emerald-800 dark:text-emerald-300">
              सटीक नाप
            </span>
          </div>

          <div className="space-y-2.5 mt-2">
            {chemItems.map((c, i) => {
              const parsed = parseFarmerDose(c.dose);
              const isExpanded = Boolean(expandedOptions[i]);

              return (
                <div
                  key={`${c.technical}-${i}`}
                  className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-white dark:bg-slate-900/90 shadow-xs transition-all"
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => toggleOption(i)}
                    className="flex cursor-pointer items-start justify-between gap-2.5 p-2.5 sm:p-3 transition hover:bg-emerald-50/40 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block rounded-md px-1.5 py-0.5 text-[9px] font-black text-white shadow-2xs ${
                              i === 0 ? "bg-emerald-700" : "bg-slate-700 dark:bg-slate-800"
                            }`}
                          >
                            {i === 0 ? "🌟 पहली पसंद (Best Choice)" : `विकल्प ${i + 1}`}
                          </span>
                          <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400">
                            टेक्निकल सॉल्ट
                          </span>
                        </div>

                        {/* Prominent Technical Name */}
                        <h3 className="text-[14.5px] sm:text-[15.5px] font-black tracking-tight text-slate-950 dark:text-white leading-snug mt-0.5 font-mono sm:font-sans">
                          {c.technical}
                        </h3>

                        {/* Hindi Name */}
                        {c.nameHi && (
                          <p className="text-[11.5px] font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                            {cleanTechnicalName(c.nameHi)}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(i);
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 transition hover:bg-emerald-500/20 active:scale-95"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Body Details */}
                  {isExpanded && (
                    <div className="border-t border-emerald-900/8 px-3 pb-3 pt-2.5 space-y-2.5 animate-in fade-in duration-200">
                      {/* Product Photo & Brands Row */}
                      <div className="flex items-center gap-3 bg-stone-50/80 dark:bg-slate-800/50 p-2.5 rounded-xl border border-stone-200/70 dark:border-slate-700/60">
                        {isTankMix(c.technical) ? (
                          <div className="flex items-center gap-1.5 shrink-0 bg-stone-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-stone-200 dark:border-slate-700">
                            <div className="flex flex-col items-center">
                              <ChemBottleThumb technical={c.technical.split("+")[0].trim()} size="xs" className="rounded-lg shadow-2xs" />
                              <span className="text-[8.5px] font-black text-slate-700 dark:text-slate-300 mt-0.5 max-w-[58px] truncate text-center">
                                {c.technical.split("+")[0].trim().split(" ")[0]}
                              </span>
                            </div>
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-[11px] shadow-xs">
                              +
                            </span>
                            <div className="flex flex-col items-center">
                              <ChemBottleThumb technical={c.technical.split("+")[1].trim()} size="xs" className="rounded-lg shadow-2xs" />
                              <span className="text-[8.5px] font-black text-slate-700 dark:text-slate-300 mt-0.5 max-w-[58px] truncate text-center">
                                {c.technical.split("+")[1].trim().split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <ChemBottleThumb technical={c.technical} size="sm" className="rounded-xl shrink-0 shadow-xs" />
                        )}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                              🧪 {isTankMix(c.technical) ? "टैंक मिक्स (2-Technical Tank Mix)" : "शुद्ध टेक्निकल सॉल्ट (Technical Formulation)"}
                            </span>
                            <p className="text-[12.5px] font-black text-slate-900 dark:text-slate-100 leading-snug mt-1">
                              {cleanTechnicalName(c.nameHi || c.technical)}
                            </p>
                          </div>
                          <p className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                            {isTankMix(c.technical)
                              ? "💡 खाद-बीज दुकान से दोनों टेक्निकल लेकर ऊपर लिखी अलग-अलग मात्रा अनुसार टंकी में घोलें।"
                              : "💡 खाद-बीज दुकान पर केवल यह टेक्निकल नाम बताएं। किसी भी अच्छी कंपनी का यह सॉल्ट खरीद सकते हैं।"}
                          </p>
                        </div>
                      </div>

                      {/* Full-Width 3-Column Compact Dosage Grid */}
                      <div className="w-full rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {/* Pill 1 */}
                          <div
                            className={`rounded-xl bg-white dark:bg-slate-900 border-2 py-2 px-1.5 shadow-xs ${
                              parsed.isSpray ? "border-emerald-600/40" : "border-amber-600/40"
                            }`}
                          >
                            <span className="block text-[9px] font-black uppercase tracking-tight text-emerald-800 dark:text-emerald-300 truncate">
                              {parsed.pill1.icon} {parsed.pill1.label}
                            </span>
                            <span className="block text-[12px] sm:text-[13px] font-black text-emerald-950 dark:text-emerald-100 mt-1 leading-tight">
                              {parsed.pill1.value}
                            </span>
                          </div>

                          {/* Pill 2 */}
                          <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-500/40 py-2 px-1.5 shadow-2xs">
                            <span className="block text-[9px] font-black uppercase tracking-tight text-amber-800 dark:text-amber-300 truncate">
                              {parsed.pill2.icon} {parsed.pill2.label}
                            </span>
                            <span className="block text-[12px] sm:text-[13px] font-black text-slate-900 dark:text-white mt-1 leading-tight">
                              {parsed.pill2.value}
                            </span>
                          </div>

                          {/* Pill 3 */}
                          <div className="rounded-xl bg-white dark:bg-slate-900 border border-sky-500/40 py-2 px-1.5 shadow-2xs">
                            <span className="block text-[9px] font-black uppercase tracking-tight text-sky-800 dark:text-sky-300 truncate">
                              {parsed.pill3.icon} {parsed.pill3.label}
                            </span>
                            <span className="block text-[12px] sm:text-[13px] font-black text-slate-900 dark:text-white mt-1 leading-tight">
                              {parsed.pill3.value}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Practical Agronomist Doctor Advice */}
                      {parsed.doctorTip ? (
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2 text-[11px]">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            💡 {parsed.doctorTip}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tank-Mix Safety Advisor Link */}
            <AppLink
              href="/mix-advisor"
              className="flex items-center justify-between rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-xs font-black text-teal-950 dark:text-teal-100 hover:bg-teal-500/15 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-teal-700 dark:text-teal-300 shrink-0" />
                <span>🧪 क्या आप इस दवा के साथ कोई अन्य दवा या टॉनिक मिला रहे हैं?</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-teal-800 dark:text-teal-300 shrink-0">
                सुरक्षा चेक करें <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </AppLink>
          </div>
        </MockCard>

        {/* 2. खेत में कैसे पहचानें (लक्षण — Interactive Collapsible Accordion) */}
        <MockCard className="!p-3 sm:!p-3.5 shadow-sm">
          <div
            onClick={() => toggleSection("symptoms")}
            className="flex cursor-pointer items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 text-[11px] font-black">
                2
              </span>
              <h2 className="text-[13.5px] font-black text-[#0B3D28] dark:text-emerald-200">
                खेत में लक्षण व पहचान (लक्षण)
              </h2>
            </div>
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 transition hover:bg-emerald-500/20 active:scale-95"
              aria-label={openSections.symptoms ? "Collapse" : "Expand"}
            >
              {openSections.symptoms ? (
                <ChevronUp className="h-4 w-4 stroke-[2.5]" />
              ) : (
                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
          </div>
          {openSections.symptoms && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
              <p className="text-[10.5px] font-medium text-slate-600 dark:text-slate-300">
                खेत में पौधे को ध्यान से देखें — ये प्रमुख संकेत दिखाई देंगे:
              </p>
              <MiniPoints items={symptomsList} />
            </div>
          )}
        </MockCard>

        {/* 3. यह क्यों फैला और नुकसान का समय (कारण — Interactive Collapsible Accordion) */}
        <MockCard className="!p-3 sm:!p-3.5 shadow-sm">
          <div
            onClick={() => toggleSection("causes")}
            className="flex cursor-pointer items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-600/10 text-amber-800 dark:text-amber-300 text-[11px] font-black">
                3
              </span>
              <h2 className="text-[13.5px] font-black text-[#0B3D28] dark:text-emerald-200">
                यह क्यों हुआ और नुकसान का समय (कारण)
              </h2>
            </div>
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 transition hover:bg-amber-500/20 active:scale-95"
              aria-label={openSections.causes ? "Collapse" : "Expand"}
            >
              {openSections.causes ? (
                <ChevronUp className="h-4 w-4 stroke-[2.5]" />
              ) : (
                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
          </div>
          {openSections.causes && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
              <div>
                <p className="text-[10.5px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  फैलाव के मुख्य कारण:
                </p>
                <MiniPoints items={causesList} />
              </div>
              <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10.5px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
                  तुरंत कदम उठाएँ:
                </p>
                <MiniPoints items={timingList} />
              </div>
            </div>
          )}
        </MockCard>

        {/* 4. जैविक व देसी उपाय (Organic Alternative — Interactive Collapsible Accordion) */}
        {organicPoints.length > 0 && (
          <MockCard className="!p-3 sm:!p-3.5 shadow-sm">
            <div
              onClick={() => toggleSection("organic")}
              className="flex cursor-pointer items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-teal-600/10 text-teal-800 dark:text-teal-300 text-[11px] font-black">
                  4
                </span>
                <h2 className="text-[13.5px] font-black text-[#0B3D28] dark:text-emerald-200">
                  जैविक व देसी उपाय (Organic Alternative)
                </h2>
              </div>
              <button
                type="button"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-800 dark:text-teal-300 transition hover:bg-teal-500/20 active:scale-95"
                aria-label={openSections.organic ? "Collapse" : "Expand"}
              >
                {openSections.organic ? (
                  <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                )}
              </button>
            </div>
            {openSections.organic && (
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                <p className="text-[10.5px] font-medium text-slate-600 dark:text-slate-300">
                  शुरुआती रोकथाम या बिना केमिकल के बचाव के लिए:
                </p>
                <MiniPoints items={organicPoints} />
              </div>
            )}
          </MockCard>
        )}

        {/* 5. आगे के लिए रोकथाम व सुझाव (Precautions — Interactive Collapsible Accordion) */}
        <MockCard className="!p-3 sm:!p-3.5 shadow-sm">
          <div
            onClick={() => toggleSection("precautions")}
            className="flex cursor-pointer items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sky-600/10 text-sky-800 dark:text-sky-300 text-[11px] font-black">
                5
              </span>
              <h2 className="text-[13.5px] font-black text-[#0B3D28] dark:text-emerald-200">
                सावधानियां व आगे के लिए बचाव (Precautions)
              </h2>
            </div>
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-800 dark:text-sky-300 transition hover:bg-sky-500/20 active:scale-95"
              aria-label={openSections.precautions ? "Collapse" : "Expand"}
            >
              {openSections.precautions ? (
                <ChevronUp className="h-4 w-4 stroke-[2.5]" />
              ) : (
                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
          </div>
          {openSections.precautions && (
            <ul className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">✓</span>
                <span><strong>छिड़काव का सही समय:</strong> सुबह 10 बजे से पहले या शाम 4 बजे के बाद ही स्प्रे करें, तेज धूप में दवा उड़ जाती है।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">✓</span>
                <span><strong>साफ़ पानी:</strong> हमेशा कुएं या ट्यूबवेल के साफ़ पानी का इस्तेमाल करें; गंदे तालाब के पानी से दवा का असर खत्म हो जाता है।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">✓</span>
                <span><strong>कटाई से पूर्व अंतर (PHI):</strong> कटाई से कम से कम 15–20 दिन पहले छिड़काव बंद कर दें।</span>
              </li>
            </ul>
          )}
        </MockCard>

        {/* 📋 Doctor Prescription Action Card (WhatsApp & Save) */}
        <MockCard className="!p-4 text-center shadow-md">
          {saved ? (
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              <p className="text-[14px] font-black text-emerald-900 dark:text-emerald-200">
                डॉक्टर पर्ची सुरक्षित हो गई ✓
              </p>
            </div>
          ) : (
            <p className="mb-3 text-xs font-black text-emerald-950 dark:text-emerald-100">
              यह पर्ची खाद-बीज दुकानदार को WhatsApp करें या सुरक्षित रखें
            </p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-xs sm:text-[13px] font-black text-white shadow-md active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span>दुकानदार को भेजें (WhatsApp)</span>
            </button>
            <button
              type="button"
              onClick={saveSolution}
              className="flex min-h-[48px] items-center justify-center rounded-xl border-2 border-emerald-700 bg-white dark:bg-slate-900 text-xs sm:text-[13px] font-black text-emerald-800 dark:text-emerald-300 active:scale-95"
            >
              {saved ? "सहेजा गया ✓" : "पर्ची सहेजें (Save)"}
            </button>
          </div>

          <div className="mt-2.5">
            <AppLink
              href={`/spray-rotation/log?crop=${encodeURIComponent(crop.slug)}&problem=${encodeURIComponent(
                shortName
              )}&med=${encodeURIComponent(primaryChem?.technical || "")}&dose=${encodeURIComponent(
                primaryChem?.dose || ""
              )}&from=crop-doctor`}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600/15 border border-emerald-600/35 text-xs sm:text-[13px] font-black text-emerald-950 dark:text-emerald-100 transition hover:bg-emerald-600/25 active:scale-95"
            >
              <span>📒 छिड़काव डायरी में रिकॉर्ड करें</span>
            </AppLink>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <AppLink
              href="/ai-doctor"
              className="flex min-h-[42px] items-center justify-center rounded-xl bg-emerald-500/10 text-xs font-black text-emerald-900 dark:text-emerald-200 active:scale-95"
            >
              📷 AI फोटो से जाँच
            </AppLink>
            <AppLink
              href={`/crop-problems/${crop.slug}`}
              className="flex min-h-[42px] items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 active:scale-95"
            >
              ← और समस्याएँ देखें
            </AppLink>
          </div>
        </MockCard>
      </div>
    </ProblemFlowShell>
  );
}
