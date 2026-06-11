"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="animate-fade-up rounded-full border border-success/30 bg-success/10 px-5 py-3 font-body text-body-md text-success">
        You&apos;re in. Keep an eye on your inbox — spice incoming. 🌶️
      </p>
    );
  }

  return (
    <form className="relative flex w-full" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Email Address"
        className="w-full rounded-full border border-crimson-deep/20 bg-ink/[0.04] px-5 py-3 font-body text-body-md text-ink transition-all placeholder:text-ash/60 focus:border-crimson-deep focus:outline-none focus:ring-1 focus:ring-crimson-deep"
      />
      <button
        type="submit"
        className="btn-spice absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-crimson-deep px-5 font-body text-label-caps uppercase text-chalk hover:bg-crimson"
      >
        Subscribe
      </button>
    </form>
  );
}
