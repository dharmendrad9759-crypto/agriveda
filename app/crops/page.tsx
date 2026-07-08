import { crops } from "@/data/crops";
import CropsListingClient from "@/components/crops/CropsListingClient";

export default function CropsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] font-sans text-[#f1f5f9] selection:bg-[#10b981]/30">
      <CropsListingClient crops={crops} />
    </main>
  );
}
