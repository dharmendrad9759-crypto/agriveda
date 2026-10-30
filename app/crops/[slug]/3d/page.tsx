import { notFound } from "next/navigation";
import cropsData from "@/data/crops";
import { resolveCropOrStub } from "@/lib/crops/stubCrop";
import WheatGermination3DViewerClient from "./Wheat3DClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Crop3DPage({ params }: Props) {
  const { slug } = await params;
  const crop = resolveCropOrStub(slug, cropsData);

  if (!crop) notFound();

  return (
    <main className="min-h-screen bg-[#030d0a] text-white">
      <WheatGermination3DViewerClient cropName={crop.name} cropSlug={slug} />
    </main>
  );
}
