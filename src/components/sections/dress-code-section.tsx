import { weddingConfig } from "@/config/wedding";
import { FadeUp } from "@/components/animations/motion-primitives";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTION_IDS } from "@/lib/constants";

export function DressCodeSection() {
  const { dressCode } = weddingConfig;

  return (
    <section
      id={SECTION_IDS.dressCode}
      className="section-padding relative mx-auto max-w-6xl overflow-hidden"
      aria-label="Dress code"
    >
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-secondary/25 blur-3xl"
        aria-hidden="true"
      />

      <SectionHeader title={dressCode.title} subtitle="What to Wear" />

      <FadeUp delay={0.05}>
        <p className="mx-auto mb-10 max-w-xl text-center text-text/75">
          {dressCode.description}
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <ul
          className="mx-auto grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8"
          aria-label="Suggested dress code colors"
        >
          {dressCode.colors.map((color) => (
            <li key={color.id} className="flex flex-col items-center gap-3">
              <span
                className="size-14 rounded-full border border-white/70 shadow-md ring-1 ring-black/5 sm:size-16"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <span className="text-center text-xs font-medium tracking-wide text-text/70 sm:text-sm">
                {color.name}
              </span>
            </li>
          ))}
        </ul>
      </FadeUp>

      <FadeUp delay={0.15}>
        <p className="mx-auto mt-10 max-w-md text-center text-sm text-text/60">
          We&apos;d love to see you in soft, earthy tones that match our
          celebration.
        </p>
      </FadeUp>
    </section>
  );
}
