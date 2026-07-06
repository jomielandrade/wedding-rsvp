import { weddingConfig } from "@/config/wedding";
import type { GuestInvite } from "@/types/wedding";

export function getGuestBySlug(slug: string): GuestInvite | null {
  return weddingConfig.guests.find((guest) => guest.slug === slug) ?? null;
}

export function isValidInviteSlug(slug: string): boolean {
  return weddingConfig.guests.some((guest) => guest.slug === slug);
}

export function getInvitePath(slug: string): string {
  return `/invite/${slug}`;
}

export function getInviteUrl(slug: string, siteUrl?: string): string {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${getInvitePath(slug)}`;
}
