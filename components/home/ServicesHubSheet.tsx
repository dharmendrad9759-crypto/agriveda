"use client";

import Link from "next/link";
import {
  X,
  Bug,
  Radar,
  Sparkles,
  Sprout,
  Droplets,
  CloudSun,
  Waves,
  Calculator,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export interface ServiceItem {
  title: string;
  href: string;
  icon: LucideIcon;
  glow: string;
}

export interface ServiceCategory {
  id: string;
  titleHi: string;
  titleEn: string;
  items: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "protection",
    titleHi: "फसल सुरक्षा",
    titleEn: "Crop Protection",
    items: [
      {
        title: "Pest & Disease",
        href: "/pest-diseases",
        icon: Bug,
        glow: "shadow-[0_0_18px_rgba(239,68,68,0.35)] border-red-400/30",
      },
      {
        title: "Outbreak Radar",
        href: "/pest-outbreak-radar",
        icon: Radar,
        glow: "shadow-[0_0_18px_rgba(244,63,94,0.35)] border-rose-400/30",
      },
      {
        title: "AI Doctor",
        href: "/ai-doctor",
        icon: Sparkles,
        glow: "shadow-[0_0_18px_rgba(0,255,136,0.35)] border-emerald-400/30",
      },
    ],
  },
  {
    id: "field",
    titleHi: "खेत प्रबंधन",
    titleEn: "Field Management",
    items: [
      {
        title: "Seed & Crops",
        href: "/crops",
        icon: Sprout,
        glow: "shadow-[0_0_18px_rgba(52,211,153,0.35)] border-emerald-400/30",
      },
      {
        title: "Spray Log",
        href: "/spray-rotation",
        icon: Droplets,
        glow: "shadow-[0_0_18px_rgba(56,189,248,0.35)] border-sky-400/30",
      },
      {
        title: "Weather",
        href: "/weather",
        icon: CloudSun,
        glow: "shadow-[0_0_18px_rgba(250,204,21,0.3)] border-amber-400/30",
      },
    ],
  },
  {
    id: "nutrition",
    titleHi: "सिंचाई और पोषण",
    titleEn: "Irrigation & Nutrition",
    items: [
      {
        title: "Irrigation Guide",
        href: "/services/irrigation",
        icon: Waves,
        glow: "shadow-[0_0_18px_rgba(34,211,238,0.35)] border-cyan-400/30",
      },
      {
        title: "Fertilizer Calc",
        href: "/services/fertilizer-calculator",
        icon: Calculator,
        glow: "shadow-[0_0_18px_rgba(167,139,250,0.35)] border-violet-400/30",
      },
      {
        title: "Deficiencies",
        href: "/deficiencies",
        icon: FlaskConical,
        glow: "shadow-[0_0_18px_rgba(251,191,36,0.35)] border-amber-400/30",
      },
    ],
  },
];

interface ServicesHubSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function ServicesHubSheet({ open, onClose }: ServicesHubSheetProps) {
  if (!open) return null;

  return (
    <div
      className="agriveda-force-dark fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
      data-theme="dark"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close services"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-label="All services"
        className="animate-sheet-up relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-emerald-500/25 bg-[#030712] shadow-[0_-12px_48px_rgba(0,255,136,0.15)] sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Services Hub
            </p>
            <h2 className="text-lg font-extrabold text-white">Explore all services</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 pb-10">
          {SERVICE_CATEGORIES.map((category) => (
            <section key={category.id} className="mb-7 last:mb-0">
              <div className="mb-3">
                <h3 className="text-sm font-extrabold text-emerald-300">{category.titleHi}</h3>
                <p className="text-[11px] font-medium text-slate-400">{category.titleEn}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div
                        className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border bg-[#0f172a] text-emerald-300 backdrop-blur-xl transition-transform group-hover:scale-110 group-active:scale-95 ${item.glow}`}
                      >
                        <Icon className="h-7 w-7" strokeWidth={1.75} />
                      </div>
                      <span className="max-w-[5.5rem] text-center text-[11px] font-bold leading-tight text-slate-100">
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
