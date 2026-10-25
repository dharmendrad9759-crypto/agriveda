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
import { shareAgriveda, softTap } from "@/lib/appEssentials";
import { registerFarmerPush } from "@/lib/push/farmerPush";
import { ShareAgrivedaModal } from "@/components/share/ShareAgrivedaModal";
import { SUPPORT_MAILTO } from "@/lib/appMeta";
import { farmerPlaceLine } from "@/lib/farmerPlaceName";
import { BRAND } from "@/lib/brand";
import { deleteAccountAndReload, logoutAndReload } from "@/lib/appReset";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";
import {
  Bell,
  Bug,
  Check,
  ChevronRight,
  CloudSun,
  HelpCircle,
  LogOut,
  MapPin,
  MessageCircle,
  Moon,
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
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      {eyebrow || title ? (
        <div className="px-0.5">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700/70 dark:text-emerald-300/70">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">{title}</h2>
          ) : null}
        </div>
      ) : null}
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
  const { profile } = useFarmerProfile();
  const { data: farm, stats: farmStats } = useFarmData();
  const { theme, setTheme } = useTheme();
  const { settings, update } = useAppSettings();
  const { settings: priceSettings, setMasterEnabled } = usePriceAlerts();
  const { locale, setLocale, t } = useLocale();
  const { showToast } = useToast();
  const [busy, setBusy] = useState<"logout" | "delete" | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const isHi = locale === "hi";

  const greetName = profile.name.trim()
    ? profile.name.trim().charAt(0).toUpperCase() + profile.name.trim().slice(1)
    : t("settingsAddName");
  const initial = greetName.charAt(0).toUpperCase();
  const place = farmerPlaceLine(profile).full;
  const fieldCount = farm.fields.length;
  const areaLabel =
    farmStats.totalAreaAcres > 0
      ? `${farmStats.totalAreaAcres.toFixed(1)} ${isHi ? "एकड़" : "acre"}`
      : isHi
        ? "रकबा जोड़ें"
        : "Add area";

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
    softTap();
    const result = await shareAgriveda();
    if (result === "fallback") {
      setShowShareModal(true);
    } else if (result === "native") {
      showToast(t("shareDone"), "success");
    }
  };

  const langs: { code: AppLocale; label: string; mark: string }[] = [
    { code: "hi", label: t("hindi"), mark: "अ" },
    { code: "en", label: t("english"), mark: "A" },
  ];

  return (
    <AppShell className="!bg-transparent" title={t("settingsTitle")}>
      <div className="mx-auto max-w-lg space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-emerald-900/10 bg-[var(--av-surface)] p-3.5 shadow-sm dark:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-lg font-black text-white shadow-md shadow-emerald-950/20">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-extrabold text-[var(--av-text-primary)]">
                {greetName}
              </h2>
              <p className="truncate text-xs font-medium text-[var(--av-text-muted)]">
                {profile.phone ? `+91 ${profile.phone}` : place || (isHi ? "किसान खाता" : "Farmer account")}
              </p>
            </div>
          </div>
          <AppLink
            href="/profile"
            className="shrink-0 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition active:scale-95 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            {isHi ? "प्रोफ़ाइल देखें" : "View profile"}
          </AppLink>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
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

        <Section>
          <Stick
            icon={Sun}
            tone="bg-amber-500/15 text-amber-700 dark:text-amber-300"
            title={t("settingsFieldMode")}
            hint={t("settingsFieldModeHint")}
            toggle={{
              on: settings.fieldMode,
              onChange: (v) => {
                update({ fieldMode: v });
                showToast(
                  `${t("settingsFieldMode")}: ${v ? (isHi ? "चालू किया ✓" : "Enabled ✓") : (isHi ? "बंद किया ✓" : "Disabled ✓")}`
                );
              },
            }}
          />
          <Stick
            icon={CloudSun}
            tone="bg-sky-500/15 text-sky-700 dark:text-sky-300"
            title={t("settingsWeatherAlerts")}
            hint={isHi ? "बारिश और स्प्रे का इशारा" : "Rain and spray hints"}
            toggle={{
              on: settings.weatherAlerts,
              onChange: (v) => {
                softTap();
                update({ weatherAlerts: v });
                showToast(
                  `${t("settingsWeatherAlerts")}: ${v ? (isHi ? "चालू किया ✓" : "Enabled ✓") : (isHi ? "बंद किया ✓" : "Disabled ✓")}`
                );
                if (v) void registerFarmerPush();
              },
            }}
          />
          <Stick
            icon={Bug}
            tone="bg-rose-500/15 text-rose-700 dark:text-rose-300"
            title={t("settingsPestAlerts")}
            hint={isHi ? "आस-पास कीट-रोग खबर" : "Nearby pest news"}
            toggle={{
              on: settings.pestAlerts,
              onChange: (v) => {
                softTap();
                update({ pestAlerts: v });
                showToast(
                  `${t("settingsPestAlerts")}: ${v ? (isHi ? "चालू किया ✓" : "Enabled ✓") : (isHi ? "बंद किया ✓" : "Disabled ✓")}`
                );
                if (v) void registerFarmerPush();
              },
            }}
          />
          <Stick
            icon={Sprout}
            tone="bg-lime-500/15 text-lime-800 dark:text-lime-300"
            title={t("settingsFertilizerReminders")}
            hint={isHi ? "खाद का समय याद रहे" : "Fertilizer timing"}
            toggle={{
              on: settings.fertilizerReminders,
              onChange: (v) => {
                softTap();
                update({ fertilizerReminders: v });
                showToast(
                  `${t("settingsFertilizerReminders")}: ${v ? (isHi ? "चालू किया ✓" : "Enabled ✓") : (isHi ? "बंद किया ✓" : "Disabled ✓")}`
                );
                if (v) void registerFarmerPush();
              },
            }}
          />
          <Stick
            icon={TrendingUp}
            tone="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
            title={t("settingsMarketAlerts")}
            hint={isHi ? "मंडी भाव ऊपर-नीचे" : "Mandi price moves"}
            toggle={{
              on: priceSettings.masterEnabled,
              onChange: (v) => {
                softTap();
                setMasterEnabled(v);
                showToast(
                  `${t("settingsMarketAlerts")}: ${v ? (isHi ? "चालू किया ✓" : "Enabled ✓") : (isHi ? "बंद किया ✓" : "Disabled ✓")}`
                );
                if (v) void registerFarmerPush();
              },
            }}
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
              onChange: (v) => {
                softTap();
                update({ quietHoursEnabled: v });
                showToast(
                  `${t("settingsQuietHours")}: ${v ? (isHi ? "चालू किया ✓" : "Enabled ✓") : (isHi ? "बंद किया ✓" : "Disabled ✓")}`
                );
              },
            }}
          />
        </Section>



        <Section title={isHi ? "निजता व सुरक्षा" : "Privacy & Security"}>
          <Stick
            icon={Shield}
            tone="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
            title={isHi ? "ऐप सुधारने में सहयोग" : "Help improve the app"}
            hint={isHi ? "ऐच्छिक — आपकी जानकारी पूरी तरह सुरक्षित व निजी है" : "Optional — your data stays strictly private & secure"}
            toggle={{
              on: settings.productAnalytics,
              onChange: (v) => update({ productAnalytics: v }),
            }}
          />
          <Stick
            icon={Share2}
            tone="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
            title={t("shareAgriveda")}
            hint={isHi ? "व्हाट्सएप, मैसेज या अन्य ऐप्स पर साझा करें" : "Share via WhatsApp, SMS or apps"}
            onClick={() => void handleShare()}
          />
        </Section>

        <Section>
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
          </div>
        </section>
      </div>
      <ShareAgrivedaModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        lang={locale}
      />
    </AppShell>
  );
}
