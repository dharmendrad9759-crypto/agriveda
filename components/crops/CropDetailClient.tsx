"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bug,
  ChevronRight,
  Droplets,
  FlaskConical,
  Leaf,
  Shield,
  Sprout,
  Wheat,
  LeafyGreen,
} from "lucide-react";
import AnimatedGrowthTimeline from "@/components/crops/AnimatedGrowthTimeline";
import ExpandablePanel, { TimingBadge } from "@/components/crops/ExpandablePanel";
import MotionCard from "@/components/motion/MotionCard";
import MotionPressable from "@/components/motion/MotionPressable";
import { enrichCropDetail } from "@/lib/cropDetailEnrichment";
import { fadeDown, tabPanel } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";

const TABS = [
  { id: "overview", label: "Overview", icon: Leaf },
  { id: "growth", label: "Growth Stages", icon: Sprout },
  { id: "fertilizer", label: "Fertilization", icon: FlaskConical },
  { id: "protection", label: "Pest & Disease", icon: Bug },
  { id: "nutrition", label: "Nutrition", icon: Wheat },
  { id: "irrigation", label: "Irrigation", icon: Droplets },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CATEGORY_LABEL: Record<Crop["category"], string> = {
  Cereals: "Cereals",
  Vegetables: "Vegetables",
  Pulses: "Pulses",
  Millets: "Millets",
  "Cash-Crops": "Cash Crops",
};

function MiniStat({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <MotionCard delay={index} className="min-h-[72px] px-3 py-2.5 sm:min-h-[80px]">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-[#f1f5f9] break-words">{value}</p>
    </MotionCard>
  );
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface Props {
  crop: Crop;
}

export default function CropDetailClient({ crop }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const reduced = useReducedMotion();
  const detail = useMemo(() => enrichCropDetail(crop), [crop]);

  const timingHint =
    detail.establishment === "transplant"
      ? "DAT = Days After Transplanting"
      : "DAS = Days After Sowing";

  const statPills = [
    { icon: "⏱", value: crop.durationDays },
    { icon: "📈", value: crop.estimatedYield },
    { icon: "🌤", value: crop.suitableSeason },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 px-3 py-4 pb-10 sm:px-4">
      <motion.header
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-[#1f2937] bg-[#111827] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#10b981] bg-[#10b981]/10">
              {CATEGORY_LABEL[crop.category]}
            </span>
            <h1 className="mt-1 text-[clamp(1.125rem,4.5vw,1.5rem)] font-bold leading-tight text-[#f1f5f9]">
              {crop.name}
            </h1>
            <p className="mt-0.5 text-xs italic text-[#94a3b8]">{crop.scientificName}</p>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-hide sm:flex-wrap sm:overflow-visible">
            {statPills.map((pill) => (
              <span
                key={pill.value}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[#1f2937] bg-[#0a0f1a] px-3 py-2 text-xs leading-snug text-[#f1f5f9] sm:text-sm"
              >
                <span className="mr-1.5">{pill.icon}</span>
                <span className="whitespace-normal">{pill.value}</span>
              </span>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">{crop.overview}</p>
        <p className="mt-2 text-[10px] font-medium text-[#64748b]">
          {detail.establishment === "transplant" ? "🌱 Transplanted crop" : "🌾 Direct-sown crop"} · {timingHint}
        </p>
      </motion.header>

      <nav className="relative border-b border-[#1f2937]">
        <div className="flex gap-0.5 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex min-h-[44px] shrink-0 items-center gap-1.5 px-3 py-2.5 text-xs font-semibold sm:px-4 sm:text-sm ${
                  active ? "text-[#10b981]" : "text-[#94a3b8] hover:text-[#f1f5f9]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="crop-detail-tab-underline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#10b981]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={reduced ? false : tabPanel.initial}
          animate={tabPanel.animate}
          exit={reduced ? undefined : tabPanel.exit}
          transition={tabPanel.transition}
          className="space-y-3"
        >
          {activeTab === "overview" && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <MiniStat label="Duration" value={crop.durationDays} index={0} />
                <MiniStat label="Yield" value={crop.estimatedYield} index={1} />
                <MiniStat label="Soil" value={crop.suitableSoil} index={2} />
                <MiniStat label="Season" value={crop.suitableSeason} index={3} />
                <MiniStat label="Seed Rate" value={crop.seedRate} index={4} />
                <MiniStat label="Spacing" value={crop.spacing} index={5} />
                <MiniStat label="Climate" value={crop.climate} index={6} />
                <MiniStat label="Sowing" value={crop.sowingGuide.bestSowingTime} index={7} />
              </motion.div>

              <div className="grid gap-2 sm:grid-cols-2">
                {TABS.filter((t) => t.id !== "overview").map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      className="flex min-h-[52px] items-center gap-3 rounded-xl border border-[#1f2937] bg-[#111827] px-4 py-3 text-left transition-colors hover:border-[#10b981]/40"
                    >
                      <Icon className="h-4 w-4 text-[#10b981]" />
                      <span className="text-sm font-semibold text-[#f1f5f9]">{t.label}</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-[#64748b]" />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "growth" && (
            <AnimatedGrowthTimeline stages={detail.growthStages} />
          )}

          {activeTab === "fertilizer" && (
            <div className="space-y-2">
              <p className="rounded-lg border border-[#1f2937] bg-[#0a0f1a] px-3 py-2 text-xs text-[#94a3b8]">
                💡 {timingHint} — हर खाद कब देनी है, नीचे टैप करके देखें
              </p>

              {detail.fertilizers.map((f, i) => (
                <ExpandablePanel
                  key={`${f.label}-${i}`}
                  title={f.label}
                  subtitle={f.dose}
                  badge={f.timingRef}
                  icon={FlaskConical}
                  accent={i === 0 ? "green" : "amber"}
                  defaultOpen={i === 0}
                >
                  <div className="space-y-2">
                    <TimingBadge timing={f.timing} ref={f.timingRef} />
                    <p className="text-sm font-semibold text-[#f1f5f9]">{f.dose}</p>
                    {f.notes && <p className="text-xs leading-relaxed text-[#94a3b8]">{f.notes}</p>}
                  </div>
                </ExpandablePanel>
              ))}

              {crop.fertilizerSchedule.micronutrients.length > 0 && (
                <ExpandablePanel title="Micronutrients" icon={LeafyGreen} accent="sky">
                  <ul className="space-y-1.5">
                    {crop.fertilizerSchedule.micronutrients.map((m) => (
                      <li key={m} className="text-sm text-[#f1f5f9]">
                        • {m}
                      </li>
                    ))}
                  </ul>
                </ExpandablePanel>
              )}

              {crop.fertilizerSchedule.foliarSpray.length > 0 && (
                <ExpandablePanel title="Foliar Spray" icon={Sprout} accent="violet">
                  <ul className="space-y-1.5">
                    {crop.fertilizerSchedule.foliarSpray.map((m) => (
                      <li key={m} className="text-sm text-[#f1f5f9]">
                        • {m}
                      </li>
                    ))}
                  </ul>
                </ExpandablePanel>
              )}
            </div>
          )}

          {activeTab === "protection" && (
            <div className="space-y-2">
              <MotionPressable as="span" className="block">
                <Link
                  href={`/pest-diseases?crop=${crop.slug}`}
                  className="flex min-h-[48px] items-center justify-between gap-2 rounded-xl border border-[#10b981]/30 bg-[#10b981]/5 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-[#f1f5f9]">
                    Stage-wise spray guide →
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#10b981]" />
                </Link>
              </MotionPressable>

              <ExpandablePanel
                title="Major Pests"
                subtitle={`${detail.pests.length} pests — tap to expand`}
                badge={`${detail.pests.length}`}
                icon={Bug}
                accent="rose"
                defaultOpen
              >
                <div className="space-y-2">
                  {detail.pests.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-lg border border-[#1f2937] bg-[#0a0f1a] p-3"
                    >
                      <p className="text-sm font-semibold text-[#f1f5f9]">{p.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">{p.detail}</p>
                      {p.timing && (
                        <p className="mt-2 text-[11px] font-medium text-[#10b981]">⏱ {p.timing}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ExpandablePanel>

              <ExpandablePanel
                title="Major Diseases"
                subtitle={`${detail.diseases.length} diseases`}
                badge={`${detail.diseases.length}`}
                icon={Shield}
                accent="amber"
              >
                <div className="space-y-2">
                  {detail.diseases.map((d) => (
                    <div
                      key={d.name}
                      className="rounded-lg border border-[#1f2937] bg-[#0a0f1a] p-3"
                    >
                      <p className="text-sm font-semibold text-[#f1f5f9]">{d.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">{d.detail}</p>
                      {d.timing && (
                        <p className="mt-2 text-[11px] font-medium text-[#10b981]">⏱ {d.timing}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ExpandablePanel>

              <ExpandablePanel
                title="Weed Management"
                subtitle="अलग से खरपतवार नियंत्रण"
                badge={`${detail.weeds.length}`}
                icon={LeafyGreen}
                accent="green"
              >
                <div className="space-y-2">
                  {detail.weeds.map((w) => (
                    <div
                      key={w.name}
                      className="rounded-lg border border-[#1f2937] bg-[#0a0f1a] p-3"
                    >
                      <p className="text-sm font-semibold text-[#f1f5f9]">{w.name}</p>
                      <p className="mt-1 text-xs text-[#94a3b8]">{w.detail}</p>
                      <p className="mt-2 text-[11px] text-[#10b981]">⏱ {w.timing}</p>
                    </div>
                  ))}
                </div>
              </ExpandablePanel>

              <ExpandablePanel
                title="Neem & IPM (जैविक / नीम)"
                subtitle="नीम, ट्राइकोडर्मा, लाभकारी कीट"
                icon={Leaf}
                accent="violet"
              >
                <div className="space-y-2">
                  {detail.ipm.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3"
                    >
                      <p className="text-sm font-semibold text-[#f1f5f9]">{item.name}</p>
                      <p className="mt-1 text-xs text-[#10b981]">⏱ {item.timing}</p>
                      <p className="mt-1 text-sm text-[#94a3b8]">{item.dose}</p>
                      {item.notes && (
                        <p className="mt-1 text-xs text-[#64748b]">{item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ExpandablePanel>

              <ExpandablePanel title="Prevention & Chemical Control" icon={Shield} accent="sky">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-[#94a3b8]">Prevention</p>
                    <ul className="mt-2 space-y-1">
                      {crop.cropProtection.prevention.map((p) => (
                        <li key={p} className="text-sm text-[#f1f5f9]">
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-[#10b981]">Control</p>
                    <ul className="mt-2 space-y-1">
                      {crop.cropProtection.control.map((c) => (
                        <li key={c} className="text-sm text-[#f1f5f9]">
                          • {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ExpandablePanel>
            </div>
          )}

          {activeTab === "nutrition" && (
            <div className="space-y-2">
              <p className="rounded-lg border border-[#1f2937] bg-[#0a0f1a] px-3 py-2 text-xs text-[#94a3b8]">
                हर क्रॉप में N, K, Ca, Mg, S, Fe, Zn — टैप करके लक्षण और समाधान देखें
              </p>
              {detail.nutrients.map((n, i) => (
                <ExpandablePanel
                  key={n.nutrient}
                  title={n.nutrient}
                  subtitle={n.role}
                  icon={Wheat}
                  accent={i % 2 === 0 ? "amber" : "green"}
                >
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-[#94a3b8]">लक्षण</p>
                      <p className="mt-1 text-[#f1f5f9]">{n.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-[#94a3b8]">कारण</p>
                      <p className="mt-1 text-[#94a3b8]">{n.cause}</p>
                    </div>
                    <div className="rounded-lg border border-[#10b981]/20 bg-[#10b981]/5 p-3">
                      <p className="text-[11px] font-bold uppercase text-[#10b981]">समाधान</p>
                      <p className="mt-1 text-[#f1f5f9]">{n.solution}</p>
                    </div>
                    <Link
                      href={`/deficiencies/${toSlug(n.nutrient)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#10b981]"
                    >
                      पूरी गाइड <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </ExpandablePanel>
              ))}
            </div>
          )}

          {activeTab === "irrigation" && (
            <div className="space-y-2">
              <p className="rounded-lg border border-[#1f2937] bg-[#0a0f1a] px-3 py-2 text-xs text-[#94a3b8]">
                💧 {timingHint} — कितने दिन पर, कितनी सिंचाई
              </p>

              <ExpandablePanel
                title="Water Requirement"
                subtitle={crop.irrigationManagement.waterRequirement}
                icon={Droplets}
                accent="sky"
                defaultOpen
              >
                <p className="text-sm leading-relaxed text-[#f1f5f9]">
                  {crop.irrigationManagement.waterRequirement}
                </p>
                <p className="mt-2 text-xs text-[#94a3b8]">
                  Critical stages: {crop.irrigationManagement.criticalStages.join(" · ")}
                </p>
              </ExpandablePanel>

              {detail.irrigations.map((ir, i) => (
                <ExpandablePanel
                  key={`${ir.label}-${i}`}
                  title={ir.label}
                  subtitle={ir.amount}
                  badge={ir.timingRef}
                  icon={Droplets}
                  accent="green"
                >
                  <div className="space-y-2">
                    <TimingBadge timing={ir.timing} ref={ir.timingRef} />
                    <p className="text-sm font-semibold text-[#f1f5f9]">{ir.amount}</p>
                    {ir.notes && <p className="text-xs text-[#94a3b8]">{ir.notes}</p>}
                  </div>
                </ExpandablePanel>
              ))}

              <ExpandablePanel title="Harvest & Storage" icon={Sprout} accent="amber">
                <ul className="space-y-1.5 text-sm text-[#f1f5f9]">
                  <li>• {crop.harvestAndYield.harvestingTime}</li>
                  <li>• Yield: {crop.harvestAndYield.yield}</li>
                  {crop.harvestAndYield.storageTips.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </ExpandablePanel>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
