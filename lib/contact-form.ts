export async function submitContactForm(form: HTMLFormElement, event: { preventDefault(): void }) {
  event.preventDefault();
  if (form.dataset.sent) return;
  const data = new FormData(form);
  const contact = String(data.get("contact") ?? "").trim();
  const email = String(data.get("email") ?? contact).trim();
  const error = form.querySelector<HTMLElement>("[role='alert']");
  const button = form.querySelector<HTMLButtonElement>("button[type='submit']");
  const show = (text: string) => {
    if (error) error.textContent = text;
  };

  if (!email) {
    show("Please add your email address so we can reply.");
    form.querySelector<HTMLInputElement>("[name='email'], [name='contact']")?.focus();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    show("Please enter a valid email address.");
    form.querySelector<HTMLInputElement>("[name='email'], [name='contact']")?.focus();
    return;
  }

  show("");
  if (button) button.disabled = true;
  try {
    const topic = String(data.get("topic") ?? "");
    const name = String(data.get("name") ?? "");
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...Object.fromEntries(data),
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
        subject: `Inquiry: ${topic} - ${name}`,
        from_name: "Big Shanty Auction Website",
        botcheck: data.get("website") ? "1" : "",
      }),
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error();
    show("Thanks! Your message was sent. We'll be in touch soon.");
    form.dataset.sent = "true";
    form.querySelectorAll<HTMLElement>("input, textarea, button").forEach((el) => {
      (el as HTMLInputElement).disabled = true;
    });
    return;
  } catch {
    show("Sorry, that didn't send. Please call us or try again.");
  }
  if (button) button.disabled = false;
}
