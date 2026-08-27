import cropsData, { type Crop as CropData } from "@/data/crops";
import CropDetailClient from "@/components/crops/CropDetailClient";
import { cropCareHref } from "@/lib/crops/crop-care-href";
import { isCropTabId } from "@/lib/crops/crop-tabs";
import { resolveCropOrStub } from "@/lib/crops/stubCrop";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

function CropDetailInner({ crop }: { crop: CropData }) {
  return <CropDetailClient crop={crop} />;
}

export default async function CropDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const crop = resolveCropOrStub(slug, cropsData);

  if (!crop) notFound();

  // Old ?tab= links → dedicated care page
  if (tab && isCropTabId(tab) && tab !== "overview") {
    redirect(cropCareHref(slug, tab));
  }

  return (
    <Suspense fallback={null}>
      <CropDetailInner crop={crop} />
    </Suspense>
  );
}
