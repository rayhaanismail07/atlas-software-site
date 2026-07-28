import type { Metadata, Viewport } from "next";
import "./globals.css";

import { siteConfig } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlassoftware.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Atlas Software | Your vision, engineered",
    template: "%s | Atlas Software",
  },
  description: siteConfig.description,
  keywords: [
    "software development South Africa",
    "full-stack development",
    "business automation",
    "data analytics",
    "cloud solutions",
    "Atlas Software",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Atlas Software | Your vision, engineered",
    description: siteConfig.description,
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName: "Atlas Software",
    images: [
      {
        url: "/images/atlas-social-poster.png",
        width: 1024,
        height: 1024,
        alt: "Atlas Software — Your vision, engineered",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Software | Your vision, engineered",
    description: siteConfig.description,
    images: ["/images/atlas-social-poster.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050608",
  colorScheme: "dark",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
