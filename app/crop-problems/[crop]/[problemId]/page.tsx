import CropProblemDetailClient from "@/components/crop-problems/CropProblemDetailClient";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";

export function generateStaticParams() {
  return CROP_PROBLEM_CROPS.flatMap((c) =>
    c.problems.map((p) => ({ crop: c.slug, problemId: p.id }))
  );
}

export default async function CropProblemDetailPage({
  params,
}: {
  params: Promise<{ crop: string; problemId: string }>;
}) {
  const { crop, problemId } = await params;
  return <CropProblemDetailClient cropSlug={crop} problemId={problemId} />;
}
