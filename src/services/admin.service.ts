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
  guests: GuestRecord[],
  rsvps: RsvpRecord[],
): RsvpStats {
  const rsvpBySlug = new Map(rsvps.map((rsvp) => [rsvp.invite_slug, rsvp]));
  const totalInvited = guests.length;
  const invitedHeadcount = guests.reduce(
    (sum, guest) => sum + guest.max_guests,
    0,
  );

  let attending = 0;
  let declining = 0;
  let confirmedHeadcount = 0;

  for (const guest of guests) {
    const status = guest.status_override ?? rsvpBySlug.get(guest.slug)?.attendance;
    if (status === "attending") {
      attending += 1;
      confirmedHeadcount +=
        guest.status_override === "attending"
          ? guest.max_guests
          : (rsvpBySlug.get(guest.slug)?.guest_count ?? guest.max_guests);
    } else if (status === "declining") {
      declining += 1;
    }
  }

  const totalResponded = attending + declining;

  return {
    totalInvited,
    invitedHeadcount,
    totalResponded,
    attending,
    declining,
    pending: Math.max(totalInvited - totalResponded, 0),
    confirmedHeadcount,
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
    const status = guest.status_override ?? rsvp?.attendance ?? "pending";
    const statusSource = guest.status_override
      ? "override"
      : rsvp
        ? "rsvp"
        : "pending";
    return {
      id: guest.id,
      slug: guest.slug,
      fullName: guest.full_name,
      maxGuests: guest.max_guests,
      inviteUrl: getInviteUrl(guest.slug, siteUrl),
      status,
      statusSource,
      overrideAt: guest.status_override_at,
      inviteOpened: Boolean(guest.first_opened_at),
      firstOpenedAt: guest.first_opened_at,
      lastOpenedAt: guest.last_opened_at,
      openCount: guest.open_count ?? 0,
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
  const stats = buildRsvpStats(guestRecords, records);
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
    "Status Source":
      guest.statusSource === "override"
        ? "Manual override"
        : guest.statusSource === "rsvp"
          ? "RSVP"
          : "Pending",
    "Invite URL": guest.inviteUrl,
    "Invite Opened": guest.inviteOpened ? "Yes" : "No",
    "First Opened": guest.firstOpenedAt
      ? new Date(guest.firstOpenedAt).toLocaleString("en-PH")
      : "",
    "Open Count": guest.openCount,
    Mobile: guest.rsvp?.mobile_number ?? "",
    Email: guest.rsvp?.email ?? "",
    "Guest Count": guest.rsvp?.guest_count ?? "",
    Companions: guest.rsvp?.companion_names?.join(", ") ?? "",
    Message: guest.rsvp?.message ?? "",
    "Responded At": guest.rsvp?.created_at
      ? new Date(guest.rsvp.created_at).toLocaleString("en-PH")
      : "",
  }));
}
