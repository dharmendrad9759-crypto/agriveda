"use client";

import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import { useToast } from "@/components/ui/Toast";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { shareAgriveda } from "@/lib/appEssentials";
import { APP_VERSION, SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/appMeta";
import { BRAND } from "@/lib/brand";
import { deleteAccountAndReload, logoutAndReload } from "@/lib/appReset";
import { downloadLocalDataExport } from "@/lib/exportFarmerData";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";
import { Check, ChevronRight, Download, LogOut, MapPin, Navigation, Settings, Share2, Trash2, User } from "lucide-react";
import { useState } from "react";
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
import IntegrationStatusBanner from "@/components/settings/IntegrationStatusBanner";

function ShareAgrivedaButton() {
  const { showToast } = useToast();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={async () => {
        const result = await shareAgriveda();
        if (result === "copied") showToast(t("shareCopied"), "success");
        else if (result === true) showToast(t("shareDone"), "success");
      }}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-300"
    >
      <Share2 className="h-4 w-4" />
      {t("shareAgriveda")}
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
  const { profile, saveProfile } = useFarmerProfile();
  const { data: farm, stats: farmStats } = useFarmData();
  const { theme, setTheme } = useTheme();
  const { settings, update } = useAppSettings();
  const { settings: priceSettings, setMasterEnabled } = usePriceAlerts();
  const { locale, setLocale, t } = useLocale();
  const { showToast } = useToast();
  const [busy, setBusy] = useState<"logout" | "delete" | null>(null);
  const [locBusy, setLocBusy] = useState(false);

  const langOptions: { code: AppLocale; label: string; hint: string }[] = [
    { code: "en", label: t("english"), hint: t("langEnglishHint") },
    { code: "hi", label: t("hindi"), hint: t("langHindiHint") },
  ];

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
          ? `स्थान सेट · ${[loc.district, loc.state].filter(Boolean).join(", ")}`
          : "GPS स्थान सेव हो गया ✓",
        "success"
      );
    } catch (err) {
      locationFlowErrorMessage(err);
      showToast(
        err instanceof Error ? err.message : "लोकेशन नहीं मिली — Settings से Allow करें",
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
    showToast("फ़ोन Settings में Location → Allow करें", "success");
  };

  const handleLogout = async () => {
    if (!window.confirm("लॉग आउट करें? फसल और local डेटा फ़ोन पर रहेगा। सर्वर session बंद हो जाएगा।"))
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
    if (result.ok) showToast("डेटा फ़ाइल डाउनलोड हो गई ✓", "success");
    else showToast(result.error || "Export fail", "error");
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "खाता स्थायी रूप से हटाएँ?\n\n• Server: farmer, queries, photos, notifications\n• Phone: profile, AI history, farm data\n\nयह वापस नहीं आएगा।"
    );
    if (!ok) return;
    const again = window.confirm(
      "पक्का? खाता मिटाने के बाद Google से दोबारा लॉगिन करके नया खाता बनाना पड़ेगा।"
    );
    if (!again) return;
    setBusy("delete");
    const result = await deleteAccountAndReload();
    if (!result.ok) {
      setBusy(null);
      showToast(result.error || "हटाने में समस्या", "error");
    }
  };

  return (
    <AppShell
      className="!bg-transparent"
      title={t("settingsTitle")}
      subtitle={t("settingsSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("settingsTitle") }]}
    >
      <div className="mb-4 lg:col-span-2 xl:col-span-3">
        <IntegrationStatusBanner />
      </div>
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
            <AppLink href="/profile/edit" className={`mt-4 flex w-full justify-center ${AV.btnSecondarySm}`}>
              {t("settingsEditProfile")}
            </AppLink>
          </div>
        </DarkCard>

        <DarkCard delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsPreferences")}</h3>
          <div className="mt-2">
            <SettingsRow
              label={t("settingsTheme")}
              value={theme === "dark" ? t("settingsDark") : t("settingsLight")}
            />
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-2 w-full rounded-lg bg-[var(--av-surface-inset)] py-2 text-xs text-[var(--av-accent)]"
            >
              {t("settingsToggleTheme")}
            </button>
            <p className="mt-4 text-sm font-semibold text-[var(--av-text-primary)]">{t("settingsLanguage")}</p>
            <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">{t("langSwitchNote")}</p>
            <ul className="mt-2 space-y-2">
              {langOptions.map((opt) => (
                <li key={opt.code}>
                  <button
                    type="button"
                    onClick={() => setLocale(opt.code)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition",
                      locale === opt.code
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-[var(--av-border)] text-[var(--av-text-primary)]"
                    )}
                  >
                    <span>
                      {opt.label}
                      <span className="mt-0.5 block text-[10px] font-medium text-[var(--av-text-muted)]">
                        {opt.hint}
                      </span>
                    </span>
                    {locale === opt.code ? <Check className="h-4 w-4 text-emerald-500" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </DarkCard>

        <DarkCard delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("settingsAlerts")}</h3>
          <div className="mt-2">
            <SettingsRow
              label={t("settingsFieldMode")}
              toggle={{ on: settings.fieldMode, onChange: (v) => update({ fieldMode: v }) }}
            />
            <p className="pb-2 text-[10px] text-[var(--av-text-muted)]">{t("settingsFieldModeHint")}</p>
            <p className="pb-2 text-sm font-semibold text-[var(--av-text-primary)]">{t("settingsRegionalLang")}</p>
            <p className="pb-2 text-[10px] text-[var(--av-text-muted)]">{t("settingsRegionalLangHint")}</p>
            <SettingsRow label={t("settingsWeatherAlerts")} toggle={{ on: settings.weatherAlerts, onChange: (v) => update({ weatherAlerts: v }) }} />
            <p className="pb-1 text-[10px] text-[var(--av-text-muted)]">डिवाइस पर स्थानीय सूचना · FCM जब सर्वर तैयार हो</p>
            <SettingsRow label={t("settingsPestAlerts")} toggle={{ on: settings.pestAlerts, onChange: (v) => update({ pestAlerts: v }) }} />
            <p className="pb-1 text-[10px] text-[var(--av-text-muted)]">आस-पास outbreak push · ऐप में /alerts भी</p>
            <SettingsRow label={t("settingsFertilizerReminders")} toggle={{ on: settings.fertilizerReminders, onChange: (v) => update({ fertilizerReminders: v }) }} />
            <SettingsRow
              label={t("settingsMarketAlerts")}
              toggle={{ on: priceSettings.masterEnabled, onChange: setMasterEnabled }}
            />
            <SettingsRow label={t("settingsManagePriceAlerts")} value={`${priceSettings.alerts.filter((a) => a.enabled).length}`} href="/mandi#price-alerts" />
            <SettingsRow
              label={t("settingsQuietHours")}
              value="10:00 PM - 6:00 AM"
              toggle={{ on: settings.quietHoursEnabled, onChange: (v) => update({ quietHoursEnabled: v }) }}
            />
          </div>
        </DarkCard>

        <DarkCard delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Units & Language</h3>
          <div className="mt-2">
            <SettingsRow label="Temperature" value="°C" />
            <SettingsRow label="Area Unit" value="Acre" />
            <SettingsRow label="Weight Unit" value="Quintal" />
          </div>
        </DarkCard>

        <DarkCard delay={4}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">स्थान और खेत</h3>
          <div className="mt-2">
            <SettingsRow
              label="मेरा स्थान"
              value={[profile.district, profile.state].filter(Boolean).join(", ") || "स्थान जोड़ें"}
              href="/profile/edit"
            />
            <div className="space-y-2 border-b border-[var(--av-border)] py-2">
              <button
                type="button"
                disabled={locBusy}
                onClick={() => void handleDetectLocation()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                <Navigation className="h-4 w-4" />
                {locBusy ? "स्थान लगा रहे हैं…" : "GPS से स्थान लगाएँ"}
              </button>
              <button
                type="button"
                onClick={() => void handleOpenLocationSettings()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs font-bold text-[var(--av-text-primary)]"
              >
                <Settings className="h-3.5 w-3.5" />
                लोकेशन Settings खोलें
              </button>
              <p className="flex items-start gap-1.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                मौसम और सलाह के लिए GPS अनुमति दें। ज़िला न दिखे तो ऊपर «मेरा स्थान» से चुनें।
              </p>
            </div>
            <SettingsRow label="खेत प्रबंधित करें" value={farm.fields.length ? `${farm.fields.length} खेत जोड़े` : "खेत जोड़ें"} href="/my-farm" />
            <SettingsRow
              label="डिफ़ॉल्ट खेत"
              value={
                farm.fields[0]
                  ? `${farm.fields[0].name} (${farm.fields[0].area})`
                  : farmStats.totalAreaAcres > 0
                    ? `${farmStats.totalAreaAcres.toFixed(2)} Acre कुल`
                    : "अभी सेट नहीं"
              }
              href="/my-farm"
            />
          </div>
        </DarkCard>

        <DarkCard delay={5}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">निजता व सुरक्षा</h3>
          <p className="mt-1 text-[11px] leading-snug text-[var(--av-text-muted)]">
            डिफ़ॉल्ट: कोई product analytics नहीं। Google Ads / Crashlytics नहीं। आपका डेटा बेचा नहीं जाता।
          </p>
          <div className="mt-2">
            <SettingsRow
              label="Product analytics (optional)"
              toggle={{
                on: settings.productAnalytics,
                onChange: (v) => update({ productAnalytics: v }),
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 py-2.5 text-sm font-bold text-emerald-700 dark:text-emerald-300"
          >
            <Download className="h-4 w-4" />
            मेरा डेटा डाउनलोड (JSON)
          </button>
          <div className="mt-2 space-y-1 text-[10px] text-[var(--av-text-muted)]">
            <AppLink href="/privacy" className="font-semibold text-[var(--av-accent)] hover:underline">
              गोपनीयता नीति
            </AppLink>
            {" · "}
            <AppLink href="/terms" className="font-semibold text-[var(--av-accent)] hover:underline">
              नियम
            </AppLink>
          </div>
        </DarkCard>

        <DarkCard delay={6}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">खाता</h3>
          <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
            लॉग आउट = सिर्फ session। खाता हटाएँ = server + इस फोन का डेटा मिटाएँ (Play Store अधिकार)।
          </p>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void handleLogout()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 text-sm font-bold text-[var(--av-text-primary)] disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {busy === "logout" ? "…" : "लॉग आउट"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void handleDeleteAccount()}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-bold text-red-600 disabled:opacity-60 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            {busy === "delete" ? "हटा रहे हैं…" : "खाता हटाएँ"}
          </button>
          <p className="mt-2 text-center text-[10px] text-[var(--av-text-muted)]">
            मदद:{" "}
            <a href={SUPPORT_MAILTO} className="font-semibold text-[var(--av-accent)]">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </DarkCard>

        <DarkCard delay={7}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">About {BRAND}</h3>
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">v{APP_VERSION}</p>
          <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
            Smart farming companion for Indian farmers (18+).
          </p>
          <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
            AI/login के लिए इंटरनेट ज़रूरी। दवा हमेशा लेबल + KVK से मिलाएँ।
          </p>
          <div className="mt-3 space-y-1">
            <SettingsRow label="Terms & Conditions" href="/terms" />
            <SettingsRow label="Privacy Policy" href="/privacy" />
            <SettingsRow label="समस्या बताएँ / Bug Report" href="/report-bug" />
            <SettingsRow label="सहायता / Support" href="/ask-query" />
          </div>
          <ShareAgrivedaButton />
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="Need Help?"
        description="Bug या सवाल — हमें बताएँ।"
        buttonLabel="Report a problem"
        href="/report-bug"
      />
    </AppShell>
  );
}
