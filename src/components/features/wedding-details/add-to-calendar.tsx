"use client";

import { Calendar, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/utils/calendar";
import {
  downloadIcsFile,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
} from "@/utils/calendar";

interface AddToCalendarProps {
  event: CalendarEvent;
  filename: string;
  label?: string;
}

export function AddToCalendar({
  event,
  filename,
  label = "Add to Calendar",
}: AddToCalendarProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Add ${event.title} to Google Calendar`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Google
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadIcsFile(event, filename)}
          aria-label={`Download ${event.title} for Apple Calendar`}
        >
          <Download className="h-3.5 w-3.5" />
          Apple
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a
            href={getOutlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Add ${event.title} to Outlook Calendar`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Outlook
          </a>
        </Button>
      </div>
    </div>
  );
}
