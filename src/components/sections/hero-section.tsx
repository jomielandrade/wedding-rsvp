"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/animations/floating-particles";
import { FadeIn } from "@/components/animations/motion-primitives";
import { SECTION_IDS } from "@/lib/constants";

interface HeroSectionProps {
  guestName?: string;
  onOpenInvitation: () => void;
  isRevealed: boolean;
}

export function HeroSection({
  guestName,
  onOpenInvitation,
  isRevealed,
}: HeroSectionProps) {
  const { couple, weddingDateDisplay } = weddingConfig;

  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      aria-label="Wedding invitation hero"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-floral.svg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/90" />
      </div>

      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {guestName && (
            <FadeIn delay={0.1}>
              <p className="text-sm uppercase tracking-[0.25em] text-text/70">
                Dear {guestName},
              </p>
            </FadeIn>
          )}

          <FadeIn delay={0.2}>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/80">
              We&apos;re getting married
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <h1 className="font-script text-6xl leading-tight text-text sm:text-7xl md:text-8xl lg:text-9xl">
              {couple.partnerOne}
              <span className="mx-3 font-serif text-3xl text-primary sm:text-4xl md:text-5xl">
                &
              </span>
              {couple.partnerTwo}
            </h1>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="font-serif text-xl text-text/80 md:text-2xl">
              {weddingDateDisplay}
            </p>
          </FadeIn>

          <AnimatePresence>
            {!isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={onOpenInvitation}
                  className="mt-4 min-w-[220px]"
                  aria-label="Open wedding invitation"
                >
                  Open Invitation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export function useInvitationReveal() {
  const [isRevealed, setIsRevealed] = useState(false);

  const openInvitation = useCallback(() => {
    setIsRevealed(true);
    window.setTimeout(() => {
      document.getElementById(SECTION_IDS.countdown)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 400);
  }, []);

  return { isRevealed, openInvitation };
}
