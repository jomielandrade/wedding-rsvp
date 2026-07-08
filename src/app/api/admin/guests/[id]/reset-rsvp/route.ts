import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { getGuestById, setGuestStatusOverride } from "@/services/guest.service";
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

  const hasOverride = Boolean(guest.status_override);

  if (!rsvp && !hasOverride) {
    return NextResponse.json({ error: "No RSVP or override to reset." }, { status: 400 });
  }

  if (rsvp) {
    const { error: deleteError } = await deleteRsvpByInviteSlug(guest.slug);
    if (deleteError) {
      console.error("Delete RSVP error:", deleteError);
      return NextResponse.json(
        { error: "Unable to reset RSVP." },
        { status: 500 },
      );
    }
  }

  if (hasOverride) {
    const { error: overrideError } = await setGuestStatusOverride(id, null);
    if (overrideError) {
      console.error("Clear override error:", overrideError);
      return NextResponse.json(
        { error: "Unable to clear status override." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true, clearedOverride: hasOverride });
}
