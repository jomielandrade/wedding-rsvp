"use client";

import { useEffect, useMemo, useState } from "react";
import type { RsvpRecord } from "@/types/wedding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminRsvpTableProps {
  rsvps: RsvpRecord[];
}

const PAGE_SIZE = 10;

function formatSubmittedAt(value: string) {
  return new Date(value).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function RsvpCard({ rsvp }: { rsvp: RsvpRecord }) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium text-text">{rsvp.full_name}</h4>
          <p className="mt-0.5 text-xs text-text/50">{rsvp.invite_slug}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
            rsvp.attendance === "attending"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700",
          )}
        >
          {rsvp.attendance}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-text/45">Contact</dt>
          <dd className="mt-1 text-text">{rsvp.mobile_number}</dd>
          {rsvp.email && (
            <dd className="text-xs text-text/50">{rsvp.email}</dd>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-text/45">Guests</dt>
            <dd className="mt-1 text-text">{rsvp.guest_count}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-text/45">Submitted</dt>
            <dd className="mt-1 text-xs text-text/70">
              {formatSubmittedAt(rsvp.created_at)}
            </dd>
          </div>
        </div>
        {rsvp.companion_names?.length ? (
          <div>
            <dt className="text-xs uppercase tracking-wide text-text/45">
              Companions
            </dt>
            <dd className="mt-1 text-text/70">
              {rsvp.companion_names.join(", ")}
            </dd>
          </div>
        ) : null}
        {rsvp.message ? (
          <div>
            <dt className="text-xs uppercase tracking-wide text-text/45">Message</dt>
            <dd className="mt-1 whitespace-pre-wrap text-text/70">{rsvp.message}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

function PaginationControls({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (nextPage: number) => void;
}) {
  if (totalItems === 0) return null;

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-text/55 sm:text-sm">
        Showing {from}-{to} of {totalItems} responses
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="text-xs text-text/60 sm:text-sm">
          Page {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function AdminRsvpTable({ rsvps }: AdminRsvpTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredRsvps.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRsvps = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRsvps.slice(start, start + PAGE_SIZE);
  }, [filteredRsvps, currentPage]);

  const emptyMessage =
    rsvps.length === 0
      ? "No RSVPs submitted yet."
      : "No responses match your search.";

  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 shadow-sm">
      <div className="border-b border-black/5 px-4 py-5 sm:px-6">
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

      <div className="space-y-3 p-4 lg:hidden">
        {paginatedRsvps.length === 0 ? (
          <p className="py-10 text-center text-sm text-text/50">{emptyMessage}</p>
        ) : (
          paginatedRsvps.map((rsvp) => <RsvpCard key={rsvp.id} rsvp={rsvp} />)
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
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
            {paginatedRsvps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-text/50">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRsvps.map((rsvp) => (
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
                    {formatSubmittedAt(rsvp.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredRsvps.length}
        onPageChange={setPage}
      />
    </section>
  );
}
