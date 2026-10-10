import type { Metadata } from "next";
import { connection } from "next/server";

import { LandingPageRenderer } from "@/components/site/LandingPageRenderer";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getPublishedPage } from "@/lib/page-store";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage("home");
  const siteUrl = getSiteUrl();
  const logoUrl = siteUrl ? new URL("/assets/logo.png", siteUrl).href : undefined;
  return {
    title: page.title,
    description: page.description,
    alternates: siteUrl ? { canonical: siteUrl.href } : undefined,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      siteName: "Big Shanty Antiques",
      ...(siteUrl ? { url: siteUrl.href } : {}),
      ...(logoUrl
        ? {
            images: [
              {
                url: logoUrl,
                width: 2066,
                height: 1436,
                alt: "Big Shanty Antiques logo",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
      ...(logoUrl ? { images: [logoUrl] } : {}),
    },
  };
}

export default async function HomePage() {
  await connection();
  const page = await getPublishedPage("home");
  const siteUrl = getSiteUrl();
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Big Shanty Antiques",
    description: page.description,
    telephone: "+1-770-231-2019",
    email: "dwaynesantiques@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2932 Canton Rd",
      addressLocality: "Marietta",
      addressRegion: "GA",
      postalCode: "30066",
      addressCountry: "US",
    },
    ...(siteUrl
      ? {
          "@id": new URL("/#business", siteUrl).href,
          url: siteUrl.href,
          image: new URL("/assets/logo.png", siteUrl).href,
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(business).replace(/</g, "\\u003c"),
        }}
      />
      <div className="home-shell">
        <SiteHeader currentPage="Home" />
        <LandingPageRenderer page={page} />
        <SiteFooter />
      </div>
    </>
  );
}
