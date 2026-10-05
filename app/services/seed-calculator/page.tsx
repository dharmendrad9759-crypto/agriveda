import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import SeedCalculatorClient from "@/components/agriveda2/SeedCalculatorClient";

export default function SeedCalculatorPage() {
  return (
    <Agriveda2Shell
      title="बीज कैलकुलेटर"
      backHref="/dashboard"
    >
      <SeedCalculatorClient />
    </Agriveda2Shell>
  );
}
