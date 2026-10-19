"use client";

import { useState } from "react";
import type { FieldMedicine } from "@/lib/crops/fieldMedicine";
import {
  splitMedicineLine,
  parseMedicineItem,
  type ParsedMedicineItem,
} from "@/lib/crops/medicineParser";
import { getChemPackageType } from "@/lib/crops/chemBottle";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import {
  Check,
  ChevronDown,
  Copy,
  Droplets,
  Info,
  Layers,
  Scissors,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
    } else {
      text = `दवाई पर्ची (Agriveda Farm Advisory):\n• असली टेक्निकल नाम: ${
        item.technicalEn || item.technicalHi
      }\n${
        item.formulation ? `• फॉर्मूलेशन: ${item.formulation}\n` : ""
      }• 16L पंप (टंकी) में मात्रा: ${
        item.farmerDose?.perTank || item.dose
      }\n• प्रति एकड़ मात्रा: ${
        item.farmerDose?.perAcre || item.waterDose
      }\n${
        item.brands.length ? `• प्रसिद्ध ब्रांड नाम: ${item.brands.join(", ")}\n` : ""
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
      {/* Friendly Farmer Advisory Banner */}
      <div className="flex items-center gap-2 rounded-xl border border-emerald-800/15 bg-emerald-50/80 px-3 py-2 dark:bg-emerald-950/30">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-300" />
        <p className="text-[11.5px] font-bold text-emerald-950 dark:text-emerald-100">
          {hi
            ? "हर दवाई की बोतल पर असली 'टेक्निकल नाम' छपा होता है। दुकान पर यही नाम मांगें।"
            : "Every bottle displays its official technical formula. Ask for this technical name."}
        </p>
      </div>

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

        const optionBadgeText = trapCount > 0 && chemCount === 0 && mixCount === 0
          ? `${trapCount} ${hi ? "ट्रैप विकल्प" : "trap option"}`
          : mixCount > 0 && chemCount === 0
          ? `${mixCount} ${hi ? "मिश्रण विकल्प" : "mix option"}`
          : `${chemCount || parsedItems.length} ${hi ? "दवा विकल्प" : "options"}`;

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
                {parsedItems.map((item, oIdx) => {
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
                        <div className="mt-2.5 flex items-center justify-between border-t border-emerald-200/60 pt-2 dark:border-emerald-900/40">
                          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                            {hi ? "कीट प्रजनन रोकने हेतु शून्य रसायन उपाय" : "Zero-chemical mating disruption"}
                          </span>

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
                          <span className="inline-flex items-center gap-1 rounded bg-amber-600 px-2 py-0.5 text-[10px] font-black text-white">
                            <Layers className="h-3 w-3" />
                            {hi ? "संयुक्त टैंक मिश्रण (Tank Mix)" : "Tank Mix Combination"}
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                            {hi ? "प्रतिरोध तोड़ने हेतु दोहरा वार" : "Resistance Breaker"}
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
                              <span className="mt-1 text-center text-[9.5px] font-black text-stone-800 dark:text-stone-200 max-w-[90px] truncate">
                                {comp1.nameHi}
                              </span>
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
                              <span className="mt-1 text-center text-[9.5px] font-black text-stone-800 dark:text-stone-200 max-w-[90px] truncate">
                                {comp2.nameHi}
                              </span>
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
                            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10.5px]">
                              <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                                💧 {comp1.dosePerLiter}
                              </span>
                              <span className="rounded bg-teal-50 px-2 py-0.5 font-black text-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
                                🎒 16L पंप: {comp1.dosePerTank}
                              </span>
                              <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-900 dark:bg-blue-950/60 dark:text-blue-200">
                                🚜 एकड़: {comp1.dosePerAcre}
                              </span>
                            </div>
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
                            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10.5px]">
                              <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                                💧 {comp2.dosePerLiter}
                              </span>
                              <span className="rounded bg-teal-50 px-2 py-0.5 font-black text-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
                                🎒 16L पंप: {comp2.dosePerTank}
                              </span>
                              <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-900 dark:bg-blue-950/60 dark:text-blue-200">
                                🚜 एकड़: {comp2.dosePerAcre}
                              </span>
                            </div>
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
                        <div className="mt-2.5 flex items-center justify-between border-t border-stone-200 pt-2 dark:border-stone-800">
                          <span className="text-[10px] font-bold text-stone-500">
                            {hi ? "दुकानदार को दोनों दवाओं के नाम दिखाएँ" : "Show both chemistries to dealer"}
                          </span>

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

                  // ─── 3. REGULAR CHEMICAL CARD ───
                  return (
                    <article
                      key={item.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-white p-2.5 shadow-xs transition hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Left: Bottle Photo/Visual with Technical Name on Bottle */}
                        <div className="flex flex-col items-center shrink-0">
                          <ChemBottleThumb
                            technical={item.technicalEn || item.technicalHi}
                            category={item.category}
                            size="sm"
                            className="rounded-lg shadow-xs"
                          />
                          <span className="mt-0.5 text-[8.5px] font-extrabold text-stone-400">
                            {getChemPackageType(
                              item.technicalEn || item.technicalHi,
                              item.formulation
                            ) === "pouch"
                              ? hi
                                ? "पैकेट"
                                : "Pouch"
                              : hi
                              ? "बोतल"
                              : "Bottle"}
                          </span>
                        </div>

                        {/* Right: Technical Information, Dose & Brands */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="rounded bg-stone-100 px-1.5 py-0.2 text-[9.5px] font-black text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                              {hi ? `विकल्प ${oIdx + 1}` : `Option ${oIdx + 1}`}
                            </span>

                            <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9.5px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {item.categoryLabelHi}
                            </span>

                            {item.formulation && (
                              <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[9.5px] font-black text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                {item.formulation}
                              </span>
                            )}
                          </div>

                          {/* Technical Name Headline */}
                          <h4 className="mt-0.5 text-[14px] font-black leading-snug text-stone-950 dark:text-stone-50">
                            {item.technicalHi}
                          </h4>

                          {/* Standard English Technical if different */}
                          {item.technicalEn &&
                            item.technicalEn !== item.technicalHi && (
                              <p className="text-[10.5px] font-extrabold text-stone-500 dark:text-stone-400">
                                {item.technicalEn}
                              </p>
                            )}

                          {/* Popular Market Brands */}
                          {item.brands.length > 0 && (
                            <div className="mt-1 rounded bg-amber-50/80 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
                              <span className="font-extrabold text-amber-800 dark:text-amber-300">
                                {hi ? "प्रसिद्ध ब्रांड: " : "Brands: "}
                              </span>
                              {item.brands.join(", ")}
                            </div>
                          )}

                          {/* Dose & Water Information */}
                          <div className="mt-1.5 space-y-1">
                            <div className="flex flex-wrap items-center gap-1 text-[10.5px]">
                              {/* Per Liter */}
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                                <Droplets className="h-2.5 w-2.5 text-emerald-600" />
                                <span className="font-medium text-stone-500 dark:text-stone-400">
                                  {hi ? "प्रति ली: " : "Per L: "}
                                </span>
                                <span>{item.farmerDose?.perLiter || item.dose}</span>
                              </span>

                              {/* Per 16L Tank */}
                              {item.farmerDose?.perTank && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 font-bold text-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
                                  <span>🎒</span>
                                  <span className="font-medium text-stone-500 dark:text-stone-400">
                                    {hi ? "16L पंप: " : "16L Tank: "}
                                  </span>
                                  <span>{item.farmerDose.perTank}</span>
                                </span>
                              )}

                              {/* Per Acre */}
                              {item.farmerDose?.perAcre && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-900 dark:bg-blue-950/60 dark:text-blue-200">
                                  <span>🚜</span>
                                  <span className="font-medium text-stone-500 dark:text-stone-400">
                                    {hi ? "प्रति एकड़: " : "Per Acre: "}
                                  </span>
                                  <span>{item.farmerDose.perAcre}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Bar: Show to Agro Dealer */}
                      <div className="mt-2.5 flex items-center justify-between border-t border-stone-100 pt-2 dark:border-stone-800">
                        <span className="text-[10px] font-semibold text-stone-400">
                          {hi
                            ? "दुकानदार से यही टेक्निकल नाम मांगें"
                            : "Ask shop for this exact technical"}
                        </span>

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
