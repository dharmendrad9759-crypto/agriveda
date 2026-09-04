import type { MandiRow } from "@/lib/mandi/types";

export function exportMandiCsv(rows: MandiRow[], filename = "mandi-prices.csv") {
  const header = ["Commodity", "Mandi", "District", "State", "Modal", "Min", "Max", "Grade", "Date"];
  const lines = rows.map((r) =>
    [
      r.crop,
      r.mandi,
      r.district ?? "",
      r.state,
      r.modal,
      r.min,
      r.max,
      r.variety || "FAQ",
      r.arrivalDate ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
