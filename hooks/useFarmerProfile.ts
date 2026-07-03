"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export interface FarmerProfile {
  name: string;
  village: string;
  district: string;
  state: string;
  phone: string;
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
  sowingDates: {},
};

export function useFarmerProfile() {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(readStorage(KEY, DEFAULT));
    setHydrated(true);
  }, []);

  const saveProfile = useCallback((next: Partial<FarmerProfile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...next };
      writeStorage(KEY, merged);
      return merged;
    });
  }, []);

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

  return { profile, hydrated, saveProfile, setSowingDate };
}
