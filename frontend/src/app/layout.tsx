import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en" className={`${anton.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
