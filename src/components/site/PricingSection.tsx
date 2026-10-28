import { Check } from "lucide-react";
import { TIERS } from "./data";
import { useBooking } from "./BookingModal";

export function PricingSection() {
  const { open } = useBooking();
  return (
    <section id="pricing" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Transparent Pricing. Zero Contracts.</h2>
          <p className="mt-6 inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
            🔥 NEW CLIENT BOGO SALE: Buy 1 Get 1 Free on your intro session! Use code: BOGO
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TIERS.map((t) => (
            <article key={t.id} className={`card-surface relative flex flex-col p-6 ${t.featured ? "border-primary ring-1 ring-primary/50" : ""}`}>
              {t.badge && (
                <span className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold ${t.featured ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {t.badge}
                </span>
              )}
              <h3 className="text-lg font-extrabold tracking-tight">{t.name}</h3>
              <p className="mt-4">
                <span className="font-display text-4xl font-extrabold">${t.price}</span>
                <span className="text-muted-foreground"> / 1 hour</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t.description}</p>
              {t.schedule && (
                <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent">Current Schedule: {t.schedule}</p>
              )}
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {f}</li>
                ))}
              </ul>
              <button onClick={() => open(t.id)} className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${t.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:border-primary/50"}`}>
                Book With Code: BOGO
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
