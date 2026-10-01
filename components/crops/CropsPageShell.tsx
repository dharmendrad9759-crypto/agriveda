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
        <section className="relative -mx-3 mb-2 overflow-hidden sm:-mx-4 sm:mb-3 lg:-mx-6">
          <div className="relative min-h-[72px] w-full sm:min-h-[80px] lg:min-h-[88px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jobs/job-crops-hero.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

            <div className="relative flex h-full min-h-[72px] items-center justify-between gap-2 px-3 py-2 sm:min-h-[80px] sm:px-5 sm:py-2.5 lg:min-h-[88px] lg:px-6">
              <div className="min-w-0">
                <p className="font-display text-[10px] font-semibold tracking-[0.14em] text-emerald-300/95">
                  AGRIVEDA
                </p>
                <h1 className="max-w-xl font-display text-lg font-bold leading-tight text-white sm:text-xl">
                  {isHi ? "अपनी फसल चुनो" : "Pick your crop"}
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href="#crop-grid"
                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[12px] font-bold text-emerald-950 sm:px-3 sm:text-[13px]"
                >
                  {isHi ? "फसल देखो" : "Browse crops"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
                <AppLink
                  href="/crop-calendar"
                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-white/40 bg-white/10 px-2.5 py-1.5 text-[12px] font-bold text-white sm:px-3 sm:text-[13px]"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {isHi ? "कैलेंडर" : "Calendar"}
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
