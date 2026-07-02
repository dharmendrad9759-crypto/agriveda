"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export default function PageHeader({ title, backHref = "/" }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#006432] text-white shadow-md">
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      </div>
    </header>
  );
}
