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

/** Only for local `next dev` — never auto-skip on Android / production. */
export function shouldAutoSkipOnboarding(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return process.env.NEXT_PUBLIC_SKIP_ONBOARDING === "true";
}
