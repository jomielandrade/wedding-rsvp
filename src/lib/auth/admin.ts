import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "wedding_admin_session";
const SESSION_SALT = "wedding-admin-v1";

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminPassword());
}

function getSessionToken(): string {
  const password = getAdminPassword();
  if (!password) return "";
  return createHmac("sha256", password).update(SESSION_SALT).digest("hex");
}

function hashPassword(password: string): Buffer {
  return createHmac("sha256", "wedding-admin-password-check")
    .update(password)
    .digest();
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;

  const provided = hashPassword(password);
  const target = hashPassword(expected);
  return timingSafeEqual(provided, target);
}

function verifySessionToken(token: string): boolean {
  const expected = getSessionToken();
  if (!expected || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAdminAuth(): Promise<NextResponse | null> {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin dashboard is not configured." },
      { status: 503 },
    );
  }

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}
