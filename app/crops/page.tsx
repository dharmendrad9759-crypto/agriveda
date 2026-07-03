// app/crops/page.tsx
import { crops } from "@/data/crops";
import CropCard from "@/components/CropCard";

export default function CropsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER SECTION */}
        <div className="border-b border-white/5 pb-6">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
            AGRIVEDA CROP ENGINE
          </span>
          <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            सभी वैज्ञानिक फसल प्रणालियाँ
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-400 max-w-2xl">
            अपनी फसल का चयन करें और बुवाई से लेकर कटाई तक का सटीक टेक्निकल शेड्यूल, फर्टिगेशन प्लान और कीट/रोग प्रबंधन का पूरा डेटा देखें।
          </p>
        </div>

        {/* CROPS GRID LIST */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => (
            <CropCard key={crop.slug} crop={crop} />
          ))}
        </div>

      </div>
    </main>
  );
}