"use client";

import { useState } from "react";
import type { FieldMedicine } from "@/lib/crops/fieldMedicine";
import {
  splitMedicineLine,
  parseMedicineItem,
  type ParsedMedicineItem,
} from "@/lib/crops/medicineParser";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import {
  Check,
  ChevronDown,
  Copy,
  Layers,
  Scissors,
} from "lucide-react";

function pinpointDose(item: ParsedMedicineItem): string {
  const d = item.farmerDose;
  if (!d) return item.dose;
  const notPump = !d.perLiter || d.perLiter.includes("लागू नहीं");
  if (notPump) {
    const line = d.perAcre || d.perTank || item.dose;
    return line.replace(/\s*\([^)]{18,}\)/g, "").trim();
  }
  const liter = d.perLiter
    .replace(/\s*प्रति लीटर पानी/g, "/लीटर")
    .replace(/\s*प्रति लीटर/g, "/लीटर");
  const tank = d.perTank
    .replace(/\s*प्रति 16L पंप \(टंकी\)/g, "")
    .replace(/\s*प्रति 16L पंप/g, "");
  const acre = d.perAcre.replace(/\s*\(200 लीटर पानी\)/g, "");
  return [`${liter}`, tank ? `पंप ${tank}` : "", acre].filter(Boolean).join(" · ");
}

const TIER_THEME = [
  {
    border: "border-emerald-700/25",
    bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
    header: "text-emerald-900 dark:text-emerald-200",
    badge: "bg-emerald-600 text-white",
  },
  {
    border: "border-sky-700/25",
    bg: "bg-sky-50/70 dark:bg-sky-950/20",
    header: "text-sky-900 dark:text-sky-200",
    badge: "bg-sky-600 text-white",
  },
  {
    border: "border-rose-700/25",
    bg: "bg-rose-50/70 dark:bg-rose-950/20",
    header: "text-rose-900 dark:text-rose-200",
    badge: "bg-rose-600 text-white",
  },
  {
    border: "border-amber-700/25",
    bg: "bg-amber-50/70 dark:bg-amber-950/20",
    header: "text-amber-900 dark:text-amber-200",
    badge: "bg-amber-600 text-white",
  },
];

