"use client";

import { weddingConfig } from "@/config/wedding";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SECTION_IDS } from "@/lib/constants";

export function FaqSection() {
  const { faq } = weddingConfig;

  if (!faq.length) return null;

  return (
    <section
      id={SECTION_IDS.faq}
      className="section-padding relative mx-auto max-w-5xl overflow-hidden"
      aria-label="Frequently asked questions"
    >
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-accent/35 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="Frequently Asked Questions" subtitle="FAQ" />

      <FadeUp delay={0.05}>
        <div className="glass-card mx-auto px-6 py-2 md:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </FadeUp>
    </section>
  );
}
