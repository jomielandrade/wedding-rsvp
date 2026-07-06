import { ImageResponse } from "next/og";
import { weddingConfig } from "@/config/wedding";
import { ogImageContentType, ogImageSize } from "@/lib/seo";

export const alt = "Jomiel & Rojiely Wedding Invitation";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  const { couple, weddingDateDisplay, location } = weddingConfig;

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
            fontSize: 28,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#7a9ebe",
            marginBottom: 24,
          }}
        >
          Wedding Invitation
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            color: "#3a3a3a",
            marginBottom: 20,
          }}
        >
          {couple.displayNames}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#5f5f5f",
            marginBottom: 12,
          }}
        >
          {weddingDateDisplay}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#7a7a7a",
          }}
        >
          {location}
        </div>
      </div>
    ),
    { ...size },
  );
}
