import type { ReactNode } from "react";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import "./admin-cinematic.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-cine">
      <AdminAtmosphere />
      <div className="admin-cine__content">{children}</div>
    </div>
  );
}
