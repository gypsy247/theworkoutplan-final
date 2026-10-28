import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { TIERS } from "./data";

const field = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden transition focus:border-primary";

export function ConsultationForm({ defaultTier, onDone }: { defaultTier?: string; onDone?: () => void }) {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
    toast.success("Request received! We'll reach out within 24 hours.");
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="name" placeholder="Full Name" className={field} />
        <input required type="email" name="email" placeholder="Email" className={field} />
        <input required type="tel" name="phone" placeholder="Phone" className={field} />
        <select name="tier" defaultValue={defaultTier ?? ""} className={field}>
          <option value="" disabled>Session Tier</option>
          {TIERS.map((t) => (
            <option key={t.id} value={t.id}>{t.name} — ${t.price}</option>
          ))}
        </select>
      </div>
      <input name="promo" defaultValue="BOGO" placeholder="Promo Code" className={`${field} font-bold uppercase text-primary`} />
      <textarea name="message" rows={3} placeholder="Tell us about your goals" className={field} />
      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
        <input type="checkbox" name="sms" className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
        <span>
          I agree to receive appointment and promotional text messages from The Workout Plant at the number provided. Consent is not a condition of purchase. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. See our{" "}
          <a href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</a> and{" "}
          <a href="/disclaimer" className="underline hover:text-foreground">SMS Terms</a>.
        </span>
      </label>
      <button type="submit" className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition hover:opacity-90">
        Request My Consultation
      </button>
      {sent && <p className="text-center text-sm text-primary">Thanks! Your request was received.</p>}
    </form>
  );
}
