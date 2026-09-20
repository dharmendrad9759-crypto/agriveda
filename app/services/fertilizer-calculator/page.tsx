"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, ChevronDown, Package } from "lucide-react";
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
import { normalizeCropSlug, resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import SoilTestInputs from "@/components/fertilizer/SoilTestInputs";

type Step = "ask" | "plan";

function parseAcresParam(raw: string | null): string | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return String(Math.min(50, Math.max(0.1, n)));
}

function FertilizerCalculatorInner() {
  const searchParams = useSearchParams();
  const slugs = useMemo(() => listFertilizerCrops(), []);
  const crops = cropCatalog.filter((c) => slugs.includes(c.slug));

  const cropFromUrl = useMemo(() => {
    const raw = searchParams.get("crop");
    if (!raw) return null;
    const key = normalizeCropSlug(raw);
    return slugs.includes(key) ? key : null;
  }, [searchParams, slugs]);

  const acresFromUrl = useMemo(
    () => parseAcresParam(searchParams.get("acres")),
    [searchParams]
  );

  const [step, setStep] = useState<Step>(() => (cropFromUrl ? "plan" : "ask"));
  const [slug, setSlug] = useState<string | null>(() => cropFromUrl);
  const [area, setArea] = useState(() => acresFromUrl ?? "1");
  const [soilTest, setSoilTest] = useState<SoilTestLevels>({});
  const [showSoil, setShowSoil] = useState(false);

  useEffect(() => {
    if (!cropFromUrl) return;
    setSlug(cropFromUrl);
    setStep("plan");
    if (acresFromUrl) setArea(acresFromUrl);
  }, [cropFromUrl, acresFromUrl]);

  const acres = useMemo(() => {
    const n = parseFloat(area);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return convertToAcres(n, "acre" satisfies AreaUnit);
  }, [area]);

  const plan = useMemo(() => {
    if (!slug || !acres) return null;
    return buildFertilizerPlan(slug, acres, soilTest);
  }, [slug, acres, soilTest]);

  const cropHi =
    (slug && getCropHindiName(slug)) ||
    cropCatalog.find((c) => c.slug === slug)?.name ||
    slug ||
    "";
  const areaLabel = Number.isInteger(acres) ? String(acres) : acres.toFixed(1);
  const canSeePlan = Boolean(slug && acres > 0);
  const backHref = cropFromUrl
    ? `/crops/${cropFromUrl}/care/fertilizer`
    : "/dashboard";

  return (
    <Agriveda2Shell
      title="खाद कैलकुलेटर"
      subtitle={step === "ask" ? "पहले फसल चुनें" : "कितनी खाद · कब डालें"}
      backHref={backHref}
    >
      <div className="mx-auto max-w-lg space-y-3">
        <AnimatePresence mode="wait" initial={false}>
          {step === "ask" ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className={cn(
                AV.card,
                "space-y-4 overflow-hidden rounded-[20px] border border-emerald-500/20 p-[18px] shadow-[var(--av-shadow-sm)]"
              )}
            >
              <div>
                <p className="text-[17px] font-black tracking-tight text-[var(--av-text-primary)]">
                  किस फसल की खाद चाहिए?
                </p>
                <p className="mt-1 text-[13px] leading-snug text-[var(--av-text-muted)]">
                  फसल चुनो, खेत का एकड़ बताओ — फिर कितनी खाद चाहिए वो दिखेगा।
                </p>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold text-[var(--av-text-muted)]">
                  फसल चुनें
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {crops.map((c) => {
                    const active = c.slug === slug;
                    const hi = getCropHindiName(c.slug);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSlug(c.slug)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-2xl border p-2 text-left transition active:scale-[0.98]",
                          active
                            ? "border-emerald-500/60 bg-emerald-500/15 ring-2 ring-emerald-500/25"
                            : "border-[var(--av-border)] bg-[var(--av-surface)]"
                        )}
                      >
                        <span className="relative h-14 w-full overflow-hidden rounded-xl bg-[var(--av-surface-inset)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveCropImage({ slug: c.slug, name: c.name })}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </span>
                        <span className="line-clamp-1 text-center text-[11px] font-bold text-[var(--av-text-primary)]">
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
                  inputMode="decimal"
                  min="0.1"
                  step="0.1"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  onBlur={() => {
                    const n = parseFloat(area);
                    if (!Number.isFinite(n) || n <= 0) setArea("1");
                    else if (n > 50) setArea("50");
                  }}
                  className="av-input mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm font-semibold"
                  placeholder="जैसे 1 या 2.5"
                />
              </div>

              <button
                type="button"
                disabled={!canSeePlan}
                onClick={() => {
                  if (!canSeePlan) return;
                  setStep("plan");
                }}
                className={cn(
                  "av-btn av-btn-primary w-full rounded-xl py-3 text-[14px] font-bold",
                  !canSeePlan && "pointer-events-none opacity-45"
                )}
              >
                {slug ? "खाद योजना देखें" : "पहले फसल चुनें"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="space-y-3"
            >
              <div
                className={cn(
                  AV.card,
                  "overflow-hidden rounded-[20px] border border-emerald-500/20 p-[18px] shadow-[var(--av-shadow-sm)]"
                )}
              >
                <div className="mb-2.5 flex items-center justify-between gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveCropImage({
                          slug: slug!,
                          name: cropCatalog.find((c) => c.slug === slug)?.name ?? slug!,
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
                    onClick={() => setStep("ask")}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1.5 text-[12px] font-bold text-emerald-800 dark:text-emerald-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    बदलें
                  </button>
                </div>

                {!plan ? (
                  <p className="py-6 text-center text-[14px] text-[var(--av-text-muted)]">
                    एकड़ सही भरें — खाद योजना यहाँ आएगी
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
                                <p className="mt-1 line-clamp-1 text-[10px] text-[var(--av-text-muted)]">
                                  {rest.replace(/^किग्रा\s*·?\s*/, "")}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mb-4 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-[13px] text-[var(--av-text-secondary)]">
                        इस फसल की पूरी खुराक अभी तैयार नहीं — दूसरी फसल चुनें।
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Agriveda2Shell>
  );
}

export default function FertilizerCalculatorPage() {
  return (
    <Suspense
      fallback={
        <Agriveda2Shell
          title="खाद कैलकुलेटर"
          subtitle="लोड हो रहा है…"
          backHref="/dashboard"
        >
          <div className="mx-auto max-w-lg px-1 py-8 text-center text-sm text-[var(--av-text-muted)]">
            कैलकुलेटर खुल रहा है…
          </div>
        </Agriveda2Shell>
      }
    >
      <FertilizerCalculatorInner />
    </Suspense>
  );
}
