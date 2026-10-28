import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import KccCalculatorClient from "@/components/agriveda2/KccCalculatorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KCC ब्याज व लोन कैलकुलेटर — 4% रियायती ब्याज व ट्रैक्टर EMI | Agriveda",
  description:
    "किसान क्रेडिट कार्ड (KCC) 7% में 3% समय पर भुगतान छूट (शुद्ध 4% ब्याज) और सीधी बचत की गणना करें। ट्रैक्टर, डेयरी व सोलर पंप लोन EMI निकालें।",
};

export default function KccCalculatorPage() {
  return (
    <Agriveda2Shell
      title="KCC व लोन कैलकुलेटर"
      backHref="/dashboard"
    >
      <KccCalculatorClient />
    </Agriveda2Shell>
  );
}
