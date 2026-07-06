"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@/types/wedding";

interface GalleryLightboxProps {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const isOpen = activeIndex !== null;
  const current = activeIndex !== null ? images[activeIndex] : null;

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goPrev, goNext]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[95vh] max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-4xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          {current ? `Gallery image: ${current.alt}` : "Gallery image"}
        </DialogTitle>

        {current && (
          <div className="relative flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="relative max-h-[80vh] w-full overflow-hidden rounded-2xl"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={Math.min(current.width, 1400)}
                  height={Math.round(
                    (current.height * Math.min(current.width, 1400)) /
                      current.width,
                  )}
                  quality={85}
                  sizes="(max-width: 768px) 95vw, 900px"
                  className="mx-auto max-h-[80vh] w-auto object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <p className="mt-4 text-center text-sm text-white/80">{current.alt}</p>

            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="border-white/30 bg-black/40 text-white hover:bg-black/60"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-white/70">
                  {(activeIndex ?? 0) + 1} / {images.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goNext}
                  aria-label="Next image"
                  className="border-white/30 bg-black/40 text-white hover:bg-black/60"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface UseGalleryLightboxResult {
  activeIndex: number | null;
  open: (index: number) => void;
  close: () => void;
  navigate: (index: number) => void;
}

export function useGalleryLightbox(): UseGalleryLightboxResult {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return {
    activeIndex,
    open: setActiveIndex,
    close: () => setActiveIndex(null),
    navigate: setActiveIndex,
  };
}
