"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { FadeUp } from "@/components/animations/motion-primitives";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/wedding";

interface GalleryMasonryProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

const THUMB_QUALITY = 75;

function MasonryImage({
  image,
  index,
}: {
  image: GalleryImage;
  index: number;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl bg-accent/40 text-sm text-text/50"
        role="img"
        aria-label={image.alt}
      >
        Photo unavailable
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={THUMB_QUALITY}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 45vw, 280px"
        onError={() => setHasError(true)}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md">
          <ZoomIn className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export function GalleryMasonry({ images, onImageClick }: GalleryMasonryProps) {
  return (
    <div
      className={cn(
        "columns-2 gap-4 md:columns-3 md:gap-5",
        "[&>*]:mb-4 md:[&>*]:mb-5",
      )}
      aria-label="Photo gallery"
    >
      {images.map((image, index) => (
        <FadeUp key={image.id} delay={Math.min(index, 4) * 0.05} className="break-inside-avoid">
          <motion.button
            type="button"
            onClick={() => onImageClick(index)}
            className="group relative block w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            aria-label={`View ${image.alt}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <MasonryImage image={image} index={index} />
          </motion.button>
        </FadeUp>
      ))}
    </div>
  );
}
