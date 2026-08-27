"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import ProblemFlowShell, { MockCard, MockTab } from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblem } from "@/data/crop-curative-problems";
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
    [/^फसल\s*चक्र$/i, "फसल चक्र अपनाएँ"],
    [/^जल\s*निकासी$/i, "खेत में पानी न ठहराएँ"],
    [/^बीज\s*उपचार$/i, "बुवाई से पहले बीज उपचार करें"],
    [/^ट्राइकोडर्मा.*/i, "ट्राइकोडर्मा का प्रयोग करें — स्थानीय सलाह से"],
    [/^नीम.*/i, "नीम आधारित छिड़काव करें — बोतल देखकर"],
    [/^Bt\s*—.*/i, "Bt दवा का प्रयोग करें — बोतल देखकर"],
    [/^पीला\s*जाल$/i, "पीला चिपचिपा जाल लगाएँ"],
    [/^नीला\s*जाल$/i, "नीला जाल लगाएँ"],
    [/^फेरोमोन.*/i, "फेरोमोन ट्रैप लगाएँ"],
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
  const chemItems = useMemo(() => parseChemLines(p.cureChemicalHi), [p.cureChemicalHi]);
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

  return (
    <ProblemFlowShell title={shortName} step={saved ? 5 : 4} backHref={`/crop-problems/${crop.slug}`}>
      <div className="space-y-3">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#D8E8DE] bg-white">
          <Image src={p.image} alt={shortName} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
            <div>
              <p className="text-[15px] font-black text-white">{shortName}</p>
              <p className="text-[11px] font-semibold text-white/80">{p.nameEn}</p>
            </div>
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#0B5C3B]">
              {p.tagHi}
            </span>
          </div>
        </div>

        <MockCard className="!p-3">
          <p className="mb-2 text-[13px] font-black text-[#0B3D28]">जानकारी</p>
          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                ["symptoms", "लक्षण"],
                ["cause", "कारण"],
                ["damage", "नुकसान"],
                ["prevention", "रोकथाम"],
              ] as const
            ).map(([id, label]) => (
              <MockTab
                key={id}
                active={infoTab === id}
                onClick={() => setInfoTab(id)}
                className="w-full px-0.5 text-[11px] sm:text-[12px]"
              >
                {label}
              </MockTab>
            ))}
          </div>
          <MiniPoints items={infoPoints} />
        </MockCard>

        <MockCard className="!border-[#A7D8B8] !bg-[#F3FBF6] !p-3">
          <p className="mb-2 text-[15px] font-black text-[#0B5C3B]">समाधान</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                ["chemical", "रासायनिक"],
                ["organic", "जैविक"],
                ["prevention", "रोकथाम"],
              ] as const
            ).map(([id, label]) => (
              <MockTab
                key={id}
                active={cureTab === id}
                onClick={() => setCureTab(id)}
                className="w-full text-[11px] sm:text-[12px]"
              >
                {label}
              </MockTab>
            ))}
          </div>

          {cureTab === "chemical" && (
            <div className="mt-3 space-y-2">
              {chemItems.map((c, i) => (
                <div
                  key={`${c.technical}-${i}`}
                  className="flex items-center gap-2.5 rounded-xl border border-[#D8E8DE] bg-white px-2.5 py-2.5"
                >
                  <ChemBottleThumb technical={c.technical} size="sm" className="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-[#2F9E63]">विकल्प {i + 1}</p>
                    <p className="text-[13px] font-black text-[#0B3D28]">{c.name}</p>
                    <p className="text-[11px] font-semibold text-[#3D6B54]">{c.note}</p>
                  </div>
                </div>
              ))}
              <p className="text-[11px] font-semibold text-[#92400E]">
                खुराक हमेशा बोतल के लेबल / कृषि अधिकारी के अनुसार लें।
              </p>
            </div>
          )}

          {cureTab === "organic" && <MiniPoints items={organicPoints} />}
          {cureTab === "prevention" && <MiniPoints items={preventPoints} />}
        </MockCard>

        <MockCard className="!p-3 text-center">
          {saved ? (
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-white">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              <p className="text-[14px] font-black text-[#0B5C3B]">सेव हो गया</p>
            </div>
          ) : (
            <p className="mb-2 text-[12px] font-bold text-[#3D6B54]">सेव करें या शेयर करें</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={saveSolution}
              className="flex min-h-[46px] items-center justify-center rounded-xl bg-[#0B5C3B] text-[13px] font-black text-white"
            >
              सेव करें
            </button>
            <button
              type="button"
              onClick={() => void shareSolution()}
              className="flex min-h-[46px] items-center justify-center gap-1 rounded-xl border-2 border-[#0B5C3B] text-[13px] font-black text-[#0B5C3B]"
            >
              <Share2 className="h-4 w-4" />
              शेयर करें
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <AppLink
              href="/ai-doctor"
              className="flex min-h-[40px] items-center justify-center rounded-xl bg-[#E8F5EE] text-[12px] font-black text-[#0B5C3B]"
            >
              फोटो से जाँच
            </AppLink>
            <AppLink
              href={`/crop-problems/${crop.slug}`}
              className="flex min-h-[40px] items-center justify-center rounded-xl border border-[#C5DDD0] text-[12px] font-black text-[#0B3D28]"
            >
              और समस्याएँ
            </AppLink>
          </div>
        </MockCard>
      </div>
    </ProblemFlowShell>
  );
}
