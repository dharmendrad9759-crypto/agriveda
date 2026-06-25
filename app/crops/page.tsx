// app/page.tsx
import Link from "next/link";
import { cropsData } from "@/data/crops";
import CropCard from "@/components/CropCard";

export default function HomePage() {
  // होम पेज पर दिखाने के लिए शुरुआत की 3 फसलें ले रहे हैं
  const featuredCrops = cropsData.slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-6xl space-y-16">
        
        {/* ================= HERO SECTION ================= */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-emerald-950/20 to-slate-900/20 p-8 md:p-16 text-center backdrop-blur-xl shadow-2xl">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 border border-emerald-500/20">
              कृषि का आधुनिक भविष्य • AGRIVEDA v1.0
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
              कृषि विज्ञान और तकनीक का संगम
            </h1>
            <p className="text-sm md:text-lg text-slate-400 leading-relaxed">
              भारतीय किसानों और कृषि विशेषज्ञों के लिए एक प्रीमियम डिजिटल प्लेटफॉर्म। सटीक स्टेज-वाइज फर्टिगेशन, एडवांस्ड स्प्रे शेड्यूल और स्मार्ट रोग प्रबंधन का अनुभव करें।
            </p>
            <div className="pt-4">
              <Link href="/crops" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-black shadow-lg transition-all hover:bg-emerald-400 hover:scale-105">
                क्रॉप इंजन एक्सप्लोर करें →
              </Link>
            </div>
          </div>
        </div>

        {/* ================= FEATURED CROPS SECTION ================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">प्रमुख फसलें (Featured Crops)</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1">वैज्ञानिक दृष्टिकोण और तगड़े टेक्निकल शेड्यूल से भरपूर</p>
            </div>
            <Link href="/crops" className="text-xs font-bold text-emerald-400 hover:underline">
              सभी फसलें देखें →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCrops.map((crop) => (
              <CropCard key={crop.slug} crop={crop} />
            ))}
          </div>
        </div>

        {/* ================= FUTURE MODULES GRID (SaaS Core Features) ================= */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">एडवांस एग्रो टूल्स (Core Modules)</h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">आपके प्लेटफॉर्म को एक कम्प्लीट सुपर-एप बनाने वाले फीचर्स</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "स्मार्ट वेदर इंटेलिजेंस", desc: "जयपुर और छत्तीसगढ़ की मिट्टी के अनुसार सटीक सिंचाई की सलाह।", path: "/weather", badge: "Live" },
              { title: "AI डॉक्टर (Image Diagnosis)", desc: "टमाटर या लौकी के खराब पत्ते की फोटो खींचकर बीमारी का तुरंत तगड़ा इलाज पाएं।", path: "/ai-doctor", badge: "Coming Soon" },
              { title: "मंडी प्राइस ट्रैकर", desc: "देश भर की प्रमुख कृषि मंडियों के ताजा और सटीक लाइव भाव की ट्रैकिंग।", path: "/mandi", badge: "Coming Soon" },
            ].map((mod, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm transition-all hover:border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${mod.badge === "Live" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-400"}`}>
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-200">{mod.title}</h3>
                <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed">{mod.desc}</p>
                <Link href={mod.path} className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-400 hover:underline">
                  ओपन करें →
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}