import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Standing Orders — Sign once. Your XRP works forever.",
  description:
    "Recurring money for XRP, built on Flare. One XRPL signature sets up dollar-cost averaging, subscriptions, and auto-sweep. A strategy agent routes your capital to the best yield venue — and only ever asks permission.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${space.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
