import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 bg-[#fdf8f0] p-4 sm:p-8">{children}</div>
    </div>
  );
}
