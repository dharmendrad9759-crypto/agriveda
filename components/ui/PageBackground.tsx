import AppPremiumBackground from "@/components/ui/AppPremiumBackground";

/** Unified page background — always uses clean premium agritech style */
export default function PageBackground({ premium: _premium = false }: { premium?: boolean }) {
  return <AppPremiumBackground />;
}
