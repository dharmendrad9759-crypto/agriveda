import { Target } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import { AV } from "@/lib/design/tokens";

interface EtlGuideCardProps {
  etl?: string;
  pestName?: string;
  monitoring?: string;
  compact?: boolean;
}

export default function EtlGuideCard({ etl, pestName, monitoring, compact }: EtlGuideCardProps) {
  const threshold =
    etl ??
    "सप्ताह में दो बार निगरानी करें। स्प्रे (Spray) तभी करें जब कीट की संख्या आर्थिक क्षति स्तर (ETL — Economic Threshold Level) पार कर जाए — सिर्फ़ कैलेंडर से नहीं।";

  return (
    <DarkCard className={compact ? "p-3" : ""} delay={0}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
          <Target className="h-4 w-4 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={AV.sectionTitle}>
            {pestName ? `ETL — ${pestName}` : "आर्थिक क्षति स्तर (ETL — Economic Threshold Level)"}
          </h3>
          <p className={`mt-1 ${compact ? AV.micro : AV.body}`}>{threshold}</p>
          {monitoring && (
            <p className={`mt-2 ${AV.micro}`}>
              <span className="font-semibold text-[var(--av-text-primary)]">निगरानी:</span> {monitoring}
            </p>
          )}
          <ul className={`mt-2 space-y-1 ${AV.micro}`}>
            <li>• ETL से पहले स्प्रे (Spray) न करें — प्राकृतिक शत्रु बचे रहते हैं</li>
            <li>• पहाड़ी / मीटर पंक्ति / जाल में गिनती — खेत रिकॉर्ड रखें</li>
            <li>• दोहराए स्प्रे पर IRAC समूह बदलें</li>
          </ul>
        </div>
      </div>
    </DarkCard>
  );
}
