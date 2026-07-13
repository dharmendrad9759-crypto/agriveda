"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMO_FARMER_PROFILE, shouldAutoSkipOnboarding } from "@/lib/onboarding-demo";
import { readStorage, writeStorage } from "@/lib/storage";

export interface FarmerProfile {
  name: string;
  village: string;
  district: string;
  state: string;
  phone: string;
  phoneVerified: boolean;
  onboardingComplete: boolean;
  /** User completed farm/field setup after profile */
  farmSetupComplete: boolean;
  /** Total farm area in acres (from onboarding) */
  totalFarmAreaAcres?: number;
  firebaseUid?: string;
  /** ISO date strings keyed by crop slug */
  sowingDates: Record<string, string>;
}

const KEY = "agriveda-farmer-profile";

const DEFAULT: FarmerProfile = {
  name: "",
  village: "",
  district: "",
  state: "",
  phone: "",
  phoneVerified: false,
  onboardingComplete: false,
  farmSetupComplete: false,
  sowingDates: {},
};

function normalizeProfile(raw: Partial<FarmerProfile>): FarmerProfile {
  const onboardingComplete = Boolean(raw.onboardingComplete);
  return {
    ...DEFAULT,
    ...raw,
    sowingDates: raw.sowingDates ?? {},
    phoneVerified: Boolean(raw.phoneVerified),
    onboardingComplete,
    farmSetupComplete: Boolean(raw.farmSetupComplete ?? onboardingComplete),
  };
}

function loadProfileFromStorage(): FarmerProfile {
  if (typeof window === "undefined") return DEFAULT;

  const stored = normalizeProfile(readStorage(KEY, DEFAULT));
  if (stored.onboardingComplete) return stored;

  if (shouldAutoSkipOnboarding()) {
    const demo = normalizeProfile({ ...stored, ...DEMO_FARMER_PROFILE });
    writeStorage(KEY, demo);
    return demo;
  }

  return stored;
}

export function useFarmerProfile() {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfileFromStorage());
    setHydrated(true);
  }, []);

  const saveProfile = useCallback((next: Partial<FarmerProfile>) => {
    setProfile((prev) => {
      const merged = normalizeProfile({ ...prev, ...next });
      writeStorage(KEY, merged);
      return merged;
    });
  }, []);

  const completeOnboarding = useCallback((next: Partial<FarmerProfile>) => {
    saveProfile({
      ...next,
      phoneVerified: true,
      onboardingComplete: true,
      farmSetupComplete: next.farmSetupComplete ?? true,
    });
  }, [saveProfile]);

  const completeFarmSetup = useCallback(
    (next: Partial<FarmerProfile>) => {
      saveProfile({
        ...next,
        farmSetupComplete: true,
        onboardingComplete: true,
        phoneVerified: next.phoneVerified ?? true,
      });
    },
    [saveProfile]
  );

  const setSowingDate = useCallback((cropSlug: string, date: string) => {
    setProfile((prev) => {
      const merged = {
        ...prev,
        sowingDates: { ...prev.sowingDates, [cropSlug]: date },
      };
      writeStorage(KEY, merged);
      return merged;
    });
  }, []);

  return { profile, hydrated, saveProfile, completeOnboarding, completeFarmSetup, setSowingDate };
}
