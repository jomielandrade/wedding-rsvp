"use client";

import Image from "next/image";
import { Gift } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { BankCard } from "@/components/features/gift-registry/bank-card";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";

export function GiftRegistrySection() {
  const { giftRegistry } = weddingConfig;
  const { banks, customImage, message } = giftRegistry;

  const activeBanks = banks.filter((bank) => bank.enabled !== false);

  return (
    <section
      id={SECTION_IDS.gifts}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="Gift registry"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-accent/50 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="Gift Registry" subtitle="With Gratitude" />

      <FadeUp>
        <div className="glass-card mx-auto max-w-3xl px-8 py-10 text-center md:px-12 md:py-14">
          <div
            className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/5"
            aria-hidden="true"
          >
            <Gift className="h-5 w-5 text-primary/70" />
          </div>

          <p className="font-serif text-lg leading-relaxed text-text/80 md:text-xl">
            {message}
          </p>
        </div>
      </FadeUp>

      {customImage && (
        <FadeUp delay={0.1}>
          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl">
            <Image
              src={customImage}
              alt="Gift registry"
              width={600}
              height={400}
              unoptimized
              className="h-auto w-full object-cover"
            />
          </div>
        </FadeUp>
      )}

      {activeBanks.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {activeBanks.map((bank, index) => (
            <BankCard key={bank.id} bank={bank} delay={0.1 + index * 0.1} />
          ))}
        </div>
      )}
    </section>
  );
}
