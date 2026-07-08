import { notFound } from "next/navigation";
import cropsData, { type Crop as CropData } from "@/data/crops";
import CropDetailClient from "@/components/crops/CropDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CropDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const crop = cropsData.find((item): item is CropData => item.slug === resolvedParams.slug);

  if (!crop) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0f1a] pb-8 font-sans text-[#f1f5f9] selection:bg-[#10b981]/30">
      <CropDetailClient crop={crop} />
    </main>
  );
}
