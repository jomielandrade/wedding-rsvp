"use client";

import { AnimatePresence, motion } from "framer-motion";
import { InviteOpenTracker } from "@/components/invitation/invite-open-tracker";
import { HeroSection, useInvitationReveal } from "@/components/sections/hero-section";

interface InvitationShellProps {
  guestName?: string;
  inviteSlug?: string;
  children: React.ReactNode;
}

export function InvitationShell({
  guestName,
  inviteSlug,
  children,
}: InvitationShellProps) {
  const isInvite = Boolean(guestName);
  const { isRevealed, openInvitation } = useInvitationReveal(!isInvite);

  return (
    <>
      {inviteSlug ? <InviteOpenTracker slug={inviteSlug} /> : null}
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
