"use client";

import AppShell from "@/components/shell/AppShell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import { useToast } from "@/components/ui/Toast";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { shareAgriveda } from "@/lib/appEssentials";
import { APP_VERSION, SUPPORT_MAILTO } from "@/lib/appMeta";
import { BRAND } from "@/lib/brand";
import { deleteAccountAndReload, logoutAndReload } from "@/lib/appReset";
import { downloadLocalDataExport } from "@/lib/exportFarmerData";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";
import {
  Bell,
  Bug,
  Check,
  ChevronRight,
  CloudSun,
  Download,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  Share2,
  Shield,
  Sprout,
  Sun,
  Trash2,
  TrendingUp,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  clearLocationPermissionCache,
  locationFlowErrorMessage,
  resolveFarmerLocationFromGps,
} from "@/lib/farmerLocation";
import {
  canOpenNativeLocationSettings,
  openAppLocationPermissionSettings,
  openDeviceLocationSettings,
} from "@/lib/openLocationSettings";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        on ? "bg-emerald-600" : "bg-stone-300 dark:bg-stone-600"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
          on ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
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

function Stick({
  icon: Icon,
  tone,
  title,
  hint,
  href,
  toggle,
  value,
  onClick,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
  hint?: string;
  href?: string;
  value?: string;
  toggle?: { on: boolean; onChange: (v: boolean) => void };
  onClick?: () => void;
}) {
  const body = (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold leading-tight text-[var(--av-text-primary)]">
          {title}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[11px] leading-snug text-[var(--av-text-muted)]">
            {hint}
          </span>
        ) : null}
      </span>
      {toggle ? (
        <Toggle on={toggle.on} onChange={toggle.onChange} />
      ) : (
        <span className="flex shrink-0 items-center gap-0.5 text-[12px] font-semibold text-[var(--av-text-muted)]">
          {value}
          {href || onClick ? <ChevronRight className="h-4 w-4" /> : null}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <AppLink
        href={href}
        className="block border-b border-emerald-900/6 last:border-0 active:bg-emerald-500/5 dark:border-white/6"
      >
        {body}
      </AppLink>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full border-b border-emerald-900/6 text-left last:border-0 active:bg-emerald-500/5 dark:border-white/6"
      >
        {body}
      </button>
    );
  }
  return <div className="border-b border-emerald-900/6 last:border-0 dark:border-white/6">{body}</div>;
}

