// components/CropCard.tsx
import Link from "next/link";
import { Crop } from "@/types/crop";

interface CropCardProps {
  crop: Crop;
}

export default function CropCard({ crop }: CropCardProps) {
  return (
    <Link href={`/crops/${crop.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-slate-900/60 backdrop-blur-md">
        
        {/* सजावटी ग्रेडिएंट बैकग्राउंड जो होवर करने पर चमकेगा */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl transition-all duration-300 group-hover:bg-emerald-500/10"></div>
        
        <div className="flex items-start gap-4">
          {/* आइकन कंटेनर */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-emerald-500/10 text-emerald-400 font-bold text-xl group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
            {crop.name[0]}
          </div>

          {/* टेक्स्ट डिटेल्स */}
          <div className="min-w-0 space-y-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
              {crop.category}
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight transition-colors group-hover:text-emerald-400">
              {crop.name}
            </h3>
            <p className="text-xs font-medium text-slate-400">
              अवधि: <span className="text-slate-200 font-semibold">{crop.durationDays}</span> {/* यहाँ durationDays कर दिया */}
            </p>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
              {crop.overview}
            </p>
          </div>
        </div>

        {/* नीचे एक प्रीमियम एक्शन हिंट */}
        <div className="mt-4 flex items-center justify-end text-xs font-semibold text-emerald-400 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
          शेड्यूल देखें →
        </div>

      </div>
    </Link>
  );
}