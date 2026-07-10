import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  rounded?: "md" | "lg" | "full";
}

const roundedClass = {
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

export default function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "agriveda-shimmer bg-[var(--av-surface-inset)]",
        roundedClass[rounded],
        className
      )}
      aria-hidden
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="av-card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
