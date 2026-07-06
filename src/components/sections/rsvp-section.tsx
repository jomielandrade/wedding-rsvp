import { weddingConfig } from "@/config/wedding";
import { RsvpForm } from "@/components/features/rsvp/rsvp-form";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";

import type { AttendanceStatus } from "@/types/wedding";

interface RsvpSectionProps {
  inviteSlug: string;
  guestName: string;
  maxGuests?: number;
  existingAttendance?: AttendanceStatus | null;
}

export function RsvpSection({
  inviteSlug,
  guestName,
  maxGuests,
  existingAttendance = null,
}: RsvpSectionProps) {
  const { rsvp } = weddingConfig;
  const deadline = new Date(rsvp.deadline).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      id={SECTION_IDS.rsvp}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="RSVP"
    >
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="RSVP" subtitle="Kindly Respond" />

      <FadeUp delay={0.05}>
        <p className="mx-auto mb-10 max-w-2xl text-center text-text/70">
          Please let us know if you&apos;ll be joining us by{" "}
          <span className="font-medium text-text">{deadline}</span>. We can&apos;t
          wait to celebrate with you.
        </p>
      </FadeUp>

      <FadeUp delay={0.15}>
        <RsvpForm
          inviteSlug={inviteSlug}
          guestName={guestName}
          maxGuests={maxGuests}
          existingAttendance={existingAttendance}
        />
      </FadeUp>
    </section>
  );
}
