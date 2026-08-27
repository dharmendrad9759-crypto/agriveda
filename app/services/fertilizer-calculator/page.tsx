"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, Package } from "lucide-react";
import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import { cropCatalog } from "@/data/crop-catalog";
import {
  buildFertilizerPlan,
  listFertilizerCrops,
  type SoilTestLevels,
} from "@/lib/agriveda2/fertilizerEngine";
import {
  fertilizerAmountParts,
  fertilizerBagPurposeHi,
} from "@/data/agriveda2/fertilizer-data";
import { convertToAcres, type AreaUnit } from "@/lib/agriveda2/seedCalculatorEngine";
import { EASE_OUT } from "@/lib/motion/variants";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import SoilTestInputs from "@/components/fertilizer/SoilTestInputs";

export default function FertilizerCalculatorPage() {
  const slugs = useMemo(() => listFertilizerCrops(), []);
  const crops = cropCatalog.filter((c) => slugs.includes(c.slug));

  const defaultSlug = slugs.includes("paddy")
    ? "paddy"
    : crops[0]?.slug ?? "wheat";

  const [slug, setSlug] = useState(defaultSlug);
  const [area, setArea] = useState("1");
  const [soilTest, setSoilTest] = useState<SoilTestLevels>({});
  const [editing, setEditing] = useState(false);
  const [showSoil, setShowSoil] = useState(false);

  const acres = useMemo(() => {
    const n = parseFloat(area);
    if (!n || n <= 0) return 0;
    return convertToAcres(n, "acre" satisfies AreaUnit);
  }, [area]);

  const plan = useMemo(() => {
    if (!acres) return null;
    return buildFertilizerPlan(slug, acres, soilTest);
  }, [slug, acres, soilTest]);

  const cropHi = getCropHindiName(slug) || cropCatalog.find((c) => c.slug === slug)?.name || slug;
  const areaLabel = Number.isInteger(acres) ? String(acres) : acres.toFixed(1);

  return (
    <Agriveda2Shell
      title="खाद कैलकुलेटर"
      subtitle="कितनी खाद · कब डालें"
      backHref="/dashboard"
    >
      <div className="mx-auto max-w-lg space-y-3">
        <div
          className={cn(
            AV.card,
            "overflow-hidden rounded-[20px] border border-emerald-500/20 p-[18px] shadow-[var(--av-shadow-sm)]"
          )}
        >
          {/* Crop · area summary */}
          <div className="mb-2.5 flex items-center justify-between gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3.5 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveCropImage({
                    slug,
                    name: cropCatalog.find((c) => c.slug === slug)?.name ?? slug,
                  })}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-[var(--av-text-primary)]">
                  {cropHi} · {areaLabel} एकड़
                </p>
                <p className="text-[12px] text-[var(--av-text-muted)]">फसल और रकबा</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="shrink-0 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1.5 text-[12px] font-bold text-emerald-800 dark:text-emerald-200"
            >
              {editing ? "ठीक" : "बदलें"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {editing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="mb-3 space-y-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold text-[var(--av-text-muted)]">
                      फसल चुनें
                    </p>
                    <div className="-mx-0.5 flex gap-2 overflow-x-auto px-0.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {crops.map((c) => {
                        const active = c.slug === slug;
                        const hi = getCropHindiName(c.slug);
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => setSlug(c.slug)}
                            className={cn(
                              "flex w-[68px] shrink-0 flex-col items-center gap-1 rounded-xl border p-1",
                              active
                                ? "border-emerald-500/55 bg-emerald-500/12"
                                : "border-[var(--av-border)] bg-[var(--av-surface)]"
                            )}
                          >
                            <span className="relative h-12 w-12 overflow-hidden rounded-lg">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={resolveCropImage({ slug: c.slug, name: c.name })}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </span>
                            <span className="line-clamp-1 text-[10px] font-bold text-[var(--av-text-primary)]">
                              {hi || c.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                      खेत कितना एकड़?
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="av-input mt-1 w-full rounded-xl px-3 py-2 text-sm font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="av-btn av-btn-primary w-full rounded-xl py-2.5 text-[13px] font-bold"
                  >
                    योजना देखें
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!plan ? (
            <p className="py-6 text-center text-[14px] text-[var(--av-text-muted)]">
              ऊपर एकड़ भरें — खाद योजना यहाँ आएगी
            </p>
          ) : (
            <motion.div
              key={`${slug}-${acres}-${plan.soilFactors.n}-${plan.soilFactors.p}-${plan.soilFactors.k}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <p className="mb-2.5 text-[14px] font-bold text-[var(--av-text-primary)]">
                कुल कितनी खाद चाहिए
              </p>
              {plan.bags.length > 0 ? (
                <div className="mb-[18px] grid grid-cols-2 gap-2.5">
                  {plan.bags.map((b) => {
                    const { num, rest } = fertilizerAmountParts(b.amount);
                    return (
                      <div
                        key={b.name}
                        className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3"
                      >
                        <Package
                          className="h-[18px] w-[18px] text-[var(--av-accent)]"
                          aria-hidden
                        />
                        <p className="mt-2 text-[13px] font-bold leading-tight text-[var(--av-text-primary)]">
                          {b.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
                          {fertilizerBagPurposeHi(b.name)}
                        </p>
                        <p className="mt-2 text-[22px] font-bold leading-none text-[var(--av-text-primary)]">
                          {num}{" "}
                          <span className="text-[13px] font-medium text-[var(--av-text-muted)]">
                            किग्रा
                          </span>
                        </p>
                        {rest && !/^किग्रा/i.test(rest) ? (
                          <p className="mt-1 text-[10px] text-[var(--av-text-muted)] line-clamp-1">
                            {rest.replace(/^किग्रा\s*·?\s*/, "")}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mb-4 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-[13px] text-[var(--av-text-secondary)]">
                  इस फसल की पूरी खुराक अभी तैयार नहीं — नीचे समय देखें या दूसरी फसल चुनें।
                </p>
              )}

              {plan.schedule.length > 0 && (
                <>
                  <p className="mb-2.5 text-[14px] font-bold text-[var(--av-text-primary)]">
                    कब कितना डालें
                  </p>
                  <div className="mb-2 flex flex-col">
                    {plan.schedule.map((s, i) => {
                      const last = i === plan.schedule.length - 1;
                      return (
                        <div key={`${s.time}-${i}`} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-[13px] font-bold text-white">
                              {i + 1}
                            </div>
                            {!last && (
                              <div className="my-1 w-px flex-1 bg-[var(--av-border)]" />
                            )}
                          </div>
                          <div className={cn(!last && "pb-4")}>
                            <p className="mb-1.5 text-[14px] font-bold text-[var(--av-text-primary)]">
                              {s.time}
                            </p>
                            <p className="text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
                              {s.apply}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {(plan.farmerTipHi ||
                plan.guideNotes.find((n) => !n.includes("मिट्टी जाँच"))) && (
                <div className="mt-1.5 flex gap-2.5 rounded-xl border border-amber-500/35 bg-amber-500/10 p-3">
                  <AlertTriangle
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber-600 dark:text-amber-400"
                    aria-hidden
                  />
                  <p className="text-[13px] leading-relaxed text-[var(--av-text-primary)]">
                    {plan.farmerTipHi ||
                      plan.guideNotes.find((n) => !n.includes("मिट्टी जाँच"))}
                  </p>
                </div>
              )}

              {plan.soilAdjusted && (
                <p className="mt-2.5 text-[11px] leading-snug text-amber-800 dark:text-amber-200">
                  मिट्टी जाँच के हिसाब से मात्रा थोड़ी बदली गई है — लेबल और रिपोर्ट मानें।
                </p>
              )}
            </motion.div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowSoil((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-left"
        >
          <span className="text-[12px] font-bold text-[var(--av-text-primary)]">
            मिट्टी जाँच है? (वैकल्पिक)
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--av-text-muted)] transition",
              showSoil && "rotate-180"
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {showSoil && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-0.5">
                <SoilTestInputs value={soilTest} onChange={setSoilTest} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="px-1 text-center text-[10px] leading-snug text-[var(--av-text-muted)]">
          यह अनुमान है — दवा/खाद का लेबल और स्थानीय सलाह अंतिम है
        </p>
      </div>
    </Agriveda2Shell>
  );
}
