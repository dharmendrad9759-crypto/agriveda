import { Suspense } from "react";
import PlantXrayClient from "@/components/crop-problems/plant-xray/PlantXrayClient";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";

export function generateStaticParams() {
  return CROP_PROBLEM_CROPS.map((c) => ({ crop: c.slug }));
}

export default async function PlantXrayPage({
  params,
}: {
  params: Promise<{ crop: string }>;
}) {
  const { crop } = await params;
  return (
    <Suspense fallback={null}>
      <PlantXrayClient cropSlug={crop} />
    </Suspense>
  );
}
