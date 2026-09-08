import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "abhi@123";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "abhiruchi-hotel-secret-key-2024";
export const ADMIN_COOKIE_NAME = "abhiruchi_admin_session";

function computeToken(): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${ADMIN_USERNAME}:admin-session`)
    .digest("hex");
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getAdminToken(): string {
  return computeToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return !!value && value === computeToken();
}
