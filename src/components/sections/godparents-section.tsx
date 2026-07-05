"use client";

import { Users } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";
import type { GodparentGroup } from "@/types/wedding";

interface GodparentGroupCardProps {
  group: GodparentGroup;
  delay?: number;
}

function GodparentGroupCard({ group, delay = 0 }: GodparentGroupCardProps) {
  return (
    <FadeUp delay={delay}>
      <div className="glass-card h-full px-8 py-10 text-center">
        <div
          className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/5"
          aria-hidden="true"
        >
          <Users className="h-5 w-5 text-primary/70" />
        </div>

        <h3 className="font-serif text-2xl font-medium text-text md:text-3xl">
          {group.title}
        </h3>

        <ul className="mt-8 space-y-4" aria-label={`${group.title} names`}>
          {group.names.map((name) => (
            <li
              key={name}
              className="relative text-lg text-text/80 before:mr-2 before:text-primary before:content-['•']"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  );
}

export function GodparentsSection() {
  const { godparents } = weddingConfig;

  return (
    <section
      id={SECTION_IDS.godparents}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="Godparents and principal sponsors"
    >
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader
        title="Our Godparents"
        subtitle="Principal Sponsors"
      />

      <FadeUp delay={0.05}>
        <p className="mx-auto mb-14 max-w-2xl text-center text-text/70">
          With grateful hearts, we honor our godparents who stand with us on this
          special day — guiding us with love, wisdom, and prayer.
        </p>
      </FadeUp>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
        {godparents.map((group, index) => (
          <GodparentGroupCard
            key={group.title}
            group={group}
            delay={0.1 + index * 0.15}
          />
        ))}
      </div>
    </section>
  );
}
