import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeading({ title, subtitle, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-lg font-extrabold tracking-tight theme-text-primary">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs font-medium theme-text-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
