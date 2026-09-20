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
        <section className="relative -mx-3 mb-4 overflow-hidden sm:-mx-4 sm:mb-5 lg:-mx-6">
          <div className="relative min-h-[200px] w-full sm:min-h-[240px] lg:min-h-[280px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jobs/job-crops-hero.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.25),transparent_55%)]" />

            <div className="relative flex h-full min-h-[200px] flex-col justify-end px-4 pb-4 pt-10 sm:min-h-[240px] sm:px-6 sm:pb-5 sm:pt-12 lg:min-h-[280px] lg:px-8 lg:pb-6">
              <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-emerald-300/95 sm:text-[13px] sm:tracking-[0.22em]">
                AGRIVEDA
              </p>
              <h1 className="mt-1 max-w-xl font-display text-[1.65rem] font-bold leading-[1.1] text-white sm:mt-2 sm:text-4xl lg:text-[2.5rem]">
                {isHi ? "अपनी फसल चुनो" : "Pick your crop"}
              </h1>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-2.5">
                <a
                  href="#crop-grid"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[13px] font-bold text-emerald-950 shadow-lg shadow-black/20 transition active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  {isHi ? "फसल देखो" : "Browse crops"}
                  <ChevronRight className="h-4 w-4" />
                </a>
                <AppLink
                  href="/crop-calendar"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/35 bg-white/10 px-3.5 py-2 text-[13px] font-bold text-white backdrop-blur-md transition hover:bg-white/15 active:scale-[0.98] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