export default function SettingsPage() {
  const { profile, saveProfile } = useFarmerProfile();
  const { data: farm, stats: farmStats } = useFarmData();
  const { theme, setTheme } = useTheme();
  const { settings, update } = useAppSettings();
  const { settings: priceSettings, setMasterEnabled } = usePriceAlerts();
  const { locale, setLocale, t } = useLocale();
  const { showToast } = useToast();
  const [busy, setBusy] = useState<"logout" | "delete" | null>(null);
  const [locBusy, setLocBusy] = useState(false);
  const isHi = locale === "hi";

  const greetName = profile.name.trim()
    ? profile.name.trim().charAt(0).toUpperCase() + profile.name.trim().slice(1)
    : t("settingsAddName");
  const initial = greetName.charAt(0).toUpperCase();
  const place = [profile.village, profile.district, profile.state].filter(Boolean).join(" · ");
  const fieldCount = farm.fields.length;
  const areaLabel =
    farmStats.totalAreaAcres > 0
      ? `${farmStats.totalAreaAcres.toFixed(1)} ${isHi ? "एकड़" : "acre"}`
      : isHi
        ? "रकबा जोड़ें"
        : "Add area";

  const handleDetectLocation = async () => {
    setLocBusy(true);
    try {
      clearLocationPermissionCache();
      const loc = await resolveFarmerLocationFromGps();
      const patch: { state?: string; district?: string } = {};
      if (loc.state) patch.state = loc.state;
      if (loc.district) patch.district = loc.district;
      if (Object.keys(patch).length) saveProfile(patch);
      showToast(
        loc.district || loc.state
          ? `${isHi ? "स्थान सेट" : "Location set"} · ${[loc.district, loc.state].filter(Boolean).join(", ")}`
          : isHi
            ? "स्थान सेव हो गया"
            : "Location saved",
        "success"
      );
    } catch (err) {
      locationFlowErrorMessage(err);
      showToast(
        err instanceof Error
          ? err.message
          : isHi
            ? "स्थान नहीं मिला — फ़ोन से अनुमति दें"
            : "Location not found — allow permission",
        "error"
      );
    } finally {
      setLocBusy(false);
    }
  };

  const handleOpenLocationSettings = async () => {
    if (canOpenNativeLocationSettings()) {
      await openAppLocationPermissionSettings();
    } else {
      await openDeviceLocationSettings();
    }
    showToast(isHi ? "फ़ोन में स्थान अनुमति दें" : "Allow location on the phone", "success");
  };

  const handleLogout = async () => {
    if (
      !window.confirm(
        isHi
          ? "लॉग आउट करें? खेत का डेटा फ़ोन पर रहेगा।"
          : "Log out? Farm data stays on this phone."
      )
    )
      return;
    setBusy("logout");
    try {
      await logoutAndReload();
    } finally {
      setBusy(null);
    }
  };

  const handleExport = () => {
    const result = downloadLocalDataExport();
    if (result.ok) showToast(isHi ? "डेटा फ़ाइल तैयार है" : "Data file ready", "success");
    else showToast(result.error || (isHi ? "डाउनलोड नहीं हुआ" : "Download failed"), "error");
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      isHi
        ? "खाता हमेशा के लिए हटाएँ?\nखेत, फ़ोटो और सवाल मिट जाएँगे। यह वापस नहीं आएगा।"
        : "Delete account forever?\nFields, photos and queries will be removed. This cannot be undone."
    );
    if (!ok) return;
    const again = window.confirm(
      isHi
        ? "पक्का? बाद में गूगल से नया खाता बनाना पड़ेगा।"
        : "Sure? You will need Google login to start again."
    );
    if (!again) return;
    setBusy("delete");
    const result = await deleteAccountAndReload();
    if (!result.ok) {
      setBusy(null);
      showToast(result.error || (isHi ? "हटाने में समस्या" : "Could not delete"), "error");
    }
  };

  const handleShare = async () => {
    const result = await shareAgriveda();
    if (result === "copied") showToast(t("shareCopied"), "success");
    else if (result === true) showToast(t("shareDone"), "success");
  };

  const langs: { code: AppLocale; label: string; mark: string }[] = [
    { code: "hi", label: t("hindi"), mark: "अ" },
    { code: "en", label: t("english"), mark: "A" },
  ];

  return (
    <AppShell className="!bg-transparent" backHref="/" title={t("settingsTitle")}>
      <div className="mx-auto max-w-lg space-y-5">
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
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 text-[1.65rem] font-black text-emerald-950 shadow-lg shadow-emerald-950/30 ring-2 ring-white/25">
                {initial}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/80">
                  {isHi ? "मेरा खाता" : "My account"}
                </p>
                <h2 className="mt-0.5 truncate font-display text-[1.35rem] font-bold leading-tight">
                  {greetName}
                </h2>
                <p className="mt-1 truncate text-[12px] font-medium text-emerald-100/80">
                  {profile.phone ? `+91 ${profile.phone}` : t("settingsAddPhone")}
                  {place ? ` · ${place}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { k: isHi ? "खेत" : "Fields", v: String(fieldCount) },
                { k: isHi ? "रकबा" : "Area", v: areaLabel },
                {
                  k: isHi ? "भाषा" : "Lang",
                  v: locale === "hi" ? "हिंदी" : "EN",
                },
              ].map((s) => (
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
              {t("settingsEditProfile")}
            </AppLink>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              {
                href: "#look",
                icon: Sun,
                title: isHi ? "रंग" : "Theme",
                hint: theme === "dark" ? t("settingsDark") : t("settingsLight"),
                tone: "from-amber-400 to-orange-500",
              },
              {
                href: "#look",
                icon: Languages,
                title: isHi ? "भाषा" : "Language",
                hint: locale === "hi" ? "हिंदी" : "English",
                tone: "from-sky-400 to-blue-600",
              },
              {
                href: "/my-farm",
                icon: Sprout,
                title: isHi ? "मेरे खेत" : "My farm",
                hint: fieldCount ? `${fieldCount}` : isHi ? "जोड़ें" : "Add",
                tone: "from-emerald-400 to-teal-600",
              },
              {
                href: "/ask-query",
                icon: MessageCircle,
                title: isHi ? "मदद" : "Help",
                hint: isHi ? "सवाल पूछें" : "Ask us",
                tone: "from-violet-400 to-indigo-600",
              },
            ] as const
          ).map((tile) => {
            const Icon = tile.icon;
            return (
              <AppLink
                key={tile.title}
                href={tile.href}
                className="group relative overflow-hidden rounded-[1.35rem] border border-emerald-900/8 bg-[var(--av-surface)] p-3.5 shadow-[0_10px_24px_-18px_rgba(11,61,40,0.4)] active:scale-[0.98] dark:border-white/8"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md",
                    tile.tone
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[14px] font-extrabold text-[var(--av-text-primary)]">
                  {tile.title}
                </p>
                <p className="text-[11px] font-medium text-[var(--av-text-muted)]">{tile.hint}</p>
              </AppLink>
            );
          })}
        </div>

        <div id="look" className="scroll-mt-20 space-y-2.5">
          <h2 className="px-0.5 text-[15px] font-extrabold text-[var(--av-text-primary)]">
            {isHi ? "देखने का अंदाज़" : "Look & language"}
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {(
              [
                { id: "light" as const, icon: Sun, label: t("settingsLight") },
                { id: "dark" as const, icon: Moon, label: t("settingsDark") },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              const on = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "relative overflow-hidden rounded-[1.35rem] border p-3.5 text-left transition active:scale-[0.98]",
                    on
                      ? "border-emerald-500 bg-emerald-500/12 ring-2 ring-emerald-500/25"
                      : "border-emerald-900/8 bg-[var(--av-surface)] dark:border-white/8"
                  )}
                >
                  <Icon className={cn("h-5 w-5", on ? "text-emerald-700 dark:text-emerald-300" : "text-amber-600")} />
                  <p className="mt-2 text-[13px] font-extrabold text-[var(--av-text-primary)]">{opt.label}</p>
                  {on ? <Check className="absolute right-3 top-3 h-4 w-4 text-emerald-600" /> : null}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {langs.map((opt) => {
              const on = locale === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLocale(opt.code)}
                  className={cn(
                    "relative rounded-[1.35rem] border p-3.5 text-left transition active:scale-[0.98]",
                    on
                      ? "border-emerald-500 bg-emerald-500/12 ring-2 ring-emerald-500/25"
                      : "border-emerald-900/8 bg-[var(--av-surface)] dark:border-white/8"
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-[15px] font-black text-sky-800 dark:text-sky-200">
                    {opt.mark}
                  </span>
                  <p className="mt-2 text-[13px] font-extrabold text-[var(--av-text-primary)]">{opt.label}</p>
                  {on ? <Check className="absolute right-3 top-3 h-4 w-4 text-emerald-600" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <Section eyebrow={isHi ? "सूचना" : "Alerts"} title={t("settingsAlerts")}>
          <Stick
            icon={Sun}
            tone="bg-amber-500/15 text-amber-700 dark:text-amber-300"
            title={t("settingsFieldMode")}
            hint={t("settingsFieldModeHint")}
            toggle={{ on: settings.fieldMode, onChange: (v) => update({ fieldMode: v }) }}
          />
          <Stick
            icon={CloudSun}
            tone="bg-sky-500/15 text-sky-700 dark:text-sky-300"
            title={t("settingsWeatherAlerts")}
            hint={isHi ? "बारिश और स्प्रे का इशारा" : "Rain and spray hints"}
            toggle={{ on: settings.weatherAlerts, onChange: (v) => update({ weatherAlerts: v }) }}
          />
          <Stick
            icon={Bug}
            tone="bg-rose-500/15 text-rose-700 dark:text-rose-300"
            title={t("settingsPestAlerts")}
            hint={isHi ? "आस-पास कीट-रोग खबर" : "Nearby pest news"}
            toggle={{ on: settings.pestAlerts, onChange: (v) => update({ pestAlerts: v }) }}
          />
          <Stick
            icon={Sprout}
            tone="bg-lime-500/15 text-lime-800 dark:text-lime-300"
            title={t("settingsFertilizerReminders")}
            hint={isHi ? "खाद का समय याद रहे" : "Fertilizer timing"}
            toggle={{
              on: settings.fertilizerReminders,
              onChange: (v) => update({ fertilizerReminders: v }),
            }}
          />
          <Stick
            icon={TrendingUp}
            tone="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
            title={t("settingsMarketAlerts")}
            hint={isHi ? "मंडी भाव ऊपर-नीचे" : "Mandi price moves"}
            toggle={{ on: priceSettings.masterEnabled, onChange: setMasterEnabled }}
          />
          <Stick
            icon={Bell}
            tone="bg-teal-500/15 text-teal-800 dark:text-teal-300"
            title={t("settingsManagePriceAlerts")}
            value={`${priceSettings.alerts.filter((a) => a.enabled).length}`}
            href="/mandi#price-alerts"
          />
          <Stick
            icon={Moon}
            tone="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
            title={t("settingsQuietHours")}
            hint={isHi ? "रात 10 से सुबह 6 तक शांत" : "10 PM to 6 AM quiet"}
            toggle={{
              on: settings.quietHoursEnabled,
              onChange: (v) => update({ quietHoursEnabled: v }),
            }}
          />
        </Section>

        <Section eyebrow={isHi ? "खेत" : "Farm"} title={isHi ? "स्थान और खेत" : "Place & fields"}>
          <Stick
            icon={MapPin}
            tone="bg-rose-500/15 text-rose-700 dark:text-rose-300"
            title={isHi ? "मेरा स्थान" : "My place"}
            hint={place || (isHi ? "ज़िला जोड़ें — मौसम सही आएगा" : "Add district for weather")}
            href="/profile/edit"
          />
          <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
            <button
              type="button"
              disabled={locBusy}
              onClick={() => void handleDetectLocation()}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 text-[12px] font-extrabold text-white disabled:opacity-60"
            >
              <Navigation className="h-3.5 w-3.5" />
              {locBusy ? "…" : isHi ? "जीपीएस" : "GPS"}
            </button>
            <button
              type="button"
              onClick={() => void handleOpenLocationSettings()}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-emerald-900/10 bg-[var(--av-surface-inset)] text-[12px] font-extrabold text-[var(--av-text-primary)] dark:border-white/10"
            >
              {isHi ? "अनुमति" : "Permission"}
            </button>
          </div>
          <Stick
            icon={Sprout}
            tone="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
            title={isHi ? "खेत देखें" : "See fields"}
            hint={
              fieldCount
                ? isHi
                  ? `${fieldCount} खेत जुड़े`
                  : `${fieldCount} fields`
                : isHi
                  ? "पहला खेत जोड़ें"
                  : "Add first field"
            }
            href="/my-farm"
          />
        </Section>

        <Section eyebrow={isHi ? "सुरक्षा" : "Privacy"} title={isHi ? "निजता" : "Your data"}>
          <Stick
            icon={Shield}
            tone="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
            title={isHi ? "ऐप सुधारने में मदद" : "Help improve the app"}
            hint={isHi ? "बंद रखें — डेटा नहीं बिकता" : "Off by default — data is never sold"}
            toggle={{
              on: settings.productAnalytics,
              onChange: (v) => update({ productAnalytics: v }),
            }}
          />
          <Stick
            icon={Download}
            tone="bg-sky-500/15 text-sky-700 dark:text-sky-300"
            title={isHi ? "मेरा डेटा निकालें" : "Download my data"}
            hint={isHi ? "फ़ोन पर फ़ाइल रह जाएगी" : "Saves a file on this phone"}
            onClick={handleExport}
          />
          <Stick
            icon={Share2}
            tone="bg-amber-500/15 text-amber-800 dark:text-amber-300"
            title={t("shareAgriveda")}
            hint={isHi ? "गाँव के किसान भाई को भेजें" : "Send to another farmer"}
            onClick={() => void handleShare()}
          />
        </Section>

        <Section eyebrow={isHi ? "खाता" : "Account"} title={isHi ? "लॉग आउट और हटाना" : "Sign out"}>
          <Stick
            icon={LogOut}
            tone="bg-stone-500/15 text-stone-700 dark:text-stone-300"
            title={busy === "logout" ? "…" : isHi ? "लॉग आउट" : "Log out"}
            hint={isHi ? "खेत का डेटा फ़ोन पर रहता है" : "Farm data stays on the phone"}
            onClick={() => void handleLogout()}
          />
          <Stick
            icon={Trash2}
            tone="bg-rose-500/15 text-rose-700 dark:text-rose-300"
            title={busy === "delete" ? "…" : isHi ? "खाता हटाएँ" : "Delete account"}
            hint={isHi ? "सब मिट जाएगा — सोचकर करें" : "Everything is removed"}
            onClick={() => void handleDeleteAccount()}
          />
        </Section>

        <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-[var(--av-surface)] to-amber-50/50 p-4 dark:from-emerald-950/40 dark:to-amber-950/20">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <UserRound className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                {BRAND}
              </p>
              <p className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                {isHi ? "भारतीय किसानों का साथी" : "Companion for Indian farmers"}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">
                {isHi ? `संस्करण ${APP_VERSION} · 18+` : `Version ${APP_VERSION} · 18+`}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <AppLink
              href="/report-bug"
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 text-[12px] font-extrabold text-white"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {isHi ? "समस्या बताएँ" : "Report issue"}
            </AppLink>
            <a
              href={SUPPORT_MAILTO}
              className="flex min-h-11 items-center justify-center rounded-2xl border border-emerald-900/10 bg-[var(--av-surface)] text-[12px] font-extrabold text-[var(--av-text-primary)] dark:border-white/10"
            >
              {isHi ? "ईमेल लिखें" : "Email us"}
            </a>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <AppLink href="/privacy">{isHi ? "गोपनीयता" : "Privacy"}</AppLink>
            <AppLink href="/terms">{isHi ? "नियम" : "Terms"}</AppLink>
            <AppLink href="/ask-query">{isHi ? "सवाल पूछें" : "Ask"}</AppLink>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
