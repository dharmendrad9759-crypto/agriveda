"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Navigation, Settings, X } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import {
  clearLocationPermissionCache,
  getLocationPermissionStatus,
  locationFlowErrorMessage,
  resolveFarmerLocationFromGps,
} from "@/lib/farmerLocation";
import {
  canOpenNativeLocationSettings,
  openAppLocationPermissionSettings,
  openDeviceLocationSettings,
} from "@/lib/openLocationSettings";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";

function isLocationServicesOff(err: unknown): boolean {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err ?? "").toLowerCase();
  return (
    msg.includes("location services") ||
    msg.includes("not enabled") ||
    msg.includes("disabled") ||
    msg.includes("location provider")
  );
}

/**
 * After onboarding: request GPS permission (system dialog).
 * Settings buttons use native Android Intent (new APK) — WebView intents do not work.
 */
export default function LocationBootstrap() {
  const { profile, hydrated, saveProfile } = useFarmerProfile();
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const [busy, setBusy] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDenied, setShowDenied] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [askedOnce, setAskedOnce] = useState(false);

  const applyLocation = useCallback(
    async (opts?: { force?: boolean; openSettingsOnDeny?: boolean }) => {
      const force = opts?.force ?? false;
      const openSettingsOnDeny = opts?.openSettingsOnDeny ?? false;
      if (!hydrated || !profile.onboardingComplete) return;

      setBusy(true);
      setError(null);
      try {
        if (force) clearLocationPermissionCache();

        const loc = await resolveFarmerLocationFromGps();
        const patch: { state?: string; district?: string } = {};
        if (loc.state && (!profile.state || force)) patch.state = loc.state;
        if (loc.district && (!profile.district || force)) patch.district = loc.district;
        if (!profile.state && loc.state) patch.state = loc.state;
        if (!profile.district && loc.district) patch.district = loc.district;
        if (Object.keys(patch).length) saveProfile(patch);

        setShowDenied(false);
        setHint(
          loc.district || loc.state
            ? isHi
              ? `लोकेशन चालू · ${[loc.district, loc.state].filter(Boolean).join(", ")}`
              : `Location ON · ${[loc.district, loc.state].filter(Boolean).join(", ")}`
            : isHi
              ? "लोकेशन चालू · GPS सेव हो गया"
              : "Location ON · GPS saved"
        );
        window.setTimeout(() => setHint(null), 4500);
      } catch (err) {
        locationFlowErrorMessage(err);
        const servicesOff = isLocationServicesOff(err);
        setError(
          servicesOff
            ? isHi
              ? "फ़ोन का Location / GPS बंद है। «GPS चालू करें» दबाएँ।"
              : "Phone Location / GPS is off. Tap «Turn GPS on»."
            : isHi
              ? "लोकेशन अनुमति नहीं मिली। «Settings खोलें» दबाकर Location → Allow करें।"
              : "Location permission denied. Tap Settings and Allow Location."
        );
        setShowDenied(true);
        if (openSettingsOnDeny) {
          window.setTimeout(() => {
            void (servicesOff
              ? openDeviceLocationSettings()
              : openAppLocationPermissionSettings());
          }, 350);
        }
      } finally {
        setBusy(false);
      }
    },
    [hydrated, profile.onboardingComplete, profile.state, profile.district, saveProfile, isHi]
  );

  const onOpenAppSettings = useCallback(async () => {
    setOpening(isHi ? "Settings खोल रहे हैं…" : "Opening Settings…");
    const ok = await openAppLocationPermissionSettings();
    setOpening(
      ok
        ? isHi
          ? "Settings खुली — Location Allow करें, फिर वापस आएँ"
          : "Settings opened — Allow Location, then return"
        : null
    );
    window.setTimeout(() => setOpening(null), 4000);
  }, [isHi]);

  const onOpenGpsSettings = useCallback(async () => {
    setOpening(isHi ? "GPS Settings खोल रहे हैं…" : "Opening GPS Settings…");
    const ok = await openDeviceLocationSettings();
    setOpening(
      ok
        ? isHi
          ? "GPS Settings खुली — Location ON करें"
          : "GPS Settings opened — turn Location ON"
        : null
    );
    window.setTimeout(() => setOpening(null), 4000);
  }, [isHi]);

  useEffect(() => {
    if (!hydrated || !profile.onboardingComplete || askedOnce) return;

    const start = window.setTimeout(() => {
      setAskedOnce(true);
      const cached = getLocationPermissionStatus();
      if (cached === "granted" && profile.state && profile.district) return;
      void applyLocation({ force: cached !== "granted", openSettingsOnDeny: false });
    }, 4500);

    return () => window.clearTimeout(start);
  }, [hydrated, profile.onboardingComplete, askedOnce, profile.state, profile.district, applyLocation]);

  if (!hydrated || !profile.onboardingComplete) return null;

  const nativeReady = canOpenNativeLocationSettings();

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

      {opening && (
        <div className="pointer-events-none fixed left-1/2 top-14 z-[80] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl border border-sky-400/40 bg-sky-700 px-3 py-2 text-center text-xs font-bold text-white shadow-lg">
          {opening}
        </div>
      )}

      {showDenied && (
        <div className="fixed inset-x-0 bottom-20 z-[70] px-3 sm:bottom-6 lg:bottom-8">
          <div className="mx-auto w-full max-w-lg rounded-2xl border border-amber-500/35 bg-[var(--av-surface)] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--av-text-primary)]">
                  {isHi ? "लोकेशन चाहिए" : "Location needed"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--av-text-secondary)]">
                  {error ??
                    (isHi
                      ? "मौसम और सही सलाह के लिए Location ON करें।"
                      : "Turn on Location for weather & advice.")}
                </p>
                {!nativeReady ? (
                  <p className="mt-2 text-[11px] font-semibold leading-relaxed text-amber-700 dark:text-amber-400">
                    {isHi
                      ? "अगर बटन से Settings न खुले: Phone Settings → Apps → Agriveda → Permissions → Location → Allow"
                      : "If buttons don’t open Settings: Phone Settings → Apps → Agriveda → Permissions → Location → Allow"}
                  </p>
                ) : null}
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
                onClick={() => void onOpenAppSettings()}
                className={`${AV.btnPrimarySm} inline-flex items-center gap-1.5`}
              >
                <Settings className="h-3.5 w-3.5" />
                {isHi ? "Settings खोलें" : "Open Location Settings"}
              </button>
              <button
                type="button"
                onClick={() => void onOpenGpsSettings()}
                className={`${AV.btnSecondarySm} inline-flex items-center gap-1.5`}
              >
                <Navigation className="h-3.5 w-3.5" />
                {isHi ? "GPS चालू करें" : "Turn GPS on"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void applyLocation({ force: true, openSettingsOnDeny: true })}
                className={`${AV.btnSecondarySm} inline-flex items-center gap-1.5`}
              >
                <MapPin className="h-3.5 w-3.5" />
                {busy ? "…" : isHi ? "फिर कोशिश" : "Try again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