export default function FieldMedicinePanel({
  guide,
  hi,
}: {
  guide: FieldMedicine;
  hi: boolean;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openTierIdx, setOpenTierIdx] = useState<number | null>(0);

  const copyForShop = (item: ParsedMedicineItem) => {
    let text = "";

    if (item.kind === "trap" && item.trap) {
      text = `फेरोमोन ट्रैप पर्ची (Agriveda Farm Advisory):\n• ट्रैप व ल्यूर: ${item.trap.trapNameHi}\n• ल्यूर नाम: ${
        item.trap.lureName || item.trap.trapNameHi
      }\n• मात्रा: ${item.trap.ratePerAcre}\n• लगाने का समय: ${
        item.trap.timing
      }\nदुकानदार भाई, कृपया इस ल्यूर के साथ उपयुक्त फनल ट्रैप दें।`;
    } else if (item.kind === "mix" && item.tankMix) {
      if (item.tankMix.isBaitSpray) {
        text = `फल मक्खी चारा छिड़काव पर्ची (Agriveda Farm Advisory):\n• चारा घटक: देसी गुड़ या गन्ने का शीरा (100 ग्राम प्रति 10 लीटर पानी)\n• कीटनाशक: मैलाथियान 50% EC (Malathion 50% EC) (20 मिली प्रति 10 लीटर पानी)\n• प्रयोग विधि: 10 लीटर पानी में 100g गुड़ व 20ml मैलाथियान मिलाकर तने व मुख्य शाखाओं पर मोटे बूंदों में छिड़कें।\nदुकानदार भाई, कृपया मैलाथियान 50% EC (Malathion 50% EC) कीटनाशक दें।`;
      } else {
        const compLines = item.tankMix.components
          .map(
            (c, idx) =>
              `• दवा ${idx + 1}: ${c.nameHi} ${c.formulation} (${c.nameEn})${
                c.brand ? ` [प्रसिद्ध: ${c.brand}]` : ""
              }\n  - 16L पंप में मात्रा: ${c.dosePerTank}\n  - प्रति एकड़: ${
                c.dosePerAcre
              }`
          )
          .join("\n");
        const spreaderLine = item.tankMix.spreader
          ? `\n• स्टीकर / स्प्रेडर: ${item.tankMix.spreader.nameHi} (${item.tankMix.spreader.dosePerTank})`
          : "";
        text = `टैंक मिश्रण दवाई पर्ची (Agriveda Farm Advisory):\n${compLines}${spreaderLine}\nदुकानदार भाई, कृपया ऊपर लिखी दोनों दवाएं एवं सिलिकॉन स्प्रेडर दें।`;
      }
    } else {
      const isNonSpray = item.farmerDose?.perLiter?.includes("लागू नहीं");
      text = `दवाई पर्ची (Agriveda Farm Advisory):\n• असली टेक्निकल नाम: ${
        item.technicalEn || item.technicalHi
      }\n${
        item.formulation ? `• फॉर्मूलेशन: ${item.formulation}\n` : ""
      }${
        isNonSpray
          ? `• प्रयोग विधि व मात्रा: ${item.farmerDose?.perAcre || item.dose}\n`
          : `• 16L पंप (टंकी) में मात्रा: ${
              item.farmerDose?.perTank || item.dose
            }\n• प्रति एकड़ मात्रा: ${
              item.farmerDose?.perAcre || item.waterDose
            }\n`
      }दुकानदार भाई, कृपया इस टेक्निकल फॉर्मूले की दवाई दें।`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Medicine Tiers */}
      {guide.tiers.map((tier, tIdx) => {
        const theme = TIER_THEME[tIdx % TIER_THEME.length];
        const isOpen = openTierIdx === tIdx;

        // Process all lines in this tier into items
        const parsedItems: ParsedMedicineItem[] = [];
        for (const line of tier.lines) {
          const splitParts = splitMedicineLine(line);
          if (splitParts.length > 1) {
            for (const part of splitParts) {
              parsedItems.push(parseMedicineItem(part, guide.type));
            }
          } else {
            parsedItems.push(parseMedicineItem(line, guide.type));
          }
        }

        const trapCount = parsedItems.filter((i) => i.kind === "trap").length;
        const mixCount = parsedItems.filter((i) => i.kind === "mix").length;
        const chemCount = parsedItems.filter((i) => i.kind === "chemical").length;
        const adviceCount = parsedItems.filter((i) => i.kind === "advice").length;

        const optionBadgeText =
          trapCount > 0 && chemCount === 0 && mixCount === 0
            ? `${trapCount} ${hi ? "ट्रैप विकल्प" : "trap option"}`
            : mixCount > 0 && chemCount === 0
            ? `${mixCount} ${hi ? "मिश्रण विकल्प" : "mix option"}`
            : adviceCount > 0 && chemCount === 0 && mixCount === 0
            ? `${adviceCount} ${hi ? "बचाव उपाय" : "prevention tips"}`
            : `${chemCount || parsedItems.length} ${hi ? "दवा विकल्प" : "options"}${
                adviceCount > 0 ? ` + ${adviceCount} बचाव` : ""
              }`;

        return (
          <section
            key={tier.title}
            className={`overflow-hidden rounded-xl border ${theme.border} ${theme.bg} p-2.5 sm:p-3 shadow-xs transition-all`}
          >
            {/* Tier Title Toggle Button */}
            <button
              type="button"
              onClick={() => setOpenTierIdx(isOpen ? null : tIdx)}
              className="flex w-full items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${theme.badge}`}
                >
                  {tIdx + 1}
                </span>
                <h3 className={`text-[14px] font-black tracking-tight ${theme.header} truncate`}>
                  {tier.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10.5px] font-semibold text-stone-500 dark:text-stone-400">
                  {optionBadgeText}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Medicine Option Cards (Rendered when accordion is open) */}
            {isOpen && (
              <div className="mt-2.5 space-y-2.5">
                {parsedItems.map((item) => {
                  const isCopied = copiedId === item.id;

                  // ─── 1. PHEROMONE / STICKY TRAP CARD (IPM) ───
                  if (item.kind === "trap" && item.trap) {
                    return (
                      <article
                        key={item.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 p-3 shadow-xs transition hover:shadow-md dark:border-emerald-800/60 dark:from-stone-900 dark:to-emerald-950/30"
                      >
                        <div className="flex items-start gap-3">
                          {/* Left: Authentic Photorealistic Trap Image */}
                          <div className="relative shrink-0 overflow-hidden rounded-xl border border-emerald-600/30 bg-white shadow-xs" style={{ width: 88, height: 120 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.trap.imageSrc}
                              alt={item.trap.trapNameHi}
                              className="h-full w-full object-cover object-center"
                              loading="eager"
                            />
                            <span className="absolute bottom-1 left-1 right-1 rounded bg-black/60 py-0.5 text-center text-[8.5px] font-bold text-white backdrop-blur-xs">
                              {hi ? "IPM ट्रैप" : "Trap"}
                            </span>
                          </div>

                          {/* Right: Trap Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[9.5px] font-black text-white">
                                {hi ? "जैविक / यांत्रिक नियंत्रण" : "IPM Biological Trap"}
                              </span>
                              {item.trap.lureName && (
                                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                                  {item.trap.lureName}
                                </span>
                              )}
                            </div>

                            <h4 className="mt-1 text-[15px] font-black leading-snug text-emerald-950 dark:text-emerald-50">
                              {item.trap.trapNameHi}
                            </h4>

                            {item.trap.trapNameEn && (
                              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                                {item.trap.trapNameEn}
                              </p>
                            )}

                            {/* Structured Chips: Rate, Timing, Mechanism */}
                            <div className="mt-2 space-y-1 text-[11.5px]">
                              <div className="flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 font-semibold text-emerald-950 dark:bg-stone-800/90 dark:text-emerald-200 border border-emerald-500/15">
                                <span className="text-emerald-700 dark:text-emerald-400">🎯</span>
                                <span className="font-bold text-stone-600 dark:text-stone-400">
                                  {hi ? "मात्रा:" : "Rate:"}
                                </span>
                                <span className="font-black text-emerald-800 dark:text-emerald-300">
                                  {item.trap.ratePerAcre}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 font-semibold text-emerald-950 dark:bg-stone-800/90 dark:text-emerald-200 border border-emerald-500/15">
                                <span>⏳</span>
                                <span className="font-bold text-stone-600 dark:text-stone-400">
                                  {hi ? "समय:" : "Timing:"}
                                </span>
                                <span>{item.trap.timing}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cultural / Manual Clipping Practice */}
                        {item.trap.culturalAction && (
                          <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-50/80 p-2 text-[11.5px] font-medium leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                            <Scissors className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-400" />
                            <div>
                              <span className="font-black text-amber-900 dark:text-amber-300">
                                {hi ? "हस्त नियंत्रण (हाथ से छंटाई): " : "Manual Clipping: "}
                              </span>
                              <span>{item.trap.culturalAction}</span>
                            </div>
                          </div>
                        )}

                        {/* Trap Field Note */}
                        <div className="mt-2 text-[10.5px] font-medium text-emerald-900/80 dark:text-emerald-300/80">
                          💡 {item.trap.maintenanceNote}
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-2.5 flex justify-end border-t border-emerald-200/60 pt-2 dark:border-emerald-900/40">
                          <button
                            type="button"
                            onClick={() => copyForShop(item)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3" />
                                {hi ? "कॉपी हो गया!" : "Copied!"}
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                {hi ? "दुकानदार को दिखाएँ" : "Show to Shop"}
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  }

                  // ─── 2. TANK-MIX COMBINATION CARD ───
                  if (item.kind === "mix" && item.tankMix) {
                    const comp1 = item.tankMix.components[0];
                    const comp2 = item.tankMix.components[1];

                    return (
                      <article
                        key={item.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-amber-600/30 bg-gradient-to-br from-amber-50/70 via-white to-stone-50 p-3 shadow-xs transition hover:shadow-md dark:border-amber-800/60 dark:from-stone-900 dark:to-stone-950"
                      >
                        {/* Header Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-black text-white ${
                              item.tankMix.isBaitSpray ? "bg-amber-700" : "bg-amber-600"
                            }`}
                          >
                            <Layers className="h-3 w-3" />
                            {item.tankMix.isBaitSpray
                              ? hi
                                ? "फल मक्खी चारा"
                                : "Fruit fly bait"
                              : hi
                              ? "एक टंकी में दोनों"
                              : "Both in one tank"}
                          </span>
                        </div>

                        {/* Top: Two Bottle Visuals Side-by-Side with '+' Badge */}
                        <div className="mt-2.5 flex items-center justify-center gap-3 rounded-xl bg-amber-500/10 p-2.5 dark:bg-stone-800/60">
                          {comp1 && (
                            <div className="flex flex-col items-center">
                              <ChemBottleThumb
                                technical={comp1.nameEn || comp1.nameHi}
                                category={comp1.category}
                                size="sm"
                                className="rounded-lg shadow-sm"
                              />
                            </div>
                          )}

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-sm font-black text-white shadow-xs">
                            +
                          </div>

                          {comp2 && (
                            <div className="flex flex-col items-center">
                              <ChemBottleThumb
                                technical={comp2.nameEn || comp2.nameHi}
                                category={comp2.category}
                                size="sm"
                                className="rounded-lg shadow-sm"
                              />
                            </div>
                          )}
                        </div>

                        {/* Component 1 Dosing Box */}
                        {comp1 && (
                          <div className="mt-3 rounded-lg border border-stone-200/90 bg-white p-2.5 dark:border-stone-800 dark:bg-stone-800/80">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[13px] font-black text-stone-900 dark:text-stone-100">
                                1. {comp1.nameHi.includes(comp1.formulation) ? comp1.nameHi : `${comp1.nameHi} ${comp1.formulation}`}
                              </h5>
                              {comp1.brand && (
                                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[9.5px] font-bold text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                                  {comp1.brand}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[13px] font-black leading-snug text-emerald-900 dark:text-emerald-200">
                              {[comp1.dosePerLiter, comp1.dosePerTank ? `पंप ${comp1.dosePerTank}` : "", comp1.dosePerAcre ? `एकड़ ${comp1.dosePerAcre}` : ""].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        )}

                        {/* Component 2 Dosing Box */}
                        {comp2 && (
                          <div className="mt-2 rounded-lg border border-stone-200/90 bg-white p-2.5 dark:border-stone-800 dark:bg-stone-800/80">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[13px] font-black text-stone-900 dark:text-stone-100">
                                2. {comp2.nameHi.includes(comp2.formulation) ? comp2.nameHi : `${comp2.nameHi} ${comp2.formulation}`}
                              </h5>
                              {comp2.brand && (
                                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[9.5px] font-bold text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                                  {comp2.brand}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[13px] font-black leading-snug text-emerald-900 dark:text-emerald-200">
                              {[comp2.dosePerLiter, comp2.dosePerTank ? `पंप ${comp2.dosePerTank}` : "", comp2.dosePerAcre ? `एकड़ ${comp2.dosePerAcre}` : ""].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        )}

                        {/* Silicon Spreader / Adjuvant Placed at the Bottom */}
                        {item.tankMix.spreader && (
                          <div className="mt-2 flex items-start gap-2 rounded-lg border border-sky-300 bg-sky-50/90 p-2.5 text-[11.5px] dark:border-sky-800 dark:bg-sky-950/40">
                            <span className="text-base">🧴</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-sky-950 dark:text-sky-100">
                                  {item.tankMix.spreader.nameHi}
                                </span>
                                <span className="rounded bg-sky-600 px-1.5 py-0.2 text-[9.5px] font-black text-white">
                                  {item.tankMix.spreader.dosePerTank}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[10.5px] font-medium text-sky-900/90 dark:text-sky-200/90 leading-tight">
                                {item.tankMix.spreader.purpose}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Mixing Sequence Advice */}
                        <div className="mt-2 rounded bg-amber-50/90 p-2 text-[10.5px] font-semibold text-amber-950 dark:bg-amber-950/30 dark:text-amber-200 leading-snug">
                          {item.tankMix.mixingAdvice}
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-2.5 flex justify-end border-t border-stone-200 pt-2 dark:border-stone-800">
                          <button
                            type="button"
                            onClick={() => copyForShop(item)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-600 text-white hover:bg-amber-700"
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3" />
                                {hi ? "कॉपी हो गया!" : "Copied!"}
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                {hi ? "दुकानदार को दिखाएँ" : "Show to Shop"}
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  }

                  // ─── 2.5 ADVICE / NON-CHEMICAL PREVENTION CARD (NO BOTTLE PHOTO) ───
                  if (item.kind === "advice" || !item.isChemical) {
                    return (
                      <article
                        key={item.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-emerald-500/35 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 p-3 shadow-xs transition hover:shadow-md dark:border-emerald-800/50 dark:from-stone-900 dark:to-emerald-950/20"
                      >
                        <p className="text-[13.5px] font-bold leading-snug text-stone-900 dark:text-stone-100">
                          {item.raw}
                        </p>
                      </article>
                    );
                  }

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-xl border border-stone-200/90 bg-white p-2.5 dark:border-stone-800 dark:bg-stone-900"
                    >
                      <div className="flex items-start gap-2.5">
                        <ChemBottleThumb
                          technical={item.technicalEn || item.technicalHi}
                          category={item.category}
                          size="sm"
                          className="rounded-lg"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[15px] font-black leading-snug text-stone-950 dark:text-stone-50">
                            {item.technicalEn && item.technicalEn !== item.technicalHi
                              ? item.technicalEn
                              : item.technicalHi}
                          </h4>
                          {item.technicalEn && item.technicalEn !== item.technicalHi ? (
                            <p className="text-[12px] font-bold leading-snug text-stone-500 dark:text-stone-400">
                              {item.technicalHi}
                            </p>
                          ) : null}
                          <p className="mt-1 text-[13px] font-black leading-snug text-emerald-900 dark:text-emerald-200">
                            {pinpointDose(item)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => copyForShop(item)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              {hi ? "कॉपी हो गया!" : "Copied!"}
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              {hi ? "दुकानदार को दिखाएँ" : "Show to Shop"}
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
