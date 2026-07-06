import type { Metadata } from "next";
import { weddingConfig } from "@/config/wedding";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function getWeddingMetadata(): Metadata {
  const { couple, weddingDateDisplay, location } = weddingConfig;

  const title = `${couple.displayNames} | Wedding Invitation`;
  const description = `Join ${couple.displayNames} on ${weddingDateDisplay} in ${location}.`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${couple.displayNames}`,
    },
    description,
    keywords: [
      "wedding",
      "invitation",
      couple.displayNames,
      couple.partnerOne,
      couple.partnerTwo,
      weddingDateDisplay,
      location,
      couple.hashtag ?? "",
    ].filter(Boolean),
    authors: [{ name: couple.displayNames }],
    creator: couple.displayNames,
    openGraph: {
      title: `${couple.displayNames} Wedding Invitation`,
      description: `You're invited to celebrate with us on ${weddingDateDisplay}.`,
      type: "website",
      locale: "en_PH",
      siteName: `${couple.displayNames} Wedding`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${couple.displayNames} Wedding Invitation`,
      description: `Join us on ${weddingDateDisplay}.`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/",
    },
  };
}

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export const ogImageContentType = "image/png";
