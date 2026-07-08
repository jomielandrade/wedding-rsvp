import { InvitationShell } from "@/components/invitation/invitation-shell";
import { CountdownSection } from "@/components/sections/countdown-section";
import { DressCodeSection } from "@/components/sections/dress-code-section";
import { FaqSection } from "@/components/sections/faq-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { GiftRegistrySection } from "@/components/sections/gift-registry-section";
import { GodparentsSection } from "@/components/sections/godparents-section";
import { StorySection } from "@/components/sections/story-section";
import { WeddingDetailsSection } from "@/components/sections/wedding-details-section";

export default function HomePage() {
  return (
    <InvitationShell>
      <CountdownSection />
      <StorySection />
      <WeddingDetailsSection />
      <DressCodeSection />
      <GodparentsSection />
      <GallerySection />
      <GiftRegistrySection />
      <FaqSection />
    </InvitationShell>
  );
}
