import { redirect } from "next/navigation";
import { getCropDashboard } from "@/data/crop-dashboard";
import { cropsData } from "@/data/crops";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Legacy route → unified crop detail */
export default async function CropDetailsRedirectPage({ params }: Props) {
  const { slug } = await params;
  const exists = cropsData.some((c) => c.slug === slug) || getCropDashboard(slug);
  if (!exists) {
    redirect("/crops");
  }
  redirect(`/crops/${slug}`);
}
