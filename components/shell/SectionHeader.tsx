import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; href: string };
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <h2 className={`${AV.sectionTitle} min-w-0 truncate`}>{title}</h2>
      {action && (
        <AppLink href={action.href} className={`shrink-0 ${AV.link}`}>
          {action.label} →
        </AppLink>
      )}
    </div>
  );
}
