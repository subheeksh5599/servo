import type { Metadata } from "next";
import { Anek_Latin, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anek = Anek_Latin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anek",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
    <html lang="en" className={`${anek.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
