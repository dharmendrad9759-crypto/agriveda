import SchemeDetailClient from "@/components/schemes/SchemeDetailClient";
import { farmerSchemes } from "@/data/schemes/farmerSchemes";

export function generateStaticParams() {
  return farmerSchemes.map((s) => ({ id: s.id }));
}

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchemeDetailClient id={id} />;
}
