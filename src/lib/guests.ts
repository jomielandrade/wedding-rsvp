import type { GuestInvite } from "@/types/wedding";
import { getGuestBySlug as getGuestRecordBySlug, toGuestInvite } from "@/services/guest.service";

export function getInvitePath(slug: string): string {
  return `/invite/${slug}`;
}

export function getInviteUrl(slug: string, siteUrl?: string): string {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${getInvitePath(slug)}`;
}

export async function getGuestBySlug(slug: string): Promise<GuestInvite | null> {
  const { data, error } = await getGuestRecordBySlug(slug);
  if (error || !data) return null;
  return toGuestInvite(data);
}

export async function isValidInviteSlug(slug: string): Promise<boolean> {
  const guest = await getGuestBySlug(slug);
  return guest !== null;
}
