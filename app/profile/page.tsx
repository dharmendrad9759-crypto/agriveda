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

export default function ProfilePage() {
  const { profile, hydrated, saveProfile, setSowingDate } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history, clearHistory } = useAIHistory();
  const { queries, clearQueries } = useQueryHistory();
  const { showToast } = useToast();
  const { t } = useLocale();

  const [form, setForm] = useState(profile);

  const districtOptions = useMemo(
    () => (isValidState(form.state) ? getDistrictsForState(form.state) : []),
    [form.state]
  );

  useEffect(() => {
    if (hydrated) setForm(profile);
  }, [hydrated, profile]);

  const handleSave = () => {
    saveProfile(form);
    showToast("प्रोफ़ाइल सेव हो गई ✓");
  };

  const handleClearHistory = () => {
    if (!window.confirm("AI scan history और queries हटा दें?")) return;
    clearHistory();
    clearQueries();
    showToast("इतिहास साफ़ हो गया ✓");
  };

  const handleResetApp = () => {
    if (
      !window.confirm(
        "सारा डेटा मिट जाएगा (फसल, profile, spray log) और दोबारा registration होगा। जारी रखें?"
      )
    ) {
      return;
    }
    resetAppAndReload();
  };

  return (
    <AppShell
      title="मेरी प्रोफ़ाइल"
      subtitle="Location yahan set karein — mandi, weather aur alerts isi se aate hain"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
    >
      <DarkCard>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--av-accent)]/15 text-2xl">
            👨‍🌾
          </div>
          <div>
            <p className="font-bold text-[var(--av-text-primary)]">{form.name || "किसान"}</p>
            <p className="text-xs text-[var(--av-text-muted)]">
              {form.village || "गाँव"}
              {form.district && ` • ${form.district}`}
              {form.state && ` • ${form.state}`}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className={`mb-1 flex items-center gap-1 ${AV.label}`}>
              <User className="h-3.5 w-3.5" /> नाम
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="av-input w-full"
              placeholder="आपका नाम"
            />
          </label>
          <label className="block">
            <span className={`mb-1 flex items-center gap-1 ${AV.label}`}>
              <MapPin className="h-3.5 w-3.5" /> गाँव / ज़िला / राज्य
            </span>
            <div className="space-y-3">
              <input
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder="गाँव"
                className="av-input w-full"
              />
              <SearchableSelect
                key={`state-${form.state}`}
                label={t("stateLabel")}
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
                label={t("districtLabel")}
                placeholder={
                  form.state ? t("districtPlaceholder") : t("districtSelectStateFirst")
                }
                value={form.district}
                onChange={(district) => setForm({ ...form, district })}
                options={districtOptions}
                disabled={!isValidState(form.state)}
              />
            </div>
          </label>
          <label className="block">
            <span className={`mb-1 flex items-center gap-1 ${AV.label}`}>
              <Phone className="h-3.5 w-3.5" /> मोबाइल
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="av-input w-full"
              placeholder="10 अंकों का नंबर"
            />
          </label>
        </div>

        <button type="button" onClick={handleSave} className={`mt-4 w-full ${AV.btnPrimary}`}>
          <Save className="mr-2 inline h-4 w-4" />
          सेव करें
        </button>
      </DarkCard>

      {crops.length > 0 && (
        <DarkCard className="mt-4" delay={1}>
          <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
            <Calendar className="h-4 w-4 text-[var(--av-accent)]" />
            बुवाई की तारीख (DAS tracking)
          </h2>
          <div className="mt-3 space-y-2">
            {crops.map((crop) => (
              <div
                key={crop.slug}
                className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
              >
                <span className="text-sm font-semibold text-[var(--av-text-primary)]">
                  {crop.emoji} {crop.name}
                </span>
                <input
                  type="date"
                  value={profile.sowingDates[crop.slug] ?? ""}
                  onChange={(e) => setSowingDate(crop.slug, e.target.value)}
                  className="av-input rounded-lg px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
          <p className={`mt-2 ${AV.micro}`}>
            तारीख डालने पर crop details में सही growth stage दिखेगा।
          </p>
        </DarkCard>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard icon={Stethoscope} label="AI Scans" value={String(history.length)} action={{ label: "Open", href: "/ai-doctor" }} />
        <StatCard icon={MessageCircle} label="My Queries" value={String(queries.length)} action={{ label: "Open", href: "/community" }} />
      </div>

      <AppLink
        href="/select-crops"
        className="av-card av-card-hover mt-4 flex items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--av-text-primary)]">
          <Sprout className="h-4 w-4 text-[var(--av-accent)]" />
          Manage my crops
        </span>
        <span className="text-[var(--av-accent)]">→</span>
      </AppLink>

      <DarkCard className="mt-4" delay={2}>
        <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
          <PhoneCall className="h-4 w-4 text-orange-500" />
          कृषि हेल्पलाइन (फ़ोन)
        </h2>
        <div className="mt-3 space-y-2">
          {KISAN_HELPLINES.map((h) => (
            <a
              key={h.tel}
              href={`tel:${h.tel}`}
              className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 transition hover:bg-orange-500/10"
            >
              <div>
                <p className="text-sm font-bold text-[var(--av-text-primary)]">{h.name}</p>
                <p className="text-[11px] text-[var(--av-text-muted)]">{h.desc}</p>
              </div>
              <span className="text-sm font-black text-orange-600">{h.number}</span>
            </a>
          ))}
        </div>
      </DarkCard>

      <DarkCard className="mt-4 space-y-4" delay={3}>
        <h2 className={AV.sectionTitle}>सेटिंग्स</h2>
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-2 text-sm text-[var(--av-text-secondary)]`}>
            <Languages className="h-4 w-4" /> भाषा
          </span>
          <span className="text-xs text-[var(--av-text-muted)]">नीचे दाएँ भाषा बटन</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--av-text-secondary)]">थीम</span>
          <ThemeToggle />
        </div>
        <AppLink href="/settings" className={`inline-flex ${AV.btnSecondarySm}`}>
          All settings →
        </AppLink>
        {(history.length > 0 || queries.length > 0) && (
          <button
            type="button"
            onClick={handleClearHistory}
            className={`flex w-full items-center justify-center gap-2 ${AV.btnSecondarySm} border-red-500/30 text-red-500`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            AI / Query इतिहास साफ़ करें
          </button>
        )}
        <button
          type="button"
          onClick={handleResetApp}
          className={`flex w-full items-center justify-center gap-2 ${AV.btnSecondarySm} border-red-500/30 text-red-500`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          App reset / दोबारा पंजीकरण
        </button>
      </DarkCard>

      <p className={`mt-4 flex items-center justify-center gap-1.5 pb-4 text-center ${AV.micro}`}>
        <Info className="h-3.5 w-3.5" />
        {APP_NAME} v{APP_VERSION} · Made for Indian farmers 🌾
      </p>
    </AppShell>
  );
}
