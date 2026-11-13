"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import CropPlantPlate from "@/components/crop-problems/plant-xray/CropPlantPlate";
import { getCropProblemCrop } from "@/data/crop-curative-problems";
import { dxForPart, type PartDx } from "@/data/partDiagnostics";
import { useSafeReducedMotion } from "@/hooks/useClientReady";
import { cn } from "@/lib/cn";
import {
  anatomyForCrop,
  galleryHref,
  isPlantPart,
  partLabel,
  symptomsForPart,
  type PlantPart,
} from "@/lib/crops/plantAnatomy";
import { SYMPTOM_CHIPS, type HubSymptomChip } from "@/lib/crops/intelligenceHub";

function parseSymptoms(raw: string | null): HubSymptomChip[] {
  if (!raw) return [];
  const allowed = new Set(SYMPTOM_CHIPS.map((c) => c.id));
  return raw.split(",").filter((s): s is HubSymptomChip => allowed.has(s as HubSymptomChip));
}

export default function PlantXrayClient({ cropSlug }: { cropSlug: string }) {
  const crop = getCropProblemCrop(cropSlug);
  const router = useRouter();
  const params = useSearchParams();
  const reduced = useSafeReducedMotion();
  const anatomy = anatomyForCrop(crop?.slug ?? cropSlug);
  const initialPart = params.get("part");
  const partFromUrl = initialPart && isPlantPart(initialPart) ? initialPart : null;

  const [part, setPart] = useState<PlantPart | null>(partFromUrl);
  const [symptoms, setSymptoms] = useState<HubSymptomChip[]>(() => parseSymptoms(params.get("symptoms")));
  const [check, setCheck] = useState<PartDx | null>(null);

  const cropId = crop?.slug ?? cropSlug;
  const partSymptoms = useMemo(
    () => (part && crop ? symptomsForPart(cropId, part) : []),
    [crop, cropId, part]
  );
  const guide = part ? dxForPart(cropId, part) : [];

  const openProblem = (problemId: string) => {
    const q = new URLSearchParams();
    q.set("from", "xray");
    if (part) q.set("part", part);
    router.push(`/crop-problems/${cropId}/${problemId}?${q.toString()}`);
  };

  const choosePart = (next: PlantPart) => {
    setPart(next);
    setSymptoms([]);
    setCheck(null);
    router.replace(`/crop-problems/${cropId}/xray?part=${next}`, { scroll: false });
  };

  const toggleSymptom = (id: HubSymptomChip) => {
    const next = symptoms.includes(id) ? symptoms.filter((s) => s !== id) : [...symptoms, id];
    setSymptoms(next);
    const q = new URLSearchParams();
    if (part) q.set("part", part);
    if (next.length) q.set("symptoms", next.join(","));
    const query = q.toString();
    router.replace(`/crop-problems/${cropId}/xray${query ? `?${query}` : ""}`, { scroll: false });
  };

  if (!crop) notFound();

  return (
    <ProblemFlowShell
      title="पौधे में समस्या कहाँ है?"
      step={2}
      backHref="/crop-problems"
      onBack={() => router.replace("/crop-problems")}
      rightSlot={
        <span className="flex max-w-[8.5rem] items-center gap-1.5 overflow-hidden rounded-2xl border border-emerald-900/15 bg-white px-2 py-1">
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-xl">
            <Image src={crop.image} alt="" fill className="object-cover" sizes="28px" />
          </span>
          <span className="truncate text-[11px] font-black text-emerald-950">{crop.nameHi}</span>
        </span>
      }
    >
      <div className="relative overflow-hidden rounded-[32px] bg-[#07110e] shadow-[0_40px_90px_-42px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="relative aspect-[3/4] w-full">
          <CropPlantPlate
            cropId={crop.slug}
            selected={part}
            focus={anatomy.parts.find((spot) => spot.id === part) ?? null}
            xray={false}
            reducedMotion={reduced}
          />
          <div className="absolute left-3 top-3 z-30">
            <p className="rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[11px] font-bold tracking-wide text-white/90 backdrop-blur-md">
              {crop.nameHi}
            </p>
          </div>
          {anatomy.parts.map((spot) => {
            const on = part === spot.id;
            const labelLeft = spot.x > 52;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => choosePart(spot.id)}
                aria-pressed={on}
                className="absolute z-20 h-11 w-11 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <span className="flex h-full w-full items-center justify-center">
                  <span
                    className={cn(
                      "h-3.5 w-3.5 rounded-full ring-2 ring-white/80",
                      on ? "bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.95)]" : "bg-amber-100/90",
                      on && !reduced ? "animate-pulse" : ""
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-black backdrop-blur-md",
                    labelLeft ? "right-full mr-1" : "left-full ml-1",
                    on
                      ? "border-amber-200 bg-amber-100/95 text-amber-950"
                      : "border-white/25 bg-black/45 text-white"
                  )}
                >
                  {spot.labelHi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-[28px] bg-[#f6f1e6] shadow-[0_24px_50px_-36px_rgba(20,40,24,0.45)] ring-1 ring-[#1a3a2a]/10">
        <div className="flex gap-1.5 overflow-x-auto px-3 py-3">
          {anatomy.parts.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => choosePart(spot.id)}
              aria-pressed={part === spot.id}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-3.5 text-[13px] font-bold",
                part === spot.id
                  ? "bg-[#14382c] text-[#f6f1e6]"
                  : "bg-white/80 text-[#14382c] ring-1 ring-[#14382c]/10"
              )}
            >
              {spot.labelHi}
            </button>
          ))}
        </div>

        {part ? (
          <div className="px-3 pb-3">
            <h2 className="px-1 text-[1.15rem] font-black tracking-tight text-[#10281c]">
              {check ? "एक बार खेत में देखो" : `${partLabel(crop.slug, part)} पर क्या दिख रहा है?`}
            </h2>
            {check ? (
              <div className="mt-3 space-y-2">
                <p className="rounded-2xl bg-white/80 px-3 py-3 text-[14px] font-bold leading-snug text-[#10281c]">
                  {check.checkHi}
                </p>
                <button
                  type="button"
                  onClick={() => openProblem(check.yesProblemId ?? check.problemId)}
                  className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#14382c] px-3 text-[14px] font-black text-[#f6f1e6]"
                >
                  {check.yesHi ?? "हाँ, ऐसा ही है"}
                </button>
                <button
                  type="button"
                  onClick={() => (check.noProblemId ? openProblem(check.noProblemId) : setCheck(null))}
                  className="flex min-h-12 w-full items-center justify-center rounded-full bg-white px-3 text-[14px] font-bold text-[#14382c] ring-1 ring-[#14382c]/15"
                >
                  {check.noHi ?? "नहीं"}
                </button>
              </div>
            ) : guide.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                {guide.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setCheck(row)}
                    className="flex min-h-12 w-full items-center rounded-2xl bg-white/75 px-3 py-2.5 text-left text-[14px] font-bold leading-snug text-[#10281c]"
                  >
                    {row.symptomHi}
                  </button>
                ))}
              </div>
            ) : partSymptoms.length === 0 ? (
              <p className="mt-3 rounded-2xl bg-white/70 px-3 py-3 text-[13px] font-semibold text-[#14382c]/80">
                इस भाग पर अलग लिखा लक्षण नहीं मिला।
              </p>
            ) : (
              <div className="mt-3 space-y-1.5">
                {partSymptoms.map((s) => {
                  const on = symptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSymptom(s.id)}
                      aria-pressed={on}
                      className={cn(
                        "flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-left",
                        on ? "bg-[#14382c] text-[#f6f1e6]" : "bg-white/75 text-[#10281c]"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          on ? "border-[#f6f1e6] bg-[#f6f1e6]" : "border-[#14382c]/25"
                        )}
                      >
                        {on ? <span className="h-2 w-2 rounded-full bg-[#14382c]" /> : null}
                      </span>
                      <span className="text-[15px] font-bold">{s.labelHi}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {guide.length > 0 || check ? null : (
            <AppLink
              href={galleryHref(crop.slug, part, symptoms)}
              className="mt-3 flex min-h-12 items-center justify-center rounded-full bg-[#14382c] px-3 text-[14px] font-black text-[#f6f1e6]"
            >
              संभावित कारण देखें
            </AppLink>
            )}
            <button
              type="button"
              onClick={() => {
                setPart(null);
                setSymptoms([]);
                setCheck(null);
                router.replace(`/crop-problems/${crop.slug}/xray`, { scroll: false });
              }}
              className="mt-1 flex min-h-11 w-full items-center justify-center text-[12px] font-bold text-[#14382c]/70"
            >
              अंग बदलें
            </button>
          </div>
        ) : (
          <p className="px-4 pb-4 text-[13px] font-semibold text-[#14382c]/70">
            ऊपर पौधे का भाग छुएँ।
          </p>
        )}
      </section>
    </ProblemFlowShell>
  );
}
