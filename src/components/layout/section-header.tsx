import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 space-y-3",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-4",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-12 bg-primary/30" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.3em] text-primary/70">
          {subtitle}
        </span>
        <span className="h-px w-12 bg-primary/30" aria-hidden="true" />
      </div>
      <h2 className="font-serif text-3xl font-medium text-text md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}
