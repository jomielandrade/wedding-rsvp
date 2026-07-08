"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import type { AdminGuestRow } from "@/types/admin";
import { AdminGuestFormDialog } from "@/components/features/admin/admin-guest-form-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminGuestManagerProps {
  guests: AdminGuestRow[];
}

const PAGE_SIZE = 10;

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  attending: "bg-emerald-50 text-emerald-700",
  declining: "bg-rose-50 text-rose-700",
} as const;

function formatRelativeTime(value: string) {
  const parsed = new Date(value);
  const diffMs = Date.now() - parsed.getTime();
  const diffSeconds = Math.max(1, Math.floor(diffMs / 1000));

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  const weeks = Math.floor(diffSeconds / 604800);
  if (weeks < 5) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  const months = Math.floor(diffSeconds / 2629800);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  const years = Math.floor(diffSeconds / 31557600);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function getOpenCountTone(openCount: number) {
  if (openCount >= 10) {
    return {
      badge: "border-violet-200 bg-violet-50 text-violet-700",
      countPill: "bg-violet-100 text-violet-800",
    };
  }
  if (openCount >= 5) {
    return {
      badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
      countPill: "bg-indigo-100 text-indigo-800",
    };
  }
  return {
    badge: "border-sky-100 bg-sky-50 text-sky-700",
    countPill: "bg-white/80 text-sky-800",
  };
}

function CopyLinkButton({
  url,
  className,
  fullWidth = false,
}: {
  url: string;
  className?: string;
  fullWidth?: boolean;
}) {
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
    <Button
      type="button"
      variant={fullWidth ? "outline" : "ghost"}
      size="sm"
      onClick={onCopy}
      className={cn(fullWidth && "w-full", className)}
    >
      {copied ? <Check className="text-emerald-600" /> : <Copy />}
      {copied ? "Copied" : "Copy invite link"}
    </Button>
  );
}

