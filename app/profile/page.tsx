"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Save,
  ChevronRight,
  PhoneCall,
  Trash2,
  RotateCcw,
  Info,
  Languages,
} from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SearchableSelect from "@/components/ui/SearchableSelect";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useToast } from "@/components/ui/Toast";
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
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <div className="relative mx-auto max-w-lg space-y-6 px-5 pt-7">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
            Farmer Profile
          </p>
          <h1 className="text-2xl font-black theme-text-primary">मेरी प्रोफ़ाइल</h1>
        </header>

        <GlassCard className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl">
              👨‍🌾
            </div>
            <div>
              <p className="font-bold theme-text-primary">{form.name || "किसान"}</p>
              <p className="text-xs theme-text-muted">
                {form.village || "गाँव"} {form.district && `• ${form.district}`}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-bold theme-text-muted">
                <User className="h-3.5 w-3.5" /> नाम
              </span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                placeholder="आपका नाम"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-bold theme-text-muted">
                <MapPin className="h-3.5 w-3.5" /> गाँव / ज़िला / राज्य
              </span>
              <div className="space-y-3">
                <input
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  placeholder="गाँव"
                  className="theme-input w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-emerald-500"
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
              <span className="mb-1 flex items-center gap-1 text-xs font-bold theme-text-muted">
                <Phone className="h-3.5 w-3.5" /> मोबाइल
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                placeholder="10 अंकों का नंबर"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3 text-sm font-bold text-white"
          >
            <Save className="h-4 w-4" />
            सेव करें
          </button>
        </GlassCard>

        {crops.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold theme-text-primary">
              <Calendar className="h-4 w-4 text-emerald-500" />
              बुवाई की तारीख (DAS tracking)
            </h2>
            <div className="space-y-2">
              {crops.map((crop) => (
                <GlassCard key={crop.slug} className="flex items-center justify-between p-3">
                  <span className="text-sm font-bold theme-text-primary">
                    {crop.emoji} {crop.name}
                  </span>
                  <input
                    type="date"
                    value={profile.sowingDates[crop.slug] ?? ""}
                    onChange={(e) => setSowingDate(crop.slug, e.target.value)}
                    className="theme-input rounded-lg border px-2 py-1 text-xs"
                  />
                </GlassCard>
              ))}
            </div>
            <p className="mt-2 text-[11px] theme-text-muted">
              तारीख डालने पर crop details में सही growth stage दिखेगा।
            </p>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3">
          <Link href="/ai-doctor" className="block">
            <GlassCard hover className="p-4 text-center">
              <p className="text-2xl font-black text-emerald-500">{history.length}</p>
              <p className="text-xs font-bold theme-text-muted">AI Scans</p>
            </GlassCard>
          </Link>
          <Link href="/community" className="block">
            <GlassCard hover className="p-4 text-center">
              <p className="text-2xl font-black text-emerald-500">{queries.length}</p>
              <p className="text-xs font-bold theme-text-muted">My Queries</p>
            </GlassCard>
          </Link>
        </section>

        <Link
          href="/select-crops"
          className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm font-bold text-emerald-600"
        >
          Manage my crops
          <ChevronRight className="h-4 w-4" />
        </Link>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold theme-text-primary">
            <PhoneCall className="h-4 w-4 text-orange-500" />
            कृषि हेल्पलाइन (फ़ोन)
          </h2>
          <div className="space-y-2">
            {KISAN_HELPLINES.map((h) => (
              <a
                key={h.tel}
                href={`tel:${h.tel}`}
                className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 transition hover:bg-orange-500/10"
              >
                <div>
                  <p className="text-sm font-bold theme-text-primary">{h.name}</p>
                  <p className="text-[11px] theme-text-muted">{h.desc}</p>
                </div>
                <span className="text-sm font-black text-orange-600">{h.number}</span>
              </a>
            ))}
          </div>
        </section>

        <GlassCard className="space-y-4 p-5">
          <h2 className="text-sm font-extrabold theme-text-primary">सेटिंग्स</h2>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm theme-text-muted">
              <Languages className="h-4 w-4" /> भाषा
            </span>
            <span className="text-xs theme-text-muted">नीचे दाएँ 🌐 बटन</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm theme-text-muted">थीम</span>
            <ThemeToggle />
          </div>
          {(history.length > 0 || queries.length > 0) && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-bold theme-text-muted hover:border-red-300 hover:text-red-600 dark:border-white/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              AI / Query इतिहास साफ़ करें
            </button>
          )}
          <button
            type="button"
            onClick={handleResetApp}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2.5 text-xs font-bold text-red-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            App reset / दोबारा पंजीकरण
          </button>
        </GlassCard>

        <p className="flex items-center justify-center gap-1.5 pb-4 text-center text-[11px] theme-text-muted">
          <Info className="h-3.5 w-3.5" />
          {APP_NAME} v{APP_VERSION} · Made for Indian farmers 🌾
        </p>
      </div>
    </div>
  );
}
