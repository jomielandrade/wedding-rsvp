import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getWeddingMetadata } from "@/lib/seo";
import { greatVibes, playfair, poppins } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = getWeddingMetadata();

export const viewport: Viewport = {
  themeColor: "#7A9EBE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} ${greatVibes.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background text-text antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
