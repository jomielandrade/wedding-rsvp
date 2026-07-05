import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/invitation/invitation-shell";
import { CountdownSection } from "@/components/sections/countdown-section";
import { GodparentsSection } from "@/components/sections/godparents-section";
import { StorySection } from "@/components/sections/story-section";
import { WeddingDetailsSection } from "@/components/sections/wedding-details-section";
import { weddingConfig } from "@/config/wedding";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return weddingConfig.guests.map((guest) => ({ slug: guest.slug }));
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const guest = weddingConfig.guests.find((g) => g.slug === slug);

  if (!guest) {
    notFound();
  }

  return (
    <InvitationShell guestName={guest.fullName}>
      <CountdownSection />
      <StorySection />
      <WeddingDetailsSection />
      <GodparentsSection />
    </InvitationShell>
  );
}
