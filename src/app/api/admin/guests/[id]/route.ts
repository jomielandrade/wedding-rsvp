import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { guestFormSchema } from "@/lib/validations/guest";
import {
  deleteGuest,
  getGuestById,
  isSlugTaken,
  updateGuest,
} from "@/services/guest.service";
import { findRsvpByInviteSlug, deleteRsvpByInviteSlug } from "@/services/rsvp.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;

  const { data: existing, error: lookupError } = await getGuestById(id);
  if (lookupError) {
    console.error("Guest lookup error:", lookupError);
    return NextResponse.json(
      { error: "Unable to update guest." },
      { status: 500 },
    );
  }

  if (!existing) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = guestFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.slug !== existing.slug) {
    const { data: rsvp } = await findRsvpByInviteSlug(existing.slug);
    if (rsvp) {
      return NextResponse.json(
        {
          error:
            "Cannot change the invite link after a guest has submitted an RSVP.",
        },
        { status: 400 },
      );
    }

    const { taken, error: slugError } = await isSlugTaken(parsed.data.slug, id);
    if (slugError) {
      console.error("Slug lookup error:", slugError);
      return NextResponse.json(
        { error: "Unable to update guest." },
        { status: 500 },
      );
    }

    if (taken) {
      return NextResponse.json(
        { error: "This slug is already in use." },
        { status: 409 },
      );
    }
  }

  const { data, error } = await updateGuest(id, parsed.data);
  if (error) {
    console.error("Update guest error:", error);
    return NextResponse.json(
      { error: "Unable to update guest." },
      { status: 500 },
    );
  }

  return NextResponse.json({ guest: data });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;

  const { data: existing, error: lookupError } = await getGuestById(id);
  if (lookupError) {
    console.error("Guest lookup error:", lookupError);
    return NextResponse.json(
      { error: "Unable to delete guest." },
      { status: 500 },
    );
  }

  if (!existing) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  const { data: rsvp } = await findRsvpByInviteSlug(existing.slug);

  if (rsvp) {
    const { error: rsvpDeleteError } = await deleteRsvpByInviteSlug(existing.slug);
    if (rsvpDeleteError) {
      console.error("Delete RSVP error:", rsvpDeleteError);
      return NextResponse.json(
        { error: "Unable to delete guest RSVP." },
        { status: 500 },
      );
    }
  }

  const { error } = await deleteGuest(id);
  if (error) {
    console.error("Delete guest error:", error);
    return NextResponse.json(
      { error: "Unable to delete guest." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    deletedRsvp: Boolean(rsvp),
  });
}
