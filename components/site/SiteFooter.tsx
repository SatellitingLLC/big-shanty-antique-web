import Link from "next/link";

import { SocialLinks } from "./SocialLinks";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.ft}>
          <div>
            <Link className={`${styles.brand} ${styles.fbrand}`} href="/#home">
              Big Shanty<span>Antiques</span>
            </Link>
          </div>
          <div>
            <h3>Partners</h3>
            <ul>
              <li>
                <a href="https://bigshantyauction.com" rel="noopener">
                  Big Shanty Auction
                </a>
              </li>
              <li>
                <a href="https://bigshantyestatesales.com" rel="noopener">
                  Big Shanty Estate Sales
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="/#home">Home</Link>
              </li>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#services">Services</Link>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Get in Touch</h3>
            <ul>
              <li>2932 Canton Road, Marietta, GA</li>
              <li>
                <a href="mailto:dwaynesantiques@gmail.com">dwaynesantiques@gmail.com</a>
              </li>
              <li>
                <a href="tel:7702312019">(770) 231-2019</a>
              </li>
            </ul>
            <SocialLinks />
          </div>
        </div>
        <div className={styles.fcopy}>
          <span>Copyright © 2026 All rights reserved.</span>
          <span>
            Designed by{" "}
            <a href="https://satelliting.space" rel="noopener">
              Satelliting LLC
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
