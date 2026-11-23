import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLiveContent } from "@/lib/live-content";
import editorial from "@/data/editorial-content.json";

export function PricingSection() {
  const tiers = useLiveContent().site.pricingTiers;
  const TIERS = [...tiers.map((tier) => ({ ...tier, price: editorial.rates[tier.id as keyof typeof editorial.rates] ?? tier.price }))];
  return (
    <section id="pricing" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Simple, transparent pricing.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Private coaching, virtual sessions, 1:1 and virtual training. No contracts.</p>
        </div>
        <div className="mobile-stack-grid mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {TIERS.map((t) => (
            <article key={t.id} className="card-surface flex w-full min-w-0 flex-col p-5 md:p-6">
              <h3 className="text-lg font-extrabold tracking-tight">{t.name}</h3>
              <p className="mt-4">
                <span className="font-display text-4xl font-extrabold">${t.price}</span>
                <span className="text-muted-foreground"> / hour</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t.description}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {f}</li>
                ))}
              </ul>
              <Button asChild className="mt-6 min-h-11 w-full whitespace-normal">
                <Link to="/book-a-session">Book This Session</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
