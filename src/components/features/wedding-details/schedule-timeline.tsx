"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { FadeUp } from "@/components/animations/motion-primitives";
import { cn } from "@/lib/utils";
import type { WeddingScheduleItem } from "@/types/wedding";

interface ScheduleTimelineProps {
  items: WeddingScheduleItem[];
}

export function ScheduleTimeline({ items }: ScheduleTimelineProps) {
  return (
    <div className="mx-auto max-w-lg" aria-label="Wedding day schedule">
      {items.map((item, index) => (
        <FadeUp key={`${item.title}-${index}`} delay={index * 0.12}>
          <div className="flex flex-col items-center text-center">
            {item.time && (
              <p className="font-serif text-lg font-medium text-primary">
                {item.time}
              </p>
            )}
            <h3 className="mt-1 font-serif text-xl text-text">{item.title}</h3>
            {item.description && (
              <p className="mt-2 max-w-sm text-sm text-text/60">
                {item.description}
              </p>
            )}

            {index < items.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className={cn("my-6 flex flex-col items-center gap-1 text-primary/40")}
                aria-hidden="true"
              >
                <span className="h-6 w-px bg-gradient-to-b from-primary/30 to-primary/10" />
                <ArrowDown className="h-4 w-4" />
                <span className="h-6 w-px bg-gradient-to-b from-primary/10 to-transparent" />
              </motion.div>
            )}
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
