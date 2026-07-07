"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import { MapPin, TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { rankCropsForFarmer } from "@/lib/agriveda2/smartCropEngine";
import { buildSmartCropLocationBanner } from "@/lib/agriveda2/locationAdvisory";
import { INDIAN_STATES, getDistrictsForState } from "@/lib/india-locations";

export default function SmartCropClient() {
  const { profile, saveProfile } = useFarmerProfile();
  const [state, setState] = useState(profile.state || "");
  const [district, setDistrict] = useState(profile.district || "");
  const [locationConfirmed, setLocationConfirmed] = useState(
    Boolean(profile.state && profile.district)
  );

  const districts = useMemo(
    () => (state ? getDistrictsForState(state) : []),
    [state]
  );

  const ranks = useMemo(
    () =>
      locationConfirmed && state && district
        ? rankCropsForFarmer({
            district,
            state,
            waterIndex: state.toLowerCase().includes("rajasthan") ? "low" : "medium",
            limit: 5,
          })
        : [],
    [district, state, locationConfirmed]
  );

  const banner = useMemo(
    () => buildSmartCropLocationBanner(state, district, ranks),
    [state, district, ranks]
  );

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

  const confirmLocation = () => {
    if (!state || !district) return;
    setLocationConfirmed(true);
    saveProfile({ state, district });
  };

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4 p-4">
        <p className="flex items-center gap-2 text-sm font-bold theme-text-primary">
          <MapPin className="h-4 w-4 text-emerald-600" />
          पहले अपना राज्य और ज़िला बताएँ
        </p>
        <p className="text-xs theme-text-muted">
          हर जगह बीघा अलग होता है — Bulandshahr, Aligarh, Rajasthan सब अलग। ज़िला चुनने पर
          सलाह आपके इलाके के हिसाब से दिखेगी।
        </p>

        <SearchableSelect
          label="राज्य"
          placeholder="राज्य search करें"
          value={state}
          options={INDIAN_STATES}
          onChange={(v) => {
            setState(v);
            setDistrict("");
            setLocationConfirmed(false);
          }}
        />

        <SearchableSelect
          label="ज़िला"
          placeholder={state ? "ज़िला search करें" : "पहले राज्य चुनें"}
          value={district}
          options={districts}
          disabled={!state}
          onChange={(v) => {
            setDistrict(v);
            setLocationConfirmed(false);
          }}
        />

        <button
          type="button"
          onClick={confirmLocation}
          disabled={!state || !district}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-40"
        >
          मेरी जगह के हिसाब से सलाह दिखाएँ
        </button>
      </GlassCard>

      {locationConfirmed && ranks.length > 0 && (
        <>
          <GlassCard className="space-y-2 p-4 text-xs">
            <p className="font-bold theme-text-primary">{banner.title}</p>
            <p className="theme-text-muted leading-relaxed">{banner.body}</p>
            <p className="rounded-lg bg-amber-500/10 px-2 py-1.5 font-semibold text-amber-900 dark:text-amber-200">
              {banner.bighaNote}
            </p>
          </GlassCard>

          {ranks.map((crop, i) => (
            <GlassCard key={crop.slug} neon={i === 0} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-black theme-text-primary">
                    {medals[i]} Rank {crop.rank}: {crop.emoji} {crop.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-600">
                    💰 {crop.netProfitRange}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${
                    crop.soilMatch === "Perfect"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {crop.soilMatch}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-xs theme-text-muted">
                <li className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                  Yield: {crop.avgYield} · {crop.avgPrice}
                </li>
                <li className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  Mandi demand: {crop.marketDemand} ({crop.mandiTrend})
                </li>
                <li className="flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Risk: {crop.riskLabel}
                </li>
                {crop.reasons.slice(0, 2).map((r) => (
                  <li key={r} className="pl-5 text-[11px]">
                    • {r}
                  </li>
                ))}
              </ul>

              <AppLink
                href={`/crop-details/${crop.slug}`}
                className="mt-3 inline-block text-xs font-bold text-emerald-600"
              >
                Crop guide →
              </AppLink>
            </GlassCard>
          ))}
        </>
      )}

      {locationConfirmed && ranks.length === 0 && (
        <GlassCard className="p-4 text-sm theme-text-muted">
          इस ज़िले के लिए अभी data load नहीं हुआ — दोबारा राज्य/ज़िला चुनें।
        </GlassCard>
      )}
    </div>
  );
}
