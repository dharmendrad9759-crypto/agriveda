import { crops } from "@/data/crops";
import CropsListingClient from "@/components/crops/CropsListingClient";
import CropsPageShell from "@/components/crops/CropsPageShell";

export default function CropsPage() {
  return (
    <CropsPageShell>
      <CropsListingClient crops={crops} />
    </CropsPageShell>
  );
}
