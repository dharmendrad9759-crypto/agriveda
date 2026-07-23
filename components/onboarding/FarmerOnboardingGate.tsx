"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Languages, Loader2, Phone, ShieldCheck, User } from "lucide-react";
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
import {
  hasLocaleBeenPicked,
  useLocale,
} from "@/components/i18n/LocaleProvider";
import type { AppLocale } from "@/lib/i18n/farmer-ui";
import { applyPageTranslation, TRANSLATE_LANGUAGES } from "@/lib/translator";
import { cn } from "@/lib/cn";

type Step = "language" | "phone" | "otp" | "profile" | "farm";

const LANG_OPTIONS: {
  locale: AppLocale;
  labelKey: "english" | "hindi" | "langHinglish";
  hintKey: "langEnglishHint" | "langHindiHint" | "langHinglishHint";
}[] = [
  { locale: "en", labelKey: "english", hintKey: "langEnglishHint" },
  { locale: "hi", labelKey: "hindi", hintKey: "langHindiHint" },
  { locale: "hinglish", labelKey: "langHinglish", hintKey: "langHinglishHint" },
];

export default function FarmerOnboardingGate({ children }: { children: React.ReactNode }) {
  const { profile, hydrated, completeOnboarding, completeFarmSetup } = useFarmerProfile();
  const { locale, setLocale, t, tf } = useLocale();
  const { showToast } = useToast();
  const useFirebase = isFirebaseConfigured();
  /** Preview/production without Firebase+SMS — allow entering the app to see home. */
  const allowGuestContinue = !useFirebase || process.env.NODE_ENV === "development";

  const needsFarmSetup = profile.onboardingComplete && !profile.farmSetupComplete;
  const needsFullOnboarding = !profile.onboardingComplete;

  const [step, setStep] = useState<Step | null>(null);
  const [pendingLocale, setPendingLocale] = useState<AppLocale | null>(null);
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

  /** Skip OTP + farm form and open home immediately (demo / no-SMS preview). */
  const continueWithoutOtp = () => {
    completeFarmSetup({
      ...DEMO_FARMER_PROFILE,
      phone: phone.replace(/\D/g, "").slice(-10) || DEMO_FARMER_PROFILE.phone,
      farmSetupComplete: true,
      totalFarmAreaAcres: 5,
    });
    showToast(t("onboardDemoOpened"));
  };

  useEffect(() => {
    if (!hydrated) return;
    if (needsFarmSetup) {
      setStep("farm");
      return;
    }
    if (needsFullOnboarding && !hasLocaleBeenPicked()) {
      setStep("language");
      setPendingLocale(locale);
      return;
    }
    if (needsFullOnboarding) {
      setStep((prev) => (prev === null || prev === "language" ? "phone" : prev));
    }
  }, [hydrated, needsFarmSetup, needsFullOnboarding, locale]);

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

  if (!hydrated) {
    return <>{children}</>;
  }

  if (!showGate) {
    return <>{children}</>;
  }

  // Gate is required but step not resolved yet — avoid flashing the main app
  if (step === null) {
    return null;
  }

  const applyChosenLocale = (next: AppLocale) => {
    setLocale(next);
    if (next === "hi") {
      const hi = TRANSLATE_LANGUAGES.find((l) => l.code === "hi");
      if (hi) {
        applyPageTranslation(hi);
        return;
      }
    }
    if (next === "en") {
      const en = TRANSLATE_LANGUAGES.find((l) => l.code === "en");
      if (en) applyPageTranslation(en);
    }
  };

  const confirmLanguage = () => {
    const next = pendingLocale ?? locale;
    setError(null);
    // Persist + optional Google Translate reload; after reload lang is picked → phone step
    applyChosenLocale(next);
    if (next === "hinglish") {
      setStep("phone");
      return;
    }
    // en/hi trigger reload via applyPageTranslation; if cookie already set, continue
    setStep("phone");
  };

  const sendOtp = async () => {
    setError(null);
    setLoading(true);
    setDemoOtp(null);

    try {
      if (useFirebase) {
        await sendFirebasePhoneOtp(phone);
        setStep("otp");
        showToast(t("onboardFirebaseOtpSent"));
        return;
      }

      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || t("onboardErrOtpSend"));

      if (body.demoOtp && process.env.NODE_ENV === "development") {
        setDemoOtp(String(body.demoOtp));
      }
      setStep("otp");
      showToast(t("onboardOtpSentToast"));
    } catch (err) {
      setError(
        useFirebase
          ? firebaseAuthError(err)
          : err instanceof Error
            ? err.message
            : t("onboardErrOtpSend")
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
          throw new Error(sessionBody.error || t("onboardErrOtpVerify"));
        }
        setFirebaseUid(user.uid);
        setStep("profile");
        showToast(t("onboardVerified"));
        return;
      }

      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, deviceId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || t("onboardErrOtpVerify"));

      setStep("profile");
      showToast(t("onboardVerified"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("onboardErrOtpWrong"));
    } finally {
      setLoading(false);
    }
  };

  const finishProfile = () => {
    if (!name.trim()) {
      setError(t("onboardErrName"));
      return;
    }
    if (!village.trim() || !district.trim() || !state.trim()) {
      setError(t("onboardErrLocation"));
      return;
    }
    if (!isValidState(state.trim())) {
      setError(t("onboardErrState"));
      return;
    }
    if (!isValidDistrict(state.trim(), district.trim())) {
      setError(t("onboardErrDistrict"));
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
    showToast(t("onboardWelcome"));
  };

  const stepTitle =
    step === "language"
      ? t("langStepSubtitle")
      : step === "phone"
        ? t("onboardPhoneTitle")
        : step === "otp"
          ? t("onboardOtpTitle")
          : step === "profile"
            ? t("onboardProfileTitle")
            : t("onboardFarmTitle");

  const stepHeading =
    step === "farm" || needsFarmSetup ? t("onboardFarmHeading") : t("onboardHeading");

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-[#030712] p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal
        aria-label={t("onboardAriaLabel")}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-emerald-500/25 bg-[var(--background)] shadow-2xl"
      >
        <div className="border-b border-emerald-500/15 bg-emerald-600 px-6 py-5 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-100">
            Agriveda
          </p>
          <h2 className="mt-1 text-xl font-black">
            {step === "language" ? t("chooseLanguage") : stepHeading}
          </h2>
          <p className="mt-1 text-sm text-emerald-50/90">{stepTitle}</p>
        </div>

        <div className="space-y-4 p-6">
          <div id={RECAPTCHA_CONTAINER_ID} className="min-h-px" />

          {step === "language" && (
            <>
              <div className="flex items-center gap-2 text-sm font-bold theme-text-primary">
                <Languages className="h-4 w-4 text-emerald-500" />
                {t("langStepTitle")}
              </div>
              <ul className="space-y-2">
                {LANG_OPTIONS.map((opt) => {
                  const selected = (pendingLocale ?? locale) === opt.locale;
                  return (
                    <li key={opt.locale}>
                      <button
                        type="button"
                        onClick={() => setPendingLocale(opt.locale)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-bold transition",
                          selected
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "border-[var(--av-border)] theme-text-primary hover:bg-emerald-500/10"
                        )}
                      >
                        <span>
                          {t(opt.labelKey)}
                          <span className="mt-0.5 block text-[10px] font-medium theme-text-muted">
                            {t(opt.hintKey)}
                          </span>
                        </span>
                        {selected && <Check className="h-4 w-4 text-emerald-500" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={confirmLanguage}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white"
              >
                {t("langContinue")}
              </button>
            </>
          )}

          {step === "phone" && (
            <>
              {!useFirebase && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                  {t("onboardFirebaseFallback")}
                </p>
              )}
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold theme-text-muted">
                  <Phone className="h-4 w-4" />
                  {t("onboardPhoneLabel")}
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder={t("onboardPhonePlaceholder")}
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
                {t("onboardSendOtp")}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-sm theme-text-muted">
                {tf("onboardOtpSent", { phone })}
              </p>
              {demoOtp && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-sm font-bold text-amber-700 dark:text-amber-300">
                  {tf("onboardTestOtp", { otp: demoOtp })}
                </p>
              )}
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold theme-text-muted">
                  <ShieldCheck className="h-4 w-4" />
                  {t("onboardOtpLabel")}
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
                  {t("back")}
                </button>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3 text-sm font-black text-white disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("onboardVerify")}
                </button>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-bold theme-text-muted">
                  <User className="h-4 w-4" />
                  {t("onboardNameLabel")}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("onboardNamePlaceholder")}
                  className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block">
                <span className="mb-1 text-xs font-bold theme-text-muted">
                  {t("onboardVillageLabel")}
                </span>
                <input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t("onboardVillagePlaceholder")}
                  className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              </label>
              <SearchableSelect
                label={t("stateLabel")}
                placeholder={t("statePlaceholder")}
                value={state}
                onChange={handleStateChange}
                options={INDIAN_STATES}
                emptyHint={t("statePlaceholder")}
              />
              <SearchableSelect
                key={`onboard-district-${state}`}
                label={t("districtLabel")}
                placeholder={
                  state ? t("districtPlaceholder") : t("districtSelectStateFirst")
                }
                value={district}
                onChange={setDistrict}
                options={districtOptions}
                disabled={!isValidState(state)}
                emptyHint={t("districtPlaceholder")}
              />
              <button
                type="button"
                onClick={finishProfile}
                className="w-full rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white"
              >
                {t("onboardContinueFarm")}
              </button>
            </>
          )}

          {step === "farm" && (
            <FarmSetupStep
              farmerName={needsFarmSetup ? profile.name : name}
              onComplete={finishFarmSetup}
              loading={loading}
            />
          )}

          {error && step !== "farm" && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm font-semibold text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {allowGuestContinue && step !== "farm" && step !== "language" && !needsFarmSetup && (
            <button
              type="button"
              onClick={continueWithoutOtp}
              className="w-full rounded-2xl border border-dashed border-emerald-400/50 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300"
            >
              {t("onboardGuestContinue")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
