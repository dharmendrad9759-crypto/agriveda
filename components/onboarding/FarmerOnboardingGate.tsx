"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, User } from "lucide-react";
import FarmSetupStep from "@/components/onboarding/FarmSetupStep";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  getDistrictsForState,
  INDIAN_STATES,
  isValidDistrict,
  isValidState,
} from "@/lib/india-locations";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import {
  completeGoogleRedirectIfAny,
  firebaseAuthError,
  signInWithGoogle,
} from "@/lib/firebase/googleAuth";
import { DEMO_FARMER_PROFILE, shouldAutoSkipOnboarding } from "@/lib/onboarding-demo";
import { getDeviceId } from "@/lib/deviceId";

type Step = "auth" | "name" | "location" | "farm";

const SETUP_STEPS: Step[] = ["name", "location", "farm"];

export default function FarmerOnboardingGate({ children }: { children: React.ReactNode }) {
  const { profile, hydrated, completeOnboarding, completeFarmSetup } = useFarmerProfile();
  const { showToast } = useToast();
  const useFirebase = isFirebaseConfigured();
  const allowGuestContinue = !useFirebase || process.env.NODE_ENV === "development";

  const needsFarmSetup = profile.onboardingComplete && !profile.farmSetupComplete;
  const needsFullOnboarding = !profile.onboardingComplete;

  const [step, setStep] = useState<Step>(needsFarmSetup ? "farm" : "auth");
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const districtOptions = useMemo(
    () => (isValidState(state) ? getDistrictsForState(state) : []),
    [state]
  );

  const handleStateChange = (next: string) => {
    setState(next);
    if (district && isValidState(next) && !isValidDistrict(next, district)) {
      setDistrict("");
    }
  };

  const continueAsGuest = () => {
    completeFarmSetup({
      ...DEMO_FARMER_PROFILE,
      farmSetupComplete: true,
      totalFarmAreaAcres: 5,
    });
    showToast("Home खुल गया — AgriVeda demo");
  };

  const establishSession = async (user: {
    uid: string;
    getIdToken: () => Promise<string>;
    displayName: string | null;
    email: string | null;
  }) => {
    const deviceId = getDeviceId();
    const idToken = await user.getIdToken();
    const sessionRes = await fetch("/api/auth/session/firebase", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, deviceId }),
    });
    const sessionBody = await sessionRes.json();
    if (!sessionRes.ok) {
      throw new Error(sessionBody.error || "Session create failed");
    }

    setFirebaseUid(user.uid);
    setEmail(sessionBody.email || user.email || "");
    const suggested = String(sessionBody.name || user.displayName || "").trim();
    if (suggested) setName(suggested);
    setStep("name");
    showToast("Google लॉगिन सफल ✓");
  };

  useEffect(() => {
    if (!hydrated || !shouldAutoSkipOnboarding() || profile.onboardingComplete) return;
    completeOnboarding({ ...DEMO_FARMER_PROFILE, farmSetupComplete: false });
    setStep("farm");
  }, [hydrated, profile.onboardingComplete, completeOnboarding]);

  useEffect(() => {
    if (needsFarmSetup) setStep("farm");
  }, [needsFarmSetup]);

  // Complete redirect-based Google sign-in (Android WebView)
  useEffect(() => {
    if (!hydrated || !useFirebase || profile.onboardingComplete) return;
    let cancelled = false;
    (async () => {
      try {
        const user = await completeGoogleRedirectIfAny();
        if (cancelled || !user) return;
        setLoading(true);
        await establishSession(user);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : firebaseAuthError(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once after hydrate
  }, [hydrated, useFirebase, profile.onboardingComplete]);

  const showGate =
    hydrated &&
    (needsFullOnboarding || needsFarmSetup) &&
    (needsFarmSetup || !shouldAutoSkipOnboarding());

  if (!hydrated || !showGate) {
    return <>{children}</>;
  }

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!useFirebase) {
        throw new Error(
          "Firebase config missing — Vercel/.env में NEXT_PUBLIC_FIREBASE_* keys लगाएँ"
        );
      }
      const user = await signInWithGoogle();
      await establishSession(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : firebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const finishName = () => {
    if (!name.trim()) {
      setError("कृपया अपना नाम लिखें");
      return;
    }
    setError(null);
    setStep("location");
  };

  const finishLocation = () => {
    if (!village.trim() || !district.trim() || !state.trim()) {
      setError("गाँव, ज़िला और राज्य — तीनों भरें");
      return;
    }
    if (!isValidState(state.trim())) {
      setError("राज्य सूची से चुनें — नाम लिखकर search करें");
      return;
    }
    if (!isValidDistrict(state.trim(), district.trim())) {
      setError("ज़िला सूची से चुनें — नाम लिखकर search करें");
      return;
    }
    setError(null);
    setStep("farm");
  };

  const finishFarmSetup = (totalAcres: number) => {
    const profileData = needsFarmSetup
      ? { totalFarmAreaAcres: totalAcres }
      : {
          email: email || undefined,
          firebaseUid: firebaseUid ?? undefined,
          name: name.trim(),
          village: village.trim(),
          district: district.trim(),
          state: state.trim(),
          phone: "",
          phoneVerified: false,
          totalFarmAreaAcres: totalAcres,
        };

    completeFarmSetup(profileData);
    showToast("स्वागत है, किसान भाई!");
  };

  const setupIndex = SETUP_STEPS.indexOf(step);
  const showWelcomeChrome = setupIndex >= 0 || needsFarmSetup;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=60)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px) saturate(1.15)",
            transform: "scale(1.08)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/55 to-slate-950/75" />
        <div className="absolute -left-10 top-16 h-44 w-44 animate-pulse rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -right-8 bottom-24 h-52 w-52 animate-pulse rounded-full bg-lime-300/20 blur-3xl [animation-delay:1s]" />
      </div>

      <div
        role="dialog"
        aria-modal
        aria-label="Farmer onboarding"
        className="relative z-10 max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-[1.75rem] border border-white/35 bg-white/55 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:rounded-[1.75rem]"
      >
        {showWelcomeChrome ? (
          <div className="px-6 pb-2 pt-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-white/40">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <h2
              className="mt-3 text-xl font-bold tracking-tight text-[#0b1f16]"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              AgriVeda में आपका स्वागत है!
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700/90">
              आपका खाता तैयार है — बस कुछ बातें बताइए ताकि आपका खेत सेट हो जाए।
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {SETUP_STEPS.map((s, i) => {
                const active = needsFarmSetup ? i === 2 : i === setupIndex;
                const done = needsFarmSetup ? i < 2 : i < setupIndex;
                return (
                  <span
                    key={s}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      active
                        ? "scale-110 bg-amber-500"
                        : done
                          ? "bg-emerald-500"
                          : "bg-white/70 ring-1 ring-gray-300/80"
                    }`}
                  />
                );
              })}
            </div>
            <p className="mt-1.5 text-xs font-semibold text-gray-600">
              चरण {needsFarmSetup ? 3 : Math.max(1, setupIndex + 1)}/3
            </p>
          </div>
        ) : (
          <div className="border-b border-white/25 bg-emerald-700/45 px-6 py-5 text-white backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-50/90">
              AgriVeda
            </p>
            <h2 className="mt-1 text-xl font-black">किसान पंजीकरण</h2>
            <p className="mt-1 text-sm text-emerald-50/90">
              Google से लॉगिन करें — OTP / मोबाइल नंबर नहीं चाहिए
            </p>
          </div>
        )}

        <div className="space-y-4 px-6 pb-6 pt-2">
          {step === "auth" && (
            <>
              {!useFirebase && (
                <p className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-2 text-xs text-amber-900">
                  Firebase keys नहीं मिलीं — Vercel में NEXT_PUBLIC_FIREBASE_* सेट करें।
                </p>
              )}
              <button
                type="button"
                onClick={() => void loginWithGoogle()}
                disabled={loading || !useFirebase}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-black text-gray-800 shadow-md transition hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                ) : (
                  <GoogleGlyph />
                )}
                Google से लॉगिन करें
              </button>
              <p className="text-center text-[11px] text-gray-600">
                सुरक्षित लॉगिन — Firebase में Google Sign-in Enable होना चाहिए
              </p>
            </>
          )}

          {step === "name" && (
            <>
              <p className="text-base font-bold text-gray-900">आपका नाम क्या है?</p>
              {email ? (
                <p className="text-xs font-medium text-gray-500">{email}</p>
              ) : null}
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-bold text-gray-500">
                  <User className="h-4 w-4" />
                  नाम
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="अपना नाम लिखें"
                  autoFocus
                  className="w-full rounded-2xl border-2 border-amber-400/80 bg-white px-4 py-3 text-base font-semibold text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={finishName}
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-white shadow-md shadow-amber-500/30 transition hover:bg-amber-600"
                >
                  आगे →
                </button>
              </div>
            </>
          )}

          {step === "location" && (
            <>
              <p className="text-base font-bold text-gray-900">आपका खेत कहाँ है?</p>
              <SearchableSelect
                label="राज्य"
                placeholder="अपना राज्य चुनें"
                value={state}
                onChange={handleStateChange}
                options={INDIAN_STATES}
                emptyHint="राज्य नहीं मिला"
              />
              <SearchableSelect
                key={`onboard-district-${state}`}
                label="ज़िला"
                placeholder={state ? "अपना ज़िला चुनें" : "पहले राज्य चुनें"}
                value={district}
                onChange={setDistrict}
                options={districtOptions}
                disabled={!isValidState(state)}
                emptyHint="ज़िला नहीं मिला"
              />
              <label className="block">
                <span className="mb-1 text-xs font-bold text-gray-500">शहर / गाँव</span>
                <input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="अपना शहर या गाँव टाइप करें"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              </label>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep("name")}
                  className="text-sm font-bold text-gray-500"
                >
                  ← पीछे
                </button>
                <button
                  type="button"
                  onClick={finishLocation}
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-white shadow-md shadow-amber-500/30"
                >
                  आगे →
                </button>
              </div>
            </>
          )}

          {step === "farm" && (
            <>
              {!needsFarmSetup && (
                <button
                  type="button"
                  onClick={() => setStep("location")}
                  className="text-sm font-bold text-gray-500"
                >
                  ← पीछे
                </button>
              )}
              <FarmSetupStep
                farmerName={needsFarmSetup ? profile.name : name}
                onComplete={finishFarmSetup}
                loading={loading}
              />
            </>
          )}

          {error && step !== "farm" && (
            <p className="rounded-xl border border-red-400/40 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          {allowGuestContinue && step === "auth" && !needsFarmSetup && (
            <button
              type="button"
              onClick={continueAsGuest}
              className="w-full rounded-2xl border border-dashed border-emerald-500/40 bg-white/40 py-3 text-sm font-bold text-emerald-800 backdrop-blur"
            >
              बिना लॉगिन Home देखें (demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.6-6.6 7.1l.1.1 6.3 5.2C36.8 38.7 44 33 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
