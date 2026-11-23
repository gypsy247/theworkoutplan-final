import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { submitConsultation } from "@/lib/consultation-submit";
import { Button } from "@/components/ui/button";

const field = "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base outline-hidden transition focus:border-primary";

export function ConsultationForm({ onDone }: { onDone?: () => void } = {}) {
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    setSending(true);
    try {
      await submitConsultation({ fullName: get("name").slice(0, 100), email: get("email").slice(0, 255), phone: get("phone").slice(0, 40), sessionTier: "", goals: get("message").slice(0, 2000), smsConsent: data.get("sms") === "on", "bot-field": get("bot-field") });
      setFirstName(get("name").split(/\s+/)[0] ?? "there");
      formEl.reset();
      setSent(true);
      onDone?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setSending(false); }
  }

  if (sent) return <div role="status" aria-live="polite" className="py-8">
    <h3>Thank you, {firstName}.</h3>
    <p className="mt-3 text-muted-foreground">Coach Izzy will reach out shortly from <a href="tel:+19179922395" className="text-primary underline">(917) 992-2395</a>. We look forward to getting to know you.</p>
  </div>;

  return (
    <form onSubmit={submit} className="consultation-form space-y-3">
      <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">Full Name<input required name="name" maxLength={100} autoComplete="name" className={`${field} mt-1`} /></label>
        <label className="text-sm">Phone Number<input required type="tel" name="phone" maxLength={40} autoComplete="tel" className={`${field} mt-1`} /></label>
        <label className="text-sm">Email<input required type="email" name="email" maxLength={255} autoComplete="email" className={`${field} mt-1`} /></label>
      </div>
      <label className="block text-sm">Goals or questions (optional)<textarea name="message" rows={2} maxLength={2000} placeholder="e.g., strength, weight loss, pain relief, or a quick question" className={`${field} mt-1`} /></label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
        <input type="checkbox" name="sms" className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
        <span>
          Optional: I agree to appointment and promotional texts from The Workout Plant. Not required to submit or purchase. Frequency varies; msg & data rates may apply. STOP to opt out, HELP for help. See our{" "}
          <a href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</a> and{" "}
          <a href="/disclaimer" className="underline hover:text-foreground">SMS Terms</a>.
        </span>
      </label>
      <Button type="submit" disabled={sending} className="min-h-[52px] w-full whitespace-normal px-4 py-3 font-semibold">
        {sending ? "Sending…" : "Have Coach Izzy Reach Out"}
      </Button>
      <div className="consultation-reassurance space-y-1 text-center text-xs text-muted-foreground">
        <p>No contracts or commitment</p>
        <p>Private 1-on-1 studio at 139 Frost St</p>
        <p>Personal reply within a few hours</p>
      </div>
    </form>
  );
}
