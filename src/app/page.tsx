import { InvitationShell } from "@/components/invitation/invitation-shell";
import { CountdownSection } from "@/components/sections/countdown-section";
import { StorySection } from "@/components/sections/story-section";

export default function HomePage() {
  return (
    <InvitationShell>
      <CountdownSection />
      <StorySection />
    </InvitationShell>
  );
}
