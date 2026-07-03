"use client";

import Link from "next/link";
import { User, MapPin, Phone, Calendar, Save, ChevronRight } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { profile, hydrated, saveProfile, setSowingDate } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history } = useAIHistory();
  const { queries } = useQueryHistory();
  const { showToast } = useToast();

  const [form, setForm] = useState(profile);

  useEffect(() => {
    if (hydrated) setForm(profile);
  }, [hydrated, profile]);

  const handleSave = () => {
    saveProfile(form);
    showToast("प्रोफ़ाइल सेव हो गई ✓");
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
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm theme-text-primary outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-black/30"
                placeholder="आपका नाम"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-bold theme-text-muted">
                <MapPin className="h-3.5 w-3.5" /> गाँव / ज़िला / राज्य
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  placeholder="गाँव"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-black/30"
                />
                <input
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="ज़िला"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-black/30"
                />
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="राज्य"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-black/30"
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
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-black/30"
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
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-white/10 dark:bg-black/30"
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
      </div>

      <BottomNav />
    </div>
  );
}
