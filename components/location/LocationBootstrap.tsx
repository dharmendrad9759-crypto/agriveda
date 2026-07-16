"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Navigation, Settings, X } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import {
  getLocationPermissionStatus,
  locationFlowErrorMessage,
  resolveFarmerLocationFromGps,
} from "@/lib/farmerLocation";
import {
  openAppLocationPermissionSettings,
  openDeviceLocationSettings,
} from "@/lib/openLocationSettings";
import { AV } from "@/lib/design/tokens";

/**
 * On app open (after onboarding): request location.
 * If GPS/permission off → show sheet with Settings deep-link.
 */
export default function LocationBootstrap() {
  const { profile, hydrated, saveProfile } = useFarmerProfile();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDenied, setShowDenied] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const applyLocation = useCallback(
    async (force = false) => {
      if (!hydrated || !profile.onboardingComplete) return;
      if (!force && getLocationPermissionStatus() === "granted") {
        // Already granted earlier — still refresh quietly if no state
        if (profile.state && profile.district) return;
      }

      setBusy(true);
      setError(null);
      try {
        const loc = await resolveFarmerLocationFromGps();
        const patch: { state?: string; district?: string } = {};
        if (loc.state && (!profile.state || force)) patch.state = loc.state;
        if (loc.district && (!profile.district || force)) patch.district = loc.district;
        // Prefer GPS-derived place when profile empty
        if (!profile.state && loc.state) patch.state = loc.state;
        if (!profile.district && loc.district) patch.district = loc.district;
        if (Object.keys(patch).length) saveProfile(patch);

        setShowDenied(false);
        setHint(
          loc.district || loc.state
            ? `Location ON · ${[loc.district, loc.state].filter(Boolean).join(", ")}`
            : "Location ON · weather ke liye GPS save ho gaya"
        );
        window.setTimeout(() => setHint(null), 4500);
      } catch (err) {
        setError(locationFlowErrorMessage(err));
        setShowDenied(true);
      } finally {
        setBusy(false);
      }
    },
    [hydrated, profile.onboardingComplete, profile.state, profile.district, saveProfile]
  );

  useEffect(() => {
    if (!hydrated || !profile.onboardingComplete) return;

    // Let home paint first — GPS prompt on cold start feels like a freeze
    const start = window.setTimeout(() => {
      const status = getLocationPermissionStatus();
      if (status === "denied") {
        setShowDenied(true);
        return;
      }
      if (status !== "granted" || !profile.state) {
        void applyLocation(false);
      }
    }, 2200);

    return () => window.clearTimeout(start);
  }, [hydrated, profile.onboardingComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hydrated || !profile.onboardingComplete) return null;

  return (
    <>
      {hint && (
        <div className="pointer-events-none fixed left-1/2 top-14 z-[70] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl border border-emerald-500/30 bg-emerald-600 px-3 py-2 text-center text-xs font-bold text-white shadow-lg">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {hint}
          </span>
        </div>
      )}

      {showDenied && (
        <div className="fixed inset-x-0 bottom-20 z-[70] px-3 sm:bottom-6 lg:bottom-8">
          <div className="mx-auto w-full max-w-lg rounded-2xl border border-amber-500/35 bg-[var(--av-surface)] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--av-text-primary)]">Location chahiye</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--av-text-secondary)]">
                  {error ??
                    "GPS ON karein — sowing window aapki jagah aur mitti ke hisaab se faslein recommend karegi."}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowDenied(false)}
                className="rounded-lg p-1 text-[var(--av-text-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void applyLocation(true)}
                className={`${AV.btnPrimarySm} inline-flex items-center gap-1.5`}
              >
                <Navigation className="h-3.5 w-3.5" />
                {busy ? "…" : "Phir se try"}
              </button>
              <button
                type="button"
                onClick={() => void openDeviceLocationSettings()}
                className={`${AV.btnSecondarySm} inline-flex items-center gap-1.5`}
              >
                <Settings className="h-3.5 w-3.5" />
                Location ON
              </button>
              <button
                type="button"
                onClick={() => void openAppLocationPermissionSettings()}
                className={`${AV.btnSecondarySm} inline-flex items-center gap-1.5`}
              >
                App permission
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
