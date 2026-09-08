export const HOTEL_NAME = "Abhiruchi";
export const HOTEL_FULL_NAME = "Hotel Abhiruchi";
export const HOTEL_TAGLINE = "Where Abhi's Passion Meets Royal Flavour";
export const HOTEL_PHONE = "+91 98765 43210";
export const HOTEL_EMAIL = "hello@abhiruchi.com";
export const HOTEL_ADDRESS = "12, MG Road, Abhinagar, Bengaluru, Karnataka 560001";

export const ORDER_TYPES = [
  { value: "delivery", label: "Home Delivery" },
  { value: "takeaway", label: "Takeaway" },
  { value: "dine-in", label: "Dine-In" },
] as const;

export type OrderType = (typeof ORDER_TYPES)[number]["value"];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
  preparing: "In The Kitchen",
  "out-for-delivery": "Out For Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-sky-100 text-sky-800 border-sky-300",
  preparing: "bg-orange-100 text-orange-800 border-orange-300",
  "out-for-delivery": "bg-indigo-100 text-indigo-800 border-indigo-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 border-rose-300",
};

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(num) ? num : 0);
}
