import type { Metadata, Viewport } from "next";
import { weddingConfig } from "@/config/wedding";
import { greatVibes, playfair, poppins } from "@/lib/fonts";
import "./globals.css";

const { couple, weddingDateDisplay, location } = weddingConfig;

export const metadata: Metadata = {
  title: `${couple.displayNames} | Wedding Invitation`,
  description: `Join ${couple.displayNames} on ${weddingDateDisplay} in ${location}.`,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: `${couple.displayNames} Wedding Invitation`,
    description: `You're invited to celebrate with us on ${weddingDateDisplay}.`,
    type: "website",
    locale: "en_PH",
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
};

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
      </body>
    </html>
  );
}
