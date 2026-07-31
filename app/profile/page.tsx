"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ChevronRight,
  Languages,
  MapPin,
  MessageCircle,
  Palette,
  Pencil,
  Phone,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useToast } from "@/components/ui/Toast";
import { APP_NAME, APP_VERSION } from "@/lib/appMeta";
import { resetAppAndReload } from "@/lib/appReset";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropEmoji, getCropHindiName } from "@/lib/crops/crop-display";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { cn } from "@/lib/cn";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "क";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function fadeUp(i: number, reduced: boolean | null) {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: MOTION.slow, ease: EASE_OUT, delay: 0.04 * i },
  };
}

export default function ProfilePage() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history, clearHistory } = useAIHistory();
  const { queries, clearQueries } = useQueryHistory();
  const { showToast } = useToast();
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const isHi = locale === "hi";

  const placeLine = [profile.village, profile.district, profile.state]
    .filter(Boolean)
    .join(" · ");
  const locationReady = Boolean(profile.district && profile.state);
  const displayName = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");
  const phoneDisplay = profile.phone
    ? `+91 ${profile.phone}`
    : isHi
      ? "मोबाइल नहीं जोड़ा"
      : "No mobile added";
  const farmAcres = profile.totalFarmAreaAcres;
  const hasHistory = history.length > 0 || queries.length > 0;

  const handleClearHistory = () => {
    if (!window.confirm(isHi ? "AI scan history और queries हटा दें?" : "Clear AI / query history?"))
      return;
    clearHistory();
    clearQueries();
    showToast(isHi ? "इतिहास साफ़ हो गया ✓" : "History cleared ✓");
  };

  const handleResetApp = () => {
    if (
      !window.confirm(
        isHi
          ? "सारा डेटा मिट जाएगा (फसल, profile, spray log) और दोबारा registration होगा। जारी रखें?"
          : "All data will be wiped and you will register again. Continue?"
      )
    ) {
      return;
    }
    resetAppAndReload();
  };

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}
      subtitle={isHi ? "आपकी खेती की पहचान" : "Your farm identity"}
    >
      <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-6">
        {/* Atmosphere — matches home emerald wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-24px] -top-6 h-[420px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(16,185,129,0.2),transparent_55%),radial-gradient(ellipse_at_95%_8%,rgba(5,150,105,0.1),transparent_42%),linear-gradient(180deg,#e8f6ee_0%,transparent_72%)] dark:bg-[radial-gradient(ellipse_at_15%_0%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(ellipse_at_95%_8%,rgba(5,150,105,0.08),transparent_42%),linear-gradient(180deg,rgba(16,185,129,0.08)_0%,transparent_72%)]" />
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 space-y-3.5">
          {/* Identity hero */}
          <motion.section
            {...fadeUp(0, reduced)}
            className="overflow-hidden rounded-[22px] border border-emerald-500/25 bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]"
          >
            <div className="relative px-4 pb-4 pt-5 sm:px-5">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-teal-500/10 blur-3xl"
              />

              <div className="relative flex items-start gap-3.5">
                <motion.div
                  animate={reduced ? undefined : { y: [0, -3, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative shrink-0"
                >
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-gradient-to-br from-emerald-600 to-emerald-800 text-[1.35rem] font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(5,150,105,0.35)] ring-2 ring-emerald-400/30 ring-offset-2 ring-offset-[var(--av-surface)]">
                    {initials(displayName)}
                  </div>
                  {profile.phoneVerified ? (
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--av-surface)] bg-emerald-600 text-white shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  ) : null}
                </motion.div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700/80 dark:text-emerald-300/80">
                        Agriveda
                      </p>
                      <h2 className="mt-0.5 truncate font-display text-[1.35rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)] sm:text-[1.5rem]">
                        {displayName}
                      </h2>
                    </div>
                    <AppLink
                      href="/profile/edit"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 transition active:scale-[0.98] dark:text-emerald-200"
                    >
                      <Pencil className="h-3 w-3" />
                      {isHi ? "एडिट" : "Edit"}
                    </AppLink>
                  </div>

                  <p className="mt-2.5 flex items-start gap-1.5 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span className="min-w-0 break-words">
                      {placeLine || (isHi ? "जगह अभी सेट नहीं" : "Location not set yet")}
                    </span>
                  </p>

                  <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[var(--av-text-secondary)]">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-sky-600" />
                    <span>{phoneDisplay}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                        locationReady
                          ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-800 dark:text-emerald-200"
                          : "border-amber-500/30 bg-amber-500/12 text-amber-900 dark:text-amber-100"
                      )}
                    >
                      {locationReady ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          {isHi ? "लोकेशन तैयार" : "Location ready"}
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3" />
                          {isHi ? "जगह जोड़ें" : "Add location"}
                        </>
                      )}
                    </span>
                    {farmAcres != null && farmAcres > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--av-text-secondary)]">
                        {isHi ? `${farmAcres} एकड़ खेत` : `${farmAcres} acre farm`}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Snapshot stats */}
          <motion.div {...fadeUp(1, reduced)} className="grid grid-cols-3 gap-2">
            {[
              {
                label: isHi ? "फसलें" : "Crops",
                value: String(crops.length),
                icon: Sprout,
                href: "/select-crops",
              },
              {
                label: isHi ? "AI स्कैन" : "AI scans",
                value: String(history.length),
                icon: Stethoscope,
                href: "/ai-doctor",
              },
              {
                label: isHi ? "सवाल" : "Queries",
                value: String(queries.length),
                icon: MessageCircle,
                href: "/ask-query",
              },
            ].map((stat) => (
              <AppLink
                key={stat.label}
                href={stat.href}
                className="group rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)]/95 p-3 text-center shadow-[var(--av-shadow-sm)] transition hover:border-emerald-500/35 active:scale-[0.98]"
              >
                <stat.icon className="mx-auto h-4 w-4 text-emerald-600 opacity-80" strokeWidth={2.25} />
                <p className="mt-1.5 font-display text-xl font-bold tabular-nums text-[var(--av-text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">{stat.label}</p>
              </AppLink>
            ))}
          </motion.div>

          {/* My crops */}
          <motion.section
            {...fadeUp(2, reduced)}
            className="overflow-hidden rounded-[20px] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border-subtle)] px-4 py-3">
              <div>
                <h3 className="text-[15px] font-bold text-[var(--av-text-primary)]">
                  {isHi ? "मेरी फसलें" : "My crops"}
                </h3>
                <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                  {isHi ? "खेत में चल रही फसलें" : "Crops on your farm"}
                </p>
              </div>
              <AppLink
                href="/select-crops"
                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
              >
                {isHi ? "मैनेज" : "Manage"}
                <ChevronRight className="h-3.5 w-3.5" />
              </AppLink>
            </div>

            {crops.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto px-4 py-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              <div className="px-4 py-5 text-center">
                <p className="text-sm text-[var(--av-text-muted)]">
                  {isHi ? "अभी कोई फसल नहीं चुनी" : "No crops selected yet"}
                </p>
                <AppLink
                  href="/select-crops"
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white"
                >
                  {isHi ? "फसलें जोड़ें" : "Add crops"}
                </AppLink>
              </div>
            )}
          </motion.section>

          {/* Shortcuts */}
          <motion.section
            {...fadeUp(3, reduced)}
            className="overflow-hidden rounded-[20px] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
          >
            <div className="border-b border-[var(--av-border-subtle)] px-4 py-3">
              <h3 className="text-[15px] font-bold text-[var(--av-text-primary)]">
                {isHi ? "त्वरित सेटिंग्स" : "Quick settings"}
              </h3>
            </div>

            <div className="divide-y divide-[var(--av-border-subtle)]">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--av-text-primary)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <Languages className="h-4 w-4" />
                  </span>
                  {isHi ? "भाषा" : "Language"}
                </span>
                <AppLink
                  href="/settings"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                >
                  {locale === "hi" ? "हिंदी" : "English"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </AppLink>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--av-text-primary)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <Palette className="h-4 w-4" />
                  </span>
                  {isHi ? "थीम" : "Theme"}
                </span>
                <ThemeToggle />
              </div>

              <AppLink
                href="/my-queries"
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[var(--av-surface-inset)]/60"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--av-text-primary)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  {isHi ? "मेरे सवाल / जवाब" : "My queries / replies"}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--av-text-muted)]" />
              </AppLink>

              <AppLink
                href="/settings"
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[var(--av-surface-inset)]/60"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--av-text-primary)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <Settings2 className="h-4 w-4" />
                  </span>
                  {isHi ? "सभी सेटिंग्स" : "All settings"}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--av-text-muted)]" />
              </AppLink>

              <AppLink
                href="/report-bug"
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[var(--av-surface-inset)]/60"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--av-text-primary)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <Bug className="h-4 w-4" />
                  </span>
                  {isHi ? "समस्या बताएँ" : "Report a problem"}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--av-text-muted)]" />
              </AppLink>
            </div>
          </motion.section>

          {/* Data / danger — quieter */}
          <motion.section
            {...fadeUp(4, reduced)}
            className="overflow-hidden rounded-[20px] border border-[var(--av-border)] bg-[var(--av-surface)]/90"
          >
            <div className="border-b border-[var(--av-border-subtle)] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[var(--av-text-secondary)]">
                {isHi ? "डेटा व खाता" : "Data & account"}
              </h3>
            </div>
            <div className="space-y-2 p-3">
              {hasHistory ? (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs font-bold text-red-600 transition active:scale-[0.99] dark:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isHi ? "AI / Query इतिहास साफ़ करें" : "Clear AI / query history"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleResetApp}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-transparent px-3 py-2.5 text-xs font-bold text-red-600/90 transition active:scale-[0.99] dark:text-red-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {isHi ? "App reset / दोबारा पंजीकरण" : "Reset app / re-register"}
              </button>
            </div>
          </motion.section>

          <p className="flex items-center justify-center gap-1.5 pb-2 pt-1 text-center text-[10px] font-medium text-[var(--av-text-muted)]">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            {APP_NAME} v{APP_VERSION} · {isHi ? "भारतीय किसानों के लिए" : "Made for Indian farmers"}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
