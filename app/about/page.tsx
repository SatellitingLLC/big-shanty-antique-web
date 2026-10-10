import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { LandingPageRenderer } from "@/components/site/LandingPageRenderer";
import { getPublishedPage } from "@/lib/page-store";
import { getSiteUrl } from "@/lib/site-url";
import { connection } from "next/server";
import styles from "./page.module.css";

const siteUrl = getSiteUrl();
const description =
  "Learn how Big Shanty Antiques grew from a Kennesaw antique mall into a Marietta, Georgia destination for antiques and collectibles.";
const canonical = siteUrl ? new URL("/about", siteUrl).href : undefined;

export const metadata: Metadata = {
  title: "About | Big Shanty Antiques",
  description,
  alternates: canonical ? { canonical } : undefined,
  openGraph: {
    title: "About | Big Shanty Antiques",
    description,
    type: "website",
    siteName: "Big Shanty Antiques",
    ...(canonical ? { url: canonical } : {}),
  },
};

const chapters = [
  {
    num: "Chapter I",
    title: "Kennesaw, Georgia",
    description: "Big Shanty Antiques begins as a quality local antique mall.",
  },
  {
    num: "Chapter II",
    title: "A New Steward",
    description:
      "After changing hands a few times, Dwayne Bramlett buys the company, driven by his love of antiques and the game of buying and selling.",
  },
  {
    num: "Chapter III",
    title: "Raising the Standard",
    description:
      "Hard work and dedication lift the company's credibility and respect to heights unseen before, making it a known name on the Southeast antique circuit.",
  },
  {
    num: "Chapter IV",
    title: "Down the Road",
    description:
      "Too large for its first home, the business moves to a new location with a fresh, updated look and a massive warehouse for some of Georgia's most valuable antiques.",
  },
  {
    num: "Chapter V",
    title: "Today",
    description:
      "A destination antique mall in Marietta, with dealers and collectors visiting from across the Southeast.",
  },
];

export default async function AboutPage() {
  await connection();
  const page = await getPublishedPage("about");

  if (page.published) {
    return (
      <div className={`${styles.page} about-page`}>
        <SiteHeader currentPage="About" />
        <LandingPageRenderer page={page} />
        <SiteFooter />
      </div>
    );
  }

  // Fallback doubles as the GrapesJS seed source: the editor loads this
  // page's <main> into the canvas when no draft exists yet.
  return (
    <div className={`${styles.page} about-page`}>
      <SiteHeader currentPage="About" />

      <main>
        <header className={styles.phero} aria-labelledby="about-title">
          <svg className={styles.orn} viewBox="0 0 300 20" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M0 10h118M182 10h118" />
              <path d="M150 1l9 9-9 9-9-9z" />
              <circle cx="120" cy="10" r="1.4" />
              <circle cx="180" cy="10" r="1.4" />
            </g>
          </svg>
          <h1 id="about-title">Our Story</h1>
          <p className={styles.lede}>
            A little bit about how it all started, and how a Kennesaw antique mall became a
            name across the Southeast.
          </p>
        </header>

        <section className={styles.intro} aria-label="How Big Shanty Antiques started">
          <div className={styles.split}>
            <div className={styles.drop}>
              <p>
                Big Shanty Antiques was started long ago in Kennesaw, GA. A quality local
                antique mall that changed ownership a few times until Dwayne Bramlett
                purchased the company due to his love of antiques and the game of buying
                and selling.
              </p>
              <p>
                Revitalizing the local antique mall was no easy task, but with hard work
                and dedication we were able to raise the credibility and respect of the
                company to heights unseen before. Big Shanty Antiques has now become a
                known name in the Southeast antique market circuit and has continued to
                grow since.
              </p>
              <p>
                As the success continued, Big Shanty Antiques outgrew its first home and
                moved down the road to Marietta, opening a new location with a fresh and
                updated look alongside a massive warehouse for some of the most valuable
                antiques in Georgia.
              </p>
              <p>
                Today the showroom floor holds row after row of dealer booths, from fine
                furniture and advertising signs to primitives, collectibles, and one-of-a
                kind curiosities. Whether you are hunting for a single statement piece or
                spending the afternoon wandering the aisles, there is always a new find
                around the corner.
              </p>
            </div>
            <figure className={styles.archwrap}>
              <div className={styles.arch}>
                <img
                  src="/assets/about-carriage.jpg"
                  alt="Antique carriage on the showroom floor"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>From the showroom floor</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.chapters} aria-labelledby="chapters-title">
          <div className={styles.head}>
            <svg className={styles.orn} viewBox="0 0 300 20" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M0 10h118M182 10h118" />
                <path d="M150 1l9 9-9 9-9-9z" />
              </g>
            </svg>
            <h2 id="chapters-title">The Chapters</h2>
          </div>
          <ol className={styles.tl}>
            {chapters.map(({ num, title, description }) => (
              <li className={styles.ch} key={num}>
                <span className={styles.num}>{num}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.quote} aria-label="What Big Shanty Antiques is">
          <blockquote>Not just an antique mall.</blockquote>
          <p>A destination for dealers, collectors, and the simply curious.</p>
        </section>

        <section className={styles.gallery} aria-label="Inside the antique mall">
          <div className={styles.gal}>
            <figure>
              <div className={styles.plate}>
                <img
                  src="/assets/about-carriage.jpg"
                  alt="Antique carriage on the showroom floor"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>Treasures large and small</figcaption>
            </figure>
            <figure>
              <div className={styles.plate}>
                <img
                  src="/assets/about-cabinets.jpg"
                  alt="Antique cabinets and advertising signs"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>A new find around every corner</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="cta-title">
          <div className={styles.panel}>
            <svg className={styles.orn} viewBox="0 0 300 20" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M0 10h118M182 10h118" />
                <path d="M150 1l9 9-9 9-9-9z" />
              </g>
            </svg>
            <h2 id="cta-title">Come see for yourself</h2>
            <p>Browse the floor, ask about consigning, or just say hello.</p>
            <div className={styles.btns}>
              <Link className={styles.btn} href="/contact">
                Visit &amp; Contact
              </Link>
              <Link className={`${styles.btn} ${styles.ghost}`} href="/#services">
                Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
