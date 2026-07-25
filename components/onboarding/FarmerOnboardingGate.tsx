"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Phone, ShieldCheck, User } from "lucide-react";
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
  RECAPTCHA_CONTAINER_ID,
  sendFirebasePhoneOtp,
  verifyFirebasePhoneOtp,
  firebaseAuthError,
} from "@/lib/firebase/phoneAuth";
import { DEMO_FARMER_PROFILE, shouldAutoSkipOnboarding } from "@/lib/onboarding-demo";
import { getDeviceId } from "@/lib/deviceId";

type Step = "phone" | "otp" | "name" | "location" | "farm";

const SETUP_STEPS: Step[] = ["name", "location", "farm"];

export default function FarmerOnboardingGate({ children }: { children: React.ReactNode }) {
  const { profile, hydrated, completeOnboarding, completeFarmSetup } = useFarmerProfile();
  const { showToast } = useToast();
  const useFirebase = isFirebaseConfigured();
  const allowGuestContinue = !useFirebase || process.env.NODE_ENV === "development";

  const needsFarmSetup = profile.onboardingComplete && !profile.farmSetupComplete;
  const needsFullOnboarding = !profile.onboardingComplete;

  const [step, setStep] = useState<Step>(needsFarmSetup ? "farm" : "phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
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

  const continueWithoutOtp = () => {
    completeFarmSetup({
      ...DEMO_FARMER_PROFILE,
      phone: phone.replace(/\D/g, "").slice(-10) || DEMO_FARMER_PROFILE.phone,
      farmSetupComplete: true,
      totalFarmAreaAcres: 5,
    });
    showToast("Home खुल गया — AgriVeda demo");
  };

  useEffect(() => {
    if (!hydrated || !shouldAutoSkipOnboarding() || profile.onboardingComplete) return;
    completeOnboarding({ ...DEMO_FARMER_PROFILE, farmSetupComplete: false });
    setStep("farm");
  }, [hydrated, profile.onboardingComplete, completeOnboarding]);

  useEffect(() => {
    if (needsFarmSetup) setStep("farm");
  }, [needsFarmSetup]);

  const showGate =
    hydrated &&
    (needsFullOnboarding || needsFarmSetup) &&
    (needsFarmSetup || !shouldAutoSkipOnboarding());

  if (!hydrated || !showGate) {
    return <>{children}</>;
  }

  const sendOtp = async () => {
    setError(null);
    setLoading(true);
    setDemoOtp(null);

    try {
      if (useFirebase) {
        await sendFirebasePhoneOtp(phone);
        setStep("otp");
        showToast("Firebase OTP भेज दिया गया");
        return;
      }

      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "OTP नहीं भेजा जा सका");

      if (body.demoOtp && process.env.NODE_ENV === "development") {
        setDemoOtp(String(body.demoOtp));
      }
      setStep("otp");
      showToast("OTP भेज दिया गया");
    } catch (err) {
      setError(
        useFirebase
          ? firebaseAuthError(err)
          : err instanceof Error
            ? err.message
            : "OTP भेजने में समस्या"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    setLoading(true);

    try {
      const deviceId = getDeviceId();

      if (useFirebase) {
        const user = await verifyFirebasePhoneOtp(otp);
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
        setStep("name");
        showToast("मोबाइल verify हो गया ✓");
        return;
      }

      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, deviceId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "OTP verify नहीं हुआ");

      setStep("name");
      showToast("मोबाइल verify हो गया ✓");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP गलत है");
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
          phone: phone.replace(/\D/g, "").slice(-10),
          firebaseUid: firebaseUid ?? undefined,
          name: name.trim(),
          village: village.trim(),
          district: district.trim(),
          state: state.trim(),
          totalFarmAreaAcres: totalAcres,
        };

    completeFarmSetup(profileData);
    showToast("स्वागत है, किसान भाई! 🌾");
  };

  const setupIndex = SETUP_STEPS.indexOf(step);
  const showWelcomeChrome = setupIndex >= 0 || needsFarmSetup;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      {/* Atmosphere — glassmorphism backdrop (crop field feel) */}
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
              {step === "phone"
                ? "पहले मोबाइल नंबर verify करें"
                : "SMS OTP डालकर verify करें"}
            </p>
          </div>
        )}

        <div className="space-y-4 px-6 pb-6 pt-2">
          <div id={RECAPTCHA_CONTAINER_ID} className="min-h-px" />

          {step === "phone" && (
            <>
              {!useFirebase && (
                <p className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-2 text-xs text-amber-900">
                  Firebase config नहीं मिला — टेस्ट OTP mode चलेगा।
                </p>
              )}
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-600">
                  <Phone className="h-4 w-4" />
                  मोबाइल नंबर
                </span>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-2xl border border-white/60 bg-white/80 px-3 text-sm font-bold text-gray-700 shadow-sm backdrop-blur">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full rounded-2xl border border-emerald-500/40 bg-white/85 px-4 py-3 text-lg font-bold tracking-widest text-gray-900 outline-none backdrop-blur focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </label>
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading || phone.length !== 10}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                OTP भेजें
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-sm text-gray-600">+91 {phone} पर OTP भेजा गया</p>
              {demoOtp && (
                <p className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-2 text-center text-sm font-bold text-amber-800">
                  टेस्ट OTP: {demoOtp}
                </p>
              )}
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-600">
                  <ShieldCheck className="h-4 w-4" />
                  6 अंकों का OTP
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full rounded-2xl border border-emerald-500/40 bg-white/85 px-4 py-3 text-center text-2xl font-black tracking-[0.5em] text-gray-900 outline-none backdrop-blur focus:border-emerald-500"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm font-bold text-gray-600"
                >
                  पीछे
                </button>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Verify करें
                </button>
              </div>
            </>
          )}

          {step === "name" && (
            <>
              <p className="text-base font-bold text-gray-900">आपका नाम क्या है?</p>
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

          {allowGuestContinue && (step === "phone" || step === "otp") && !needsFarmSetup && (
            <button
              type="button"
              onClick={continueWithoutOtp}
              className="w-full rounded-2xl border border-dashed border-emerald-500/40 bg-white/40 py-3 text-sm font-bold text-emerald-800 backdrop-blur"
            >
              OTP के बिना Home देखें
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
