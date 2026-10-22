"use client";

import type { CropFertilizerMixinGuide } from "@/lib/crops/fertilizerMixinFieldGuide";
import {
  buildMixinScheduleStages,
  type MixinScheduleProduct,
} from "@/lib/crops/fertilizerMixinTabs";
import { fertilizerProductImage } from "@/lib/crops/fertilizerFarmerUi";
import { simplifyMixinFarmerHi } from "@/lib/crops/simplifyMixinFarmerHi";
import { cn } from "@/lib/cn";
import { ChevronDown, Lightbulb, MapPin, Sparkles, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

function ProductRow({
  product,
  acres,
}: {
  product: MixinScheduleProduct;
  acres: number;
}) {
  const name = simplifyMixinFarmerHi(product.name);
  const doseBase = simplifyMixinFarmerHi(product.doseHi);
  const dose =
    acres === 1 || !Number.isFinite(acres)
      ? doseBase
      : `${doseBase} (${Math.round(acres * 100) / 100} एकड़ अनुसार)`;
  const note = product.noteHi ? simplifyMixinFarmerHi(product.noteHi) : "";
  const tag = product.tagHi ? simplifyMixinFarmerHi(product.tagHi) : "";

  return (
    <li className="flex items-start gap-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/70 p-2.5 transition-all hover:border-emerald-500/30">
      <span className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-emerald-500/20 bg-white shadow-xs">
        <Image
          src={fertilizerProductImage(product.name)}
          alt={name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-black text-[var(--av-text-primary)]">
            {name}
          </span>
          {tag ? (
            <span className="rounded-md bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[9.5px] font-black text-emerald-800 dark:text-emerald-300">
              {tag}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[12px] font-black text-emerald-700 dark:text-emerald-300">
          खुराक: {dose}
        </p>
        {note ? (
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--av-text-muted)]">
            ℹ️ {note}
          </p>
        ) : null}
        {product.brands?.length ? (
          <p className="mt-1 text-[10px] font-medium text-[var(--av-text-muted)]">
            दुकान / बाज़ार में: <span className="font-semibold text-[var(--av-text-secondary)]">{product.brands.join(" · ")}</span>
          </p>
        ) : null}
      </div>
    </li>
  );
}

export default function CropFertilizerMixinPanel({
  guide,
  acres,
}: {
  guide?: CropFertilizerMixinGuide | null;
  acres: number;
  cropLabelHi?: string;
}) {
  const stages = useMemo(() => (guide ? buildMixinScheduleStages(guide) : []), [guide]);
  const [openId, setOpenId] = useState<number | null>(
    () => stages[0]?.stageNumber ?? null
  );

  if (!guide) return null;

  return (
    <div className="space-y-4">
      {/* Total Recommendation Glass Banner */}
      {(guide.totalNutrientsHi?.length || guide.totalFertilizerHi?.length) && (
        <section className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-4 shadow-sm dark:from-emerald-950/40">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="text-[13px] font-black tracking-tight text-emerald-950 dark:text-emerald-50">
              कुल संतुलित जरूरत ({acres} एकड़ के लिए)
            </p>
          </div>

          {guide.totalNutrientsHi?.length ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {guide.totalNutrientsHi.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-emerald-500/25 bg-white/90 px-2.5 py-1 text-[10.5px] font-extrabold text-emerald-900 shadow-xs dark:bg-emerald-900/40 dark:text-emerald-100"
                >
                  {simplifyMixinFarmerHi(
                    n.replace(/\s*\(.*?\)\s*$/, "").replace(/\s*—.*$/, "")
                  )}
                </span>
              ))}
            </div>
          ) : null}

          {guide.totalFertilizerHi?.length ? (
            <ul className="mt-3 space-y-1.5 rounded-xl border border-emerald-600/15 bg-white/60 p-2.5 dark:bg-black/20">
              {guide.totalFertilizerHi.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-1.5 text-[11.5px] font-bold text-[var(--av-text-primary)]"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>
                    {simplifyMixinFarmerHi(
                      f
                        .replace(/\s*—\s*अनिवार्य.*/i, "")
                        .replace(/\s*\(MANDATORY\)/i, "")
                        .trim()
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {/* DAP + Zinc Warning Alert */}
      <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-3.5 shadow-sm dark:bg-amber-950/20">
        <div className="flex items-start gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white font-black text-xs shadow-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
          <div>
            <h4 className="text-[12.5px] font-black text-amber-950 dark:text-amber-100">
              सुनहरा नियम: DAP / SSP के साथ जिंक सल्फेट कभी न मिलाएँ!
            </h4>
            <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-amber-900/90 dark:text-amber-200/90">
              फॉस्फोरस और जिंक मिलकर अघुलनशील जिंक फॉस्फेट बन जाते हैं। बुवाई पर डीएपी दें, और जिंक सल्फेट या तो खेत तैयारी में अलग दें या पहली सिंचाई पर यूरिया के साथ दें।
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-0.5 pt-1">
        <div>
          <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
            चरणबद्ध खाद तालिका (कब क्या डालें)
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
            हर चरण पर क्लिक करके खाद की खुराक और डालने का सही तरीका देखें
          </p>
        </div>
      </div>

      <ol className="relative space-y-3">
        {stages.map((stage) => {
          const open = openId === stage.stageNumber;
          const title = simplifyMixinFarmerHi(stage.titleHi);
          const timing = simplifyMixinFarmerHi(stage.timingHi);
          return (
            <li
              key={`${stage.stageNumber}-${stage.titleHi}`}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-200",
                open
                  ? "border-emerald-500/40 bg-[var(--av-surface)] shadow-md shadow-emerald-950/5 ring-1 ring-emerald-500/20"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] shadow-xs hover:border-emerald-500/30"
              )}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : stage.stageNumber)}
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-black transition",
                      open
                        ? "bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/20"
                        : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                    )}
                  >
                    0{stage.stageNumber}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[13.5px] font-black leading-snug text-[var(--av-text-primary)]">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      ⏰ {timing}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!open && stage.products.length ? (
                    <span className="hidden sm:inline-block rounded-md bg-[var(--av-surface-inset)] px-2 py-0.5 text-[10px] font-bold text-[var(--av-text-muted)]">
                      {stage.products.length} खाद
                    </span>
                  ) : null}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition-transform duration-200",
                      open && "rotate-180 text-emerald-600"
                    )}
                  />
                </div>
              </button>

              {open ? (
                <div className="space-y-3 border-t border-[var(--av-border)] bg-[var(--av-surface-inset)]/30 p-3.5 pt-3">
                  <ul className="space-y-2">
                    {stage.products.map((p, i) => (
                      <ProductRow
                        key={`${p.name}-${p.doseHi}-${i}`}
                        product={p}
                        acres={acres}
                      />
                    ))}
                  </ul>

                  {stage.howHi ? (
                    <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2.5 text-[11.5px] font-semibold text-emerald-950 dark:text-emerald-100">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>डालने की विधि: {simplifyMixinFarmerHi(stage.howHi)}</span>
                    </div>
                  ) : null}

                  {stage.tipHi ? (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-[11px] font-medium text-amber-950 dark:text-amber-100">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <span>{simplifyMixinFarmerHi(stage.tipHi)}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
