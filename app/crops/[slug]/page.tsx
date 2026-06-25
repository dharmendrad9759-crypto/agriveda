// app/crops/[slug]/page.tsx
import { notFound } from "next/navigation";
import { cropsData } from "@/data/crops";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CropDetailPage({ params }: Props) {
  // Next.js 15 के नियम के अनुसार params को await किया
  const resolvedParams = await params;
  
  // डेटाबेस से सही फसल को ढूंढा
  const crop = cropsData.find((item) => item.slug === resolvedParams.slug);

  if (!crop) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 font-sans selection:bg-emerald-500/30">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* ================= HERO SECTION (Premium Top Card) ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-950/40 to-slate-900/40 p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
          
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 border border-emerald-500/20">
              {crop.category} • AGRIVEDA ENGINE
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {crop.name}
            </h1>
            <p className="text-lg md:text-xl italic text-slate-400 font-serif">
              {crop.scientificName}
            </p>
            <p className="max-w-3xl text-base md:text-lg leading-relaxed text-slate-300">
              {crop.overview}
            </p>
          </div>
        </div>

        {/* ================= AGRONOMY QUICK STATS ================= */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "फसल की अवधि", value: crop.durationDays },
            { label: "अनुमानित पैदावार", value: crop.estimatedYield },
            { label: "बीज दर (प्रति एकड़)", value: crop.seedRate },
            { label: "पौधों की दूरी (Spacing)", value: crop.spacing },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="mt-2 text-base md:text-lg font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ================= CLIMATE & SOIL SECTION ================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl transition-all hover:border-emerald-500/30">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              मौसम और जलवायु (Climate)
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">{crop.climate}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl transition-all hover:border-emerald-500/30">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              मिट्टी का चयन (Soil Requirements)
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">{crop.soil}</p>
          </div>
        </div>

        {/* ================= BASAL DOSE (बुवाई की मुख्य खाद) ================= */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:p-8 backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">खेत की तैयारी एवं बेसल डोज (Basal Dose)</h2>
            <p className="text-sm text-slate-400 mt-1">आखिरी जुताई के समय जमीन के अंदर दी जाने वाली तगड़ी खुराक</p>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
            <div className="grid grid-cols-2 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div>खाद / फर्टिलाइजर का नाम</div>
              <div className="text-right">मात्रा (प्रति एकड़)</div>
            </div>
            <div className="divide-y divide-white/5">
              {crop.basalDose.map((dose, index) => (
                <div key={index} className="grid grid-cols-2 px-4 py-3.5 text-sm transition-colors hover:bg-white/[0.02]">
                  <div className="font-medium text-slate-200">{dose.name}</div>
                  <div className="text-right font-semibold text-emerald-400">{dose.dosage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= STAGE WISE SCHEDULE (FARMING BLUEPRINT) ================= */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">स्टेज-वाइज फर्टिगेशन एवं स्प्रे शेड्यूल</h2>
            <p className="text-sm text-slate-400 mt-1">पौधे के विकास के अनुसार वैज्ञानिक और सटीक प्रबंधन की समय सारणी</p>
          </div>

          <div className="space-y-8">
            {crop.stageWiseSchedule.map((stage, sIdx) => (
              <div key={sIdx} className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 md:p-8 shadow-xl">
                
                {/* Stage Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{stage.stageName}</h3>
                    <p className="text-sm text-slate-400 mt-1">{stage.description}</p>
                  </div>
                  <span className="inline-block shrink-0 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 align-self-start md:align-self-center">
                    अवधि: {stage.durationDays}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Fertilizers Inside Stage */}
                  {stage.fertilizers && stage.fertilizers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                        पोषण प्रबंधन (Nutrient via Drip/Soil)
                      </h4>
                      <div className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-3">
                        {stage.fertilizers.map((fert, fIdx) => (
                          <div key={fIdx} className="flex justify-between items-start text-sm border-b border-white/5 last:border-none pb-2 last:pb-0">
                            <div>
                              <p className="font-medium text-slate-200">{fert.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{fert.frequency}</p>
                            </div>
                            <span className="font-semibold text-blue-400 shrink-0 ml-2">{fert.dosage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sprays Inside Stage */}
                  {stage.sprays && stage.sprays.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full"></span>
                        फसल सुरक्षा (Parallel Spray Schedule)
                      </h4>
                      <div className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-4">
                        {stage.sprays.map((spray, spIdx) => (
                          <div key={spIdx} className="space-y-1.5 text-sm border-b border-white/5 last:border-none pb-3 last:pb-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-slate-200"><span className="text-amber-400 font-semibold">लक्ष्य:</span> {spray.target}</p>
                              <span className="text-xs font-bold text-amber-400 shrink-0 ml-2 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{spray.dosage}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {spray.chemicals.map((chem, cIdx) => (
                                <span key={cIdx} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-300 font-mono">
                                  {chem}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ================= MARKET INTELLIGENCE ================= */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-2">मार्केट इंटेलिजेंस (Market Info)</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">{crop.marketInfo}</p>
        </div>

      </div>
    </main>
  );
}