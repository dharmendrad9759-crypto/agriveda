import cropsData from "@/data/crops";
import CropCarePageClient from "@/components/crops/CropCarePageClient";
import { parseCropCareTab } from "@/lib/crops/crop-care-href";
import { resolveCropOrStub } from "@/lib/crops/stubCrop";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string; tab: string }>;
}

export default async function CropCarePage({ params }: Props) {
  const { slug, tab: tabRaw } = await params;
  const crop = resolveCropOrStub(slug, cropsData);
  if (!crop) notFound();

  const tab = parseCropCareTab(tabRaw);
  if (!tab) redirect(`/crops/${slug}`);

  return <CropCarePageClient crop={crop} tab={tab} />;
}
