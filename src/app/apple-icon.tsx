import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #7a9ebe 0%, #afc4d3 100%)",
          color: "#ffffff",
          fontSize: 88,
          fontWeight: 700,
        }}
      >
        &
      </div>
    ),
    { ...size },
  );
}
