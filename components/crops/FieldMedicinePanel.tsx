"use client";

import { useState } from "react";
import type { FieldMedicine } from "@/lib/crops/fieldMedicine";
import { splitMedicineLine, parseMedicineItem, type ParsedMedicineItem } from "@/lib/crops/medicineParser";
import { getChemPackageType } from "@/lib/crops/chemBottle";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import { Check, ChevronDown, Copy, Droplets, Info, Share2, Sparkles } from "lucide-react";

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
    const text = `दवाई पर्ची (Agriveda Farm Advisory):\n• असली टेक्निकल नाम: ${item.technicalEn || item.technicalHi}\n${
      item.formulation ? `• फॉर्मूलेशन: ${item.formulation}\n` : ""
    }• 16L पंप (टंकी) में मात्रा: ${item.farmerDose?.perTank || item.dose}\n• प्रति एकड़ मात्रा: ${item.farmerDose?.perAcre || item.waterDose}\n${
      item.brands.length ? `• प्रसिद्ध ब्रांड नाम: ${item.brands.join(", ")}\n` : ""
    }दुकानदार भाई, कृपया इस टेक्निकल फॉर्मूले की दवाई दें।`;

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
                  {parsedItems.filter((i) => i.isChemical).length}{" "}
                  {hi ? "विकल्प" : "options"}
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
              <div className="mt-2.5 space-y-2">
              {parsedItems.map((item, oIdx) => {
                if (!item.isChemical) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-white/90 p-3 text-[13px] font-medium leading-relaxed text-stone-800 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-200"
                    >
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                      <p>{item.raw}</p>
                    </div>
                  );
                }

                const isCopied = copiedId === item.id;

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
                            {getChemPackageType(item.technicalEn || item.technicalHi, item.formulation) === "pouch"
                              ? (hi ? "पैकेट" : "Pouch")
                              : (hi ? "बोतल" : "Bottle")}
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
                        {item.technicalEn && item.technicalEn !== item.technicalHi && (
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
                        {hi ? "दुकानदार से यही टेक्निकल नाम मांगें" : "Ask shop for this exact technical"}
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

      {/* Field Tips / Practical Precautions */}
      {guide.tips.length > 0 && (
        <section className="rounded-2xl border border-stone-200 bg-[#f8faf7] p-3.5 dark:border-stone-800 dark:bg-stone-900/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🌾</span>
            <h3 className="text-[14px] font-black text-stone-900 dark:text-stone-100">
              {hi ? "खेत के अनुभव व ज़रूरी बातें" : "Field Tips & Best Practices"}
            </h3>
          </div>
          <ul className="mt-2 space-y-2">
            {guide.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-[13px] font-medium leading-relaxed text-stone-700 dark:text-stone-300"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
