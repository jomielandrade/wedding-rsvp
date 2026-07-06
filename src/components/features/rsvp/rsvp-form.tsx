"use client";

import { useEffect, useState } from "react";
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
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      ...rsvpDefaultValues,
      inviteSlug,
    },
  });

  const attendance = watch("attendance");
  const guestCount = watch("guestCount");
  const isAttending = attendance === "attending";
  const companionCount = isAttending ? Math.max(0, guestCount - 1) : 0;

  useEffect(() => {
    const current = getValues("companionNames") ?? [];

    if (companionCount === 0) {
      if (current.length > 0) {
        setValue("companionNames", []);
      }
      return;
    }

    if (current.length === companionCount) return;

    setValue(
      "companionNames",
      Array.from({ length: companionCount }, (_, index) => current[index] ?? ""),
    );
  }, [companionCount, getValues, setValue]);

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
      className="glass-card mx-auto max-w-2xl space-y-5 px-6 py-8 md:space-y-6 md:px-10 md:py-10"
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
                      setValue("companionNames", []);
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
          {maxGuests === 1 ? (
            <p className="text-xs text-text/50">
              This invitation is for one guest.
            </p>
          ) : (
            <p className="text-xs text-text/50">
              Include yourself in the total count (max {maxGuests}).
            </p>
          )}
          {errors.guestCount && (
            <p className="text-sm text-red-500">{errors.guestCount.message}</p>
          )}
        </div>
      )}

      {isAttending && companionCount > 0 && (
        <div className="space-y-3">
          <div>
            <Label>
              {companionCount === 1 ? "Companion name *" : "Companion names *"}
            </Label>
            <p className="mt-1 text-xs text-text/50">
              Please enter the full name{companionCount === 1 ? "" : "s"} of{" "}
              {companionCount === 1 ? "your companion" : "your companions"}.
            </p>
          </div>
          {Array.from({ length: companionCount }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`companion-${index}`}>
                {companionCount === 1
                  ? "Companion full name"
                  : `Companion ${index + 1} full name`}
              </Label>
              <Input
                id={`companion-${index}`}
                autoComplete="name"
                placeholder="Full name"
                aria-invalid={!!errors.companionNames?.[index]}
                {...register(`companionNames.${index}` as const)}
              />
              {errors.companionNames?.[index] && (
                <p className="text-sm text-red-500">
                  {errors.companionNames[index]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Message for the Couple (Optional)</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Share your well wishes, prayers, or a note for us..."
          className="min-h-[160px] resize-y"
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
