import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaf, Sprout, FlaskConical, Droplets, ShieldCheck, Tractor, PackageCheck, Wheat, ChevronRight } from "lucide-react";
import cropsData, { type Crop as CropData } from "@/data/crops";
import { BRAND } from "@/lib/brand";

interface Props {
  params: Promise<{ slug: string }>;
}

const sectionMeta = [
  { key: "overview", title: "Crop Overview", description: "Quick farm-friendly snapshot", icon: <Leaf className="h-5 w-5" /> },
  { key: "sowing", title: "Sowing Guide", description: "Best practices for establishment", icon: <Sprout className="h-5 w-5" /> },
  { key: "fertilizer", title: "Fertilizer Schedule", description: "Balanced nutrition by stage", icon: <FlaskConical className="h-5 w-5" /> },
  { key: "irrigation", title: "Irrigation Management", description: "Water planning and timing", icon: <Droplets className="h-5 w-5" /> },
  { key: "protection", title: "Crop Protection", description: "Pests, diseases, weeds and control", icon: <ShieldCheck className="h-5 w-5" /> },
  { key: "deficiency", title: "Nutrient Deficiency", description: "Key symptoms and remedies", icon: <Wheat className="h-5 w-5" /> },
  { key: "harvest", title: "Harvest & Yield", description: "Harvesting, maturity and storage", icon: <Tractor className="h-5 w-5" /> },
  { key: "market", title: "Market Information", description: "Demand, MSP and price outlook", icon: <PackageCheck className="h-5 w-5" /> },
] as const;

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function CropDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const crop = cropsData.find((item): item is CropData => item.slug === resolvedParams.slug);

  if (!crop) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_25%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#020617)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[32px] border border-emerald-400/20 bg-slate-900/75 p-6 shadow-[0_20px_90px_rgba(16,185,129,0.16)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(34,197,94,0.2),_transparent_18%),radial-gradient(circle_at_80%_0%,_rgba(56,189,248,0.16),_transparent_20%)]" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
              <Leaf className="h-3.5 w-3.5" />
              {crop.category} • {BRAND}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{crop.name}</h1>
              <p className="text-base italic text-slate-400 sm:text-lg">{crop.scientificName}</p>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{crop.overview}</p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Duration", value: crop.durationDays },
            { label: "Expected yield", value: crop.estimatedYield },
            { label: "Seed rate", value: crop.seedRate },
            { label: "Spacing", value: crop.spacing },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <div className="space-y-4">
          {sectionMeta.map((section) => {
            const isOverview = section.key === "overview";
            return (
              <details key={section.key} open={isOverview} className="group rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_10px_45px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                      <p className="text-sm text-slate-400">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-open:rotate-90" />
                </summary>

                <div className="mt-5 space-y-4">
                  {section.key === "overview" && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {[
                        { label: "Introduction", value: crop.overview },
                        { label: "Scientific Name", value: crop.scientificName },
                        { label: "Duration", value: crop.durationDays },
                        { label: "Suitable Season", value: crop.suitableSeason },
                        { label: "Suitable Soil", value: crop.suitableSoil },
                        { label: "Climate", value: crop.climate },
                        { label: "Expected Yield", value: crop.estimatedYield },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-200">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === "sowing" && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      {[
                        { label: "Best Sowing Time", value: crop.sowingGuide.bestSowingTime },
                        { label: "Seed Rate", value: crop.sowingGuide.seedRate },
                        { label: "Seed Treatment", value: crop.sowingGuide.seedTreatment },
                        { label: "Spacing", value: crop.sowingGuide.spacing },
                        { label: "Sowing Method", value: crop.sowingGuide.sowingMethod },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-200">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === "fertilizer" && (
                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Basal Dose</p>
                        <ul className="mt-3 space-y-2">
                          {crop.fertilizerSchedule.basalDose.map((item) => (
                            <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Stage-wise Schedule</p>
                          <div className="mt-3 space-y-2">
                            {crop.fertilizerSchedule.stageWise.map((stage) => (
                              <div key={stage.stage} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <p className="text-sm font-semibold text-white">{stage.stage}</p>
                                <ul className="mt-2 space-y-1">
                                  {stage.details.map((detail) => (
                                    <li key={detail} className="text-sm leading-6 text-slate-300">• {detail}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Micronutrients</p>
                          <ul className="mt-3 space-y-2">
                            {crop.fertilizerSchedule.micronutrients.map((item) => (
                              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Foliar Spray</p>
                          <ul className="mt-3 space-y-2">
                            {crop.fertilizerSchedule.foliarSpray.map((item) => (
                              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.key === "irrigation" && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Water Requirement</p>
                        <p className="mt-2 text-sm leading-6 text-slate-200">{crop.irrigationManagement.waterRequirement}</p>
                      </div>
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Critical Stages</p>
                        <ul className="mt-3 space-y-2">
                          {crop.irrigationManagement.criticalStages.map((item) => (
                            <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Irrigation Schedule</p>
                        <ul className="mt-3 space-y-2">
                          {crop.irrigationManagement.schedule.map((item) => (
                            <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {section.key === "protection" && (
                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Major Pests</p>
                        <ul className="mt-3 space-y-2">{crop.cropProtection.majorPests.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>)}</ul>
                      </div>
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Major Diseases</p>
                        <ul className="mt-3 space-y-2">{crop.cropProtection.majorDiseases.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>)}</ul>
                      </div>
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Weed Management</p>
                        <ul className="mt-3 space-y-2">{crop.cropProtection.weedManagement.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>)}</ul>
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Symptoms</p>
                          <ul className="mt-3 space-y-2">{crop.cropProtection.symptoms.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>)}</ul>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Prevention & Control</p>
                          <ul className="mt-3 space-y-2">{crop.cropProtection.prevention.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{item}</li>)}</ul>
                          <ul className="mt-2 space-y-2">{crop.cropProtection.control.map((item) => <li key={item} className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{item}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.key === "deficiency" && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {crop.nutrientDeficiencies.map((item) => (
                        <div key={item.nutrient} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-base font-semibold text-white">{item.nutrient}</p>
                          <div className="mt-3 space-y-2 text-sm text-slate-300">
                            <p><span className="font-semibold text-slate-100">Symptoms:</span> {item.symptoms}</p>
                            <p><span className="font-semibold text-slate-100">Cause:</span> {item.cause}</p>
                            <p><span className="font-semibold text-slate-100">Solution:</span> {item.solution}</p>
                          </div>
                          <Link href={`/deficiencies/${toSlug(item.nutrient)}`} className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-200">
                            Read More
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === "harvest" && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        { label: "Harvesting Time", value: crop.harvestAndYield.harvestingTime },
                        { label: "Maturity Signs", value: crop.harvestAndYield.maturitySigns.join(" • ") },
                        { label: "Yield", value: crop.harvestAndYield.yield },
                        { label: "Storage Tips", value: crop.harvestAndYield.storageTips.join(" • ") },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-200">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === "market" && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        { label: "Major Markets", value: crop.marketInformation.majorMarkets.join(" • ") },
                        { label: "Demand", value: crop.marketInformation.demand },
                        { label: "MSP", value: crop.marketInformation.msp },
                        { label: "Price Trend", value: crop.marketInformation.priceTrend },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-200">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </main>
  );
}
