"use client";

import { useMemo, useState } from "react";
import type { RsvpRecord } from "@/types/wedding";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminRsvpTableProps {
  rsvps: RsvpRecord[];
}

export function AdminRsvpTable({ rsvps }: AdminRsvpTableProps) {
  const [query, setQuery] = useState("");

  const filteredRsvps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rsvps;

    return rsvps.filter((rsvp) =>
      [
        rsvp.full_name,
        rsvp.mobile_number,
        rsvp.email ?? "",
        ...(rsvp.companion_names ?? []),
        rsvp.message ?? "",
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [rsvps, query]);

  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 shadow-sm">
      <div className="border-b border-black/5 px-6 py-5">
        <h3 className="font-serif text-xl font-medium text-text">RSVP details</h3>
        <p className="mt-1 text-sm text-text/60">
          Full submission details from guests who have responded.
        </p>
        <div className="mt-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search responses..."
            className="bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/5 bg-black/[0.02] text-text/60">
            <tr>
              <th className="px-6 py-3 font-medium">Guest</th>
              <th className="px-6 py-3 font-medium">Attendance</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Guests</th>
              <th className="px-6 py-3 font-medium">Companions</th>
              <th className="px-6 py-3 font-medium">Message</th>
              <th className="px-6 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredRsvps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-text/50">
                  {rsvps.length === 0
                    ? "No RSVPs submitted yet."
                    : "No responses match your search."}
                </td>
              </tr>
            ) : (
              filteredRsvps.map((rsvp) => (
                <tr key={rsvp.id} className="border-b border-black/5 align-top last:border-0">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{rsvp.full_name}</div>
                    <div className="text-xs text-text/50">{rsvp.invite_slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                        rsvp.attendance === "attending"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700",
                      )}
                    >
                      {rsvp.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>{rsvp.mobile_number}</div>
                    {rsvp.email && (
                      <div className="text-xs text-text/50">{rsvp.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{rsvp.guest_count}</td>
                  <td className="max-w-[12rem] px-6 py-4 text-text/70">
                    {rsvp.companion_names?.length
                      ? rsvp.companion_names.join(", ")
                      : "—"}
                  </td>
                  <td className="max-w-[20rem] px-6 py-4 text-text/70">
                    {rsvp.message || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-text/70">
                    {new Date(rsvp.created_at).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
