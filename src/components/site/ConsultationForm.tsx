import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useLiveContent } from "@/lib/live-content";
import { submitConsultation } from "@/lib/consultation-submit";

const field = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden transition focus:border-primary";

export function ConsultationForm({ defaultTier, onDone }: { defaultTier?: string | undefined; onDone?: () => void }) {
  const TIERS = useLiveContent().site.pricingTiers;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const tier = TIERS.find((t) => t.id === get("tier"));
    setSending(true);
    try {
      await submitConsultation({ fullName: get("name").slice(0, 100), email: get("email").slice(0, 255), phone: get("phone").slice(0, 40), sessionTier: tier ? `${tier.name} — $${tier.price}` : "", goals: get("message").slice(0, 2000), smsConsent: data.get("sms") === "on", "bot-field": get("bot-field") });
      formEl.reset();
      setSent(true);
      toast.success("Request received! We'll reach out soon.");
      onDone?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setSending(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="name" maxLength={100} placeholder="Full Name" className={field} />
        <input required type="email" name="email" placeholder="Email" className={field} />
        <input required type="tel" name="phone" placeholder="Phone" className={field} />
        <select name="tier" defaultValue={defaultTier ?? ""} className={field}>
          <option value="" disabled>Session Tier</option>
          {TIERS.map((t) => (
            <option key={t.id} value={t.id}>{t.name} — ${t.price}</option>
          ))}
        </select>
      </div>
      <textarea name="message" rows={3} maxLength={2000} placeholder="Tell us about your goals" className={field} />
      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
        <input type="checkbox" name="sms" className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
        <span>
          I agree to receive appointment and promotional text messages from The Workout Plant at the number provided. Consent is not a condition of purchase. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. See our{" "}
          <a href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</a> and{" "}
          <a href="/disclaimer" className="underline hover:text-foreground">SMS Terms</a>.
        </span>
      </label>
      <button type="submit" disabled={sending} className="disabled:opacity-60 w-full rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition hover:opacity-90">
        {sending ? "Sending…" : "Request My Consultation"}
      </button>
      {sent && <p className="text-center text-sm text-primary">Thanks! Your request was received.</p>}
    </form>
  );
}
