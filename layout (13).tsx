import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { HOTEL_FULL_NAME, HOTEL_TAGLINE } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${HOTEL_FULL_NAME} | Order Food Online`,
  description: `${HOTEL_FULL_NAME} - ${HOTEL_TAGLINE}. Order delicious, authentic Indian food online for delivery, takeaway or dine-in.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#fdf8f0] font-sans text-slate-900 antialiased">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
