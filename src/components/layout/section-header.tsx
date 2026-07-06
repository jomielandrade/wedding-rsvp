"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-12 space-y-3",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {subtitle && (
        <div
          className={cn(
            "flex items-center gap-4",
            align === "center" && "justify-center",
          )}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-12 origin-center bg-primary/30"
            aria-hidden="true"
          />
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70">
            {subtitle}
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-12 origin-center bg-primary/30"
            aria-hidden="true"
          />
        </div>
      )}
      <h2 className="font-serif text-3xl font-medium text-text md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}
