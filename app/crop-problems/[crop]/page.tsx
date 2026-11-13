import { Suspense } from "react";
import CropProblemGalleryClient from "@/components/crop-problems/CropProblemGalleryClient";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";

export function generateStaticParams() {
  return CROP_PROBLEM_CROPS.map((c) => ({ crop: c.slug }));
}

export default async function CropProblemCropPage({
  params,
}: {
  params: Promise<{ crop: string }>;
}) {
  const { crop } = await params;
  return (
    <Suspense fallback={null}>
      <CropProblemGalleryClient cropSlug={crop} />
    </Suspense>
  );
}
