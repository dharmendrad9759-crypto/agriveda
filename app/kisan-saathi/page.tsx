import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import KisanSaathiChat from "@/components/agriveda2/KisanSaathiChat";

export default function KisanSaathiPage() {
  return (
    <Agriveda2Shell
      title="Kisan Saathi"
      subtitle="मेरी फ़सल, मेरा डॉक्टर — 24/7 AI expert"
      backHref="/crop-problem"
    >
      <KisanSaathiChat />
    </Agriveda2Shell>
  );
}
