import type { VenueDetails } from "@/types/wedding";

/** Reliable iframe embed URL — avoids fragile copy-pasted `pb` parameters. */
export function buildGoogleMapsEmbedUrl(query: string): string {
  const params = new URLSearchParams({
    q: query,
    hl: "en",
    z: "16",
    output: "embed",
  });

  return `https://www.google.com/maps?${params.toString()}`;
}

export function getVenueEmbedUrl(venue: VenueDetails): string {
  if (venue.mapsEmbedUrl) {
    return venue.mapsEmbedUrl;
  }

  return buildGoogleMapsEmbedUrl(`${venue.name}, ${venue.address}`);
}
