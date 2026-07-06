import { NextResponse } from "next/server";
import { getGuestBySlug } from "@/lib/guests";
import { checkRateLimit } from "@/lib/rate-limit";
import { rsvpSchema } from "@/lib/validations/rsvp";
import {
  createRsvp,
  findRsvpByInviteSlug,
  isSupabaseConfigured,
  toRsvpInsertPayload,
} from "@/services/rsvp.service";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "RSVP is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many submissions. Please wait a few minutes and try again.",
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

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const guest = getGuestBySlug(parsed.data.inviteSlug);
  if (!guest) {
    return NextResponse.json(
      { error: "This invitation link is not valid." },
      { status: 403 },
    );
  }

  const maxGuests = guest.maxGuests ?? 1;
  if (
    parsed.data.attendance === "attending" &&
    parsed.data.guestCount > maxGuests
  ) {
    return NextResponse.json(
      {
        error: `This invitation allows up to ${maxGuests} guest${maxGuests === 1 ? "" : "s"}.`,
      },
      { status: 400 },
    );
  }

  const { data: existing, error: lookupError } = await findRsvpByInviteSlug(
    guest.slug,
  );

  if (lookupError) {
    console.error("RSVP lookup error:", lookupError);
    return NextResponse.json(
      { error: "Unable to process your RSVP. Please try again." },
      { status: 500 },
    );
  }

  if (existing) {
    return NextResponse.json(
      { error: "You have already submitted an RSVP for this invitation." },
      { status: 409 },
    );
  }

  const payload = toRsvpInsertPayload(parsed.data, guest);
  const { data, error } = await createRsvp(payload);

  if (error) {
    console.error("RSVP insert error:", error);
    return NextResponse.json(
      { error: "Unable to save your RSVP. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
