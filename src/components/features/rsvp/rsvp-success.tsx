"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import type { AttendanceStatus } from "@/types/wedding";

interface RsvpSuccessProps {
  attendance: AttendanceStatus;
  guestName?: string;
  celebrate?: boolean;
}

export function RsvpSuccess({
  attendance,
  guestName,
  celebrate = true,
}: RsvpSuccessProps) {
  const { couple } = weddingConfig;
  const isAttending = attendance === "attending";

  useEffect(() => {
    if (!isAttending || !celebrate) return;

    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#7A9EBE", "#AFC4D3", "#D9E4EC", "#F8F6F3"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#7A9EBE", "#AFC4D3", "#D9E4EC", "#F8F6F3"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [isAttending, celebrate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card mx-auto max-w-2xl px-8 py-14 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        {isAttending ? (
          <Heart className="h-8 w-8 fill-primary/20 text-primary" />
        ) : (
          <Check className="h-8 w-8 text-primary" />
        )}
      </motion.div>

      <h3 className="font-script text-4xl text-primary md:text-5xl">
        {isAttending ? "See You There!" : "Thank You"}
      </h3>

      <p className="mt-4 font-serif text-lg text-text/80">
        {isAttending ? (
          <>
            {guestName ? `${guestName}, ` : ""}
            we&apos;re delighted you&apos;ll be celebrating with {couple.displayNames}.
          </>
        ) : (
          <>
            Thank you for letting us know, {guestName ?? "friend"}. You&apos;ll be
            in our thoughts on our special day.
          </>
        )}
      </p>

      <p className="mt-3 text-sm text-text/50">
        Your RSVP has been received.
      </p>
    </motion.div>
  );
}
