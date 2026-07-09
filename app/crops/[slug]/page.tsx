import cropsData, { type Crop as CropData } from "@/data/crops";
import CropDetailClient from "@/components/crops/CropDetailClient";
import { isCropTabId, type CropTabId } from "@/lib/crops/crop-tabs";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

function CropDetailInner({
  crop,
  initialTab,
}: {
  crop: CropData;
  initialTab: CropTabId;
}) {
  return <CropDetailClient crop={crop} initialTab={initialTab} />;
}

export default async function CropDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const crop = cropsData.find((item): item is CropData => item.slug === slug);

  if (!crop) notFound();

  const initialTab: CropTabId = isCropTabId(tab) ? tab : "overview";

  return (
    <Suspense fallback={null}>
      <CropDetailInner crop={crop} initialTab={initialTab} />
    </Suspense>
  );
}
