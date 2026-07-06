"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrDownloadButtonProps {
  src: string;
  bankName: string;
}

function getFilename(bankName: string, src: string) {
  const extension = src.split(".").pop()?.toLowerCase() ?? "png";
  const slug = bankName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "bank"}-qr.${extension}`;
}

export function QrDownloadButton({ src, bankName }: QrDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    setDownloading(true);

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFilename(bankName, src);
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full"
      onClick={() => void onDownload()}
      disabled={downloading}
    >
      <Download className="size-4" aria-hidden />
      {downloading ? "Downloading..." : "Download QR"}
    </Button>
  );
}
