"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  guestFormSchema,
  type GuestFormValues,
} from "@/lib/validations/guest";
import { slugify } from "@/lib/utils";
import type { AdminGuestRow } from "@/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminGuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest?: AdminGuestRow | null;
  onSuccess: () => void;
}

export function AdminGuestFormDialog({
  open,
  onOpenChange,
  guest,
  onSuccess,
}: AdminGuestFormDialogProps) {
  const isEditing = Boolean(guest);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      fullName: "",
      slug: "",
      maxGuests: 1,
    },
  });

  const fullName = watch("fullName");
  const hasRsvp = Boolean(guest?.rsvp);

  useEffect(() => {
    if (!open) return;

    reset({
      fullName: guest?.fullName ?? "",
      slug: guest?.slug ?? "",
      maxGuests: guest?.maxGuests ?? 1,
    });
    setSlugTouched(Boolean(guest));
    setSubmitError(null);
  }, [open, guest, reset]);

  useEffect(() => {
    if (!open || isEditing || slugTouched || !fullName.trim()) return;
    setValue("slug", slugify(fullName), { shouldValidate: true });
  }, [fullName, isEditing, open, setValue, slugTouched]);

  const onSubmit = async (values: GuestFormValues) => {
    setSubmitError(null);

    try {
      const response = await fetch(
        isEditing ? `/api/admin/guests/${guest!.id}` : "/api/admin/guests",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(
          typeof result.error === "string"
            ? result.error
            : "Unable to save guest. Please try again.",
        );
        return;
      }

      onOpenChange(false);
      onSuccess();
    } catch {
      setSubmitError("Unable to save guest. Please check your connection.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogTitle className="font-serif text-2xl text-text">
          {isEditing ? "Edit guest" : "Add guest"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" {...register("fullName")} className="bg-white" />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Invite slug</Label>
            <Input
              id="slug"
              {...register("slug", {
                onChange: () => setSlugTouched(true),
              })}
              disabled={hasRsvp}
              className="bg-white"
            />
            <p className="text-xs text-text/50">
              {hasRsvp
                ? "Slug is locked because this guest already RSVP'd."
                : "Used in the invite URL, e.g. /invite/maria-santos"}
            </p>
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxGuests">Max guests allowed</Label>
            <Input
              id="maxGuests"
              type="number"
              min={1}
              max={10}
              {...register("maxGuests", { valueAsNumber: true })}
              className="bg-white"
            />
            {errors.maxGuests && (
              <p className="text-sm text-red-500">{errors.maxGuests.message}</p>
            )}
          </div>

          {submitError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add guest"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
