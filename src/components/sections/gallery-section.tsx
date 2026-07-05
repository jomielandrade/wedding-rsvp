"use client";

import { weddingConfig } from "@/config/wedding";
import {
  GalleryLightbox,
  useGalleryLightbox,
} from "@/components/features/gallery/gallery-lightbox";
import { GalleryMasonry } from "@/components/features/gallery/gallery-masonry";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";

export function GallerySection() {
  const { gallery } = weddingConfig;
  const lightbox = useGalleryLightbox();

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section
      id={SECTION_IDS.gallery}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="Photo gallery"
    >
      <div
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-secondary/25 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title="Our Gallery" subtitle="Captured Moments" />

      <FadeUp delay={0.05}>
        <p className="mx-auto mb-12 max-w-2xl text-center text-text/70">
          A glimpse into our journey together — moments of joy, laughter, and
          love we hold close to our hearts.
        </p>
      </FadeUp>

      <GalleryMasonry images={gallery} onImageClick={lightbox.open} />

      <GalleryLightbox
        images={gallery}
        activeIndex={lightbox.activeIndex}
        onClose={lightbox.close}
        onNavigate={lightbox.navigate}
      />
    </section>
  );
}
