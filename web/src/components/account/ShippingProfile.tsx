"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

// Phone + shipping address live in Clerk unsafeMetadata (user-editable, no SMS
// verification). ponytail: switch phone to a verified Clerk phoneNumber if you
// ever need to SMS the customer.
interface Shipping {
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

const FIELDS: { key: keyof Shipping; label: string; placeholder?: string }[] = [
  { key: "phone", label: "Phone number", placeholder: "+91 98765 43210" },
  { key: "line1", label: "Address line 1" },
  { key: "line2", label: "Address line 2 (optional)" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "postalCode", label: "PIN / postal code" },
  { key: "country", label: "Country" },
];

export function ShippingProfile() {
  const { user, isLoaded } = useUser();
  const initial = (user?.unsafeMetadata?.shipping as Shipping) ?? {};
  const [form, setForm] = useState<Shipping>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!isLoaded || !user) return null;

  async function save() {
    setStatus("saving");
    try {
      await user!.update({ unsafeMetadata: { ...user!.unsafeMetadata, shipping: form } });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-gray-900">Shipping details</h1>
      <p className="mb-6 text-sm text-gray-500">
        Where we send your snacks. Email comes from your account.
      </p>

      <div className="space-y-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{f.label}</span>
            <input
              type={f.key === "phone" ? "tel" : "text"}
              value={form[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => {
                setForm((p) => ({ ...p, [f.key]: e.target.value }));
                setStatus("idle");
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-sm text-green-600">Saved ✓</span>}
        {status === "error" && <span className="text-sm text-red-600">Couldn’t save.</span>}
      </div>
    </div>
  );
}
