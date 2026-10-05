import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import KisanSaathiChat from "@/components/agriveda2/KisanSaathiChat";

export default function KisanSaathiPage() {
  return (
    <Agriveda2Shell
      title="किसान साथी"
      backHref="/crop-problems"
    >
      <KisanSaathiChat />
    </Agriveda2Shell>
  );
}
