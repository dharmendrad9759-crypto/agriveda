import Image from "next/image";

export default function SeedPacket({
  photo,
  cropLabel,
  englishName,
  hindiName,
  kind,
  large = false,
  compact = false,
}: {
  photo: string;
  cropLabel: string;
  englishName: string;
  hindiName: string;
  kind: "hybrid" | "shop" | "public";
  large?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#f6f1e6] ${large ? "rounded-2xl" : ""}`}
    >
      <div className="flex items-center justify-between bg-[#0B3D28] px-2.5 py-1">
        <p className="text-[10px] font-black tracking-[0.16em] text-[#f3e2b3]">AGRIVEDA</p>
        <p className={`text-[10px] font-black tracking-wide ${kind === "hybrid" ? "text-[#f3e2b3]" : "text-emerald-100"}`}>
          {kind === "hybrid" ? "HYBRID" : kind === "shop" ? "दुकान" : "सरकारी"}
        </p>
      </div>
      <div className={`flex items-center gap-2.5 px-2.5 ${compact ? "py-2" : large ? "py-4" : "py-3"}`}>
        <Image
          src={photo}
          alt=""
          width={compact ? 52 : large ? 96 : 72}
          height={compact ? 52 : large ? 96 : 72}
          quality={50}
          sizes="96px"
          className={`${compact ? "h-[52px] w-[52px]" : large ? "h-24 w-24" : "h-[4.5rem] w-[4.5rem]"} shrink-0 rounded-xl object-cover ring-2 ring-white shadow-sm`}
        />
        <div className="min-w-0 flex-1">
          <p className={`font-black uppercase leading-tight tracking-tight text-[#1a1814] ${compact ? "text-[15px]" : large ? "text-[22px]" : "text-[16px]"} line-clamp-2`}>
            {englishName}
          </p>
          <p className={`mt-0.5 font-bold leading-tight text-[#34584a] ${compact ? "text-[13px]" : large ? "text-[17px]" : "text-[14px]"} line-clamp-1`}>
            {hindiName}
          </p>
        </div>
      </div>
      {compact ? null : (
        <div className="border-t border-dashed border-[#c4b48a] bg-[#efe6d4] px-3 py-1">
          <p className="text-[11px] font-bold tracking-wide text-[#6b5430]">
            {cropLabel}
          </p>
        </div>
      )}
    </div>
  );
}
