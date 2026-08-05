"use client";

import { Calendar, Leaf } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function CropsPageShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title={
        <span className="inline-flex items-center gap-2">
          <Leaf className="h-6 w-6 text-[var(--av-accent)]" />
          {t("navCrops")}
        </span>
      }
      subtitle={t("shellCropsExplore")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("navCrops") }]}
      actions={
        <AppLink
          href="/crop-calendar"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-accent)] bg-[var(--av-surface)] px-4 py-2 text-xs font-bold text-[var(--av-accent)] shadow-sm transition hover:bg-[var(--av-accent-soft)]"
        >
          <Calendar className="h-4 w-4" />
          {t("shellViewCropCalendar")}
        </AppLink>
      }
    >
      <div className="relative mb-4 overflow-hidden rounded-[22px] border border-emerald-500/15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/jobs/job-crops-hero.jpg"
          alt=""
          className="h-36 w-full object-cover sm:h-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[17px] font-bold text-white">अपनी फसल चुनो</p>
          <p className="text-[12px] text-white/85">{t("shellCropsExplore")}</p>
        </div>
      </div>
      {children}
    </AppShell>
  );
}
