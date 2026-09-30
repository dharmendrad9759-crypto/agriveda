export default function SeedPacket({
  photo,
  cropLabel,
  englishName,
  hindiName,
  kind,
  large = false,
}: {
  photo: string;
  cropLabel: string;
  englishName: string;
  hindiName: string;
  kind: "hybrid" | "shop" | "public";
  large?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#f6f1e6] ${large ? "rounded-2xl" : ""}`}
    >
      <div className="flex items-center justify-between bg-[#0B3D28] px-3 py-1.5">
        <p className="text-[11px] font-black tracking-[0.18em] text-[#f3e2b3]">AGRIVEDA</p>
        <p className="text-[12px] font-bold text-white">{cropLabel}</p>
      </div>
      <div className={`flex gap-3 px-3 ${large ? "py-4" : "py-3"}`}>
        <img
          src={photo}
          alt=""
          className={`${large ? "h-24 w-24" : "h-[4.5rem] w-[4.5rem]"} shrink-0 rounded-2xl object-cover ring-2 ring-white shadow-sm`}
        />
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-black tracking-[0.14em] ${kind === "hybrid" ? "text-[#8a6412]" : "text-emerald-800"}`}>
            {kind === "hybrid" ? "HYBRID" : kind === "shop" ? "दुकान का बीज" : "सार्वजनिक बीज"}
          </p>
          <p className={`font-black uppercase leading-tight tracking-tight text-[#1a1814] ${large ? "text-[22px]" : "text-[16px]"} line-clamp-2`}>
            {englishName}
          </p>
          <p className={`mt-0.5 font-bold leading-tight text-[#34584a] ${large ? "text-[17px]" : "text-[14px]"} line-clamp-2`}>
            {hindiName}
          </p>
        </div>
      </div>
      <div className="border-t border-dashed border-[#c4b48a] bg-[#efe6d4] px-3 py-1">
        <p className="text-[11px] font-bold tracking-wide text-[#6b5430]">बीज पैकेट</p>
      </div>
    </div>
  );
}
