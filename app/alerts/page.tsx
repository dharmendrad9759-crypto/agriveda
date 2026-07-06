import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import AlertsHub from "@/components/agriveda2/AlertsHub";

export default function AlertsPage() {
  return (
    <Agriveda2Shell
      title="Predictive Alerts"
      subtitle="समस्या आने से पहले ऐप जगाएगा"
      backHref="/dashboard"
    >
      <AlertsHub />
    </Agriveda2Shell>
  );
}
