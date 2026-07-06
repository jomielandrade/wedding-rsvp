"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HeroSection, useInvitationReveal } from "@/components/sections/hero-section";

interface InvitationShellProps {
  guestName?: string;
  children: React.ReactNode;
}

export function InvitationShell({ guestName, children }: InvitationShellProps) {
  const isInvite = Boolean(guestName);
  const { isRevealed, openInvitation } = useInvitationReveal(!isInvite);

  return (
    <>
      <HeroSection
        guestName={guestName}
        isInvite={isInvite}
        onOpenInvitation={openInvitation}
        isRevealed={isRevealed}
      />

      <AnimatePresence>
        {isRevealed && (
          <motion.main
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {children}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
