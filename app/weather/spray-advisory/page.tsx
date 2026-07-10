import SprayAdvisoryShell from "@/components/weather/SprayAdvisoryShell";

export const metadata = {
  title: "Spray & Spread Advisory | Agriveda",
  description: "Live spray window status, tank-mix compatibility, and IRAC/FRAC control recommendations.",
};

export default function SprayAdvisoryPage() {
  return <SprayAdvisoryShell />;
}
