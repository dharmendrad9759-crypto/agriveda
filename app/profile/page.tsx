"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  Bug,
  ChevronRight,
  Languages,
  MapPin,
  MessageCircle,
  Palette,
  Pencil,
  Phone,
  Settings2,
  ShieldCheck,
  Sprout,
  Stethoscope,
} from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { APP_NAME, APP_VERSION } from "@/lib/appMeta";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropEmoji, getCropHindiName } from "@/lib/crops/crop-display";
import type { ReactNode } from "react";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "क";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div className="px-0.5">
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700/70 dark:text-emerald-300/70">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">{title}</h2>
      </div>
      <div className="overflow-hidden rounded-[1.35rem] border border-emerald-900/8 bg-[var(--av-surface)] shadow-[0_10px_28px_-18px_rgba(11,61,40,0.35)] dark:border-white/8">
        {children}
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history } = useAIHistory();
  const { queries } = useQueryHistory();
  const { locale } = useLocale();
  const isHi = locale === "hi";

  const placeLine = [profile.village, profile.district, profile.state]
    .filter(Boolean)
    .join(" · ");
  const displayName = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");
  const shortInitials = initials(displayName);
  const phoneDisplay = profile.phone
    ? `+91 ${profile.phone}`
    : isHi
      ? "मोबाइल नहीं जोड़ा"
      : "No mobile added";
  const farmAcres = profile.totalFarmAreaAcres;

  const stats = [
    { k: isHi ? "फसलें" : "Crops", v: String(crops.length) },
    { k: isHi ? "फसल जाँच" : "Leaf checks", v: String(history.length) },
    { k: isHi ? "सवाल" : "Queries", v: String(queries.length) },
  ];

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}
    >
      <div className="mx-auto max-w-lg space-y-5">
        {/* Identity hero — same language as Settings account card */}
        <section className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-emerald-950 text-white shadow-[0_18px_40px_-20px_rgba(6,78,59,0.7)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-amber-300/15 blur-3xl"
          />
          <div className="relative p-4 pb-3.5">
            <div className="flex items-start gap-3.5">
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 text-[1.35rem] font-black tracking-wide text-emerald-950 shadow-lg shadow-emerald-950/30 ring-2 ring-white/25">
                {shortInitials}
                {profile.phoneVerified ? (
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-950 bg-emerald-400 text-emerald-950">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                ) : null}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/80">
                  Agriveda
                </p>
                <h2 className="mt-0.5 truncate font-display text-[1.35rem] font-bold leading-tight">
                  {displayName}
                </h2>
                <p className="mt-1 flex items-start gap-1 truncate text-[12px] font-medium text-emerald-100/80">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {placeLine || (isHi ? "जगह अभी नहीं डाली" : "Location not set yet")}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-emerald-100/80">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {phoneDisplay}
                  {farmAcres != null && farmAcres > 0
                    ? ` · ${farmAcres} ${isHi ? "एकड़" : "acre"}`
                    : ""}
                </p>
              </div>
              <AppLink
                href="/profile/edit"
                className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white transition active:scale-[0.98]"
              >
                <Pencil className="h-3 w-3" />
                {isHi ? "बदलें" : "Edit"}
              </AppLink>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl bg-white/8 px-2 py-2 text-center ring-1 ring-white/10"
                >
                  <p className="text-[15px] font-extrabold leading-none">{s.v}</p>
                  <p className="mt-1 text-[10px] font-semibold text-emerald-100/70">{s.k}</p>
                </div>
              ))}
            </div>

            <AppLink
              href="/profile/edit"
              className="mt-3.5 flex min-h-11 items-center justify-center rounded-2xl bg-white text-[13px] font-extrabold text-emerald-950 active:scale-[0.99]"
            >
              {isHi ? "प्रोफ़ाइल बदलें" : "Edit profile"}
            </AppLink>
          </div>
        </section>

        {/* My crops */}
        <Section
          eyebrow={isHi ? "खेत" : "Farm"}
          title={isHi ? "मेरी फसलें" : "My crops"}
        >
          <div className="flex items-center justify-between gap-2 border-b border-emerald-900/6 px-3.5 py-2.5 dark:border-white/6">
            <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
              {isHi ? "खेत में चल रही फसलें" : "Crops on your farm"}
            </p>
            <AppLink
              href="/select-crops"
              className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
            >
              {isHi ? "बदलें" : "Change"}
              <ChevronRight className="h-3.5 w-3.5" />
            </AppLink>
          </div>
          {crops.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto px-3.5 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {crops.map((c) => {
                const label = isHi ? getCropHindiName(c.slug, c.name) ?? c.name : c.name;
                return (
                  <AppLink
                    key={c.slug}
                    href={`/crops/${c.slug}`}
                    className="flex min-w-[88px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-emerald-500/15 bg-[var(--av-surface-inset)] px-3 py-3 transition hover:border-emerald-500/35"
                  >
                    <span className="text-2xl leading-none" aria-hidden>
                      {c.emoji || getCropEmoji(c.slug)}
                    </span>
                    <span className="max-w-[72px] truncate text-center text-[11px] font-bold text-[var(--av-text-primary)]">
                      {label}
                    </span>
                  </AppLink>
                );
              })}
            </div>
          ) : (
            <div className="px-3.5 py-5 text-center">
              <p className="flex items-center justify-center gap-1.5 text-sm text-[var(--av-text-muted)]">
                <Sprout className="h-4 w-4 text-emerald-600" />
                {isHi ? "अभी कोई फसल नहीं चुनी" : "No crops selected yet"}
              </p>
              <AppLink
                href="/select-crops"
                className="mt-3 inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-700 px-4 text-xs font-bold text-white"
              >
                {isHi ? "फसलें जोड़ें" : "Add crops"}
              </AppLink>
            </div>
          )}
        </Section>

        {/* Shortcuts */}
        <Section
          eyebrow={isHi ? "जल्दी" : "Quick"}
          title={isHi ? "जल्दी बदलें" : "Quick settings"}
        >
          <div className="divide-y divide-emerald-900/6 dark:divide-white/6">
            <div className="flex items-center justify-between gap-3 px-3.5 py-3">
              <span className="flex items-center gap-3 text-sm font-bold text-[var(--av-text-primary)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700 dark:text-sky-300">
                  <Languages className="h-4 w-4" />
                </span>
                {isHi ? "भाषा" : "Language"}
              </span>
              <AppLink
                href="/settings#look"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--av-text-muted)]"
              >
                {locale === "hi" ? "हिंदी" : "English"}
                <ChevronRight className="h-4 w-4" />
              </AppLink>
            </div>

            <div className="flex items-center justify-between gap-3 px-3.5 py-3">
              <span className="flex items-center gap-3 text-sm font-bold text-[var(--av-text-primary)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  <Palette className="h-4 w-4" />
                </span>
                {isHi ? "स्क्रीन रंग" : "Theme"}
              </span>
              <ThemeToggle />
            </div>

            {[
              {
                href: "/my-queries",
                icon: MessageCircle,
                tone: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
                label: isHi ? "मेरे सवाल / जवाब" : "My queries / replies",
              },
              {
                href: "/ai-doctor",
                icon: Stethoscope,
                tone: "bg-teal-500/15 text-teal-800 dark:text-teal-300",
                label: isHi ? `फसल जाँच (${history.length})` : `Leaf checks (${history.length})`,
              },
              {
                href: "/settings",
                icon: Settings2,
                tone: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
                label: isHi ? "सभी सेटिंग्स" : "All settings",
              },
              {
                href: "/report-bug",
                icon: Bug,
                tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                label: isHi ? "समस्या बताएँ" : "Report a problem",
              },
            ].map((row) => (
              <AppLink
                key={row.href + row.label}
                href={row.href}
                className="flex items-center justify-between gap-3 px-3.5 py-3 transition active:bg-emerald-500/5"
              >
                <span className="flex items-center gap-3 text-sm font-bold text-[var(--av-text-primary)]">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${row.tone}`}>
                    <row.icon className="h-4 w-4" />
                  </span>
                  {row.label}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--av-text-muted)]" />
              </AppLink>
            ))}
          </div>
        </Section>

        <p className="flex items-center justify-center gap-1.5 pb-2 pt-1 text-center text-[10px] font-medium text-[var(--av-text-muted)]">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          {APP_NAME} v{APP_VERSION} · {isHi ? "भारतीय किसानों के लिए" : "Made for Indian farmers"}
        </p>
      </div>
    </AppShell>
  );
}
