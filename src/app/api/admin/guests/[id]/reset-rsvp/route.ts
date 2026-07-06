import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { getGuestById } from "@/services/guest.service";
import {
  deleteRsvpByInviteSlug,
  findRsvpByInviteSlug,
} from "@/services/rsvp.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;

  const { data: guest, error: lookupError } = await getGuestById(id);
  if (lookupError) {
    console.error("Guest lookup error:", lookupError);
    return NextResponse.json(
      { error: "Unable to reset RSVP." },
      { status: 500 },
    );
  }

  if (!guest) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  const { data: rsvp, error: rsvpLookupError } = await findRsvpByInviteSlug(
    guest.slug,
  );
  if (rsvpLookupError) {
    console.error("RSVP lookup error:", rsvpLookupError);
    return NextResponse.json(
      { error: "Unable to reset RSVP." },
      { status: 500 },
    );
  }

  if (!rsvp) {
    return NextResponse.json(
      { error: "This guest has not submitted an RSVP." },
      { status: 400 },
    );
  }

  const { error: deleteError } = await deleteRsvpByInviteSlug(guest.slug);
  if (deleteError) {
    console.error("Delete RSVP error:", deleteError);
    return NextResponse.json(
      { error: "Unable to reset RSVP." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
