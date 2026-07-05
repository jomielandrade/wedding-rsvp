"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { StoryMilestone } from "@/types/wedding";

interface StoryTimelineItemProps {
  milestone: StoryMilestone;
  index: number;
  isLast: boolean;
}

function StoryTimelineItem({ milestone, index, isLast }: StoryTimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <FadeUp delay={index * 0.15} className="relative">
      <div
        className={cn(
          "grid grid-cols-[auto_1fr] gap-x-6 md:grid-cols-[1fr_auto_1fr] md:gap-x-8",
          !isLast && "pb-12 md:pb-16",
        )}
      >
        {/* Left column — desktop only */}
        <div
          className={cn(
            "hidden md:flex md:items-start md:justify-end md:pt-2",
            isEven ? "md:opacity-100" : "md:opacity-0 md:pointer-events-none",
          )}
        >
          {isEven && (
            <div className="glass-card max-w-sm px-6 py-5 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
                {milestone.date}
              </p>
              <h3 className="mt-2 font-serif text-xl font-medium text-text">
                {milestone.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text/70">
                {milestone.description}
              </p>
            </div>
          )}
        </div>

        {/* Timeline marker */}
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background shadow-sm"
            aria-hidden="true"
          >
            <Heart className="h-4 w-4 fill-primary/20 text-primary" />
          </motion.div>

          {!isLast && (
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-10 h-full w-px origin-top bg-gradient-to-b from-primary/40 to-primary/10"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Right column — mobile + odd desktop items */}
        <div className="pt-1 md:pt-2">
          <div className={cn("glass-card px-6 py-5", !isEven ? "md:block" : "md:hidden")}>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
              {milestone.date}
            </p>
            <h3 className="mt-2 font-serif text-xl font-medium text-text">
              {milestone.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text/70">
              {milestone.description}
            </p>
          </div>

          {/* Desktop even items show on left; hide mobile duplicate styling handled above */}
        </div>
      </div>
    </FadeUp>
  );
}

export function StorySection() {
  const { story, couple } = weddingConfig;

  return (
    <section
      id={SECTION_IDS.story}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="Our love story"
    >
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="Our Story" subtitle="How We Got Here" />

      <FadeUp delay={0.05}>
        <p className="mx-auto mb-14 max-w-2xl text-center text-text/70">
          Every love story is beautiful, but ours is our favorite. Here are the
          moments that brought {couple.partnerOne} and {couple.partnerTwo}{" "}
          together.
        </p>
      </FadeUp>

      <ol className="relative mx-auto max-w-4xl list-none" aria-label="Relationship timeline">
        {story.map((milestone, index) => (
          <li key={milestone.id}>
            <StoryTimelineItem
              milestone={milestone}
              index={index}
              isLast={index === story.length - 1}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
