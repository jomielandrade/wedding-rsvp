import { ImageResponse } from "next/og";
import { weddingConfig } from "@/config/wedding";
import { getGuestBySlug } from "@/lib/guests";
import { ogImageContentType, ogImageSize } from "@/lib/seo";

interface InviteOgImageProps {
  params: Promise<{ slug: string }>;
}

export const alt = "Personal wedding invitation";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function InviteOpenGraphImage({
  params,
}: InviteOgImageProps) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  const { couple, weddingDateDisplay } = weddingConfig;

  const guestLine = guest
    ? `Dear ${guest.fullName},`
    : "You're invited";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #f8f6f3 0%, #d9e4ec 45%, #afc4d3 100%)",
          padding: "64px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#7a9ebe",
            marginBottom: 18,
          }}
        >
          {guestLine}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            color: "#3a3a3a",
            marginBottom: 18,
          }}
        >
          {couple.displayNames}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#5f5f5f",
          }}
        >
          {weddingDateDisplay}
        </div>
      </div>
    ),
    { ...size },
  );
}
