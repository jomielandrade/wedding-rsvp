"use client";

import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/config/wedding";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { useCountdown } from "@/hooks/use-countdown";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { padCountdownUnit } from "@/utils/countdown";

interface CountdownUnitProps {
  value: number;
  label: string;
  delay?: number;
  mounted: boolean;
}

function CountdownUnit({ value, label, delay = 0, mounted }: CountdownUnitProps) {
  const display = mounted ? padCountdownUnit(value) : "--";

  return (
    <FadeUp delay={delay} className="flex-1">
      <div className="glass-card group relative overflow-hidden px-4 py-8 text-center transition-shadow duration-300 hover:shadow-md md:px-6 md:py-10">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div
          className="relative flex h-16 items-center justify-center overflow-hidden md:h-20"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl font-medium tabular-nums text-text md:text-6xl lg:text-7xl"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>

        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-primary/70">
          {label}
        </p>
      </div>
    </FadeUp>
  );
}

function CountdownSkeleton() {
  const labels = ["Days", "Hours", "Minutes", "Seconds"];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {labels.map((label) => (
        <div
          key={label}
          className="glass-card animate-pulse px-4 py-8 text-center md:px-6 md:py-10"
          aria-hidden="true"
        >
          <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 md:h-20 md:w-20" />
          <div className="mx-auto mt-3 h-3 w-16 rounded bg-primary/10" />
        </div>
      ))}
    </div>
  );
}

export function CountdownSection() {
  const { weddingDate, weddingDateDisplay, weddingTime, couple } = weddingConfig;
  const { days, hours, minutes, seconds, isComplete, mounted } =
    useCountdown(weddingDate);

  const units = [
    { value: days, label: "Days", delay: 0.1 },
    { value: hours, label: "Hours", delay: 0.2 },
    { value: minutes, label: "Minutes", delay: 0.3 },
    { value: seconds, label: "Seconds", delay: 0.4 },
  ];

  return (
    <section
      id={SECTION_IDS.countdown}
      className="section-padding relative mx-auto flex min-h-[100dvh] max-w-6xl scroll-mt-0 flex-col justify-center overflow-hidden"
      aria-label="Wedding countdown"
    >
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="Counting Down" subtitle="Save the Date" />

      <FadeUp delay={0.05}>
        <p className="mx-auto mb-12 max-w-xl text-center text-text/70">
          Join us as we celebrate our love on{" "}
          <span className="font-medium text-text">{weddingDateDisplay}</span> at{" "}
          <span className="font-medium text-text">{weddingTime}</span>
        </p>
      </FadeUp>

      {!mounted ? (
        <div aria-label="Loading countdown">
          <CountdownSkeleton />
        </div>
      ) : isComplete ? (
        <FadeUp>
          <div className="glass-card mx-auto max-w-2xl px-8 py-14 text-center">
            <p className="font-script text-5xl text-primary md:text-6xl">
              Today&apos;s the Day!
            </p>
            <p className="mt-4 font-serif text-xl text-text/80">
              {couple.displayNames} are getting married
            </p>
          </div>
        </FadeUp>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6",
            "mx-auto max-w-4xl",
          )}
          role="timer"
          aria-label={`Countdown to wedding on ${weddingDateDisplay}`}
        >
          {units.map((unit) => (
            <CountdownUnit
              key={unit.label}
              value={unit.value}
              label={unit.label}
              delay={unit.delay}
              mounted={mounted}
            />
          ))}
        </div>
      )}

      {mounted && !isComplete && (
        <FadeUp delay={0.5}>
          <p className="mt-10 text-center text-sm text-text/50">
            Until we say &ldquo;I do&rdquo;
          </p>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-primary/50">
            Scroll to continue
          </p>
        </FadeUp>
      )}
    </section>
  );
}
