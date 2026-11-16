"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "done" | "error";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const website = String(data.get("website") ?? ""); // honeypot

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="animate-fade-up rounded-full border border-success/30 bg-success/10 px-5 py-3 font-body text-body-md text-success">
        You&apos;re in. Keep an eye on your inbox — spice incoming. 🌶️
      </p>
    );
  }

  const loading = status === "loading";

  return (
    <form className="relative flex w-full flex-col gap-3" onSubmit={handleSubmit}>
      <div className="relative flex w-full">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          placeholder="Email Address"
          className="w-full rounded-full border border-crimson-deep/20 bg-ink/[0.04] px-5 py-3 font-body text-body-md text-ink transition-all placeholder:text-ash/60 focus:border-crimson-deep focus:outline-none focus:ring-1 focus:ring-crimson-deep disabled:opacity-60"
        />
        {/* Honeypot — invisible to people, irresistible to bots. Must stay empty. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-spice absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-crimson-deep px-5 font-body text-label-caps uppercase text-chalk hover:bg-crimson disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Sending…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="animate-fade-up rounded-full border border-crimson/30 bg-crimson/10 px-5 py-3 font-body text-body-md text-crimson-deep"
        >
          Something went wrong, try again or DM us @ameei_snacks.
        </p>
      )}
    </form>
  );
}
