import { NextResponse } from "next/server";
import { getGuestBySlug } from "@/lib/guests";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { recordInviteOpen } from "@/services/guest.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`invite-open:${ip}:${slug}`, {
    maxRequests: 10,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const guest = await getGuestBySlug(slug);
  if (!guest) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await recordInviteOpen(slug);
  return NextResponse.json({ success: true });
}
