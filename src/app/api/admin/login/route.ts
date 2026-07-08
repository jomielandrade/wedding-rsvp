import { NextResponse } from "next/server";
import {
  createAdminSession,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/auth/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin dashboard is not configured." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`admin-login:${ip}`, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please wait a few minutes and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ success: true });
}
