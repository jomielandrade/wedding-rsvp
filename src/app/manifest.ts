import type { MetadataRoute } from "next";
import { weddingConfig } from "@/config/wedding";

export default function manifest(): MetadataRoute.Manifest {
  const { couple } = weddingConfig;

  return {
    name: `${couple.displayNames} Wedding`,
    short_name: couple.displayNames,
    description: `Wedding invitation for ${couple.displayNames}`,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f6f3",
    theme_color: "#7a9ebe",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
