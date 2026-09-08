"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, UtensilsCrossed, LogOut, Home } from "lucide-react";
import { HOTEL_NAME } from "@/lib/constants";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-amber-900/10 bg-[#1a0f0a] p-4 md:h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
      <div className="mb-6 px-2">
        <p className="font-serif text-xl font-bold text-amber-50">{HOTEL_NAME}</p>
        <p className="text-xs uppercase tracking-wide text-amber-500">Admin Panel</p>
      </div>
      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-amber-500 text-[#1a0f0a]" : "text-amber-50/80 hover:bg-white/10"
              }`}
            >
              <Icon size={18} /> {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex flex-col gap-1 border-t border-amber-50/10 pt-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-50/80 hover:bg-white/10">
          <Home size={18} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-300 hover:bg-white/10"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
