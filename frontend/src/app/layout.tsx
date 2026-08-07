import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";

/**
 * Gambarino carries the display line: narrow, sharp-wedged, inscriptional.
 * One weight, used with conviction.
 */
const gambarino = localFont({
  variable: "--font-gambarino",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [{ path: "./fonts/Gambarino-Regular.woff2", weight: "400", style: "normal" }],
});

/**
 * Sentient runs everything else: body copy, labels, navigation, buttons.
 * Setting the body in a text serif makes the page read as a document about
 * how the money actually works, not as a product landing page.
 */
const sentient = localFont({
  variable: "--font-sentient",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    { path: "./fonts/Sentient-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Sentient-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Sentient-Medium.woff2", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Servo · Sign once. Your XRP works forever.",
  description:
    "Recurring money for XRP, built on Flare. One XRPL signature sets up dollar-cost averaging, subscriptions, and auto-sweep. A strategy agent routes your capital to the best yield venue — and only ever asks permission.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${gambarino.variable} ${sentient.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
