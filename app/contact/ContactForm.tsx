"use client";

import type { FormEvent } from "react";
import { submitContactForm } from "@/lib/contact-form";

import styles from "./page.module.css";

const topics = [
  { label: "Buying", value: "Buying" },
  { label: "Consigning", value: "Consigning" },
  { label: "Appraisal", value: "Appraisal" },
  { label: "Auction", value: "Auction" },
  { label: "Estate Sale", value: "Estate Sale" },
  { label: "Other", value: "Other" },
];

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    submitContactForm(event.currentTarget, event);
  }

  return (
    <form className={styles.form} data-contact-form onSubmit={handleSubmit}>
      <fieldset className={styles.tickets}>
        <legend className={styles.ticketLabel}>Admit one to a conversation about</legend>
        {topics.map((topic, index) => (
          <label className={styles.ticket} key={topic.value}>
            <input type="radio" name="topic" value={topic.value} defaultChecked={index === 0} />
            <span>{topic.label}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" autoComplete="name" required />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-phone">Phone (optional)</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          placeholder="Tell us a little about what you have or what you're hunting for."
        />
      </div>
      <p className={styles.formError} role="alert" aria-live="polite" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <button className={styles.submitButton} type="submit">
        Send Word
      </button>
    </form>
  );
}
