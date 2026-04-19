import "./globals.css";

import type { Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#570000",
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${newsreader.variable}`}>
      <body className="min-h-[100dvh] overflow-x-hidden bg-background font-sans text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
