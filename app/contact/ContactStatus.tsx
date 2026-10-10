"use client";

import { useEffect, useState } from "react";

import { getStoreStatus, parseStoreHours } from "@/lib/store-hours";

import styles from "./page.module.css";

export function ContactStatus() {
  const [status, setStatus] = useState("Checking hours");
  const [dotState, setDotState] = useState<"open" | "closed" | null>(null);

  useEffect(() => {
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
    <span className={styles.badge}>
      <span className={`${styles.dot}${dotState ? ` ${styles[dotState]}` : ""}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
