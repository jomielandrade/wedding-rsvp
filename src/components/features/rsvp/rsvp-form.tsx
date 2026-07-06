"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  rsvpDefaultValues,
  rsvpSchema,
  type RsvpFormValues,
} from "@/lib/validations/rsvp";
import { RsvpSuccess } from "@/components/features/rsvp/rsvp-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AttendanceStatus } from "@/types/wedding";

interface RsvpFormProps {
  inviteSlug: string;
  guestName: string;
  maxGuests?: number;
  existingAttendance?: AttendanceStatus | null;
}

export function RsvpForm({
  inviteSlug,
  guestName,
  maxGuests = 1,
  existingAttendance = null,
}: RsvpFormProps) {
  const [submitted, setSubmitted] = useState(Boolean(existingAttendance));
  const [submittedAttendance, setSubmittedAttendance] =
    useState<AttendanceStatus>(existingAttendance ?? "attending");
  const [celebrate, setCelebrate] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      ...rsvpDefaultValues,
      inviteSlug,
    },
  });

  const attendance = watch("attendance");
  const isAttending = attendance === "attending";

  const onSubmit = async (data: RsvpFormValues) => {
    setSubmitError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, inviteSlug }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(
          typeof result.error === "string"
            ? result.error
            : "Something went wrong. Please try again.",
        );
        return;
      }

      setSubmittedAttendance(data.attendance);
      setCelebrate(true);
      setSubmitted(true);
    } catch {
      setSubmitError("Unable to submit your RSVP. Please check your connection.");
    }
  };

  if (submitted) {
    return (
      <RsvpSuccess
        attendance={submittedAttendance}
        guestName={guestName}
        celebrate={celebrate}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-card mx-auto max-w-2xl space-y-6 px-6 py-8 md:px-10 md:py-10"
      noValidate
    >
      <input type="hidden" {...register("inviteSlug")} />

      <div className="space-y-2">
        <Label htmlFor="guestName">Full Name</Label>
        <Input
          id="guestName"
          value={guestName}
          readOnly
          aria-readonly="true"
          className="cursor-default bg-white/60"
        />
        <p className="text-xs text-text/50">
          This RSVP is linked to your personal invitation.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobileNumber">Mobile Number *</Label>
        <Input
          id="mobileNumber"
          type="tel"
          autoComplete="tel"
          placeholder="09XX XXX XXXX"
          aria-invalid={!!errors.mobileNumber}
          {...register("mobileNumber")}
        />
        {errors.mobileNumber && (
          <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address (Optional)</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-text/80">
          Attendance *
        </legend>
        <Controller
          name="attendance"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  { value: "attending", label: "Happily Attending" },
                  { value: "declining", label: "Regretfully Declining" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    field.onChange(option.value);
                    if (option.value === "declining") {
                      setValue("guestCount", 1);
                    }
                  }}
                  className={cn(
                    "rounded-xl border px-4 py-4 text-sm font-medium transition-all",
                    field.value === option.value
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-primary/20 bg-white/50 text-text/70 hover:border-primary/40",
                  )}
                  aria-pressed={field.value === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
        {errors.attendance && (
          <p className="text-sm text-red-500">{errors.attendance.message}</p>
        )}
      </fieldset>

      {isAttending && (
        <div className="space-y-2">
          <Label htmlFor="guestCount">Number of Guests *</Label>
          <Input
            id="guestCount"
            type="number"
            min={1}
            max={maxGuests}
            aria-invalid={!!errors.guestCount}
            {...register("guestCount", { valueAsNumber: true })}
          />
          {maxGuests === 1 && (
            <p className="text-xs text-text/50">
              This invitation is for one guest.
            </p>
          )}
          {errors.guestCount && (
            <p className="text-sm text-red-500">{errors.guestCount.message}</p>
          )}
        </div>
      )}

      {isAttending && (
        <div className="space-y-2">
          <Label htmlFor="songRequest">Song Request (Optional)</Label>
          <Input
            id="songRequest"
            placeholder="What song would you love to hear?"
            aria-invalid={!!errors.songRequest}
            {...register("songRequest")}
          />
          {errors.songRequest && (
            <p className="text-sm text-red-500">{errors.songRequest.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Message for the Couple (Optional)</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Share your well wishes..."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {submitError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit RSVP"
        )}
      </Button>
    </form>
  );
}
