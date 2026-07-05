import { InvitationShell } from "@/components/invitation/invitation-shell";
import { CountdownSection } from "@/components/sections/countdown-section";
import { StorySection } from "@/components/sections/story-section";
import { WeddingDetailsSection } from "@/components/sections/wedding-details-section";

export default function HomePage() {
  return (
    <InvitationShell>
      <CountdownSection />
      <StorySection />
      <WeddingDetailsSection />
    </InvitationShell>
  );
}
