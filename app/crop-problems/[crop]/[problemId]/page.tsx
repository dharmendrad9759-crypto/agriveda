import { Suspense } from "react";
import CropProblemDetailClient from "@/components/crop-problems/CropProblemDetailClient";
import PlantXrayClient from "@/components/crop-problems/plant-xray/PlantXrayClient";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";

export function generateStaticParams() {
  const base = CROP_PROBLEM_CROPS.flatMap((c) =>
    c.problems.map((p) => ({ crop: c.slug, problemId: p.id }))
  );
  const aliases = [
    { crop: "maize", problemId: "rust" },
    { crop: "maize", problemId: "shoot-fly" },
    { crop: "maize", problemId: "stem-fly" },
    { crop: "maize", problemId: "stem-borer" },
  ];
  return [...base, ...aliases];
}

export default async function CropProblemDetailPage({
  params,
}: {
  params: Promise<{ crop: string; problemId: string }>;
}) {
  const { crop, problemId } = await params;
  if (problemId === "xray") {
    return (
      <Suspense fallback={null}>
        <PlantXrayClient cropSlug={crop} />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={null}>
      <CropProblemDetailClient cropSlug={crop} problemId={problemId} />
    </Suspense>
  );
}
