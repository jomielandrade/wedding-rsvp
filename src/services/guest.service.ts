import { createServerClient } from "@/lib/supabase/client";
import type { GuestInvite, GuestRecord } from "@/types/wedding";
import type { GuestFormValues } from "@/lib/validations/guest";

export function toGuestInvite(record: GuestRecord): GuestInvite {
  return {
    slug: record.slug,
    fullName: record.full_name,
    maxGuests: record.max_guests,
  };
}

export async function listAllGuests() {
  const supabase = createServerClient();
  return supabase
    .from("guests")
    .select("*")
    .order("full_name", { ascending: true });
}

export async function getGuestBySlug(slug: string) {
  const supabase = createServerClient();
  return supabase.from("guests").select("*").eq("slug", slug).maybeSingle();
}

export async function getGuestById(id: string) {
  const supabase = createServerClient();
  return supabase.from("guests").select("*").eq("id", id).maybeSingle();
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  const supabase = createServerClient();
  let query = supabase.from("guests").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) return { taken: false, error };
  return { taken: Boolean(data), error: null };
}

export async function createGuest(values: GuestFormValues) {
  const supabase = createServerClient();
  return supabase
    .from("guests")
    .insert({
      slug: values.slug,
      full_name: values.fullName,
      max_guests: values.maxGuests,
    })
    .select("*")
    .single();
}

export async function updateGuest(id: string, values: GuestFormValues) {
  const supabase = createServerClient();
  return supabase
    .from("guests")
    .update({
      slug: values.slug,
      full_name: values.fullName,
      max_guests: values.maxGuests,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
}

export async function deleteGuest(id: string) {
  const supabase = createServerClient();
  return supabase.from("guests").delete().eq("id", id);
}
