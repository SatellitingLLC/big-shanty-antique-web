import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { LandingPageRenderer } from "@/components/site/LandingPageRenderer";
import { getPublishedPage } from "@/lib/page-store";
import { connection } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import styles from "./page.module.css";
import { ContactForm } from "./ContactForm";
import { ContactStatus } from "./ContactStatus";

const siteUrl = getSiteUrl();
const canonical = siteUrl ? new URL("/contact", siteUrl).href : undefined;
const description =
  "Contact Big Shanty Antiques in Marietta, Georgia about buying, selling, consigning, or appraisals at our antique mall.";

export const metadata: Metadata = {
  title: "Contact | Big Shanty Antiques",
  description,
  alternates: canonical ? { canonical } : undefined,
  openGraph: {
    title: "Contact | Big Shanty Antiques",
    description,
    type: "website",
    siteName: "Big Shanty Antiques",
    ...(canonical ? { url: canonical } : {}),
  },
};

// Store hours, kept as one row per day so date and time stay separate.
const hours: Array<{ day: string; time: string }> = [
  { day: "Monday", time: "10 AM to 6 PM" },
  { day: "Tuesday", time: "10 AM to 6 PM" },
  { day: "Wednesday", time: "10 AM to 6 PM" },
  { day: "Thursday", time: "10 AM to 6 PM" },
  { day: "Friday", time: "10 AM to 6 PM" },
  { day: "Saturday", time: "10 AM to 6 PM" },
  { day: "Sunday", time: "12 PM to 6 PM" },
];

const MAPS_URL = "https://maps.google.com/?q=2932+Canton+Rd+Suite+110+Marietta+GA+30066";

export default async function ContactPage() {
  await connection();
  const page = await getPublishedPage("contact");

  if (page.published) {
    return (
      <div className={`${styles.page} contact-page`}>
        <SiteHeader currentPage="Contact" />
        <LandingPageRenderer page={page} />
        <SiteFooter />
      </div>
    );
  }

  // Fallback doubles as the GrapesJS seed source: the editor loads this
  // page's <main> into the canvas when no draft exists yet.
  return (
    <div className={`${styles.page} contact-page`}>
      <SiteHeader currentPage="Contact" />

      <main>
        <header className={styles.phero} aria-labelledby="contact-title">
          <svg className={styles.orn} viewBox="0 0 300 20" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M0 10h118M182 10h118" />
              <path d="M150 1l9 9-9 9-9-9z" />
              <circle cx="120" cy="10" r="1.4" />
              <circle cx="180" cy="10" r="1.4" />
            </g>
          </svg>
          <h1 id="contact-title">Send Word</h1>
          <p className={styles.lede}>
            Buying, selling, consigning or simply curious? We&apos;d be glad to hear from you.
          </p>
          <div className={styles.quick}>
            <a href="tel:7702312019">770-231-2019</a>
            <i aria-hidden="true" />
            <a href={MAPS_URL} rel="noopener" target="_blank">
              2932 Canton Road, Marietta
            </a>
          </div>
        </header>

        <section className={styles.contact} id="contact" aria-label="Contact Big Shanty Antiques">
          <div className={styles.cgrid}>
            <div className={styles.ccard}>
              <div className={styles.est}>Est. in Kennesaw, Georgia</div>
              <div className={styles.nm}>
                Big Shanty<em>Antiques</em>
              </div>
              <hr />
              <p className={styles.row}>
                2932 Canton Road, Suite 110<br />
                Marietta, Georgia 30066
              </p>
              <p className={styles.row}>
                <a href={MAPS_URL} rel="noopener" target="_blank">
                  Get directions
                </a>
              </p>
              <hr />
              <ul className={styles.hrs}>
                {hours.map(({ day, time }) => (
                  <li key={day}>
                    <span>{day}</span>
                    <i aria-hidden="true" />
                    <span>{time}</span>
                  </li>
                ))}
              </ul>
              <ContactStatus />
              <hr />
              <p className={styles.row}>
                Telephone <a href="tel:7702312019">770-231-2019</a>
              </p>
            </div>

            <div className={styles.cform} id="cform">
              <ContactForm />
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
