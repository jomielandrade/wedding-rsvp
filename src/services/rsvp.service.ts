import { createServerClient } from "@/lib/supabase/client";
import type { GuestInvite } from "@/types/wedding";
import type { RsvpFormValues } from "@/lib/validations/rsvp";

export interface RsvpInsertPayload {
  invite_slug: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  attendance: RsvpFormValues["attendance"];
  guest_count: number;
  companion_names: string[];
  message: string | null;
}

export function toRsvpInsertPayload(
  data: RsvpFormValues,
  guest: GuestInvite,
): RsvpInsertPayload {
  return {
    invite_slug: guest.slug,
    full_name: guest.fullName,
    mobile_number: data.mobileNumber.trim(),
    email: data.email?.trim() || null,
    attendance: data.attendance,
    guest_count: data.attendance === "attending" ? data.guestCount : 0,
    companion_names:
      data.attendance === "attending" && data.guestCount > 1
        ? data.companionNames
            .slice(0, data.guestCount - 1)
            .map((name) => name.trim())
            .filter(Boolean)
        : [],
    message: data.message?.trim() || null,
  };
}

export async function findRsvpByInviteSlug(inviteSlug: string) {
  const supabase = createServerClient();
  return supabase
    .from("rsvp")
    .select("id, attendance")
    .eq("invite_slug", inviteSlug)
    .maybeSingle();
}

export async function listAllRsvps() {
  const supabase = createServerClient();
  return supabase
    .from("rsvp")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function deleteRsvpByInviteSlug(inviteSlug: string) {
  const supabase = createServerClient();
  return supabase.from("rsvp").delete().eq("invite_slug", inviteSlug);
}

export async function createRsvp(payload: RsvpInsertPayload) {
  const supabase = createServerClient();
  return supabase.from("rsvp").insert(payload).select("id").single();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
