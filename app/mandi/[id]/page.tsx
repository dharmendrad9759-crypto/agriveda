import MandiDetailClient from "@/components/mandi/MandiDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MandiDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <MandiDetailClient id={decodeURIComponent(id)} />;
}
