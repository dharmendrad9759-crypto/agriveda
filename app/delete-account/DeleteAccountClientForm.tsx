"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function DeleteAccountClientForm({
  supportEmail,
}: {
  supportEmail: string;
}) {
  const [identifier, setIdentifier] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) return;

    const subject = encodeURIComponent("Agriveda Account & Data Deletion Request");
    const body = encodeURIComponent(
      `Hello Agriveda Support Team,\n\nI request the permanent deletion of my Agriveda account and all associated personal data.\n\nRegistered Email / Phone: ${cleanId}\nReason for Deletion: ${reason.trim() || "Not specified"}\n\nPlease confirm once the data has been wiped from your servers.\n\nThank you.`
    );

    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4">
      {submitted ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold">
              अनुरोध ईमेल तैयार किया गया (Request Initiated)
            </span>
          </div>
          <p className="text-xs text-[var(--av-text-secondary)] leading-relaxed">
            आपके ईमेल क्लाइंट में अनुरोध खुल गया है। कृपया उसे <strong>{supportEmail}</strong> पर भेज दें। हमारी टीम पहचान सत्यापित करके 48 से 72 घंटों में आपके सर्वर डेटा को स्थायी रूप से हटा देगी।
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-[var(--av-accent)] underline pt-1 font-semibold"
          >
            फिर से फॉर्म देखें (Reset Form)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="acc-identifier"
              className="block text-xs font-semibold text-[var(--av-text-primary)]"
            >
              पंजीकृत Email या Phone नंबर <span className="text-red-500">*</span>
            </label>
            <input
              id="acc-identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="उदा. kisan@gmail.com या 9876543210"
              className="mt-1 w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-primary)] placeholder-[var(--av-text-muted)] focus:border-[var(--av-accent)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="acc-reason"
              className="block text-xs font-semibold text-[var(--av-text-primary)]"
            >
              हटाने का कारण (वैकल्पिक / Optional)
            </label>
            <input
              id="acc-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="जैसे: अब खेती नहीं करता / दूसरा खाता है"
              className="mt-1 w-full rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-primary)] placeholder-[var(--av-text-muted)] focus:border-[var(--av-accent)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--av-text-muted)]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>अनुरोध भेजने के बाद 48-72 कार्य घंटों में डेटा हटा दिया जाएगा।</span>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99]"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>हटाने का अनुरोध भेजें (Send Deletion Request)</span>
          </button>
        </form>
      )}
    </div>
  );
}
