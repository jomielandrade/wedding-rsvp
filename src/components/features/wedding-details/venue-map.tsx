"use client";

import { useState } from "react";
import { FadeUp } from "@/components/animations/motion-primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getVenueEmbedUrl } from "@/utils/maps";
import type { VenueDetails } from "@/types/wedding";

interface VenueMapProps {
  ceremony: VenueDetails;
  reception: VenueDetails;
}

type VenueTab = "ceremony" | "reception";

export function VenueMap({ ceremony, reception }: VenueMapProps) {
  const [activeTab, setActiveTab] = useState<VenueTab>("ceremony");

  const venues = {
    ceremony,
    reception,
  };

  const activeVenue = venues[activeTab];

  return (
    <FadeUp delay={0.2}>
      <div className="space-y-4">
        <div
          className="flex justify-center gap-2"
          role="tablist"
          aria-label="Select venue map"
        >
          {(["ceremony", "reception"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`map-panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        <div
          id={`map-panel-${activeTab}`}
          role="tabpanel"
          aria-label={`Map of ${activeVenue.name}`}
          className={cn(
            "glass-card overflow-hidden",
            "aspect-[4/3] w-full md:aspect-[16/9]",
          )}
        >
          <iframe
            key={activeTab}
            src={getVenueEmbedUrl(activeVenue)}
            title={`Map showing ${activeVenue.name}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <p className="text-center text-sm text-text/60">{activeVenue.name}</p>
      </div>
    </FadeUp>
  );
}
