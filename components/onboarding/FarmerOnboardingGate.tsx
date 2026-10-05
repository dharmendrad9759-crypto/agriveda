"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CloudSun,
  Compass,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
  TrendingUp,
  User,
} from "lucide-react";
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
  getNativeGoogleIdToken,
  signInWithGoogle,
} from "@/lib/firebase/googleAuth";
import { Capacitor } from "@capacitor/core";
import { DEMO_FARMER_PROFILE, shouldAutoSkipOnboarding } from "@/lib/onboarding-demo";
import { getDeviceId } from "@/lib/deviceId";
import { signalForceUpdate, withNativeAppHeaders } from "@/lib/nativeAppInfo";
import { markIntroDone } from "@/lib/launchFlags";
import { lookupPincode } from "@/lib/pincodeLookup";
import { cn } from "@/lib/cn";

type Step = "auth" | "name" | "location" | "farm";

const SETUP_STEPS: { id: Step; label: string; icon: typeof User }[] = [
  { id: "name", label: "नाम", icon: User },
  { id: "location", label: "स्थान", icon: MapPin },
  { id: "farm", label: "खेत व फसल", icon: Sprout },
];

export default function FarmerOnboardingGate({ children }: { children: React.ReactNode }) {
  const { profile, hydrated, completeOnboarding, completeFarmSetup } = useFarmerProfile();
  const { showToast } = useToast();
  const useFirebase = isFirebaseConfigured();
  // Always allow demo/guest continue so users can explore the app freely
  const allowGuestContinue = true;

  const needsFarmSetup = profile.onboardingComplete && !profile.farmSetupComplete;
  const needsFullOnboarding = !profile.onboardingComplete;

  const [step, setStep] = useState<Step>(needsFarmSetup ? "farm" : "auth");
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
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
    markIntroDone();
    showToast("स्वागत है! AgriVeda डेमो मोड सक्रिय ✓", "success");
  };

  const establishSessionFromGoogleIdToken = async (
    googleIdToken: string,
    hint?: { displayName?: string | null; email?: string | null }
  ) => {
    const deviceId = getDeviceId();
    const headers = await withNativeAppHeaders({
      "Content-Type": "application/json",
    });
    const sessionRes = await fetch("/api/auth/session/firebase", {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ googleIdToken, deviceId }),
    });
    const sessionBody = await sessionRes.json().catch(() => ({}));
    if (sessionRes.status === 426 || sessionBody.code === "FORCE_UPDATE") {
      signalForceUpdate(sessionBody.minVersionCode);
      throw new Error(sessionBody.error || "नया ऐप संस्करण ज़रूरी है");
    }
    if (sessionRes.status === 409 || sessionBody.code === "DEVICE_CONFLICT") {
      throw new Error(
        sessionBody.error ||
          "यह Google ID दूसरी डिवाइस पर लॉगिन है। पहले उस फोन से Logout करें।"
      );
    }
    if (!sessionRes.ok) {
      throw new Error(sessionBody.error || "Session create failed");
    }

    setFirebaseUid(sessionBody.firebaseUid || null);
    setEmail(sessionBody.email || hint?.email || "");
    const suggested = String(sessionBody.name || hint?.displayName || "").trim();
    if (suggested) setName(suggested);
    setStep("name");
    showToast("Google लॉगिन सफल ✓", "success");
  };

  const establishSession = async (user: {
    uid: string;
    getIdToken: () => Promise<string>;
    displayName: string | null;
    email: string | null;
  }) => {
    const deviceId = getDeviceId();
    const idToken = await user.getIdToken();
    const headers = await withNativeAppHeaders({
      "Content-Type": "application/json",
    });
    const sessionRes = await fetch("/api/auth/session/firebase", {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ idToken, deviceId }),
    });
    const sessionBody = await sessionRes.json().catch(() => ({}));
    if (sessionRes.status === 426 || sessionBody.code === "FORCE_UPDATE") {
      signalForceUpdate(sessionBody.minVersionCode);
      throw new Error(sessionBody.error || "नया ऐप संस्करण ज़रूरी है");
    }
    if (sessionRes.status === 409 || sessionBody.code === "DEVICE_CONFLICT") {
      throw new Error(
        sessionBody.error ||
          "यह Google ID दूसरी डिवाइस पर लॉगिन है। पहले उस फोन से Logout करें।"
      );
    }
    if (!sessionRes.ok) {
      throw new Error(sessionBody.error || "Session create failed");
    }

    setFirebaseUid(user.uid);
    setEmail(sessionBody.email || user.email || "");
    const suggested = String(sessionBody.name || user.displayName || "").trim();
    if (suggested) setName(suggested);
    setStep("name");
    showToast("Google लॉगिन सफल ✓", "success");
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
      if (Capacitor.isNativePlatform()) {
        const native = await getNativeGoogleIdToken();
        await establishSessionFromGoogleIdToken(native.googleIdToken, native);
      } else {
        const user = await signInWithGoogle();
        await establishSession(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : firebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const finishName = () => {
    if (!name.trim()) {
      setError("कृपया अपना शुभ नाम लिखें");
      return;
    }
    setError(null);
    setStep("location");
  };

  const handlePincodeLookup = async () => {
    const pin = pincode.replace(/\D/g, "").slice(0, 6);
    if (pin.length !== 6) {
      setError("6 अंकों का सही PIN कोड डालें");
      return;
    }
    setPinBusy(true);
    setPinSuccess(false);
    setError(null);
    try {
      const result = await lookupPincode(pin);
      if (!result) {
        setError("PIN कोड नहीं मिला — कृपया ज़िला व राज्य नीचे सूची से चुनें");
        return;
      }
      setPincode(result.pincode);
      setState(result.state);
      const options = getDistrictsForState(result.state);
      const match =
        options.find((d) => d.toLowerCase() === result.district.toLowerCase()) ??
        options.find((d) => d.toLowerCase().includes(result.district.toLowerCase())) ??
        result.district;
      setDistrict(match);
      setPinSuccess(true);
      showToast(`${result.district}, ${result.state} — PIN से भरा ✓`, "success");
    } catch {
      setError("PIN lookup असफल — कृपया राज्य व ज़िला नीचे चुनें");
    } finally {
      setPinBusy(false);
    }
  };

  const finishLocation = () => {
    if (!village.trim() || !district.trim() || !state.trim()) {
      setError("गाँव/शहर, ज़िला और राज्य — सभी भरना आवश्यक है");
      return;
    }
    if (!isValidState(state.trim())) {
      setError("कृपया राज्य सूची में से चुनें");
      return;
    }
    if (!isValidDistrict(state.trim(), district.trim())) {
      setError("कृपया ज़िला सूची में से चुनें");
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
          pincode: pincode.replace(/\D/g, "").slice(0, 6) || undefined,
          phone: "",
          phoneVerified: false,
          totalFarmAreaAcres: totalAcres,
        };

    completeFarmSetup(profileData);
    markIntroDone();
    showToast("बधाई हो! आपका खेत सेटअप पूरा हुआ ✓", "success");
  };

  const setupIndex = SETUP_STEPS.findIndex((s) => s.id === step);
  const showStepper = step !== "auth";

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch justify-center overflow-hidden sm:items-center sm:p-4">
      {/* Dynamic Animated Organic Background */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#041a12] via-[#082b20] to-[#020e0a]">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -left-12 -top-12 h-96 w-96 rounded-full bg-emerald-500/20 blur-[90px]" />
        <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-lime-400/15 blur-[100px]" />
        <div className="absolute bottom-10 left-1/4 h-72 w-72 rounded-full bg-amber-400/10 blur-[80px]" />

        {/* Delicate Botanical Leaf SVG Pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10c-8 14-8 30 0 44 8-14 8-30 0-44z' fill='%2322c55e'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Main Glassmorphic Onboarding Modal */}
      <div
        role="dialog"
        aria-modal
        aria-label="Farmer onboarding"
        className="relative z-10 flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden border border-white/20 bg-white/85 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-all sm:h-auto sm:max-h-[min(92dvh,740px)] sm:rounded-[2rem] dark:border-white/10 dark:bg-[#0c241b]/90"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Header Bar */}
        <div className="relative border-b border-emerald-950/10 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 px-5 py-4 text-white shadow-sm dark:border-emerald-500/20 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md">
                <Sprout className="h-5 w-5 text-emerald-200" strokeWidth={2.5} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200/90">
                  AgriVeda
                </span>
                <h1 className="text-base font-black leading-tight tracking-tight sm:text-lg">
                  {step === "auth"
                    ? "किसान सारथी में स्वागत है"
                    : needsFarmSetup
                      ? "खेत व फसल सेटअप"
                      : "खेत प्रोफ़ाइल सेटअप"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-emerald-100 backdrop-blur-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>100% मुफ़्त</span>
            </div>
          </div>

          {/* Stepper (Steps 1, 2, 3) */}
          {showStepper && (
            <div className="mt-4 border-t border-white/15 pt-3">
              <div className="flex items-center justify-between gap-1">
                {SETUP_STEPS.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = needsFarmSetup ? idx === 2 : idx === setupIndex;
                  const isDone = needsFarmSetup ? idx < 2 : idx < setupIndex;

                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "flex flex-1 items-center gap-1.5 rounded-xl px-2 py-1.5 transition-all",
                        isActive
                          ? "bg-white/25 text-white shadow-xs font-black ring-1 ring-white/40"
                          : isDone
                            ? "bg-emerald-900/30 text-emerald-200"
                            : "text-white/50 opacity-60"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black",
                          isDone
                            ? "bg-emerald-400 text-emerald-950"
                            : isActive
                              ? "bg-white text-emerald-800"
                              : "bg-white/20 text-white"
                        )}
                      >
                        {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className="truncate text-xs font-bold">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div
          className={cn(
            "min-h-0 flex-1 space-y-4 px-5 pb-5 pt-3 sm:px-6 sm:pb-6",
            step === "farm" || step === "location"
              ? "overflow-y-auto overscroll-contain"
              : "overflow-hidden"
          )}
        >
          {/* STEP 1: AUTHENTICATION */}
          {step === "auth" && (
            <div className="space-y-4 pt-1">
              {/* Feature Highlights Grid */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-50 to-green-50/50 p-3.5 transition dark:border-emerald-500/20 dark:bg-emerald-950/20">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white">
                      एआई फसल डॉक्टर (AI Crop Doctor)
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                      पत्ते की फोटो खींचें — रोग व कीट का तुरंत पता और सही दवा की मात्रा पाएं।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-50 to-sky-50/50 p-3.5 transition dark:border-blue-500/20 dark:bg-blue-950/20">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                    <CloudSun className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white">
                      गाँव का मौसम व लाइव मंडी भाव
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                      बारिश व हवा की सटीक चेतावनी और नज़दीकी मंडियों के ताज़ा दैनिक भाव।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-50 to-yellow-50/50 p-3.5 transition dark:border-amber-500/20 dark:bg-amber-950/20">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-md shadow-amber-600/30">
                    <Tractor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white">
                      स्मार्ट खेत व फसल कैलेंडर
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                      खाद, स्प्रे रोटेशन, खरपतवार और सिंचाई की चरणबद्ध वैज्ञानिक सलाह।
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => void loginWithGoogle()}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-black text-gray-800 shadow-md transition hover:bg-gray-50 hover:shadow-lg active:scale-[0.99] disabled:opacity-50 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  ) : (
                    <GoogleGlyph />
                  )}
                  <span>Google से सुरक्षित लॉगिन करें</span>
                </button>

                {allowGuestContinue && (
                  <button
                    type="button"
                    onClick={continueAsGuest}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-600/40 bg-emerald-600/10 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-600/15 active:scale-[0.99] dark:text-emerald-300"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>सीधे ऐप देखें (Explore Demo Mode)</span>
                  </button>
                )}
              </div>

              {/* Privacy Trust Footer */}
              <div className="border-t border-gray-200/60 pt-3 text-center text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <p className="flex items-center justify-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  <Lock className="h-3.5 w-3.5" />
                  <span>किसान डेटा पूरी तरह निजी व सुरक्षित रहता है</span>
                </p>
                <p className="mt-1">
                  लॉगिन करके आप हमारे{" "}
                  <a href="/terms" className="font-bold underline hover:text-emerald-600">
                    नियम
                  </a>{" "}
                  और{" "}
                  <a href="/privacy" className="font-bold underline hover:text-emerald-600">
                    गोपनीयता नीति
                  </a>{" "}
                  से सहमत होते हैं।
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: NAME INPUT */}
          {step === "name" && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 dark:bg-emerald-950/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white">
                    नमस्ते किसान भाई! 🙏
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    कृपया अपना शुभ नाम दर्ज करें ताकि हम आपकी प्रोफ़ाइल तैयार कर सकें।
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-200">
                  आपका नाम (Full Name) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. रमेश सिंह, धरमेन्द्र चौहान..."
                    autoFocus
                    className="w-full rounded-2xl border-2 border-emerald-500/40 bg-white py-3.5 pl-11 pr-4 text-base font-bold text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                {email && (
                  <p className="mt-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    लॉगिन खाता: {email}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={finishName}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-700/25 transition hover:brightness-110 active:scale-[0.99]"
              >
                <span>स्थान चुनें (Next)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 3: LOCATION INPUT */}
          {step === "location" && (
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 dark:bg-blue-950/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-gray-900 dark:text-white">
                    आपका खेत कहाँ स्थित है? 📍
                  </h2>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300">
                    सटीक मौसम और नज़दीकी मंडी भाव आपके ज़िले के अनुसार सेट होंगे।
                  </p>
                </div>
              </div>

              {/* PIN Code Lookup */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-200">
                  PIN कोड (त्वरित भरें — 6 अंक)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setPinSuccess(false);
                      }}
                      placeholder="उदा. 462001"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-bold text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                    />
                    {pinSuccess && (
                      <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={pinBusy || pincode.length !== 6}
                    onClick={() => void handlePincodeLookup()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-emerald-800 active:scale-95 disabled:opacity-50"
                  >
                    {pinBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                    <span>खोजें</span>
                  </button>
                </div>
                {pinSuccess && (
                  <p className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    राज्य व ज़िला ऑटो-फिल हो गए ✓
                  </p>
                )}
              </div>

              {/* State & District Searchable Selects */}
              <div className="space-y-3">
                <SearchableSelect
                  label="राज्य (State)"
                  placeholder="अपना राज्य चुनें"
                  value={state}
                  onChange={handleStateChange}
                  options={INDIAN_STATES}
                  emptyHint="राज्य नहीं मिला"
                />

                <SearchableSelect
                  key={`onboard-district-${state}`}
                  label="ज़िला (District)"
                  placeholder={state ? "अपना ज़िला चुनें" : "पहले राज्य चुनें"}
                  value={district}
                  onChange={setDistrict}
                  options={districtOptions}
                  disabled={!isValidState(state)}
                  emptyHint="ज़िला नहीं मिला"
                />
              </div>

              {/* Village Input */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-200">
                  गाँव या शहर (Village / Town) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="अपने गाँव या कस्बे का नाम लिखें"
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("name")}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>पीछे</span>
                </button>
                <button
                  type="button"
                  onClick={finishLocation}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/20 transition hover:brightness-110 active:scale-[0.99]"
                >
                  <span>खेत व फसल जोड़ें</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: FARM & CROP SETUP */}
          {step === "farm" && (
            <div className="space-y-3 pt-1">
              {!needsFarmSetup && (
                <button
                  type="button"
                  onClick={() => setStep("location")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>स्थान बदलें</span>
                </button>
              )}
              <FarmSetupStep
                farmerName={needsFarmSetup ? profile.name : name}
                onComplete={finishFarmSetup}
                loading={loading}
              />
            </div>
          )}

          {/* General Error Banner */}
          {error && step !== "farm" && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-50 p-3 text-center text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
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
