export interface CalendarEvent {
  title: string;
  description?: string;
  location: string;
  start: string;
  end: string;
}

function toUtcCalendarDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function encodeCalendarText(value: string): string {
  return encodeURIComponent(value);
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const dates = `${toUtcCalendarDate(event.start)}/${toUtcCalendarDate(event.end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    location: event.location,
  });

  if (event.description) {
    params.set("details", event.description);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: new Date(event.start).toISOString(),
    enddt: new Date(event.end).toISOString(),
    location: event.location,
  });

  if (event.description) {
    params.set("body", event.description);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function generateIcsContent(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding RSVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding-rsvp`,
    `DTSTAMP:${toUtcCalendarDate(new Date().toISOString())}`,
    `DTSTART:${toUtcCalendarDate(event.start)}`,
    `DTEND:${toUtcCalendarDate(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

export function downloadIcsFile(event: CalendarEvent, filename: string): void {
  const blob = new Blob([generateIcsContent(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildCeremonyEvent(
  coupleNames: string,
  venueName: string,
  venueAddress: string,
  startIso: string,
): CalendarEvent {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    title: `${coupleNames} — Civil Wedding Ceremony`,
    description: "Please arrive 15–30 minutes early.",
    location: `${venueName}, ${venueAddress}`,
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function buildReceptionEvent(
  coupleNames: string,
  venueName: string,
  venueAddress: string,
  startIso: string,
): CalendarEvent {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  return {
    title: `${coupleNames} — Wedding Reception`,
    description: "Celebration lunch with family and friends.",
    location: `${venueName}, ${venueAddress}`,
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
