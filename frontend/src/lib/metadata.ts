import type { Metadata } from "next";
import { siteConfig as brand } from "@/lib/config";

export const siteConfig = {
  name: brand.name,
  description: brand.description,
  url: brand.url,
  ogImage: "/icon.svg",
  creator: brand.twitter,
  authors: [{ name: "Servo", url: brand.url }],
  keywords: [
    "Servo",
    "Flare",
    "Coston2",
    "FDC",
    "FTSO",
    "FAssets",
    "XRPL",
    "standing orders",
    "recurring payments",
    "DCA",
  ],
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export function createMetadata(overrides: Partial<Metadata> & { title: string }): Metadata {
  return {
    ...baseMetadata,
    ...overrides,
    openGraph: {
      ...baseMetadata.openGraph,
      ...(overrides.openGraph ?? {}),
      title: overrides.title,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...(overrides.twitter ?? {}),
      title: overrides.title,
    },
  };
}
