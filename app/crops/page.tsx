import { crops } from "@/data/crops";
import CropsListingClient from "@/components/crops/CropsListingClient";
import CropsPageShell from "@/components/crops/CropsPageShell";
import { listCropsWithCatalogStubs } from "@/lib/crops/stubCrop";

export default function CropsPage() {
  const listingCrops = listCropsWithCatalogStubs(crops);

  return (
    <CropsPageShell>
      <CropsListingClient crops={listingCrops} />
    </CropsPageShell>
  );
}
