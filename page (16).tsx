import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { menuItems, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import MenuItemCard from "@/components/MenuItemCard";
import {
  HOTEL_NAME,
  HOTEL_FULL_NAME,
  HOTEL_TAGLINE,
} from "@/lib/constants";
import {
  UtensilsCrossed,
  Truck,
  ShieldCheck,
  Star,
  Clock3,
  ArrowRight,
  Quote,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getPopularItems() {
  return db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isPopular, true))
    .orderBy(desc(menuItems.id))
    .limit(6);
}

async function getCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder);
}

const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: "Authentic Recipes",
    text: "Every dish follows Abhi's original family recipes, perfected over generations.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Hot, fresh meals delivered to your doorstep in 30-45 minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Hygienic Kitchen",
    text: "FSSAI-certified kitchen with the highest standards of cleanliness.",
  },
  {
    icon: Star,
    title: "5-Star Rated",
    text: "Loved by thousands of guests for consistent taste and quality.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rakesh Verma",
    role: "Regular Guest",
    text: "Abhiruchi's biryani is unmatched in the city. The aroma alone tells you it's made with love and authentic spices.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Food Blogger",
    text: "I've ordered dozens of times and the quality never dips. Abhi's team truly cares about every plate they send out.",
  },
  {
    name: "Farhan Sheikh",
    role: "Corporate Catering Client",
    text: "We booked dine-in for our office party and the hospitality plus food quality was outstanding. Highly recommended!",
  },
];

export default async function HomePage() {
  const [popularItems, categoryList] = await Promise.all([
    getPopularItems(),
    getCategories(),
  ]);

  return (
    <main>
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#1a0f0a]">
        <Image
          src="/images/hero-banner.jpg"
          alt="Signature feast at Abhiruchi"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-[#1a0f0a]/70 to-[#1a0f0a]/40" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              The One &amp; Only {HOTEL_NAME}
            </span>
            <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] text-amber-50">
              {HOTEL_FULL_NAME}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-amber-50/80">{HOTEL_TAGLINE}. Order royal, home-style
              Indian cuisine crafted by Abhi&apos;s kitchen &mdash; for delivery, takeaway, or a memorable dine-in evening.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#1a0f0a] transition hover:bg-amber-400"
              >
                Order Now <ArrowRight size={16} />
              </Link>
              <Link
                href="/track"
                className="flex items-center gap-2 rounded-full border border-amber-50/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-white/10"
              >
                Track My Order
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-8 text-amber-50/70">
              <div>
                <p className="font-serif text-3xl font-bold text-amber-400">15+</p>
                <p className="text-xs uppercase tracking-wide">Years of Legacy</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-amber-400">50k+</p>
                <p className="text-xs uppercase tracking-wide">Happy Guests</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-amber-400">4.8★</p>
                <p className="text-xs uppercase tracking-wide">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-amber-900/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <f.icon size={26} />
              </div>
              <h3 className="font-serif text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Explore</span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Our Menu Categories</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            From sizzling starters to indulgent desserts, discover every flavour Abhiruchi has to offer.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categoryList.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="relative z-10 p-3 font-serif text-sm font-semibold text-white sm:text-base">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR DISHES */}
      {popularItems.length > 0 && (
        <section className="bg-amber-50/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Guest Favourites</span>
                <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Bestselling Dishes</h2>
              </div>
              <Link href="/menu" className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900">
                View Full Menu <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-3xl shadow-xl sm:h-[26rem]">
            <Image src="/images/hero-banner.jpg" alt={`Inside ${HOTEL_NAME}`} fill className="object-cover" />
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Our Story</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              The Legacy of {HOTEL_NAME}
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              What began as Abhi&apos;s humble roadside kitchen has blossomed into {HOTEL_FULL_NAME} &mdash;
              a name synonymous with warmth, spice and soul in every dish. We blend time-honoured
              family recipes with fresh, locally-sourced ingredients to bring you a dining experience
              that feels like home, whether you eat with us or we deliver to you.
            </p>
            <div className="mt-8 flex items-center gap-3 text-amber-700">
              <Clock3 size={20} />
              <p className="text-sm font-medium">Open daily from 11:00 AM to 11:00 PM</p>
            </div>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a0f0a] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-amber-700"
            >
              Explore The Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#1a0f0a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">Testimonials</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-amber-50 sm:text-4xl">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-amber-50/10 bg-white/5 p-6">
                <Quote className="mb-4 text-amber-500" size={28} />
                <p className="text-amber-50/80">{t.text}</p>
                <div className="mt-6">
                  <p className="font-serif font-semibold text-amber-50">{t.name}</p>
                  <p className="text-xs text-amber-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#1a0f0a] sm:text-4xl">
            Craving Abhiruchi&apos;s Flavours?
          </h2>
          <p className="max-w-xl text-[#1a0f0a]/80">
            Order online now and get piping-hot food delivered straight to your door.
          </p>
          <Link
            href="/menu"
            className="rounded-full bg-[#1a0f0a] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-amber-50 transition hover:bg-black"
          >
            Order Food Now
          </Link>
        </div>
      </section>
    </main>
  );
}
