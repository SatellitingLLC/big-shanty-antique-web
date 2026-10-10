"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getStoreStatus, parseStoreHours } from "@/lib/store-hours";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ currentPage }: { currentPage?: "Home" | "About" | "Team" | "Contact" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Checking hours");
  const [dotState, setDotState] = useState<"open" | "closed" | null>(null);

  useEffect(() => {
    // Run after paint, mirroring the reference script that swaps
    // "Checking hours" for the live status once the page loads.
    // Re-checks every minute so the badge flips at open/close time.
    // Hours come from NEXT_PUBLIC_STORE_HOURS_* env vars, interpreted in
    // America/New_York (EST/EDT); see lib/store-hours.ts.
    const update = () => {
      try {
        const next = getStoreStatus(parseStoreHours(process.env));
        setStatus(next.label);
        setDotState(next.state);
      } catch (error) {
        console.error(error);
        setStatus("See hours below");
        setDotState(null);
      }
    };
    const frame = requestAnimationFrame(update);
    const timer = setInterval(update, 60_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);

  return (
    <header className={styles.hdr} role="banner">
      <div className={styles.main}>
        <div className={styles.wrap}>
          <Link className={styles.brand} href="/#home" aria-label="Big Shanty Antiques home">
            Big Shanty<span>Antiques</span>
          </Link>
          <button
            className={styles.burger}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i />
          </button>
          <ul className={`${styles.menu}${menuOpen ? ` ${styles.open}` : ""}`} id="site-menu">
            {links.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={label === currentPage ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.sub}>
        <div className={styles.wrap}>
          <div className={styles.live}>
            <span className={`${styles.dot}${dotState ? ` ${styles[dotState]}` : ""}`} />
            <strong>{status}</strong>
            <span className={styles.sep} aria-hidden="true" />
            <span className={styles.addr}>2932 Canton Road, Marietta, GA</span>
          </div>
          <div className={styles.acts}>
            <a className={styles.act} href="tel:7702312019">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
              <span className={styles.lbl}>Call</span>
            </a>
            <Link className={`${styles.act} ${styles.solid}`} href="/#contact" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
              </svg>
              <span className={styles.lbl}>Email</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
