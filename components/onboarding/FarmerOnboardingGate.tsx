"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Phone, ShieldCheck, User } from "lucide-react";
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

type Step = "phone" | "otp" | "profile";

const SKIP_ONBOARDING = process.env.NEXT_PUBLIC_SKIP_ONBOARDING === "true";

const DEMO_PROFILE = {
  phone: "9999999999",
  name: "Demo Kisan",
  village: "Demo Village",
  district: "Aligarh",
  state: "Uttar Pradesh",
};

export default function FarmerOnboardingGate({ children }: { children: React.ReactNode }) {
  const { profile, hydrated, completeOnboarding } = useFarmerProfile();
  const { showToast } = useToast();
  const useFirebase = isFirebaseConfigured();

  const [step, setStep] = useState<Step>("phone");
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

  const skipForDev = () => {
    completeOnboarding(DEMO_PROFILE);
    showToast("Demo mode — dashboard khula hai 🌾");
  };

  useEffect(() => {
    if (!hydrated || profile.onboardingComplete || !SKIP_ONBOARDING) return;
    completeOnboarding(DEMO_PROFILE);
  }, [hydrated, profile.onboardingComplete, completeOnboarding]);

  if (!hydrated || profile.onboardingComplete) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "OTP नहीं भेजा जा सका");

      if (body.demoOtp) setDemoOtp(String(body.demoOtp));
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
      if (useFirebase) {
        const user = await verifyFirebasePhoneOtp(otp);
        setFirebaseUid(user.uid);
        setStep("profile");
        showToast("मोबाइल verify हो गया ✓");
        return;
      }

      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "OTP verify नहीं hua");

      setStep("profile");
      showToast("मोबाइल verify हो गया ✓");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP गलत है");
    } finally {
      setLoading(false);
    }
  };

  const finishProfile = () => {
    if (!name.trim()) {
      setError("कृपया अपना नाम लिखें");
      return;
    }
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

    completeOnboarding({
      phone: phone.replace(/\D/g, "").slice(-10),
      firebaseUid: firebaseUid ?? undefined,
      name: name.trim(),
      village: village.trim(),
      district: district.trim(),
      state: state.trim(),
    });
    showToast("स्वागत है, किसान भाई! 🌾");
  };

  return (
    <>
      {children}
      <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-4 sm:items-center">
        <div
          role="dialog"
          aria-modal
          aria-label="Farmer registration"
          className="w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/25 bg-[var(--background)] shadow-2xl"
        >
          <div className="border-b border-emerald-500/15 bg-emerald-600 px-6 py-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-100">
              Agriveda
            </p>
            <h2 className="mt-1 text-xl font-black">किसान पंजीकरण</h2>
            <p className="mt-1 text-sm text-emerald-50/90">
              {step === "phone" && "पहले मोबाइल नंबर verify करें"}
              {step === "otp" && "SMS OTP डालकर verify करें"}
              {step === "profile" && "अपनी जानकारी भरें"}
            </p>
          </div>

          <div className="space-y-4 p-6">
            {/* Firebase invisible reCAPTCHA */}
            <div id={RECAPTCHA_CONTAINER_ID} className="min-h-px" />

            {step === "phone" && (
              <>
                {!useFirebase && (
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                    Firebase config नहीं मिला — टेस्ट OTP mode चलेगा। `.env.local` में Firebase keys
                    add करें।
                  </p>
                )}
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-bold theme-text-muted">
                    <Phone className="h-4 w-4" />
                    मोबाइल नंबर
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10 अंकों का नंबर"
                    className="theme-input w-full rounded-2xl border px-4 py-3 text-lg font-bold tracking-widest outline-none focus:border-emerald-500"
                  />
                </label>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading || phone.length !== 10}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  OTP भेजें
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <p className="text-sm theme-text-muted">
                  +91 {phone} पर OTP भेजा गया
                </p>
                {demoOtp && (
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-sm font-bold text-amber-700 dark:text-amber-300">
                    टेस्ट OTP: {demoOtp}
                  </p>
                )}
                {useFirebase && (
                  <p className="text-[11px] theme-text-muted">
                    Firebase test number ho to Console में set kiya hua OTP daalein.
                  </p>
                )}
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-bold theme-text-muted">
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
                    className="theme-input w-full rounded-2xl border px-4 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-emerald-500"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold theme-text-muted dark:border-white/10"
                  >
                    वापस
                  </button>
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Verify करें
                  </button>
                </div>
              </>
            )}

            {step === "profile" && (
              <>
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-xs font-bold theme-text-muted">
                    <User className="h-4 w-4" />
                    नाम
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="आपका नाम"
                    className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 text-xs font-bold theme-text-muted">गाँव</span>
                  <input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="अपने गाँव का नाम"
                    className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                </label>
                <SearchableSelect
                  label="राज्य"
                  placeholder="राज्य search करें (जैसे Uttar Pradesh)"
                  value={state}
                  onChange={handleStateChange}
                  options={INDIAN_STATES}
                  emptyHint="राज्य नहीं मिला — English में नाम लिखकर search करें"
                />
                <SearchableSelect
                  key={`onboard-district-${state}`}
                  label="ज़िला"
                  placeholder={
                    state ? "ज़िला search करें (जैसे Aligarh)" : "पहले राज्य चुनें"
                  }
                  value={district}
                  onChange={setDistrict}
                  options={districtOptions}
                  disabled={!isValidState(state)}
                  emptyHint="ज़िला नहीं मिला — English में नाम लिखकर search करें"
                />
                <button
                  type="button"
                  onClick={finishProfile}
                  className="w-full rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white"
                >
                  शुरू करें
                </button>
              </>
            )}

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={skipForDev}
                className="w-full rounded-2xl border border-dashed border-gray-300 py-2.5 text-xs font-bold theme-text-muted hover:border-emerald-500 hover:text-emerald-700 dark:border-white/20"
              >
                बाद में — पहले dashboard देखें (dev skip)
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
