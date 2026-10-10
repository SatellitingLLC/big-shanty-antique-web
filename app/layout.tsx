import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Big Shanty Antiques",
  description:
    "Big Shanty Antiques serves Marietta and Georgia with an antique mall, auctions, estate sales, appraisals, and collectibles.",
  metadataBase: siteUrl ?? undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
