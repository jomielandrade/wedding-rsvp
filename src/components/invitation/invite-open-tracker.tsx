"use client";

import { useEffect, useRef } from "react";

interface InviteOpenTrackerProps {
  slug: string;
}

export function InviteOpenTracker({ slug }: InviteOpenTrackerProps) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    fetch(`/api/invite/${encodeURIComponent(slug)}/open`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Best-effort analytics; ignore network errors.
    });
  }, [slug]);

  return null;
}
