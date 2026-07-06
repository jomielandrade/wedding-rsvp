import { createClient } from "@supabase/supabase-js";
import type { RsvpRecord, GuestRecord } from "@/types/wedding";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Database = {
  public: {
    Tables: {
      rsvp: {
        Row: RsvpRecord;
        Insert: Omit<RsvpRecord, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<RsvpRecord>;
      };
      guests: {
        Row: GuestRecord;
        Insert: Omit<GuestRecord, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<GuestRecord>;
      };
    };
  };
};
