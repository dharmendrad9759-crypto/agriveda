"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmData } from "@/hooks/useFarmData";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useTheme } from "@/components/theme/ThemeProvider";
import { AV } from "@/lib/design/tokens";
import { Crown, ChevronRight, User, LogOut, Share2 } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";
import { shareAgriveda } from "@/lib/appEssentials";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";

function ShareAgrivedaButton() {
  const { showToast } = useToast();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={async () => {
        const result = await shareAgriveda();
        if (result === "copied") showToast(t("settingsShareCopied"), "success");
        else if (result === true) showToast(t("settingsShareDone"), "success");
      }}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-300"
    >
      <Share2 className="h-4 w-4" />
      {t("settingsShare")}
    </button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-[var(--av-accent)]" : "bg-[#374151]"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function SettingsRow({ label, value, href, toggle }: { label: string; value?: string; href?: string; toggle?: { on: boolean; onChange: (v: boolean) => void } }) {
  const inner = (
    <div className="flex min-h-[36px] items-center justify-between gap-3 py-2">
      <span className="text-sm text-[var(--av-text-primary)]">{label}</span>
      {toggle ? <Toggle on={toggle.on} onChange={toggle.onChange} /> : (
        <span className="flex items-center gap-1 text-xs text-[var(--av-text-muted)]">
          {value} {href && <ChevronRight className="h-4 w-4" />}
        </span>
      )}
    </div>
  );
  if (href) return <AppLink href={href} className="block border-b border-[var(--av-border)] last:border-0">{inner}</AppLink>;
  return <div className="border-b border-[var(--av-border)] last:border-0">{inner}</div>;
}

export default function SettingsPage() {
  const { profile } = useFarmerProfile();
  const { data: farm, stats: farmStats } = useFarmData();
  const { theme, setTheme } = useTheme();
  const { settings, update } = useAppSettings();
  const { settings: priceSettings, setMasterEnabled } = usePriceAlerts();
  const { locale, t, tf } = useLocale();

  const languageLabel =
    locale === "hi" ? t("hindi") : locale === "hinglish" ? t("langHinglish") : t("english");

  const premiumFeatures = [
    t("settingsPremiumAi"),
    t("settingsPremiumAlerts"),
    t("settingsPremiumExpert"),
    t("settingsPremiumSupport"),
  ];

  return (
    <AppShell
      className="!bg-transparent"
      title={t("settingsTitle")}
      subtitle={t("settingsSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("settingsTitle") }]}
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DarkCard delay={0}>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--av-accent)]/20">
              <User className="h-8 w-8 text-[var(--av-accent)]" />
            </div>
            <h2 className="mt-3 text-base font-bold text-[var(--av-text-primary)]">
              {profile.name || t("settingsAddName")}
            </h2>
            <p className="text-xs text-[var(--av-text-muted)]">
              {profile.phone ? `+91 ${profile.phone}` : t("settingsAddPhone")}
            </p>
            <AppLink href="/profile" className={`mt-4 flex w-full justify-center ${AV.btnSecondarySm}`}>
              {t("settingsEditProfile")}
            </AppLink>
          </div>
        </DarkCard>

        <DarkCard delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsPreferences")}</h3>
          <div className="mt-2">
            <SettingsRow
              label={t("settingsDisplayTheme")}
              value={theme === "dark" ? t("settingsDarkMode") : t("settingsLightMode")}
              href="/settings"
            />
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-2 w-full rounded-lg bg-[var(--av-surface-inset)] py-2 text-xs text-[var(--av-accent)]"
            >
              {t("settingsToggleTheme")}
            </button>
            <SettingsRow label={t("settingsAppLanguage")} value={languageLabel} />
            <p className="py-2 text-[11px] text-[var(--av-text-muted)]">{t("profileLanguageHint")}</p>
            <SettingsRow label={t("settingsFontSize")} value={t("settingsFontMedium")} />
          </div>
        </DarkCard>

        <DarkCard delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsAlertsSection")}</h3>
          <div className="mt-2">
            <SettingsRow
              label={t("settingsWeatherAlerts")}
              toggle={{ on: settings.weatherAlerts, onChange: (v) => update({ weatherAlerts: v }) }}
            />
            <SettingsRow
              label={t("settingsPestAlerts")}
              toggle={{ on: settings.pestAlerts, onChange: (v) => update({ pestAlerts: v }) }}
            />
            <SettingsRow
              label={t("settingsFertilizerReminders")}
              toggle={{
                on: settings.fertilizerReminders,
                onChange: (v) => update({ fertilizerReminders: v }),
              }}
            />
            <SettingsRow
              label={t("settingsMarketPriceAlerts")}
              toggle={{ on: priceSettings.masterEnabled, onChange: setMasterEnabled }}
            />
            <SettingsRow
              label={t("settingsManagePriceAlerts")}
              value={tf("settingsActiveCount", {
                n: priceSettings.alerts.filter((a) => a.enabled).length,
              })}
              href="/mandi#price-alerts"
            />
            <SettingsRow
              label={t("settingsQuietHours")}
              value="10:00 PM - 6:00 AM"
              toggle={{
                on: settings.quietHoursEnabled,
                onChange: (v) => update({ quietHoursEnabled: v }),
              }}
            />
          </div>
        </DarkCard>

        <DarkCard delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsUnitsSection")}</h3>
          <div className="mt-2">
            <SettingsRow label={t("settingsTemperature")} value="°C" />
            <SettingsRow label={t("settingsAreaUnit")} value={locale === "en" ? "Acre" : "एकड़"} />
            <SettingsRow label={t("settingsWeightUnit")} value={locale === "en" ? "Quintal" : "क्विंटल"} />
          </div>
        </DarkCard>

        <DarkCard delay={4}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsLocationSection")}</h3>
          <div className="mt-2">
            <SettingsRow
              label={t("settingsMyLocation")}
              value={
                [profile.district, profile.state].filter(Boolean).join(", ") || t("settingsAddLocation")
              }
              href="/profile"
            />
            <SettingsRow
              label={t("settingsManageFarms")}
              value={
                farm.fields.length
                  ? tf("settingsFieldsAdded", { n: farm.fields.length })
                  : t("settingsAddField")
              }
              href="/my-farm"
            />
            <SettingsRow
              label={t("settingsDefaultFarm")}
              value={
                farm.fields[0]
                  ? `${farm.fields[0].name} (${farm.fields[0].area})`
                  : farmStats.totalAreaAcres > 0
                    ? `${farmStats.totalAreaAcres.toFixed(2)} ${t("acresLabel")}`
                    : t("settingsNotSet")
              }
              href="/my-farm"
            />
          </div>
        </DarkCard>

        <DarkCard delay={5}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsAccountSection")}</h3>
          <div className="mt-2">
            <SettingsRow label={t("settingsChangePassword")} href="/profile" />
            <SettingsRow
              label={t("settingsTwoFactor")}
              toggle={{ on: settings.twoFactorAuth, onChange: (v) => update({ twoFactorAuth: v }) }}
            />
            <AppLink href="/profile" className="mt-2 flex items-center gap-2 text-sm text-red-400">
              <LogOut className="h-4 w-4" /> {t("settingsLogout")}
            </AppLink>
          </div>
        </DarkCard>

        <DarkCard delay={6}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsDataSection")}</h3>
          <div className="mt-2">
            <SettingsRow
              label={t("settingsAutoSync")}
              toggle={{ on: settings.autoSync, onChange: (v) => update({ autoSync: v }) }}
            />
            <SettingsRow label={t("settingsLastSynced")} value="07 May 2024, 09:30 AM" />
            <SettingsRow label={t("settingsClearCache")} value="45.2 MB" />
          </div>
        </DarkCard>

        <DarkCard delay={7}>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">AgriVeda Premium</h3>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
              {t("settingsPremiumActive")}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">{t("settingsPremiumValid")}</p>
          <ul className="mt-3 space-y-1 text-xs text-[var(--av-text-secondary)]">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-[var(--av-accent)]">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <AppLink href="/settings/upgrade" className={`mt-4 flex justify-center ${AV.btnPrimarySm}`}>
            {t("settingsManageSub")}
          </AppLink>
        </DarkCard>

        <DarkCard delay={8}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            {tf("settingsAbout", { brand: BRAND })}
          </h3>
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">v{APP_VERSION}</p>
          <p className="mt-1 text-xs text-[var(--av-text-secondary)]">{t("settingsAboutDesc")}</p>
          <div className="mt-3 space-y-1">
            <SettingsRow label={t("settingsTerms")} href="/privacy#terms" />
            <SettingsRow label={t("settingsPrivacy")} href="/privacy" />
            <SettingsRow label={t("settingsRateUs")} href="/profile" />
          </div>
          <ShareAgrivedaButton />
        </DarkCard>
      </div>

      <ShellCtaBanner
        title={t("settingsNeedHelp")}
        description={t("settingsNeedHelpDesc")}
        buttonLabel={t("settingsContactSupport")}
        href="/ask-query"
      />
    </AppShell>
  );
}