function GuestActionsMenu({
  guest,
  onMarkStatus,
  onEdit,
  onResetRsvp,
  onDelete,
  markingId,
  resettingId,
  deletingId,
}: {
  guest: AdminGuestRow;
  onMarkStatus: (
    guest: AdminGuestRow,
    status: "attending" | "declining",
  ) => void;
  onEdit: (guest: AdminGuestRow) => void;
  onResetRsvp: (guest: AdminGuestRow) => void;
  onDelete: (guest: AdminGuestRow) => void;
  markingId: string | null;
  resettingId: string | null;
  deletingId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const busy =
    markingId === guest.id ||
    resettingId === guest.id ||
    deletingId === guest.id;
  const canReset = Boolean(guest.rsvp) || guest.statusSource === "override";

  const closeMenu = () => {
    setOpen(false);
    setMenuPos(null);
  };

  const toggleMenu = () => {
    if (open) {
      closeMenu();
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const onReposition = () => closeMenu();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  return (
    <div className="relative inline-flex justify-end">
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Actions for ${guest.fullName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={busy}
        onClick={toggleMenu}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {open && menuPos && (
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 w-48 overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-lg"
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          {guest.status === "pending" && (
            <>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-black/[0.04]"
                onClick={() => {
                  closeMenu();
                  onMarkStatus(guest, "attending");
                }}
              >
                <ThumbsUp className="h-4 w-4" />
                Mark attending
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-black/[0.04]"
                onClick={() => {
                  closeMenu();
                  onMarkStatus(guest, "declining");
                }}
              >
                <ThumbsDown className="h-4 w-4" />
                Mark declining
              </button>
              <div className="my-1 border-t border-black/5" />
            </>
          )}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-black/[0.04]"
            onClick={() => {
              closeMenu();
              onEdit(guest);
            }}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          {canReset && (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-black/[0.04]"
              onClick={() => {
                closeMenu();
                onResetRsvp(guest);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
            onClick={() => {
              closeMenu();
              onDelete(guest);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function AdminGuestCard({
  guest,
  onMarkStatus,
  onEdit,
  onResetRsvp,
  onDelete,
  markingId,
  resettingId,
  deletingId,
}: {
  guest: AdminGuestRow;
  onMarkStatus: (
    guest: AdminGuestRow,
    status: "attending" | "declining",
  ) => void;
  onEdit: (guest: AdminGuestRow) => void;
  onResetRsvp: (guest: AdminGuestRow) => void;
  onDelete: (guest: AdminGuestRow) => void;
  markingId: string | null;
  resettingId: string | null;
  deletingId: string | null;
}) {
  const openTone = getOpenCountTone(guest.openCount);

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-medium text-text">{guest.fullName}</h4>
          <p className="mt-0.5 text-xs text-text/50">{guest.slug}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Max {guest.maxGuests}
          </span>
          <GuestActionsMenu
            guest={guest}
            onMarkStatus={onMarkStatus}
            onEdit={onEdit}
            onResetRsvp={onResetRsvp}
            onDelete={onDelete}
            markingId={markingId}
            resettingId={resettingId}
            deletingId={deletingId}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
            statusStyles[guest.status],
          )}
        >
          {guest.status}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            guest.inviteOpened
              ? `border ${openTone.badge}`
              : "bg-black/[0.04] text-text/50",
          )}
        >
          {guest.inviteOpened ? <Eye className="h-3.5 w-3.5" /> : null}
          {guest.inviteOpened
            ? `Opened (${guest.openCount}x)`
            : "Not opened"}
        </span>
      </div>

      {guest.statusSource === "override" && (
        <p className="mt-2 text-xs font-medium text-violet-700">
          Overridden manually in admin. Use Reset to clear override.
        </p>
      )}

      {guest.firstOpenedAt && (
        <p className="mt-2 text-xs text-text/50">
          Last opened{" "}
          <span
            className="font-medium text-text/65"
            title={new Date(guest.lastOpenedAt ?? guest.firstOpenedAt).toLocaleString(
              "en-PH",
              {
                dateStyle: "full",
                timeStyle: "long",
              },
            )}
          >
            {formatRelativeTime(guest.lastOpenedAt ?? guest.firstOpenedAt)}
          </span>
        </p>
      )}

      <div className="mt-4 rounded-xl border border-primary/10 bg-[#f8fafc] p-3">
        <p className="break-all text-xs leading-relaxed text-text/60">
          {guest.inviteUrl}
        </p>
        <div className="mt-3">
          <CopyLinkButton url={guest.inviteUrl} fullWidth />
        </div>
      </div>

    </article>
  );
}

function PaginationControls({
  page,
  totalPages,
  totalItems,
  itemLabel,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (nextPage: number) => void;
}) {
  if (totalItems === 0) return null;

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-text/55 sm:text-sm">
        Showing {from}-{to} of {totalItems} {itemLabel}
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
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [overrideConfirm, setOverrideConfirm] = useState<{
    guest: AdminGuestRow;
    status: "attending" | "declining";
  } | null>(null);
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, openedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGuests.slice(start, start + PAGE_SIZE);
  }, [filteredGuests, currentPage]);

  const openCreateDialog = () => {
    setEditingGuest(null);
    setDialogOpen(true);
  };

  const openEditDialog = (guest: AdminGuestRow) => {
    setEditingGuest(guest);
    setDialogOpen(true);
  };

  const onResetRsvp = async (guest: AdminGuestRow) => {
    const resetScope =
      guest.statusSource === "override"
        ? "This will clear the manual override and any RSVP response."
        : "They will be able to submit again.";
    const confirmed = window.confirm(`Reset RSVP for ${guest.fullName}? ${resetScope}`);
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

  const onMarkStatus = async (
    guest: AdminGuestRow,
    status: "attending" | "declining",
  ) => {
    setOverrideConfirm({ guest, status });
  };

  const confirmOverride = async () => {
    if (!overrideConfirm) return;

    const { guest, status } = overrideConfirm;
    setActionError(null);
    setMarkingId(guest.id);
    setOverrideConfirm(null);

    try {
      const response = await fetch(
        `/api/admin/guests/${guest.id}/override-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        setActionError(
          typeof result.error === "string"
            ? result.error
            : "Unable to update guest status.",
        );
        return;
      }

      router.refresh();
    } catch {
      setActionError("Unable to update guest status. Please check your connection.");
    } finally {
      setMarkingId(null);
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

  const emptyMessage =
    guests.length === 0
      ? "No guests yet. Add your first guest to create an invite link."
      : "No guests match your filters.";

  return (
    <>
      <section className="rounded-2xl border border-white/70 bg-white/80 shadow-sm">
        <div className="border-b border-black/5 px-4 py-5 sm:px-6">
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

        <div className="space-y-3 p-4 lg:hidden">
          {paginatedGuests.length === 0 ? (
            <p className="py-10 text-center text-sm text-text/50">{emptyMessage}</p>
          ) : (
            paginatedGuests.map((guest) => (
              <AdminGuestCard
                key={guest.id}
                guest={guest}
                onMarkStatus={onMarkStatus}
                onEdit={openEditDialog}
                onResetRsvp={onResetRsvp}
                onDelete={onDelete}
                markingId={markingId}
                resettingId={resettingId}
                deletingId={deletingId}
              />
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-black/[0.02] text-text/60">
              <tr>
                <th className="px-6 py-3 font-medium">Guest</th>
                <th className="px-6 py-3 font-medium">RSVP</th>
                <th className="px-6 py-3 font-medium">Opened</th>
                <th className="px-6 py-3 font-medium">Max guests</th>
                <th className="px-6 py-3 font-medium">Invite link</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-text/50">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedGuests.map((guest) => {
                  const openTone = getOpenCountTone(guest.openCount);
                  return (
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
                      {guest.statusSource === "override" && (
                        <p className="mt-1 text-[11px] font-medium text-violet-700">
                          Overridden
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {guest.inviteOpened ? (
                        <div>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                              openTone.badge,
                            )}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Opened
                            <span
                              className={cn(
                                "ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                                openTone.countPill,
                              )}
                            >
                              {guest.openCount}x
                            </span>
                          </span>
                          {guest.firstOpenedAt && (
                            <p className="mt-1 text-xs text-text/50">
                              <span
                                className="cursor-help border-b border-dotted border-text/30"
                                title={new Date(
                                  guest.lastOpenedAt ?? guest.firstOpenedAt,
                                ).toLocaleString("en-PH", {
                                  dateStyle: "full",
                                  timeStyle: "long",
                                })}
                              >
                                {formatRelativeTime(
                                  guest.lastOpenedAt ?? guest.firstOpenedAt,
                                )}
                              </span>
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
                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate text-text/70">{guest.inviteUrl}</p>
                      <div className="mt-2">
                        <CopyLinkButton url={guest.inviteUrl} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <GuestActionsMenu
                        guest={guest}
                        onMarkStatus={onMarkStatus}
                        onEdit={openEditDialog}
                        onResetRsvp={onResetRsvp}
                        onDelete={onDelete}
                        markingId={markingId}
                        resettingId={resettingId}
                        deletingId={deletingId}
                      />
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          page={currentPage}
          totalPages={totalPages}
          totalItems={filteredGuests.length}
          itemLabel="guests"
          onPageChange={setPage}
        />
      </section>

      <AdminGuestFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        guest={editingGuest}
        onSuccess={() => router.refresh()}
      />

      <Dialog
        open={Boolean(overrideConfirm)}
        onOpenChange={(open) => !open && setOverrideConfirm(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Confirm status override</DialogTitle>
          {overrideConfirm && (
            <p className="text-sm leading-relaxed text-text/70">
              Set <span className="font-medium text-text">{overrideConfirm.guest.fullName}</span>{" "}
              to{" "}
              <span className="font-medium capitalize text-text">
                {overrideConfirm.status}
              </span>
              ? This applies a manual override. You can clear it anytime using{" "}
              <span className="font-medium text-text">Reset</span>.
            </p>
          )}
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOverrideConfirm(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => void confirmOverride()}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
