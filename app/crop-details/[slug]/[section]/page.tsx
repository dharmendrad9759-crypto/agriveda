import { redirect, notFound } from "next/navigation";
import { CROP_SECTION_IDS } from "@/components/crop/CropCategoryGuide";
import { cropSectionRedirectUrl } from "@/lib/crops/crop-section-redirect";

interface Props {
  params: Promise<{ slug: string; section: string }>;
}

/** Legacy section route → unified crop tab */
export default async function CropSectionRedirectPage({ params }: Props) {
  const { slug, section } = await params;
  if (!CROP_SECTION_IDS.includes(section)) {
    notFound();
  }
  redirect(cropSectionRedirectUrl(slug, section));
}
