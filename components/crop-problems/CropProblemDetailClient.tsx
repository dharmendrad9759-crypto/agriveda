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

function parseChemLines(lines: string[]) {
  return lines.slice(0, 3).map((line, i) => {
    const name = line.split("—")[0]?.split("/")[0]?.trim() || line;
    const technical =
      name.match(/[A-Za-z][A-Za-z\s-]{2,}/)?.[0]?.trim() ||
      (i === 0 ? "Imidacloprid" : i === 1 ? "Spinosad" : "Mancozeb");
    return {
      name,
      dose: "बोतल लेबल अनुसार",
      technical,
      full: line,
    };
  });
}

/** Steps 3–5 mockup same-to-same */
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
    showToast("समाधान सेव हो गया!", "success");
  };

  const shareSolution = async () => {
    const text = `${crop.nameHi} — ${p.nameHi}\n\n${p.whatHi}\n\nइलाज:\n${p.cureChemicalHi.join("\n")}\n\nAgriveda`;
    try {
      if (navigator.share) await navigator.share({ title: p.nameHi, text });
      else {
        await navigator.clipboard.writeText(text);
        showToast("कॉपी हो गया — शेयर करें", "success");
      }
    } catch {
      /* cancel */
    }
  };

  return (
    <ProblemFlowShell
      title={p.nameHi}
      step={saved ? 5 : 4}
      backHref={`/crop-problems/${crop.slug}`}
    >
      <div className="space-y-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[#D8E8DE] bg-white shadow-[0_10px_28px_-16px_rgba(11,92,59,0.4)]">
          <Image src={p.image} alt={p.nameHi} fill className="object-cover" sizes="100vw" priority />
          <span className="absolute bottom-2 left-2 rounded-full bg-[#0B5C3B]/90 px-2.5 py-1 text-[11px] font-bold text-white">
            {p.stageHi}
          </span>
        </div>

        {/* Step 3 */}
        <MockCard>
          <p className="mb-2 text-[13px] font-black text-[#0B3D28]">जानकारी देखें</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(
              [
                ["symptoms", "लक्षण"],
                ["cause", "कारण"],
                ["damage", "नुकसान"],
                ["prevention", "रोकथाम"],
              ] as const
            ).map(([id, label]) => (
              <MockTab key={id} active={infoTab === id} onClick={() => setInfoTab(id)}>
                {label}
              </MockTab>
            ))}
          </div>
          <ul className="mt-3 space-y-2 text-[13px] font-medium leading-relaxed text-[#1F3D2E]">
            {infoTab === "symptoms" && (
              <>
                <li className="flex gap-2"><span className="text-[#16A34A]">•</span>{p.whatHi}</li>
                <li className="flex gap-2"><span className="text-[#16A34A]">•</span>अवस्था: {p.stageHi}</li>
                <li className="flex gap-2"><span className="text-[#16A34A]">•</span>प्रकार: {p.tagHi}</li>
              </>
            )}
            {infoTab === "cause" &&
              p.whyHi.map((w) => (
                <li key={w} className="flex gap-2"><span className="text-[#16A34A]">•</span>{w}</li>
              ))}
            {infoTab === "damage" && (
              <>
                <li className="flex gap-2"><span className="text-[#16A34A]">•</span>{p.whenToActHi}</li>
                <li className="flex gap-2"><span className="text-[#16A34A]">•</span>{p.tipHi}</li>
                <li className="flex gap-2"><span className="text-[#16A34A]">•</span>देर से इलाज → उपज घट सकती है</li>
              </>
            )}
            {infoTab === "prevention" &&
              [...p.cureOrganicHi.slice(0, 3), p.tipHi].map((w) => (
                <li key={w} className="flex gap-2"><span className="text-[#16A34A]">•</span>{w}</li>
              ))}
          </ul>
        </MockCard>

        {/* Step 4 */}
        <MockCard className="!border-[#A7D8B8] !bg-[#F3FBF6]">
          <p className="mb-2 text-[15px] font-black text-[#0B5C3B]">
            समाधान ({p.nameHi.split("(")[0].trim()})
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(
              [
                ["chemical", "रासायनिक"],
                ["organic", "जैविक"],
                ["prevention", "रोकथाम"],
              ] as const
            ).map(([id, label]) => (
              <MockTab key={id} active={cureTab === id} onClick={() => setCureTab(id)}>
                {label}
              </MockTab>
            ))}
          </div>

          {cureTab === "chemical" && (
            <div className="mt-3 space-y-2.5">
              {chemItems.map((c, i) => (
                <div
                  key={`${c.technical}-${i}`}
                  className="flex gap-3 rounded-[14px] border border-[#D8E8DE] bg-white p-2.5"
                >
                  <ChemBottleThumb technical={c.technical} size="sm" className="rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wide text-[#2F9E63]">
                      विकल्प {i + 1}
                    </p>
                    <p className="text-[13px] font-black text-[#0B3D28]">{c.name}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#3D6B54]">
                      मात्रा: {c.dose}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-[#4B6356]">{c.full}</p>
                  </div>
                </div>
              ))}
              <p className="rounded-[12px] bg-[#FEF3C7] px-3 py-2 text-[11px] font-bold text-[#92400E]">
                खुराक हमेशा बोतल लेबल / कृषि अधिकारी के अनुसार लें।
              </p>
            </div>
          )}

          {cureTab === "organic" && (
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] font-semibold text-[#1F3D2E]">
              {p.cureOrganicHi.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          )}

          {cureTab === "prevention" && (
            <ul className="mt-3 space-y-2 text-[13px] font-semibold text-[#1F3D2E]">
              <li>• {p.whenToActHi}</li>
              <li>• {p.tipHi}</li>
              {p.cureOrganicHi.slice(0, 2).map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          )}
        </MockCard>

        {/* Step 5 */}
        <MockCard className="text-center">
          {saved ? (
            <div className="mb-3 flex flex-col items-center gap-2">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-lg shadow-emerald-700/30">
                <Check className="h-9 w-9" strokeWidth={3} />
              </span>
              <p className="text-[17px] font-black text-[#0B5C3B]">समाधान सेव हो गया!</p>
            </div>
          ) : (
            <p className="mb-3 text-[13px] font-bold text-[#3D6B54]">सेव करें और शेयर करें</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={saveSolution}
              className="flex min-h-[48px] items-center justify-center rounded-2xl bg-[#0B5C3B] text-[13px] font-black text-white shadow-md"
            >
              सेव करें
            </button>
            <button
              type="button"
              onClick={() => void shareSolution()}
              className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-2xl border-2 border-[#0B5C3B] text-[13px] font-black text-[#0B5C3B]"
            >
              <Share2 className="h-4 w-4" />
              शेयर करें
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <AppLink
              href="/ai-doctor"
              className="flex min-h-[44px] items-center justify-center rounded-2xl bg-[#E8F5EE] text-[12px] font-black text-[#0B5C3B]"
            >
              फोटो से AI जाँच
            </AppLink>
            <AppLink
              href={`/crop-problems/${crop.slug}`}
              className="flex min-h-[44px] items-center justify-center rounded-2xl border border-[#C5DDD0] text-[12px] font-black text-[#0B3D28]"
            >
              और समस्याएँ
            </AppLink>
          </div>
        </MockCard>
      </div>
    </ProblemFlowShell>
  );
}
