"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/motion-primitives";
import { SECTION_IDS } from "@/lib/constants";

interface HeroSectionProps {
  guestName?: string;
  isInvite?: boolean;
  onOpenInvitation: () => void;
  isRevealed: boolean;
}

export function HeroSection({
  guestName,
  isInvite = false,
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
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero-floral.svg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/15 to-background/70 md:via-background/25 md:to-background/80" />
      </div>

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
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span
                className="h-px w-10 bg-primary/35 sm:w-14"
                aria-hidden="true"
              />
              <p className="text-xs uppercase tracking-[0.35em] text-primary sm:tracking-[0.4em]">
                We&apos;re getting married
              </p>
              <span
                className="h-px w-10 bg-primary/35 sm:w-14"
                aria-hidden="true"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <h1 className="font-script text-6xl leading-tight text-text drop-shadow-sm sm:text-7xl md:text-8xl lg:text-9xl">
              {couple.partnerOne}
              <span className="mx-2 font-serif text-3xl text-primary sm:mx-3 sm:text-4xl md:text-5xl">
                &
              </span>
              {couple.partnerTwo}
            </h1>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col items-center gap-3">
              <span
                className="h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:w-24"
                aria-hidden="true"
              />
              <p className="font-serif text-xl text-text/85 md:text-2xl">
                {weddingDateDisplay}
              </p>
            </div>
          </FadeIn>

          <AnimatePresence>
            {isInvite && !isRevealed && (
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

          {!isInvite && (
            <FadeIn delay={0.65}>
              <div className="mt-10 flex flex-col items-center gap-2 text-primary">
                <p className="text-xs uppercase tracking-[0.2em]">
                  Scroll to continue
                </p>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden
                >
                  <ChevronDown className="size-5" />
                </motion.div>
              </div>
            </FadeIn>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function useInvitationReveal(autoReveal = false) {
  const [isRevealed, setIsRevealed] = useState(autoReveal);

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
