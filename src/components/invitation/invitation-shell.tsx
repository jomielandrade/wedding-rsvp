"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HeroSection, useInvitationReveal } from "@/components/sections/hero-section";

interface InvitationShellProps {
  guestName?: string;
  children: React.ReactNode;
}

export function InvitationShell({ guestName, children }: InvitationShellProps) {
  const { isRevealed, openInvitation } = useInvitationReveal();

  return (
    <>
      <HeroSection
        guestName={guestName}
        onOpenInvitation={openInvitation}
        isRevealed={isRevealed}
      />

      <AnimatePresence>
        {isRevealed && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {children}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
