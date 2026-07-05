"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/config/wedding";

export default function LoadingScreen() {
  const { couple } = weddingConfig;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.p
          className="font-script text-5xl text-primary md:text-6xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {couple.displayNames}
        </motion.p>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-text/50">
          Loading invitation
        </p>
      </motion.div>
    </div>
  );
}
