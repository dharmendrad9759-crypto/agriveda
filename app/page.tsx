"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import { Plus, ChevronRight } from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import MotionSection from "@/components/motion/MotionSection";
import MotionPressable from "@/components/motion/MotionPressable";
import FarmDashboard from "@/components/agriveda2/FarmDashboard";
import SprayWindowCard from "@/components/spray-window/SprayWindowCard";
import ServicesHubSheet from "@/components/home/ServicesHubSheet";
import EmptyCropsCard from "@/components/home/EmptyCropsCard";
import FieldHealthHero from "@/components/home/FieldHealthHero";
import PremiumServiceHub from "@/components/home/PremiumServiceHub";
import AiDiagnosticBanner from "@/components/home/AiDiagnosticBanner";
import MandiStrip from "@/components/home/MandiStrip";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { BRAND } from "@/lib/brand";

export default function Home() {
  const { crops, hydrated } = useMyCrops();
  const { profile, hydrated: profileReady } = useFarmerProfile();
  const { t } = useLocale();
  const [servicesOpen, setServicesOpen] = useState(false);

  const greeting = profile.name.trim()
    ? t("homeGreetingNamed").replace("{name}", profile.name.trim())
    : t("homeGreeting");

  const locationLine = useMemo(() => {
    if (!profileReady) return null;
    const parts = [profile.village, profile.district, profile.state].filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }, [profileReady, profile]);

  return (
    <div className="agriveda-page relative">
      <PageBackground />
      <ServicesHubSheet open={servicesOpen} onClose={() => setServicesOpen(false)} />

      <div className="relative mx-auto max-w-lg space-y-5 px-5 pb-8 pt-6">
        <MotionSection>
          <header>
            <p className="text-[10px] font-bold tracking-wide text-emerald-600">
              {BRAND} · {t("smartKisan")}
            </p>
            <h1 className="agriveda-gradient-text mt-1 text-2xl font-black tracking-tight">
              {greeting}
            </h1>
            {locationLine && (
              <p className="mt-0.5 text-xs theme-text-muted">📍 {locationLine}</p>
            )}
          </header>
        </MotionSection>

        <MotionSection delay={1}>
          <SprayWindowCard compact />
        </MotionSection>

        <MotionSection delay={2}>
          <SectionHeading title={t("myCrops")} subtitle={t("tapCropGuideSubtitle")} />
          {hydrated && crops.length === 0 ? (
            <EmptyCropsCard />
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {hydrated &&
                crops.map((crop) => (
                  <AppLink
                    key={crop.slug}
                    href={`/crop-details/${crop.slug}`}
                    className="group flex flex-shrink-0 flex-col items-center gap-2"
                  >
                    <GlassCard
                      hover
                      neon
                      className="flex h-[80px] w-[80px] items-center justify-center text-3xl transition-transform group-active:scale-95"
                    >
                      {crop.emoji}
                    </GlassCard>
                    <span className="max-w-[80px] text-center text-[10px] font-bold leading-tight theme-text-accent">
                      {crop.name}
                    </span>
                  </AppLink>
                ))}
              <AppLink href="/select-crops" className="group flex flex-shrink-0 flex-col items-center gap-2">
                <div className="flex h-[80px] w-[80px] items-center justify-center rounded-2xl border-2 border-dashed border-emerald-500/35 bg-[var(--accent-soft)] transition-all group-active:scale-95">
                  <Plus className="h-6 w-6 text-emerald-600" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold theme-text-muted">{t("addCrop")}</span>
              </AppLink>
            </div>
          )}
        </MotionSection>

        <MotionSection delay={3}>
          <FieldHealthHero />
        </MotionSection>

        <MotionSection delay={4}>
          <AiDiagnosticBanner />
        </MotionSection>

        <MotionSection delay={5}>
          <PremiumServiceHub onAllServices={() => setServicesOpen(true)} />
        </MotionSection>

        <MotionSection delay={6}>
          <FarmDashboard compact />
        </MotionSection>

        <MotionSection delay={7}>
          <MandiStrip />
        </MotionSection>

        <MotionSection delay={8}>
          <GlassCard neon className="overflow-hidden p-5">
            <h3 className="text-base font-extrabold theme-text-primary">{t("expertHelpTitle")}</h3>
            <p className="mt-1 text-sm theme-text-muted">{t("expertHelpDesc")}</p>
            <MotionPressable as="span" className="mt-4 block w-full">
              <AppLink
                href="/ask-query"
                className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white shadow-[0_8px_24px_rgba(0,100,50,0.25)]"
              >
                {t("askQuestion")}
                <ChevronRight className="h-4 w-4" />
              </AppLink>
            </MotionPressable>
          </GlassCard>
        </MotionSection>
      </div>
    </div>
  );
}
