"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sprout, 
  CloudSun, 
  Search, 
  Cpu, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Wind, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers 
} from "lucide-react";

// Enriched Crop Registry mapping slugs and descriptive labels for fluid search
const masterCrops = [
  { id: "paddy", name: "Paddy / Rice (धान)", type: "Cereal" },
  { id: "wheat", name: "Wheat (गेहूं)", type: "Cereal" },
  { id: "maize", name: "Maize (मक्का)", type: "Cereal" },
  { id: "bajra", name: "Bajra (बाजरा)", type: "Cereal" },
  { id: "soybean", name: "Soybean (सोयाबीन)", type: "Oilseed" },
  { id: "cotton", name: "Cotton (कपास)", type: "Cash Crop" },
  { id: "sugarcane", name: "Sugarcane (गन्ना)", type: "Cash Crop" },
  { id: "potato", name: "Potato (आलू)", type: "Vegetable" },
  { id: "tomato", name: "Tomato (टमाटर)", type: "Vegetable" },
  { id: "chilli", name: "Chilli (मिर्च)", type: "Vegetable" },
  { id: "mustard", name: "Mustard (सरसों)", type: "Oilseed" },
  { id: "groundnut", name: "Groundnut (मूंगफली)", type: "Oilseed" },
  { id: "onion", name: "Onion (प्याज)", type: "Vegetable" },
  { id: "garlic", name: "Garlic (लहसुन)", type: "Spice" },
  { id: "pulses", name: "Pulses (दलहन)", type: "Pulse" },
  { id: "vegetables", name: "Other Vegetables (अन्य सब्जियां)", type: "Vegetable" },
];

const cropEmojis: Record<string, string> = {
  paddy: "🌾",
  wheat: "🍞",
  maize: "🌽",
  bajra: "🌿",
  soybean: "🫘",
  cotton: "🌸",
  sugarcane: "🎋",
  potato: "🥔",
  tomato: "🍅",
  chilli: "🌶️",
  mustard: "🌼",
  groundnut: "🥜",
  onion: "🧅",
  garlic: "🧄",
  pulses: "🫛",
  vegetables: "🥕",
};

const modules = [
  {
    title: "Crops",
    desc: "Detailed crop profiles with soil, climate, irrigation, pests, diseases, weeds, fertilizers, yield and market information.",
    icon: Sprout,
    color: "text-emerald-400",
    href: "/crops",
  },
  {
    title: "Weather",
    desc: "Live weather, humidity, rainfall indicators, wind tracking, alerts, along with hourly & weekly prediction models.",
    icon: CloudSun,
    color: "text-sky-400",
    href: "/weather",
  },
  {
    title: "Deficiencies",
    desc: "Scientific nutrient deficiency insights, symptoms, causes, and corrective recommendations for field crops.",
    icon: Search,
    color: "text-amber-400",
    href: "/deficiencies",
  },
  {
    title: "AI Doctor",
    desc: "Computer-vision framework to upload damaged leaf/foliage images and generate localized disease diagnoses.",
    icon: Cpu,
    color: "text-purple-400",
    href: "/ai-doctor",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering crop indices based on natural query string matches
  const filteredCrops = masterCrops.filter((crop) =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white selection:bg-emerald-500/30">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12">

          {/* 1. Hero Block with Neon Glow Border accents */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 md:p-12 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)]">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-emerald-400 font-bold tracking-[0.35em] text-xs uppercase sm:text-sm">
              AGRIVEDA CORE ENGINE
            </p>

            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              AGRIVEDA HUB
            </h1>

            <p className="mt-6 max-w-3xl text-base sm:text-lg text-slate-300 font-medium leading-relaxed opacity-90">
              Complete decentralized agriculture knowledge platform built meticulously for Farmers, 
              Agriculture Students, Field Agronomists, and Agri Professionals worldwide.
            </p>

          </div>

          {/* 2. Interactive Systems Hub (Modules Grid) */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className={`p-3 rounded-2xl bg-white/5 w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    <h2 className="mt-5 text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    Open <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 3. Searchable Live Crop Inventory Matrix */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <Layers className="w-6 h-6 text-emerald-400" /> Major Crops
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Select an indexed botanical profile to view split parameters.</p>
              </div>

              {/* Functional Search input bar inside the module */}
              <div className="relative flex items-center w-full md:max-w-md bg-black/40 border border-white/10 focus-within:border-emerald-500/50 rounded-2xl px-4 py-2.5 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Filter by name (e.g. Tomato, Wheat)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-sm font-medium text-white placeholder-slate-500"
                />
              </div>
            </div>

            {filteredCrops.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="group rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-center font-bold text-slate-200 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm hover:scale-[1.03]"
                  >
                    <span className="text-emerald-400 text-sm group-hover:scale-110 transition-transform">
                      {cropEmojis[crop.id] ?? "🌱"}
                    </span>
                    <span className="text-sm md:text-base tracking-wide">{crop.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-semibold text-sm border border-dashed border-white/10 rounded-2xl">
                No agronomic index matching "{searchQuery}" located.
              </div>
            )}
          </div>

          {/* 4. Secondary Services Layer: Live Weather Diagnostics & Feature Logs */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Live Weather Box with Crisp UI Grid Cards */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                  <CloudSun className="w-6 h-6 text-sky-400" /> Real-time Weather Feeds
                </h2>
                <p className="text-xs text-slate-400 mt-1">Synced atmospheric metrics via localized hyper-nodes.</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-black/30 border border-white/5 p-4 hover:bg-black/50 transition">
                  <Thermometer className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Ambient Temp</p>
                    <p className="text-base font-bold text-slate-100">32°C</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-black/30 border border-white/5 p-4 hover:bg-black/50 transition">
                  <Droplets className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Relative Humidity</p>
                    <p className="text-base font-bold text-slate-100">68%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-black/30 border border-white/5 p-4 hover:bg-black/50 transition">
                  <CloudRain className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Precipitation Prob</p>
                    <p className="text-base font-bold text-slate-100">20%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-black/30 border border-white/5 p-4 hover:bg-black/50 transition">
                  <Wind className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Wind Velocity</p>
                    <p className="text-base font-bold text-slate-100">12 km/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Feature Logs Box */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  System Architecture Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-1">Pending integrations mapped out for development cycles.</p>
              </div>

              <ul className="mt-6 space-y-3.5">
                {[
                  "Dynamic Crop Detail Canvas Routing",
                  "Deep-Learning Image Disease Identification Node",
                  "Chemical Classification & Pest Management Matrices",
                  "Acreage Fertilizer Dose Breakdown Calculator",
                  "Mandi Pricing Infrastructure API Links",
                  "AI Doctor Core Context Stream Initialization"
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm font-medium text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

        </section>
      </main>
    </>
  );
}