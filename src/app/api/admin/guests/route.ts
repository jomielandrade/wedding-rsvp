import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { guestFormSchema } from "@/lib/validations/guest";
import {
  createGuest,
  isSlugTaken,
  listAllGuests,
} from "@/services/guest.service";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { data, error } = await listAllGuests();
  if (error) {
    console.error("List guests error:", error);
    return NextResponse.json(
      { error: "Unable to load guests." },
      { status: 500 },
    );
  }

  return NextResponse.json({ guests: data ?? [] });
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

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

  const { taken, error: slugError } = await isSlugTaken(parsed.data.slug);
  if (slugError) {
    console.error("Slug lookup error:", slugError);
    return NextResponse.json(
      { error: "Unable to create guest." },
      { status: 500 },
    );
  }

  if (taken) {
    return NextResponse.json(
      { error: "This slug is already in use." },
      { status: 409 },
    );
  }

  const { data, error } = await createGuest(parsed.data);
  if (error) {
    console.error("Create guest error:", error);
    return NextResponse.json(
      { error: "Unable to create guest." },
      { status: 500 },
    );
  }

  return NextResponse.json({ guest: data }, { status: 201 });
}
