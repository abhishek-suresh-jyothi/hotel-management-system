"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { HOTEL_NAME } from "@/lib/constants";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/track", label: "Track Order" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#1a0f0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a0f0a]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-amber-500/70">
            <Image src="/images/logo-emblem.png" alt={`${HOTEL_NAME} logo`} fill className="object-cover" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-bold tracking-wide text-amber-50">{HOTEL_NAME}</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-500">Grand Hotel &amp; Kitchen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-amber-400 ${
                pathname === link.href ? "text-amber-400" : "text-amber-50/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-[#1a0f0a]">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="rounded-md p-2 text-amber-50 md:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-amber-900/20 bg-[#1a0f0a] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base font-medium ${
                  pathname === link.href ? "text-amber-400" : "text-amber-50/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
