import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import SmartCropClient from "@/components/agriveda2/SmartCropClient";

export default function SmartCropPage() {
  return (
    <Agriveda2Shell
      title="Smart Crop सलाह"
      backHref="/dashboard"
    >
      <SmartCropClient />
    </Agriveda2Shell>
  );
}
