// app/search/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { cropsData, type Crop as CropData } from "@/data/crops";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // सर्च क्वेरी के आधार पर फसलों को फिल्टर करने वाला तगड़ा लॉजिक
  const filteredResults = cropsData.filter((crop: CropData) => {
    const query = searchQuery.toLowerCase();
    return (
      crop.name.toLowerCase().includes(query) ||
      crop.scientificName.toLowerCase().includes(query) ||
      crop.overview.toLowerCase().includes(query) ||
      crop.category.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-12 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-4xl space-y-10">
        
        {/* हेडर सेक्शन */}
        <div className="space-y-2 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20">
            AGRIVEDA CORE ENGINE
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
            ग्लोबल सर्च इंजन
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            फसल, बीमारी, कीट, पोषक तत्वों की कमी या विशिष्ट रसायनों (Chemicals) को एक क्लिक में खोजें।
          </p>
        </div>

        {/* ================= SEARCH BAR INPUT ================= */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 text-lg">
            🔍
          </div>
          <input
            type="text"
            placeholder="फसल का नाम या बीमारी टाइप करें... (जैसे: टमाटर)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 shadow-2xl backdrop-blur-md transition-all text-sm md:text-base"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-xs font-medium text-slate-500 hover:text-white"
            >
              साफ़ करें
            </button>
          )}
        </div>

        {/* ================= LIVE RESULTS DISPLAY ================= */}
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2">
            खोज परिणाम ({searchQuery ? filteredResults.length : cropsData.length})
          </h3>

          <div className="space-y-3">
            {filteredResults.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-12 text-center text-slate-500 text-sm">
                ❌ आपकी खोज के अनुसार कोई डेटा नहीं मिला। कृपया सही स्पेलिंग जांचें।
              </div>
            ) : (
              filteredResults.map((crop) => (
                <Link 
                  key={crop.slug} 
                  href={`/crops/${crop.slug}`}
                  className="block group"
                >
                  <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/20 hover:bg-slate-900/60 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-base md:text-lg">
                          {crop.name}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-xs italic text-slate-500 font-mono">{crop.scientificName}</p>
                      <p className="text-xs md:text-sm text-slate-400 line-clamp-1 mt-1">{crop.overview}</p>
                    </div>
                    <div className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all text-xl shrink-0">
                      →
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}