import type { AttendanceStatus, RsvpRecord } from "@/types/wedding";

export type GuestRsvpStatus = "pending" | AttendanceStatus;

export interface RsvpStats {
  totalInvited: number;
  invitedHeadcount: number;
  totalResponded: number;
  attending: number;
  declining: number;
  pending: number;
  confirmedHeadcount: number;
  responseRate: number;
}

export interface AdminGuestRow {
  id: string;
  slug: string;
  fullName: string;
  maxGuests: number;
  inviteUrl: string;
  status: GuestRsvpStatus;
  inviteOpened: boolean;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  openCount: number;
  rsvp: RsvpRecord | null;
}

export interface AdminDashboardData {
  stats: RsvpStats;
  guests: AdminGuestRow[];
  rsvps: RsvpRecord[];
}
