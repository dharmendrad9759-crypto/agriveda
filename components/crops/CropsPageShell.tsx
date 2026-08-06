"use client";

import { Calendar, ChevronRight } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function CropsPageShell({ children }: { children: React.ReactNode }) {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";

  return (
    <AppShell
      className="!bg-transparent"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("navCrops") }]}
      hero={
        <section className="relative -mx-3 mb-5 overflow-hidden sm:-mx-4 lg:-mx-6">
          <div className="relative min-h-[min(52vh,420px)] w-full sm:min-h-[380px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jobs/job-crops-hero.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.25),transparent_55%)]" />

            <div className="relative flex h-full min-h-[min(52vh,420px)] flex-col justify-end px-4 pb-6 pt-16 sm:min-h-[380px] sm:px-6 sm:pb-8 lg:px-8">
              <p className="font-display text-[13px] font-semibold tracking-[0.22em] text-emerald-300/95">
                AGRIVEDA
              </p>
              <h1 className="mt-2 max-w-xl font-display text-[2.15rem] font-bold leading-[1.05] text-white sm:text-5xl">
                {isHi ? "अपनी फसल चुनो" : "Pick your crop"}
              </h1>
              <p className="mt-2 max-w-md text-[14px] leading-snug text-white/85 sm:text-[15px]">
                {isHi
                  ? "टैप करो — किस्म, खाद, कीट-रोग गाइड तुरंत खुलेगी।"
                  : "Tap a crop — varieties, fertilizer & pest guide open instantly."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <a
                  href="#crop-grid"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-950 shadow-lg shadow-black/20 transition active:scale-[0.98]"
                >
                  {isHi ? "फसल देखो" : "Browse crops"}
                  <ChevronRight className="h-4 w-4" />
                </a>
                <AppLink
                  href="/crop-calendar"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15 active:scale-[0.98]"
                >
                  <Calendar className="h-4 w-4" />
                  {isHi ? "फसल कैलेंडर" : "Crop calendar"}
                </AppLink>
              </div>
            </div>
          </div>
        </section>
      }
    >
      {children}
    </AppShell>
  );
}
