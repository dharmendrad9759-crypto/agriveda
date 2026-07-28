"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import SearchableSelect from "@/components/ui/SearchableSelect";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Save,
  PhoneCall,
  Trash2,
  RotateCcw,
  Info,
  Languages,
  Stethoscope,
  MessageCircle,
  Sprout,
  CheckCircle2,
} from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useToast } from "@/components/ui/Toast";
import { APP_NAME, APP_VERSION } from "@/lib/appMeta";
import { useState, useEffect, useMemo } from "react";
import {
  getDistrictsForState,
  INDIAN_STATES,
  isValidDistrict,
  isValidState,
} from "@/lib/india-locations";
import { KISAN_HELPLINES } from "@/lib/helplines";
import { resetAppAndReload } from "@/lib/appReset";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AV } from "@/lib/design/tokens";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "किसान".slice(0, 1);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "").slice(0, 10);
}

export default function ProfilePage() {
  const { profile, hydrated, saveProfile, setSowingDate } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history, clearHistory } = useAIHistory();
  const { queries, clearQueries } = useQueryHistory();
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const isHi = locale === "hi" || locale === "hinglish";

  const [form, setForm] = useState(profile);

  const districtOptions = useMemo(
    () => (isValidState(form.state) ? getDistrictsForState(form.state) : []),
    [form.state]
  );

  useEffect(() => {
    if (hydrated) setForm(profile);
  }, [hydrated, profile]);

  const placeLine = [form.village, form.district, form.state].filter(Boolean).join(" · ");
  const locationReady = Boolean(form.district && form.state);
  const displayName = form.name.trim() || (isHi ? "किसान भाई" : "Kisan");

  const handleSave = () => {
    const name = form.name.trim();
    const phone = digitsOnly(form.phone);
    if (!name) {
      showToast(isHi ? "अपना नाम लिखें" : "Please enter your name", "error");
      return;
    }
    if (phone && phone.length !== 10) {
      showToast(isHi ? "मोबाइल 10 अंकों का होना चाहिए" : "Mobile must be 10 digits", "error");
      return;
    }
    if (!form.state || !form.district) {
      showToast(
        isHi ? "राज्य और ज़िला चुनें — मौसम/मंडी इसी से चलते हैं" : "Select state & district",
        "error"
      );
      return;
    }

    const next = {
      ...form,
      name,
      village: form.village.trim(),
      phone,
    };
    setForm(next);
    saveProfile(next);
    track("profile_save", { hasPhone: Boolean(phone), state: next.state, district: next.district });
    showToast(isHi ? "प्रोफ़ाइल सेव हो गई ✓" : "Profile saved ✓");
  };

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
      subtitle={
        isHi
          ? "नाम और जगह सही रखें — मौसम, मंडी, अलर्ट यहीं से"
          : "Keep name & place correct — weather, mandi, alerts use this"
      }
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
    >
      <DarkCard className="!p-0 overflow-hidden">
        {/* Identity header */}
        <div className="border-b border-[var(--av-border-subtle)] bg-gradient-to-br from-emerald-500/10 via-[var(--av-surface)] to-amber-500/5 px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold tracking-wide text-white shadow-md"
              aria-hidden
            >
              {initials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-[var(--av-text-primary)]">{displayName}</p>
              <p className="mt-0.5 flex items-start gap-1 text-[12px] font-medium text-[var(--av-text-secondary)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span className="min-w-0 break-words">
                  {placeLine || (isHi ? "जगह अभी सेट नहीं" : "Location not set yet")}
                </span>
              </p>
              <p
                className={cn(
                  "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
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
                ) : (
                  isHi ? "राज्य + ज़िला चुनें" : "Pick state + district"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Form fields — one job each, no nested jumble */}
        <div className="space-y-3.5 px-4 py-4">
          <label className="block">
            <span className={`mb-1.5 flex items-center gap-1.5 ${AV.label}`}>
              <User className="h-3.5 w-3.5" />
              {isHi ? "आपका नाम" : "Your name"}
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="av-input w-full"
              placeholder={isHi ? "जैसे: राम सिंह" : "e.g. Ram Singh"}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className={`mb-1.5 flex items-center gap-1.5 ${AV.label}`}>
              <Phone className="h-3.5 w-3.5" />
              {isHi ? "मोबाइल नंबर" : "Mobile number"}
            </span>
            <div className="flex overflow-hidden rounded-[var(--av-radius)] border border-[var(--av-border)] bg-[var(--av-surface)] focus-within:border-[var(--av-accent)] focus-within:ring-2 focus-within:ring-[var(--av-accent-ring)]">
              <span className="flex items-center border-r border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 text-sm font-semibold text-[var(--av-text-muted)]">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: digitsOnly(e.target.value) })}
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-[var(--av-text-primary)] outline-none placeholder:text-[var(--av-text-muted)]"
                placeholder="98765 43210"
                autoComplete="tel"
                maxLength={10}
              />
            </div>
          </label>

          <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 p-3">
            <p className={`mb-2.5 flex items-center gap-1.5 ${AV.label}`}>
              <MapPin className="h-3.5 w-3.5 text-sky-600" />
              {isHi ? "खेत की जगह" : "Farm location"}
            </p>

            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-[var(--av-text-muted)]">
                {isHi ? "गाँव (वैकल्पिक)" : "Village (optional)"}
              </span>
              <input
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder={isHi ? "गाँव का नाम" : "Village name"}
                className="av-input w-full"
                autoComplete="address-level3"
              />
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SearchableSelect
                key={`state-${form.state}`}
                label={isHi ? "राज्य *" : "State *"}
                placeholder={t("statePlaceholder")}
                value={form.state}
                onChange={(state) => {
                  const district =
                    isValidState(state) && isValidDistrict(state, form.district)
                      ? form.district
                      : "";
                  setForm({ ...form, state, district });
                }}
                options={INDIAN_STATES}
              />
              <SearchableSelect
                key={`district-${form.state}`}
                label={isHi ? "ज़िला *" : "District *"}
                placeholder={
                  form.state ? t("districtPlaceholder") : t("districtSelectStateFirst")
                }
                value={form.district}
                onChange={(district) => setForm({ ...form, district })}
                options={districtOptions}
                disabled={!isValidState(form.state)}
              />
            </div>
            <p className={`mt-2 ${AV.micro}`}>
              {isHi
                ? "पहले राज्य चुनें, फिर ज़िला — मौसम और मंडी यहीं से मिलेंगे।"
                : "Pick state first, then district — weather & mandi use this."}
            </p>
          </div>

          <button type="button" onClick={handleSave} className={`w-full ${AV.btnPrimary}`}>
            <Save className="mr-2 inline h-4 w-4" />
            {isHi ? "प्रोफ़ाइल सेव करें" : "Save profile"}
          </button>
        </div>
      </DarkCard>

      {crops.length > 0 && (
        <DarkCard className="mt-4" delay={1}>
          <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
            <Calendar className="h-4 w-4 text-[var(--av-accent)]" />
            {isHi ? "बुवाई की तारीख" : "Sowing dates"}
          </h2>
          <div className="mt-3 space-y-2">
            {crops.map((crop) => (
              <div
                key={crop.slug}
                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
              >
                <span className="min-w-0 truncate text-sm font-semibold text-[var(--av-text-primary)]">
                  {crop.emoji} {crop.name}
                </span>
                <input
                  type="date"
                  value={profile.sowingDates[crop.slug] ?? ""}
                  onChange={(e) => setSowingDate(crop.slug, e.target.value)}
                  className="av-input max-w-[9.5rem] rounded-lg px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
          <p className={`mt-2 ${AV.micro}`}>
            {isHi
              ? "तारीख डालने पर फसल का सही स्टेज दिखेगा।"
              : "Dates unlock the right crop growth stage."}
          </p>
        </DarkCard>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          icon={Stethoscope}
          label="AI Scans"
          value={String(history.length)}
          action={{ label: "Open", href: "/ai-doctor" }}
        />
        <StatCard
          icon={MessageCircle}
          label="My Queries"
          value={String(queries.length)}
          action={{ label: "Open", href: "/community" }}
        />
      </div>

      <AppLink
        href="/select-crops"
        className="av-card av-card-hover mt-4 flex items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--av-text-primary)]">
          <Sprout className="h-4 w-4 text-[var(--av-accent)]" />
          {isHi ? "मेरी फसलें मैनेज करें" : "Manage my crops"}
        </span>
        <span className="text-[var(--av-accent)]">→</span>
      </AppLink>

      <DarkCard className="mt-4" delay={2}>
        <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
          <PhoneCall className="h-4 w-4 text-orange-500" />
          {isHi ? "कृषि हेल्पलाइन" : "Kisan helplines"}
        </h2>
        <div className="mt-3 space-y-2">
          {KISAN_HELPLINES.map((h) => (
            <a
              key={h.tel}
              href={`tel:${h.tel}`}
              className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 transition hover:bg-orange-500/10"
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-bold text-[var(--av-text-primary)]">{h.name}</p>
                <p className="text-[11px] text-[var(--av-text-muted)]">{h.desc}</p>
              </div>
              <span className="shrink-0 text-sm font-black text-orange-600">{h.number}</span>
            </a>
          ))}
        </div>
      </DarkCard>

      <DarkCard className="mt-4 space-y-4" delay={3}>
        <h2 className={AV.sectionTitle}>{isHi ? "सेटिंग्स" : "Settings"}</h2>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--av-text-secondary)]">
            <Languages className="h-4 w-4" /> {isHi ? "भाषा" : "Language"}
          </span>
          <span className="text-xs text-[var(--av-text-muted)]">
            {isHi ? "नीचे दाएँ 🌐" : "Bottom-right 🌐"}
          </span>
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
