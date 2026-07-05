import { InvitationShell } from "@/components/invitation/invitation-shell";
import { CountdownSection } from "@/components/sections/countdown-section";

export default function HomePage() {
  return (
    <InvitationShell>
      <CountdownSection />
    </InvitationShell>
  );
}
