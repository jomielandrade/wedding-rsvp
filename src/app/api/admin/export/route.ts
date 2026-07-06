import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import {
  buildGuestRows,
  toExportRows,
} from "@/services/admin.service";
import { listAllGuests } from "@/services/guest.service";
import { listAllRsvps } from "@/services/rsvp.service";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "xlsx";

  const [{ data: guestRecords, error: guestsError }, { data: rsvps, error: rsvpsError }] =
    await Promise.all([listAllGuests(), listAllRsvps()]);

  if (guestsError || rsvpsError) {
    console.error("Export error:", guestsError ?? rsvpsError);
    return NextResponse.json(
      { error: "Unable to export RSVPs." },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const guests = buildGuestRows(guestRecords ?? [], rsvps ?? [], siteUrl);
  const rows = toExportRows(guests);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");

  const dateStamp = new Date().toISOString().slice(0, 10);

  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="wedding-rsvp-${dateStamp}.csv"`,
      },
    });
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="wedding-rsvp-${dateStamp}.xlsx"`,
    },
  });
}
