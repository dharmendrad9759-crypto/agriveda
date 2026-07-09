import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; href: string };
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className={AV.sectionTitle}>{title}</h2>
      {action && (
        <AppLink href={action.href} className={AV.link}>
          {action.label} →
        </AppLink>
      )}
    </div>
  );
}
