import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import CropProblemHub from "@/components/agriveda2/CropProblemHub";

export default function CropProblemPage() {
  return (
    <Agriveda2Shell
      title="समस्या → समाधान"
      subtitle="Crop → Problem → Solution → Doctor"
      backHref="/dashboard"
    >
      <CropProblemHub />
    </Agriveda2Shell>
  );
}
