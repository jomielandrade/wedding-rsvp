import { Clock, MapPin } from "lucide-react";
import { FadeUp } from "@/components/animations/motion-primitives";
import { AddToCalendar } from "@/components/features/wedding-details/add-to-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalendarEvent } from "@/utils/calendar";
import type { VenueDetails } from "@/types/wedding";

interface VenueCardProps {
  title: string;
  venue: VenueDetails;
  calendarEvent: CalendarEvent;
  calendarFilename: string;
  delay?: number;
}

export function VenueCard({
  title,
  venue,
  calendarEvent,
  calendarFilename,
  delay = 0,
}: VenueCardProps) {
  return (
    <FadeUp delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
            {title}
          </p>
          <CardTitle className="text-xl md:text-2xl">{venue.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start gap-3 text-sm text-text/70">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{venue.time}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-text/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{venue.address}</span>
          </div>

          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${venue.name} in Google Maps`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
          </Button>

          <AddToCalendar
            event={calendarEvent}
            filename={calendarFilename}
            label="Save the Date"
          />
        </CardContent>
      </Card>
    </FadeUp>
  );
}
