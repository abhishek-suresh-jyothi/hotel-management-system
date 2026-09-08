import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  HOTEL_NAME,
  HOTEL_FULL_NAME,
  HOTEL_ADDRESS,
  HOTEL_PHONE,
  HOTEL_EMAIL,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-amber-900/10 bg-[#1a0f0a] text-amber-50/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-50">{HOTEL_NAME}</h3>
          <p className="mt-3 text-sm leading-relaxed text-amber-50/60">
            {HOTEL_FULL_NAME} brings Abhi&apos;s family recipes to your table &mdash;
            an unmistakable name for royal, home-style Indian dining and doorstep delivery.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
            <li><Link href="/menu" className="hover:text-amber-400">Our Menu</Link></li>
            <li><Link href="/cart" className="hover:text-amber-400">My Cart</Link></li>
            <li><Link href="/track" className="hover:text-amber-400">Track Order</Link></li>
            <li><Link href="/admin/login" className="hover:text-amber-400">Staff Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-amber-500" /> {HOTEL_ADDRESS}</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-amber-500" /> {HOTEL_PHONE}</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-amber-500" /> {HOTEL_EMAIL}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">
            Kitchen Hours
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Clock size={16} className="text-amber-500" /> Mon &ndash; Sun</li>
            <li>11:00 AM &ndash; 11:00 PM</li>
            <li className="pt-2 text-amber-50/60">Delivery, Takeaway &amp; Dine-In available every day.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-amber-900/10 py-5 text-center text-xs text-amber-50/40">
        © {new Date().getFullYear()} {HOTEL_FULL_NAME}. All rights reserved. Crafted with love for Abhi&apos;s guests.
      </div>
    </footer>
  );
}
