"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  MapPin,
  Phone,
  Trash2,
  RotateCcw,
  Info,
  Languages,
  Sprout,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useToast } from "@/components/ui/Toast";
import { APP_NAME, APP_VERSION } from "@/lib/appMeta";
import { resetAppAndReload } from "@/lib/appReset";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "किसान".slice(0, 1);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function ProfilePage() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history, clearHistory } = useAIHistory();
  const { queries, clearQueries } = useQueryHistory();
  const { showToast } = useToast();
  const { locale } = useLocale();
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
      title={isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}
      subtitle={isHi ? "आपकी बुनियादी जानकारी" : "Your basic information"}
    >
      <DarkCard className="!p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-500/10 via-[var(--av-surface)] to-amber-500/5 px-4 py-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold tracking-wide text-white shadow-md"
              aria-hidden
            >
              {initials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-lg font-bold text-[var(--av-text-primary)]">{displayName}</p>
                <AppLink
                  href="/profile/edit"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                >
                  <Pencil className="h-3 w-3" />
                  {isHi ? "एडिट" : "Edit"}
                </AppLink>
              </div>

              <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-[var(--av-text-secondary)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span className="min-w-0 break-words">
                  {placeLine || (isHi ? "जगह अभी सेट नहीं" : "Location not set yet")}
                </span>
              </p>

              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[var(--av-text-secondary)]">
                <Phone className="h-3.5 w-3.5 shrink-0 text-sky-600" />
                <span>{phoneDisplay}</span>
              </p>

              <p
                className={cn(
                  "mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                  locationReady
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-800 dark:text-amber-200"
                )}
              >
                {locationReady ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    {isHi ? "लोकेशन तैयार" : "Location ready"}
                  </>
                ) : isHi ? (
                  "एडिट से जगह जोड़ें"
                ) : (
                  "Add location via Edit"
                )}
              </p>
            </div>
          </div>
        </div>
      </DarkCard>

      <AppLink
        href="/select-crops"
        className="av-card av-card-hover mt-4 flex items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--av-text-primary)]">
          <Sprout className="h-4 w-4 text-[var(--av-accent)]" />
          {isHi ? `मेरी फसलें (${crops.length})` : `Manage my crops (${crops.length})`}
        </span>
        <span className="text-[var(--av-accent)]">→</span>
      </AppLink>

      <DarkCard className="mt-4 space-y-4" delay={1}>
        <h2 className={AV.sectionTitle}>{isHi ? "सेटिंग्स" : "Settings"}</h2>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--av-text-secondary)]">
            <Languages className="h-4 w-4" /> {isHi ? "भाषा" : "Language"}
          </span>
          <AppLink href="/settings" className="text-xs font-bold text-[var(--av-accent)]">
            {isHi ? "सेटिंग्स में बदलें →" : "Change in Settings →"}
          </AppLink>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--av-text-secondary)]">{isHi ? "थीम" : "Theme"}</span>
          <ThemeToggle />
        </div>
        <AppLink href="/settings" className={`inline-flex ${AV.btnSecondarySm}`}>
          {isHi ? "सभी सेटिंग्स →" : "All settings →"}
        </AppLink>
        <AppLink href="/report-bug" className={`inline-flex ${AV.btnSecondarySm}`}>
          {isHi ? "समस्या बताएँ →" : "Report a problem →"}
        </AppLink>
        {(history.length > 0 || queries.length > 0) && (
          <button
            type="button"
            onClick={handleClearHistory}
            className={`flex w-full items-center justify-center gap-2 ${AV.btnSecondarySm} border-red-500/30 text-red-500`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isHi ? "AI / Query इतिहास साफ़ करें" : "Clear AI / query history"}
          </button>
        )}
        <button
          type="button"
          onClick={handleResetApp}
          className={`flex w-full items-center justify-center gap-2 ${AV.btnSecondarySm} border-red-500/30 text-red-500`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {isHi ? "App reset / दोबारा पंजीकरण" : "Reset app / re-register"}
        </button>
      </DarkCard>

      <p className={`mt-4 flex items-center justify-center gap-1.5 pb-4 text-center ${AV.micro}`}>
        <Info className="h-3.5 w-3.5" />
        {APP_NAME} v{APP_VERSION} · Made for Indian farmers
      </p>
    </AppShell>
  );
}
