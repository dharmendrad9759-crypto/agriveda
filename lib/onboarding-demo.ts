import type { FarmerProfile } from "@/hooks/useFarmerProfile";

export const DEMO_FARMER_PROFILE: Pick<
  FarmerProfile,
  "phone" | "name" | "village" | "district" | "state" | "phoneVerified" | "onboardingComplete"
> = {
  phone: "9999999999",
  name: "Demo Kisan",
  village: "Demo Village",
  district: "Aligarh",
  state: "Uttar Pradesh",
  phoneVerified: true,
  onboardingComplete: true,
};

export function shouldAutoSkipOnboarding(): boolean {
  if (process.env.NEXT_PUBLIC_SKIP_ONBOARDING === "true") return true;
  if (typeof window === "undefined") return false;

  const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
  if (w.Capacitor?.isNativePlatform?.()) return true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Capacitor } = require("@capacitor/core") as typeof import("@capacitor/core");
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}
