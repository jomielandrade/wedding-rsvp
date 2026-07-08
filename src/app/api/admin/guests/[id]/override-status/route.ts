import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { getGuestById, setGuestStatusOverride } from "@/services/guest.service";
import type { AttendanceStatus } from "@/types/wedding";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface OverrideBody {
  status?: AttendanceStatus;
}

function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return value === "attending" || value === "declining";
}

export async function POST(request: Request, { params }: RouteParams) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;
  const { data: guest, error: lookupError } = await getGuestById(id);

  if (lookupError) {
    console.error("Guest lookup error:", lookupError);
    return NextResponse.json(
      { error: "Unable to update guest status." },
      { status: 500 },
    );
  }

  if (!guest) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  let body: OverrideBody;
  try {
    body = (await request.json()) as OverrideBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isAttendanceStatus(body.status)) {
    return NextResponse.json(
      { error: "Status must be attending or declining." },
      { status: 400 },
    );
  }

  const { error } = await setGuestStatusOverride(id, body.status);
  if (error) {
    console.error("Override status error:", error);
    return NextResponse.json(
      { error: "Unable to update guest status." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
