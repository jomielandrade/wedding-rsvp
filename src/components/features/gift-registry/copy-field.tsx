"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
  label: string;
  value: string;
  className?: string;
}

export function CopyField({ label, value, className }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — fail silently
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
        {label}
      </p>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-white/50 px-4 py-3">
        <span className="font-medium text-text">{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
