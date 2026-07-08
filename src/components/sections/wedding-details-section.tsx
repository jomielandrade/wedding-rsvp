import { Clock } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { FadeUp } from "@/components/animations/motion-primitives";
import { ScheduleTimeline } from "@/components/features/wedding-details/schedule-timeline";
import { VenueCard } from "@/components/features/wedding-details/venue-card";
import { VenueMap } from "@/components/features/wedding-details/venue-map";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";
import { buildCeremonyEvent, buildReceptionEvent } from "@/utils/calendar";

export function WeddingDetailsSection() {
  const {
    couple,
    ceremony,
    reception,
    schedule,
    weddingDate,
    weddingDateDisplay,
  } = weddingConfig;

  const ceremonyStart = weddingDate;
  const receptionStart = new Date(
    new Date(weddingDate).getTime() + 2 * 60 * 60 * 1000,
  ).toISOString();

  const ceremonyEvent = buildCeremonyEvent(
    couple.displayNames,
    ceremony.name,
    ceremony.address,
    ceremonyStart,
  );

  const receptionEvent = buildReceptionEvent(
    couple.displayNames,
    reception.name,
    reception.address,
    receptionStart,
  );

  return (
    <section
      id={SECTION_IDS.details}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="Wedding details"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="Wedding Details" subtitle="The Celebration" />

      <FadeUp delay={0.05}>
        <div className="mx-auto mb-12 flex max-w-2xl items-start justify-center gap-3 px-2 py-1">
          <p className="text-center text-sm leading-relaxed text-text/75">
            <span className="font-medium text-text">
              Kindly arrive 15–30 minutes early
            </span>{" "}
            so we can begin on time. We can&apos;t wait to celebrate with you on{" "}
            {weddingDateDisplay}.
          </p>
        </div>
      </FadeUp>

      <div className="mb-16 grid gap-6 md:grid-cols-2 md:gap-8">
        <VenueCard
          title="Ceremony"
          venue={ceremony}
          calendarEvent={ceremonyEvent}
          calendarFilename="wedding-ceremony.ics"
          delay={0.1}
        />
        <VenueCard
          title="Reception"
          venue={reception}
          calendarEvent={receptionEvent}
          calendarFilename="wedding-reception.ics"
          delay={0.2}
        />
      </div>

      <FadeUp delay={0.15}>
        <h3 className="mb-10 text-center font-serif text-2xl text-text md:text-3xl">
          Day Schedule
        </h3>
      </FadeUp>

      <div className="mb-16">
        <ScheduleTimeline items={schedule} />
      </div>

      <FadeUp delay={0.1}>
        <h3 className="mb-8 text-center font-serif text-2xl text-text md:text-3xl">
          Find Us
        </h3>
      </FadeUp>

      <VenueMap ceremony={ceremony} reception={reception} />
    </section>
  );
}
