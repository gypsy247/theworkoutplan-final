import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveContent } from "@/lib/live-content";
import { useBooking } from "./BookingModal";

export function PricingSection() {
  const { open } = useBooking();
  const TIERS = useLiveContent().site.pricingTiers;
  return (
    <section id="pricing" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Transparent Pricing. Zero Contracts.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Every session is private, one-on-one, and one full hour.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((t) => (
            <article key={t.id} className={`card-surface relative flex flex-col p-6 ${t.featured ? "border-primary ring-1 ring-primary/50" : ""}`}>
              {t.badge && (
                <span className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold ${t.featured ? "bg-primary text-primary-foreground" : "border border-primary/40 bg-secondary text-primary"}`}>
                  {t.badge}
                </span>
              )}
              <h3 className="text-lg font-extrabold tracking-tight">{t.name}</h3>
              <p className="mt-4">
                <span className="font-display text-4xl font-extrabold">${t.price}</span>
                <span className="text-muted-foreground"> / 1 hour</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t.description}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {f}</li>
                ))}
              </ul>
              {t.bookingUrl ? (
                <Button asChild variant={t.featured ? "default" : "outline"} className="mt-8 h-auto w-full px-4 py-3 text-sm font-bold">
                  <a href={t.bookingUrl} {...(t.bookingUrl.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>Book This Session</a>
                </Button>
              ) : (
                <Button onClick={() => open(t.id)} variant={t.featured ? "default" : "outline"} className="mt-8 h-auto w-full px-4 py-3 text-sm font-bold">
                  Book This Session
                </Button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
