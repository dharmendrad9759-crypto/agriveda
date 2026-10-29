import { Suspense } from "react";
import FieldDetailClient from "@/components/farm/FieldDetailClient";

interface PageProps {
  params: Promise<{ fieldId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function FieldDetailPage({ params, searchParams }: PageProps) {
  const { fieldId } = await params;
  const { tab } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--av-surface-inset)] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500">खेत लोड हो रहा है...</p>
          </div>
        </div>
      }
    >
      <FieldDetailClient fieldId={fieldId} initialTab={tab} />
    </Suspense>
  );
}
