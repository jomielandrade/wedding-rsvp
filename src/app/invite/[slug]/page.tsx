import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/invitation/invitation-shell";
import { CountdownSection } from "@/components/sections/countdown-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { GiftRegistrySection } from "@/components/sections/gift-registry-section";
import { GodparentsSection } from "@/components/sections/godparents-section";
import { RsvpSection } from "@/components/sections/rsvp-section";
import { StorySection } from "@/components/sections/story-section";
import { WeddingDetailsSection } from "@/components/sections/wedding-details-section";
import { getGuestBySlug } from "@/lib/guests";
import {
  findRsvpByInviteSlug,
  isSupabaseConfigured,
} from "@/services/rsvp.service";
import type { AttendanceStatus } from "@/types/wedding";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  let existingAttendance: AttendanceStatus | null = null;

  if (isSupabaseConfigured()) {
    const { data } = await findRsvpByInviteSlug(guest.slug);
    if (data?.attendance === "attending" || data?.attendance === "declining") {
      existingAttendance = data.attendance;
    }
  }

  return (
    <InvitationShell guestName={guest.fullName}>
      <CountdownSection />
      <StorySection />
      <WeddingDetailsSection />
      <GodparentsSection />
      <GallerySection />
      <GiftRegistrySection />
      <RsvpSection
        inviteSlug={guest.slug}
        guestName={guest.fullName}
        maxGuests={guest.maxGuests}
        existingAttendance={existingAttendance}
      />
    </InvitationShell>
  );
}
