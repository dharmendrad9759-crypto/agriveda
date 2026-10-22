import CropProblemDetailClient from "@/components/crop-problems/CropProblemDetailClient";
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
  return <CropProblemDetailClient cropSlug={crop} problemId={problemId} />;
}
