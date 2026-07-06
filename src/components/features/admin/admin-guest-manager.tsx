"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { AdminGuestRow } from "@/types/admin";
import { AdminGuestFormDialog } from "@/components/features/admin/admin-guest-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminGuestManagerProps {
  guests: AdminGuestRow[];
}

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  attending: "bg-emerald-50 text-emerald-700",
  declining: "bg-rose-50 text-rose-700",
} as const;

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={onCopy}>
      {copied ? <Check className="text-emerald-600" /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function AdminGuestManager({ guests }: AdminGuestManagerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminGuestRow["status"]>(
    "all",
  );
  const [openedFilter, setOpenedFilter] = useState<"all" | "opened" | "not-opened">(
    "all",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<AdminGuestRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  const filteredGuests = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return guests.filter((guest) => {
      const matchesQuery =
        !normalized ||
        guest.fullName.toLowerCase().includes(normalized) ||
        guest.slug.toLowerCase().includes(normalized);
      const matchesStatus =
        statusFilter === "all" || guest.status === statusFilter;
      const matchesOpened =
        openedFilter === "all" ||
        (openedFilter === "opened" && guest.inviteOpened) ||
        (openedFilter === "not-opened" && !guest.inviteOpened);
      return matchesQuery && matchesStatus && matchesOpened;
    });
  }, [guests, query, statusFilter, openedFilter]);

  const openCreateDialog = () => {
    setEditingGuest(null);
    setDialogOpen(true);
  };

  const openEditDialog = (guest: AdminGuestRow) => {
    setEditingGuest(guest);
    setDialogOpen(true);
  };

  const onResetRsvp = async (guest: AdminGuestRow) => {
    const confirmed = window.confirm(
      `Reset RSVP for ${guest.fullName}? They will be able to submit again.`,
    );
    if (!confirmed) return;

    setActionError(null);
    setResettingId(guest.id);

    try {
      const response = await fetch(
        `/api/admin/guests/${guest.id}/reset-rsvp`,
        { method: "POST" },
      );
      const result = await response.json();

      if (!response.ok) {
        setActionError(
          typeof result.error === "string"
            ? result.error
            : "Unable to reset RSVP.",
        );
        return;
      }

      router.refresh();
    } catch {
      setActionError("Unable to reset RSVP. Please check your connection.");
    } finally {
      setResettingId(null);
    }
  };

  const onDelete = async (guest: AdminGuestRow) => {
    const message = guest.rsvp
      ? `Delete ${guest.fullName} and their RSVP response? This cannot be undone.`
      : `Delete ${guest.fullName}? This cannot be undone.`;

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    setActionError(null);
    setDeletingId(guest.id);

    try {
      const response = await fetch(`/api/admin/guests/${guest.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setActionError(
          typeof result.error === "string"
            ? result.error
            : "Unable to delete guest.",
        );
        return;
      }

      router.refresh();
    } catch {
      setActionError("Unable to delete guest. Please check your connection.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-white/70 bg-white/80 shadow-sm">
        <div className="border-b border-black/5 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-serif text-xl font-medium text-text">
                Guest invites
              </h3>
              <p className="mt-1 text-sm text-text/60">
                Add, edit, and share personal invite links.
              </p>
            </div>
            <Button type="button" size="sm" onClick={openCreateDialog}>
              <Plus />
              Add guest
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or slug..."
              className="bg-white"
            />
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
              className="h-11 rounded-xl border border-primary/20 bg-white px-4 text-sm text-text"
            >
              <option value="all">All RSVP statuses</option>
              <option value="pending">Pending</option>
              <option value="attending">Attending</option>
              <option value="declining">Declining</option>
            </select>
            <select
              value={openedFilter}
              onChange={(event) =>
                setOpenedFilter(event.target.value as typeof openedFilter)
              }
              className="h-11 rounded-xl border border-primary/20 bg-white px-4 text-sm text-text"
            >
              <option value="all">All invite views</option>
              <option value="opened">Opened invite</option>
              <option value="not-opened">Not opened yet</option>
            </select>
          </div>

          {actionError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {actionError}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-black/[0.02] text-text/60">
              <tr>
                <th className="px-6 py-3 font-medium">Guest</th>
                <th className="px-6 py-3 font-medium">RSVP</th>
                <th className="px-6 py-3 font-medium">Opened</th>
                <th className="px-6 py-3 font-medium">Max guests</th>
                <th className="px-6 py-3 font-medium">Invite link</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-text/50">
                    {guests.length === 0
                      ? "No guests yet. Add your first guest to create an invite link."
                      : "No guests match your filters."}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{guest.fullName}</div>
                      <div className="text-xs text-text/50">{guest.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                          statusStyles[guest.status],
                        )}
                      >
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {guest.inviteOpened ? (
                        <div>
                          <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                            Opened
                          </span>
                          {guest.firstOpenedAt && (
                            <p className="mt-1 text-xs text-text/50">
                              {new Date(guest.firstOpenedAt).toLocaleString(
                                "en-PH",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-text/50">
                          Not yet
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{guest.maxGuests}</td>
                    <td className="max-w-xs truncate px-6 py-4 text-text/70">
                      {guest.inviteUrl}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <CopyLinkButton url={guest.inviteUrl} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(guest)}
                        >
                          <Pencil />
                          Edit
                        </Button>
                        {guest.rsvp && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onResetRsvp(guest)}
                            disabled={resettingId === guest.id}
                          >
                            <RotateCcw />
                            Reset RSVP
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(guest)}
                          disabled={deletingId === guest.id}
                        >
                          <Trash2 />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdminGuestFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        guest={editingGuest}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
