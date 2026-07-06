import { listAllGuests } from "@/services/guest.service";
import { getInviteUrl } from "@/lib/guests";
import { listAllRsvps } from "@/services/rsvp.service";
import type {
  AdminDashboardData,
  AdminGuestRow,
  RsvpStats,
} from "@/types/admin";
import type { GuestRecord, RsvpRecord } from "@/types/wedding";

export function buildRsvpStats(
  rsvps: RsvpRecord[],
  totalInvited: number,
): RsvpStats {
  const attending = rsvps.filter((r) => r.attendance === "attending").length;
  const declining = rsvps.filter((r) => r.attendance === "declining").length;
  const totalResponded = attending + declining;
  const totalGuestCount = rsvps
    .filter((r) => r.attendance === "attending")
    .reduce((sum, r) => sum + r.guest_count, 0);

  return {
    totalInvited,
    totalResponded,
    attending,
    declining,
    pending: Math.max(totalInvited - totalResponded, 0),
    totalGuestCount,
    responseRate:
      totalInvited > 0
        ? Math.round((totalResponded / totalInvited) * 100)
        : 0,
  };
}

export function buildGuestRows(
  guests: GuestRecord[],
  rsvps: RsvpRecord[],
  siteUrl?: string,
): AdminGuestRow[] {
  const rsvpBySlug = new Map(rsvps.map((rsvp) => [rsvp.invite_slug, rsvp]));

  return guests.map((guest) => {
    const rsvp = rsvpBySlug.get(guest.slug) ?? null;
    return {
      id: guest.id,
      slug: guest.slug,
      fullName: guest.full_name,
      maxGuests: guest.max_guests,
      inviteUrl: getInviteUrl(guest.slug, siteUrl),
      status: rsvp?.attendance ?? "pending",
      rsvp,
    };
  });
}

export async function getAdminDashboardData(
  siteUrl?: string,
): Promise<AdminDashboardData> {
  const [{ data: guests, error: guestsError }, { data: rsvps, error: rsvpsError }] =
    await Promise.all([listAllGuests(), listAllRsvps()]);

  if (guestsError) {
    throw new Error(guestsError.message);
  }

  if (rsvpsError) {
    throw new Error(rsvpsError.message);
  }

  const guestRecords = guests ?? [];
  const records = rsvps ?? [];
  const stats = buildRsvpStats(records, guestRecords.length);
  const guestRows = buildGuestRows(guestRecords, records, siteUrl);

  return { stats, guests: guestRows, rsvps: records };
}

export function toExportRows(guests: AdminGuestRow[]) {
  return guests.map((guest) => ({
    Name: guest.fullName,
    Slug: guest.slug,
    "Max Guests": guest.maxGuests,
    Status:
      guest.status === "pending"
        ? "Pending"
        : guest.status === "attending"
          ? "Attending"
          : "Declining",
    "Invite URL": guest.inviteUrl,
    Mobile: guest.rsvp?.mobile_number ?? "",
    Email: guest.rsvp?.email ?? "",
    "Guest Count": guest.rsvp?.guest_count ?? "",
    Companions: guest.rsvp?.companion_names?.join(", ") ?? "",
    "Song Request": guest.rsvp?.song_request ?? "",
    Message: guest.rsvp?.message ?? "",
    "Responded At": guest.rsvp?.created_at
      ? new Date(guest.rsvp.created_at).toLocaleString("en-PH")
      : "",
  }));
}
