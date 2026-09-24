"use client";

import type { CropFertilizerMixinGuide } from "@/lib/crops/fertilizerMixinFieldGuide";
import {
  buildMixinScheduleStages,
  type MixinScheduleProduct,
} from "@/lib/crops/fertilizerMixinTabs";
import { fertilizerProductImage } from "@/lib/crops/fertilizerFarmerUi";
import { simplifyMixinFarmerHi } from "@/lib/crops/simplifyMixinFarmerHi";
import { cn } from "@/lib/cn";
import { ChevronDown, Lightbulb, MapPin } from "lucide-react";
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
      : `${doseBase} (${Math.round(acres * 100) / 100} एकड़ के हिसाब से)`;
  const note = product.noteHi ? simplifyMixinFarmerHi(product.noteHi) : "";
  const tag = product.tagHi ? simplifyMixinFarmerHi(product.tagHi) : "";

  return (
    <li className="flex items-start gap-2.5">
      <span className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--av-border)] bg-white">
        <Image
          src={fertilizerProductImage(product.name)}
          alt=""
          fill
          className="object-cover"
          sizes="40px"
        />
      </span>
      <span className="min-w-0 flex-1">
        {tag ? (
          <span className="mb-0.5 block text-[9px] font-bold tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
            {tag}
          </span>
        ) : null}
        <span className="block text-[12px] font-extrabold leading-snug text-[var(--av-text-primary)]">
          {name}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
          {dose}
        </span>
        {note ? (
          <span className="mt-0.5 block text-[10px] text-[var(--av-text-muted)]">{note}</span>
        ) : null}
        {product.brands?.length ? (
          <span className="mt-0.5 block text-[10px] text-[var(--av-text-muted)]">
            दुकान / बाज़ार में इस नाम से: {product.brands.join(" / ")}
          </span>
        ) : null}
      </span>
    </li>
  );
}

export default function CropFertilizerMixinPanel({
  guide,
  acres,
}: {
  guide: CropFertilizerMixinGuide;
  acres: number;
  cropLabelHi?: string;
}) {
  const stages = useMemo(() => buildMixinScheduleStages(guide), [guide]);
  const [openId, setOpenId] = useState<number | null>(
    () => stages[0]?.stageNumber ?? null
  );

  return (
    <div className="space-y-3">
      {(guide.totalNutrientsHi?.length || guide.totalFertilizerHi?.length) && (
        <section className="rounded-2xl border border-emerald-600/15 bg-emerald-50/60 px-3 py-3 dark:bg-emerald-950/25">
          <p className="text-[12px] font-black text-emerald-950 dark:text-emerald-50">
            कुल जरूरत (एक एकड़)
          </p>
          {guide.totalNutrientsHi?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {guide.totalNutrientsHi.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-emerald-600/15 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-black/30 dark:text-emerald-100"
                >
                  {simplifyMixinFarmerHi(
                    n.replace(/\s*\(.*?\)\s*$/, "").replace(/\s*—.*$/, "")
                  )}
                </span>
              ))}
            </div>
          ) : null}
          {guide.totalFertilizerHi?.length ? (
            <ul className="mt-2 space-y-1">
              {guide.totalFertilizerHi.map((f) => (
                <li
                  key={f}
                  className="text-[11px] font-semibold leading-snug text-[var(--av-text-primary)]"
                >
                  •{" "}
                  {simplifyMixinFarmerHi(
                    f
                      .replace(/\s*—\s*अनिवार्य.*/i, "")
                      .replace(/\s*\(MANDATORY\)/i, "")
                      .trim()
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      <div>
        <p className="text-[12px] font-black text-[var(--av-text-primary)]">
          कब क्या डालें
        </p>
        <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
          चरण खोलकर मात्रा देखें · पत्ती स्प्रे और जैविक अलग टैब में
        </p>
      </div>

      <ol className="relative space-y-0 pl-1">
        <span
          aria-hidden
          className="absolute bottom-4 left-[22px] top-4 w-0.5 bg-emerald-500/20"
        />
        {stages.map((stage) => {
          const open = openId === stage.stageNumber;
          const title = simplifyMixinFarmerHi(stage.titleHi);
          const timing = simplifyMixinFarmerHi(stage.timingHi);
          return (
            <li
              key={`${stage.stageNumber}-${stage.titleHi}`}
              className="relative pb-3 pl-10"
            >
              <span className="absolute left-1.5 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white shadow-sm">
                {stage.stageNumber}
              </span>
              <div className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : stage.stageNumber)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-black leading-snug text-[var(--av-text-primary)]">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-emerald-800/75 dark:text-emerald-200/75">
                      {timing}
                    </span>
                    {!open && stage.products.length ? (
                      <span className="mt-1 block text-[10px] text-[var(--av-text-muted)]">
                        {stage.products
                          .slice(0, 3)
                          .map((p) =>
                            simplifyMixinFarmerHi(p.name.split(" · ")[0] || p.name)
                          )
                          .join(" · ")}
                        {stage.products.length > 3 ? "…" : ""}
                      </span>
                    ) : null}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition",
                      open && "rotate-180"
                    )}
                  />
                </button>

                {open ? (
                  <div className="space-y-2.5 border-t border-[var(--av-border)] px-3 pb-3 pt-2.5">
                    <ul className="space-y-2.5">
                      {stage.products.map((p, i) => (
                        <ProductRow
                          key={`${p.name}-${p.doseHi}-${i}`}
                          product={p}
                          acres={acres}
                        />
                      ))}
                    </ul>
                    {stage.howHi ? (
                      <p className="flex gap-1.5 rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-2 text-[11px] leading-snug text-[var(--av-text-secondary)]">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span>{simplifyMixinFarmerHi(stage.howHi)}</span>
                      </p>
                    ) : null}
                    {stage.tipHi ? (
                      <p className="flex gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/8 px-2.5 py-2 text-[11px] leading-snug text-amber-950 dark:text-amber-100">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{simplifyMixinFarmerHi(stage.tipHi)}</span>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
